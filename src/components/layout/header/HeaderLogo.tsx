'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { HoverEffect } from '@/components/effects';

interface HeaderLogoProps {
  logoText?: string;
  logoShort?: string;
  className?: string;
}

const HeaderLogo: React.FC<HeaderLogoProps> = ({
  logoText = 'DataView',
  logoShort = 'DV',
  className,
}) => {
  return (
    <Link
      href="/"
      className={cn(
        'flex items-center gap-3 group relative z-10',
        className
      )}
    >
      {/* Animated Logo Icon */}
      <HoverEffect effect="glow" intensity="medium">
        <div className="relative">
          {/* Glow effect */}
          <div
            className="absolute inset-0 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"
            style={{
              background: 'linear-gradient(135deg, #0066FF 0%, #00D9FF 50%, #FF3366 100%)',
            }}
          />
          
          {/* Logo container */}
          <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            {/* Shimmer effect */}
            <div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s ease-in-out infinite',
              }}
            />
            
            {/* Logo text */}
            <span className="relative text-white font-bold text-sm z-10 drop-shadow-sm">
              {logoShort}
            </span>
          </div>
        </div>
      </HoverEffect>

      {/* Logo Text */}
      <div className="relative">
        <span
          className="text-xl font-bold gradient-text group-hover:scale-105 transition-transform duration-300 block"
          style={{
            textShadow: '0 0 20px rgba(0, 102, 255, 0.2)',
          }}
        >
          {logoText}
        </span>
        
        {/* Underline animation */}
        <div
          className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] w-0 group-hover:w-full transition-all duration-300"
        />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </Link>
  );
};

export default HeaderLogo;

