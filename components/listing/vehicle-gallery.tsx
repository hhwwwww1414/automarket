'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Expand, Heart, Play } from 'lucide-react';
import type { Vehicle } from '@/lib/marketplace-data';

interface VehicleGalleryProps {
  vehicle: Vehicle;
}

export function VehicleGallery({ vehicle }: VehicleGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStartX = useRef<number | null>(null);

  const galleryImages = vehicle.images.filter(Boolean);
  const fallbackImage = vehicle.imageUrl.trim() ? vehicle.imageUrl : null;
  const images = galleryImages.length > 0 ? galleryImages : fallbackImage ? [fallbackImage] : [];
  const hasVideo = Boolean(vehicle.videoUrl);
  const hasMedia = images.length > 0 || hasVideo;
  const totalSlides = images.length + (hasVideo ? 1 : 0);
  const isVideoSlide = hasVideo && selectedIndex === images.length;

  useEffect(() => {
    setSelectedIndex((prev) => {
      if (totalSlides === 0) {
        return 0;
      }

      return Math.min(prev, totalSlides - 1);
    });
  }, [totalSlides]);

  useEffect(() => {
    if (!videoRef.current || !hasVideo) return;

    if (isVideoSlide) {
      videoRef.current.play().catch(() => {});
      return;
    }

    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  }, [hasVideo, isVideoSlide]);

  const goToPrevious = () => {
    if (totalSlides < 2) return;
    setSelectedIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goToNext = () => {
    if (totalSlides < 2) return;
    setSelectedIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null || totalSlides < 2) return;

    const delta = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta < 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }

    touchStartX.current = null;
  };

  return (
    <div className="space-y-4">
      <div
        className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-muted shadow-sm ring-2 ring-border/50"
        onTouchEnd={onTouchEnd}
        onTouchStart={onTouchStart}
      >
        {images.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={`${vehicle.make} ${vehicle.model} - фото ${index + 1}`}
            fill
            className={`object-cover transition-opacity duration-300 ${
              index === selectedIndex ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            priority={index === 0}
          />
        ))}

        {!hasMedia ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted text-sm font-medium text-muted-foreground">
            Без фото и видео
          </div>
        ) : null}

        {hasVideo ? (
          <video
            ref={videoRef}
            src={vehicle.videoUrl}
            controls
            playsInline
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              isVideoSlide ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          />
        ) : null}

        {totalSlides > 1 ? (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 z-10 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full bg-card/95 shadow-md opacity-0 transition-opacity backdrop-blur-sm group-hover:opacity-100 hover:bg-card"
              aria-label="Предыдущее фото"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 z-10 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full bg-card/95 shadow-md opacity-0 transition-opacity backdrop-blur-sm group-hover:opacity-100 hover:bg-card"
              aria-label="Следующее фото"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
          </>
        ) : null}

        {hasMedia && !isVideoSlide ? (
          <div className="absolute right-3 top-3 z-10 flex gap-2">
            <button
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-card/90 shadow-sm transition-all backdrop-blur-sm hover:bg-card"
              aria-label="Добавить в избранное"
            >
              <Heart className="h-5 w-5 text-muted-foreground transition-colors hover:text-red-500" />
            </button>
            <button
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-card/90 shadow-sm transition-all backdrop-blur-sm hover:bg-card"
              aria-label="Развернуть"
            >
              <Expand className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        ) : null}

        {totalSlides > 0 ? (
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2 rounded-lg bg-black/60 px-3 py-2 text-base font-medium text-white backdrop-blur-sm">
            {isVideoSlide ? <Play className="h-4 w-4 fill-white" /> : null}
            <span>
              {selectedIndex + 1} / {totalSlides}
            </span>
          </div>
        ) : null}
      </div>

      {totalSlides > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((src, index) => (
            <button
              key={src}
              onClick={() => setSelectedIndex(index)}
              className={`relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                index === selectedIndex ? 'border-teal-accent ring-1 ring-teal-accent/30' : 'border-transparent hover:border-border'
              }`}
            >
              <Image src={src} alt={`Фото ${index + 1}`} fill className="object-cover" />
            </button>
          ))}

          {hasVideo ? (
            <button
              onClick={() => setSelectedIndex(images.length)}
              className={`relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                isVideoSlide ? 'border-teal-accent ring-1 ring-teal-accent/30' : 'border-transparent hover:border-border'
              }`}
            >
              {images[0] ? (
                <Image src={images[0]} alt="Видео" fill className="object-cover brightness-50" />
              ) : (
                <div className="absolute inset-0 bg-muted-foreground/20" />
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90">
                  <Play className="ml-0.5 h-3.5 w-3.5 fill-foreground text-foreground" />
                </div>
              </div>
            </button>
          ) : null}
        </div>
      ) : null}

      {hasMedia ? (
        <button className="text-base font-semibold text-teal-accent transition-colors hover:text-teal-dark hover:underline underline-offset-4">
          Развернуть все фото ({images.length}
          {hasVideo ? ' + видео' : ''})
        </button>
      ) : null}
    </div>
  );
}
