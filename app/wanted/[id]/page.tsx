import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MarketplaceHeader } from '@/components/marketplace/header';
import { wantedListings, formatPrice } from '@/lib/marketplace-data';
import {
  MapPin,
  Calendar,
  Gauge,
  Users,
  Palette,
  MessageCircle,
  Phone,
  ArrowLeft,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface WantedPageProps {
  params: Promise<{ id: string }>;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground text-right">{value}</span>
    </div>
  );
}

export default async function WantedDetailPage({ params }: WantedPageProps) {
  const { id } = await params;
  const w = wantedListings.find((l) => l.id === id);
  if (!w) notFound();

  const budgetLabel = w.budgetMin
    ? `${formatPrice(w.budgetMin)} — ${formatPrice(w.budgetMax)}`
    : `до ${formatPrice(w.budgetMax)}`;

  const date = new Date(w.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const yesItems: string[] = [];
  const noItems: string[] = [];
  if (w.restrictions) {
    w.restrictions.forEach((r) => noItems.push(r));
  }

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/wanted" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            В подбор
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium line-clamp-1">{w.models.join(', ')}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main content */}
          <div className="lg:col-span-8 space-y-5">
            {/* Header card */}
            <div className="rounded-xl border border-border bg-card dark:bg-surface-elevated p-5">
              <h1 className="text-2xl font-bold text-foreground leading-tight mb-2">
                {w.models.join(', ')}
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span className="font-bold text-foreground text-lg">{budgetLabel}</span>
                {w.region && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {w.region}
                  </span>
                )}
                <span>{date}</span>
              </div>
            </div>

            {/* Parameters */}
            <section className="rounded-xl border border-border bg-card dark:bg-surface-elevated p-5">
              <h2 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border/60">
                Параметры поиска
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                {w.yearFrom && <InfoRow label="Год выпуска от" value={String(w.yearFrom)} />}
                {w.mileageMax && (
                  <InfoRow label="Пробег до" value={`${w.mileageMax.toLocaleString('ru-RU')} км`} />
                )}
                {w.ownersMax && <InfoRow label="Владельцев не более" value={String(w.ownersMax)} />}
                {w.engine && <InfoRow label="Двигатель" value={w.engine} />}
                {w.transmission && <InfoRow label="КПП" value={w.transmission} />}
                {w.drive && <InfoRow label="Привод" value={w.drive} />}
                <InfoRow label="Окрасы" value={w.paintAllowed ? 'Допустимы' : 'Без окрасов'} />
                {w.region && <InfoRow label="Регион" value={w.region} />}
              </div>
            </section>

            {/* Restrictions */}
            {(w.restrictions && w.restrictions.length > 0) && (
              <section className="rounded-xl border border-border bg-card dark:bg-surface-elevated p-5">
                <h2 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border/60">
                  Требования и ограничения
                </h2>
                <div className="space-y-2">
                  {w.restrictions.map((r) => (
                    <div key={r} className="flex items-center gap-2.5 text-sm">
                      <XCircle className="w-4 h-4 text-destructive shrink-0" />
                      <span className="text-foreground">{r}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2.5 text-sm">
                    <CheckCircle className="w-4 h-4 text-success shrink-0" />
                    <span className="text-foreground">
                      {w.paintAllowed ? 'Окрасы допустимы' : 'Без окрасов — обязательно'}
                    </span>
                  </div>
                </div>
              </section>
            )}

            {/* Comment */}
            {w.comment && (
              <section className="rounded-xl border border-border bg-card dark:bg-surface-elevated p-5">
                <h2 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border/60">
                  Комментарий
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{w.comment}</p>
              </section>
            )}
          </div>

          {/* Sidebar: contact */}
          <div className="lg:col-span-4">
            <div className="rounded-xl border-2 border-border bg-card dark:bg-surface-elevated p-5 sticky top-20 space-y-4">
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">Подбирает</div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{w.author.name}</span>
                  {w.author.verified && (
                    <CheckCircle className="w-4 h-4 text-success" aria-label="Верифицирован" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  На платформе с {w.author.onPlatformSince}
                </div>
              </div>

              <div className="pt-2 border-t border-border space-y-2">
                <a
                  href={`https://t.me/${w.contact.replace('tg/@', '').replace('@', '')}`}
                  className="flex items-center justify-center gap-2 w-full h-10 rounded-lg bg-teal-dark dark:bg-teal-accent text-white dark:text-[#09090B] text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <MessageCircle className="w-4 h-4" />
                  Написать
                </a>
                {w.contact.startsWith('+') && (
                  <a
                    href={`tel:${w.contact.replace(/\D/g, '')}`}
                    className="flex items-center justify-center gap-2 w-full h-10 rounded-lg border border-border text-foreground text-sm hover:bg-muted/40 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Позвонить
                  </a>
                )}
                <div className="text-center text-sm font-medium text-teal-accent mt-1">
                  {w.contact}
                </div>
              </div>

              <div className="pt-2 border-t border-border text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Бюджет</span>
                  <span className="font-medium text-foreground">{budgetLabel}</span>
                </div>
                {w.yearFrom && (
                  <div className="flex justify-between">
                    <span>Год от</span>
                    <span className="font-medium text-foreground">{w.yearFrom}</span>
                  </div>
                )}
                {w.mileageMax && (
                  <div className="flex justify-between">
                    <span>Пробег до</span>
                    <span className="font-medium text-foreground">{w.mileageMax.toLocaleString('ru-RU')} км</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
