'use client';

/**
 * Final CTA Section — Premium Edition
 *
 * High-end call-to-action with frosted glass design, cursor-following spotlight,
 * inner shimmer effect, floating decorative orbs, and staggered animations.
 * Features ambient glow, pulsing primary button, and WhatsApp integration.
 */

import { motion } from 'framer-motion';
import { ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useRef, useCallback, useEffect, useState } from 'react';
import { trackCtaClicked } from '@/lib/analytics';
import { Link } from '@/lib/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { useScrollReveal, usePrefersReducedMotion } from '@/lib/motion/hooks';

interface CursorPosition {
  x: number;
  y: number;
}

export function FinalCTA() {
  const t = useTranslations('home.final_cta');
  const locale = useLocale();
  const { ref: sectionRef, inView } = useScrollReveal({ once: true, amount: 0.3 });
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Mouse tracking refs (not state to avoid re-renders)
  const spotlightPosRef = useRef<CursorPosition>({ x: 0, y: 0 });
  const shimmerPosRef = useRef<CursorPosition>({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Initialize touch detection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouchDevice(window.matchMedia('(hover: none)').matches);
    }
  }, []);

  // Handle mouse move for spotlight and shimmer
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!cardRef.current || isTouchDevice || prefersReducedMotion) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Update refs without causing re-renders
    spotlightPosRef.current = { x, y };
    shimmerPosRef.current = { x: x * 0.8, y: y * 0.8 }; // Offset shimmer slightly

    // Update CSS custom properties for gradients
    cardRef.current.style.setProperty('--gx', `${x}px`);
    cardRef.current.style.setProperty('--gy', `${y}px`);
    cardRef.current.style.setProperty('--sx', `${x * 0.8}px`);
    cardRef.current.style.setProperty('--sy', `${y * 0.8}px`);
  }, [isTouchDevice, prefersReducedMotion]);

  useEffect(() => {
    if (isTouchDevice || prefersReducedMotion) return;

    const element = cardRef.current;
    if (!element) return;

    element.addEventListener('mousemove', handleMouseMove);
    return () => element.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove, isTouchDevice, prefersReducedMotion]);

  // Stagger delays for children
  const delays = {
    heading: 0,
    subtitle: 0.1,
    buttons: 0.2,
    whatsapp: 0.3,
  };

  return (
    <section className="py-20 lg:py-32 bg-navy relative overflow-hidden" aria-labelledby="final-cta-heading">
      {/* Ambient glow background (behind the card) */}
      {!isTouchDevice && !prefersReducedMotion && (
        <div
          className="absolute -inset-32 opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(192, 132, 96, 0.4) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          aria-hidden="true"
        />
      )}

      <Container>
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative"
        >
          {/* Floating decorative orbs */}
          {!isTouchDevice && !prefersReducedMotion && (
            <>
              {/* Top-left orb */}
              <motion.div
                className="absolute -top-12 -start-12 w-24 h-24 rounded-full opacity-10 blur-2xl pointer-events-none"
                style={{ background: 'rgba(192, 132, 96, 0.6)' }}
                animate={{
                  y: [0, -20, 0],
                  x: [0, 10, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                aria-hidden="true"
              />

              {/* Top-right orb */}
              <motion.div
                className="absolute -top-8 -end-8 w-32 h-32 rounded-full opacity-[0.08] blur-3xl pointer-events-none"
                style={{ background: 'rgba(192, 132, 96, 0.5)' }}
                animate={{
                  y: [0, 25, 0],
                  x: [0, -15, 0],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5,
                }}
                aria-hidden="true"
              />

              {/* Bottom-right orb */}
              <motion.div
                className="absolute -bottom-16 -end-16 w-28 h-28 rounded-full opacity-[0.12] blur-2xl pointer-events-none"
                style={{ background: 'rgba(192, 132, 96, 0.4)' }}
                animate={{
                  y: [0, -15, 0],
                  x: [0, -8, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
                aria-hidden="true"
              />
            </>
          )}

          {/* Main CTA Card */}
          <motion.div
            ref={cardRef}
            className="relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 text-center"
            style={{
              '--gx': '50%',
              '--gy': '50%',
              '--sx': '50%',
              '--sy': '50%',
            } as React.CSSProperties & { '--gx': string; '--gy': string; '--sx': string; '--sy': string }}
          >
            {/* Frosted glass background */}
            <div
              className="absolute inset-0 bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-3xl"
              aria-hidden="true"
            />

            {/* Inner highlight border */}
            <div
              className="absolute inset-0 rounded-3xl opacity-50 pointer-events-none"
              style={{
                boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
              }}
              aria-hidden="true"
            />

            {/* Bronze spotlight overlay (cursor-following) */}
            {!isTouchDevice && !prefersReducedMotion && (
              <div
                className="absolute inset-0 pointer-events-none rounded-3xl transition-opacity duration-300"
                style={{
                  background:
                    'radial-gradient(600px circle at var(--gx) var(--gy), rgba(192, 132, 96, 0.08), transparent 40%)',
                }}
                aria-hidden="true"
              />
            )}

            {/* Inner shimmer (subtle, cursor-following) */}
            {!isTouchDevice && !prefersReducedMotion && (
              <div
                className="absolute inset-0 pointer-events-none rounded-3xl"
                style={{
                  background:
                    'radial-gradient(300px circle at var(--sx) var(--sy), rgba(255, 255, 255, 0.06), transparent 40%)',
                }}
                aria-hidden="true"
              />
            )}

            {/* Bronze accent line at top with glow */}
            <div
              className="absolute top-0 inset-x-0 h-px opacity-60"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(192, 132, 96, 0.8) 50%, transparent 100%)',
                boxShadow: '0 0 20px rgba(192, 132, 96, 0.3)',
              }}
              aria-hidden="true"
            />

            {/* Content */}
            <div className="relative z-10 max-w-3xl mx-auto">
              {/* Heading */}
              <motion.h2
                id="final-cta-heading"
                className="text-h2 text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: delays.heading }}
              >
                {t('title')}
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                className="text-lg lg:text-xl text-muted mb-10 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: delays.subtitle }}
              >
                {t('subtitle')}
              </motion.p>

              {/* Divider line with gradient */}
              <motion.div
                className="h-px max-w-sm mx-auto mb-8 opacity-50"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(192, 132, 96, 0.5) 50%, transparent 100%)',
                }}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={inView ? { opacity: 0.5, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: delays.buttons - 0.05 }}
                aria-hidden="true"
              />

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: delays.buttons }}
              >
                {/* Primary button with pulsing glow */}
                <div className="relative group">
                  {!isTouchDevice && !prefersReducedMotion && (
                    <div
                      className="absolute -inset-1 rounded-lg opacity-75 group-hover:opacity-100 blur transition duration-300"
                      style={{
                        background: 'radial-gradient(circle at center, rgba(192, 132, 96, 0.4), transparent 70%)',
                        animation: 'pulse-glow 3s ease-in-out infinite',
                      }}
                      aria-hidden="true"
                    />
                  )}
                  <Button asChild variant="primary" size="lg" className="relative">
                    <Link
                      href="/get-estimate"
                      onClick={() => trackCtaClicked('final_cta', 'get_started', locale)}
                    >
                      {t('cta_primary')}
                      <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                    </Link>
                  </Button>
                </div>

                {/* Secondary button */}
                <Button asChild variant="secondary" size="lg">
                  <Link
                    href="/contact"
                    onClick={() => trackCtaClicked('final_cta', 'contact', locale)}
                  >
                    <Phone className="w-5 h-5" />
                    {t('cta_secondary')}
                  </Link>
                </Button>
              </motion.div>

              {/* Horizontal divider before WhatsApp */}
              <motion.div
                className="h-px max-w-xs mx-auto mb-6 opacity-40"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(192, 132, 96, 0.4) 50%, transparent 100%)',
                }}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={inView ? { opacity: 0.4, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: delays.buttons + 0.05 }}
                aria-hidden="true"
              />

              {/* WhatsApp Link */}
              <motion.div
                className="flex items-center justify-center gap-2 text-sm text-muted"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: delays.whatsapp }}
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>{t('whatsapp_label')}</span>
                <a
                  href={`https://wa.me/962790685302?text=${encodeURIComponent(t('whatsapp_message'))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#25D366] hover:text-[#1fa857] transition-colors underline underline-offset-2 font-medium"
                  onClick={() => trackCtaClicked('final_cta', 'whatsapp', locale)}
                >
                  {t('whatsapp_cta')}
                </a>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </Container>

      {/* CSS for pulse-glow animation */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(192, 132, 96, 0.4), 0 0 40px rgba(192, 132, 96, 0.2);
          }
          50% {
            box-shadow: 0 0 30px rgba(192, 132, 96, 0.6), 0 0 60px rgba(192, 132, 96, 0.3);
          }
        }
      `}</style>
    </section>
  );
}
