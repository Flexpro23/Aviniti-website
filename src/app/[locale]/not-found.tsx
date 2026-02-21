/**
 * 404 Not Found Page
 *
 * Custom 404 page with helpful navigation options.
 * Follows specs from components-global.md Section 8.
 */

'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { fadeIn, staggerContainer } from '@/lib/motion/variants';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { duration } from '@/lib/motion/tokens';

export default function NotFound() {
  const t = useTranslations('errors');
  const prefersReducedMotion = useReducedMotion();

  const helpfulLinks = [
    { label: t('404.links.ai_tools'), href: '/get-estimate' },
    { label: t('404.links.solutions'), href: '/solutions' },
    { label: t('404.links.blog'), href: '/blog' },
    { label: t('404.links.contact'), href: '/contact' },
  ];

  return (
    <div
      className="min-h-[70vh] flex items-center justify-center px-4 py-16"
      aria-label={t('aria_page_not_found')}
    >
      <div className="max-w-[560px] mx-auto text-center">
        {/* Large 404 Number (Decorative) */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, scale: 1.1 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
          transition={{ duration: duration.slower, ease: [0, 0, 0.2, 1] }}
          className="text-[120px] md:text-[180px] font-extrabold text-slate-blue-light leading-none select-none"
          aria-hidden="true"
        >
          404
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 15 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: duration.slow, delay: 0.1 }}
          className="text-h2 text-white mt-4"
        >
          {t('404.title')}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: duration.slow, delay: 0.25 }}
          className="text-lg text-muted mt-4"
        >
          {t('404.description')}
        </motion.p>

        {/* Primary CTAs */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: duration.slow, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8"
        >
          <Button asChild size="lg">
            <Link href="/">{t('404.cta.home')}</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/get-estimate">{t('404.cta.estimate')}</Link>
          </Button>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={prefersReducedMotion ? {} : { opacity: 1 }}
          transition={{ duration: duration.slow, delay: 0.5 }}
          className="mt-10"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-muted mb-4">
            {t('404.or_try')}
          </p>
          <motion.nav
            variants={prefersReducedMotion ? {} : staggerContainer(0.5, 0.05)}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center gap-3"
            aria-label={t('aria_suggested_pages')}
          >
            {helpfulLinks.map((link, index) => (
              <motion.div key={link.href} variants={fadeIn}>
                <Link
                  href={link.href}
                  className="text-sm text-bronze hover:text-bronze-light transition-colors inline-flex items-center gap-2 group"
                >
                  {link.label}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180"
                    aria-hidden="true"
                  />
                </Link>
              </motion.div>
            ))}
          </motion.nav>
        </motion.div>
      </div>
    </div>
  );
}
