'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface HeroContentProps {
  className?: string;
}

const HeroContent: React.FC<HeroContentProps> = ({ className }) => {
  return (
    <div className={cn('relative z-10', className)}>
      {/* Animated Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 animate-slide-in-down">
        <div className="h-2 w-2 rounded-full bg-[var(--color-secondary)] animate-pulse" />
        <span className="text-small text-secondary font-medium">Live Analytics Dashboard</span>
      </div>

      {/* Main Heading with Animated Gradient */}
      <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.1] mb-6 animate-slide-in-up">
        <span className="block gradient-text bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary)] bg-[length:200%_auto] animate-gradient">
          Visual Analytics
        </span>
        <span className="block text-primary mt-2">
          that feel{' '}
          <span className="relative inline-block">
            <span className="gradient-text bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)]">
              alive
            </span>
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-accent)]/50 to-[var(--color-secondary)]/50 rounded-full animate-pulse" />
          </span>
        </span>
      </h1>

      {/* Description with Fade In */}
      <p className="text-xl md:text-2xl text-secondary max-w-2xl mb-8 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
        Transform your data into{' '}
        <span className="text-primary font-semibold">interactive visualizations</span>
        {' '}with premium motion, glass surfaces, and vibrant gradients that make insights{' '}
        <span className="text-primary font-semibold">come alive</span>.
      </p>

    </div>
  );
};

export default HeroContent;

