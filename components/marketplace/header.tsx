'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Plus, LayoutGrid, List, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ViewMode = 'cards' | 'compact' | 'table';

function ViewModeSwitcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get('view') ?? 'cards';
  if (pathname !== '/') return null;

  const buildHref = (mode: ViewMode) => {
    const params = new URLSearchParams(searchParams.toString());
    if (mode === 'cards') params.delete('view');
    else params.set('view', mode);
    const qs = params.toString();
    return qs ? `/?${qs}` : '/';
  };

  return (
    <div className="hidden sm:flex items-center border border-border rounded-lg p-0.5">
      {(['cards', 'compact', 'table'] as ViewMode[]).map((mode) => (
        <Link
          key={mode}
          href={buildHref(mode)}
          className={cn(
            'p-1.5 rounded-md transition-colors',
            view === mode ? 'bg-[var(--accent-bg-soft)] text-teal-accent' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          )}
          aria-label={mode === 'cards' ? 'Карточки' : mode === 'compact' ? 'Компактный список' : 'Таблица'}
        >
          {mode === 'cards' && <LayoutGrid className="w-4 h-4" />}
          {mode === 'compact' && <List className="w-4 h-4" />}
          {mode === 'table' && <Table className="w-4 h-4" />}
        </Link>
      ))}
    </div>
  );
}

const NAV_LINKS = [
  { href: '/', label: 'В продаже', match: (p: string, m: string | null, s: string | null) => p === '/' && !m && !s },
  { href: '/wanted', label: 'В подбор', match: (p: string) => p === '/wanted' },
  { href: '/?mode=pre_resources', label: 'До ресурсов', match: (_: string, m: string | null) => m === 'pre_resources' },
  { href: '/?mode=on_resources', label: 'На ресурсах', match: (_: string, m: string | null) => m === 'on_resources' },
  { href: '/?seller=owner', label: 'Собственники', match: (_: string, _m: string | null, s: string | null) => s === 'owner' },
  { href: '/?seller=flip', label: 'Перепродажа', match: (_: string, _m: string | null, s: string | null) => s === 'flip' },
] as const;

function NavLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const seller = searchParams.get('seller');

  return (
    <>
      {NAV_LINKS.map((link) => {
        const isActive = link.match(pathname, mode, seller);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors min-h-[36px] flex items-center justify-center',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              isActive
                ? 'text-foreground bg-muted dark:bg-white/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}

export function MarketplaceHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-30 border-b transition-all duration-300',
        scrolled
          ? 'bg-card/92 dark:bg-surface-overlay backdrop-blur-xl border-border'
          : 'bg-card/80 dark:bg-surface-2/95 border-border'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-teal-dark dark:bg-teal-accent rounded-lg flex items-center justify-center">
              <span className="text-white dark:text-[#09090B] font-bold text-xs">АС</span>
            </div>
            <span className="font-semibold text-foreground hidden sm:block text-sm font-display">
              АвтоСделка
            </span>
          </Link>

          <nav className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide py-2 -mx-1" aria-label="Режимы просмотра">
            <Suspense fallback={<div className="flex gap-0.5">{[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-9 w-20 rounded-md bg-muted animate-pulse" />)}</div>}>
              <NavLinks />
            </Suspense>
          </nav>

          <div className="flex items-center gap-1 shrink-0">
            <Suspense fallback={null}>
              <ViewModeSwitcher />
            </Suspense>
            <Button
              size="sm"
              className="bg-teal-dark dark:bg-teal-accent hover:bg-teal-medium dark:hover:bg-seafoam text-white dark:text-[#09090B] h-8 px-3 text-xs font-semibold"
              asChild
            >
              <Link href="/listing/new">
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Подать
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
