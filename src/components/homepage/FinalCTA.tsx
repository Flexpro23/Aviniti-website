'use client';

/**
 * Final CTA Section
 *
 * Full-width call-to-action with primary and secondary buttons.
 * Features scale-in animation and WhatsApp contact option.
 */

import { motion } from 'framer-motion';
import { ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { trackCtaClicked } from '@/lib/analytics';
import { Link } from '@/lib/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { scaleIn } from '@/lib/motion/variants';
import { useScrollReveal } from '@/lib/motion/hooks';

export function FinalCTA() {
  const t = useTranslations('home.final_cta');
  const locale = useLocale();
  const { ref, inView } = useScrollReveal({ once: true, amount: 0.3 });

  return (
    <section className="py-20 lg:py-32 bg-navy" aria-labelledby="final-cta-heading">
      <Container>
        <motion.div
          ref={ref}
          variants={scaleIn}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-blue via-slate-blue-light/80 to-slate-blue border border-slate-blue-light/50 p-6 sm:p-8 md:p-12 lg:p-16 text-center"
        >
          {/* Decorative Gradient Overlay */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(192, 132, 96, 0.15) 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-3xl mx-auto">
            {/* Heading */}
            <h2 id="final-cta-heading" className="text-h2 text-white mb-6">{t('title')}</h2>

            {/* Subtitle */}
            <p className="text-lg lg:text-xl text-muted mb-10 max-w-2xl mx-auto">
              {t('subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild variant="primary" size="lg">
                <Link href="/get-estimate" onClick={() => trackCtaClicked('final_cta', 'get_started', locale)}>
                  {t('cta_primary')}
                  <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                </Link>
              </Button>

              <Button asChild variant="secondary" size="lg">
                <Link href="/contact" onClick={() => trackCtaClicked('final_cta', 'contact', locale)}>
                  <Phone className="w-5 h-5" />
                  {t('cta_secondary')}
                </Link>
              </Button>
            </div>

            {/* WhatsApp Link */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted">
              <MessageCircle className="w-4 h-4" />
              <span>{t('whatsapp_label')}</span>
              <a
                href={`https://wa.me/962790685302?text=${encodeURIComponent(t('whatsapp_message'))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-bronze hover:text-bronze-light transition-colors underline underline-offset-2"
                onClick={() => trackCtaClicked('final_cta', 'whatsapp', locale)}
              >
                {t('whatsapp_cta')}
              </a>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
