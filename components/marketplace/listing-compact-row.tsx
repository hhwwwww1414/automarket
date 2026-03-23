'use client';

import Link from 'next/link';
import type { SaleListing } from '@/lib/types';
import { formatPrice, formatMileage } from '@/lib/marketplace-data';
import { getListingTitle, getListingBadges } from '@/lib/listing-utils';
import { ListingImageCarousel } from './listing-image-carousel';
import { ListingStatusBlock } from './listing-status-block';
import { ListingChipsBlock } from './listing-chips-block';
import { cn } from '@/lib/utils';

interface ListingCompactRowProps {
  listing: SaleListing;
  priority?: boolean;
  className?: string;
}

/**
 * Compact list-row mode.
 * Carbon press overlay is lighter here (0.06 / 0.10) vs cards mode,
 * since the row is dense and readability takes priority.
 */
export function ListingCompactRow({ listing, priority = false, className }: ListingCompactRowProps) {
  const title = getListingTitle(listing);
  const badges = getListingBadges(listing);

  return (
    <Link
      href={`/listing/${listing.id}`}
      className={cn(
        // Structure
        'group relative block rounded-xl border overflow-hidden',
        // Default
        'border-border bg-card/95 dark:bg-surface-elevated/90 backdrop-blur-sm',
        // Hover
        'hover:border-teal-accent/35 dark:hover:bg-surface-elevated transition-[border-color,background-color] duration-200',
        // Focus-visible
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className
      )}
    >
      {/* Carbon press overlay — lighter than card mode */}
      <span
        aria-hidden="true"
        className={cn(
          'card-press-carbon',
          'absolute inset-0 rounded-[inherit] pointer-events-none z-[1]',
          'opacity-0 group-active:opacity-[0.06] dark:group-active:opacity-[0.10]',
          'transition-opacity duration-75 ease-in group-active:duration-[40ms]',
        )}
      />

      {/* Content row — z-[2] keeps it above the overlay */}
      <div className="relative z-[2] flex items-stretch gap-3 sm:gap-4 p-3">
        {/* Left: photo */}
        <div className="w-24 sm:w-28 h-[64px] sm:h-[72px] rounded-lg overflow-hidden flex-shrink-0">
          <ListingImageCarousel
            images={listing.images}
            alt={title}
            size="compact"
            priority={priority}
            className="w-full h-full rounded-lg"
          />
        </div>

        {/* Center: title, price, meta */}
        <div className="min-w-0 flex-1 flex flex-col justify-center gap-0.5">
          <h3 className="font-display font-semibold text-foreground text-sm truncate">{title}</h3>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
            <span className="font-medium text-foreground/90 tabular-nums">{formatPrice(listing.price)}</span>
            {listing.priceInHand && (
              <span className="tabular-nums">в руки {formatPrice(listing.priceInHand)}</span>
            )}
            <span>{listing.city}</span>
            <span className="tabular-nums">{formatMileage(listing.mileage)}</span>
            <span>{listing.engine}</span>
            <span>{listing.owners} хоз</span>
            <span className={listing.paintCount === 0 ? 'text-success' : 'text-warning'}>
              {listing.paintCount === 0 ? 'без окр.' : `${listing.paintCount} окр.`}
            </span>
          </div>
        </div>

        {/* Right: chips + status */}
        <div className="w-[120px] sm:w-[140px] flex-shrink-0 flex flex-col justify-center gap-2 items-end text-right">
          <ListingChipsBlock chips={badges} variant="compact" maxCount={4} className="justify-end" />
          <ListingStatusBlock listing={listing} layout="vertical" size="sm" />
        </div>
      </div>
    </Link>
  );
}
