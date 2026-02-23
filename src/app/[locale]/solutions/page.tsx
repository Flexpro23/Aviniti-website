'use client';

/**
 * Solutions Page — Premium Edition
 *
 * Showcases 8 ready-made solutions with thumbnail hero images,
 * frosted glass cards, category accent colors, and filter tabs.
 */

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Clock, DollarSign, ArrowRight, Monitor, Smartphone, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { solutions } from '@/lib/data/solutions';
import type { SolutionCategory } from '@/types/solutions';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { CTABanner } from '@/components/shared/CTABanner';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { HERO_BLUR_URL } from '@/lib/utils/image';

type FilterCategory = 'all' | SolutionCategory;

const categoryFilters: { key: FilterCategory; labelKey: string }[] = [
  { key: 'all', labelKey: 'filter_all' },
  { key: 'delivery', labelKey: 'filter_delivery' },
  { key: 'education', labelKey: 'filter_education' },
  { key: 'booking', labelKey: 'filter_booking' },
  { key: 'ecommerce', labelKey: 'filter_ecommerce' },
  { key: 'operations', labelKey: 'filter_operations' },
  { key: 'health-beauty', labelKey: 'filter_health_beauty' },
];

// Category accent colors for visual identity
const categoryColors: Record<SolutionCategory, { accent: string; bg: string; border: string }> = {
  delivery: { accent: '#F97316', bg: 'rgba(249, 115, 22, 0.08)', border: 'rgba(249, 115, 22, 0.25)' },
  education: { accent: '#60A5FA', bg: 'rgba(96, 165, 250, 0.08)', border: 'rgba(96, 165, 250, 0.25)' },
  booking: { accent: '#A78BFA', bg: 'rgba(167, 139, 250, 0.08)', border: 'rgba(167, 139, 250, 0.25)' },
  ecommerce: { accent: '#34D399', bg: 'rgba(52, 211, 153, 0.08)', border: 'rgba(52, 211, 153, 0.25)' },
  operations: { accent: '#C08460', bg: 'rgba(192, 132, 96, 0.08)', border: 'rgba(192, 132, 96, 0.25)' },
  'health-beauty': { accent: '#F472B6', bg: 'rgba(244, 114, 182, 0.08)', border: 'rgba(244, 114, 182, 0.25)' },
};

// App count icon based on number
function AppCountIcon({ count }: { count: number }) {
  if (count >= 4) return <Layout className="w-3.5 h-3.5" />;
  if (count >= 2) return <Monitor className="w-3.5 h-3.5" />;
  return <Smartphone className="w-3.5 h-3.5" />;
}

export default function SolutionsPage() {
  const t = useTranslations('solutions');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');

  const filteredSolutions =
    activeFilter === 'all'
      ? solutions
      : solutions.filter((s) => s.category === activeFilter);

  return (
    <div className="min-h-screen bg-navy">
      {/* Breadcrumbs */}
      <Section padding="compact">
        <Container>
          <Breadcrumbs />
        </Container>
      </Section>

      {/* Hero */}
      <Section padding="hero">
        <Container>
          <SectionHeading
            label={t('page.label')}
            title={t('page.title')}
            subtitle={t('page.subtitle')}
          />
        </Container>
      </Section>

      {/* Filter Tabs */}
      <Section padding="compact">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categoryFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeFilter === filter.key
                    ? 'bg-bronze text-white'
                    : 'bg-slate-blue text-muted hover:text-white hover:bg-slate-blue-light'
                }`}
              >
                {t(`page.${filter.labelKey}`)}
              </button>
            ))}
          </div>
        </Container>
      </Section>

      {/* Solutions Grid */}
      <Section>
        <Container>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredSolutions.map((solution, index) => {
                const tKey = solution.slug;
                const colors = categoryColors[solution.category];

                // Demo badge
                let demoBadgeKey: string | null = null;
                if (solution.demoStatus === 'full') demoBadgeKey = 'page.demo_available';
                else if (solution.demoStatus === 'partial') demoBadgeKey = 'page.demo_partial';

                // Apps count
                const appsCountKey = solution.appCount === 1 ? 'page.apps_count_single' : 'page.apps_count';
                const appsCountText = solution.appCount === 1
                  ? t(appsCountKey)
                  : t(appsCountKey, { count: solution.appCount });

                return (
                  <ScrollReveal key={solution.slug} delay={index * 0.05}>
                    <Link
                      href={`/solutions/${solution.slug}`}
                      className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
                    >
                      <div className="relative h-full rounded-2xl overflow-hidden bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] transition-all duration-300 group-hover:border-white/[0.12] group-hover:bg-white/[0.05] group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-black/20 flex flex-col">
                        {/* Category accent line at top */}
                        <div
                          className="absolute top-0 inset-x-0 h-px transition-opacity duration-300 opacity-60 group-hover:opacity-100"
                          style={{
                            background: `linear-gradient(90deg, transparent 0%, ${colors.accent} 50%, transparent 100%)`,
                          }}
                          aria-hidden="true"
                        />

                        {/* Thumbnail area */}
                        <div className="relative w-full aspect-[16/9] overflow-hidden bg-slate-blue/50">
                          {solution.heroImage && (
                            <Image
                              src={solution.heroImage}
                              alt={t(`solutions.${tKey}.name`)}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              placeholder="blur"
                              blurDataURL={HERO_BLUR_URL}
                            />
                          )}

                          {/* Gradient overlay on image bottom for text readability */}
                          <div
                            className="absolute inset-0"
                            style={{
                              background: 'linear-gradient(to top, rgba(10, 22, 40, 0.7) 0%, rgba(10, 22, 40, 0.1) 40%, transparent 60%)',
                            }}
                            aria-hidden="true"
                          />

                          {/* Badges floating on image */}
                          <div className="absolute top-3 inset-x-3 flex flex-wrap items-start gap-1.5">
                            <span
                              className="px-2.5 py-1 rounded-md text-xs font-medium backdrop-blur-md border"
                              style={{
                                background: colors.bg,
                                borderColor: colors.border,
                                color: colors.accent,
                              }}
                            >
                              {t(`page.filter_${solution.category.replace(/-/g, '_')}`)}
                            </span>
                            {demoBadgeKey && (
                              <span className="px-2.5 py-1 rounded-md text-xs font-medium backdrop-blur-md bg-white/[0.08] border border-white/[0.15] text-emerald-400">
                                {t(demoBadgeKey)}
                              </span>
                            )}
                          </div>

                          {/* App count badge bottom-right */}
                          <div className="absolute bottom-3 end-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium backdrop-blur-md bg-black/30 border border-white/[0.1] text-off-white/80">
                              <AppCountIcon count={solution.appCount} />
                              {appsCountText}
                            </span>
                          </div>
                        </div>

                        {/* Content area */}
                        <div className="flex flex-col flex-1 p-5">
                          {/* Title */}
                          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-off-white transition-colors duration-200 line-clamp-2">
                            {t(`solutions.${tKey}.name`)}
                          </h3>

                          {/* Description — clamped to 2 lines */}
                          <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-2 flex-1">
                            {t(`solutions.${tKey}.description`)}
                          </p>

                          {/* Price + Timeline row */}
                          <div className="flex items-center justify-between gap-4 pt-3 border-t border-white/[0.06]">
                            <div className="flex items-center gap-1.5 text-sm">
                              <DollarSign className="h-3.5 w-3.5 flex-shrink-0" style={{ color: colors.accent }} />
                              <span className="font-medium" style={{ color: colors.accent }}>
                                {t(`solutions.${tKey}.starting_price`)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted">
                              <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                              <span>{t(`solutions.${tKey}.timeline`)}</span>
                            </div>
                          </div>

                          {/* CTA row */}
                          <div className="flex items-center justify-between mt-4">
                            <span className="text-sm font-medium text-bronze group-hover:text-bronze-light transition-colors duration-200">
                              {t('page.learn_more')}
                            </span>
                            <span
                              className="w-8 h-8 rounded-full border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-muted group-hover:text-white group-hover:border-bronze/50 group-hover:bg-bronze/10 transition-all duration-300"
                            >
                              <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform duration-200" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </Container>
      </Section>

      {/* CTA */}
      <CTABanner
        heading={t('page.cta_heading')}
        subtitle={t('page.cta_subtitle')}
        primaryCTA={{ label: t('page.cta_estimate'), href: '/get-estimate' }}
        secondaryCTA={{ label: t('page.cta_contact'), href: '/contact' }}
      />
    </div>
  );
}
