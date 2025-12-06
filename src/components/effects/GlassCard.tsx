'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Card, { type CardProps } from '@/components/ui/Card';

export interface GlassCardProps extends Omit<CardProps, 'variant'> {
  blur?: 'sm' | 'md' | 'lg';
  opacity?: 'light' | 'medium' | 'strong';
  border?: boolean;
  glow?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({
  blur = 'md',
  opacity = 'medium',
  border = true,
  glow = false,
  className,
  children,
  ...props
}) => {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
  };

  const opacityClasses = {
    light: 'bg-white/60',
    medium: 'bg-white/80',
    strong: 'bg-white/90',
  };

  return (
    <Card
      variant="glass"
      className={cn(
        blurClasses[blur],
        opacityClasses[opacity],
        border && 'border border-[var(--color-border)]',
        glow && 'shadow-glow-primary',
        'backdrop-saturate-150',
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
};

export default GlassCard;

