'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface HeroBackgroundProps {
  className?: string;
}

const HeroBackground: React.FC<HeroBackgroundProps> = ({ className }) => {
  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {/* Animated Gradient Mesh */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/20 via-transparent to-[var(--color-secondary)]/20 animate-gradient" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[var(--color-accent)]/10 to-transparent animate-[gradientShift_8s_ease-in-out_infinite]" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${4 + Math.random() * 8}px`,
              height: `${4 + Math.random() * 8}px`,
              background: i % 3 === 0 
                ? 'var(--color-primary)' 
                : i % 3 === 1 
                ? 'var(--color-secondary)' 
                : 'var(--color-accent)',
              animation: `float ${6 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Animated Grid Lines */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-primary" />
        </svg>
      </div>

      {/* Radial Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[var(--color-primary)]/10 blur-3xl animate-[pulse_4s_ease-in-out_infinite]" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[var(--color-secondary)]/10 blur-3xl animate-[pulse_6s_ease-in-out_infinite]" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-1/3 w-80 h-80 rounded-full bg-[var(--color-accent)]/8 blur-3xl animate-[pulse_5s_ease-in-out_infinite]" style={{ animationDelay: '2s' }} />
    </div>
  );
};

export default HeroBackground;

