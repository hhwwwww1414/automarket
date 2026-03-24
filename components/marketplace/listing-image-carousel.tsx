'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ListingImageCarouselProps {
  images: string[];
  alt: string;
  /** 1-based index for above-the-fold cards (LCP optimization) */
  priority?: boolean;
  /** card | compact - affects size and controls */
  size?: 'card' | 'compact';
  className?: string;
}

export function ListingImageCarousel({
  images,
  alt,
  priority = false,
  size = 'card',
  className,
}: ListingImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: 'x',
    loop: false,
    dragFree: false,
    containScroll: 'trimSnaps',
    align: 'start',
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback((api: typeof emblaApi) => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on('reInit', onSelect).on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const aspectClass = size === 'card' ? 'aspect-[4/3]' : 'aspect-[3/2] min-h-0';

  if (!images.length) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted dark:bg-surface-3 text-muted-foreground',
          size === 'compact' ? 'w-full h-full' : aspectClass,
          className
        )}
      >
        <span className="text-xs">Нет фото</span>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div
        className={cn(
          'relative overflow-hidden bg-muted',
          size === 'compact' ? 'w-full h-full' : aspectClass,
          className
        )}
      >
        <Image
          src={images[0]}
          alt={alt}
          fill
          className="object-cover"
          sizes={size === 'card' ? '(max-width: 640px) 100vw, 280px' : '96px'}
          priority={priority}
        />
      </div>
    );
  }

  const isCompact = size === 'compact';
  const arrowSize = isCompact ? 'w-6 h-6' : 'w-8 h-8';

  return (
    <div
      className={cn(
        'relative group overflow-hidden bg-muted',
        size === 'compact' ? 'w-full h-full' : aspectClass,
        className
      )}
    >
      <div ref={emblaRef} className="h-full overflow-hidden touch-pan-x">
        <div className="flex h-full">
          {images.map((src, i) => (
            <div key={i} className="min-w-0 flex-[0_0_100%] relative h-full">
              <Image
                src={src}
                alt={`${alt} — фото ${i + 1}`}
                fill
                className="object-cover"
                sizes={size === 'card' ? '(max-width: 640px) 100vw, 280px' : '96px'}
                priority={priority && i === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Arrows — visible on hover (desktop) */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto flex items-center justify-start pl-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollPrev(); }}
            disabled={!canScrollPrev}
            className={cn(
              'rounded-full bg-white/90 dark:bg-black/50 text-foreground p-1 shadow-sm',
              'disabled:opacity-30 disabled:cursor-not-allowed',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent',
              arrowSize
            )}
            aria-label="Предыдущее фото"
          >
            <ChevronLeft className="w-full h-full" />
          </button>
        </div>
        <div
          className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto flex items-center justify-end pr-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollNext(); }}
            disabled={!canScrollNext}
            className={cn(
              'rounded-full bg-white/90 dark:bg-black/50 text-foreground p-1 shadow-sm',
              'disabled:opacity-30 disabled:cursor-not-allowed',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent',
              arrowSize
            )}
            aria-label="Следующее фото"
          >
            <ChevronRight className="w-full h-full" />
          </button>
        </div>
      </div>

      {/* Dots / photo count */}
      <div
        className={cn(
          'absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1',
          isCompact ? 'flex-wrap justify-center max-w-full' : ''
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {images.length <= 5 ? (
          images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); emblaApi?.scrollTo(i); }}
              className={cn(
                'rounded-full transition-all',
                i === selectedIndex
                  ? 'w-2 h-2 bg-white shadow'
                  : 'w-1.5 h-1.5 bg-white/60 hover:bg-white/80'
              )}
              aria-label={`Фото ${i + 1}`}
            />
          ))
        ) : (
          <span className="text-[10px] text-white bg-black/60 px-2 py-0.5 rounded">
            {selectedIndex + 1} / {images.length}
          </span>
        )}
      </div>
    </div>
  );
}
