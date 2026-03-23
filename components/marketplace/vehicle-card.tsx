'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, MapPin, CheckCircle, User, ImageIcon, Video } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Vehicle, formatPrice, formatMileage } from '@/lib/marketplace-data';
import { CardCarousel } from '@/components/marketplace/card-carousel';
import { cn } from '@/lib/utils';

interface VehicleCardProps {
  vehicle: Vehicle;
  className?: string;
  variant?: 'default' | 'compact';
}

export function VehicleCard({ vehicle, className, variant = 'default' }: VehicleCardProps) {
  const title = `${vehicle.make} ${vehicle.model}, ${vehicle.year}`;
  const imageCount = vehicle.images?.length ?? 1;
  const hasVideo = Boolean(vehicle.videoUrl);
  const mediaLabel = hasVideo
    ? `${imageCount} фото • видео`
    : `${imageCount} ${imageCount === 1 ? 'фото' : 'фото'}`;

  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springConfig = { stiffness: 280, damping: 22 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [-3, 3]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [3, -3]), springConfig);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || reducedMotion) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const enableTilt = !isTouch && !reducedMotion && isHovering;
  const isCompact = variant === 'compact';

  const listingUrl = `/listing/${vehicle.id}`;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'group block bg-card dark:bg-surface-elevated rounded-2xl border-2 border-border overflow-hidden',
        'shadow-lg hover:shadow-xl hover:border-teal-accent/30 transition-all duration-300',
        className
      )}
    >
      <motion.div
        className="relative"
        style={{
          rotateX: enableTilt ? rotateX : 0,
          rotateY: enableTilt ? rotateY : 0,
          scale: 1,
          transformPerspective: 1200,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Image — ссылка на объявление; карусель (стрелки, точки) блокирует всплытие клика */}
        <Link href={listingUrl} className="relative block aspect-[4/3] overflow-hidden bg-muted">
          <CardCarousel
            images={vehicle.images.length > 0 ? vehicle.images : [vehicle.imageUrl]}
            alt={title}
            videoUrl={vehicle.videoUrl}
          />
          {/* Badges — pointer-events-none чтобы не блокировать карусель */}
          <div className={cn(
            'absolute flex flex-wrap gap-1.5 z-10 pointer-events-none',
            isCompact ? 'top-2 left-2' : 'top-3 left-3 gap-2'
          )}>
            {vehicle.verified && (
              <span className={cn(
                'inline-flex items-center gap-1 bg-success/95 backdrop-blur-sm text-white font-semibold rounded-lg shadow-sm',
                isCompact ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'
              )}>
                <CheckCircle className={isCompact ? 'w-3 h-3 shrink-0' : 'w-4 h-4 shrink-0'} />
                Проверено
              </span>
            )}
            {vehicle.owners === 1 && (
              <span className={cn(
                'inline-flex items-center gap-1 bg-teal-accent/90 backdrop-blur-sm text-white dark:text-[#09090B] font-semibold rounded-lg shadow-sm',
                isCompact ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'
              )}>
                <User className={isCompact ? 'w-3 h-3 shrink-0' : 'w-4 h-4 shrink-0'} />
                Один владелец
              </span>
            )}
            {vehicle.priceStatus === 'low' && (
              <span className={cn(
                'inline-flex items-center gap-1 bg-success/95 backdrop-blur-sm text-white font-semibold rounded-lg shadow-sm',
                isCompact ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'
              )}>
                Хорошая цена
              </span>
            )}
          </div>
          {/* Media count — pointer-events-none чтобы не блокировать клики по точкам карусели */}
          <div className={cn(
            'absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-lg text-white font-medium pointer-events-none',
            isCompact ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm'
          )}>
            {hasVideo ? (
              <Video className="w-4 h-4 shrink-0" />
            ) : (
              <ImageIcon className="w-4 h-4 shrink-0" />
            )}
            <span>{mediaLabel}</span>
          </div>
          {/* Favorite button */}
          <button
            className={cn(
              'absolute right-2 top-2 bg-card/95 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-card/90 shadow-md transition-all duration-200 z-10',
              isCompact ? 'min-w-8 min-h-8' : 'min-w-11 min-h-11 top-3 right-3'
            )}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            aria-label="Добавить в избранное"
          >
            <Heart className={cn('text-muted-foreground hover:text-red-500 transition-colors', isCompact ? 'w-4 h-4' : 'w-5 h-5')} />
          </button>
        </Link>

        {/* Content — ссылка на объявление */}
        <Link
          href={listingUrl}
          className={cn(
            'block flex flex-col gap-2 border-t-2 border-border/50 hover:bg-muted/30 dark:hover:bg-white/[0.02] transition-colors',
            isCompact ? 'p-3 sm:p-4' : 'p-5 sm:p-6 gap-3'
          )}
        >
          <h3 className={cn(
            'font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-teal-accent transition-colors duration-200',
            isCompact ? 'text-sm' : 'text-base sm:text-lg'
          )}>
            {title}
          </h3>
          <p className={cn(
            'font-bold text-foreground tracking-tight',
            isCompact ? 'text-base' : 'text-xl sm:text-2xl'
          )}>
            {formatPrice(vehicle.price)}
          </p>
          <div className={cn(
            'flex items-center gap-2 text-muted-foreground font-medium flex-wrap',
            isCompact ? 'text-xs' : 'text-sm gap-3'
          )}>
            <span className="whitespace-nowrap">{formatMileage(vehicle.mileage)}</span>
            <span className="w-1 h-1 shrink-0 rounded-full bg-muted-foreground/50" />
            <span className="whitespace-nowrap truncate">{vehicle.engine}</span>
          </div>
          <div className={cn(
            'flex items-center gap-1.5 text-muted-foreground font-medium',
            isCompact ? 'text-xs' : 'text-sm gap-2'
          )}>
            <MapPin className={isCompact ? 'w-3 h-3 shrink-0' : 'w-4 h-4 shrink-0'} />
            <span>{vehicle.city}</span>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
