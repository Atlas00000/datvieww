'use client';

import React from 'react';
import GradientOrb from '@/components/effects/GradientOrb';

const LoadingOrbs: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Primary Orb - Top Left */}
      <GradientOrb
        variant="primary"
        size="xl"
        position={{ x: '-15%', y: '-15%' }}
      />
      
      {/* Secondary Orb - Top Right */}
      <GradientOrb
        variant="secondary"
        size="lg"
        position={{ x: '115%', y: '-10%' }}
      />
      
      {/* Accent Orb - Bottom Right */}
      <GradientOrb
        variant="accent"
        size="md"
        position={{ x: '110%', y: '110%' }}
      />
      
      {/* Additional Floating Orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-30 animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(0, 102, 255, 0.4) 0%, transparent 70%)',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      
      <div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full blur-3xl opacity-25 animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(255, 51, 102, 0.4) 0%, transparent 70%)',
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(20px, -20px) scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingOrbs;

