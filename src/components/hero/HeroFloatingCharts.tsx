'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { GlassCard, HoverEffect } from '@/components/effects';
import GenderPie from '@/components/visualization/GenderPie';
import HealthScoreGauge from '@/components/visualization/HealthScoreGauge';
import FitnessPie from '@/components/visualization/FitnessPie';

export interface HeroFloatingChartsProps {
  className?: string;
}

const floatingCharts = [
  {
    component: GenderPie,
    title: 'Demographics',
    delay: '0s',
  },
  {
    component: HealthScoreGauge,
    title: 'Health Score',
    delay: '1s',
  },
  {
    component: FitnessPie,
    title: 'Fitness',
    delay: '2s',
  },
];

const HeroFloatingCharts: React.FC<HeroFloatingChartsProps> = ({ className }) => {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6', className)}>
      {floatingCharts.map((chart, idx) => {
        const ChartComponent = chart.component;
        return (
          <div
            key={idx}
            className="animate-fade-in"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <HoverEffect 
              effect="lift" 
              intensity="medium"
            >
              <GlassCard 
                blur="md" 
                className="relative rounded-2xl p-4 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer group h-32"
              >
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-caption text-tertiary text-center mb-2 group-hover:text-secondary transition-colors font-medium">
                  {chart.title}
                </div>
                <div className="flex-1 flex items-center justify-center w-full min-h-0">
                  <div className="w-full h-full flex items-center justify-center">
                    <ChartComponent height={80} />
                  </div>
                </div>
              </div>
              
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at center, var(--color-primary)/20, transparent 70%)',
                }}
              />
            </GlassCard>
          </HoverEffect>
          </div>
        );
      })}
    </div>
  );
};

export default HeroFloatingCharts;

