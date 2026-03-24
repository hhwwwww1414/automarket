import {
  AvtotekaStatus as PrismaAvtotekaStatus,
  ListingMediaKind,
  ListingStatus,
  ProfileType,
  PtsType as PrismaPtsType,
  ResourceStatus as PrismaResourceStatus,
  SellerType as PrismaSellerType,
  UserRole,
  type ListingMedia,
  type Prisma,
} from '@prisma/client';
import { prisma } from './prisma';
import type { SaleListing, SellerProfile, WantedListing } from '@/lib/types';

type SaleListingRecord = Prisma.SaleListingGetPayload<{
  include: {
    seller: true;
    media: {
      orderBy: {
        sortOrder: 'asc';
      };
    };
  };
}>;

type WantedListingRecord = Prisma.WantedListingGetPayload<{
  include: {
    author: true;
  };
}>;

export interface UploadedListingMediaInput {
  kind: 'gallery' | 'interior' | 'video' | 'report';
  storageKey: string;
  publicUrl: string;
  originalName?: string;
  mimeType?: string;
  sizeBytes?: number;
  sortOrder: number;
}

export interface CreateSaleListingInput {
  createdByUserId?: string;
  initialStatus?: ListingStatus;
  sellerName: string;
  contact: string;
  make: string;
  model: string;
  generation?: string;
  year: number;
  vin?: string;
  city: string;
  price: number;
  priceInHand?: number;
  priceOnResources?: number;
  bodyType: string;
  engine: string;
  power: number;
  transmission: string;
  drive: string;
  mileage: number;
  steering: string;
  color: string;
  trim?: string;
  owners: number;
  registrations?: number;
  keysCount?: number;
  ptsType?: 'original' | 'duplicate' | 'epts';
  paintCount: number;
  paintedElements: string[];
  taxi: boolean;
  carsharing: boolean;
  avtotekaStatus?: 'green' | 'yellow' | 'red' | 'unknown';
  noRestrictions?: boolean;
  techOk?: boolean;
  glassOriginal?: boolean;
  noInvestment?: boolean;
  investmentNote?: string;
  trade: boolean;
  kickback: boolean;
  sellerType: 'owner' | 'flip' | 'broker' | 'commission';
  resourceStatus: 'not_listed' | 'pre_resources' | 'on_resources';
  description: string;
  videoUrlExternal?: string;
  media: UploadedListingMediaInput[];
}

export interface CreateWantedListingInput {
  createdByUserId?: string;
  initialStatus?: ListingStatus;
  authorName: string;
  contact: string;
  models: string[];
  budgetMin?: number;
  budgetMax: number;
  yearFrom?: number;
  mileageMax?: number;
  engine?: string;
  transmission?: string;
  drive?: string;
  ownersMax?: number;
  paintAllowed: boolean;
  restrictions: string[];
  region?: string;
  comment?: string;
}

const saleListingInclude = {
  seller: true,
  media: {
    orderBy: {
      sortOrder: 'asc',
    },
  },
} satisfies Prisma.SaleListingInclude;

const wantedListingInclude = {
  author: true,
} satisfies Prisma.WantedListingInclude;

const sellerTypeToPrisma: Record<SaleListing['sellerType'], PrismaSellerType> = {
  owner: PrismaSellerType.OWNER,
  flip: PrismaSellerType.FLIP,
  broker: PrismaSellerType.BROKER,
  commission: PrismaSellerType.COMMISSION,
};

const sellerTypeFromPrisma: Record<PrismaSellerType, SaleListing['sellerType']> = {
  OWNER: 'owner',
  FLIP: 'flip',
  BROKER: 'broker',
  COMMISSION: 'commission',
};

const resourceStatusToPrisma: Record<SaleListing['resourceStatus'], PrismaResourceStatus> = {
  not_listed: PrismaResourceStatus.NOT_LISTED,
  on_resources: PrismaResourceStatus.ON_RESOURCES,
  pre_resources: PrismaResourceStatus.PRE_RESOURCES,
};

const resourceStatusFromPrisma: Record<PrismaResourceStatus, SaleListing['resourceStatus']> = {
  NOT_LISTED: 'not_listed',
  ON_RESOURCES: 'on_resources',
  PRE_RESOURCES: 'pre_resources',
};

const ptsTypeToPrisma: Record<NonNullable<SaleListing['ptsType']>, PrismaPtsType> = {
  original: PrismaPtsType.ORIGINAL,
  duplicate: PrismaPtsType.DUPLICATE,
  epts: PrismaPtsType.EPTS,
};

const ptsTypeFromPrisma: Record<PrismaPtsType, NonNullable<SaleListing['ptsType']>> = {
  ORIGINAL: 'original',
  DUPLICATE: 'duplicate',
  EPTS: 'epts',
};

const avtotekaToPrisma: Record<NonNullable<SaleListing['avtotekaStatus']>, PrismaAvtotekaStatus> = {
  green: PrismaAvtotekaStatus.GREEN,
  yellow: PrismaAvtotekaStatus.YELLOW,
  red: PrismaAvtotekaStatus.RED,
  unknown: PrismaAvtotekaStatus.UNKNOWN,
};

const avtotekaFromPrisma: Record<PrismaAvtotekaStatus, NonNullable<SaleListing['avtotekaStatus']>> = {
  GREEN: 'green',
  YELLOW: 'yellow',
  RED: 'red',
  UNKNOWN: 'unknown',
};

interface ListingViewer {
  userId?: string;
  role?: UserRole;
}

function canViewListing(status: ListingStatus, ownerUserId: string | null, viewer?: ListingViewer): boolean {
  if (status === ListingStatus.PUBLISHED) {
    return true;
  }

  if (!viewer?.userId) {
    return false;
  }

  if (viewer.role === UserRole.ADMIN || viewer.role === UserRole.MODERATOR) {
    return true;
  }

  return ownerUserId === viewer.userId;
}

function toDateOnlyString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function mapSellerProfile(profile: {
  legacyId: string | null;
  name: string;
  profileType: ProfileType;
  verified: boolean;
  onPlatformSince: string;
  phone: string | null;
}): SellerProfile {
  return {
    id: profile.legacyId ?? profile.name,
    name: profile.name,
    type: profile.profileType === ProfileType.COMPANY ? 'company' : 'person',
    verified: profile.verified,
    onPlatformSince: profile.onPlatformSince,
    phone: profile.phone ?? undefined,
  };
}

function pickMediaUrls(media: ListingMedia[], kind: ListingMediaKind): string[] {
  return media.filter((item) => item.kind === kind).map((item) => item.publicUrl);
}

function pickSingleMediaUrl(media: ListingMedia[], kind: ListingMediaKind): string | undefined {
  return media.find((item) => item.kind === kind)?.publicUrl;
}

function mapSaleListing(record: SaleListingRecord): SaleListing {
  const images = pickMediaUrls(record.media, ListingMediaKind.GALLERY);
  const interiorImages = pickMediaUrls(record.media, ListingMediaKind.INTERIOR);
  const visibleDate = record.publishedAt ?? record.createdAt;

  return {
    id: record.id,
    type: 'sale',
    make: record.make,
    model: record.model,
    generation: record.generation ?? undefined,
    year: record.year,
    price: record.price,
    priceInHand: record.priceInHand ?? undefined,
    priceOnResources: record.priceOnResources ?? undefined,
    city: record.city,
    images,
    videoUrl: pickSingleMediaUrl(record.media, ListingMediaKind.VIDEO) ?? record.videoUrlExternal ?? undefined,
    interiorImages: interiorImages.length > 0 ? interiorImages : undefined,
    reportUrl: pickSingleMediaUrl(record.media, ListingMediaKind.REPORT) ?? record.reportUrlExternal ?? undefined,
    vin: record.vin ?? undefined,
    engine: record.engine,
    power: record.power,
    transmission: record.transmission,
    drive: record.drive,
    bodyType: record.bodyType,
    mileage: record.mileage,
    owners: record.owners,
    registrations: record.registrations ?? undefined,
    ptsType: record.ptsType ? ptsTypeFromPrisma[record.ptsType] : undefined,
    ptsOriginal: record.ptsOriginal,
    avtotekaStatus: record.avtotekaStatus ? avtotekaFromPrisma[record.avtotekaStatus] : undefined,
    paintedElements: record.paintedElements.length > 0 ? record.paintedElements : undefined,
    paintCount: record.paintCount,
    accident: record.accident ?? undefined,
    taxi: record.taxi ?? undefined,
    carsharing: record.carsharing ?? undefined,
    keysCount: record.keysCount ?? undefined,
    conditionNote: record.conditionNote ?? undefined,
    needsInvestment: record.needsInvestment ?? undefined,
    glassOriginal: record.glassOriginal ?? undefined,
    trade: record.trade,
    kickback: record.kickback ?? undefined,
    resourceStatus: resourceStatusFromPrisma[record.resourceStatus],
    sellerType: sellerTypeFromPrisma[record.sellerType],
    inspectionCity: record.inspectionCity ?? undefined,
    color: record.color,
    steering: record.steering,
    trim: record.trim ?? undefined,
    description: record.description,
    seller: mapSellerProfile(record.seller),
    status: record.status,
    moderationNote: record.moderationNote ?? undefined,
    publishedAt: record.publishedAt ? toDateOnlyString(record.publishedAt) : undefined,
    ownerUserId: record.createdByUserId ?? undefined,
    createdAt: toDateOnlyString(visibleDate),
    updatedAt: toDateOnlyString(record.updatedAt),
  };
}

function mapWantedListing(record: WantedListingRecord): WantedListing {
  const visibleDate = record.publishedAt ?? record.createdAt;

  return {
    id: record.id,
    type: 'wanted',
    models: record.models,
    budgetMin: record.budgetMin ?? undefined,
    budgetMax: record.budgetMax,
    yearFrom: record.yearFrom ?? undefined,
    mileageMax: record.mileageMax ?? undefined,
    engine: record.engine ?? undefined,
    transmission: record.transmission ?? undefined,
    drive: record.drive ?? undefined,
    ownersMax: record.ownersMax ?? undefined,
    paintAllowed: record.paintAllowed,
    restrictions: record.restrictions.length > 0 ? record.restrictions : undefined,
    region: record.region ?? undefined,
    comment: record.comment ?? undefined,
    contact: record.contact,
    author: mapSellerProfile(record.author),
    status: record.status,
    moderationNote: record.moderationNote ?? undefined,
    publishedAt: record.publishedAt ? toDateOnlyString(record.publishedAt) : undefined,
    ownerUserId: record.createdByUserId ?? undefined,
    createdAt: toDateOnlyString(visibleDate),
  };
}

async function findOrCreateSellerProfile(input: {
  userId?: string;
  legacyId?: string;
  name: string;
  type: 'person' | 'company';
  verified?: boolean;
  onPlatformSince?: string;
  phone?: string;
}) {
  if (input.userId) {
    const existingForUser = await prisma.sellerProfile.findUnique({
      where: {
        userId: input.userId,
      },
    });

    if (existingForUser) {
      return prisma.sellerProfile.update({
        where: {
          id: existingForUser.id,
        },
        data: {
          legacyId: existingForUser.legacyId ?? input.legacyId,
          name: input.name,
          profileType: input.type === 'company' ? ProfileType.COMPANY : ProfileType.PERSON,
          verified: input.verified ?? existingForUser.verified,
          onPlatformSince: existingForUser.onPlatformSince || input.onPlatformSince || String(new Date().getFullYear()),
          phone: input.phone,
        },
      });
    }
  }

  if (input.legacyId) {
    const existing = await prisma.sellerProfile.findUnique({
      where: {
        legacyId: input.legacyId,
      },
    });

    if (existing) {
      return existing;
    }
  }

  const existingByIdentity = await prisma.sellerProfile.findFirst({
    where: {
      name: input.name,
      phone: input.phone ?? null,
    },
  });

  if (existingByIdentity) {
    return existingByIdentity;
  }

  return prisma.sellerProfile.create({
    data: {
      userId: input.userId,
      legacyId: input.legacyId,
      name: input.name,
      profileType: input.type === 'company' ? ProfileType.COMPANY : ProfileType.PERSON,
      verified: input.verified ?? false,
      onPlatformSince: input.onPlatformSince ?? String(new Date().getFullYear()),
      phone: input.phone,
    },
  });
}

export async function getPublishedSaleListings(): Promise<SaleListing[]> {
  const records = await prisma.saleListing.findMany({
    where: {
      status: ListingStatus.PUBLISHED,
    },
    include: saleListingInclude,
    orderBy: [
      {
        publishedAt: 'desc',
      },
      {
        createdAt: 'desc',
      },
    ],
  });

  return records.map(mapSaleListing);
}

export async function getSaleListingById(id: string, viewer?: ListingViewer): Promise<SaleListing | null> {
  const record = await prisma.saleListing.findUnique({
    where: {
      id,
    },
    include: saleListingInclude,
  });

  if (!record || !canViewListing(record.status, record.createdByUserId, viewer)) {
    return null;
  }

  return record ? mapSaleListing(record) : null;
}

export async function getSimilarSaleListings(currentListing: SaleListing): Promise<SaleListing[]> {
  const records = await prisma.saleListing.findMany({
    where: {
      status: ListingStatus.PUBLISHED,
      id: {
        not: currentListing.id,
      },
      OR: [
        {
          make: currentListing.make,
        },
        {
          price: {
            gte: Math.floor(currentListing.price * 0.7),
            lte: Math.ceil(currentListing.price * 1.3),
          },
        },
      ],
    },
    include: saleListingInclude,
    orderBy: {
      createdAt: 'desc',
    },
    take: 6,
  });

  return records.map(mapSaleListing);
}

export async function getPublishedWantedListings(): Promise<WantedListing[]> {
  const records = await prisma.wantedListing.findMany({
    where: {
      status: ListingStatus.PUBLISHED,
    },
    include: wantedListingInclude,
    orderBy: [
      {
        publishedAt: 'desc',
      },
      {
        createdAt: 'desc',
      },
    ],
  });

  return records.map(mapWantedListing);
}

export async function getWantedListingById(id: string, viewer?: ListingViewer): Promise<WantedListing | null> {
  const record = await prisma.wantedListing.findUnique({
    where: {
      id,
    },
    include: wantedListingInclude,
  });

  if (!record || !canViewListing(record.status, record.createdByUserId, viewer)) {
    return null;
  }

  return record ? mapWantedListing(record) : null;
}

export async function createSaleListing(input: CreateSaleListingInput): Promise<SaleListing> {
  const status = input.initialStatus ?? ListingStatus.PENDING;
  const now = new Date();

  if (input.createdByUserId) {
    await prisma.user.update({
      where: {
        id: input.createdByUserId,
      },
      data: {
        name: input.sellerName,
        phone: input.contact,
      },
    });
  }

  const seller = await findOrCreateSellerProfile({
    userId: input.createdByUserId,
    name: input.sellerName,
    type: input.sellerType === 'commission' ? 'company' : 'person',
    phone: input.contact,
  });

  const created = await prisma.saleListing.create({
    data: {
      make: input.make,
      model: input.model,
      generation: input.generation,
      year: input.year,
      price: input.price,
      priceInHand: input.priceInHand,
      priceOnResources: input.priceOnResources,
      city: input.city,
      vin: input.vin,
      engine: input.engine,
      power: input.power,
      transmission: input.transmission,
      drive: input.drive,
      bodyType: input.bodyType,
      mileage: input.mileage,
      owners: input.owners,
      registrations: input.registrations,
      keysCount: input.keysCount,
      ptsType: input.ptsType ? ptsTypeToPrisma[input.ptsType] : undefined,
      ptsOriginal: input.ptsType ? input.ptsType === 'original' : true,
      avtotekaStatus: input.avtotekaStatus ? avtotekaToPrisma[input.avtotekaStatus] : undefined,
      paintedElements: input.paintedElements,
      paintCount: input.paintCount,
      taxi: input.taxi,
      carsharing: input.carsharing,
      conditionNote: input.investmentNote,
      needsInvestment: input.noInvestment === undefined ? undefined : !input.noInvestment,
      glassOriginal: input.glassOriginal,
      trade: input.trade,
      kickback: input.kickback,
      resourceStatus: resourceStatusToPrisma[input.resourceStatus],
      sellerType: sellerTypeToPrisma[input.sellerType],
      inspectionCity: input.city,
      color: input.color,
      steering: input.steering,
      trim: input.trim,
      description: input.description,
      videoUrlExternal: input.videoUrlExternal,
      sellerId: seller.id,
      createdByUserId: input.createdByUserId,
      status,
      moderationNote: undefined,
      publishedAt: status === ListingStatus.PUBLISHED ? now : null,
      statusUpdatedAt: now,
      createdAt: now,
      media: input.media.length
        ? {
            create: input.media.map((item) => ({
              kind:
                item.kind === 'gallery'
                  ? ListingMediaKind.GALLERY
                  : item.kind === 'interior'
                  ? ListingMediaKind.INTERIOR
                  : item.kind === 'video'
                  ? ListingMediaKind.VIDEO
                  : ListingMediaKind.REPORT,
              storageKey: item.storageKey,
              publicUrl: item.publicUrl,
              originalName: item.originalName,
              mimeType: item.mimeType,
              sizeBytes: item.sizeBytes,
              sortOrder: item.sortOrder,
            })),
          }
        : undefined,
    },
    include: saleListingInclude,
  });

  return mapSaleListing(created);
}

export async function createWantedListing(input: CreateWantedListingInput): Promise<WantedListing> {
  const status = input.initialStatus ?? ListingStatus.PENDING;
  const now = new Date();

  if (input.createdByUserId) {
    await prisma.user.update({
      where: {
        id: input.createdByUserId,
      },
      data: {
        name: input.authorName,
        phone: input.contact,
      },
    });
  }

  const author = await findOrCreateSellerProfile({
    userId: input.createdByUserId,
    name: input.authorName,
    type: 'person',
    phone: input.contact,
  });

  const created = await prisma.wantedListing.create({
    data: {
      models: input.models,
      budgetMin: input.budgetMin,
      budgetMax: input.budgetMax,
      yearFrom: input.yearFrom,
      mileageMax: input.mileageMax,
      engine: input.engine,
      transmission: input.transmission,
      drive: input.drive,
      ownersMax: input.ownersMax,
      paintAllowed: input.paintAllowed,
      restrictions: input.restrictions,
      region: input.region,
      comment: input.comment,
      contact: input.contact,
      authorId: author.id,
      createdByUserId: input.createdByUserId,
      status,
      moderationNote: undefined,
      publishedAt: status === ListingStatus.PUBLISHED ? now : null,
      statusUpdatedAt: now,
      createdAt: now,
    },
    include: wantedListingInclude,
  });

  return mapWantedListing(created);
}

export async function createSeedSellerProfile(input: {
  legacyId: string;
  name: string;
  type: 'person' | 'company';
  verified: boolean;
  onPlatformSince: string;
  phone?: string;
}) {
  return findOrCreateSellerProfile(input);
}
