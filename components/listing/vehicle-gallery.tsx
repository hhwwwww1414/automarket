'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Heart, ChevronLeft, ChevronRight, Expand, Play } from 'lucide-react';
import { Vehicle } from '@/lib/marketplace-data';

interface VehicleGalleryProps {
  vehicle: Vehicle;
}

export function VehicleGallery({ vehicle }: VehicleGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const images = vehicle.images.length > 0 ? vehicle.images : [vehicle.imageUrl];
  const hasVideo = Boolean(vehicle.videoUrl);
  const totalSlides = images.length + (hasVideo ? 1 : 0);
  const isVideoSlide = hasVideo && selectedIndex === images.length;

  // Play/pause video on slide change
  useEffect(() => {
    if (!videoRef.current || !hasVideo) return;
    if (isVideoSlide) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isVideoSlide, hasVideo]);

  const goToPrevious = () => {
    setSelectedIndex(prev => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex(prev => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  // Touch swipe
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) delta < 0 ? goToNext() : goToPrevious();
    touchStartX.current = null;
  };

  return (
    <div className="space-y-3">
      {/* Main viewer */}
      <div
        className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted group"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Photo slides */}
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`${vehicle.make} ${vehicle.model} — фото ${i + 1}`}
            fill
            className={`object-cover transition-opacity duration-300 ${
              i === selectedIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            priority={i === 0}
          />
        ))}

        {/* Video slide */}
        {hasVideo && (
          <video
            ref={videoRef}
            src={vehicle.videoUrl}
            controls
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isVideoSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />
        )}

        {/* Navigation arrows */}
        {totalSlides > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </>
        )}

        {/* Top actions — hide when video controls are active */}
        {!isVideoSlide && (
          <div className="absolute top-3 right-3 flex gap-2 z-10">
            <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
              <Heart className="w-5 h-5 text-muted-foreground hover:text-red-500 transition-colors" />
            </button>
            <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
              <Expand className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        )}

        {/* Counter */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/60 rounded text-white text-sm z-10">
          {isVideoSlide && <Play className="w-3 h-3 fill-white" />}
          <span>{selectedIndex + 1} / {totalSlides}</span>
        </div>
      </div>

      {/* Thumbnails */}
      {totalSlides > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((src, index) => (
            <button
              key={src}
              onClick={() => setSelectedIndex(index)}
              className={`relative w-20 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 transition-colors ${
                index === selectedIndex ? 'border-teal-accent' : 'border-transparent hover:border-border'
              }`}
            >
              <Image
                src={src}
                alt={`Фото ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}

          {/* Video thumbnail */}
          {hasVideo && (
            <button
              onClick={() => setSelectedIndex(images.length)}
              className={`relative w-20 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 transition-colors ${
                isVideoSlide ? 'border-teal-accent' : 'border-transparent hover:border-border'
              }`}
            >
              {/* Poster = first image */}
              <Image
                src={images[0]}
                alt="Видео"
                fill
                className="object-cover brightness-50"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 text-foreground fill-foreground ml-0.5" />
                </div>
              </div>
            </button>
          )}
        </div>
      )}

      {/* Photo count link */}
      <button className="text-sm text-teal-accent hover:text-teal-dark hover:underline transition-colors">
        Развернуть все фото ({images.length}{hasVideo ? ' + видео' : ''})
      </button>
    </div>
  );
}
