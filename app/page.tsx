'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MarketplaceHeader } from '@/components/marketplace/header';
import { QuickFilters } from '@/components/marketplace/quick-filters';
import { ListingCardView } from '@/components/marketplace/listing-card-view';
import { ListingCompactRow } from '@/components/marketplace/listing-compact-row';
import { ListingsTable } from '@/components/marketplace/listings-table';
import { CarbonFiberBackground } from '@/components/layout/carbon-fiber-background';
import { saleListings } from '@/lib/marketplace-data';
import { SlidersHorizontal, ArrowDownUp } from 'lucide-react';
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
      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4 text-2xl">
        🔍
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">Ничего не найдено</h3>
      <p className="text-sm text-muted-foreground mb-5 max-w-xs">
        По выбранным фильтрам объявлений нет. Попробуйте сбросить один или несколько фильтров.
      </p>
      <button
        onClick={onReset}
        className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/40 transition-colors"
      >
        Сбросить фильтры
      </button>
    </div>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const viewParam = searchParams.get('view');
  const viewMode = (viewParam === 'compact' || viewParam === 'table' ? viewParam : 'cards') as 'cards' | 'compact' | 'table';
  const modeParam = searchParams.get('mode');
  const sellerParam = searchParams.get('seller');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [showSort, setShowSort] = useState(false);

  const listings = useMemo(() => {
    let list = [...saleListings];

    // Mode filters (from nav)
    if (modeParam === 'pre_resources') list = list.filter((l) => l.resourceStatus === 'pre_resources');
    if (modeParam === 'on_resources') list = list.filter((l) => l.resourceStatus === 'on_resources');
    if (sellerParam === 'owner') list = list.filter((l) => l.sellerType === 'owner');
    if (sellerParam === 'flip') list = list.filter((l) => l.sellerType === 'flip');

    // Quick filters
    if (activeFilters.includes('no_paint')) list = list.filter((l) => l.paintCount === 0);
    if (activeFilters.includes('owners_12')) list = list.filter((l) => l.owners <= 2);
    if (activeFilters.includes('pts_original')) list = list.filter((l) => l.ptsOriginal);
    if (activeFilters.includes('avtoteka_green')) list = list.filter((l) => l.avtotekaStatus === 'green');
    if (activeFilters.includes('no_taxi')) list = list.filter((l) => !l.taxi);
    if (activeFilters.includes('price_in_hand')) list = list.filter((l) => l.priceInHand != null);
    if (activeFilters.includes('no_invest')) list = list.filter((l) => !l.needsInvestment);

    // Sort
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
  }, [activeFilters, modeParam, sellerParam, sortKey]);

  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === sortKey)?.label;

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick filters */}
        <section className="mb-5">
          <QuickFilters active={activeFilters} onChange={setActiveFilters} />
        </section>

        {/* Feed header: count + sort */}
        <div className="flex items-center justify-between mb-4 gap-4">
          <h2 className="text-base font-semibold text-foreground">
            Объявления
            <span className="text-muted-foreground font-normal ml-2 tabular-nums">({listings.length})</span>
          </h2>
          <div className="relative">
            <button
              onClick={() => setShowSort((s) => !s)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors',
                showSort
                  ? 'bg-[var(--accent-bg-soft)] text-teal-accent border-[var(--accent-border-soft)]'
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/30 bg-card dark:bg-surface-elevated'
              )}
            >
              <ArrowDownUp className="w-3.5 h-3.5" />
              {activeSortLabel}
            </button>
            {showSort && (
              <div className="absolute right-0 top-full mt-1.5 z-20 w-44 rounded-xl border border-border bg-card dark:bg-surface-elevated shadow-lg overflow-hidden">
                {SORT_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => { setSortKey(o.value); setShowSort(false); }}
                    className={cn(
                      'w-full text-left px-3 py-2.5 text-sm transition-colors',
                      o.value === sortKey
                        ? 'bg-[var(--accent-bg-soft)] text-teal-accent font-medium'
                        : 'text-foreground hover:bg-muted/40'
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Feed */}
        {listings.length === 0 ? (
          <EmptyState onReset={() => setActiveFilters([])} />
        ) : viewMode === 'table' ? (
          <ListingsTable
            listings={listings}
            priorityIndices={new Set([0, 1, 2])}
            className="w-full"
          />
        ) : (
          <section className="space-y-2">
            {listings.map((listing, index) =>
              viewMode === 'cards' ? (
                <ListingCardView
                  key={listing.id}
                  listing={listing}
                  priority={index < 3}
                  className="w-full"
                />
              ) : (
                <ListingCompactRow
                  key={listing.id}
                  listing={listing}
                  priority={index < 3}
                  className="w-full"
                />
              )
            )}
          </section>
        )}

        <footer className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-dark dark:bg-teal-accent rounded-lg flex items-center justify-center">
                <span className="text-white dark:text-[#070809] font-bold text-xs">АС</span>
              </div>
              <span className="font-semibold text-foreground text-sm">АвтоСделка</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 АвтоСделка. Профессиональный авторынок.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}

function HomePageContent() {
  const searchParams = useSearchParams();
  const viewParam = searchParams.get('view');
  const viewMode = (viewParam === 'compact' || viewParam === 'table' ? viewParam : 'cards') as 'cards' | 'compact' | 'table';

  return (
    <div className="relative isolate min-h-screen bg-background">
      <CarbonFiberBackground viewMode={viewMode} className="top-14 inset-x-0 bottom-0" />
      <MarketplaceHeader />
      <div className="relative z-10">
        <HomeContent />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <MarketplaceHeader />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-2 mb-5">
            {[1,2,3,4,5,6,7].map(i => <div key={i} className="h-8 w-24 rounded-lg bg-muted animate-pulse" />)}
          </div>
          <div className="space-y-2">
            {[1,2,3,4].map(i => <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />)}
          </div>
        </main>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
