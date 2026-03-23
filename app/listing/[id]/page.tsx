import { notFound } from 'next/navigation';
import Link from 'next/link';
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
import {
  Palette,
  Wrench,
  FileText,
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Phone,
  Key,
  Gauge,
  GlassWater,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ListingPageProps {
  params: Promise<{ id: string }>;
}

function SectionCard({ title, icon: Icon, children, className }: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('bg-card dark:bg-surface-elevated rounded-xl border border-border p-4', className)}>
      <h3 className="flex items-center gap-2 font-semibold text-foreground text-sm mb-3 pb-2.5 border-b border-border/60">
        <Icon className="w-4 h-4 text-muted-foreground" />
        {title}
      </h3>
      {children}
    </section>
  );
}

function InfoRow({ label, value, valueClassName }: {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn('text-sm font-medium text-foreground text-right', valueClassName)}>{value}</span>
    </div>
  );
}

function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {ok ? (
        <CheckCircle className="w-4 h-4 text-success shrink-0" />
      ) : (
        <XCircle className="w-4 h-4 text-destructive shrink-0" />
      )}
      <span className={cn(ok ? 'text-foreground' : 'text-muted-foreground')}>{label}</span>
    </div>
  );
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
        {/* Breadcrumb */}
        <nav
          className="text-sm text-muted-foreground mb-4 flex flex-wrap items-center gap-x-1 gap-y-1"
          aria-label="Хлебные крошки"
        >
          <Link href="/" className="hover:text-foreground transition-colors">Главная</Link>
          <span>/</span>
          <Link href="/" className="hover:text-foreground transition-colors">В продаже</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{listing.make} {listing.model}</span>
        </nav>

        {/* Title */}
        <div className="mb-6">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {listing.make} {listing.model}, {listing.year}
            {listing.generation && (
              <span className="text-muted-foreground font-normal ml-2 text-xl">· {listing.generation}</span>
            )}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {listing.city}
            {' · '}
            {listing.mileage.toLocaleString('ru-RU')} км
            {' · '}
            {listing.engine}
            {' · '}
            {listing.transmission}
            {' · '}
            {listing.owners} хоз
            {listing.paintCount === 0 ? ' · без окрасов' : ` · ${listing.paintCount} окр`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: gallery + sections */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-card dark:bg-surface-elevated rounded-xl border border-border p-4 overflow-hidden">
              <VehicleGallery vehicle={vehicle} />
            </div>

            {listing.interiorImages && listing.interiorImages.length > 0 && (
              <div className="bg-card dark:bg-surface-elevated rounded-xl border border-border p-4 overflow-hidden">
                <InteriorGallery images={listing.interiorImages} />
              </div>
            )}

            {/* Body & Paint + Tech in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SectionCard title="Кузов и окрасы" icon={Palette}>
                <InfoRow label="Цвет" value={listing.color} />
                <InfoRow
                  label="Окрасы"
                  value={listing.paintCount === 0 ? 'Нет' : `${listing.paintCount} эл.`}
                  valueClassName={listing.paintCount === 0 ? 'text-success' : 'text-warning'}
                />
                {listing.paintedElements && listing.paintedElements.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {listing.paintedElements.map((el) => (
                      <span key={el} className="px-2 py-0.5 rounded-md bg-warning/10 text-warning text-[11px] font-medium">
                        {el}
                      </span>
                    ))}
                  </div>
                )}
              </SectionCard>

              <SectionCard title="Техника" icon={Wrench}>
                <InfoRow label="Двигатель" value={`${listing.engine} / ${listing.power} л.с.`} />
                <InfoRow label="Коробка" value={listing.transmission} />
                <InfoRow label="Привод" value={listing.drive} />
                <InfoRow label="Пробег" value={`${listing.mileage.toLocaleString('ru-RU')} км`} />
                <InfoRow label="Кузов" value={listing.bodyType} />
                {listing.keysCount != null && (
                  <InfoRow label="Ключей" value={String(listing.keysCount)} />
                )}
              </SectionCard>
            </div>

            {/* Docs & legal */}
            <SectionCard title="Документы и юридическая часть" icon={FileText}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                <InfoRow
                  label="ПТС"
                  value={listing.ptsOriginal ? 'Оригинал' : 'Дубликат'}
                  valueClassName={listing.ptsOriginal ? 'text-success' : 'text-warning'}
                />
                <InfoRow label="Владельцев" value={String(listing.owners)} />
                {listing.registrations && (
                  <InfoRow label="Регистраций" value={String(listing.registrations)} />
                )}
                {listing.avtotekaStatus && (
                  <InfoRow
                    label="Автотека"
                    value={
                      listing.avtotekaStatus === 'green' ? 'Зелёная' :
                      listing.avtotekaStatus === 'yellow' ? 'Жёлтая' :
                      listing.avtotekaStatus === 'red' ? 'Красная' : 'Неизвестно'
                    }
                    valueClassName={
                      listing.avtotekaStatus === 'green' ? 'text-success' :
                      listing.avtotekaStatus === 'yellow' ? 'text-warning' :
                      listing.avtotekaStatus === 'red' ? 'text-destructive' : ''
                    }
                  />
                )}
              </div>
              <div className="mt-3 space-y-1.5">
                <StatusBadge ok={!listing.taxi} label={listing.taxi ? 'Был в такси' : 'Не такси'} />
                <StatusBadge ok={!listing.carsharing} label={listing.carsharing ? 'Был в каршеринге' : 'Не каршеринг'} />
                {listing.accident != null && (
                  <StatusBadge ok={!listing.accident} label={listing.accident ? 'Есть ДТП по автотеке' : 'Нет ДТП'} />
                )}
              </div>
            </SectionCard>

            {/* Condition */}
            <SectionCard title="Состояние" icon={ShieldCheck}>
              <div className="space-y-1.5">
                <StatusBadge ok={!listing.needsInvestment} label={listing.needsInvestment ? 'Нужны вложения' : 'Без вложений'} />
                {listing.glassOriginal != null && (
                  <StatusBadge ok={!!listing.glassOriginal} label={listing.glassOriginal ? 'Оригинальные стёкла' : 'Стёкла заменены'} />
                )}
                {listing.keysCount != null && (
                  <StatusBadge ok={listing.keysCount >= 2} label={`${listing.keysCount} ключ${listing.keysCount === 1 ? '' : listing.keysCount <= 4 ? 'а' : 'ей'}`} />
                )}
              </div>
              {listing.conditionNote && (
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">{listing.conditionNote}</p>
              )}
            </SectionCard>

            {/* VIN Report */}
            <VinReport vehicle={vehicle} />

            {/* Seller comment */}
            <SectionCard title="Комментарий продавца" icon={MessageSquare}>
              <p className="text-sm text-muted-foreground leading-relaxed">{listing.description}</p>
            </SectionCard>

            {/* Contacts */}
            <SectionCard title="Продавец" icon={Phone}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-foreground">{listing.seller.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    На платформе с {listing.seller.onPlatformSince}
                    {listing.seller.verified && (
                      <span className="text-success ml-1.5 inline-flex items-center gap-0.5">
                        <CheckCircle className="w-3 h-3" /> Верифицирован
                      </span>
                    )}
                  </div>
                </div>
                {listing.seller.phone && (
                  <a
                    href={`tel:${listing.seller.phone.replace(/\D/g, '')}`}
                    className="text-teal-accent text-sm font-medium hover:underline"
                  >
                    {listing.seller.phone}
                  </a>
                )}
              </div>
            </SectionCard>
          </div>

          {/* Right: sticky Deal Block */}
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
