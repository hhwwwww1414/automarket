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

/** Основной богатый режим: крупное фото, заголовок, цены, мета, чипы, статус. */
export function ListingCardView({ listing, priority = false, className }: ListingCardViewProps) {
  const title = getListingTitle(listing);
  const badges = getListingBadges(listing);

  return (
    <Link
      href={`/listing/${listing.id}`}
      className={cn(
        'block rounded-xl border border-border bg-card/95 dark:bg-surface-elevated/90 backdrop-blur-sm overflow-hidden',
        'hover:border-teal-accent/50 hover:shadow-sm dark:hover:shadow-none dark:hover:bg-surface-elevated/92 transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className
      )}
    >
      <div className="flex min-h-0 items-stretch">
        <div className="relative w-[160px] sm:w-[200px] lg:w-[240px] flex-shrink-0">
          <ListingImageCarousel
            images={listing.images}
            alt={title}
            size="card"
            priority={priority}
            className="w-full h-full rounded-l-xl"
          />
          {listing.resourceStatus === 'on_resources' && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-teal-accent/95 text-[#09090B] text-[10px] font-semibold rounded-md shadow-sm z-10">
              На ресурсах
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col p-4 gap-3">
          <h3 className="font-display font-semibold text-foreground text-base leading-tight line-clamp-2">
            {title}
          </h3>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-display font-bold text-foreground text-lg tabular-nums">
              {formatPrice(listing.price)}
            </span>
            {listing.priceInHand && (
              <span className="text-sm text-muted-foreground tabular-nums">
                в руки {formatPrice(listing.priceInHand)}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-muted-foreground/70" />
              {listing.city}
            </span>
            <span className="tabular-nums">{formatMileage(listing.mileage)}</span>
            <span>{listing.engine} / {listing.transmission}</span>
            <span>{listing.owners} хоз</span>
            <span>{listing.paintCount === 0 ? 'без окрасов' : `${listing.paintCount} окр`}</span>
            {listing.avtotekaStatus === 'green' && (
              <span className="text-success flex items-center gap-0.5">
                <CheckCircle className="w-3.5 h-3.5" />
                автотека
              </span>
            )}
          </div>
          <ListingChipsBlock chips={badges} variant="card" maxCount={6} className="mt-auto pt-1" />
        </div>

        <div className="flex flex-col items-end justify-between p-4 pl-0 border-l border-border/50 shrink-0">
          <ListingStatusBlock listing={listing} layout="vertical" />
        </div>
      </div>
    </Link>
  );
}
