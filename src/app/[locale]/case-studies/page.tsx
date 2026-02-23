'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { Container, Section, Badge } from '@/components/ui';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { CTABanner } from '@/components/shared/CTABanner';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { caseStudies } from '@/lib/data/case-studies';
import { HERO_BLUR_URL } from '@/lib/utils/image';

export default function CaseStudiesPage() {
  const t = useTranslations('case_studies');
  const locale = useLocale() as 'en' | 'ar';

  return (
    <div className="min-h-screen bg-navy">
      {/* Breadcrumbs */}
      <Section padding="compact">
        <Container>
          <Breadcrumbs />
        </Container>
      </Section>

      {/* Compact Inline Heading */}
      <Section padding="compact">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-bronze uppercase tracking-wide">
                {t('page.label')}
              </span>
            </div>
            <h1 className="text-h1 text-white">
              {t('page.heading')}
            </h1>
            <p className="text-lg text-muted max-w-2xl">
              {t('page.description')}
            </p>
          </motion.div>
        </Container>
      </Section>

      {/* Case Studies - Full-Width Horizontal Cards */}
      <Section>
        <Container>
          <div className="space-y-8">
            {caseStudies.map((study, index) => (
              <ScrollReveal key={study.slug} delay={index * 0.1}>
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  viewport={{ once: true, margin: '-100px' }}
                  className="group rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {/* Gradient Line at Top */}
                  <div
                    className="h-1 w-full"
                    style={{
                      background: `linear-gradient(90deg, ${study.accentColor} 0%, ${study.accentColor}80 50%, ${study.accentColor}00 100%)`,
                    }}
                  />

                  {/* Horizontal Layout: Image (40%) + Content (60%) */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 p-6 sm:p-8">
                    {/* Left: Hero Image */}
                    <div className="lg:col-span-2 flex items-center justify-center">
                      <div
                        className="relative w-full aspect-video rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105"
                        style={{
                          boxShadow: `0 0 0 1px ${study.accentColor}40, 0 0 24px ${study.accentColor}20`,
                        }}
                      >
                        <Image
                          src={study.heroImage}
                          alt={study.title[locale]}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 40vw"
                          priority={false}
                          placeholder="blur"
                          blurDataURL={HERO_BLUR_URL}
                        />
                      </div>
                    </div>

                    {/* Right: Content */}
                    <div className="lg:col-span-3 flex flex-col justify-between space-y-6">
                      {/* Industry Badge + Title + Client */}
                      <div className="space-y-3">
                        <Badge
                          size="sm"
                          style={{
                            backgroundColor: `${study.accentColor}15`,
                            color: study.accentColor,
                            borderColor: `${study.accentColor}30`,
                          }}
                          className="border"
                        >
                          {study.industry[locale]}
                        </Badge>

                        <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
                          {study.title[locale]}
                        </h2>

                        <p style={{ color: study.accentColor }} className="font-medium text-sm">
                          {study.client}
                        </p>
                      </div>

                      {/* Excerpt - Truncated to 2 Lines */}
                      <p className="text-muted line-clamp-2">
                        {study.excerpt[locale]}
                      </p>

                      {/* 3 Listing Metrics in a Row */}
                      <div className="flex flex-col sm:flex-row gap-6 py-4">
                        {study.listingMetrics.map((metric, metricIndex) => (
                          <div key={metricIndex} className="flex flex-col items-start">
                            <div
                              className="text-2xl sm:text-3xl font-bold"
                              style={{ color: study.accentColor }}
                            >
                              {metric.value}
                            </div>
                            <div className="text-xs text-muted mt-1">
                              {metric.label[locale]}
                            </div>
                            {/* Subtle divider (not on last item) */}
                            {metricIndex < study.listingMetrics.length - 1 && (
                              <div
                                className="hidden sm:block absolute h-12 w-px ml-12 mt-1"
                                style={{
                                  backgroundColor: 'rgba(255,255,255,0.1)',
                                }}
                              />
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Technology Tags */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {study.tags.map((tag, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            {tag[locale]}
                          </Badge>
                        ))}
                      </div>

                      {/* Read Case Study Link */}
                      <Link
                        href={`/case-studies/${study.slug}`}
                        className="inline-flex items-center gap-2 text-bronze font-medium hover:text-bronze-light transition-colors duration-200 pt-2"
                      >
                        {t('card.read_case_study')}
                        <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              </ScrollReveal>
            ))}
          </div>

          {caseStudies.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted text-lg">
                {t('empty.title')}
              </p>
            </div>
          )}
        </Container>
      </Section>

      {/* CTA Banner */}
      <CTABanner
        heading={t('list_cta.heading')}
        subtitle={t('list_cta.subtitle')}
        primaryCTA={{ label: t('list_cta.primary'), href: '/contact' }}
        secondaryCTA={{ label: t('list_cta.secondary'), href: '/solutions' }}
      />
    </div>
  );
}
