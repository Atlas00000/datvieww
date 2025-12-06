'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, loading = false, leftIcon, rightIcon, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';
    
    const variants = {
      primary: 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white hover:shadow-glow-primary hover-lift focus:ring-[var(--color-primary)] active:scale-95',
      secondary: 'bg-transparent border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white hover-lift focus:ring-[var(--color-primary)] active:scale-95',
      ghost: 'bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] hover-scale focus:ring-[var(--color-primary)] active:scale-95',
      icon: 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover-scale rounded-full focus:ring-[var(--color-primary)] active:scale-95',
      danger: 'bg-[var(--color-error)] text-white hover:bg-[var(--color-error)]/90 hover-lift focus:ring-[var(--color-error)] active:scale-95 shadow-medium',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const iconSize = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
    };

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variant === 'icon' ? iconSize[size] : sizes[size],
          variants[variant],
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-[spin_1s_linear_infinite]" />
          </span>
        )}
        <span className={cn('flex items-center gap-2', loading && 'invisible')}>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

