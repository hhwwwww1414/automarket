'use client';

import Link from 'next/link';
import { Heart, GitCompare, User, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MarketplaceHeader() {
  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-[auto_1fr_auto] items-center h-14 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-teal-dark rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">АС</span>
            </div>
            <span className="font-semibold text-lg text-foreground hidden sm:block">АвтоСделка</span>
          </Link>

          {/* Main Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-6 text-sm min-w-0">
            <Link href="/" className="text-teal-dark font-medium hover:text-teal-accent transition-colors whitespace-nowrap">
              Все автомобили
            </Link>
            <Link href="/?condition=new" className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
              Новые
            </Link>
            <Link href="/?condition=used" className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
              С пробегом
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
              <Search className="w-4 h-4" />
              <span className="hidden lg:inline">Поиск</span>
            </Button>
            <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
              <Heart className="w-4 h-4" />
              <span className="hidden lg:inline">Избранное</span>
            </Button>
            <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
              <GitCompare className="w-4 h-4" />
              <span className="hidden lg:inline">Сравнение</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
              <User className="w-4 h-4" />
              <span className="hidden lg:inline">Войти</span>
            </Button>
            <Button size="sm" className="bg-teal-dark hover:bg-teal-medium text-white gap-1.5">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Подать объявление</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
