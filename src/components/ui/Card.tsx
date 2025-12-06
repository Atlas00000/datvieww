'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type CardVariant = 'default' | 'glass' | 'elevated' | 'bordered';
export type CardElevation = 1 | 2 | 3 | 4;

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  elevation?: CardElevation;
  hover?: boolean;
  children: React.ReactNode;
  className?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', elevation = 2, hover = true, className, children, ...props }, ref) => {
    const baseStyles = 'rounded-2xl p-6 transition-all';
    
    const elevationClasses = {
      1: 'elevation-1',
      2: 'elevation-2',
      3: 'elevation-3',
      4: 'elevation-4',
    };

    const variants = {
      default: 'bg-[var(--color-bg-surface)] border border-[var(--color-border)]',
      glass: 'glass border border-[var(--color-border)]',
      elevated: `bg-[var(--color-bg-surface)] ${elevationClasses[elevation]}`,
      bordered: 'bg-[var(--color-bg-surface)] border-2 border-[var(--color-border)]',
    };

    const hoverStyles = hover ? 'hover-lift cursor-pointer' : '';

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          hoverStyles,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;

