'use client';

import Link from 'next/link';
import { Heart, MapPin, CheckCircle, User } from 'lucide-react';
import { Vehicle, formatPrice, formatMileage } from '@/lib/marketplace-data';
import { CardCarousel } from '@/components/marketplace/card-carousel';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const title = `${vehicle.make} ${vehicle.model}, ${vehicle.year}`;
  
  return (
    <Link 
      href={`/listing/${vehicle.id}`}
      className="group block bg-card rounded-lg border border-border overflow-hidden hover:shadow-md hover:border-teal-accent/50 transition-all"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <CardCarousel
          images={vehicle.images.length > 0 ? vehicle.images : [vehicle.imageUrl]}
          alt={title}
          videoUrl={vehicle.videoUrl}
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
          {vehicle.verified && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-success/90 text-white text-xs rounded-full">
              <CheckCircle className="w-3 h-3" />
              Проверено
            </span>
          )}
          {vehicle.owners === 1 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-accent/90 text-white text-xs rounded-full">
              <User className="w-3 h-3" />
              Один владелец
            </span>
          )}
          {vehicle.priceStatus === 'low' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-success/90 text-white text-xs rounded-full">
              Хорошая цена
            </span>
          )}
        </div>
        {/* Favorite button */}
        <button 
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
          onClick={(e) => {
            e.preventDefault();
            // Add to favorites logic
          }}
        >
          <Heart className="w-4 h-4 text-muted-foreground hover:text-red-500 transition-colors" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-1.5">
        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-teal-accent transition-colors">
          {title}
        </h3>
        <p className="text-lg font-bold text-foreground whitespace-nowrap">
          {formatPrice(vehicle.price)}
        </p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="whitespace-nowrap">{formatMileage(vehicle.mileage)}</span>
          <span className="w-1 h-1 shrink-0 rounded-full bg-muted-foreground/50" />
          <span className="whitespace-nowrap">{vehicle.engine}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3 shrink-0" />
          <span>{vehicle.city}</span>
        </div>
      </div>
    </Link>
  );
}
