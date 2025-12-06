'use client';

import React, { useEffect, useState } from 'react';
import LoadingScreen from './LoadingScreen';

const InitialLoading: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Wait a bit before hiding
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
          return 100;
        }
        const increment = Math.random() * 8 + 2;
        return Math.min(prev + increment, 100);
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  if (!isLoading) return null;

  return (
    <LoadingScreen
      progress={progress}
      minDisplayTime={2000}
      onComplete={() => setIsLoading(false)}
    />
  );
};

export default InitialLoading;

