'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type InputVariant = 'default' | 'glass';
export type InputState = 'default' | 'error' | 'success';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  state?: InputState;
  label?: string;
  errorMessage?: string;
  successMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'default', state = 'default', label, errorMessage, successMessage, leftIcon, rightIcon, className, ...props }, ref) => {
    const baseStyles = 'w-full px-4 py-2.5 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      default: 'bg-[var(--color-bg-surface)] border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] hover:border-[var(--color-primary)]/50',
      glass: 'glass border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:shadow-glow-primary hover:border-[var(--color-primary)]/50',
    };

    const states = {
      default: '',
      error: 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]',
      success: 'border-[var(--color-success)] focus:border-[var(--color-success)] focus:ring-[var(--color-success)]',
    };

    const hasIcons = leftIcon || rightIcon;
    const paddingLeft = leftIcon ? 'pl-10' : '';
    const paddingRight = rightIcon ? 'pr-10' : '';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2 animate-slide-in-down">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              baseStyles,
              variants[variant],
              states[state],
              hasIcons && paddingLeft,
              hasIcons && paddingRight,
              'animate-scale-in',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {errorMessage && state === 'error' && (
          <p className="mt-1.5 text-sm text-[var(--color-error)] flex items-center gap-1 animate-slide-in-up">
            <span>⚠</span>
            {errorMessage}
          </p>
        )}
        {successMessage && state === 'success' && (
          <p className="mt-1.5 text-sm text-[var(--color-success)] flex items-center gap-1 animate-slide-in-up">
            <span>✓</span>
            {successMessage}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

