'use client';

/**
 * Hero Section
 *
 * Full-viewport hero with headline, subtitle, CTAs, and device mockup.
 * Features animated text reveals and gradient overlay.
 */

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';
import { staggerContainerSlow, fadeInUp } from '@/lib/motion/variants';

export function HeroSection() {
  const t = useTranslations('home.hero');

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy">
      {/* Background gradient overlay */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(ellipse at 70% 50%, rgba(192, 132, 96, 0.06) 0%, transparent 60%)',
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
              <Badge variant="outline" className="px-4 py-2 rounded-full">
                <Sparkles className="w-3.5 h-3.5 me-2" aria-hidden="true" />
                {t('label')}
              </Badge>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeInUp} className="text-h1 text-white mb-6">
              {t('title')}
            </motion.h1>

            {/* Subheadline */}
            <motion.p variants={fadeInUp} className="text-lg lg:text-xl text-muted mb-10 max-w-xl mx-auto lg:mx-0">
              {t('subtitle')}
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button asChild variant="primary" size="lg">
                <Link href="/get-estimate">
                  {t('cta_primary')}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>

              <Button asChild variant="secondary" size="lg">
                <Link href="/solutions">{t('cta_secondary')}</Link>
              </Button>
            </motion.div>

            {/* Contact Link */}
            <motion.div variants={fadeInUp} className="mt-6">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-muted hover:text-off-white transition-colors text-sm"
              >
                {t('cta_tertiary')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            {/* Device Mockup Placeholder */}
            <div className="relative w-[280px] h-[560px] rounded-[40px] bg-slate-blue border-4 border-slate-blue-light shadow-xl overflow-hidden">
              {/* Screen content placeholder */}
              <div className="w-full h-full bg-gradient-to-br from-slate-blue-light to-slate-blue flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-bronze/20 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-10 h-10 text-bronze" />
                  </div>
                  <p className="text-sm text-muted">Device Mockup</p>
                </div>
              </div>
            </div>

            {/* Floating Code Snippets */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="hidden lg:block absolute top-8 -right-4 bg-slate-blue/90 backdrop-blur-sm border border-slate-blue-light rounded-lg px-4 py-3 shadow-lg"
              style={{ rotate: '2deg' }}
            >
              <code className="text-xs font-mono text-off-white">
                <span className="text-purple-400">const</span>{' '}
                <span className="text-white">ai</span> ={' '}
                <span className="text-bronze">analyze</span>(data)
              </code>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.9 }}
              className="hidden lg:block absolute bottom-12 -left-8 bg-slate-blue/90 backdrop-blur-sm border border-slate-blue-light rounded-lg px-4 py-3 shadow-lg"
              style={{ rotate: '-3deg' }}
            >
              <code className="text-xs font-mono text-off-white">
                {'<'}
                <span className="text-tool-blue">AppStore</span> rating=
                <span className="text-tool-green">"4.9"</span> {' />'}
              </code>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
