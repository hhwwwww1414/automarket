import { Vehicle, vehicles } from '@/lib/marketplace-data';
import { VehicleCard } from '@/components/marketplace/vehicle-card';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface SimilarCarsProps {
  currentVehicle: Vehicle;
}

export function SimilarCars({ currentVehicle }: SimilarCarsProps) {
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
    <section className="mt-12 sm:mt-14">
      <div className="bg-card dark:bg-surface-panel rounded-2xl border-2 border-border p-6 sm:p-8 shadow-lg">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-[-0.02em]">
            Похожие автомобили
          </h2>
          <Link
            href="#"
            className="flex items-center gap-2 text-base font-semibold text-teal-accent hover:text-teal-dark dark:hover:text-seafoam transition-colors group"
          >
            <span>Смотреть все</span>
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
          {similarCars.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
}
