'use client';

import { MarketplaceHeader } from '@/components/marketplace/header';
import { CarbonFiberBackground } from '@/components/layout/carbon-fiber-background';
import { formatPrice } from '@/lib/marketplace-data';
import type { WantedListing } from '@/lib/types';
import { Plus, MapPin, MessageCircle, Calendar, Gauge, Users, Palette } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

function WantedCard({ listing }: { listing: WantedListing }) {
  const budgetLabel = listing.budgetMin
    ? `${formatPrice(listing.budgetMin)} — ${formatPrice(listing.budgetMax)}`
    : `до ${formatPrice(listing.budgetMax)}`;

  const date = new Date(listing.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });

  return (
    <Link
      href={`/wanted/${listing.id}`}
      className={cn(
        'card-interactive relative block overflow-hidden rounded-xl border',
        'border-border bg-card backdrop-blur-sm dark:bg-surface-elevated/90',
        'transition-[border-color,background-color] duration-200 hover:border-teal-accent/35 dark:hover:bg-surface-elevated',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background'
      )}
    >
      <span
        aria-hidden="true"
        className="card-press-carbon pointer-events-none absolute inset-0 z-[1] rounded-[inherit] opacity-0 transition-opacity duration-[180ms] ease-out"
      />
      <div className="relative z-[2] p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground">
              {listing.models.join(', ')}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
              {listing.author.verified && <span className="font-medium text-success">Верифицирован</span>}
              <span>На платформе с {listing.author.onPlatformSince}</span>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-base font-bold text-foreground tabular-nums">{budgetLabel}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{date}</div>
          </div>
        </div>

        <div className="mb-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-muted-foreground sm:grid-cols-4">
          {listing.yearFrom && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 shrink-0 opacity-60" />
              <span>Год от {listing.yearFrom}</span>
            </div>
          )}
          {listing.mileageMax && (
            <div className="flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5 shrink-0 opacity-60" />
              <span>до {listing.mileageMax.toLocaleString('ru-RU')} км</span>
            </div>
          )}
          {listing.ownersMax && (
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 shrink-0 opacity-60" />
              <span>до {listing.ownersMax} хоз</span>
            </div>
          )}
          {listing.region && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 opacity-60" />
              <span className="truncate">{listing.region}</span>
            </div>
          )}
          {listing.transmission && <span className="col-span-1">{listing.transmission}</span>}
          {listing.engine && <span className="col-span-1">Двиг: {listing.engine}</span>}
          <div className="flex items-center gap-1.5">
            <Palette className="h-3.5 w-3.5 shrink-0 opacity-60" />
            <span>{listing.paintAllowed ? 'Окрасы допустимы' : 'Без окрасов'}</span>
          </div>
        </div>

        {listing.restrictions && listing.restrictions.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {listing.restrictions.map((restriction) => (
              <span
                key={restriction}
                className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground dark:bg-surface-3"
              >
                {restriction}
              </span>
            ))}
          </div>
        )}

        {listing.comment && <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{listing.comment}</p>}

        <div className="flex items-center justify-between border-t border-border/60 pt-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{listing.author.name}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-medium text-teal-accent hover:underline">
            <MessageCircle className="h-3.5 w-3.5" />
            {listing.contact}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function WantedPageClient({ initialListings }: { initialListings: WantedListing[] }) {
  return (
    <div className="relative isolate min-h-screen bg-background">
      <CarbonFiberBackground className="inset-x-0 bottom-0 top-14" />
      <MarketplaceHeader />
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Запросы в подбор</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">{initialListings.length} активных запросов</p>
          </div>
          <Link
            href="/listing/new"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-dark px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-teal-accent dark:text-[#070809] sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Создать запрос
          </Link>
        </div>

        <div className="grid gap-3 lg:gap-4">
          {initialListings.map((listing) => (
            <WantedCard key={listing.id} listing={listing} />
          ))}
        </div>
      </main>
    </div>
  );
}
