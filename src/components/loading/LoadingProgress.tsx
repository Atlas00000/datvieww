'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface LoadingProgressProps {
  progress?: number;
  animated?: boolean;
  className?: string;
}

const LoadingProgress: React.FC<LoadingProgressProps> = ({
  progress,
  animated = true,
  className,
}) => {
  const [internalProgress, setInternalProgress] = useState(0);

  useEffect(() => {
    if (progress !== undefined) {
      setInternalProgress(progress);
      return;
    }

    if (!animated) return;

    // Simulate progress
    const interval = setInterval(() => {
      setInternalProgress((prev) => {
        if (prev >= 90) return prev;
        const increment = Math.random() * 5 + 1;
        return Math.min(prev + increment, 90);
      });
    }, 200);

    return () => clearInterval(interval);
  }, [progress, animated]);

  const currentProgress = progress !== undefined ? progress : internalProgress;

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      {/* Progress Bar Container */}
      <div className="relative h-2 w-full rounded-full overflow-hidden bg-white/10 backdrop-blur-sm">
        {/* Animated Background Gradient */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(90deg, rgba(0, 102, 255, 0.3) 0%, rgba(0, 217, 255, 0.3) 50%, rgba(255, 51, 102, 0.3) 100%)',
            backgroundSize: '200% 100%',
            animation: animated ? 'gradient-shift 3s ease-in-out infinite' : 'none',
          }}
        />
        
        {/* Progress Fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${currentProgress}%`,
            background: 'linear-gradient(90deg, #0066FF 0%, #00D9FF 50%, #FF3366 100%)',
            boxShadow: '0 0 20px rgba(0, 102, 255, 0.5)',
          }}
        >
          {/* Shimmer Effect */}
          {animated && (
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s ease-in-out infinite',
              }}
            />
          )}
        </div>
      </div>

      {/* Progress Percentage */}
      <div className="mt-6 text-center">
        <span className="text-3xl md:text-4xl font-bold gradient-text drop-shadow-lg">
          {Math.round(currentProgress)}%
        </span>
      </div>

      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export default LoadingProgress;

