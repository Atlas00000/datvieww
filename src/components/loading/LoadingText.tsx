'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingTextProps {
  className?: string;
}

const LoadingText: React.FC<LoadingTextProps> = ({ className }) => {
  return (
    <div className={cn('text-center space-y-4', className)}>
      {/* Main Logo/Title */}
      <div className="relative inline-block">
        <h1 
          className="text-6xl md:text-7xl lg:text-8xl font-bold gradient-text mb-2 drop-shadow-2xl"
          style={{
            textShadow: '0 0 40px rgba(0, 102, 255, 0.3)',
          }}
        >
          DataView
        </h1>
        {/* Glow Effect */}
        <div
          className="absolute inset-0 blur-3xl opacity-40 -z-10 animate-pulse"
          style={{
            background: 'linear-gradient(135deg, #0066FF 0%, #00D9FF 50%, #FF3366 100%)',
          }}
        />
      </div>

      {/* Subtitle */}
      <p className="text-lg md:text-xl text-secondary font-medium tracking-wide">
        Visualizing Insights, Transforming Data
      </p>

      {/* Animated Dots */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]"
            style={{
              animation: `bounce 1.4s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingText;

