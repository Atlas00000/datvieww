'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type GradientPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
export type GradientVariant = 'primary' | 'secondary' | 'accent' | 'mixed';

export interface BackgroundGradientProps {
  variant?: GradientVariant;
  positions?: GradientPosition[];
  intensity?: 'subtle' | 'medium' | 'strong';
  animated?: boolean;
  className?: string;
}

const BackgroundGradient: React.FC<BackgroundGradientProps> = ({
  variant = 'mixed',
  positions = ['top-left', 'top-right', 'bottom-right'],
  intensity = 'medium',
  animated = true,
  className,
}) => {
  const intensityValues = {
    subtle: 0.04,
    medium: 0.08,
    strong: 0.15,
  };

  const opacity = intensityValues[intensity];

  const gradients = {
    primary: [
      `radial-gradient(1200px 800px at -10% -10%, rgba(0, 102, 255, ${opacity}) 0%, transparent 50%)`,
    ],
    secondary: [
      `radial-gradient(1000px 800px at 110% 10%, rgba(0, 217, 255, ${opacity}) 0%, transparent 45%)`,
    ],
    accent: [
      `radial-gradient(800px 600px at 50% 120%, rgba(255, 51, 102, ${opacity}) 0%, transparent 40%)`,
    ],
    mixed: [
      `radial-gradient(1200px 800px at -10% -10%, rgba(0, 102, 255, ${opacity}) 0%, transparent 50%)`,
      `radial-gradient(1000px 800px at 110% 10%, rgba(0, 217, 255, ${opacity}) 0%, transparent 45%)`,
      `radial-gradient(800px 600px at 50% 120%, rgba(255, 51, 102, ${opacity * 0.75}) 0%, transparent 40%)`,
    ],
  };

  const positionMap: Record<GradientPosition, string> = {
    'top-left': '-10% -10%',
    'top-right': '110% 10%',
    'bottom-left': '-10% 110%',
    'bottom-right': '110% 110%',
    'center': '50% 50%',
  };

  const getGradientStyle = () => {
    if (variant === 'mixed') {
      return {
        background: [
          ...gradients.mixed,
          'var(--color-bg-primary)',
        ].join(', '),
      };
    }

    const selectedGradients = positions.map((pos, idx) => {
      const [x, y] = positionMap[pos].split(' ');
      const colors = {
        primary: `rgba(0, 102, 255, ${opacity})`,
        secondary: `rgba(0, 217, 255, ${opacity})`,
        accent: `rgba(255, 51, 102, ${opacity})`,
      };
      return `radial-gradient(1000px 800px at ${x} ${y}, ${colors[variant]} 0%, transparent 50%)`;
    });

    return {
      background: [
        ...selectedGradients,
        'var(--color-bg-primary)',
      ].join(', '),
    };
  };

  return (
    <div
      className={cn(
        'fixed inset-0 -z-10 pointer-events-none',
        animated && 'animate-gradient',
        className
      )}
      style={getGradientStyle()}
      aria-hidden="true"
    />
  );
};

export default BackgroundGradient;

