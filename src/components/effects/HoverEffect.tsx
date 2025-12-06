'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type HoverEffectType = 'lift' | 'scale' | 'glow' | 'tilt' | 'shimmer' | 'border-glow';

export interface HoverEffectProps {
  children: React.ReactNode;
  effect?: HoverEffectType;
  intensity?: 'subtle' | 'medium' | 'strong';
  className?: string;
}

const HoverEffect: React.FC<HoverEffectProps> = ({
  children,
  effect = 'lift',
  intensity = 'medium',
  className,
}) => {
  const baseStyles = 'transition-all duration-300 ease-standard';

  const effects = {
    lift: 'hover-lift',
    scale: 'hover-scale',
    glow: 'hover-glow',
    tilt: 'hover:[transform:perspective(1000px)_rotateX(5deg)]',
    shimmer: 'relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000',
    'border-glow': 'border-2 border-transparent hover:border-[var(--color-primary)] hover:shadow-glow-primary',
  };

  const intensityClasses = {
    subtle: '',
    medium: '',
    strong: effect === 'lift' ? 'hover:translate-y-[-6px]' : effect === 'scale' ? 'hover:scale-105' : '',
  };

  return (
    <div
      className={cn(
        baseStyles,
        effects[effect],
        intensityClasses[intensity],
        className
      )}
    >
      {children}
    </div>
  );
};

export default HoverEffect;

