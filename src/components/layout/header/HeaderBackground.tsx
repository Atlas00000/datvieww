'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderBackgroundProps {
  className?: string;
}

const HeaderBackground: React.FC<HeaderBackgroundProps> = ({ className }) => {
  return (
    <div className={cn('absolute inset-0 pointer-events-none overflow-hidden', className)}>
      {/* Animated gradient overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.1) 0%, rgba(0, 217, 255, 0.1) 50%, rgba(255, 51, 102, 0.05) 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 8s ease-in-out infinite',
        }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-sm opacity-20"
            style={{
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0 
                ? 'radial-gradient(circle, rgba(0, 102, 255, 0.4) 0%, transparent 70%)'
                : i % 3 === 1
                ? 'radial-gradient(circle, rgba(0, 217, 255, 0.4) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(255, 51, 102, 0.3) 0%, transparent 70%)',
              animation: `float-particle ${8 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="header-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#header-grid)" />
        </svg>
      </div>

      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float-particle {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.2;
          }
          50% {
            transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(1.2);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
};

export default HeaderBackground;

