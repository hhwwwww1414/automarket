import { vehicles } from '@/lib/marketplace-data';
import { VehicleCard } from './vehicle-card';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function Recommendations() {
  return (
    <section className="py-8 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-foreground">
            Рекомендации
          </h2>
          <Link 
            href="#" 
            className="flex items-center gap-1 text-sm text-teal-accent hover:text-teal-dark transition-colors"
          >
            <span>Смотреть все</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {vehicles.slice(0, 8).map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </section>
  );
}
