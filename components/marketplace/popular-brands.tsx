'use client';

import Link from 'next/link';
import { popularBrands } from '@/lib/marketplace-data';
import { BrandLogo } from '@/components/ui/brand-logo';
import { motion } from 'framer-motion';

export function PopularBrands() {
  return (
    <section className="py-14 sm:py-16 bg-card dark:bg-surface-panel border-b-2 border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold font-display text-foreground tracking-[-0.02em] mb-10"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          Популярные марки
        </motion.h2>
        <div className="bg-surface-elevated dark:bg-surface-3 rounded-2xl border-2 border-border p-6 sm:p-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 sm:gap-5">
            {popularBrands.map((brand, i) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.02 }}
              >
                <Link
                  href={`/?make=${encodeURIComponent(brand.name)}`}
                  className="flex flex-col items-center p-5 sm:p-6 bg-card dark:bg-surface-elevated rounded-xl border-2 border-border hover:border-teal-accent/50 dark:hover:border-teal-accent/50 hover:shadow-lg transition-all duration-300 text-center group"
                >
                  <BrandLogo
                    brandName={brand.name}
                    size={56}
                    className="mb-3.5 group-hover:ring-2 group-hover:ring-teal-accent/30 transition-all"
                    fallbackClassName="mb-3.5 text-lg group-hover:bg-teal-accent/15 group-hover:text-teal-accent dark:group-hover:text-teal-accent transition-colors duration-300"
                  />
                  <div className="text-base font-semibold text-foreground truncate w-full">
                    {brand.name}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1 font-medium">
                    {new Intl.NumberFormat('ru-RU').format(brand.count)}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
