import { notFound } from 'next/navigation';
import { MarketplaceHeader } from '@/components/marketplace/header';
import { VehicleGallery } from '@/components/listing/vehicle-gallery';
import { InteriorGallery } from '@/components/listing/interior-gallery';
import { VehiclePrice } from '@/components/listing/vehicle-price';
import { VehicleSpecs } from '@/components/listing/vehicle-specs';
import { VinReport } from '@/components/listing/vin-report';
import { SellerCard } from '@/components/listing/seller-card';
import { BrandInfo } from '@/components/listing/brand-info';
import { SimilarCars } from '@/components/listing/similar-cars';
import { vehicles } from '@/lib/marketplace-data';

interface ListingPageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params;
  const vehicle = vehicles.find(v => v.id === id);
  
  if (!vehicle) {
    notFound();
  }

  const title = `Продажа ${vehicle.make} ${vehicle.model}, ${vehicle.year} год в ${vehicle.city}`;

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-4">
          <span className="hover:text-foreground cursor-pointer">Главная</span>
          <span className="mx-2">/</span>
          <span className="hover:text-foreground cursor-pointer">Автомобили</span>
          <span className="mx-2">/</span>
          <span className="hover:text-foreground cursor-pointer">{vehicle.make}</span>
          <span className="mx-2">/</span>
          <span className="text-foreground">{vehicle.model}</span>
        </nav>

        {/* Title */}
        <h1 className="text-2xl font-bold text-foreground mb-6">
          {title}
        </h1>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Gallery */}
          <div className="lg:col-span-5 space-y-4">
            <VehicleGallery vehicle={vehicle} />
            {vehicle.interiorImages && vehicle.interiorImages.length > 0 && (
              <InteriorGallery images={vehicle.interiorImages} />
            )}
          </div>

          {/* Center Column - Price, Specs, VIN */}
          <div className="lg:col-span-4 space-y-4">
            <VehiclePrice vehicle={vehicle} />
            <VehicleSpecs vehicle={vehicle} />
            <VinReport vehicle={vehicle} />
            
            {/* Description */}
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="font-semibold text-foreground mb-3">Описание</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {vehicle.description}
              </p>
            </div>

            {/* Location */}
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="font-semibold text-foreground mb-2">Местоположение</h3>
              <p className="text-sm text-muted-foreground">
                Город: {vehicle.city}
              </p>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            <BrandInfo vehicle={vehicle} />
            <SellerCard vehicle={vehicle} />
          </div>
        </div>

        {/* Similar Cars */}
        <SimilarCars currentVehicle={vehicle} />
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-card mt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-dark rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">АС</span>
              </div>
              <span className="font-semibold text-foreground">АвтоСделка</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 АвтоСделка. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
