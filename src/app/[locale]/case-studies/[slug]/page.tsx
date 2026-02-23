import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Check,
  Quote,
  Target,
  TrendingUp,
  Lightbulb,
} from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/lib/i18n/navigation';
import { Container, Section, Badge } from '@/components/ui';
import { CTABanner } from '@/components/shared/CTABanner';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { getAlternateLinks } from '@/lib/i18n/config';
import { caseStudies, getCaseStudyBySlug } from '@/lib/data/case-studies';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'case_studies' });
  const study = getCaseStudyBySlug(slug);
  const localeKey = locale as 'en' | 'ar';

  if (!study) {
    return { title: t('meta.not_found') };
  }

  const title = study.title[localeKey];
  const description = study.excerpt[localeKey];

  return {
    title: `${title} - ${t('meta.case_study_suffix')}`,
    description: description,
    alternates: getAlternateLinks(`/case-studies/${slug}`),
    openGraph: {
      title: title,
      description: description,
      type: 'article',
    },
  };
}

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'case_studies' });
  const study = getCaseStudyBySlug(slug);
  const localeKey = locale as 'en' | 'ar';

  if (!study) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-navy">
      {/* Breadcrumbs */}
      <Section padding="compact">
        <Container>
          <Breadcrumbs />
        </Container>
      </Section>

      {/* Hero Section — Two-column layout */}
      <Section padding="default">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left: Text */}
              <div>
                {/* Back Link */}
                <Link
                  href="/case-studies"
                  className="inline-flex items-center gap-2 text-muted hover:text-bronze transition-colors mb-8"
                >
                  <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                  {t('page.all_case_studies')}
                </Link>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <Badge
                    variant="default"
                    style={{ backgroundColor: `${study.accentColor}15`, color: study.accentColor }}
                  >
                    {study.industry[localeKey]}
                  </Badge>
                  <Badge variant="outline">{study.duration}</Badge>
                </div>

                {/* Title */}
                <h1 className="text-h2 md:text-[2.5rem] text-white leading-tight mb-4">
                  {study.title[localeKey]}
                </h1>

                {/* Client Name */}
                <p
                  className="text-lg font-semibold mb-4"
                  style={{ color: study.accentColor }}
                >
                  {study.client}
                </p>

                {/* Description */}
                <p className="text-lg text-muted leading-relaxed">
                  {study.heroDescription[localeKey]}
                </p>
              </div>

              {/* Right: Hero Image */}
              <div
                className="relative h-80 md:h-96 rounded-2xl overflow-hidden"
                style={{
                  boxShadow: `0 0 0 1px ${study.accentColor}30, 0 0 40px ${study.accentColor}15`,
                }}
              >
                <Image
                  src={study.heroImage}
                  alt={study.title[localeKey]}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Key Metrics Bar — First 4 metrics */}
      <Section padding="compact" background="navy-dark">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div
              className="rounded-2xl p-8 md:p-12"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderTop: `3px solid ${study.accentColor}`,
              }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {study.results.metrics.slice(0, 4).map((metric, index) => (
                  <div key={index} className="text-center">
                    <div
                      className="text-3xl md:text-4xl font-bold mb-2"
                      style={{ color: study.accentColor }}
                    >
                      {metric.value}
                    </div>
                    <div className="text-sm font-semibold text-white mb-2">
                      {metric.label[localeKey]}
                    </div>
                    <div className="text-xs text-muted leading-relaxed">
                      {metric.description[localeKey]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Challenge Section */}
      <Section padding="default">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8">
              <div
                className="h-14 w-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)' }}
              >
                <Target className="h-7 w-7 text-red-400" />
              </div>
              <h2 className="text-h2 text-white">{t('detail.challenge')}</h2>
            </div>

            <p className="text-lg text-muted mb-8 leading-relaxed">
              {study.challenge.description[localeKey]}
            </p>

            {/* Challenge Points */}
            <div className="space-y-3">
              {study.challenge.points.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderLeft: `3px solid rgba(239, 68, 68, 0.5)`,
                  }}
                >
                  <div
                    className="flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      color: '#ef4444',
                    }}
                  >
                    {index + 1}
                  </div>
                  <span className="text-off-white text-base leading-relaxed">
                    {point[localeKey]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Solution Section */}
      <Section padding="default" background="navy-dark">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8">
              <div
                className="h-14 w-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${study.accentColor}15` }}
              >
                <Lightbulb className="h-7 w-7" style={{ color: study.accentColor }} />
              </div>
              <h2 className="text-h2 text-white">{t('detail.solution')}</h2>
            </div>

            <p className="text-lg text-muted mb-8 leading-relaxed">
              {study.solution.description[localeKey]}
            </p>

            {/* Solution Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {study.solution.points.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-6 rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <Check
                    className="h-5 w-5 flex-shrink-0 mt-1"
                    style={{ color: study.accentColor }}
                  />
                  <span className="text-off-white text-base leading-relaxed">
                    {point[localeKey]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Results Section — All metrics */}
      <Section padding="default">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8">
              <div
                className="h-14 w-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)' }}
              >
                <TrendingUp className="h-7 w-7 text-green-400" />
              </div>
              <h2 className="text-h2 text-white">{t('detail.results')}</h2>
            </div>

            <p className="text-lg text-muted mb-12 leading-relaxed">
              {study.results.description[localeKey]}
            </p>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {study.results.metrics.map((metric, index) => (
                <div
                  key={index}
                  className="p-8 rounded-xl text-center"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div
                    className="text-4xl font-bold mb-3"
                    style={{ color: study.accentColor }}
                  >
                    {metric.value}
                  </div>
                  <div className="text-base font-semibold text-white mb-3">
                    {metric.label[localeKey]}
                  </div>
                  <div className="text-sm text-muted leading-relaxed">
                    {metric.description[localeKey]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Technologies Section */}
      <Section padding="compact" background="navy-dark">
        <Container>
          <div className="max-w-5xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-6">
              {t('detail.technologies')}
            </h3>
            <div className="flex flex-wrap gap-3">
              {study.technologies.map((tech) => (
                <div
                  key={tech}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-off-white"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(8px)',
                    border: `1px solid rgba(255, 255, 255, 0.1)`,
                  }}
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Testimonial Section */}
      {study.testimonial && (
        <Section padding="default">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div
                className="p-12 rounded-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderLeft: `4px solid ${study.accentColor}`,
                }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <Quote
                    className="h-8 w-8 flex-shrink-0"
                    style={{ color: study.accentColor }}
                  />
                </div>

                <blockquote className="text-xl md:text-2xl text-white italic leading-relaxed mb-8">
                  {study.testimonial.quote[localeKey]}
                </blockquote>

                <div>
                  <p
                    className="text-base font-semibold mb-1"
                    style={{ color: study.accentColor }}
                  >
                    {study.testimonial.author}
                  </p>
                  <p className="text-sm text-muted">
                    {study.testimonial.role[localeKey]}
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* CTA Banner */}
      <CTABanner
        heading={t('detail.cta_title')}
        subtitle={t('detail.cta_subtitle')}
        primaryCTA={{ label: t('detail.cta_primary'), href: '/contact' }}
        secondaryCTA={{ label: t('detail.cta_secondary'), href: '/solutions' }}
      />
    </div>
  );
}
