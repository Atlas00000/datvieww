'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type ProgressVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';

export interface ProgressProps {
  value: number; // 0-100
  max?: number;
  variant?: ProgressVariant;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  variant = 'primary',
  showLabel = false,
  size = 'md',
  className,
  animated = true,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variants = {
    primary: 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]',
    secondary: 'bg-[var(--color-secondary)]',
    accent: 'bg-[var(--color-accent)]',
    success: 'bg-[var(--color-success)]',
    warning: 'bg-[var(--color-warning)]',
    error: 'bg-[var(--color-error)]',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-secondary">Progress</span>
          <span className="text-sm font-medium text-primary">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={cn(
          'w-full bg-[var(--color-bg-elevated)] rounded-full overflow-hidden',
          sizes[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            variants[variant],
            animated && 'animate-gradient'
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

export default Progress;

