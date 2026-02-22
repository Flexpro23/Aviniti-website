'use client';

/**
 * Hero Section — Simplified
 *
 * Clean hero with headline, subtitle, primary CTA, and secondary WhatsApp link.
 * Features animated text reveals and simple gradient overlays.
 */

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { trackCtaClicked } from '@/lib/analytics';
import { Link } from '@/lib/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';
import { staggerContainerSlow, fadeInUp } from '@/lib/motion/variants';

const WHATSAPP_URL = 'https://wa.me/962790798824';

export function HeroSection() {
  const t = useTranslations('home.hero');
  const locale = useLocale();

  return (
    <section className="relative -mt-16 min-h-screen flex items-center justify-center overflow-hidden bg-navy pt-16">
      {/* Background gradient overlays */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 70% 40%, rgba(192, 132, 96, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(26, 35, 50, 0.8) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      {/* Subtle ambient glow on right side */}
      <motion.div
        className="absolute top-1/4 end-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.06, 0.08, 0.06],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ backgroundColor: 'var(--color-bronze)' }}
        aria-hidden="true"
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(244, 244, 242, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(244, 244, 242, 0.1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
        aria-hidden="true"
      />

      <Container className="relative z-10 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            variants={staggerContainerSlow}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-start"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="flex justify-center lg:justify-start mb-6">
              <div className="relative">
                <Badge variant="outline" className="px-4 py-2 rounded-full relative z-10">
                  <Sparkles className="w-3.5 h-3.5 me-2" aria-hidden="true" />
                  {t('label')}
                </Badge>
                {/* Breathing glow behind badge */}
                <motion.div
                  className="absolute inset-0 rounded-full blur-md"
                  style={{ backgroundColor: 'var(--color-bronze)', zIndex: -1 }}
                  animate={{ opacity: [0.08, 0.2, 0.08] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeInUp} className="text-h1 text-white mb-6">
              {t('title_line1')}{' '}
              <span className="text-gradient-bronze-shimmer">{t('title_accent')}</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeInUp}
              className="text-lg lg:text-xl text-muted mb-10 max-w-xl mx-auto lg:mx-0"
            >
              {t('subtitle')}
            </motion.p>

            {/* Primary CTA */}
            <motion.div variants={fadeInUp} className="flex flex-col items-center lg:items-start">
              <div className="relative overflow-hidden rounded-lg group">
                <Button asChild variant="primary" size="lg">
                  <Link href="/get-estimate" onClick={() => trackCtaClicked('hero', 'get_estimate', locale)}>
                    {t('cta_primary')}
                    <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                  </Link>
                </Button>
                {/* Periodic light sweep */}
                <motion.div
                  className="absolute inset-0 pointer-events-none rounded-lg"
                  style={{
                    background: 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.07) 50%, transparent 70%)',
                  }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 5, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>

              {/* Secondary WhatsApp Link */}
              <motion.div variants={fadeInUp} className="mt-6">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-muted hover:text-off-white transition-colors text-sm"
                  onClick={() => trackCtaClicked('hero', 'whatsapp', locale)}
                >
                  {t('cta_tertiary')}
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </a>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right - Decorative Gradient Blur Circles */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:flex items-center justify-center h-[400px] lg:h-[500px]"
            aria-hidden="true"
          >
            {/* Decorative gradient blur circles */}
            <motion.div
              className="absolute w-64 h-64 rounded-full blur-3xl opacity-30"
              animate={{
                x: [0, 40, 0],
                y: [0, -30, 0],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                background: 'linear-gradient(135deg, var(--color-tool-orange-dark), var(--color-tool-orange))',
              }}
            />
            <motion.div
              className="absolute w-80 h-80 rounded-full blur-3xl opacity-20"
              animate={{
                x: [0, -50, 0],
                y: [0, 40, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
              style={{
                background: 'linear-gradient(135deg, var(--color-tool-blue-dark), var(--color-tool-blue))',
              }}
            />
            <motion.div
              className="absolute w-56 h-56 rounded-full blur-2xl opacity-25"
              animate={{
                x: [0, 30, 0],
                y: [0, 50, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 11,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 2,
              }}
              style={{
                background: 'linear-gradient(135deg, var(--color-tool-green-dark), var(--color-tool-green))',
              }}
            />
          </motion.div>
        </div>
      </Container>

      {/* Bottom gradient separator */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-bronze/20 to-transparent" aria-hidden="true" />
    </section>
  );
}
