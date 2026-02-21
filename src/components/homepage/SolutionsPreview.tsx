'use client';

/**
 * Solutions Preview Section - Premium Showcase
 *
 * Showcases all 7 ready-made solutions in a horizontal scrollable carousel.
 * Features category-colored cards with feature previews, pricing,
 * demo indicators, and rich hover effects matching the AI Tools section quality.
 */

import { useTranslations, useLocale } from 'next-intl';
import { useRef, useState, useEffect, useCallback } from 'react';
import {
  Truck, GraduationCap, ShoppingCart, Building2,
  Dumbbell, Home, Brain, ArrowRight, ChevronLeft,
  ChevronRight, Check, Clock, Play,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { Link } from '@/lib/i18n/navigation';
import { solutions } from '@/lib/data/solutions';
import { fadeInUp } from '@/lib/motion/variants';
import { motion } from 'framer-motion';

type AccentColor = 'orange' | 'blue' | 'green' | 'purple';

/** Map each solution slug to a distinct category accent color */
const solutionColorMap: Record<string, AccentColor> = {
  'delivery-app-system': 'orange',
  'kindergarten-management': 'blue',
  'hypermarket-management': 'green',
  'office-management': 'purple',
  'gym-management': 'orange',
  'airbnb-marketplace': 'blue',
  'hair-transplant-ai': 'purple',
};

const iconMap: Record<string, React.ReactNode> = {
  Truck: <Truck className="w-6 h-6" />,
  GraduationCap: <GraduationCap className="w-6 h-6" />,
  ShoppingCart: <ShoppingCart className="w-6 h-6" />,
  Building2: <Building2 className="w-6 h-6" />,
  Dumbbell: <Dumbbell className="w-6 h-6" />,
  Home: <Home className="w-6 h-6" />,
  Brain: <Brain className="w-6 h-6" />,
};

/** Color config for each accent – icon, glow, borders, badges, checks */
const colorConfig: Record<AccentColor, {
  iconBg: string;
  iconText: string;
  iconBorder: string;
  topBar: string;
  hoverGlow: string;
  hoverBorder: string;
  gradientBorder: string;
  badge: string;
  check: string;
  cta: string;
}> = {
  orange: {
    iconBg: 'bg-tool-orange/20',
    iconText: 'text-tool-orange-light',
    iconBorder: 'border-tool-orange/30',
    topBar: 'from-tool-orange via-tool-orange-light to-tool-orange',
    hoverGlow: 'group-hover/card:shadow-[0_0_40px_rgba(154,106,60,0.2)]',
    hoverBorder: 'group-hover/card:border-tool-orange/25',
    gradientBorder: 'from-tool-orange/40 via-tool-orange/15 to-transparent',
    badge: 'bg-tool-orange-dark border-tool-orange/25 text-tool-orange-light',
    check: 'text-tool-orange-light',
    cta: 'text-tool-orange-light',
  },
  blue: {
    iconBg: 'bg-tool-blue/20',
    iconText: 'text-tool-blue-light',
    iconBorder: 'border-tool-blue/30',
    topBar: 'from-tool-blue via-tool-blue-light to-tool-blue',
    hoverGlow: 'group-hover/card:shadow-[0_0_40px_rgba(90,122,155,0.2)]',
    hoverBorder: 'group-hover/card:border-tool-blue/25',
    gradientBorder: 'from-tool-blue/40 via-tool-blue/15 to-transparent',
    badge: 'bg-tool-blue-dark border-tool-blue/25 text-tool-blue-light',
    check: 'text-tool-blue-light',
    cta: 'text-tool-blue-light',
  },
  green: {
    iconBg: 'bg-tool-green/20',
    iconText: 'text-tool-green-light',
    iconBorder: 'border-tool-green/30',
    topBar: 'from-tool-green via-tool-green-light to-tool-green',
    hoverGlow: 'group-hover/card:shadow-[0_0_40px_rgba(74,126,98,0.2)]',
    hoverBorder: 'group-hover/card:border-tool-green/25',
    gradientBorder: 'from-tool-green/40 via-tool-green/15 to-transparent',
    badge: 'bg-tool-green-dark border-tool-green/25 text-tool-green-light',
    check: 'text-tool-green-light',
    cta: 'text-tool-green-light',
  },
  purple: {
    iconBg: 'bg-tool-purple/20',
    iconText: 'text-tool-purple-light',
    iconBorder: 'border-tool-purple/30',
    topBar: 'from-tool-purple via-tool-purple-light to-tool-purple',
    hoverGlow: 'group-hover/card:shadow-[0_0_40px_rgba(122,94,150,0.2)]',
    hoverBorder: 'group-hover/card:border-tool-purple/25',
    gradientBorder: 'from-tool-purple/40 via-tool-purple/15 to-transparent',
    badge: 'bg-tool-purple-dark border-tool-purple/25 text-tool-purple-light',
    check: 'text-tool-purple-light',
    cta: 'text-tool-purple-light',
  },
};

export function SolutionsPreview() {
  const t = useTranslations('home.solutions');
  const st = useTranslations('solutions');
  const ct = useTranslations('common');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollStart, setCanScrollStart] = useState(false);
  const [canScrollEnd, setCanScrollEnd] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;

    if (isRTL) {
      setCanScrollStart(scrollLeft < -10);
      setCanScrollEnd(scrollLeft > -(maxScroll - 10));
    } else {
      setCanScrollStart(scrollLeft > 10);
      setCanScrollEnd(scrollLeft < maxScroll - 10);
    }
  }, [isRTL]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  const handleScroll = (direction: 'start' | 'end') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 370;
    let delta = direction === 'end' ? amount : -amount;
    if (isRTL) delta = -delta;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <Section className="bg-navy-dark relative overflow-hidden">
      {/* Subtle dot grid background */}
      <div className="absolute inset-0 opacity-[0.02]" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(192,132,96,0.4) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <Container>
        <ScrollReveal>
          <SectionHeading
            label={t('label')}
            title={t('title')}
            subtitle={t('subtitle')}
            align="center"
            className="mb-14"
          />
        </ScrollReveal>
      </Container>

      {/* Carousel */}
      <div className="relative group/carousel">
        {/* Start fade overlay */}
        <div
          className="absolute inset-y-0 z-10 pointer-events-none w-6 sm:w-12 lg:w-20"
          style={{
            [isRTL ? 'right' : 'left']: 0,
            background: isRTL
              ? 'linear-gradient(to left, transparent, var(--color-navy-dark))'
              : 'linear-gradient(to right, var(--color-navy-dark), transparent)',
          }}
        />
        {/* End fade overlay */}
        <div
          className="absolute inset-y-0 z-10 pointer-events-none w-6 sm:w-12 lg:w-20"
          style={{
            [isRTL ? 'left' : 'right']: 0,
            background: isRTL
              ? 'linear-gradient(to right, transparent, var(--color-navy-dark))'
              : 'linear-gradient(to left, var(--color-navy-dark), transparent)',
          }}
        />

        {/* Scroll track */}
        <div
          ref={scrollRef}
          role="region"
          aria-label={t('scroll_region_aria')}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              handleScroll(isRTL ? 'end' : 'start');
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              handleScroll(isRTL ? 'start' : 'end');
            }
          }}
          className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory px-6 sm:px-10 lg:px-20 pb-4"
        >
          {solutions.map((solution, index) => {
            const color = solutionColorMap[solution.slug] || 'orange';
            const c = colorConfig[color];

            return (
              <motion.div
                key={solution.slug}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.06 }}
                className="snap-start flex-shrink-0 w-[300px] sm:w-[340px]"
              >
                <div
                  className={`group/card relative h-full rounded-xl transition-all duration-300 ${c.hoverGlow}`}
                >
                  {/* Gradient border glow on hover */}
                  <div
                    className={`absolute -inset-[1px] rounded-xl opacity-0 group-hover/card:opacity-100
                      transition-opacity duration-300 pointer-events-none blur-[1px]
                      bg-gradient-to-b ${c.gradientBorder}`}
                  />

                  <div
                    className={`relative h-full rounded-xl bg-slate-blue border border-slate-blue-light
                      ${c.hoverBorder} transition-all duration-300
                      group-hover/card:-translate-y-1 flex flex-col overflow-hidden`}
                  >
                    {/* Category color bar */}
                    <div className={`h-[3px] bg-gradient-to-r ${c.topBar}`} />

                    {/* Card body */}
                    <div className="p-5 sm:p-6 flex flex-col flex-1">
                      {/* Header: icon + demo badge */}
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-11 h-11 rounded-lg ${c.iconBg} ${c.iconText}
                            border ${c.iconBorder} flex items-center justify-center
                            transition-transform duration-300 group-hover/card:scale-110`}
                        >
                          {iconMap[solution.icon] || <Truck className="w-6 h-6" />}
                        </div>

                        {solution.hasDemo && (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5
                              text-[11px] font-medium rounded-full border ${c.badge}`}
                          >
                            <Play className="w-2.5 h-2.5 fill-current" />
                            {t('demo_available')}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold text-off-white mb-1 leading-tight">
                        {st(solution.nameKey)}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-2">
                        {st(solution.descriptionKey)}
                      </p>

                      {/* Feature preview (3 features + "more" count) */}
                      <div className="space-y-2 mb-5 flex-1">
                        {[1, 2, 3].map((n) => (
                          <div key={n} className="flex items-start gap-2">
                            <Check
                              className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${c.check}`}
                            />
                            <span className="text-[13px] text-muted/90 leading-snug">
                              {st(`${solution.featuresKeyPrefix}.feature_${n}`)}
                            </span>
                          </div>
                        ))}
                        {solution.featureCount > 3 && (
                          <p className="text-xs text-muted/50 ps-[22px]">
                            +{solution.featureCount - 3} {t('more_features')}
                          </p>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-slate-blue-light/50 mb-4" />

                      {/* Price + Timeline */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-[11px] text-muted/50 mb-0.5">
                            {t('starting_from')}
                          </p>
                          <p className="text-lg font-bold text-bronze-light">
                            ${solution.startingPrice.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted/60">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            {solution.timelineDays} {t('delivery')}
                          </span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Link
                        href={`/solutions/${solution.slug}`}
                        className={`inline-flex items-center justify-center gap-2 w-full py-2.5
                          text-sm font-medium rounded-lg transition-all duration-200
                          bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06]
                          hover:border-white/[0.12] ${c.cta}`}
                      >
                        {t('learn_more')}
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 rtl:rotate-180 group-hover/card:translate-x-0.5 rtl:group-hover/card:-translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation arrow – start */}
        {canScrollStart && (
          <button
            onClick={() => handleScroll('start')}
            className="hidden lg:flex absolute top-1/2 -translate-y-1/2 start-3 z-20
              w-10 h-10 rounded-full items-center justify-center
              bg-slate-blue/90 backdrop-blur-sm border border-slate-blue-light
              text-muted hover:text-white hover:border-bronze/30
              transition-all duration-200 shadow-lg"
            aria-label={ct('accessibility.scroll_back')}
          >
            <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
          </button>
        )}

        {/* Navigation arrow – end */}
        {canScrollEnd && (
          <button
            onClick={() => handleScroll('end')}
            className="hidden lg:flex absolute top-1/2 -translate-y-1/2 end-3 z-20
              w-10 h-10 rounded-full items-center justify-center
              bg-slate-blue/90 backdrop-blur-sm border border-slate-blue-light
              text-muted hover:text-white hover:border-bronze/30
              transition-all duration-200 shadow-lg"
            aria-label={ct('accessibility.scroll_forward')}
          >
            <ChevronRight className="w-5 h-5 rtl:rotate-180" />
          </button>
        )}
      </div>

      {/* View All CTA */}
      <Container>
        <ScrollReveal delay={0.2}>
          <div className="text-center mt-12">
            <Button asChild variant="secondary" size="lg">
              <Link href="/solutions">
                {t('view_all')}
                <ArrowRight className="w-5 h-5 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
