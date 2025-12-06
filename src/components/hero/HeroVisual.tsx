'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/effects';
import { HoverEffect } from '@/components/effects';

export interface HeroVisualProps {
  className?: string;
}

const HeroVisual: React.FC<HeroVisualProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Animated data visualization
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }> = [];

    const colors = [
      'var(--color-primary)',
      'var(--color-secondary)',
      'var(--color-accent)',
    ];

    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle
        const getColor = (colorVar: string) => {
          if (colorVar.includes('primary')) return '#0066FF';
          if (colorVar.includes('secondary')) return '#00D9FF';
          if (colorVar.includes('accent')) return '#FF3366';
          return '#0066FF';
        };

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = getColor(particle.color);
        ctx.globalAlpha = 0.6;
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = getColor(particle.color);
            ctx.globalAlpha = 0.2 * (1 - distance / 100);
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className={cn('relative', className)}>
      {/* Interactive Canvas Background */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 p-1">
        <div className="relative rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 h-full">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ minHeight: '400px' }}
          />
          
          {/* Floating Glass Cards */}
          <div className="absolute top-8 left-8 animate-float">
            <HoverEffect effect="glow">
              <GlassCard className="px-4 py-3 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[var(--color-secondary)] animate-pulse" />
                  <span className="text-small text-secondary font-medium">Live Data</span>
                </div>
              </GlassCard>
            </HoverEffect>
          </div>

          <div className="absolute bottom-8 right-8 animate-float" style={{ animationDelay: '1s' }}>
            <HoverEffect effect="glow">
              <GlassCard className="px-4 py-3 backdrop-blur-md">
                <div className="text-small text-secondary">Real-time</div>
                <div className="text-body font-bold text-primary mt-1">1,248</div>
              </GlassCard>
            </HoverEffect>
          </div>

          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/10 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Floating Orbs */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br from-[var(--color-primary)]/30 to-[var(--color-secondary)]/30 blur-2xl animate-float" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-primary)]/20 blur-2xl animate-float" style={{ animationDelay: '2s' }} />
    </div>
  );
};

export default HeroVisual;

