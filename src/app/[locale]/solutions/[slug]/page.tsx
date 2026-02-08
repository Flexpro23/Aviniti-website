import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Check, Clock, DollarSign, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { solutions } from '@/lib/data/solutions';
import { Container, Section, Badge, Card, CardContent } from '@/components/ui';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { CTABanner } from '@/components/shared/CTABanner';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

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
  const t = await getTranslations({ locale, namespace: 'solutions' });
  const tKey = slugToKey[slug];

  if (!tKey) {
    return { title: t('detail.not_found_title') };
  }

  return {
    title: `${t(`solutions.${tKey}.name`)} - Aviniti`,
    description: t(`solutions.${tKey}.description`),
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
    <main className="min-h-screen bg-navy">
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
                <ArrowRight className="h-5 w-5" />
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
                <ArrowRight className="h-4 w-4" />
              </Link>
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
    </main>
  );
}
