import { Metadata } from 'next';
import { getAlternateLinks } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
  Check,
  Clock,
  DollarSign,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Truck,
  GraduationCap,
  ShoppingCart,
  Building2,
  Dumbbell,
  Home,
  Brain,
} from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { solutions } from '@/lib/data/solutions';
import { Container, Section, Badge, Card, CardContent } from '@/components/ui';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { CTABanner } from '@/components/shared/CTABanner';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

// Icon mapping for solution icons
const iconMap = {
  Truck,
  GraduationCap,
  ShoppingCart,
  Building2,
  Dumbbell,
  Home,
  Brain,
};

/** Slug-to-translation-key mapping (slugs match JSON keys directly) */
const slugToKey: Record<string, string> = {
  'delivery-app-system': 'delivery-app-system',
  'kindergarten-management': 'kindergarten-management',
  'hypermarket-management': 'hypermarket-management',
  'office-management': 'office-management',
  'gym-management': 'gym-management',
  'airbnb-marketplace': 'airbnb-marketplace',
  'hair-transplant-ai': 'hair-transplant-ai',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'solutions' });
  const tKey = slugToKey[slug];

  if (!tKey) {
    return { title: t('detail.not_found_title') };
  }

  return {
    title: `${t(`solutions.${tKey}.name`)} - Aviniti`,
    description: t(`solutions.${tKey}.description`),
    alternates: getAlternateLinks(`/solutions/${slug}`),
    openGraph: {
      title: `${t(`solutions.${tKey}.name`)} | Aviniti`,
      description: t(`solutions.${tKey}.description`),
      type: 'website',
      locale,
    },
  };
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const solution = solutions.find((s) => s.slug === slug);

  if (!solution) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'solutions' });
  const tKey = slugToKey[solution.slug] || solution.slug;

  // Build feature list from translations
  const features: string[] = [];
  for (let i = 1; i <= 8; i++) {
    try {
      const feature = t(`solutions.${tKey}.features.feature_${i}`);
      if (feature) features.push(feature);
    } catch {
      break;
    }
  }

  // Build included items list
  const includedItems: string[] = [];
  for (let i = 1; i <= 6; i++) {
    try {
      const item = t(`detail.included_items.item_${i}`);
      if (item) includedItems.push(item);
    } catch {
      break;
    }
  }

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
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="default" className="mb-4">
              {t(`solutions.${tKey}.tagline`)}
            </Badge>
            <h1 className="text-h2 md:text-[2.5rem] text-white mt-4">
              {t(`solutions.${tKey}.name`)}
            </h1>
            <p className="text-lg text-muted mt-4 max-w-2xl mx-auto">
              {t(`solutions.${tKey}.description`)}
            </p>

            {/* Price & Timeline Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 bg-slate-blue rounded-lg px-4 py-2 border border-slate-blue-light">
                <DollarSign className="h-5 w-5 text-bronze" />
                <span className="text-white font-semibold">
                  {t('detail.starting_at')} {t(`solutions.${tKey}.starting_price`)}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-slate-blue rounded-lg px-4 py-2 border border-slate-blue-light">
                <Clock className="h-5 w-5 text-bronze" />
                <span className="text-white font-semibold">
                  {t(`solutions.${tKey}.timeline`)} {t('detail.delivery')}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 h-13 px-7 py-3 text-lg font-semibold rounded-lg bg-bronze text-white hover:bg-bronze-hover transition-colors duration-200"
              >
                {t('detail.cta_primary')}
                <ArrowRight className="h-5 w-5 rtl:rotate-180" />
              </Link>
              {solution.hasDemo && (
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 h-13 px-7 py-3 text-lg font-semibold rounded-lg bg-transparent text-bronze border border-bronze hover:bg-bronze/10 transition-colors duration-200"
                >
                  {t('detail.cta_demo')}
                  <ExternalLink className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Key Features */}
      <Section background="navy-dark">
        <Container>
          <SectionHeading
            label={t('detail.features')}
            title={t('detail.key_features')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardContent className="flex items-start gap-3 pt-6">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-bronze/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-bronze" />
                  </div>
                  <span className="text-off-white text-sm">{feature}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Implementation Timeline */}
      <Section>
        <Container>
          <div className="max-w-4xl mx-auto">
            <SectionHeading
              label={t('detail.timeline')}
              title={t('detail.timeline_title')}
            />

            <div className="mt-12 relative">
              {/* Timeline line */}
              <div className="absolute top-6 start-0 end-0 h-0.5 bg-slate-blue-light hidden md:block" />

              {/* Timeline steps */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4 relative">
                {[
                  { week: 1, key: 'timeline_week1' },
                  { week: 2, key: 'timeline_week2' },
                  { week: 3, key: 'timeline_week3' },
                  { week: 4, key: 'timeline_week4' },
                  { week: 5, key: 'timeline_week5' },
                ].map((step, index) => {
                  // For 60-day solutions (Gym), show all 5 steps
                  // For 35-day solutions, show first 4 steps
                  const shouldShow = solution.timelineDays === 60 || index < 4;
                  if (!shouldShow) return null;

                  return (
                    <div key={step.week} className="flex flex-col items-center text-center">
                      {/* Step dot */}
                      <div className="relative z-10 w-12 h-12 rounded-full bg-bronze/20 border-2 border-bronze flex items-center justify-center mb-3">
                        <CheckCircle2 className="h-6 w-6 text-bronze" />
                      </div>
                      {/* Week label */}
                      <div className="text-xs text-muted uppercase tracking-wider mb-2">
                        {solution.timelineDays === 60
                          ? t('detail.timeline_weeks_range', { start: step.week * 2 - 1, end: step.week * 2 })
                          : t('detail.timeline_week', { week: step.week })}
                      </div>
                      {/* Step description */}
                      <p className="text-sm text-off-white leading-tight">
                        {t(`detail.${step.key}`)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* What's Included */}
      <Section>
        <Container>
          <div className="max-w-3xl mx-auto">
            <SectionHeading
              label={t('detail.package')}
              title={t('detail.whats_included')}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
              {includedItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-slate-blue rounded-lg p-4 border border-slate-blue-light"
                >
                  <Check className="h-5 w-5 text-bronze flex-shrink-0" />
                  <span className="text-off-white">{item}</span>
                </div>
              ))}
            </div>

            {/* Customization Note */}
            <div className="mt-8 bg-bronze/5 border border-bronze/20 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-white">
                {t('detail.customization')}
              </h3>
              <p className="text-muted mt-2">
                {t('detail.customization_desc')}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 mt-4 text-bronze hover:text-bronze-light transition-colors duration-200 font-medium"
              >
                {t('detail.cta_secondary')}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* Related Solutions */}
      <Section background="navy-dark">
        <Container>
          <div className="max-w-5xl mx-auto">
            <SectionHeading title={t('detail.related_title')} align="center" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {solutions
                .filter((s) => s.slug !== solution.slug)
                .sort((a, b) =>
                  Math.abs(a.startingPrice - solution.startingPrice) -
                  Math.abs(b.startingPrice - solution.startingPrice)
                )
                .slice(0, 3)
                .map((relatedSolution) => {
                  const Icon = iconMap[relatedSolution.icon as keyof typeof iconMap];
                  const relatedTKey = slugToKey[relatedSolution.slug] || relatedSolution.slug;

                  return (
                    <Link
                      key={relatedSolution.slug}
                      href={`/solutions/${relatedSolution.slug}`}
                      className="group"
                    >
                      <Card hover className="h-full transition-all duration-200 hover:border-bronze/40">
                        <CardContent className="pt-6">
                          {/* Icon */}
                          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-bronze/10 text-bronze mb-4">
                            {Icon && <Icon className="h-6 w-6" />}
                          </div>

                          {/* Name */}
                          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-bronze transition-colors">
                            {t(`solutions.${relatedTKey}.name`)}
                          </h3>

                          {/* Price & Timeline */}
                          <div className="flex items-center gap-4 text-sm text-muted mb-3">
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              <span>{t(`solutions.${relatedTKey}.starting_price`)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{t(`solutions.${relatedTKey}.timeline`)}</span>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-muted line-clamp-2">
                            {t(`solutions.${relatedTKey}.description`)}
                          </p>

                          {/* Learn More */}
                          <div className="flex items-center gap-2 mt-4 text-bronze text-sm font-medium group-hover:gap-3 transition-all">
                            <span>{t('page.learn_more')}</span>
                            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA Banner */}
      <CTABanner
        heading={t('detail.cta_heading')}
        subtitle={t('detail.cta_subtitle')}
        primaryCTA={{ label: t('detail.cta_primary'), href: '/contact' }}
        secondaryCTA={{ label: t('detail.view_all'), href: '/solutions' }}
      />
    </div>
  );
}
