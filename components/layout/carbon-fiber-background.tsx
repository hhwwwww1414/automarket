'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface CarbonFiberBackgroundProps {
  className?: string;
  /** В table mode эффект слабее (opacity 0.08) */
  viewMode?: 'cards' | 'compact' | 'table';
  /**
   * marketplace — тёмный navy carbon, для всех listing-страниц (В продаже, В подбор и т.д.)
   * tiffany     — teal/tiffany carbon #3FAFA5 palette, для детальной страницы автомобиля
   */
  variant?: 'marketplace' | 'tiffany';
}

export function CarbonFiberBackground({ className, viewMode = 'cards', variant = 'marketplace' }: CarbonFiberBackgroundProps) {
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

  const isTiffany = variant === 'tiffany';
  const isTable = viewMode === 'table';

  // Marketplace: 0.22 desktop, 0.12 mobile, 0.10 table
  // Tiffany (detail pages): richer — 0.30 desktop, 0.18 mobile — the teal weave should read clearly
  const carbonOpacity = isTiffany
    ? (isMobile ? 0.18 : 0.30)
    : (isTable ? 0.10 : isMobile ? 0.12 : 0.22);

  const shiftY = reducedMotion ? 0 : progress * 20;
  const darkenOpacity = 0.06 + progress * 0.24;
  const baseGlow = reducedMotion ? 0.02 : Math.max(0.012, 0.035 - progress * 0.015);

  // Tiffany glow: #3FAFA5 = rgb(63,175,165), strong enough to create a premium halo at the top
  const glowStyle = isTiffany
    ? `radial-gradient(85% 55% at 50% 0%, rgba(63,175,165,${Math.max(0.06, baseGlow * 2.8)}) 0%, transparent 62%)`
    : `radial-gradient(72% 44% at 50% 0%, rgba(129,216,208,${baseGlow}) 0%, transparent 58%)`;

  const carbonClass = isTiffany ? 'carbon-fiber-tiffany' : 'carbon-fiber-center';

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
        className={cn('absolute inset-0', carbonClass)}
        style={{
          transform: `translate3d(0, ${shiftY}px, 0)`,
          opacity: carbonOpacity,
        }}
      />

      <div
        className="absolute inset-0"
        style={{ background: glowStyle }}
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
