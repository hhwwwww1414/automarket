'use client';

import { useState } from 'react';
import { Phone, MessageCircle, FileText, MapPin } from 'lucide-react';
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
  not_listed: 'Пока не на ресурсах',
  on_resources: 'На ресурсах',
  pre_resources: 'До ресурсов',
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

  return (
    <div
      className={cn(
        'rounded-xl border-2 border-border bg-card dark:bg-surface-elevated p-5 shadow-lg sticky top-20',
        className
      )}
    >
      <div className="space-y-4">
        {/* Цены */}
        <div>
          <div className="text-2xl font-bold text-foreground">{formatPrice(listing.price)}</div>
          {listing.priceInHand != null && (
            <div className="text-sm text-muted-foreground mt-0.5">
              В руки: {formatPrice(listing.priceInHand)}
            </div>
          )}
          {listing.priceOnResources != null && (
            <div className="text-sm text-muted-foreground">
              На ресурсах: {formatPrice(listing.priceOnResources)}
            </div>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Торг</span>
            <span className="font-medium">{listing.trade ? 'Да' : 'Нет'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">На ресурсах</span>
            <span>{RESOURCE_LABELS[listing.resourceStatus] ?? listing.resourceStatus}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Продавец</span>
            <span>{SELLER_LABELS[listing.sellerType] ?? listing.sellerType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Осмотр</span>
            <span>{listing.city}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Юр. чистота</span>
            <span
              className={cn(
                'font-medium',
                legalClean ? 'text-success' : 'text-muted-foreground'
              )}
            >
              {legalClean ? 'Чисто' : 'Проверить'}
            </span>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-border">
          <Button
            className="w-full h-10 bg-teal-dark dark:bg-teal-accent text-white dark:text-[#070809] font-semibold"
            onClick={() => setShowPhone(true)}
          >
            <Phone className="w-4 h-4 mr-2" />
            {showPhone ? listing.seller.phone ?? 'Показать контакт' : 'Контакт'}
          </Button>
          <Button variant="outline" className="w-full h-10" asChild>
            <a href="#">
              <MessageCircle className="w-4 h-4 mr-2" />
              Написать
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
      </div>
    </div>
  );
}
