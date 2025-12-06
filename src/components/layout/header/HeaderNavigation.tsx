'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { HoverEffect } from '@/components/effects';

interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

interface HeaderNavigationProps {
  items: NavItem[];
  className?: string;
  mobile?: boolean;
}

const HeaderNavigation: React.FC<HeaderNavigationProps> = ({
  items,
  className,
  mobile = false,
}) => {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (mobile) {
    return (
      <nav className={cn('flex flex-col gap-2', className)}>
        {items.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={index}
              href={item.href}
              className={cn(
                'relative px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-300',
                'flex items-center gap-2',
                isActive
                  ? 'text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] shadow-lg'
                  : 'text-secondary hover:text-primary hover:bg-white/10'
              )}
            >
              {item.icon && <span className="text-lg">{item.icon}</span>}
              <span>{item.label}</span>
              {isActive && (
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20 animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className={cn('hidden md:flex items-center gap-2', className)}>
      {items.map((item, index) => {
        const isActive = pathname === item.href;
        return (
          <HoverEffect key={index} effect="lift" intensity="subtle">
            <Link
              href={item.href}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                'relative px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300',
                'flex items-center gap-2 overflow-hidden',
                isActive
                  ? 'text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] shadow-lg shadow-[var(--color-primary)]/30'
                  : 'text-secondary hover:text-primary bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20'
              )}
            >
              {/* Animated background gradient */}
              {!isActive && hoveredIndex === index && (
                <div
                  className="absolute inset-0 opacity-20 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.2) 0%, rgba(0, 217, 255, 0.2) 100%)',
                    animation: 'fadeIn 0.3s ease-out',
                  }}
                />
              )}
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--color-primary)]/30 to-[var(--color-secondary)]/30 animate-pulse" />
              )}
              
              {/* Content */}
              <span className="relative z-10 flex items-center gap-2">
                {item.icon && <span className="text-base">{item.icon}</span>}
                <span>{item.label}</span>
              </span>
              
              {/* Bottom border on hover */}
              {hoveredIndex === index && !isActive && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"
                  style={{
                    animation: 'slideIn 0.3s ease-out',
                  }}
                />
              )}
            </Link>
          </HoverEffect>
        );
      })}
    </nav>
  );
};

export default HeaderNavigation;

