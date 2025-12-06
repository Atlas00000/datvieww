'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { HoverEffect } from '@/components/effects';

export interface HeroBadgesProps {
  className?: string;
}

const badges = [
  { text: 'Real-time Filters', color: 'var(--color-secondary)', icon: '⚡' },
  { text: 'Cross-Chart Sync', color: 'var(--color-primary)', icon: '🔄' },
  { text: 'WebGL Rendering', color: 'var(--color-primary)', icon: '🎨' },
  { text: 'Anomaly Alerts', color: 'var(--color-accent)', icon: '🔔' },
  { text: 'Interactive Dashboards', color: 'var(--color-secondary)', icon: '📊' },
  { text: 'Data Streaming', color: 'var(--color-primary)', icon: '🌊' },
];

const HeroBadges: React.FC<HeroBadgesProps> = ({ className }) => {
  return (
    <div className={cn('relative mt-12', className)}>
      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
        {badges.map((badge, idx) => (
          <HoverEffect key={idx} effect="lift" intensity="medium">
            <div
              className="group relative px-5 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
              style={{
                animation: `fadeIn 0.6s ease-out ${idx * 0.1}s both`,
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{badge.icon}</span>
                <span className="text-small text-secondary font-medium group-hover:text-primary transition-colors">
                  {badge.text}
                </span>
              </div>
              <div 
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                style={{
                  background: `radial-gradient(circle, ${badge.color}20, transparent)`
                }}
              />
            </div>
          </HoverEffect>
        ))}
      </div>
    </div>
  );
};

export default HeroBadges;

