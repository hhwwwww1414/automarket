import { Vehicle, formatMileage } from '@/lib/marketplace-data';

interface VehicleSpecsProps {
  vehicle: Vehicle;
}

export function VehicleSpecs({ vehicle }: VehicleSpecsProps) {
  const specs = [
    { label: 'Двигатель', value: vehicle.engine },
    { label: 'Мощность', value: `${vehicle.power} л.с.` },
    { label: 'Коробка передач', value: vehicle.transmission },
    { label: 'Привод', value: vehicle.drive },
    { label: 'Тип кузова', value: vehicle.bodyType },
    { label: 'Цвет', value: vehicle.color },
    { label: 'Пробег', value: formatMileage(vehicle.mileage) },
    { label: 'Владельцы', value: `${vehicle.owners} по ПТС` },
    { label: 'Руль', value: vehicle.steering },
    { label: 'Поколение', value: vehicle.generation },
    { label: 'Комплектация', value: vehicle.trim },
  ];

  return (
    <div className="bg-card dark:bg-surface-elevated rounded-2xl border-2 border-border p-6 sm:p-7 shadow-lg">
      <h3 className="font-display font-semibold text-foreground mb-5 text-lg sm:text-xl tracking-[-0.01em]">Характеристики</h3>
      <div className="space-y-1">
        {specs.map((spec) => (
          <div key={spec.label} className="flex items-baseline justify-between gap-4 py-3 border-b border-border/50 last:border-0">
            <span className="text-base text-muted-foreground min-w-0 truncate font-medium">{spec.label}</span>
            <span className="text-base font-semibold text-foreground whitespace-nowrap shrink-0">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
