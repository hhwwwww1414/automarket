'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface InteriorGalleryProps {
  images: string[];
}

export function InteriorGallery({ images }: InteriorGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const isOpen = lightboxIndex !== null;

  const close = useCallback(() => setLightboxIndex(null), []);

  const prev = useCallback(() =>
    setLightboxIndex(i => i === null ? null : (i - 1 + images.length) % images.length),
    [images.length]
  );

  const next = useCallback(() =>
    setLightboxIndex(i => i === null ? null : (i + 1) % images.length),
    [images.length]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, close, prev, next]);

  // Lock scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="bg-card dark:bg-surface-elevated rounded-xl border-2 border-border p-5 sm:p-6 shadow-lg">
        <h3 className="font-display font-semibold text-foreground mb-4 text-lg">Фотографии салона</h3>
        <div className="grid grid-cols-3 gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setLightboxIndex(i)}
              className="relative aspect-[4/3] rounded-md overflow-hidden bg-muted hover:opacity-90 transition-opacity"
            >
              <Image
                src={src}
                alt={`Салон — фото ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 33vw, 150px"
              />
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted-foreground font-medium">{images.length} фотографий</p>
      </div>

      {/* Lightbox */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/88 flex items-center justify-center p-4"
          onClick={close}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Image */}
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={images[lightboxIndex!]}
                alt={`Салон — фото ${lightboxIndex! + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {/* Close */}
            <button
              onClick={close}
              aria-label="Закрыть"
              className="absolute -top-10 right-0 w-9 h-9 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Prev */}
            {images.length > 1 && (
              <button
                onClick={prev}
                aria-label="Предыдущее фото"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Next */}
            {images.length > 1 && (
              <button
                onClick={next}
                aria-label="Следующее фото"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Counter */}
            <div className="absolute bottom-3 right-3 bg-black/55 text-white text-sm px-2 py-0.5 rounded-full">
              {lightboxIndex! + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
