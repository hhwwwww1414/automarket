'use client';

import { MarketplaceHeader } from '@/components/marketplace/header';
import { wantedListings, formatPrice } from '@/lib/marketplace-data';
import { Plus, MapPin, MessageCircle, Calendar, Gauge, Users, Palette } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

function WantedCard({ w }: { w: (typeof wantedListings)[0] }) {
  const budgetLabel =
    w.budgetMin
      ? `${formatPrice(w.budgetMin)} — ${formatPrice(w.budgetMax)}`
      : `до ${formatPrice(w.budgetMax)}`;

  const date = new Date(w.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });

  return (
    <Link
      href={`/wanted/${w.id}`}
      className={cn(
        // card-interactive = same CSS :active rule as listing cards
        'card-interactive relative block rounded-xl border overflow-hidden',
        // Default
        'border-border bg-card dark:bg-surface-elevated/90 backdrop-blur-sm',
        // Hover — identical to sale cards
        'hover:border-teal-accent/35 dark:hover:bg-surface-elevated transition-[border-color,background-color] duration-200',
        // Focus-visible
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background'
      )}
    >
      {/* Carbon press overlay — pure CSS activation via .card-interactive:active */}
      <span
        aria-hidden="true"
        className="card-press-carbon absolute inset-0 rounded-[inherit] pointer-events-none z-[1] opacity-0 transition-opacity duration-[180ms] ease-out"
      />
      <div className="relative z-[2] p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground text-base leading-snug line-clamp-2">
              {w.models.join(', ')}
            </h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-xs text-muted-foreground">
              {w.author.verified && (
                <span className="text-success font-medium">Верифицирован</span>
              )}
              <span>На платформе с {w.author.onPlatformSince}</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-bold text-foreground text-base tabular-nums">{budgetLabel}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{date}</div>
          </div>
        </div>

        {/* Params grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1.5 mb-3 text-xs text-muted-foreground">
          {w.yearFrom && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 shrink-0 opacity-60" />
              <span>Год от {w.yearFrom}</span>
            </div>
          )}
          {w.mileageMax && (
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 shrink-0 opacity-60" />
              <span>до {w.mileageMax.toLocaleString('ru-RU')} км</span>
            </div>
          )}
          {w.ownersMax && (
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 shrink-0 opacity-60" />
              <span>до {w.ownersMax} хоз</span>
            </div>
          )}
          {w.region && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0 opacity-60" />
              <span className="truncate">{w.region}</span>
            </div>
          )}
          {w.transmission && (
            <span className="col-span-1">{w.transmission}</span>
          )}
          {w.engine && (
            <span className="col-span-1">Двиг: {w.engine}</span>
          )}
          <div className="flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 shrink-0 opacity-60" />
            <span>{w.paintAllowed ? 'Окрасы допустимы' : 'Без окрасов'}</span>
          </div>
        </div>

        {/* Restrictions */}
        {w.restrictions && w.restrictions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {w.restrictions.map((r) => (
              <span
                key={r}
                className="px-2 py-0.5 rounded-md bg-muted dark:bg-surface-3 text-muted-foreground text-[11px] font-medium"
              >
                {r}
              </span>
            ))}
          </div>
        )}

        {/* Comment */}
        {w.comment && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{w.comment}</p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/60">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{w.author.name}</span>
          </div>
          <div className="flex items-center gap-1.5 text-teal-accent text-sm font-medium hover:underline">
            <MessageCircle className="w-3.5 h-3.5" />
            {w.contact}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function WantedPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Запросы в подбор</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {wantedListings.length} активных запросов
            </p>
          </div>
          <Link
            href="/listing/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-dark dark:bg-teal-accent text-white dark:text-[#070809] text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Создать запрос
          </Link>
        </div>

        <div className="grid gap-3 lg:gap-4">
          {wantedListings.map((w) => (
            <WantedCard key={w.id} w={w} />
          ))}
        </div>
      </main>
    </div>
  );
}
