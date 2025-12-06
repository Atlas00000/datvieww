'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionIntroProps {
  children: React.ReactNode;
  className?: string;
}

const SectionIntro: React.FC<SectionIntroProps> = ({ children, className }) => {
  return (
    <div className={cn('max-w-4xl mb-12', className)}>
      <div className="prose prose-lg max-w-none">
        <div className="text-body text-secondary leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SectionIntro;

