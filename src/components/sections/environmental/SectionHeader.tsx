'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { HoverEffect } from '@/components/effects';

export interface SectionHeaderProps {
  title: string;
  description?: string;
  stats?: Array<{ label: string; value: string | number; trend?: 'up' | 'down' | 'neutral' }>;
  actions?: React.ReactNode;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  stats,
  actions,
  className,
}) => {
  return (
    <div className={cn('mb-12', className)}>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
        <div className="flex-1">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-3">
            <span className="gradient-text bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary)] bg-[length:200%_auto] animate-gradient">
              {title}
            </span>
          </h2>
          {description && (
            <p className="text-lg text-secondary max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>

      {/* Stats Row */}
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <HoverEffect key={idx} effect="glow" intensity="medium">
              <div className="relative p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-caption text-tertiary">{stat.label}</div>
                  {stat.trend && (
                    <div className={cn(
                      'text-xs',
                      stat.trend === 'up' ? 'text-[var(--color-success)]' :
                      stat.trend === 'down' ? 'text-[var(--color-error)]' :
                      'text-tertiary'
                    )}>
                      {stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '→'}
                    </div>
                  )}
                </div>
                <div className="text-2xl md:text-3xl font-bold gradient-text bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
                  {stat.value}
                </div>
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at center, var(--color-primary)/10, transparent 70%)',
                  }}
                />
              </div>
            </HoverEffect>
          ))}
        </div>
      )}
    </div>
  );
};

export default SectionHeader;

