import { Vehicle, formatPrice } from '@/lib/marketplace-data';
import { TrendingDown, TrendingUp, Minus, CreditCard } from 'lucide-react';

interface VehiclePriceProps {
  vehicle: Vehicle;
}

export function VehiclePrice({ vehicle }: VehiclePriceProps) {
  const priceStatusConfig = {
    low: {
      label: 'хорошая цена',
      icon: TrendingDown,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
    },
    normal: {
      label: 'нормальная цена',
      icon: Minus,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
    },
    high: {
      label: 'выше рынка',
      icon: TrendingUp,
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200',
    },
  };

  const status = priceStatusConfig[vehicle.priceStatus];
  const StatusIcon = status.icon;

  // Calculate monthly payment (simple estimate)
  const monthlyPayment = Math.round(vehicle.price / 60);

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      {/* Main Price */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="text-3xl font-bold text-foreground whitespace-nowrap">
          {formatPrice(vehicle.price)}
        </p>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 ${status.bgColor} ${status.textColor} border ${status.borderColor}`}>
          <StatusIcon className="w-3 h-3 shrink-0" />
          <span>{status.label}</span>
        </div>
      </div>

      {/* Credit Info */}
      <div className="bg-surface-info rounded-lg p-3 flex items-center gap-3">
        <div className="w-10 h-10 bg-teal-accent/10 rounded-lg flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-teal-accent" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            от {formatPrice(monthlyPayment)}/мес
          </p>
          <p className="text-xs text-muted-foreground">
            Кредит от 4.9% без первого взноса
          </p>
        </div>
      </div>
    </div>
  );
}
