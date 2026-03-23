import { Vehicle, formatPrice } from '@/lib/marketplace-data';
import { TrendingDown, TrendingUp, Minus, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VehiclePriceProps {
  vehicle: Vehicle;
}

export function VehiclePrice({ vehicle }: VehiclePriceProps) {
  const priceStatusConfig = {
    low: {
      label: 'хорошая цена',
      icon: TrendingDown,
      className: 'bg-[var(--status-good-bg)] text-[var(--status-good-fg)] border-[var(--status-good-fg)]/25',
    },
    normal: {
      label: 'нормальная цена',
      icon: Minus,
      className: 'bg-[var(--status-normal-bg)] text-[var(--status-normal-fg)] border-[var(--status-normal-fg)]/25',
    },
    high: {
      label: 'выше рынка',
      icon: TrendingUp,
      className: 'bg-[var(--status-high-bg)] text-[var(--status-high-fg)] border-[var(--status-high-fg)]/25',
    },
  };

  const status = priceStatusConfig[vehicle.priceStatus];
  const StatusIcon = status.icon;
  const monthlyPayment = Math.round(vehicle.price / 60);

  return (
    <div className="relative bg-card dark:bg-surface-elevated rounded-2xl border-2 border-border p-6 sm:p-7 shadow-lg overflow-hidden">
      <div className="relative">
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-[-0.02em] leading-tight">
              {new Intl.NumberFormat('ru-RU').format(vehicle.price)}
            </span>
            <span className="font-display text-2xl sm:text-3xl font-bold text-foreground">₽</span>
          </div>
          <div
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 w-fit',
              status.className
            )}
          >
            <StatusIcon className="w-4 h-4 shrink-0" />
            <span>{status.label}</span>
          </div>
        </div>

        <div className="bg-surface-info dark:bg-surface-3 rounded-xl p-5 flex items-center gap-4">
          <div className="w-14 h-14 bg-teal-accent/15 dark:bg-teal-accent/20 rounded-xl flex items-center justify-center shrink-0">
            <CreditCard className="w-7 h-7 text-teal-accent" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">
              от {formatPrice(monthlyPayment)}/мес
            </p>
            <p className="text-base text-muted-foreground mt-1 font-medium">
              Кредит от 4.9% без первого взноса
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
