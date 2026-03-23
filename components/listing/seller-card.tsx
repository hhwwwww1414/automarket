'use client';

import { useState } from 'react';
import { Vehicle } from '@/lib/marketplace-data';
import { User, CheckCircle, Phone, MessageCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SellerCardProps {
  vehicle: Vehicle;
}

export function SellerCard({ vehicle }: SellerCardProps) {
  const [showPhone, setShowPhone] = useState(false);
  const { seller } = vehicle;

  return (
    <div className="relative bg-card dark:bg-surface-elevated rounded-2xl border-2 border-border p-6 sm:p-7 shadow-lg overflow-hidden">
      <div className="relative">
        <h3 className="font-display font-semibold text-foreground mb-5 text-lg sm:text-xl tracking-[-0.01em]">Продавец</h3>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-muted dark:bg-surface-3 rounded-xl flex items-center justify-center shrink-0">
            {seller.type === 'dealer' ? (
              <span className="text-2xl font-bold text-teal-accent">
                {seller.name.charAt(0)}
              </span>
            ) : (
              <User className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground truncate text-lg">{seller.name}</span>
              {seller.verified && (
                <CheckCircle className="w-5 h-5 text-success shrink-0" />
              )}
            </div>
            <p className="text-base text-muted-foreground font-medium">
              {seller.type === 'owner' ? 'Собственник' : 'Дилер'}
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-6 text-base">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-medium">На платформе с</span>
            <span className="text-foreground font-semibold">{seller.onPlatformSince} года</span>
          </div>
          {seller.rating && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Рейтинг</span>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-warning fill-warning" />
                <span className="text-foreground font-bold">{seller.rating}</span>
              </div>
            </div>
          )}
          {seller.verified && (
            <div className="flex items-center gap-2 text-base pt-1">
              <CheckCircle className="w-4 h-4 text-success shrink-0" />
              <span className="text-muted-foreground font-medium">Документы подтверждены</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Button
            className="w-full bg-teal-dark dark:bg-teal-accent hover:bg-teal-medium dark:hover:bg-seafoam text-white dark:text-[#09090B] h-14 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            onClick={() => setShowPhone(true)}
          >
            <Phone className="w-5 h-5 mr-2 shrink-0" />
            {showPhone ? seller.phone || '+7 (999) ***-**-**' : 'Показать контакты'}
          </Button>
          <Button
            variant="outline"
            className="w-full border-2 border-teal-accent/50 text-teal-accent hover:bg-teal-accent/15 dark:hover:bg-teal-accent/20 h-14 text-base font-semibold transition-all duration-300"
          >
            <MessageCircle className="w-5 h-5 mr-2 shrink-0" />
            Написать сообщение
          </Button>
        </div>
      </div>
    </div>
  );
}
