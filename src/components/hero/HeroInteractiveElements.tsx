'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface HeroInteractiveElementsProps {
  className?: string;
}

const HeroInteractiveElements: React.FC<HeroInteractiveElementsProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className={cn('absolute inset-0 pointer-events-none overflow-hidden', className)}
    >
      {/* Mouse Follow Gradient */}
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 transition-all duration-300 ease-out pointer-events-none"
        style={{
          left: `${mousePosition.x - 192}px`,
          top: `${mousePosition.y - 192}px`,
          background: 'radial-gradient(circle, var(--color-primary), var(--color-secondary), transparent)',
        }}
      />

      {/* Animated Grid Lines that respond to mouse */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(var(--color-primary) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          transform: `translate(${(mousePosition.x - 50) * 0.01}px, ${(mousePosition.y - 50) * 0.01}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      />

      {/* Floating Interactive Orbs */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float pointer-events-none"
          style={{
            width: `${20 + i * 10}px`,
            height: `${20 + i * 10}px`,
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`,
            background: `radial-gradient(circle, var(--color-primary)/30, var(--color-secondary)/20, transparent)`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${4 + i}s`,
            filter: 'blur(8px)',
          }}
        />
      ))}

      {/* Particle Trail Effect */}
      <div
        className="absolute w-2 h-2 rounded-full pointer-events-none transition-opacity duration-300"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          background: 'var(--color-secondary)',
          opacity: mousePosition.x > 0 && mousePosition.y > 0 ? 0.6 : 0,
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 20px var(--color-secondary)',
        }}
      />
    </div>
  );
};

export default HeroInteractiveElements;

