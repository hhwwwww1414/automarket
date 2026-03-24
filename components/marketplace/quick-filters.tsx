'use client';

import { cn } from '@/lib/utils';

const CATEGORY_FILTERS = [
  { id: 'pre_resources', label: 'До ресурсов' },
  { id: 'on_resources', label: 'На ресурсах' },
  { id: 'owner', label: 'Собственники' },
  { id: 'flip', label: 'Перепродажа' },
];

const QUALITY_FILTERS = [
  { id: 'no_paint', label: 'Без окрасов' },
  { id: 'owners_12', label: '1-2 хоз' },
  { id: 'pts_original', label: 'ПТС оригинал' },
  { id: 'avtoteka_green', label: 'Автотека' },
  { id: 'no_taxi', label: 'Не такси' },
  { id: 'price_in_hand', label: 'Цена в руки' },
  { id: 'no_invest', label: 'Без вложений' },
];

interface QuickFiltersProps {
  active?: string[];
  onChange?: (ids: string[]) => void;
  className?: string;
}

export function QuickFilters({ active = [], onChange, className }: QuickFiltersProps) {
  const toggle = (id: string) => {
    if (!onChange) return;
    if (active.includes(id)) {
      onChange(active.filter((a) => a !== id));
    } else {
      onChange([...active, id]);
    }
  };

  const filterBtn = (f: { id: string; label: string }) => (
    <button
      key={f.id}
      onClick={() => toggle(f.id)}
      className={cn(
        'px-3 py-2 rounded-lg text-sm font-medium border transition-colors',
        active.includes(f.id)
          ? 'bg-[var(--accent-bg-soft)] text-teal-accent border-[var(--accent-border-soft)]'
          : 'bg-card/95 dark:bg-surface-elevated/90 backdrop-blur-sm border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
      )}
    >
      {f.label}
    </button>
  );

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {CATEGORY_FILTERS.map(filterBtn)}
      <span className="w-px h-5 bg-border/60 mx-0.5 shrink-0" aria-hidden="true" />
      {QUALITY_FILTERS.map(filterBtn)}
    </div>
  );
}
