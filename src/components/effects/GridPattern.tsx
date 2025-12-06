'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface GridPatternProps {
  size?: number;
  opacity?: number;
  color?: string;
  className?: string;
  animated?: boolean;
}

const GridPattern: React.FC<GridPatternProps> = ({
  size = 24,
  opacity = 0.06,
  color = 'rgba(15, 23, 42, 0.06)',
  className,
  animated = false,
}) => {
  const patternStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
    backgroundSize: `${size}px ${size}px`,
    backgroundPosition: '-1px -1px',
  };

  return (
    <div
      className={cn(
        'absolute inset-0 pointer-events-none',
        animated && '[animation:gridMove_20s_linear_infinite]',
        className
      )}
      style={patternStyle}
      aria-hidden="true"
    />
  );
};

export default GridPattern;

