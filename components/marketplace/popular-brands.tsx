import Link from 'next/link';
import { popularBrands } from '@/lib/marketplace-data';

export function PopularBrands() {
  return (
    <section className="py-6 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Популярные марки
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {popularBrands.map((brand) => (
            <Link
              key={brand.name}
              href={`/?make=${encodeURIComponent(brand.name)}`}
              className="flex flex-col items-center p-3 bg-card rounded-lg border border-border hover:border-teal-accent hover:shadow-sm transition-all text-center group"
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-2 text-sm font-medium text-muted-foreground group-hover:bg-surface-light group-hover:text-teal-dark transition-colors">
                {brand.name.charAt(0)}
              </div>
              <div className="text-sm font-medium text-foreground truncate w-full">
                {brand.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {new Intl.NumberFormat('ru-RU').format(brand.count)}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
