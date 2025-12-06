'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Container from './Container';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps {
  className?: string;
  copyright?: string;
  links?: FooterLink[];
  showBrand?: boolean;
}

const Footer: React.FC<FooterProps> = ({
  className,
  copyright = '© 2024 DataViz Proto',
  links = [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Status', href: '#' },
  ],
  showBrand = false,
}) => {
  return (
    <footer className={cn('mx-4 mb-6', className)}>
      <div className="glass rounded-2xl px-5 py-4 border shadow-subtle">
        <Container size="xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {showBrand && (
                <span className="text-sm font-semibold gradient-text">
                  DataViz Proto
                </span>
              )}
              <span className="text-sm text-secondary">{copyright}</span>
            </div>
            <nav className="flex gap-6">
              {links.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-sm text-secondary hover:text-primary transition-colors hover-scale"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;

