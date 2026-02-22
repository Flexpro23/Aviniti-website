/**
 * Enhanced Mobile Navigation Drawer
 *
 * Slide-out navigation panel for mobile/tablet screens.
 * Includes:
 * - Aviniti logo at the top
 * - Primary nav links with icons and active states
 * - AI Tools section with icons and descriptions
 * - "Get in Touch" CTA at the bottom
 * - Language Switcher
 *
 * Features:
 * - Slides from end (right in LTR, left in RTL)
 * - Focus trap when open
 * - Body scroll lock
 * - Escape key closes
 * - Backdrop click closes
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  X,
  Sparkles,
  Home,
  Layers,
  BookOpen,
  HelpCircle,
  MessageSquare,
  Lightbulb,
  ScanSearch,
  Calculator,
  TrendingUp,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/lib/i18n/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import {
  getDrawerVariants,
  backdropVariants,
  staggerContainerFast,
  fadeInUp,
} from '@/lib/motion/variants';
import { mainNavLinks, aiToolsLinks } from '@/lib/data/navigation';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Icon map for main nav links
const mainNavIcons: Record<string, React.ReactNode> = {
  '/': <Home className="h-5 w-5" />,
  '/solutions': <Layers className="h-5 w-5" />,
  '/case-studies': <BookOpen className="h-5 w-5" />,
  '/blog': <FileText className="h-5 w-5" />,
  '/faq': <HelpCircle className="h-5 w-5" />,
  '/contact': <MessageSquare className="h-5 w-5" />,
};

// Icon map for AI tools
const aiToolIcons: Record<string, React.ReactNode> = {
  '/idea-lab': <Lightbulb className="h-4 w-4" />,
  '/ai-analyzer': <ScanSearch className="h-4 w-4" />,
  '/get-estimate': <Calculator className="h-4 w-4" />,
  '/roi-calculator': <TrendingUp className="h-4 w-4" />,
};

// AI tool accent colors
const aiToolColors: Record<string, string> = {
  '/idea-lab': '#C08460',
  '/ai-analyzer': '#60A5FA',
  '/get-estimate': '#34D399',
  '/roi-calculator': '#A78BFA',
};

// Description key map for AI tools (relative to 'common' namespace)
const aiToolDescKeys: Record<string, string> = {
  '/idea-lab': 'nav.aiTools.ideaLabDesc',
  '/ai-analyzer': 'nav.aiTools.analyzerDesc',
  '/get-estimate': 'nav.aiTools.estimateDesc',
  '/roi-calculator': 'nav.aiTools.roiDesc',
};

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const t = useTranslations('common');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap: capture focus on open, restore on close
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      const timer = setTimeout(() => {
        const closeBtn = drawerRef.current?.querySelector<HTMLElement>('button');
        closeBtn?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isOpen]);

  // Focus trap: keep Tab cycling within drawer
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !drawerRef.current) return;
    const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 z-50 bg-navy/90 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.div
            ref={drawerRef}
            variants={getDrawerVariants(isRTL)}
            initial="hidden"
            animate="visible"
            exit="exit"
            onKeyDown={handleKeyDown}
            className={cn(
              'fixed top-0 end-0 h-full z-50',
              'w-[320px] max-w-[88vw]',
              'overflow-y-auto',
              'flex flex-col'
            )}
            style={{
              background: 'rgba(13, 17, 23, 0.98)',
              backdropFilter: 'blur(24px)',
              borderInlineStart: '1px solid rgba(192, 132, 96, 0.2)',
              boxShadow: '-20px 0 60px rgba(0,0,0,0.6)',
            }}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t('accessibility.navigationMenu')}
          >
            {/* ── Header: Logo + Close button ──────── */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0"
              style={{ borderColor: 'rgba(192,132,96,0.15)' }}
            >
              <Link href="/" onClick={onClose} aria-label={t('accessibility.homeLink')}>
                <Image
                  src="/logo/logo.svg"
                  alt={t('accessibility.logo_alt')}
                  width={108}
                  height={28}
                  className="h-7 w-auto"
                />
              </Link>
              <button
                onClick={onClose}
                className={cn(
                  'h-9 w-9 rounded-lg',
                  'flex items-center justify-center',
                  'text-muted hover:text-white',
                  'transition-colors duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze'
                )}
                style={{ background: 'rgba(255,255,255,0.05)' }}
                aria-label={t('accessibility.closeMenu')}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* ── Scrollable content ───────────────── */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {/* Primary Nav Links */}
              <motion.nav
                variants={staggerContainerFast}
                initial="hidden"
                animate="visible"
                className="space-y-0.5"
                aria-label={t('accessibility.mainNavigation')}
              >
                {mainNavLinks
                  .filter((l) => l.href !== '/contact')
                  .map((link) => {
                    const isActive = pathname === link.href;
                    const icon = mainNavIcons[link.href];
                    return (
                      <motion.div key={link.href} variants={fadeInUp}>
                        <Link
                          href={link.href}
                          onClick={onClose}
                          className={cn(
                            'flex items-center gap-3 w-full text-start px-3 py-3 rounded-xl',
                            'text-base font-medium',
                            'transition-all duration-200',
                            isActive
                              ? 'text-white'
                              : 'text-muted hover:text-white'
                          )}
                          style={
                            isActive
                              ? {
                                  background: 'rgba(192,132,96,0.12)',
                                  color: '#C08460',
                                }
                              : { background: 'transparent' }
                          }
                          onMouseEnter={(e) => {
                            if (!isActive) {
                              (e.currentTarget as HTMLAnchorElement).style.background =
                                'rgba(255,255,255,0.04)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) {
                              (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                            }
                          }}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          {/* Icon */}
                          <span
                            className={cn(
                              'flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center',
                              'transition-colors duration-200'
                            )}
                            style={{
                              background: isActive
                                ? 'rgba(192,132,96,0.2)'
                                : 'rgba(255,255,255,0.05)',
                              color: isActive ? '#C08460' : undefined,
                            }}
                            aria-hidden="true"
                          >
                            {icon}
                          </span>
                          {t(link.labelKey)}
                          {isActive && (
                            <span
                              className="ms-auto h-1.5 w-1.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: '#C08460' }}
                              aria-hidden="true"
                            />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
              </motion.nav>

              {/* ── AI Tools Section ─────────────────── */}
              <div
                className="mt-5 pt-4 border-t"
                style={{ borderColor: 'rgba(192,132,96,0.12)' }}
              >
                <div className="flex items-center gap-2 px-3 mb-3">
                  <Sparkles className="h-3.5 w-3.5 text-bronze" aria-hidden="true" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    {t('nav.ai_tools')}
                  </p>
                </div>

                <div className="space-y-0.5">
                  {aiToolsLinks.map((link) => {
                    const isActive = pathname === link.href;
                    const color = aiToolColors[link.href] ?? '#C08460';
                    const icon = aiToolIcons[link.href];
                    const descKey = aiToolDescKeys[link.href];
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={onClose}
                        className={cn(
                          'flex items-center gap-3 w-full text-start px-3 py-3 rounded-xl',
                          'transition-all duration-200',
                          isActive ? 'text-white' : 'text-muted hover:text-off-white'
                        )}
                        style={{
                          background: isActive
                            ? `${color}12`
                            : 'transparent',
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            (e.currentTarget as HTMLAnchorElement).style.background =
                              'rgba(255,255,255,0.03)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                          }
                        }}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {/* Icon */}
                        <span
                          className="flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center"
                          style={{
                            backgroundColor: `${color}18`,
                            color,
                          }}
                          aria-hidden="true"
                        >
                          {icon}
                        </span>
                        {/* Label + desc */}
                        <span className="min-w-0">
                          <span
                            className={cn(
                              'block text-sm font-medium',
                              isActive ? '' : 'group-hover:text-white'
                            )}
                            style={
                              isActive
                                ? { color }
                                : link.isHighlighted
                                ? { color }
                                : undefined
                            }
                          >
                            {t(link.labelKey)}
                          </span>
                          {descKey && (
                            <span className="block text-xs text-muted leading-relaxed">
                              {t(descKey)}
                            </span>
                          )}
                        </span>
                        {isActive && (
                          <span
                            className="ms-auto h-1.5 w-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: color }}
                            aria-hidden="true"
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Footer: Get in Touch CTA ─────────── */}
            <div
              className="flex-shrink-0 px-4 py-4 border-t"
              style={{ borderColor: 'rgba(192,132,96,0.15)' }}
            >
              <Link
                href="/contact"
                onClick={onClose}
                className={cn(
                  'flex items-center justify-center gap-2',
                  'w-full px-4 py-3 rounded-xl',
                  'text-sm font-semibold',
                  'transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze'
                )}
                style={{
                  background: pathname === '/contact' ? '#C08460' : 'rgba(192,132,96,0.15)',
                  color: pathname === '/contact' ? '#0F1419' : '#C08460',
                  border: '1px solid rgba(192,132,96,0.3)',
                }}
              >
                <MessageSquare className="h-4 w-4" aria-hidden="true" />
                {t('nav.get_started')}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
