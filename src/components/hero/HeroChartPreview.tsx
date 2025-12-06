'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { GlassCard, HoverEffect } from '@/components/effects';

// Import chart components
import GenderPie from '@/components/visualization/GenderPie';
import ShoppingSunburst from '@/components/visualization/ShoppingSunburst';
import EngagementDensity from '@/components/visualization/EngagementDensity';
import WellnessTrend from '@/components/visualization/WellnessTrend';
import HealthScoreGauge from '@/components/visualization/HealthScoreGauge';
import IncomeSpendingScatter from '@/components/visualization/IncomeSpendingScatter';
import DeviceStackedBars from '@/components/visualization/DeviceStackedBars';
import FitnessPie from '@/components/visualization/FitnessPie';

export interface HeroChartPreviewProps {
  chartIndex: number;
  className?: string;
  isActive?: boolean;
}

const chartConfigs = [
  { component: GenderPie, title: 'Demographics', height: 180, color: 'primary' },
  { component: ShoppingSunburst, title: 'Shopping Patterns', height: 200, color: 'secondary' },
  { component: EngagementDensity, title: 'Engagement Trends', height: 180, color: 'accent' },
  { component: WellnessTrend, title: 'Wellness Metrics', height: 180, color: 'primary' },
  { component: HealthScoreGauge, title: 'Health Score', height: 180, color: 'secondary' },
  { component: IncomeSpendingScatter, title: 'Financial Insights', height: 180, color: 'accent' },
  { component: DeviceStackedBars, title: 'Device Usage', height: 180, color: 'primary' },
  { component: FitnessPie, title: 'Fitness Levels', height: 180, color: 'secondary' },
];

const HeroChartPreview: React.FC<HeroChartPreviewProps> = ({ 
  chartIndex, 
  className,
  isActive = false 
}) => {
  const config = chartConfigs[chartIndex % chartConfigs.length];
  const ChartComponent = config.component;

  return (
    <HoverEffect effect="lift" intensity="strong">
      <GlassCard 
        blur="lg" 
        opacity="strong" 
        glow={isActive}
        className={cn(
          'relative overflow-hidden transition-all duration-500 w-full',
          isActive ? 'scale-105 shadow-glow-primary' : 'scale-100',
          className
        )}
      >
        {/* Gradient Overlay */}
        <div 
          className={cn(
            'absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none',
            isActive && 'opacity-100'
          )}
          style={{
            background: `radial-gradient(circle at center, var(--color-${config.color})/10, transparent 70%)`
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full bg-[var(--color-${config.color})] animate-pulse`} />
              <h3 className="text-small font-semibold text-primary">{config.title}</h3>
            </div>
            <div className="text-caption text-tertiary">Live</div>
          </div>
          
          <div className="relative min-h-[450px] rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm">
            <ChartComponent height={isActive ? 450 : config.height} />
          </div>
        </div>

        {/* Animated Border */}
        <div 
          className={cn(
            'absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500',
            isActive && 'opacity-100'
          )}
          style={{
            background: `linear-gradient(135deg, var(--color-${config.color})/30, transparent, var(--color-${config.color})/30)`,
            backgroundSize: '200% 200%',
            animation: isActive ? 'gradientShift 3s ease infinite' : 'none',
          }}
        />
      </GlassCard>
    </HoverEffect>
  );
};

export default HeroChartPreview;

