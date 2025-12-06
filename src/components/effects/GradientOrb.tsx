'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type OrbVariant = 'primary' | 'secondary' | 'accent' | 'mixed';
export type OrbSize = 'sm' | 'md' | 'lg' | 'xl';

export interface GradientOrbProps {
  variant?: OrbVariant;
  size?: OrbSize;
  position?: { x: string; y: string };
  animated?: boolean;
  blur?: boolean;
  className?: string;
}

const GradientOrb: React.FC<GradientOrbProps> = ({
  variant = 'primary',
  size = 'lg',
  position = { x: '50%', y: '50%' },
  animated = true,
  blur = true,
  className,
}) => {
  const sizes = {
    sm: 'h-40 w-40',
    md: 'h-60 w-60',
    lg: 'h-80 w-80',
    xl: 'h-96 w-96',
  };

  const variants = {
    primary: 'bg-gradient-to-br from-[var(--color-primary)]/25 to-[var(--color-secondary)]/20',
    secondary: 'bg-gradient-to-br from-[var(--color-secondary)]/25 to-[var(--color-accent)]/20',
    accent: 'bg-gradient-to-br from-[var(--color-accent)]/25 to-[var(--color-primary)]/20',
    mixed: 'bg-gradient-to-br from-[var(--color-primary)]/20 via-[var(--color-secondary)]/15 to-[var(--color-accent)]/20',
  };

  return (
    <div
      className={cn(
        'absolute rounded-full',
        sizes[size],
        variants[variant],
        blur && 'blur-2xl',
        animated && 'animate-float',
        className
      )}
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
      aria-hidden="true"
    />
  );
};

export default GradientOrb;

