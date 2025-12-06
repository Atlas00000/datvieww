'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import HeaderNavigation from './HeaderNavigation';

interface MobileMenuProps {
  isOpen: boolean;
  items: Array<{ label: string; href: string; icon?: string }>;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, items, onClose }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Menu Panel */}
      <div
        className={cn(
          'fixed top-20 left-0 right-0 mx-4 glass rounded-2xl border border-white/20 shadow-strong z-50 md:hidden transition-all duration-300 overflow-hidden',
          isOpen
            ? 'opacity-100 translate-y-0 visible'
            : 'opacity-0 -translate-y-4 invisible'
        )}
      >
        <div className="p-4">
          <HeaderNavigation items={items} mobile />
        </div>
      </div>
    </>
  );
};

export default MobileMenu;

