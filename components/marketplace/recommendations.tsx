'use client';

import { useRef, useEffect } from 'react';
import { vehicles } from '@/lib/marketplace-data';
import { VehicleCard } from './vehicle-card';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Recommendations() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !gridRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = gridRef.current.querySelectorAll('a');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            end: 'top 55%',
            scrub: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 bg-card dark:bg-surface-panel border-b-2 border-border relative">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground tracking-[-0.02em]">
            Рекомендации
          </h2>
          <Link
            href="#"
            className="flex items-center gap-2 text-base font-semibold text-teal-accent hover:text-teal-dark dark:hover:text-seafoam transition-colors group"
          >
            <span>Смотреть все</span>
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="bg-surface-elevated dark:bg-surface-3 rounded-2xl border-2 border-border p-6 sm:p-8">
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7"
          >
            {vehicles.slice(0, 8).map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
