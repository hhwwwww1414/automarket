'use client';

import { useState } from 'react';
import { ChevronDown, Search, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

const regions = [
  { id: 'all', label: 'Все регионы' },
  { id: 'moscow', label: 'Москва' },
  { id: '100', label: '+100 км' },
  { id: '200', label: '+200 км' },
  { id: '500', label: '+500 км' },
  { id: 'other', label: 'Другой город' },
];

const conditions = [
  { id: 'all', label: 'Все' },
  { id: 'used', label: 'С пробегом' },
  { id: 'new', label: 'Новые' },
];

const makes = ['Любая', 'Audi', 'BMW', 'Chevrolet', 'Ford', 'Haval', 'Honda', 'Hyundai', 'Kia', 'Лада', 'Mazda', 'Mercedes-Benz', 'Mitsubishi', 'Nissan', 'Skoda', 'Subaru', 'Toyota', 'Volkswagen'];
const transmissions = ['Любая', 'МКПП', 'АКПП', 'Робот', 'Вариатор'];
const fuels = ['Любое', 'Бензин', 'Дизель', 'Гибрид', 'Электро', 'Газ'];
const drives = ['Любой', 'Передний', 'Задний', 'Полный'];
const bodyTypes = ['Любой', 'Седан', 'Хэтчбек', 'Универсал', 'Лифтбек', 'Кроссовер', 'Внедорожник', 'Купе', 'Кабриолет', 'Минивэн', 'Пикап'];

export function SearchPanel() {
  const [selectedRegion, setSelectedRegion] = useState('moscow');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [withPhotoOnly, setWithPhotoOnly] = useState(true);

  return (
    <section id="search" className="relative py-12 sm:py-16 bg-card dark:bg-surface-panel border-b-2 border-border">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Region Chips */}
        <div className="flex flex-wrap gap-3 mb-6">
          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region.id)}
              className={cn(
                'px-5 py-2.5 text-base font-medium rounded-full transition-all duration-200',
                selectedRegion === region.id
                  ? 'bg-teal-dark dark:bg-teal-accent text-white dark:text-[#070809] shadow-sm'
                  : 'bg-surface-elevated dark:bg-surface-3 text-foreground hover:bg-muted dark:hover:bg-surface-elevated border-2 border-border hover:border-teal-accent/40'
              )}
            >
              {region.label}
            </button>
          ))}
        </div>

        {/* Condition Tabs */}
        <div className="flex gap-1 mb-6 border-b-2 border-border">
          {conditions.map((condition) => (
            <button
              key={condition.id}
              onClick={() => setSelectedCondition(condition.id)}
              className={cn(
                'px-6 py-4 text-base font-medium transition-colors duration-200 relative -mb-0.5',
                selectedCondition === condition.id
                  ? 'text-teal-dark dark:text-teal-accent font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {condition.label}
              {selectedCondition === condition.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-dark dark:bg-teal-accent rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Main Filter Panel */}
        <div className="bg-surface-elevated dark:bg-surface-3 rounded-2xl border-2 border-border p-8 sm:p-10 shadow-lg ring-1 ring-black/5 dark:ring-white/5">
          {/* Row 1: Make, Model, Generation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
            <FilterSelect label="Марка" options={makes} />
            <FilterSelect label="Модель" options={['Любая']} disabled />
            <FilterSelect label="Поколение" options={['Любое']} disabled />
          </div>

          <div className="border-t-2 border-border/80 my-6" />

          {/* Row 2: Price, Year, Transmission, Fuel */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 mb-6">
            <RangeInput label="Цена, ₽" placeholderFrom="от" placeholderTo="до" />
            <RangeInput label="Год" placeholderFrom="от" placeholderTo="до" />
            <FilterSelect label="КПП" options={transmissions} />
            <FilterSelect label="Топливо" options={fuels} />
          </div>

          <div className="border-t-2 border-border/80 my-6" />

          {/* Row 3: Mileage, Drive, Body, Photo checkbox */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 mb-6">
            <RangeInput label="Пробег, км" placeholderFrom="от" placeholderTo="до" />
            <FilterSelect label="Привод" options={drives} />
            <FilterSelect label="Кузов" options={bodyTypes} />
            <div className="flex items-center gap-4 col-span-full sm:col-span-1 lg:col-span-1 min-h-12">
              <Checkbox
                id="photo"
                checked={withPhotoOnly}
                onCheckedChange={(checked) => setWithPhotoOnly(checked as boolean)}
              />
              <label htmlFor="photo" className="text-base font-medium text-foreground cursor-pointer select-none">
                С фото
              </label>
            </div>
          </div>

          {/* Bottom Row: Advanced Search + Submit */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pt-6 border-t-2 border-border">
            <button
              type="button"
              className="text-base font-semibold text-teal-accent hover:text-teal-dark hover:underline underline-offset-4 transition-colors"
            >
              Расширенный поиск
            </button>
            <Button
              size="lg"
              className="w-full sm:w-auto bg-teal-dark dark:bg-teal-accent hover:bg-teal-medium dark:hover:bg-seafoam text-white dark:text-[#070809] gap-2 font-semibold shadow-md hover:shadow-lg transition-all duration-300 min-h-14 px-8 sm:px-10 text-base"
            >
              <Search className="w-5 h-5 shrink-0" />
              Показать объявления
            </Button>
          </div>
        </div>

        {/* Trust line */}
        <div className="flex items-center justify-center gap-2.5 mt-6 text-base text-muted-foreground font-medium">
          <ShieldCheck className="w-5 h-5 text-teal-accent shrink-0" />
          <span>Тысячи проверенных объявлений • Бесплатная проверка VIN</span>
        </div>
      </div>
    </section>
  );
}

function FilterSelect({
  label,
  options,
  disabled = false,
}: {
  label: string;
  options: string[];
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <select
        className={cn(
          'w-full appearance-none border-2 border-border rounded-xl px-4 py-3.5 pr-10 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-teal-accent/50 focus:border-teal-accent',
          disabled
            ? 'text-muted-foreground bg-muted dark:bg-surface-elevated cursor-not-allowed'
            : 'text-foreground bg-card dark:bg-surface-elevated cursor-pointer hover:border-muted-foreground/30'
        )}
        disabled={disabled}
        defaultValue={options[0]}
        aria-label={label}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
      <span className="absolute -top-2.5 left-3 px-2 bg-surface-elevated dark:bg-surface-3 text-sm font-semibold text-muted-foreground border border-transparent">
        {label}
      </span>
    </div>
  );
}

function RangeInput({
  label,
  placeholderFrom,
  placeholderTo,
}: {
  label: string;
  placeholderFrom: string;
  placeholderTo: string;
}) {
  return (
    <div className="col-span-2 sm:col-span-2">
      <div className="relative">
        <div className="flex">
          <input
            type="text"
            placeholder={placeholderFrom}
            aria-label={`${label} от`}
            className="w-1/2 bg-card dark:bg-surface-elevated border-2 border-border border-r-0 rounded-l-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-teal-accent/50 focus:border-teal-accent focus:z-10 placeholder:text-muted-foreground transition-colors hover:border-muted-foreground/30"
          />
          <input
            type="text"
            placeholder={placeholderTo}
            aria-label={`${label} до`}
            className="w-1/2 bg-card dark:bg-surface-elevated border-2 border-border rounded-r-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-teal-accent/50 focus:border-teal-accent placeholder:text-muted-foreground transition-colors hover:border-muted-foreground/30"
          />
        </div>
        <span className="absolute -top-2.5 left-3 px-2 bg-surface-elevated dark:bg-surface-3 text-sm font-semibold text-muted-foreground border border-transparent">
          {label}
        </span>
      </div>
    </div>
  );
}
