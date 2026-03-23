'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useReducedMotion, motion, useScroll, useTransform } from 'framer-motion';
import { useRive, Fit, Layout } from '@rive-app/react-canvas';
import { Search, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const LINE_1 = 'Премиум маркетплейс автомобилей';
const LINE_2 = <>Найдите свой <span className="text-teal-accent">идеальный</span> автомобиль</>;
const LINE_3 = 'Проверенные объявления. Честные цены. Безопасные сделки.';
const LINE_4 = '50 000+ проверенных объявлений';

const stagger = 0.12;
const duration = 0.5;

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const fmReduced = useReducedMotion();
  const reducedMotion = fmReduced ?? false;

  const { scrollY } = useScroll();
  const textOpacity = useTransform(
    scrollY,
    [0, 200, 400],
    [1, 0.6, 0]
  );
  const textY = useTransform(
    scrollY,
    [0, 200, 400],
    [0, -8, -24]
  );

  const { RiveComponent, rive } = useRive({
    src: '/maincar.riv',
    layout: new Layout({ fit: Fit.Cover }),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!rive) return;
    const play = () => {
      try {
        rive.play();
      } catch {
        rive.reset();
        rive.play();
      }
    };
    play();
    const id = setTimeout(play, 300);
    return () => clearTimeout(id);
  }, [rive]);

  const animate = mounted && !reducedMotion;

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative min-h-[90vh] lg:min-h-[95vh] flex flex-col lg:flex-row items-stretch',
        'border-b-2 border-border bg-card dark:bg-surface-panel',
        reducedMotion && '!min-h-auto'
      )}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-b-3xl" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-teal-accent/[0.03]" />
      </div>
      <motion.div
        className="relative flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-10 xl:px-14 pb-14 lg:pb-20 pt-28 lg:pt-32"
        style={animate ? { opacity: textOpacity, y: textY } : undefined}
      >
        <div className="max-w-2xl">
          <motion.div
            className="text-sm font-semibold text-teal-accent uppercase tracking-[0.2em] opacity-90 mb-5"
            initial={animate ? { opacity: 0, y: 16 } : false}
            animate={animate ? { opacity: 1, y: 0 } : false}
            transition={{ duration, delay: stagger * 0 }}
          >
            {LINE_1}
          </motion.div>
          <motion.div
            className="font-display text-[3rem] sm:text-5xl md:text-6xl xl:text-[4.25rem] font-bold text-foreground tracking-[-0.03em] leading-[1.05] mb-5"
            initial={animate ? { opacity: 0, y: 20 } : false}
            animate={animate ? { opacity: 1, y: 0 } : false}
            transition={{ duration, delay: stagger * 1 }}
          >
            {LINE_2}
          </motion.div>
          <motion.div
            className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed mb-8"
            initial={animate ? { opacity: 0, y: 16 } : false}
            animate={animate ? { opacity: 1, y: 0 } : false}
            transition={{ duration, delay: stagger * 2 }}
          >
            {LINE_3}
          </motion.div>
          <motion.div
            className="flex flex-wrap items-center gap-6"
            initial={animate ? { opacity: 0, y: 16 } : false}
            animate={animate ? { opacity: 1, y: 0 } : false}
            transition={{ duration, delay: stagger * 3 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-teal-dark dark:bg-teal-accent hover:bg-teal-medium dark:hover:bg-seafoam text-white dark:text-[#070809] h-14 px-8 text-base font-semibold shadow-lg"
            >
              <Link href="#search" className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Найти автомобиль
              </Link>
            </Button>
            <div className="flex items-center gap-2.5 text-base text-muted-foreground">
              <Shield className="w-5 h-5 text-teal-accent" />
              <span>{LINE_4}</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="relative flex-1 min-h-[45vh] lg:min-h-0 flex items-center justify-center p-6 lg:p-10 overflow-hidden"
        aria-hidden
        initial={animate ? { opacity: 0, scale: 0.98 } : false}
        animate={animate ? { opacity: 1, scale: 1 } : false}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
      >
        <div className="relative w-full h-full min-h-[280px] lg:min-h-[400px] max-w-2xl rounded-2xl overflow-hidden border border-border/50 shadow-2xl [&>canvas]:!w-full [&>canvas]:!h-full" style={{ minHeight: 320 }}>
          <RiveComponent className="w-full h-full min-h-[280px]" />
        </div>
      </motion.div>
    </section>
  );
}
