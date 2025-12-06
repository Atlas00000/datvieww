'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface ParallaxProps {
  children: React.ReactNode;
  speed?: number; // 0-1, where 0.5 is half speed
  direction?: 'up' | 'down';
  className?: string;
  disabled?: boolean;
}

const Parallax: React.FC<ParallaxProps> = ({
  children,
  speed = 0.5,
  direction = 'up',
  className,
  disabled = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (disabled) return;

    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementTop = rect.top;
      const elementHeight = rect.height;

      // Calculate parallax offset
      const scrolled = window.scrollY;
      const elementCenter = elementTop + elementHeight / 2;
      const windowCenter = windowHeight / 2;
      const distance = elementCenter - windowCenter;
      const parallaxOffset = distance * speed * (direction === 'up' ? -1 : 1);

      setOffset(parallaxOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, direction, disabled]);

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={cn('transition-transform duration-75 ease-out', className)}
      style={{
        transform: `translateY(${offset}px)`,
      }}
    >
      {children}
    </div>
  );
};

export default Parallax;

