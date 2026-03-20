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
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="font-semibold text-foreground mb-4">Характеристики</h3>
      <div className="space-y-2.5">
        {specs.map((spec) => (
          <div key={spec.label} className="flex items-baseline justify-between gap-4 text-sm">
            <span className="text-muted-foreground min-w-0 truncate">{spec.label}</span>
            <span className="text-foreground font-medium whitespace-nowrap shrink-0">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
