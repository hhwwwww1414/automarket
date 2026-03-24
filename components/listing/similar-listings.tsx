import { ListingCompactRow } from '@/components/marketplace/listing-compact-row';
import type { SaleListing } from '@/lib/types';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface SimilarListingsProps {
  listings: SaleListing[];
}

export function SimilarListings({ listings }: SimilarListingsProps) {
  if (listings.length === 0) return null;

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
        {listings.map((listing) => (
          <ListingCompactRow key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
}
