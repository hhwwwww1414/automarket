'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MarketplaceHeader } from '@/components/marketplace/header';
import { QuickFilters } from '@/components/marketplace/quick-filters';
import { ListingCardView } from '@/components/marketplace/listing-card-view';
import { ListingCompactRow } from '@/components/marketplace/listing-compact-row';
import { ListingsTable } from '@/components/marketplace/listings-table';
import { CarbonFiberBackground } from '@/components/layout/carbon-fiber-background';
import type { SaleListing } from '@/lib/types';
import { ArrowDownUp } from 'lucide-react';
import { cn } from '@/lib/utils';

type SortKey = 'date' | 'price_asc' | 'price_desc' | 'mileage';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'date', label: 'Сначала новые' },
  { value: 'price_asc', label: 'Дешевле' },
  { value: 'price_desc', label: 'Дороже' },
  { value: 'mileage', label: 'Меньше пробег' },
];

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-lg font-semibold">
        0
      </div>
      <h3 className="mb-1 text-base font-semibold text-foreground">Ничего не найдено</h3>
      <p className="mb-5 max-w-xs text-sm text-muted-foreground">
        По выбранным фильтрам объявлений нет. Попробуйте сбросить один или несколько фильтров.
      </p>
      <button
        onClick={onReset}
        className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/40"
      >
        Сбросить фильтры
      </button>
    </div>
  );
}

function HomeContent({ initialListings }: { initialListings: SaleListing[] }) {
  const searchParams = useSearchParams();
  const viewParam = searchParams.get('view');
  const viewMode = (viewParam === 'compact' || viewParam === 'table' ? viewParam : 'cards') as
    | 'cards'
    | 'compact'
    | 'table';
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [showSort, setShowSort] = useState(false);

  const listings = useMemo(() => {
    let list = [...initialListings];

    if (activeFilters.includes('pre_resources')) list = list.filter((listing) => listing.resourceStatus === 'pre_resources');
    if (activeFilters.includes('on_resources')) list = list.filter((listing) => listing.resourceStatus === 'on_resources');
    if (activeFilters.includes('owner')) list = list.filter((listing) => listing.sellerType === 'owner');
    if (activeFilters.includes('flip')) list = list.filter((listing) => listing.sellerType === 'flip');

    if (activeFilters.includes('no_paint')) list = list.filter((listing) => listing.paintCount === 0);
    if (activeFilters.includes('owners_12')) list = list.filter((listing) => listing.owners <= 2);
    if (activeFilters.includes('pts_original')) list = list.filter((listing) => listing.ptsOriginal);
    if (activeFilters.includes('avtoteka_green')) list = list.filter((listing) => listing.avtotekaStatus === 'green');
    if (activeFilters.includes('no_taxi')) list = list.filter((listing) => !listing.taxi);
    if (activeFilters.includes('price_in_hand')) list = list.filter((listing) => listing.priceInHand != null);
    if (activeFilters.includes('no_invest')) list = list.filter((listing) => !listing.needsInvestment);

    switch (sortKey) {
      case 'date':
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price_asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'mileage':
        list.sort((a, b) => a.mileage - b.mileage);
        break;
    }

    return list;
  }, [activeFilters, initialListings, sortKey]);

  const activeSortLabel = SORT_OPTIONS.find((option) => option.value === sortKey)?.label;

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="mb-5">
        <QuickFilters active={activeFilters} onChange={setActiveFilters} />
      </section>

      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-foreground">
          Объявления
          <span className="ml-2 font-normal tabular-nums text-muted-foreground">({listings.length})</span>
        </h2>
        <div className="relative">
          <button
            onClick={() => setShowSort((value) => !value)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors',
              showSort
                ? 'border-[var(--accent-border-soft)] bg-[var(--accent-bg-soft)] text-teal-accent'
                : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground dark:bg-surface-elevated'
            )}
          >
            <ArrowDownUp className="h-3.5 w-3.5" />
            {activeSortLabel}
          </button>
          {showSort && (
            <div className="absolute right-0 top-full z-20 mt-1.5 w-44 overflow-hidden rounded-xl border border-border bg-card shadow-lg dark:bg-surface-elevated">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortKey(option.value);
                    setShowSort(false);
                  }}
                  className={cn(
                    'w-full px-3 py-2.5 text-left text-sm transition-colors',
                    option.value === sortKey
                      ? 'bg-[var(--accent-bg-soft)] font-medium text-teal-accent'
                      : 'text-foreground hover:bg-muted/40'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {listings.length === 0 ? (
        <EmptyState onReset={() => setActiveFilters([])} />
      ) : viewMode === 'table' ? (
        <ListingsTable listings={listings} priorityIndices={new Set([0, 1, 2])} className="w-full" />
      ) : (
        <section className="space-y-2">
          {listings.map((listing, index) =>
            viewMode === 'cards' ? (
              <ListingCardView key={listing.id} listing={listing} priority={index < 3} className="w-full" />
            ) : (
              <ListingCompactRow key={listing.id} listing={listing} priority={index < 3} className="w-full" />
            )
          )}
        </section>
      )}

      <footer className="mt-12 border-t border-border pt-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-dark dark:bg-teal-accent">
              <span className="text-xs font-bold text-white dark:text-[#070809]">V2</span>
            </div>
            <span className="text-sm font-semibold text-foreground">vin2win</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 vin2win. Профессиональный авторынок.</p>
        </div>
      </footer>
    </main>
  );
}

function HomePageContent({ initialListings }: { initialListings: SaleListing[] }) {
  const searchParams = useSearchParams();
  const viewParam = searchParams.get('view');
  const viewMode = (viewParam === 'compact' || viewParam === 'table' ? viewParam : 'cards') as
    | 'cards'
    | 'compact'
    | 'table';

  return (
    <div className="relative isolate min-h-screen bg-background">
      <CarbonFiberBackground viewMode={viewMode} className="inset-x-0 bottom-0 top-14" />
      <MarketplaceHeader />
      <div className="relative z-10">
        <HomeContent initialListings={initialListings} />
      </div>
    </div>
  );
}

export function HomePageClient({ initialListings }: { initialListings: SaleListing[] }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <MarketplaceHeader />
          <main className="mx-auto max-w-7xl px-4 py-6">
            <div className="mb-5 flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                <div key={item} className="h-8 w-24 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-32 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          </main>
        </div>
      }
    >
      <HomePageContent initialListings={initialListings} />
    </Suspense>
  );
}
