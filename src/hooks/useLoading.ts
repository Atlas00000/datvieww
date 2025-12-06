'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseLoadingOptions {
  minDisplayTime?: number;
  onComplete?: () => void;
}

export const useLoading = (options: UseLoadingOptions = {}) => {
  const { minDisplayTime = 1500, onComplete } = options;
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [startTime] = useState(Date.now());

  const setProgressValue = useCallback((value: number) => {
    setProgress(Math.min(100, Math.max(0, value)));
  }, []);

  const complete = useCallback(() => {
    const elapsed = Date.now() - startTime;
    const remainingTime = Math.max(0, minDisplayTime - elapsed);

    setTimeout(() => {
      setIsLoading(false);
      onComplete?.();
    }, remainingTime);
  }, [startTime, minDisplayTime, onComplete]);

  useEffect(() => {
    if (progress >= 100) {
      complete();
    }
  }, [progress, complete]);

  return {
    isLoading,
    progress,
    setProgress: setProgressValue,
    complete,
  };
};

