import { Vehicle } from '@/lib/marketplace-data';
import { Star, MessageSquare, PlayCircle, Settings, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { BrandLogo } from '@/components/ui/brand-logo';

interface BrandInfoProps {
  vehicle: Vehicle;
}

export function BrandInfo({ vehicle }: BrandInfoProps) {
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
    <div className="bg-card dark:bg-surface-elevated rounded-2xl border-2 border-border shadow-lg p-6">
      <div className="flex items-center gap-3 mb-5">
        <BrandLogo
          brandName={vehicle.make}
          size={56}
          fallbackClassName="text-xl text-teal-accent"
        />
        <div>
          <h3 className="font-display font-semibold text-foreground text-lg tracking-[-0.01em]">{vehicle.make} {vehicle.model}</h3>
          <p className="text-base text-muted-foreground font-medium">{vehicle.generation} поколение</p>
        </div>
      </div>

      <div className="bg-surface-info dark:bg-surface-3 rounded-xl p-4 mb-5">
        <div className="flex items-center justify-between">
          <span className="text-base text-muted-foreground font-medium">Оценка поколения</span>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-warning fill-warning" />
            <span className="font-bold text-foreground text-lg">{rating}</span>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.label}
            href="#"
            className="flex items-center justify-between py-3 px-3 -mx-3 rounded-xl hover:bg-muted dark:hover:bg-surface-3 transition-colors group"
          >
            <div className="flex items-center gap-3 text-base">
              <link.icon className="w-4 h-4 text-muted-foreground group-hover:text-teal-accent transition-colors" />
              <span className="text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                {link.label}
              </span>
            </div>
            {link.count && (
              <span className="text-sm text-muted-foreground font-medium">{link.count}</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
