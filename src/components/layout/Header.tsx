'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/effects';
import HeaderBackground from './header/HeaderBackground';
import HeaderLogo from './header/HeaderLogo';
import HeaderNavigation from './header/HeaderNavigation';
import HeaderActions from './header/HeaderActions';
import MobileMenu from './header/MobileMenu';

export interface HeaderProps {
  className?: string;
  logoText?: string;
  logoShort?: string;
  navItems?: Array<{ label: string; href: string; icon?: string }>;
}

const Header: React.FC<HeaderProps> = ({
  className,
  logoText = 'DataView',
  logoShort = 'DV',
  navItems = [
    { label: 'Dashboard', href: '/', icon: '📊' },
    { label: 'Data View', href: '/dataview', icon: '📋' },
  ],
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        isScrolled && 'shadow-lg',
        className
      )}
    >
      <div className="relative mx-4 mt-3">
        {/* Background with glassmorphism */}
        <GlassCard
          className={cn(
            'relative overflow-hidden border transition-all duration-300',
            isScrolled
              ? 'border-white/30 shadow-strong'
              : 'border-white/20 shadow-medium'
          )}
          blur="lg"
        >
          {/* Animated Background */}
          <HeaderBackground />

          {/* Header Content */}
          <div className="relative z-10 px-6 py-4">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
              {/* Logo */}
              <HeaderLogo logoText={logoText} logoShort={logoShort} />

              {/* Desktop Navigation */}
              <HeaderNavigation items={navItems} />

              {/* Actions */}
              <div className="relative">
                <HeaderActions />
                
                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden relative z-20 p-2 rounded-lg glass border border-white/20 hover:border-white/40 transition-all ml-2"
                  aria-label="Toggle menu"
                >
                  <div className="w-5 h-5 flex flex-col justify-center gap-1.5">
                    <span
                      className={cn(
                        'h-0.5 w-full bg-primary rounded-full transition-all duration-300',
                        isMobileMenuOpen && 'rotate-45 translate-y-2'
                      )}
                    />
                    <span
                      className={cn(
                        'h-0.5 w-full bg-primary rounded-full transition-all duration-300',
                        isMobileMenuOpen && 'opacity-0'
                      )}
                    />
                    <span
                      className={cn(
                        'h-0.5 w-full bg-primary rounded-full transition-all duration-300',
                        isMobileMenuOpen && '-rotate-45 -translate-y-2'
                      )}
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] transition-opacity duration-300',
              isScrolled ? 'opacity-100' : 'opacity-0'
            )}
          />
        </GlassCard>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        items={navItems}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
};

export default Header;
