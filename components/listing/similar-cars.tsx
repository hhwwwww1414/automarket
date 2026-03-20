import { Vehicle, vehicles } from '@/lib/marketplace-data';
import { VehicleCard } from '@/components/marketplace/vehicle-card';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface SimilarCarsProps {
  currentVehicle: Vehicle;
}

export function SimilarCars({ currentVehicle }: SimilarCarsProps) {
  // Get similar cars (same make or similar price range, excluding current)
  const similarCars = vehicles
    .filter(v => v.id !== currentVehicle.id)
    .filter(v => 
      v.make === currentVehicle.make || 
      (v.price >= currentVehicle.price * 0.7 && v.price <= currentVehicle.price * 1.3)
    )
    .slice(0, 6);

  if (similarCars.length === 0) {
    return null;
  }

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-foreground">
          Похожие автомобили
        </h2>
        <Link 
          href="#" 
          className="flex items-center gap-1 text-sm text-teal-accent hover:text-teal-dark transition-colors"
        >
          <span>Смотреть все</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {similarCars.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </section>
  );
}
