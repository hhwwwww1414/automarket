'use client';

import Link from 'next/link';
import { MapPin, CheckCircle } from 'lucide-react';
import type { SaleListing } from '@/lib/types';
import { formatPrice, formatMileage } from '@/lib/marketplace-data';
import { getListingTitle, getListingBadges } from '@/lib/listing-utils';
import { ListingImageCarousel } from './listing-image-carousel';
import { ListingStatusBlock } from './listing-status-block';
import { ListingChipsBlock } from './listing-chips-block';
import { cn } from '@/lib/utils';

interface ListingCardViewProps {
  listing: SaleListing;
  priority?: boolean;
  className?: string;
}

/**
 * Cards mode — главный богатый режим.
 * States:
 *   default  → border-border, bg-card/surface-elevated
 *   hover    → border-teal-accent/35, subtle bg lift
 *   active   → card-press-carbon overlay appears at low opacity
 *   focus-kbhd → teal ring (no carbon, accessibility)
 */
export function ListingCardView({ listing, priority = false, className }: ListingCardViewProps) {
  const title = getListingTitle(listing);
  const badges = getListingBadges(listing);

  return (
    <Link
      href={`/listing/${listing.id}`}
      className={cn(
        // Structure — card-interactive triggers the CSS :active rule for the carbon overlay
        'card-interactive relative block rounded-xl border overflow-hidden',
        // Default
        'border-border bg-card/95 dark:bg-surface-elevated/90 backdrop-blur-sm',
        // Hover — border brightens, bg slightly elevated
        'hover:border-teal-accent/35 dark:hover:bg-surface-elevated transition-[border-color,background-color] duration-200',
        // Focus-visible — keyboard ring only, no carbon
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className
      )}
    >
      {/* ── Carbon press overlay ──────────────────────────────────────────
          z-[1]: above card bg, below content z-[2].
          opacity: 0 default → .card-interactive:active rule bumps it up.
          180ms ease-out fade so the pattern dissolves smoothly on release.
       ────────────────────────────────────────────────────────────────── */}
      <span
        aria-hidden="true"
        className="card-press-carbon absolute inset-0 rounded-[inherit] pointer-events-none z-[1] opacity-0 transition-opacity duration-[180ms] ease-out"
      />

      {/* Content — sits on z-[2], always above the overlay */}
      <div className="relative z-[2] flex flex-col sm:flex-row min-h-0 sm:items-stretch">
        {/* Photo col */}
        <div className="relative w-full sm:w-[200px] lg:w-[240px] sm:flex-shrink-0 aspect-[16/9] sm:aspect-auto">
          <ListingImageCarousel
            images={listing.images}
            alt={title}
            size="card"
            priority={priority}
            className="w-full h-full rounded-t-xl sm:rounded-t-none sm:rounded-l-xl"
          />
          {listing.resourceStatus === 'on_resources' && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-teal-accent/95 text-[#09090B] text-[10px] font-semibold rounded-md shadow-sm z-10">
              На ресурсах
            </div>
          )}
          {listing.resourceStatus === 'pre_resources' && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-warning/90 text-[#09090B] text-[10px] font-semibold rounded-md shadow-sm z-10">
              До ресурсов
            </div>
          )}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0 flex flex-col p-3 sm:p-4 gap-2 sm:gap-2.5">
          <h3 className="font-display font-semibold text-foreground text-base leading-tight line-clamp-2">
            {title}
          </h3>

          {/* Price row */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-display font-bold text-foreground text-lg tabular-nums">
              {formatPrice(listing.price)}
            </span>
            {listing.priceInHand && (
              <span className="text-sm text-muted-foreground tabular-nums">
                в руки {formatPrice(listing.priceInHand)}
              </span>
            )}
            {listing.trade && (
              <span className="text-[11px] font-medium text-teal-accent/80 border border-teal-accent/25 rounded px-1.5 py-0.5">
                торг
              </span>
            )}
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 shrink-0 opacity-60" />
              {listing.city}
            </span>
            <span className="tabular-nums">{formatMileage(listing.mileage)}</span>
            <span>{listing.engine} / {listing.transmission}</span>
            <span>{listing.owners} хоз</span>
            <span className={listing.paintCount === 0 ? 'text-success' : 'text-warning'}>
              {listing.paintCount === 0 ? 'без окрасов' : `${listing.paintCount} окр`}
            </span>
            {listing.avtotekaStatus === 'green' && (
              <span className="text-success flex items-center gap-0.5">
                <CheckCircle className="w-3.5 h-3.5" />
                автотека
              </span>
            )}
          </div>

          {/* Chips */}
          <ListingChipsBlock chips={badges} variant="card" maxCount={6} className="mt-auto pt-0.5" />

          {/* Status — mobile only, shown inline at the bottom of content */}
          <div className="sm:hidden pt-2 border-t border-border/40">
            <ListingStatusBlock listing={listing} layout="horizontal" size="sm" />
          </div>
        </div>

        {/* Status col — desktop only */}
        <div className="hidden sm:flex flex-col items-end justify-between p-4 pl-0 border-l border-border/40 shrink-0 min-w-[88px]">
          <ListingStatusBlock listing={listing} layout="vertical" />
        </div>
      </div>
    </Link>
  );
}
