'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface CardCarouselProps {
  images: string[];
  alt: string;
  videoUrl?: string;
  sizes?: string;
}

export function CardCarousel({
  images,
  alt,
  videoUrl,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
}: CardCarouselProps) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const totalSlides = images.length + (videoUrl ? 1 : 0);
  const isVideoSlide = videoUrl !== undefined && current === images.length;

  // Auto-play video when its slide is active
  useEffect(() => {
    if (!videoRef.current || !videoUrl) return;
    if (current === images.length) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [current, images.length, videoUrl]);

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent(i => (i - 1 + totalSlides) % totalSlides);
  };

  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent(i => (i + 1) % totalSlides);
  };

  const goTo = (e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent(idx);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta < 0) setCurrent(i => (i + 1) % totalSlides);
      else setCurrent(i => (i - 1 + totalSlides) % totalSlides);
    }
    touchStartX.current = null;
  };

  // Single image, no video — plain image, no carousel overhead
  if (totalSlides <= 1) {
    return (
      <Image
        src={images[0]}
        alt={alt}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        sizes={sizes}
      />
    );
  }

  return (
    <div
      className="relative w-full h-full"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Photo slides */}
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={`${alt} — фото ${i + 1}`}
          fill
          className={`object-cover transition-opacity duration-300 ${
            i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          sizes={sizes}
          priority={i === 0}
        />
      ))}

      {/* Video slide */}
      {videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isVideoSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />
      )}

      {/* Video badge on last dot */}
      {isVideoSlide && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          {/* subtle play indicator fades out quickly — just for first moment */}
        </div>
      )}

      {/* Prev arrow */}
      <button
        onClick={prev}
        aria-label="Предыдущее"
        className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 hover:bg-black/65 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <ChevronLeft className="w-4 h-4 text-white" />
      </button>

      {/* Next arrow */}
      <button
        onClick={next}
        aria-label="Следующее"
        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 hover:bg-black/65 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <ChevronRight className="w-4 h-4 text-white" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
        {Array.from({ length: totalSlides }).map((_, i) => {
          const isVideo = videoUrl !== undefined && i === images.length;
          const isActive = i === current;
          return (
            <button
              key={i}
              onClick={(e) => goTo(e, i)}
              aria-label={isVideo ? 'Видео' : `Фото ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-200 flex items-center justify-center ${
                isActive ? 'w-4 bg-white' : 'w-1.5 bg-white/55 hover:bg-white/80'
              }`}
            />
          );
        })}
      </div>

      {/* Counter / video badge */}
      <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1 bg-black/40 text-white text-xs px-1.5 py-0.5 rounded-full leading-none">
        {isVideoSlide && <Play className="w-2.5 h-2.5 fill-white" />}
        <span>{current + 1}/{totalSlides}</span>
      </div>
    </div>
  );
}
