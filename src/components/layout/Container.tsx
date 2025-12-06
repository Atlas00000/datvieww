'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'wide' | 'full';
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({
  size = 'wide',
  children,
  className,
  ...props
}) => {
  const sizes = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-[1440px]',
    wide: 'w-[80%]',
    full: 'max-w-full',
  };

  return (
    <div
      className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8',
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;

