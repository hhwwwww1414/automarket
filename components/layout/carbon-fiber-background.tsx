'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface CarbonFiberBackgroundProps {
  className?: string;
  /** В table mode эффект слабее (opacity 0.08) */
  viewMode?: 'cards' | 'compact' | 'table';
}

export function CarbonFiberBackground({ className, viewMode = 'cards' }: CarbonFiberBackgroundProps) {
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mq = window.matchMedia('(max-width: 640px)');

    const handleMotion = () => setReducedMotion(media.matches);
    const handleResize = () => setIsMobile(mq.matches);
    handleMotion();
    handleResize();

    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight || 1;
      const next = Math.min(window.scrollY / max, 1);
      setProgress(next);
    };

    handleScroll();

    media.addEventListener('change', handleMotion);
    mq.addEventListener('change', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      media.removeEventListener('change', handleMotion);
      mq.removeEventListener('change', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isTable = viewMode === 'table';
  const carbonOpacity = isTable ? 0.1 : isMobile ? 0.12 : 0.22;

  const shiftY = reducedMotion ? 0 : progress * 20;
  const darkenOpacity = 0.06 + progress * 0.24;
  const glowOpacity = reducedMotion ? 0.02 : Math.max(0.012, 0.035 - progress * 0.015);

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-x-0 bottom-0 z-0 overflow-hidden',
        'opacity-0 dark:opacity-100',
        className
      )}
    >
      <div
        className="absolute inset-0 carbon-fiber-center"
        style={{
          transform: `translate3d(0, ${shiftY}px, 0)`,
          opacity: carbonOpacity,
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(72% 44% at 50% 0%, rgba(129,216,208,${glowOpacity}) 0%, transparent 58%)`,
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,${darkenOpacity}))`,
        }}
      />
    </div>
  );
}
