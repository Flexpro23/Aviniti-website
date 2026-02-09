'use client';

/**
 * Testimonials Section
 *
 * Auto-rotating carousel of client testimonials with manual navigation.
 * Features glassmorphism cards with star ratings and company details.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { fadeInUp } from '@/lib/motion/variants';
import { cn } from '@/lib/utils/cn';

interface Testimonial {
  id: string;
  quoteKey: string;
  nameKey: string;
  roleKey: string;
  companyKey: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    quoteKey: 'testimonial_1_quote',
    nameKey: 'testimonial_1_name',
    roleKey: 'testimonial_1_role',
    companyKey: 'testimonial_1_company',
    rating: 5,
  },
  {
    id: '2',
    quoteKey: 'testimonial_2_quote',
    nameKey: 'testimonial_2_name',
    roleKey: 'testimonial_2_role',
    companyKey: 'testimonial_2_company',
    rating: 5,
  },
  {
    id: '3',
    quoteKey: 'testimonial_3_quote',
    nameKey: 'testimonial_3_name',
    roleKey: 'testimonial_3_role',
    companyKey: 'testimonial_3_company',
    rating: 5,
  },
  {
    id: '4',
    quoteKey: 'testimonial_4_quote',
    nameKey: 'testimonial_4_name',
    roleKey: 'testimonial_4_role',
    companyKey: 'testimonial_4_company',
    rating: 5,
  },
];

const AUTO_ROTATE_INTERVAL = 6000; // 6 seconds

export function Testimonials() {
  const t = useTranslations('home.testimonials');
  const tCommon = useTranslations('common');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true); // Pause auto-rotation on touch
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;

    // Swipe threshold: 50px
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swiped left → go to next
        goToNext();
      } else {
        // Swiped right → go to previous
        goToPrevious();
      }
    }

    // Resume auto-rotation after a delay
    setTimeout(() => setIsPaused(false), 1000);
  };

  // Auto-rotate effect
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(goToNext, AUTO_ROTATE_INTERVAL);
    return () => clearInterval(interval);
  }, [isPaused, goToNext]);

  const currentTestimonial = TESTIMONIALS[currentIndex];

  return (
    <Section className="bg-navy">
      <Container>
        <ScrollReveal>
          <SectionHeading
            label={t('label')}
            title={t('title')}
            subtitle={t('subtitle')}
            align="center"
            className="mb-16"
          />
        </ScrollReveal>

        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Testimonial Card */}
          <div
            className="relative min-h-[320px] lg:min-h-[280px]"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                {/* Glassmorphism Card */}
                <div className="relative bg-slate-blue/40 backdrop-blur-md border border-slate-blue-light/30 rounded-2xl p-8 lg:p-12 shadow-xl">
                  {/* Quote Icon */}
                  <div className="absolute top-6 start-6 lg:top-8 lg:start-8 text-bronze/20" aria-hidden="true">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 48 48"
                      fill="currentColor"
                      className="w-10 h-10 lg:w-12 lg:h-12"
                    >
                      <path d="M12 34h8l4-8V14H12v12h6zm16 0h8l4-8V14H28v12h6z" />
                    </svg>
                  </div>

                  {/* Star Rating */}
                  <div className="flex items-center justify-center gap-1 mb-6" aria-label={`${currentTestimonial.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'w-5 h-5',
                          i < currentTestimonial.rating
                            ? 'text-bronze fill-bronze'
                            : 'text-slate-blue-light'
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg lg:text-xl text-off-white text-center leading-relaxed mb-8 relative z-10">
                    "{t(currentTestimonial.quoteKey)}"
                  </blockquote>

                  {/* Attribution */}
                  <div className="text-center">
                    <div className="text-white font-semibold text-lg mb-1">
                      {t(currentTestimonial.nameKey)}
                    </div>
                    <div className="text-muted text-sm">
                      {t(currentTestimonial.roleKey)}
                      {' • '}
                      <span className="text-bronze">{t(currentTestimonial.companyKey)}</span>
                    </div>
                  </div>

                  {/* Bronze glow effect */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(192, 132, 96, 0.1) 0%, transparent 70%)',
                    }}
                    aria-hidden="true"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 inset-x-0 flex items-center justify-between pointer-events-none px-0 lg:-mx-16">
            <button
              onClick={goToPrevious}
              className="pointer-events-auto w-12 h-12 rounded-full bg-slate-blue/60 backdrop-blur-sm border border-slate-blue-light/30 flex items-center justify-center text-off-white hover:bg-slate-blue hover:border-bronze transition-all duration-300 hover:scale-110"
              aria-label={tCommon('ui.prev_testimonial')}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={goToNext}
              className="pointer-events-auto w-12 h-12 rounded-full bg-slate-blue/60 backdrop-blur-sm border border-slate-blue-light/30 flex items-center justify-center text-off-white hover:bg-slate-blue hover:border-bronze transition-all duration-300 hover:scale-110"
              aria-label={tCommon('ui.next_testimonial')}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Dot Navigation */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <button
                key={testimonial.id}
                onClick={() => goToIndex(index)}
                className={cn(
                  'transition-all duration-300',
                  index === currentIndex
                    ? 'w-8 h-2 rounded-full bg-bronze'
                    : 'w-2 h-2 rounded-full bg-slate-blue-light hover:bg-bronze/60'
                )}
                aria-label={tCommon('ui.goto_testimonial', { number: index + 1 })}
                aria-current={index === currentIndex ? 'true' : 'false'}
              />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
