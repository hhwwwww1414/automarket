import { notFound } from 'next/navigation';
import { MarketplaceHeader } from '@/components/marketplace/header';
import { VehicleGallery } from '@/components/listing/vehicle-gallery';
import { InteriorGallery } from '@/components/listing/interior-gallery';
import { DealBlock } from '@/components/listing/deal-block';
import { VinReport } from '@/components/listing/vin-report';
import { SimilarListings } from '@/components/listing/similar-listings';
import {
  saleListings,
  saleListingToVehicle,
} from '@/lib/marketplace-data';

interface ListingPageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params;
  const listing = saleListings.find((l) => l.id === id);

  if (!listing) {
    notFound();
  }

  const vehicle = saleListingToVehicle(listing);

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <nav
          className="text-sm text-muted-foreground mb-4 flex flex-wrap items-center gap-x-1 gap-y-1"
          aria-label="Хлебные крошки"
        >
          <a href="/" className="hover:text-foreground transition-colors">
            Главная
          </a>
          <span>/</span>
          <a href="/" className="hover:text-foreground transition-colors">
            В продаже
          </a>
          <span>/</span>
          <span className="text-foreground font-medium">
            {listing.make} {listing.model}
          </span>
        </nav>

        {/* Title + краткая строка */}
        <div className="mb-6">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {listing.make} {listing.model}, {listing.year}
            {listing.generation && ` • ${listing.generation}`}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {listing.city} • {listing.mileage.toLocaleString('ru-RU')} км • {listing.engine} • {listing.transmission} • {listing.owners} хоз
            {listing.paintCount === 0 ? ' • без окрасов' : ` • ${listing.paintCount} окр`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Левая часть: галерея + контент */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-card dark:bg-surface-elevated rounded-xl border border-border p-4 overflow-hidden">
              <VehicleGallery vehicle={vehicle} />
            </div>
            {listing.interiorImages && listing.interiorImages.length > 0 && (
              <div className="bg-card dark:bg-surface-elevated rounded-xl border border-border p-4 overflow-hidden">
                <InteriorGallery images={listing.interiorImages} />
              </div>
            )}

            {/* Секции контента */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <section className="bg-card dark:bg-surface-elevated rounded-xl border border-border p-4">
                <h3 className="font-semibold text-foreground text-sm mb-3">Кузов и окрасы</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Цвет: {listing.color}</p>
                  <p>
                    Окрасы: {listing.paintCount === 0 ? 'нет' : `${listing.paintCount} элемент(ов)`}
                  </p>
                  {listing.paintedElements && listing.paintedElements.length > 0 && (
                    <p>{listing.paintedElements.join(', ')}</p>
                  )}
                </div>
              </section>
              <section className="bg-card dark:bg-surface-elevated rounded-xl border border-border p-4">
                <h3 className="font-semibold text-foreground text-sm mb-3">Техника</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{listing.engine} / {listing.power} л.с.</p>
                  <p>{listing.transmission} / {listing.drive}</p>
                  <p>Пробег: {listing.mileage.toLocaleString('ru-RU')} км</p>
                  {listing.keysCount != null && <p>Ключей: {listing.keysCount}</p>}
                </div>
              </section>
            </div>

            <section className="bg-card dark:bg-surface-elevated rounded-xl border border-border p-4">
              <h3 className="font-semibold text-foreground text-sm mb-3">Документы и юр. часть</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>ПТС: {listing.ptsOriginal ? 'оригинал' : 'дубликат'}</p>
                <p>Владельцев: {listing.owners}</p>
                {listing.avtotekaStatus && (
                  <p>Автотека: {listing.avtotekaStatus === 'green' ? 'зелёная' : listing.avtotekaStatus}</p>
                )}
                {listing.taxi && <p>Такси: да</p>}
                {listing.carsharing && <p>Каршеринг: да</p>}
              </div>
            </section>

            <VinReport vehicle={vehicle} />

            <section className="bg-card dark:bg-surface-elevated rounded-xl border border-border p-4">
              <h3 className="font-semibold text-foreground text-sm mb-3">Комментарий продавца</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{listing.description}</p>
            </section>

            <section className="bg-card dark:bg-surface-elevated rounded-xl border border-border p-4">
              <h3 className="font-semibold text-foreground text-sm mb-3">Контакты</h3>
              <p className="text-sm text-muted-foreground">
                {listing.seller.name}
                {listing.seller.phone && ` • ${listing.seller.phone}`}
              </p>
            </section>
          </div>

          {/* Правая колонка: sticky Deal Block */}
          <div className="lg:col-span-4">
            <DealBlock listing={listing} />
          </div>
        </div>

        <SimilarListings currentListing={listing} />
      </main>

      <footer className="mt-12 pt-6 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span className="font-semibold text-sm">АвтоСделка</span>
          <span className="text-xs text-muted-foreground">© 2025</span>
        </div>
      </footer>
    </div>
  );
}
