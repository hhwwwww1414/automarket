'use client';

import { useState } from 'react';
import { Phone, MessageCircle, FileText, CheckCircle, TrendingDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SaleListing } from '@/lib/types';
import { formatPrice } from '@/lib/marketplace-data';
import { cn } from '@/lib/utils';

const SELLER_LABELS: Record<string, string> = {
  owner: 'Собственник',
  flip: 'Перепродажа',
  broker: 'Подбор',
  commission: 'Комиссия',
};

const RESOURCE_LABELS: Record<string, string> = {
  not_listed: 'Не на ресурсах',
  on_resources: 'На ресурсах',
  pre_resources: 'До ресурсов',
};

const RESOURCE_COLORS: Record<string, string> = {
  not_listed: 'text-muted-foreground',
  on_resources: 'text-teal-accent',
  pre_resources: 'text-warning',
};

interface DealBlockProps {
  listing: SaleListing;
  className?: string;
}

export function DealBlock({ listing, className }: DealBlockProps) {
  const [showPhone, setShowPhone] = useState(false);

  const legalClean =
    listing.ptsOriginal &&
    !listing.accident &&
    (listing.avtotekaStatus === 'green' || !listing.avtotekaStatus);

  const sellerLabel = SELLER_LABELS[listing.sellerType] ?? listing.sellerType;
  const resourceLabel = RESOURCE_LABELS[listing.resourceStatus] ?? listing.resourceStatus;
  const resourceColor = RESOURCE_COLORS[listing.resourceStatus] ?? 'text-muted-foreground';

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card dark:bg-surface-elevated p-5 shadow-sm sticky top-20',
        className
      )}
    >
      {/* Price block */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-2xl font-bold text-foreground tabular-nums">
            {formatPrice(listing.price)}
          </span>
          {listing.trade && (
            <span className="flex items-center gap-1 text-xs text-teal-accent font-medium">
              <TrendingDown className="w-3.5 h-3.5" />
              Торг
            </span>
          )}
        </div>
        {listing.priceInHand != null && (
          <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            <span>В руки: <span className="font-medium text-foreground tabular-nums">{formatPrice(listing.priceInHand)}</span></span>
          </div>
        )}
        {listing.priceOnResources != null && (
          <div className="text-sm text-muted-foreground mt-0.5">
            На ресурсах: <span className="font-medium text-foreground tabular-nums">{formatPrice(listing.priceOnResources)}</span>
          </div>
        )}
      </div>

      {/* Deal details */}
      <div className="space-y-1.5 text-sm border-t border-border pt-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Продавец</span>
          <span className="font-medium">{sellerLabel}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Ресурсы</span>
          <span className={cn('font-medium', resourceColor)}>{resourceLabel}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Осмотр</span>
          <span className="font-medium">{listing.city}</span>
        </div>
        {listing.kickback && (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Откат</span>
            <span className="font-medium text-teal-accent">Да</span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Юр. чистота</span>
          <span className={cn('font-medium flex items-center gap-1', legalClean ? 'text-success' : 'text-muted-foreground')}>
            {legalClean && <CheckCircle className="w-3.5 h-3.5" />}
            {legalClean ? 'Чисто' : 'Уточнить'}
          </span>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="space-y-2">
        <Button
          className="w-full h-10 bg-teal-dark dark:bg-teal-accent text-white dark:text-[#070809] font-semibold hover:opacity-90"
          onClick={() => setShowPhone(true)}
        >
          <Phone className="w-4 h-4 mr-2" />
          {showPhone ? (listing.seller.phone ?? 'Показать контакт') : 'Показать контакт'}
        </Button>
        <Button variant="outline" className="w-full h-10" asChild>
          <a href="#">
            <MessageCircle className="w-4 h-4 mr-2" />
            Написать в чат
          </a>
        </Button>
        {listing.reportUrl && (
          <Button variant="outline" className="w-full h-10" asChild>
            <a href={listing.reportUrl} target="_blank" rel="noopener noreferrer">
              <FileText className="w-4 h-4 mr-2" />
              Отчёт / VIN
            </a>
          </Button>
        )}
      </div>

      {/* Seller badge */}
      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span>{listing.seller.name}</span>
        {listing.seller.verified && (
          <span className="flex items-center gap-1 text-success">
            <CheckCircle className="w-3 h-3" />
            Верифицирован
          </span>
        )}
      </div>
    </div>
  );
}
