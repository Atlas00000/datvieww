'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { HoverEffect } from '@/components/effects';

interface HeaderActionsProps {
  className?: string;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ className }) => {
  return (
    <div className={cn('hidden md:flex items-center gap-3', className)}>
      <HoverEffect effect="scale">
        <Button
          variant="secondary"
          size="sm"
          className="glass border-white/20 hover:border-white/40"
        >
          <span className="mr-2">⚙️</span>
          Settings
        </Button>
      </HoverEffect>
      
      <HoverEffect effect="glow">
        <Button
          variant="primary"
          size="sm"
          className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white border-0 shadow-lg shadow-[var(--color-primary)]/30"
        >
          <span className="mr-2">🚀</span>
          Get Started
        </Button>
      </HoverEffect>
    </div>
  );
};

export default HeaderActions;
