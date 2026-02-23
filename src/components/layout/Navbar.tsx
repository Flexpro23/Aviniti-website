/**
 * Enhanced Main Navigation Bar
 *
 * Fixed top navigation with:
 * - Logo (links to home)
 * - Desktop nav links with active bronze underline indicator
 * - AI Tools mega-dropdown (click-based, shows all 4 tools with icons + descriptions)
 * - "Get in Touch" primary CTA button
 * - Language switcher
 * - Mobile hamburger menu
 *
 * Features:
 * - Hides on scroll down, shows on scroll up
 * - Transparent on homepage hero, premium glass on scroll
 * - Bronze bottom border accent on scroll
 * - Active state: bronze dot + bold text
 * - AI Tools dropdown with framer-motion animation
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Menu,
  ChevronDown,
  Lightbulb,
  ScanSearch,
  Calculator,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils/cn';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileDrawer } from './MobileDrawer';
import { mainNavLinks, aiToolsLinks } from '@/lib/data/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Icon map for AI tool links
const aiToolIcons: Record<string, React.ReactNode> = {
  '/idea-lab': <Lightbulb className="h-5 w-5" />,
  '/ai-analyzer': <ScanSearch className="h-5 w-5" />,
  '/get-estimate': <Calculator className="h-5 w-5" />,
  '/roi-calculator': <TrendingUp className="h-5 w-5" />,
};

// AI tool accent colors
const aiToolColors: Record<string, string> = {
  '/idea-lab': '#C08460',       // bronze
  '/ai-analyzer': '#60A5FA',    // blue
  '/get-estimate': '#34D399',   // green
  '/roi-calculator': '#A78BFA', // purple
};

// Description translation key map (relative to 'common' namespace)
const aiToolDescKeys: Record<string, string> = {
  '/idea-lab': 'nav.aiTools.ideaLabDesc',
  '/ai-analyzer': 'nav.aiTools.analyzerDesc',
  '/get-estimate': 'nav.aiTools.estimateDesc',
  '/roi-calculator': 'nav.aiTools.roiDesc',
};

export function Navbar() {
  const t = useTranslations('common');
  const pathname = usePathname();
  const scrollDirection = useScrollDirection(10);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [aiDropdownOpen, setAiDropdownOpen] = useState(false);
  const aiDropdownRef = useRef<HTMLDivElement>(null);
  const aiButtonRef = useRef<HTMLButtonElement>(null);

  // Track scroll position for background opacity
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close AI dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: PointerEvent) => {
      if (
        aiDropdownRef.current &&
        !aiDropdownRef.current.contains(e.target as Node)
      ) {
        setAiDropdownOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, []);

  // Close AI dropdown on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && aiDropdownOpen) {
        setAiDropdownOpen(false);
        aiButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [aiDropdownOpen]);

  // Close AI dropdown when route changes
  useEffect(() => {
    setAiDropdownOpen(false);
  }, [pathname]);

  const isHomepage = pathname === '/';
  const showNavbar = scrollDirection === 'up' || !scrolled;
  const isAiToolActive = aiToolsLinks.some((l) => pathname === l.href);

  // Desktop nav links — exclude "contact" (shown as CTA)
  const desktopLinks = mainNavLinks.filter((l) => l.href !== '/contact');

  const handleDropdownKeyDown = useCallback((e: React.KeyboardEvent) => {
    const items = aiDropdownRef.current?.querySelectorAll<HTMLElement>(
      'a[href]'
    );
    if (!items?.length) return;
    const currentIndex = Array.from(items).findIndex(
      (item) => item === document.activeElement
    );
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[Math.min(currentIndex + 1, items.length - 1)]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentIndex <= 0) {
        aiButtonRef.current?.focus();
        setAiDropdownOpen(false);
      } else {
        items[currentIndex - 1]?.focus();
      }
    }
  }, []);

  return (
    <>
      <header
        role="banner"
        className={cn(
          'fixed top-0 start-0 end-0 z-50',
          'h-[68px] w-full',
          'transition-all duration-300 ease-in-out',
          // Background & border
          scrolled || !isHomepage
            ? 'border-b'
            : 'bg-transparent border-transparent',
          // Hide/show on scroll
          showNavbar ? 'translate-y-0' : '-translate-y-full'
        )}
        style={
          scrolled || !isHomepage
            ? {
                background: 'rgba(15, 20, 25, 0.88)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderColor: 'rgba(192, 132, 96, 0.2)',
                boxShadow: '0 1px 40px rgba(0,0,0,0.4)',
              }
            : undefined
        }
      >
        {/* Subtle bronze bottom line on scroll */}
        {(scrolled || !isHomepage) && (
          <div
            className="absolute bottom-0 start-0 end-0 h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(192,132,96,0.4) 30%, rgba(192,132,96,0.6) 50%, rgba(192,132,96,0.4) 70%, transparent 100%)',
            }}
            aria-hidden="true"
          />
        )}

        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full gap-6">
            {/* ── Logo ─────────────────────────────── */}
            <Link
              href="/"
              className="flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze rounded-sm"
              aria-label={t('accessibility.homeLink')}
            >
              <Image
                src="/logo/logo.svg"
                alt={t('accessibility.logo_alt')}
                width={128}
                height={34}
                priority
                className="h-[34px] w-auto"
              />
            </Link>

            {/* ── Desktop Navigation ───────────────── */}
            <nav
              className="hidden lg:flex items-center gap-1 flex-1"
              aria-label={t('accessibility.mainNavigation')}
            >
              {/* Regular nav links */}
              {desktopLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'relative px-3 py-2 text-sm font-medium rounded-lg',
                      'transition-colors duration-200',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-navy',
                      isActive
                        ? 'text-white'
                        : 'text-muted hover:text-white hover:bg-white/[0.04]'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {t(link.labelKey)}
                    {/* Active indicator — bronze dot */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-dot"
                        className="absolute bottom-1 start-1/2 -translate-x-1/2 h-1 w-1 rounded-full"
                        style={{ backgroundColor: '#C08460' }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                );
              })}

              {/* ── AI Tools Dropdown ─────────────── */}
              <div
                className="relative"
                ref={aiDropdownRef}
                onKeyDown={handleDropdownKeyDown}
              >
                <button
                  ref={aiButtonRef}
                  onClick={() => setAiDropdownOpen((prev) => !prev)}
                  className={cn(
                    'relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg',
                    'transition-colors duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-navy',
                    isAiToolActive || aiDropdownOpen
                      ? 'text-white bg-white/[0.04]'
                      : 'text-muted hover:text-white hover:bg-white/[0.04]'
                  )}
                  aria-expanded={aiDropdownOpen}
                  aria-haspopup="true"
                  aria-label={t('accessibility.openAiTools')}
                >
                  <Sparkles className="h-3.5 w-3.5 text-bronze" aria-hidden="true" />
                  <span>{t('nav.ai_tools')}</span>
                  <motion.span
                    animate={{ rotate: aiDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                  </motion.span>
                  {/* Active indicator */}
                  {isAiToolActive && !aiDropdownOpen && (
                    <motion.span
                      layoutId="nav-active-dot"
                      className="absolute bottom-1 start-1/2 -translate-x-1/2 h-1 w-1 rounded-full"
                      style={{ backgroundColor: '#C08460' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      aria-hidden="true"
                    />
                  )}
                </button>

                {/* Dropdown Panel */}
                <AnimatePresence>
                  {aiDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="absolute top-full mt-2 start-0 z-50 w-[480px] rounded-2xl overflow-hidden shadow-2xl"
                      style={{
                        background: 'rgba(15, 20, 25, 0.97)',
                        backdropFilter: 'blur(24px)',
                        border: '1px solid rgba(192, 132, 96, 0.2)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(192,132,96,0.1)',
                      }}
                      role="menu"
                      aria-label={t('accessibility.aiToolsMenu')}
                    >
                      {/* Dropdown header */}
                      <div
                        className="px-5 py-3 border-b"
                        style={{ borderColor: 'rgba(192,132,96,0.15)' }}
                      >
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                          {t('nav.ai_tools')}
                        </p>
                      </div>

                      {/* Tool grid: 2 columns */}
                      <div className="grid grid-cols-2 gap-0 p-3">
                        {aiToolsLinks.map((link) => {
                          const isActive = pathname === link.href;
                          const color = aiToolColors[link.href] ?? '#C08460';
                          const descKey = aiToolDescKeys[link.href];
                          const icon = aiToolIcons[link.href];
                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => setAiDropdownOpen(false)}
                              className={cn(
                                'group flex items-start gap-3 p-4 rounded-xl',
                                'transition-all duration-200',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze',
                                isActive
                                  ? 'bg-white/[0.06]'
                                  : 'hover:bg-white/[0.04]'
                              )}
                              role="menuitem"
                              aria-current={isActive ? 'page' : undefined}
                            >
                              {/* Icon */}
                              <div
                                className="flex-shrink-0 h-9 w-9 rounded-lg flex items-center justify-center mt-0.5 transition-transform duration-200 group-hover:scale-110"
                                style={{
                                  backgroundColor: `${color}18`,
                                  color,
                                }}
                              >
                                {icon}
                              </div>
                              {/* Text */}
                              <div className="min-w-0">
                                <p
                                  className={cn(
                                    'text-sm font-semibold mb-0.5 transition-colors duration-200',
                                    isActive ? 'text-white' : 'text-off-white group-hover:text-white'
                                  )}
                                  style={link.isHighlighted && !isActive ? { color } : undefined}
                                >
                                  {t(link.labelKey)}
                                  {link.isHighlighted && (
                                    <span
                                      className="ms-1.5 text-xs px-1.5 py-0.5 rounded-full font-medium"
                                      style={{
                                        backgroundColor: `${color}20`,
                                        color,
                                      }}
                                    >
                                      ✦
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs text-muted leading-relaxed">
                                  {descKey ? t(descKey) : ''}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* ── Right Section ────────────────────── */}
            <div className="flex items-center gap-2">
              {/* Get in Touch CTA — desktop only */}
              <Link
                href="/contact"
                className={cn(
                  'hidden lg:inline-flex items-center gap-2',
                  'px-4 py-2 rounded-xl text-sm font-semibold',
                  'transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-navy',
                  pathname === '/contact'
                    ? 'text-navy'
                    : 'text-bronze hover:text-navy'
                )}
                style={{
                  background:
                    pathname === '/contact'
                      ? '#C08460'
                      : 'rgba(192, 132, 96, 0.12)',
                  border: '1px solid rgba(192, 132, 96, 0.3)',
                }}
                onMouseEnter={(e) => {
                  if (pathname !== '/contact') {
                    (e.currentTarget as HTMLAnchorElement).style.background = '#C08460';
                  }
                }}
                onMouseLeave={(e) => {
                  if (pathname !== '/contact') {
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      'rgba(192, 132, 96, 0.12)';
                  }
                }}
                aria-label={t('accessibility.getStarted')}
              >
                {t('nav.get_started')}
              </Link>

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={cn(
                  'lg:hidden',
                  'h-11 w-11 rounded-lg',
                  'flex items-center justify-center',
                  'text-muted hover:text-white hover:bg-white/[0.06]',
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
