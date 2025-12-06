'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Container from './Container';

export interface SectionTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const SectionTransition: React.FC<SectionTransitionProps> = ({ children, className }) => {
  return (
    <div className={cn('py-12 md:py-16 relative', className)}>
      <Container size="wide">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg md:text-xl text-secondary leading-relaxed">
            {children}
          </p>
        </div>
      </Container>
    </div>
  );
};

export default SectionTransition;

