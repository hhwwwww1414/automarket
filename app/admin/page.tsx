import Link from 'next/link';
import { AdminEntityType, UserRole } from '@prisma/client';
import { MarketplaceHeader } from '@/components/marketplace/header';
import { AdminActivityFeed } from '@/components/admin/admin-activity-feed';
import { SaleListingAdminBoard } from '@/components/admin/sale-listing-admin-board';
import { UserRoleTable } from '@/components/admin/user-role-table';
import { WantedListingAdminBoard } from '@/components/admin/wanted-listing-admin-board';
import { Button } from '@/components/ui/button';
import { getRecentAdminActions } from '@/lib/server/admin-activity';
import { countUsersByRole, getAdminUsers, requireRole } from '@/lib/server/auth';
import { getModerationOverview } from '@/lib/server/moderation';
import { prisma } from '@/lib/server/prisma';

export const dynamic = 'force-dynamic';

function formatDate(value: Date) {
  return new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium' }).format(value);
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(value);
}

function getEntityHref(entityType: AdminEntityType, entityId: string) {
  if (entityType === AdminEntityType.SALE_LISTING) {
    return `/listing/${entityId}`;
  }

  if (entityType === AdminEntityType.WANTED_LISTING) {
    return `/wanted/${entityId}`;
  }

  return '/admin';
}

export default async function AdminPage() {
  const currentUser = await requireRole([UserRole.ADMIN, UserRole.MODERATOR], '/admin');
  const isAdmin = currentUser.role === UserRole.ADMIN;

  const [usersByRole, users, activeSessions, moderation, recentActions] = await Promise.all([
    countUsersByRole(),
    getAdminUsers(),
    prisma.session.count({
      where: {
        expiresAt: {
          gt: new Date(),
        },
      },
    }),
    getModerationOverview(),
    getRecentAdminActions(24),
  ]);

  const pendingTotal = moderation.saleCounts.PENDING + moderation.wantedCounts.PENDING;

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-teal-accent">
                {isAdmin ? 'Admin' : 'Moderation'}
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-foreground">
                {isAdmin ? 'Управление пользователями и объявлениями' : 'Панель модерации объявлений'}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Текущий оператор: {currentUser.name} • {currentUser.email}
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/account">Вернуться в кабинет</Link>
            </Button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
              <p className="text-sm text-muted-foreground">USER</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{usersByRole.users}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
              <p className="text-sm text-muted-foreground">MODERATOR</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{usersByRole.moderators}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
              <p className="text-sm text-muted-foreground">ADMIN</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{usersByRole.admins}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
              <p className="text-sm text-muted-foreground">Деактивированы</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{usersByRole.inactive}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
              <p className="text-sm text-muted-foreground">На модерации</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{pendingTotal}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
              <p className="text-sm text-muted-foreground">Активные сессии</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{activeSessions}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
              <p className="text-sm text-muted-foreground">Объявления о продаже</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{moderation.saleListings.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">Опубликовано: {moderation.saleCounts.PUBLISHED}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
              <p className="text-sm text-muted-foreground">Запросы в подбор</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{moderation.wantedListings.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">Опубликовано: {moderation.wantedCounts.PUBLISHED}</p>
            </div>
          </div>
        </section>

        <section className="mt-8 space-y-8">
          <SaleListingAdminBoard
            title="Модерация продаж"
            description="Inline-редактирование, публикация, архивирование и bulk-операции по объявлениям о продаже без изменения карточной структуры сайта."
            counts={moderation.saleCounts}
            items={moderation.saleListings.map((listing) => ({
              id: listing.id,
              make: listing.make,
              model: listing.model,
              year: listing.year,
              price: listing.price,
              city: listing.city,
              mileage: listing.mileage,
              description: listing.description,
              ownerLine: `${listing.seller.name}${listing.createdByUser?.email ? ` • ${listing.createdByUser.email}` : ''}`,
              detailHref: `/listing/${listing.id}`,
              status: listing.status,
              moderationNote: listing.moderationNote,
              createdAt: formatDate(listing.createdAt),
              statusUpdatedAt: formatDate(listing.statusUpdatedAt),
              coverUrl: listing.media.find((item) => item.kind === 'GALLERY')?.publicUrl,
            }))}
          />

          <WantedListingAdminBoard
            title="Модерация запросов в подбор"
            description="Запросы покупателей редактируются inline, проходят bulk-модерацию и могут удаляться из той же панели."
            counts={moderation.wantedCounts}
            items={moderation.wantedListings.map((listing) => ({
              id: listing.id,
              models: listing.models,
              budgetMin: listing.budgetMin,
              budgetMax: listing.budgetMax,
              region: listing.region,
              comment: listing.comment,
              ownerLine: `${listing.author.name}${listing.createdByUser?.email ? ` • ${listing.createdByUser.email}` : ''}`,
              detailHref: `/wanted/${listing.id}`,
              status: listing.status,
              moderationNote: listing.moderationNote,
              createdAt: formatDate(listing.createdAt),
              statusUpdatedAt: formatDate(listing.statusUpdatedAt),
            }))}
          />

          <AdminActivityFeed
            title="История действий"
            description="Журнал фиксирует изменения статусов, комментарии модерации, удаление объявлений и операции над аккаунтами."
            items={recentActions.map((action) => ({
              id: action.id,
              title: action.title,
              description: action.description,
              createdAt: formatDateTime(action.createdAt),
              actorLine: `Оператор: ${action.actorUser?.name ?? 'System'}${action.targetUser ? ` • Цель: ${action.targetUser.email}` : ''}`,
              href: getEntityHref(action.entityType, action.entityId),
            }))}
          />
        </section>

        {isAdmin ? (
          <section className="mt-8">
            <UserRoleTable
              currentUserId={currentUser.id}
              users={users.map((user) => ({
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                role: user.role,
                saleCount: user._count.saleListings,
                wantedCount: user._count.wantedListings,
                createdAt: formatDate(user.createdAt),
                isActive: user.isActive,
                sellerVerified: user.sellerProfile?.verified ?? false,
                activeSessionCount: user.activeSessionCount,
                lastSeenAt: user.lastSeenAt ? formatDateTime(user.lastSeenAt) : null,
              }))}
            />
          </section>
        ) : null}
      </main>
    </div>
  );
}
