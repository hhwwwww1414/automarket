import { saleListings } from '@/lib/marketplace-data';
import { ListingCompactRow } from '@/components/marketplace/listing-compact-row';
import type { SaleListing } from '@/lib/types';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface SimilarListingsProps {
  currentListing: SaleListing;
}

export function SimilarListings({ currentListing }: SimilarListingsProps) {
  const similar = saleListings
    .filter((l) => l.id !== currentListing.id)
    .filter(
      (l) =>
        l.make === currentListing.make ||
        (l.price >= currentListing.price * 0.7 && l.price <= currentListing.price * 1.3)
    )
    .slice(0, 6);

  if (similar.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-foreground">Похожие</h2>
        <Link
          href="/"
          className="text-sm font-medium text-teal-accent hover:underline flex items-center gap-1"
        >
          Смотреть все
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="space-y-2">
        {similar.map((listing) => (
          <ListingCompactRow key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
}
