'use client';

import { cn } from '@/lib/utils';

const FILTERS = [
  { id: 'no_paint', label: 'Без окрасов' },
  { id: 'owners_12', label: '1-2 хоз' },
  { id: 'pts_original', label: 'ПТС оригинал' },
  { id: 'avtoteka_green', label: 'Зелёная автотека' },
  { id: 'no_taxi', label: 'Не такси' },
  { id: 'price_in_hand', label: 'Цена в руки' },
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

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {FILTERS.map((f) => (
        <button
          key={f.id}
          onClick={() => toggle(f.id)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors',
            active.includes(f.id)
              ? 'bg-[var(--accent-bg-soft)] text-teal-accent border-[var(--accent-border-soft)]'
              : 'bg-card/95 dark:bg-surface-elevated/90 backdrop-blur-sm border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
