'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import LoadingBackground from './LoadingBackground';
import LoadingProgress from './LoadingProgress';
import LoadingOrbs from './LoadingOrbs';
import LoadingText from './LoadingText';
import { BackgroundGradient } from '@/components/effects';

interface LoadingScreenProps {
  progress?: number;
  onComplete?: () => void;
  className?: string;
  minDisplayTime?: number; // Minimum time to show loading screen (ms)
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  progress,
  onComplete,
  className,
  minDisplayTime = 1500,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const checkComplete = () => {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minDisplayTime - elapsed);
      
      setTimeout(() => {
        if (progress !== undefined && progress >= 100) {
          setIsVisible(false);
          setTimeout(() => {
            onComplete?.();
          }, 500); // Wait for fade out animation
        }
      }, remainingTime);
    };

    checkComplete();
  }, [progress, onComplete, startTime, minDisplayTime]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-[9999] flex items-center justify-center',
        'transition-opacity duration-500 ease-out',
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none',
        className
      )}
    >
      {/* Background Gradient */}
      <BackgroundGradient variant="mixed" intensity="strong" animated />

      {/* Animated Background with Particles */}
      <LoadingBackground />

      {/* Floating Gradient Orbs */}
      <LoadingOrbs />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="loading-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-primary"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#loading-grid)" />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-12 px-6 max-w-4xl mx-auto">
        {/* Loading Text and Logo */}
        <div className="animate-fade-in transform transition-all duration-700">
          <LoadingText />
        </div>

        {/* Progress Indicator */}
        <div 
          className="animate-fade-in w-full transform transition-all duration-700"
          style={{ animationDelay: '0.3s' }}
        >
          <LoadingProgress progress={progress} animated={progress === undefined} />
        </div>

        {/* Loading Message */}
        <div
          className="text-center text-tertiary text-sm md:text-base animate-fade-in transform transition-all duration-700"
          style={{ animationDelay: '0.6s' }}
        >
          <p className="font-medium">Preparing your data visualization experience...</p>
          <div className="mt-2 flex items-center justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="inline-block w-1 h-1 rounded-full bg-current opacity-60"
                style={{
                  animation: `pulse 1.5s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Glassmorphism Overlay for Depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, rgba(255, 255, 255, 0.05) 100%)',
          }}
        />
      </div>
    </div>
  );
};

export default LoadingScreen;

