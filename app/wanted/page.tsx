'use client';

import { MarketplaceHeader } from '@/components/marketplace/header';
import { wantedListings } from '@/lib/marketplace-data';
import { formatPrice } from '@/lib/marketplace-data';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function WantedPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-foreground">Запросы в подбор</h1>
          <Link
            href="/wanted/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-dark dark:bg-teal-accent text-white dark:text-[#070809] text-sm font-semibold hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            Создать запрос
          </Link>
        </div>
        <div className="space-y-3">
          {wantedListings.map((w) => (
            <Link
              key={w.id}
              href={`/wanted/${w.id}`}
              className="block p-4 rounded-xl border border-border bg-card dark:bg-surface-elevated hover:border-teal-accent/40 transition-colors"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-foreground">
                    {w.models.join(', ')}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Бюджет до {formatPrice(w.budgetMax)}
                    {w.yearFrom && ` • Год от ${w.yearFrom}`}
                    {w.mileageMax && ` • Пробег до ${w.mileageMax.toLocaleString('ru-RU')} км`}
                    {w.region && ` • ${w.region}`}
                  </div>
                  {w.comment && (
                    <p className="text-sm text-muted-foreground mt-2">{w.comment}</p>
                  )}
                </div>
                <div className="text-right text-sm">
                  <div className="text-muted-foreground">{w.author.name}</div>
                  <div className="text-teal-accent font-medium">{w.contact}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
