/**
 * Main Navigation Bar
 *
 * Fixed top navigation with:
 * - Logo (links to home)
 * - Desktop nav links
 * - "Idea Lab" highlighted CTA
 * - Language switcher
 * - Mobile hamburger menu
 *
 * Features:
 * - Hides on scroll down, shows on scroll up
 * - Transparent on homepage hero, opaque on scroll
 * - Responsive: full nav on lg+, hamburger on mobile
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils/cn';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileDrawer } from './MobileDrawer';
import { mainNavLinks, aiToolsLinks } from '@/lib/data/navigation';

export function Navbar() {
  const t = useTranslations('common');
  const pathname = usePathname();
  const scrollDirection = useScrollDirection(10);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position for background opacity
  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomepage = pathname === '/';
  const showNavbar = scrollDirection === 'up' || !scrolled;

  // Find Idea Lab link for special highlighting
  const ideaLabLink = aiToolsLinks.find((link) => link.isHighlighted);

  return (
    <>
      <header
        role="banner"
        className={cn(
          'fixed top-0 start-0 end-0 z-50',
          'h-16 w-full',
          'transition-all duration-200',
          // Background: transparent at top, glassmorphism when scrolled
          scrolled
            ? 'glass-strong border-b border-slate-blue-light/50'
            : isHomepage
            ? 'bg-transparent'
            : 'glass-strong border-b border-slate-blue-light/50',
          // Hide/show on scroll
          showNavbar ? 'translate-y-0' : '-translate-y-full'
        )}
      >
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link
              href="/"
              className="flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze rounded-sm"
              aria-label={t('accessibility.homeLink')}
            >
              <Image
                src="/logo/logo.svg"
                alt={t('accessibility.logo_alt')}
                width={120}
                height={32}
                priority
                className="h-8 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center gap-8"
              aria-label={t('accessibility.mainNavigation')}
            >
              {mainNavLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'text-sm font-medium transition-colors duration-200',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-navy rounded-sm',
                      isActive ? 'text-white' : 'text-muted hover:text-white'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {t(link.labelKey)}
                  </Link>
                );
              })}

              {/* Idea Lab Special CTA */}
              {ideaLabLink && (
                <Link
                  href={ideaLabLink.href}
                  className={cn(
                    'bg-bronze/15 text-bronze',
                    'px-3 py-1.5 rounded-lg',
                    'text-sm font-medium',
                    'hover:bg-bronze/25 transition-colors duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-navy'
                  )}
                >
                  {t(ideaLabLink.labelKey)}
                </Link>
              )}
            </nav>

            {/* Right Section: Language Switcher + Mobile Menu */}
            <div className="flex items-center gap-3">
              {/* Language Switcher (Desktop & Mobile) */}
              <LanguageSwitcher />

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={cn(
                  'lg:hidden',
                  'h-10 w-10 rounded-lg',
                  'flex items-center justify-center',
                  'text-muted hover:text-white hover:bg-slate-blue-light/60',
                  'transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze'
                )}
                aria-label={t('accessibility.openMenu')}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
