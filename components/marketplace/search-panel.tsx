'use client';

import { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

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
    <section className="bg-surface-info py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Region Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region.id)}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                selectedRegion === region.id
                  ? 'bg-teal-dark text-white'
                  : 'bg-white text-foreground hover:bg-gray-100 border border-border'
              }`}
            >
              {region.label}
            </button>
          ))}
        </div>

        {/* Condition Tabs */}
        <div className="flex gap-1 mb-4 border-b border-border">
          {conditions.map((condition) => (
            <button
              key={condition.id}
              onClick={() => setSelectedCondition(condition.id)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
                selectedCondition === condition.id
                  ? 'text-teal-dark'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {condition.label}
              {selectedCondition === condition.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-dark" />
              )}
            </button>
          ))}
        </div>

        {/* Main Filter Panel */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          {/* Row 1: Make, Model, Generation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <FilterSelect label="Марка" options={makes} />
            <FilterSelect label="Модель" options={['Любая']} disabled />
            <FilterSelect label="Поколение" options={['Любое']} disabled />
          </div>

          {/* Row 2: Price, Year, Transmission, Fuel */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
            <RangeInput label="Цена, ₽" placeholderFrom="от" placeholderTo="до" />
            <RangeInput label="Год" placeholderFrom="от" placeholderTo="до" />
            <FilterSelect label="КПП" options={transmissions} />
            <FilterSelect label="Топливо" options={fuels} />
          </div>

          {/* Row 3: Mileage, Drive, Body, Photo checkbox */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
            <RangeInput label="Пробег, км" placeholderFrom="от" placeholderTo="до" />
            <FilterSelect label="Привод" options={drives} />
            <FilterSelect label="Кузов" options={bodyTypes} />
            <div className="flex items-center gap-2 col-span-1 lg:col-span-1">
              <Checkbox 
                id="photo" 
                checked={withPhotoOnly}
                onCheckedChange={(checked) => setWithPhotoOnly(checked as boolean)}
              />
              <label htmlFor="photo" className="text-sm text-foreground cursor-pointer">
                С фото
              </label>
            </div>
          </div>

          {/* Bottom Row: Advanced Search + Submit */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-border">
            <button className="text-sm text-teal-accent hover:text-teal-dark hover:underline transition-colors">
              Расширенный поиск
            </button>
            <Button size="lg" className="w-full sm:w-auto bg-teal-dark hover:bg-teal-medium text-white px-8">
              <Search className="w-4 h-4 mr-2" />
              Показать объявления
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterSelect({ 
  label, 
  options, 
  disabled = false 
}: { 
  label: string; 
  options: string[]; 
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <select 
        className={`w-full appearance-none bg-white border border-border rounded-lg px-3 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-teal-accent focus:border-transparent ${
          disabled ? 'text-muted-foreground bg-gray-50 cursor-not-allowed' : 'text-foreground cursor-pointer'
        }`}
        disabled={disabled}
        defaultValue={options[0]}
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      <span className="absolute -top-2 left-2 px-1 bg-white text-xs text-muted-foreground">
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
            className="w-1/2 bg-white border border-border border-r-0 rounded-l-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-accent focus:border-transparent focus:z-10"
          />
          <input
            type="text"
            placeholder={placeholderTo}
            className="w-1/2 bg-white border border-border rounded-r-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-accent focus:border-transparent"
          />
        </div>
        <span className="absolute -top-2 left-2 px-1 bg-white text-xs text-muted-foreground">
          {label}
        </span>
      </div>
    </div>
  );
}
