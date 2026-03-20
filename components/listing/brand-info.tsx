import { Vehicle } from '@/lib/marketplace-data';
import { Star, MessageSquare, PlayCircle, Settings, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface BrandInfoProps {
  vehicle: Vehicle;
}

export function BrandInfo({ vehicle }: BrandInfoProps) {
  // Mock rating based on vehicle make
  const rating = vehicle.make === 'Toyota' || vehicle.make === 'Mercedes-Benz' ? 8.5 : 
                 vehicle.make === 'BMW' || vehicle.make === 'Audi' ? 8.2 :
                 vehicle.make === 'Skoda' || vehicle.make === 'Volkswagen' ? 7.8 :
                 vehicle.make === 'Hyundai' || vehicle.make === 'Kia' ? 7.5 : 7.0;

  const links = [
    { label: 'Отзывы владельцев', icon: MessageSquare, count: 234 },
    { label: 'Тест-драйвы', icon: PlayCircle, count: 12 },
    { label: 'Технические характеристики', icon: Settings },
    { label: 'Все объявления этой марки', icon: ExternalLink },
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-lg font-bold text-teal-dark">
          {vehicle.make.charAt(0)}
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{vehicle.make} {vehicle.model}</h3>
          <p className="text-sm text-muted-foreground">{vehicle.generation} поколение</p>
        </div>
      </div>

      {/* Rating */}
      <div className="bg-surface-info rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Оценка поколения</span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-warning fill-warning" />
            <span className="font-bold text-foreground">{rating}</span>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.label}
            href="#"
            className="flex items-center justify-between py-2 px-2 -mx-2 rounded-lg hover:bg-muted transition-colors group"
          >
            <div className="flex items-center gap-2 text-sm">
              <link.icon className="w-4 h-4 text-muted-foreground group-hover:text-teal-accent transition-colors" />
              <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                {link.label}
              </span>
            </div>
            {link.count && (
              <span className="text-xs text-muted-foreground">{link.count}</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
