'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Container from './Container';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  title?: string;
  description?: string;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'wide' | 'full';
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  className?: string;
}

const Section: React.FC<SectionProps> = ({
  children,
  title,
  description,
  containerSize = 'wide',
  spacing = 'lg',
  animate = true,
  className,
  ...props
}) => {
  const spacingClasses = {
    none: 'py-0',
    sm: 'py-12 md:py-16',
    md: 'py-16 md:py-24',
    lg: 'py-20 md:py-32',
    xl: 'py-24 md:py-40',
  };

  return (
    <section
      className={cn(
        'relative',
        spacingClasses[spacing],
        animate && 'animate-fade-in',
        className
      )}
      {...props}
    >
      <Container size={containerSize}>
        {(title || description) && (
          <div className="mb-10 md:mb-12 animate-slide-in-up">
            {title && (
              <h2 className="text-h2 font-bold gradient-text mb-2">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-body text-secondary max-w-2xl">
                {description}
              </p>
            )}
          </div>
        )}
        <div className={animate ? 'animate-scale-in' : ''}>
          {children}
        </div>
      </Container>
    </section>
  );
};

export default Section;

