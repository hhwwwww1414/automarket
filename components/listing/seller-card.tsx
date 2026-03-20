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
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="font-semibold text-foreground mb-4">Продавец</h3>

      {/* Seller Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
          {seller.type === 'dealer' ? (
            <span className="text-lg font-semibold text-teal-dark">
              {seller.name.charAt(0)}
            </span>
          ) : (
            <User className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{seller.name}</span>
            {seller.verified && (
              <CheckCircle className="w-4 h-4 text-success" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {seller.type === 'owner' ? 'Собственник' : 'Дилер'}
          </p>
        </div>
      </div>

      {/* Seller Stats */}
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">На платформе с</span>
          <span className="text-foreground">{seller.onPlatformSince} года</span>
        </div>
        {seller.rating && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Рейтинг</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-warning fill-warning" />
              <span className="text-foreground font-medium">{seller.rating}</span>
            </div>
          </div>
        )}
        {seller.verified && (
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-success" />
            <span className="text-muted-foreground">Документы подтверждены</span>
          </div>
        )}
      </div>

      {/* Contact Actions */}
      <div className="space-y-2">
        <Button 
          className="w-full bg-teal-dark hover:bg-teal-medium text-white"
          onClick={() => setShowPhone(true)}
        >
          <Phone className="w-4 h-4 mr-2" />
          {showPhone ? seller.phone || '+7 (999) ***-**-**' : 'Показать контакты'}
        </Button>
        <Button variant="outline" className="w-full border-teal-accent text-teal-accent hover:bg-teal-accent/5">
          <MessageCircle className="w-4 h-4 mr-2" />
          Написать сообщение
        </Button>
      </div>
    </div>
  );
}
