'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

export function PremiumBackground({
  className,
  cursorReactive = true,
}: {
  className?: string;
  cursorReactive?: boolean;
}) {
  const flairRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isTouch, setIsTouch] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (!mounted || !cursorReactive || isTouch || reducedMotion || !flairRef.current) return;
    gsap.set(flairRef.current, { xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(flairRef.current, 'x', { duration: 0.6, ease: 'power3' });
    const yTo = gsap.quickTo(flairRef.current, 'y', { duration: 0.6, ease: 'power3' });
    const onMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mounted, cursorReactive, isTouch, reducedMotion]);

  const showFlair = mounted && cursorReactive && !isTouch && !reducedMotion;

  return (
    <div className={cn('fixed inset-0 pointer-events-none -z-10 overflow-hidden', className)} aria-hidden>
      {/* Clean solid background — no carbon */}
      <div className="absolute inset-0 bg-background" />

      {/* Subtle gradient atmosphere — dark only, tiffany accent */}
      <div
        className="absolute inset-0 opacity-0 dark:opacity-100"
        style={{
          background: 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(129, 216, 208, 0.03) 0%, transparent 55%)',
        }}
      />

      {showFlair && (
        <div
          ref={flairRef}
          className="absolute w-[160px] h-[160px] rounded-full hidden dark:block"
          style={{
            background: 'radial-gradient(circle, rgba(129, 216, 208, 0.06) 0%, transparent 65%)',
            left: 0,
            top: 0,
          }}
        />
      )}
    </div>
  );
}
