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

/** Плотный list-row режим: фото | центр (заголовок, цены, мета) | правая колонка (чипы, статус). */
export function ListingCompactRow({ listing, priority = false, className }: ListingCompactRowProps) {
  const title = getListingTitle(listing);
  const badges = getListingBadges(listing);

  return (
    <Link
      href={`/listing/${listing.id}`}
      className={cn(
        'flex items-stretch gap-3 sm:gap-4 p-3 rounded-xl border border-border bg-card/95 dark:bg-surface-elevated/90 backdrop-blur-sm',
        'hover:border-teal-accent/50 hover:bg-muted/30 dark:hover:bg-white/[0.03] transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className
      )}
    >
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
        </div>
      </div>

      {/* Right: chips + status (vertical, fixed width) */}
      <div className="w-[120px] sm:w-[140px] flex-shrink-0 flex flex-col justify-center gap-2 items-end text-right">
        <ListingChipsBlock chips={badges} variant="compact" maxCount={4} className="justify-end" />
        <ListingStatusBlock listing={listing} layout="vertical" size="sm" />
      </div>
    </Link>
  );
}
