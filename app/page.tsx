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

function HomeContent() {
  const searchParams = useSearchParams();
  const viewParam = searchParams.get('view');
  const viewMode = (viewParam === 'compact' || viewParam === 'table' ? viewParam : 'cards') as 'cards' | 'compact' | 'table';
  const modeParam = searchParams.get('mode');
  const sellerParam = searchParams.get('seller');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const listings = useMemo(() => {
    let list = [...saleListings].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    if (modeParam === 'pre_resources') list = list.filter((l) => l.resourceStatus === 'pre_resources');
    if (modeParam === 'on_resources') list = list.filter((l) => l.resourceStatus === 'on_resources');
    if (sellerParam === 'owner') list = list.filter((l) => l.sellerType === 'owner');
    if (sellerParam === 'flip') list = list.filter((l) => l.sellerType === 'flip');
    if (activeFilters.includes('no_paint')) list = list.filter((l) => l.paintCount === 0);
    if (activeFilters.includes('owners_12')) list = list.filter((l) => l.owners <= 2);
    if (activeFilters.includes('pts_original')) list = list.filter((l) => l.ptsOriginal);
    if (activeFilters.includes('avtoteka_green')) list = list.filter((l) => l.avtotekaStatus === 'green');
    if (activeFilters.includes('no_taxi')) list = list.filter((l) => !l.taxi);
    if (activeFilters.includes('price_in_hand')) list = list.filter((l) => l.priceInHand != null);
    return list;
  }, [activeFilters, modeParam, sellerParam]);

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Быстрые фильтры */}
        <section className="mb-6">
          <QuickFilters active={activeFilters} onChange={setActiveFilters} />
        </section>

        {/* Заголовок ленты */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Свежие объявления
            <span className="text-muted-foreground font-normal ml-2">({listings.length})</span>
          </h2>
        </div>

        {/* Лента объявлений */}
        {viewMode === 'table' ? (
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
        <main className="max-w-7xl mx-auto px-4 py-6"><div className="animate-pulse h-64 bg-muted rounded-lg" /></main>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
