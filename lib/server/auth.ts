import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import {
  AdminActionType,
  AdminEntityType,
  ProfileType,
  UserNotificationType,
  type Prisma,
  type SellerProfile,
  type Session,
  type User,
  UserRole,
} from '@prisma/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { type NextResponse } from 'next/server';
import { countUnreadUserNotifications, createAdminActionLog, createUserNotification } from './admin-activity';
import { serverEnv } from './env';
import { prisma } from './prisma';

const scrypt = promisify(scryptCallback);
const SESSION_TTL_MS = serverEnv.sessionTtlDays * 24 * 60 * 60 * 1000;
const PASSWORD_HASH_PREFIX = 'scrypt';
const PASSWORD_KEY_LENGTH = 64;

type SessionRecord = Prisma.SessionGetPayload<{
  include: {
    user: {
      include: {
        sellerProfile: true;
      };
    };
  };
}>;

type AdminUserRecord = Prisma.UserGetPayload<{
  include: {
    sellerProfile: true;
    sessions: {
      select: {
        id: true;
        lastSeenAt: true;
        expiresAt: true;
      };
    };
    _count: {
      select: {
        saleListings: true;
        wantedListings: true;
      };
    };
  };
}>;

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  sellerProfileId?: string;
}

export interface AuthSession {
  user: AuthUser;
  expiresAt: Date;
}

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UpdateAdminUserSettingsInput {
  actorUserId: string;
  userId: string;
  role?: UserRole;
  isActive?: boolean;
  sellerVerified?: boolean;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function mapAuthUser(user: User & { sellerProfile?: SellerProfile | null }): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone ?? undefined,
    role: user.role,
    isActive: user.isActive,
    sellerProfileId: user.sellerProfile?.id ?? undefined,
  };
}

function mapSession(record: SessionRecord): AuthSession {
  return {
    user: mapAuthUser(record.user),
    expiresAt: record.expiresAt,
  };
}

function buildPasswordHash(salt: Buffer, derivedKey: Buffer): string {
  return [PASSWORD_HASH_PREFIX, salt.toString('hex'), derivedKey.toString('hex')].join(':');
}

function parsePasswordHash(value: string) {
  const [prefix, saltHex, keyHex] = value.split(':');
  if (prefix !== PASSWORD_HASH_PREFIX || !saltHex || !keyHex) {
    return null;
  }

  return {
    salt: Buffer.from(saltHex, 'hex'),
    key: Buffer.from(keyHex, 'hex'),
  };
}

function getSessionExpiryDate(): Date {
  return new Date(Date.now() + SESSION_TTL_MS);
}

function getCurrentYearString(): string {
  return String(new Date().getFullYear());
}

async function claimOrphanedListings(userId: string) {
  await Promise.all([
    prisma.saleListing.updateMany({
      where: {
        createdByUserId: null,
      },
      data: {
        createdByUserId: userId,
      },
    }),
    prisma.wantedListing.updateMany({
      where: {
        createdByUserId: null,
      },
      data: {
        createdByUserId: userId,
      },
    }),
  ]);
}

function getSafeRedirectTarget(value: string | null | undefined, fallback = '/account'): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return fallback;
  }

  return value;
}

async function createSessionRecord(userId: string) {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = getSessionExpiryDate();

  await prisma.session.create({
    data: {
      tokenHash: hashSessionToken(token),
      userId,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

async function getSessionRecordFromToken(token: string): Promise<SessionRecord | null> {
  return prisma.session.findUnique({
    where: {
      tokenHash: hashSessionToken(token),
    },
    include: {
      user: {
        include: {
          sellerProfile: true,
        },
      },
    },
  });
}

async function syncAdminProfile(existingUser: User & { sellerProfile?: SellerProfile | null }) {
  const updates: Prisma.UserUpdateInput = {};

  if (existingUser.role !== UserRole.ADMIN) {
    updates.role = UserRole.ADMIN;
  }

  if (!existingUser.isActive) {
    updates.isActive = true;
    updates.deactivatedAt = null;
  }

  if (serverEnv.adminName && existingUser.name !== serverEnv.adminName) {
    updates.name = serverEnv.adminName;
  }

  if (serverEnv.adminPhone && existingUser.phone !== serverEnv.adminPhone) {
    updates.phone = serverEnv.adminPhone;
  }

  if (Object.keys(updates).length > 0) {
    await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: updates,
    });
  }

  if (!existingUser.sellerProfile) {
    await prisma.sellerProfile.create({
      data: {
        userId: existingUser.id,
        name: serverEnv.adminName,
        profileType: ProfileType.PERSON,
        verified: true,
        onPlatformSince: getCurrentYearString(),
        phone: serverEnv.adminPhone,
      },
    });
    return;
  }

  await prisma.sellerProfile.update({
    where: {
      id: existingUser.sellerProfile.id,
    },
    data: {
      name: serverEnv.adminName,
      phone: serverEnv.adminPhone,
      verified: true,
    },
  });
}

async function ensureActiveAdminRemains(currentUser: {
  id: string;
  role: UserRole;
  isActive: boolean;
}, nextRole: UserRole, nextIsActive: boolean) {
  const removingActiveAdmin =
    currentUser.role === UserRole.ADMIN &&
    currentUser.isActive &&
    (!nextIsActive || nextRole !== UserRole.ADMIN);

  if (!removingActiveAdmin) {
    return;
  }

  const activeAdminCount = await prisma.user.count({
    where: {
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  if (activeAdminCount <= 1) {
    throw new Error('At least one active administrator must remain in the system.');
  }
}

function mapAdminUserRecord(user: AdminUserRecord) {
  return {
    ...user,
    activeSessionCount: user.sessions.length,
    lastSeenAt: user.sessions[0]?.lastSeenAt ?? null,
  };
}

export async function hashPassword(password: string): Promise<string> {
  const normalized = password.trim();
  if (normalized.length < 7) {
    throw new Error('Password must contain at least 7 characters.');
  }

  const salt = randomBytes(16);
  const derivedKey = (await scrypt(normalized, salt, PASSWORD_KEY_LENGTH)) as Buffer;
  return buildPasswordHash(salt, derivedKey);
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const parsed = parsePasswordHash(storedHash);
  if (!parsed) {
    return false;
  }

  const derivedKey = (await scrypt(password.trim(), parsed.salt, parsed.key.length)) as Buffer;
  if (derivedKey.length !== parsed.key.length) {
    return false;
  }

  return timingSafeEqual(derivedKey, parsed.key);
}

export async function ensureAdminUser() {
  if (!serverEnv.adminEmail || !serverEnv.adminPassword) {
    return null;
  }

  const existing = await prisma.user.findUnique({
    where: {
      email: serverEnv.adminEmail,
    },
    include: {
      sellerProfile: true,
    },
  });

  if (existing) {
    await syncAdminProfile(existing);
    await claimOrphanedListings(existing.id);
    return existing;
  }

  const passwordHash = await hashPassword(serverEnv.adminPassword);

  const adminUser = await prisma.user.create({
    data: {
      email: serverEnv.adminEmail,
      passwordHash,
      name: serverEnv.adminName,
      phone: serverEnv.adminPhone,
      role: UserRole.ADMIN,
      isActive: true,
      sellerProfile: {
        create: {
          name: serverEnv.adminName,
          profileType: ProfileType.PERSON,
          verified: true,
          onPlatformSince: getCurrentYearString(),
          phone: serverEnv.adminPhone,
        },
      },
    },
  });

  await claimOrphanedListings(adminUser.id);
  return adminUser;
}

export async function registerUser(input: RegisterUserInput): Promise<AuthUser> {
  const name = input.name.trim();
  const email = normalizeEmail(input.email);
  const password = input.password.trim();
  const phone = input.phone?.trim() || undefined;

  if (!name || !email || !password) {
    throw new Error('Name, email and password are required.');
  }

  if (!email.includes('@')) {
    throw new Error('Email address is invalid.');
  }

  const existing = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existing) {
    throw new Error('A user with this email already exists.');
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      phone,
      role: UserRole.USER,
      isActive: true,
      sellerProfile: {
        create: {
          name,
          profileType: ProfileType.PERSON,
          verified: false,
          onPlatformSince: getCurrentYearString(),
          phone,
        },
      },
    },
    include: {
      sellerProfile: true,
    },
  });

  return mapAuthUser(user);
}

export async function authenticateUser(email: string, password: string): Promise<AuthUser> {
  const normalizedEmail = normalizeEmail(email);
  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
    include: {
      sellerProfile: true,
    },
  });

  if (!user) {
    throw new Error('Incorrect email or password.');
  }

  if (!user.isActive) {
    throw new Error('Account has been deactivated.');
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash);
  if (!isValidPassword) {
    throw new Error('Incorrect email or password.');
  }

  return mapAuthUser(user);
}

export async function attachSessionCookie(response: NextResponse, userId: string) {
  const { token, expiresAt } = await createSessionRecord(userId);
  response.cookies.set({
    name: serverEnv.sessionCookieName,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  });

  return expiresAt;
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: serverEnv.sessionCookieName,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}

export async function getCurrentSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(serverEnv.sessionCookieName)?.value;

  if (!token) {
    return null;
  }

  const session = await getSessionRecordFromToken(token);
  if (!session) {
    return null;
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    await prisma.session.delete({
      where: {
        id: session.id,
      },
    }).catch(() => undefined);
    return null;
  }

  if (!session.user.isActive) {
    await prisma.session.deleteMany({
      where: {
        userId: session.user.id,
      },
    }).catch(() => undefined);
    return null;
  }

  const staleThreshold = Date.now() - 1000 * 60 * 60 * 12;
  if (session.lastSeenAt.getTime() <= staleThreshold) {
    await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        lastSeenAt: new Date(),
      },
    }).catch(() => undefined);
  }

  return mapSession(session);
}

export async function requireAuthenticatedUser(nextPath?: string) {
  const session = await getCurrentSession();
  if (!session) {
    const next = getSafeRedirectTarget(nextPath, '/account');
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  return session.user;
}

export async function requireRole(roles: UserRole[], nextPath?: string) {
  const user = await requireAuthenticatedUser(nextPath);
  if (!roles.includes(user.role)) {
    redirect('/account');
  }

  return user;
}

export async function revokeCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(serverEnv.sessionCookieName)?.value;
  if (!token) {
    return;
  }

  await prisma.session.deleteMany({
    where: {
      tokenHash: hashSessionToken(token),
    },
  });
}

export async function getSessionUser(): Promise<AuthUser | null> {
  const session = await getCurrentSession();
  return session?.user ?? null;
}

export function resolveNextPath(value: string | null | undefined, fallback = '/account') {
  return getSafeRedirectTarget(value, fallback);
}

export async function countUsersByRole() {
  const [users, moderators, admins, inactive] = await Promise.all([
    prisma.user.count({
      where: {
        role: UserRole.USER,
      },
    }),
    prisma.user.count({
      where: {
        role: UserRole.MODERATOR,
      },
    }),
    prisma.user.count({
      where: {
        role: UserRole.ADMIN,
      },
    }),
    prisma.user.count({
      where: {
        isActive: false,
      },
    }),
  ]);

  return { users, moderators, admins, inactive };
}

export async function getAdminUsers() {
  const now = new Date();

  const users = await prisma.user.findMany({
    include: {
      sellerProfile: true,
      sessions: {
        where: {
          expiresAt: {
            gt: now,
          },
        },
        select: {
          id: true,
          lastSeenAt: true,
          expiresAt: true,
        },
        orderBy: {
          lastSeenAt: 'desc',
        },
      },
      _count: {
        select: {
          saleListings: true,
          wantedListings: true,
        },
      },
    },
    orderBy: [
      {
        role: 'desc',
      },
      {
        createdAt: 'desc',
      },
    ],
  });

  return users.map(mapAdminUserRecord);
}

export async function updateUserRole(userId: string, role: UserRole, actorUserId?: string) {
  if (!actorUserId) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role,
      },
      include: {
        sellerProfile: true,
      },
    });
  }

  return updateAdminUserSettings({
    actorUserId,
    userId,
    role,
  });
}

export async function updateAdminUserSettings(input: UpdateAdminUserSettingsInput) {
  const currentUser = await prisma.user.findUnique({
    where: {
      id: input.userId,
    },
    include: {
      sellerProfile: true,
      sessions: {
        where: {
          expiresAt: {
            gt: new Date(),
          },
        },
        select: {
          id: true,
        },
      },
    },
  });

  if (!currentUser) {
    throw new Error('User not found.');
  }

  const nextRole = input.role ?? currentUser.role;
  const nextIsActive = input.isActive ?? currentUser.isActive;
  const nextSellerVerified = input.sellerVerified ?? currentUser.sellerProfile?.verified ?? false;

  await ensureActiveAdminRemains(currentUser, nextRole, nextIsActive);

  const userData: Prisma.UserUpdateInput = {};
  if (nextRole !== currentUser.role) {
    userData.role = nextRole;
  }

  if (nextIsActive !== currentUser.isActive) {
    userData.isActive = nextIsActive;
    userData.deactivatedAt = nextIsActive ? null : new Date();
  }

  const updatedUser =
    Object.keys(userData).length > 0
      ? await prisma.user.update({
          where: {
            id: currentUser.id,
          },
          data: userData,
          include: {
            sellerProfile: true,
          },
        })
      : currentUser;

  let updatedSellerProfile = updatedUser.sellerProfile;
  if (input.sellerVerified !== undefined) {
    if (updatedUser.sellerProfile) {
      updatedSellerProfile = await prisma.sellerProfile.update({
        where: {
          id: updatedUser.sellerProfile.id,
        },
        data: {
          verified: nextSellerVerified,
        },
      });
    } else {
      updatedSellerProfile = await prisma.sellerProfile.create({
        data: {
          userId: updatedUser.id,
          name: updatedUser.name,
          profileType: ProfileType.PERSON,
          verified: nextSellerVerified,
          onPlatformSince: getCurrentYearString(),
          phone: updatedUser.phone,
        },
      });
    }
  }

  if (!nextIsActive) {
    await prisma.session.deleteMany({
      where: {
        userId: updatedUser.id,
      },
    });
  }

  if (nextRole !== currentUser.role) {
    await Promise.all([
      createAdminActionLog({
        actorUserId: input.actorUserId,
        targetUserId: updatedUser.id,
        entityType: AdminEntityType.USER,
        entityId: updatedUser.id,
        actionType: AdminActionType.USER_ROLE_CHANGED,
        title: 'Role updated',
        description: `${currentUser.role} -> ${nextRole}`,
      }),
      createUserNotification({
        userId: updatedUser.id,
        type: UserNotificationType.ACCOUNT_ROLE_CHANGED,
        entityType: AdminEntityType.USER,
        entityId: updatedUser.id,
        href: '/account',
        title: 'Role changed',
        message: `Your account role is now ${nextRole}.`,
      }),
    ]);
  }

  if (nextIsActive !== currentUser.isActive) {
    const actionType = nextIsActive
      ? AdminActionType.USER_ACCOUNT_ACTIVATED
      : AdminActionType.USER_ACCOUNT_DEACTIVATED;

    await Promise.all([
      createAdminActionLog({
        actorUserId: input.actorUserId,
        targetUserId: updatedUser.id,
        entityType: AdminEntityType.USER,
        entityId: updatedUser.id,
        actionType,
        title: nextIsActive ? 'Account activated' : 'Account deactivated',
        description: nextIsActive
          ? 'User account access has been restored.'
          : 'User account access has been disabled and active sessions were revoked.',
      }),
      createUserNotification({
        userId: updatedUser.id,
        type: UserNotificationType.ACCOUNT_STATUS_CHANGED,
        entityType: AdminEntityType.USER,
        entityId: updatedUser.id,
        href: '/account',
        title: nextIsActive ? 'Account reactivated' : 'Account deactivated',
        message: nextIsActive
          ? 'Your account has been reactivated. You can continue using the platform.'
          : 'Your account has been deactivated by the administration.',
      }),
    ]);
  }

  if ((updatedSellerProfile?.verified ?? false) !== (currentUser.sellerProfile?.verified ?? false)) {
    const verified = updatedSellerProfile?.verified ?? false;

    await Promise.all([
      createAdminActionLog({
        actorUserId: input.actorUserId,
        targetUserId: updatedUser.id,
        entityType: AdminEntityType.USER,
        entityId: updatedUser.id,
        actionType: verified ? AdminActionType.SELLER_PROFILE_VERIFIED : AdminActionType.SELLER_PROFILE_UNVERIFIED,
        title: verified ? 'Seller verified' : 'Seller verification removed',
        description: verified
          ? 'Seller profile is now marked as verified.'
          : 'Seller profile verification has been removed.',
      }),
      createUserNotification({
        userId: updatedUser.id,
        type: UserNotificationType.SELLER_PROFILE_CHANGED,
        entityType: AdminEntityType.USER,
        entityId: updatedUser.id,
        href: '/account',
        title: verified ? 'Seller profile verified' : 'Seller verification removed',
        message: verified
          ? 'Your seller profile is now verified.'
          : 'The verified mark has been removed from your seller profile.',
      }),
    ]);
  }

  return {
    ...updatedUser,
    sellerProfile: updatedSellerProfile,
  };
}

export async function revokeUserSessionsByAdmin(actorUserId: string, userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error('User not found.');
  }

  const result = await prisma.session.deleteMany({
    where: {
      userId,
    },
  });

  await Promise.all([
    createAdminActionLog({
      actorUserId,
      targetUserId: userId,
      entityType: AdminEntityType.USER,
      entityId: userId,
      actionType: AdminActionType.USER_SESSIONS_REVOKED,
      title: 'Sessions revoked',
      description: `Revoked ${result.count} active sessions.`,
    }),
    createUserNotification({
      userId,
      type: UserNotificationType.ACCOUNT_STATUS_CHANGED,
      entityType: AdminEntityType.USER,
      entityId: userId,
      href: '/login',
      title: 'Sessions revoked',
      message: 'All active sessions for your account have been revoked. Please sign in again.',
    }),
  ]);

  return result;
}

export async function getAccountOverview(userId: string) {
  const [user, unreadNotifications] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        sellerProfile: true,
        notifications: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 12,
        },
        pushSubscriptions: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        saleListings: {
          include: {
            media: {
              orderBy: {
                sortOrder: 'asc',
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        wantedListings: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    }),
    countUnreadUserNotifications(userId),
  ]);

  if (!user) {
    return null;
  }

  return {
    ...user,
    unreadNotifications,
  };
}

export type AuthSessionRecord = Session;
