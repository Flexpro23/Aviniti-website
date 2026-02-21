/**
 * CTA Banner
 *
 * Full-width section with heading, subtitle, and CTA buttons.
 * Used at bottom of multiple pages for conversion.
 *
 * Features navy-light background with subtle gradient.
 */

'use client';

import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Link } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils/cn';
import { fadeInUp } from '@/lib/motion/variants';
import { useScrollReveal } from '@/lib/motion/hooks';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface CTABannerProps {
  heading: string;
  subtitle?: string;
  primaryCTA: {
    label: string;
    href: string;
  };
  secondaryCTA?: {
    label: string;
    href: string;
  };
  className?: string;
}

export function CTABanner({
  heading,
  subtitle,
  primaryCTA,
  secondaryCTA,
  className,
}: CTABannerProps) {
  const { ref, inView } = useScrollReveal({ margin: '-15% 0px -15% 0px' });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      ref={ref}
      className={cn(
        'py-16 md:py-24',
        'bg-gradient-to-br from-slate-blue via-navy to-slate-blue',
        'border-y border-slate-blue-light/50',
        className
      )}
    >
      <motion.div
        initial={prefersReducedMotion ? {} : 'hidden'}
        animate={prefersReducedMotion ? {} : inView ? 'visible' : 'hidden'}
        variants={{
          hidden: { opacity: 0, scale: 0.95 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: {
              duration: 0.5,
              ease: 'easeOut',
              staggerChildren: 0.15,
              delayChildren: 0.1,
            },
          },
        }}
        className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        {/* Heading */}
        <motion.h2
          variants={fadeInUp}
          className="text-h2 text-white"
        >
          {heading}
        </motion.h2>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            variants={fadeInUp}
            className="text-lg text-muted mt-4 max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}

        {/* CTAs */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
        >
          <Button asChild size="lg">
            <Link href={primaryCTA.href}>
              {primaryCTA.label}
              <ArrowRight className="w-5 h-5 rtl:rotate-180" />
            </Link>
          </Button>
          {secondaryCTA && (
            <Button asChild variant="secondary" size="lg">
              <Link href={secondaryCTA.href}>{secondaryCTA.label}</Link>
            </Button>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
