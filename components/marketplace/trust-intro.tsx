'use client';

import { motion, useReducedMotion } from 'framer-motion';

const stats = [
  { value: '50 000+', label: 'Проверенных объявлений' },
  { value: '99%', label: 'Совпадение с ПТС' },
  { value: '24/7', label: 'Проверка VIN' },
];

export function TrustIntro() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative py-14 sm:py-16 bg-card dark:bg-surface-panel border-y-2 border-border">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-14"
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reducedMotion ? false : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              className="text-center sm:text-left"
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={reducedMotion ? false : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              <p className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-2 tracking-[-0.02em]">
                {stat.value}
              </p>
              <p className="text-base sm:text-lg text-muted-foreground font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
