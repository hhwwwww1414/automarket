'use client';

import { useState } from 'react';
import { MarketplaceHeader } from '@/components/marketplace/header';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Car,
  Wrench,
  FileText,
  ShieldCheck,
  Handshake,
  Camera,
  Search,
  Check,
  AlertCircle,
} from 'lucide-react';

// ─── Scenario Selector ───────────────────────────────────────────────────────

type Scenario = 'sale' | 'wanted';

// ─── Sale Steps ──────────────────────────────────────────────────────────────

const SALE_STEPS = [
  { id: 1, title: 'База', desc: 'Марка, модель, год, город, VIN', icon: Car },
  { id: 2, title: 'Техника', desc: 'Мотор, КПП, привод, пробег', icon: Wrench },
  { id: 3, title: 'История', desc: 'Владельцы, ПТС, окрасы, ДТП', icon: FileText },
  { id: 4, title: 'Состояние', desc: 'Техника, ключи, стёкла, вложения', icon: ShieldCheck },
  { id: 5, title: 'Сделка', desc: 'Цена, торг, ресурсы, тип', icon: Handshake },
  { id: 6, title: 'Фото', desc: 'Фотографии и описание', icon: Camera },
];

// ─── Field components ────────────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
      {children}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </label>
  );
}

function TextInput({
  placeholder,
  value,
  onChange,
  type = 'text',
}: {
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground',
        'placeholder:text-muted-foreground/60',
        'focus:outline-none focus:ring-2 focus:ring-teal-accent/40 focus:border-teal-accent/60',
        'transition-colors'
      )}
    />
  );
}

function SelectInput({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground',
        'focus:outline-none focus:ring-2 focus:ring-teal-accent/40 focus:border-teal-accent/60',
        'transition-colors',
        !value && 'text-muted-foreground/70'
      )}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function ToggleGroup({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors',
            value === o.value
              ? 'bg-[var(--accent-bg-soft)] text-teal-accent border-[var(--accent-border-soft)]'
              : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function CheckToggle({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-colors',
        checked
          ? 'bg-[var(--accent-bg-soft)] border-[var(--accent-border-soft)] text-foreground'
          : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
      )}
    >
      <span
        className={cn(
          'w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors',
          checked
            ? 'bg-teal-accent border-teal-accent'
            : 'border-border bg-background'
        )}
      >
        {checked && <Check className="w-3 h-3 text-[#09090B]" />}
      </span>
      <span className="flex-1">{label}</span>
      {hint && <span className="text-xs text-muted-foreground/60">{hint}</span>}
    </button>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border/60">{children}</h3>
  );
}

function FieldGroup({ children, cols = 1 }: { children: React.ReactNode; cols?: 1 | 2 | 3 }) {
  return (
    <div
      className={cn(
        'grid gap-4',
        cols === 2 && 'sm:grid-cols-2',
        cols === 3 && 'sm:grid-cols-3'
      )}
    >
      {children}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      {children}
    </div>
  );
}

// ─── Step content ─────────────────────────────────────────────────────────────

function SaleStep1({ data, setData }: { data: SaleFormData; setData: (d: SaleFormData) => void }) {
  return (
    <div className="space-y-6">
      <SectionTitle>Основные данные</SectionTitle>
      <FieldGroup cols={2}>
        <Field label="Марка" required>
          <SelectInput
            options={['Audi', 'BMW', 'Hyundai', 'Kia', 'Лада', 'Mercedes-Benz', 'Skoda', 'Toyota', 'Volkswagen', 'Другая']}
            value={data.make}
            onChange={(v) => setData({ ...data, make: v })}
            placeholder="Выберите марку"
          />
        </Field>
        <Field label="Модель" required>
          <TextInput placeholder="например, Camry" value={data.model} onChange={(v) => setData({ ...data, model: v })} />
        </Field>
        <Field label="Поколение">
          <TextInput placeholder="например, XV70" value={data.generation} onChange={(v) => setData({ ...data, generation: v })} />
        </Field>
        <Field label="Год выпуска" required>
          <TextInput type="number" placeholder="2020" value={data.year} onChange={(v) => setData({ ...data, year: v })} />
        </Field>
      </FieldGroup>

      <FieldGroup cols={2}>
        <Field label="VIN-код">
          <TextInput placeholder="17 символов" value={data.vin} onChange={(v) => setData({ ...data, vin: v.toUpperCase() })} />
        </Field>
        <Field label="Город осмотра" required>
          <TextInput placeholder="Москва" value={data.city} onChange={(v) => setData({ ...data, city: v })} />
        </Field>
      </FieldGroup>

      <div>
        <SectionTitle>Цена</SectionTitle>
        <FieldGroup cols={3}>
          <Field label="Цена объявления" required>
            <TextInput type="number" placeholder="1 500 000" value={data.price} onChange={(v) => setData({ ...data, price: v })} />
          </Field>
          <Field label="Цена в руки">
            <TextInput type="number" placeholder="1 450 000" value={data.priceInHand} onChange={(v) => setData({ ...data, priceInHand: v })} />
          </Field>
          <Field label="Цена на ресурсах">
            <TextInput type="number" placeholder="1 560 000" value={data.priceOnResources} onChange={(v) => setData({ ...data, priceOnResources: v })} />
          </Field>
        </FieldGroup>
      </div>

      <Field label="Тип кузова">
        <ToggleGroup
          options={[
            { value: 'Седан', label: 'Седан' },
            { value: 'Лифтбек', label: 'Лифтбек' },
            { value: 'Хэтчбек', label: 'Хэтчбек' },
            { value: 'Внедорожник', label: 'Внедорожник' },
            { value: 'Универсал', label: 'Универсал' },
            { value: 'Купе', label: 'Купе' },
            { value: 'Другой', label: 'Другой' },
          ]}
          value={data.bodyType}
          onChange={(v) => setData({ ...data, bodyType: v })}
        />
      </Field>
    </div>
  );
}

function SaleStep2({ data, setData }: { data: SaleFormData; setData: (d: SaleFormData) => void }) {
  return (
    <div className="space-y-6">
      <SectionTitle>Силовой агрегат</SectionTitle>
      <FieldGroup cols={2}>
        <Field label="Двигатель" required>
          <TextInput placeholder="2.0 л / Бензин" value={data.engine} onChange={(v) => setData({ ...data, engine: v })} />
        </Field>
        <Field label="Мощность, л.с.">
          <TextInput type="number" placeholder="150" value={data.power} onChange={(v) => setData({ ...data, power: v })} />
        </Field>
      </FieldGroup>

      <Field label="Коробка передач" required>
        <ToggleGroup
          options={[
            { value: 'МКПП', label: 'МКПП' },
            { value: 'АКПП', label: 'АКПП' },
            { value: 'Робот', label: 'Робот' },
            { value: 'Вариатор', label: 'Вариатор' },
          ]}
          value={data.transmission}
          onChange={(v) => setData({ ...data, transmission: v })}
        />
      </Field>

      <Field label="Привод" required>
        <ToggleGroup
          options={[
            { value: 'Передний', label: 'Передний' },
            { value: 'Задний', label: 'Задний' },
            { value: 'Полный', label: 'Полный' },
          ]}
          value={data.drive}
          onChange={(v) => setData({ ...data, drive: v })}
        />
      </Field>

      <FieldGroup cols={2}>
        <Field label="Пробег, км" required>
          <TextInput type="number" placeholder="65 000" value={data.mileage} onChange={(v) => setData({ ...data, mileage: v })} />
        </Field>
        <Field label="Руль">
          <ToggleGroup
            options={[
              { value: 'Левый', label: 'Левый' },
              { value: 'Правый', label: 'Правый' },
            ]}
            value={data.steering}
            onChange={(v) => setData({ ...data, steering: v })}
          />
        </Field>
      </FieldGroup>

      <FieldGroup cols={2}>
        <Field label="Цвет">
          <TextInput placeholder="Белый" value={data.color} onChange={(v) => setData({ ...data, color: v })} />
        </Field>
        <Field label="Комплектация">
          <TextInput placeholder="Comfort, Style…" value={data.trim} onChange={(v) => setData({ ...data, trim: v })} />
        </Field>
      </FieldGroup>
    </div>
  );
}

function SaleStep3({ data, setData }: { data: SaleFormData; setData: (d: SaleFormData) => void }) {
  return (
    <div className="space-y-6">
      <SectionTitle>Владение и документы</SectionTitle>
      <FieldGroup cols={3}>
        <Field label="Владельцев по ПТС" required>
          <TextInput type="number" placeholder="1" value={data.owners} onChange={(v) => setData({ ...data, owners: v })} />
        </Field>
        <Field label="Регистраций">
          <TextInput type="number" placeholder="1" value={data.registrations} onChange={(v) => setData({ ...data, registrations: v })} />
        </Field>
        <Field label="Ключей">
          <ToggleGroup
            options={[
              { value: '1', label: '1 ключ' },
              { value: '2', label: '2 ключа' },
              { value: '3+', label: '3+' },
            ]}
            value={data.keysCount}
            onChange={(v) => setData({ ...data, keysCount: v })}
          />
        </Field>
      </FieldGroup>

      <Field label="ПТС">
        <ToggleGroup
          options={[
            { value: 'original', label: 'Оригинал' },
            { value: 'duplicate', label: 'Дубликат' },
            { value: 'epts', label: 'ЭПТС' },
          ]}
          value={data.ptsType}
          onChange={(v) => setData({ ...data, ptsType: v })}
        />
      </Field>

      <SectionTitle>Кузов и окрасы</SectionTitle>
      <FieldGroup cols={2}>
        <Field label="Количество окрашенных элементов">
          <ToggleGroup
            options={[
              { value: '0', label: 'Без окрасов' },
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4+', label: '4+' },
            ]}
            value={data.paintCount}
            onChange={(v) => setData({ ...data, paintCount: v })}
          />
        </Field>
        <Field label="Какие элементы окрашены">
          <TextInput
            placeholder="задний бампер, капот…"
            value={data.paintedElements}
            onChange={(v) => setData({ ...data, paintedElements: v })}
          />
        </Field>
      </FieldGroup>

      <SectionTitle>История</SectionTitle>
      <div className="space-y-2">
        <CheckToggle
          label="Не такси"
          checked={data.notTaxi}
          onChange={(v) => setData({ ...data, notTaxi: v })}
        />
        <CheckToggle
          label="Не каршеринг"
          checked={data.notCarsharing}
          onChange={(v) => setData({ ...data, notCarsharing: v })}
        />
        <CheckToggle
          label="Нет ДТП по автотеке"
          checked={data.avtotekaGreen}
          onChange={(v) => setData({ ...data, avtotekaGreen: v })}
        />
        <CheckToggle
          label="Нет ограничений / залогов"
          checked={data.noRestrictions}
          onChange={(v) => setData({ ...data, noRestrictions: v })}
        />
      </div>
    </div>
  );
}

function SaleStep4({ data, setData }: { data: SaleFormData; setData: (d: SaleFormData) => void }) {
  return (
    <div className="space-y-6">
      <SectionTitle>Техническое состояние</SectionTitle>
      <div className="space-y-2">
        <CheckToggle
          label="Техника в порядке"
          checked={data.techOk}
          onChange={(v) => setData({ ...data, techOk: v })}
          hint="Нет нареканий"
        />
        <CheckToggle
          label="Оригинальные стёкла"
          checked={data.glassOriginal}
          onChange={(v) => setData({ ...data, glassOriginal: v })}
        />
        <CheckToggle
          label="Без вложений"
          checked={data.noInvestment}
          onChange={(v) => setData({ ...data, noInvestment: v })}
          hint="Продаётся как есть"
        />
      </div>

      {!data.noInvestment && (
        <Field label="Что нужно сделать / вложить">
          <textarea
            placeholder="Опишите необходимые работы или вложения"
            value={data.investmentNote}
            onChange={(e) => setData({ ...data, investmentNote: e.target.value })}
            rows={3}
            className={cn(
              'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground resize-none',
              'placeholder:text-muted-foreground/60',
              'focus:outline-none focus:ring-2 focus:ring-teal-accent/40 focus:border-teal-accent/60'
            )}
          />
        </Field>
      )}

      <SectionTitle>Резина</SectionTitle>
      <FieldGroup cols={2}>
        <Field label="Резина">
          <ToggleGroup
            options={[
              { value: 'Лето', label: 'Лето' },
              { value: 'Зима', label: 'Зима' },
              { value: 'Всесезон', label: 'Всесезон' },
              { value: 'Нет', label: 'Нет' },
            ]}
            value={data.tires}
            onChange={(v) => setData({ ...data, tires: v })}
          />
        </Field>
        <Field label="Второй комплект резины">
          <ToggleGroup
            options={[
              { value: 'yes', label: 'Есть' },
              { value: 'no', label: 'Нет' },
            ]}
            value={data.extraTires}
            onChange={(v) => setData({ ...data, extraTires: v })}
          />
        </Field>
      </FieldGroup>
    </div>
  );
}

function SaleStep5({ data, setData }: { data: SaleFormData; setData: (d: SaleFormData) => void }) {
  return (
    <div className="space-y-6">
      <SectionTitle>Условия сделки</SectionTitle>
      <div className="space-y-2">
        <CheckToggle
          label="Торг уместен"
          checked={data.trade}
          onChange={(v) => setData({ ...data, trade: v })}
        />
        <CheckToggle
          label="Откат (откат агентам)"
          checked={data.kickback}
          onChange={(v) => setData({ ...data, kickback: v })}
        />
      </div>

      <Field label="Тип продавца">
        <ToggleGroup
          options={[
            { value: 'owner', label: 'Собственник' },
            { value: 'flip', label: 'Перепродажа' },
            { value: 'broker', label: 'Подбор' },
            { value: 'commission', label: 'Комиссия' },
          ]}
          value={data.sellerType}
          onChange={(v) => setData({ ...data, sellerType: v })}
        />
      </Field>

      <Field label="На ресурсах">
        <ToggleGroup
          options={[
            { value: 'not_listed', label: 'Не размещён' },
            { value: 'pre_resources', label: 'До ресурсов' },
            { value: 'on_resources', label: 'На ресурсах' },
          ]}
          value={data.resourceStatus}
          onChange={(v) => setData({ ...data, resourceStatus: v })}
        />
      </Field>

      <Field label="Контакт для связи" required>
        <TextInput
          placeholder="+7 (900) 000-00-00 или tg/@username"
          value={data.contact}
          onChange={(v) => setData({ ...data, contact: v })}
        />
      </Field>
    </div>
  );
}

function SaleStep6({ data, setData }: { data: SaleFormData; setData: (d: SaleFormData) => void }) {
  return (
    <div className="space-y-6">
      <SectionTitle>Фотографии</SectionTitle>
      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center text-sm text-muted-foreground hover:border-teal-accent/40 transition-colors cursor-pointer">
        <Camera className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p className="font-medium">Перетащите фото сюда или нажмите для загрузки</p>
        <p className="text-xs mt-1 text-muted-foreground/60">
          JPG, PNG, WebP — до 10 МБ каждое. Первое фото — обложка.
        </p>
      </div>

      <Field label="Ссылка на видео (YouTube, VK)">
        <TextInput
          placeholder="https://..."
          value={data.videoUrl}
          onChange={(v) => setData({ ...data, videoUrl: v })}
        />
      </Field>

      <SectionTitle>Описание</SectionTitle>
      <Field label="Комментарий продавца" required>
        <textarea
          placeholder="Опишите автомобиль честно: состояние, история, что сделано, что нет, почему продаёте…"
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          rows={5}
          className={cn(
            'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground resize-none',
            'placeholder:text-muted-foreground/60',
            'focus:outline-none focus:ring-2 focus:ring-teal-accent/40 focus:border-teal-accent/60'
          )}
        />
      </Field>
    </div>
  );
}

// ─── Wanted Form ──────────────────────────────────────────────────────────────

interface WantedFormData {
  models: string;
  budgetMin: string;
  budgetMax: string;
  yearFrom: string;
  mileageMax: string;
  engine: string;
  transmission: string;
  drive: string;
  ownersMax: string;
  paintAllowed: boolean;
  notTaxi: boolean;
  notCarsharing: boolean;
  notSalon: boolean;
  notChina: boolean;
  ptsOriginalOnly: boolean;
  ownerOnly: boolean;
  sendAvtoteka: boolean;
  region: string;
  comment: string;
  contact: string;
}

const defaultWantedData: WantedFormData = {
  models: '',
  budgetMin: '',
  budgetMax: '',
  yearFrom: '',
  mileageMax: '',
  engine: '',
  transmission: '',
  drive: '',
  ownersMax: '',
  paintAllowed: false,
  notTaxi: true,
  notCarsharing: true,
  notSalon: false,
  notChina: false,
  ptsOriginalOnly: false,
  ownerOnly: false,
  sendAvtoteka: false,
  region: '',
  comment: '',
  contact: '',
};

function WantedForm({ data, setData }: { data: WantedFormData; setData: (d: WantedFormData) => void }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[var(--accent-border-soft)] bg-[var(--accent-bg-soft)] px-4 py-3 flex gap-2 text-sm text-teal-accent">
        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
        <span>Заявка попадает в ленту "В подбор" — любой участник сможет предложить вам подходящий лот.</span>
      </div>

      <SectionTitle>Что ищу</SectionTitle>
      <Field label="Марки и модели (через запятую)" required>
        <TextInput
          placeholder="Toyota Camry, Skoda Octavia A7"
          value={data.models}
          onChange={(v) => setData({ ...data, models: v })}
        />
      </Field>

      <FieldGroup cols={2}>
        <Field label="Бюджет от">
          <TextInput type="number" placeholder="1 500 000" value={data.budgetMin} onChange={(v) => setData({ ...data, budgetMin: v })} />
        </Field>
        <Field label="Бюджет до" required>
          <TextInput type="number" placeholder="2 000 000" value={data.budgetMax} onChange={(v) => setData({ ...data, budgetMax: v })} />
        </Field>
        <Field label="Год выпуска от">
          <TextInput type="number" placeholder="2018" value={data.yearFrom} onChange={(v) => setData({ ...data, yearFrom: v })} />
        </Field>
        <Field label="Пробег до, км">
          <TextInput type="number" placeholder="100 000" value={data.mileageMax} onChange={(v) => setData({ ...data, mileageMax: v })} />
        </Field>
      </FieldGroup>

      <SectionTitle>Параметры</SectionTitle>
      <FieldGroup cols={2}>
        <Field label="Двигатель">
          <TextInput placeholder="1.6 / 2.0 / любой" value={data.engine} onChange={(v) => setData({ ...data, engine: v })} />
        </Field>
        <Field label="Владельцев не более">
          <ToggleGroup
            options={[
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: 'any', label: 'Любое' },
            ]}
            value={data.ownersMax}
            onChange={(v) => setData({ ...data, ownersMax: v })}
          />
        </Field>
      </FieldGroup>

      <Field label="КПП">
        <ToggleGroup
          options={[
            { value: 'МКПП', label: 'МКПП' },
            { value: 'АКПП', label: 'АКПП' },
            { value: 'Робот', label: 'Робот' },
            { value: 'Вариатор', label: 'Вариатор' },
            { value: 'Любая', label: 'Любая' },
          ]}
          value={data.transmission}
          onChange={(v) => setData({ ...data, transmission: v })}
        />
      </Field>

      <Field label="Привод">
        <ToggleGroup
          options={[
            { value: 'Передний', label: 'Передний' },
            { value: 'Задний', label: 'Задний' },
            { value: 'Полный', label: 'Полный' },
            { value: 'Любой', label: 'Любой' },
          ]}
          value={data.drive}
          onChange={(v) => setData({ ...data, drive: v })}
        />
      </Field>

      <Field label="Окрасы">
        <ToggleGroup
          options={[
            { value: 'false', label: 'Без окрасов' },
            { value: 'true', label: 'Допустимы' },
          ]}
          value={String(data.paintAllowed)}
          onChange={(v) => setData({ ...data, paintAllowed: v === 'true' })}
        />
      </Field>

      <SectionTitle>Ограничения</SectionTitle>
      <div className="space-y-2">
        <CheckToggle label="Не такси" checked={data.notTaxi} onChange={(v) => setData({ ...data, notTaxi: v })} />
        <CheckToggle label="Не каршеринг" checked={data.notCarsharing} onChange={(v) => setData({ ...data, notCarsharing: v })} />
        <CheckToggle label="Не из салона (не дилерский)" checked={data.notSalon} onChange={(v) => setData({ ...data, notSalon: v })} />
        <CheckToggle label="Не Китай" checked={data.notChina} onChange={(v) => setData({ ...data, notChina: v })} />
        <CheckToggle label="ПТС только оригинал" checked={data.ptsOriginalOnly} onChange={(v) => setData({ ...data, ptsOriginalOnly: v })} />
        <CheckToggle label="Только от собственника" checked={data.ownerOnly} onChange={(v) => setData({ ...data, ownerOnly: v })} />
        <CheckToggle label="Присылать только с автотекой" checked={data.sendAvtoteka} onChange={(v) => setData({ ...data, sendAvtoteka: v })} />
      </div>

      <SectionTitle>Контакт и регион</SectionTitle>
      <FieldGroup cols={2}>
        <Field label="Регион">
          <TextInput placeholder="Москва и МО" value={data.region} onChange={(v) => setData({ ...data, region: v })} />
        </Field>
        <Field label="Как связаться" required>
          <TextInput placeholder="+7 (900) … или tg/@username" value={data.contact} onChange={(v) => setData({ ...data, contact: v })} />
        </Field>
      </FieldGroup>

      <Field label="Комментарий">
        <textarea
          placeholder="Уточните детали: какое состояние ищете, для чего берёте, как быстро готовы принять решение…"
          value={data.comment}
          onChange={(e) => setData({ ...data, comment: e.target.value })}
          rows={4}
          className={cn(
            'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground resize-none',
            'placeholder:text-muted-foreground/60',
            'focus:outline-none focus:ring-2 focus:ring-teal-accent/40 focus:border-teal-accent/60'
          )}
        />
      </Field>
    </div>
  );
}

// ─── Sale Form state ──────────────────────────────────────────────────────────

interface SaleFormData {
  make: string;
  model: string;
  generation: string;
  year: string;
  vin: string;
  city: string;
  price: string;
  priceInHand: string;
  priceOnResources: string;
  bodyType: string;
  engine: string;
  power: string;
  transmission: string;
  drive: string;
  mileage: string;
  steering: string;
  color: string;
  trim: string;
  owners: string;
  registrations: string;
  keysCount: string;
  ptsType: string;
  paintCount: string;
  paintedElements: string;
  notTaxi: boolean;
  notCarsharing: boolean;
  avtotekaGreen: boolean;
  noRestrictions: boolean;
  techOk: boolean;
  glassOriginal: boolean;
  noInvestment: boolean;
  investmentNote: string;
  tires: string;
  extraTires: string;
  trade: boolean;
  kickback: boolean;
  sellerType: string;
  resourceStatus: string;
  contact: string;
  videoUrl: string;
  description: string;
}

const defaultSaleData: SaleFormData = {
  make: '',
  model: '',
  generation: '',
  year: '',
  vin: '',
  city: '',
  price: '',
  priceInHand: '',
  priceOnResources: '',
  bodyType: '',
  engine: '',
  power: '',
  transmission: '',
  drive: '',
  mileage: '',
  steering: 'Левый',
  color: '',
  trim: '',
  owners: '',
  registrations: '',
  keysCount: '2',
  ptsType: 'original',
  paintCount: '0',
  paintedElements: '',
  notTaxi: true,
  notCarsharing: true,
  avtotekaGreen: false,
  noRestrictions: false,
  techOk: true,
  glassOriginal: false,
  noInvestment: true,
  investmentNote: '',
  tires: '',
  extraTires: 'no',
  trade: false,
  kickback: false,
  sellerType: 'owner',
  resourceStatus: 'not_listed',
  contact: '',
  videoUrl: '',
  description: '',
};

// ─── Progress stepper ─────────────────────────────────────────────────────────

function StepBar({
  steps,
  current,
  onSelect,
}: {
  steps: typeof SALE_STEPS;
  current: number;
  onSelect: (n: number) => void;
}) {
  return (
    <nav className="mb-8" aria-label="Шаги формы">
      {/* Mobile: progress bar */}
      <div className="sm:hidden mb-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
          <span>{steps[current - 1].title}</span>
          <span>{current} / {steps.length}</span>
        </div>
        <div className="h-1.5 rounded-full bg-border overflow-hidden">
          <div
            className="h-full bg-teal-accent transition-all duration-300 rounded-full"
            style={{ width: `${(current / steps.length) * 100}%` }}
          />
        </div>
      </div>
      {/* Desktop: step pills */}
      <ol className="hidden sm:flex items-center gap-0 overflow-x-auto scrollbar-hide">
        {steps.map((s, i) => {
          const done = s.id < current;
          const active = s.id === current;
          const Icon = s.icon;
          return (
            <li key={s.id} className="flex items-center">
              <button
                type="button"
                onClick={() => onSelect(s.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                  active
                    ? 'bg-[var(--accent-bg-soft)] text-teal-accent'
                    : done
                    ? 'text-foreground/70 hover:text-foreground hover:bg-muted/40'
                    : 'text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/30'
                )}
              >
                <span
                  className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0',
                    active
                      ? 'bg-teal-accent text-[#09090B]'
                      : done
                      ? 'bg-success/20 text-success'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {done ? <Check className="w-3 h-3" /> : s.id}
                </span>
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                {s.title}
              </button>
              {i < steps.length - 1 && (
                <span className="mx-1 text-border text-xs">›</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NewListingPage() {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [step, setStep] = useState(1);
  const [saleData, setSaleData] = useState<SaleFormData>(defaultSaleData);
  const [wantedData, setWantedData] = useState<WantedFormData>(defaultWantedData);
  const [submitted, setSubmitted] = useState(false);

  const maxStep = SALE_STEPS.length;

  const handleSubmit = () => setSubmitted(true);

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <MarketplaceHeader />
        <main className="max-w-xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-success" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">
            {scenario === 'sale' ? 'Объявление отправлено' : 'Запрос размещён'}
          </h1>
          <p className="text-muted-foreground mb-8">
            {scenario === 'sale'
              ? 'Ваше объявление появится в ленте после проверки. Обычно это занимает до 15 минут.'
              : 'Ваш запрос в подбор опубликован. Участники платформы смогут предложить подходящий лот.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/"
              className="px-6 py-2.5 rounded-lg bg-teal-dark dark:bg-teal-accent text-white dark:text-[#09090B] font-semibold text-sm hover:opacity-90"
            >
              На главную
            </a>
            <button
              onClick={() => {
                setScenario(null);
                setStep(1);
                setSaleData(defaultSaleData);
                setWantedData(defaultWantedData);
                setSubmitted(false);
              }}
              className="px-6 py-2.5 rounded-lg border border-border text-foreground text-sm hover:bg-muted/40"
            >
              Подать ещё
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-xl font-semibold text-foreground mb-6">Подать объявление</h1>

        {/* Scenario selector */}
        {!scenario && (
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Scenario card — Sale */}
            <button
              onClick={() => setScenario('sale')}
              className="card-interactive relative p-5 rounded-xl border border-border bg-card dark:bg-surface-elevated text-left overflow-hidden hover:border-teal-accent/35 transition-[border-color,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span aria-hidden="true" className="card-press-carbon absolute inset-0 rounded-[inherit] pointer-events-none z-[1] opacity-0 transition-opacity duration-[180ms] ease-out" />
              <div className="relative z-[2]">
                <div className="w-10 h-10 rounded-lg bg-teal-accent/15 flex items-center justify-center mb-3">
                  <Car className="w-5 h-5 text-teal-accent" />
                </div>
                <h2 className="font-semibold text-foreground mb-1">Продаю автомобиль</h2>
                <p className="text-sm text-muted-foreground">
                  Подать объявление о продаже — фото, параметры, цена, условия
                </p>
              </div>
            </button>

            {/* Scenario card — Wanted */}
            <button
              onClick={() => setScenario('wanted')}
              className="card-interactive relative p-5 rounded-xl border border-border bg-card dark:bg-surface-elevated text-left overflow-hidden hover:border-teal-accent/35 transition-[border-color,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span aria-hidden="true" className="card-press-carbon absolute inset-0 rounded-[inherit] pointer-events-none z-[1] opacity-0 transition-opacity duration-[180ms] ease-out" />
              <div className="relative z-[2]">
                <div className="w-10 h-10 rounded-lg bg-teal-accent/15 flex items-center justify-center mb-3">
                  <Search className="w-5 h-5 text-teal-accent" />
                </div>
                <h2 className="font-semibold text-foreground mb-1">Ищу автомобиль</h2>
                <p className="text-sm text-muted-foreground">
                  Разместить запрос в подбор — участники предложат подходящий вариант
                </p>
              </div>
            </button>
          </div>
        )}

        {/* Sale multi-step form */}
        {scenario === 'sale' && (
          <>
            <StepBar steps={SALE_STEPS} current={step} onSelect={(n) => n < step && setStep(n)} />

            <div className="bg-card dark:bg-surface-elevated rounded-xl border border-border p-5 sm:p-6">
              {step === 1 && <SaleStep1 data={saleData} setData={setSaleData} />}
              {step === 2 && <SaleStep2 data={saleData} setData={setSaleData} />}
              {step === 3 && <SaleStep3 data={saleData} setData={setSaleData} />}
              {step === 4 && <SaleStep4 data={saleData} setData={setSaleData} />}
              {step === 5 && <SaleStep5 data={saleData} setData={setSaleData} />}
              {step === 6 && <SaleStep6 data={saleData} setData={setSaleData} />}

              <div className="flex items-center justify-between mt-8 pt-5 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (step === 1) {
                      setScenario(null);
                    } else {
                      setStep((s) => s - 1);
                    }
                  }}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  {step === 1 ? 'Назад' : 'Назад'}
                </Button>

                {step < maxStep ? (
                  <Button
                    size="sm"
                    onClick={() => setStep((s) => s + 1)}
                    className="bg-teal-dark dark:bg-teal-accent text-white dark:text-[#09090B]"
                  >
                    Далее
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    className="bg-teal-dark dark:bg-teal-accent text-white dark:text-[#09090B]"
                  >
                    Опубликовать
                  </Button>
                )}
              </div>
            </div>
          </>
        )}

        {/* Wanted one-page form */}
        {scenario === 'wanted' && (
          <>
            <button
              onClick={() => setScenario(null)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Назад
            </button>
            <div className="bg-card dark:bg-surface-elevated rounded-xl border border-border p-5 sm:p-6">
              <WantedForm data={wantedData} setData={setWantedData} />
              <div className="flex justify-end mt-8 pt-5 border-t border-border">
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  className="bg-teal-dark dark:bg-teal-accent text-white dark:text-[#09090B]"
                >
                  Разместить запрос
                </Button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
