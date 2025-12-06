'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import HeroChartPreview from './HeroChartPreview';

export interface HeroChartCarouselProps {
  className?: string;
  autoRotate?: boolean;
  rotationInterval?: number;
}

const HeroChartCarousel: React.FC<HeroChartCarouselProps> = ({ 
  className,
  autoRotate = true,
  rotationInterval = 4000 
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalCharts = 8;

  useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalCharts);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [autoRotate, rotationInterval, totalCharts]);

  return (
    <div className={cn('relative w-full', className)}>
      {/* Main Active Chart */}
      <div className="relative z-10">
        <HeroChartPreview 
          chartIndex={activeIndex} 
          isActive={true}
          className="w-full min-h-[500px]"
        />
      </div>

      {/* Navigation Dots */}
      <div className="flex gap-2 mt-6 justify-center">
        {Array.from({ length: totalCharts }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              idx === activeIndex 
                ? 'w-8 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]' 
                : 'w-2 bg-white/30 hover:bg-white/50'
            )}
            aria-label={`Go to chart ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroChartCarousel;

