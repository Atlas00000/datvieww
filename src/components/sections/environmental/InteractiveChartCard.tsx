'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { GlassCard, HoverEffect } from '@/components/effects';
import { GridPattern } from '@/components/effects';

export interface InteractiveChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  color?: 'primary' | 'secondary' | 'accent';
  icon?: string;
  stats?: { label: string; value: string | number }[];
}

const InteractiveChartCard: React.FC<InteractiveChartCardProps> = ({
  title,
  subtitle,
  children,
  className,
  color = 'primary',
  icon,
  stats,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const colorClasses = {
    primary: 'from-[var(--color-primary)]/20 to-[var(--color-primary)]/5',
    secondary: 'from-[var(--color-secondary)]/20 to-[var(--color-secondary)]/5',
    accent: 'from-[var(--color-accent)]/20 to-[var(--color-accent)]/5',
  };

  const borderClasses = {
    primary: 'border-[var(--color-primary)]/30',
    secondary: 'border-[var(--color-secondary)]/30',
    accent: 'border-[var(--color-accent)]/30',
  };

  return (
    <HoverEffect effect="lift" intensity="strong">
      <GlassCard
        blur="lg"
        opacity="strong"
        glow={isHovered}
        className={cn(
          'relative overflow-hidden transition-all duration-500 group',
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated Background Gradient */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500',
            colorClasses[color]
          )}
        />

        {/* Grid Pattern Overlay */}
        <GridPattern size={20} opacity={0.03} className="absolute inset-0" />

        {/* Content */}
        <div className="relative z-10 p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {icon && (
                  <div className="text-2xl animate-float" style={{ animationDelay: '0s' }}>
                    {icon}
                  </div>
                )}
                <h3 className="text-lg md:text-xl font-bold text-primary group-hover:gradient-text transition-all duration-300">
                  {title}
                </h3>
              </div>
              {subtitle && (
                <p className="text-small text-tertiary ml-0 md:ml-9">{subtitle}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[var(--color-secondary)] animate-pulse" />
              <span className="text-caption text-tertiary font-medium">Live</span>
            </div>
          </div>

          {/* Stats Row (if provided) */}
          {stats && stats.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="text-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 group-hover:border-white/20 transition-all duration-300"
                >
                  <div className="text-h3 font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-caption text-tertiary">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Chart Container */}
          <div className="relative rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 group-hover:border-white/20 transition-all duration-300">
            <div className="p-4">
              {children}
            </div>
          </div>

          {/* Animated Border Glow */}
          <div
            className={cn(
              'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none',
              `border-2 ${borderClasses[color]}`
            )}
            style={{
              background: `linear-gradient(135deg, var(--color-${color})/20, transparent, var(--color-${color})/20)`,
              backgroundSize: '200% 200%',
              animation: isHovered ? 'gradientShift 3s ease infinite' : 'none',
            }}
          />
        </div>

        {/* Floating Particles Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500"
              style={{
                width: `${4 + i * 2}px`,
                height: `${4 + i * 2}px`,
                left: `${20 + i * 30}%`,
                top: `${10 + i * 20}%`,
                background: `var(--color-${color})`,
                animation: `float ${4 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
      </GlassCard>
    </HoverEffect>
  );
};

export default InteractiveChartCard;

