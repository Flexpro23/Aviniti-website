import { Metadata } from 'next';
import Image from 'next/image';
import { getAlternateLinks } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
  Check,
  Clock,
  DollarSign,
  ArrowRight,
  ExternalLink,
  Truck,
  GraduationCap,
  ShoppingCart,
  Building2,
  Dumbbell,
  Home,
  Brain,
  Scissors,
  LayoutDashboard,
  Store,
  ClipboardList,
  Heart,
  Monitor,
  CreditCard,
  Package,
  UserCheck,
  Wrench,
  ShoppingBag,
  Activity,
  Smartphone,
  Users,
} from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { solutions } from '@/lib/data/solutions';
import { Container, Section, Badge, Card, CardContent } from '@/components/ui';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { CTABanner } from '@/components/shared/CTABanner';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

// Icon mapping for solution icons (all icons used by all solutions)
const iconMap: Record<string, any> = {
  Truck,
  GraduationCap,
  ShoppingCart,
  Building2,
  Dumbbell,
  Home,
  Brain,
  Scissors,
  LayoutDashboard,
  Store,
  ClipboardList,
  Heart,
  Monitor,
  CreditCard,
  Package,
  UserCheck,
  Wrench,
  ShoppingBag,
  Activity,
  Smartphone,
  Users,
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
  'barbershop-management': 'barbershop-management',
};

/** Category colors matching solutions page design */
const categoryColors: Record<string, { accent: string; bg: string; border: string }> = {
  delivery: { accent: '#F97316', bg: 'rgba(249, 115, 22, 0.08)', border: 'rgba(249, 115, 22, 0.25)' },
  education: { accent: '#60A5FA', bg: 'rgba(96, 165, 250, 0.08)', border: 'rgba(96, 165, 250, 0.25)' },
  booking: { accent: '#A78BFA', bg: 'rgba(167, 139, 250, 0.08)', border: 'rgba(167, 139, 250, 0.25)' },
  ecommerce: { accent: '#34D399', bg: 'rgba(52, 211, 153, 0.08)', border: 'rgba(52, 211, 153, 0.25)' },
  operations: { accent: '#C08460', bg: 'rgba(192, 132, 96, 0.08)', border: 'rgba(192, 132, 96, 0.25)' },
  'health-beauty': { accent: '#F472B6', bg: 'rgba(244, 114, 182, 0.08)', border: 'rgba(244, 114, 182, 0.25)' },
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
  const colors = categoryColors[solution.category];

  // Build included items list (0-indexed arrays in translations)
  const includedItems: string[] = [];
  for (let i = 0; i < solution.includedCount; i++) {
    try {
      const item = t(`solutions.${tKey}.whats_included.${i}`);
      if (item) includedItems.push(item);
    } catch {
      break;
    }
  }

  // Build customization items list (0-indexed arrays in translations)
  const customizationItems: string[] = [];
  for (let i = 0; i < solution.customizationCount; i++) {
    try {
      const item = t(`solutions.${tKey}.customization.${i}`);
      if (item) customizationItems.push(item);
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

      {/* 1. Hero Section (condensed, two-column on desktop) */}
      <Section padding="hero">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Text Content */}
            <div className="order-2 lg:order-1">
              {/* Category Badge */}
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border text-sm font-medium backdrop-blur-sm"
                style={{
                  backgroundColor: colors.bg,
                  borderColor: colors.border,
                  color: colors.accent,
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: colors.accent }}
                />
                {t(`page.filter_${solution.category.replace(/-/g, '_')}`)}
              </div>

              {/* Tagline */}
              <p
                className="text-base font-semibold mb-3"
                style={{ color: colors.accent }}
              >
                {t(`solutions.${tKey}.tagline`)}
              </p>

              {/* Title */}
              <h1 className="text-h2 lg:text-[2.75rem] text-white font-bold mb-6 leading-tight">
                {t(`solutions.${tKey}.name`)}
              </h1>

              {/* Description */}
              <p className="text-lg text-muted mb-8">
                {t(`solutions.${tKey}.description`)}
              </p>

              {/* Price & Timeline Badges (inline, frosted glass) */}
              <div className="flex flex-wrap gap-3 mb-8">
                <div
                  className="flex items-center gap-2 rounded-lg px-4 py-2 border backdrop-blur-sm"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    borderColor: 'rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <DollarSign className="h-4 w-4 flex-shrink-0" style={{ color: colors.accent }} />
                  <span className="text-sm font-semibold text-white">
                    {t(`solutions.${tKey}.starting_price`)}
                  </span>
                </div>
                <div
                  className="flex items-center gap-2 rounded-lg px-4 py-2 border backdrop-blur-sm"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    borderColor: 'rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <Clock className="h-4 w-4 flex-shrink-0" style={{ color: colors.accent }} />
                  <span className="text-sm font-semibold text-white">
                    {t(`solutions.${tKey}.timeline`)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 py-3 text-lg font-semibold rounded-lg text-white transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    backgroundColor: colors.accent,
                  }}
                >
                  {t('detail.cta_primary')}
                  <ArrowRight className="h-5 w-5 rtl:rotate-180" />
                </Link>
                {solution.demoStatus !== 'none' && (
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 h-12 px-6 py-3 text-lg font-semibold rounded-lg border transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      borderColor: colors.accent,
                      color: colors.accent,
                    }}
                  >
                    {t('detail.cta_demo')}
                    <ExternalLink className="h-5 w-5" />
                  </Link>
                )}
              </div>
            </div>

            {/* Right Column: Hero Image (prominent, frosted glass frame) */}
            {solution.heroImage && (
              <div className="order-1 lg:order-2">
                <div
                  className="relative w-full aspect-video overflow-hidden rounded-2xl border backdrop-blur-sm"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    borderColor: colors.border,
                    boxShadow: `0 0 30px ${colors.accent}20`,
                  }}
                >
                  <Image
                    src={solution.heroImage}
                    alt={t(`solutions.${tKey}.name`)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 600px"
                    priority
                  />
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* 2. System Components (Apps Breakdown) - upgraded with frosted glass */}
      <Section background="navy-dark">
        <Container>
          <SectionHeading
            label={t('detail.apps_title')}
            title={t('detail.apps_title')}
            subtitle={t('detail.apps_subtitle')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {solution.apps.map((app, appIndex) => {
              const Icon = iconMap[app.icon as keyof typeof iconMap];

              // Build app features (0-indexed arrays in translations)
              const appFeatures: string[] = [];
              for (let i = 0; i < app.featureCount; i++) {
                try {
                  const feature = t(`solutions.${tKey}.apps.${appIndex}.features.${i}`);
                  if (feature) appFeatures.push(feature);
                } catch {
                  break;
                }
              }

              return (
                <div
                  key={app.id}
                  className="relative rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.12] p-6"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    borderColor: 'rgba(255, 255, 255, 0.06)',
                  }}
                >
                  {/* Category accent line */}
                  <div
                    className="absolute inset-x-0 top-0 h-1 rounded-t-2xl"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)`,
                    }}
                  />

                  {/* Icon & Title */}
                  <div className="flex items-start justify-between mb-4 mt-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {t(`solutions.${tKey}.apps.${appIndex}.name`)}
                      </h3>
                      <p
                        className="text-xs font-semibold uppercase tracking-wider mt-1"
                        style={{ color: colors.accent }}
                      >
                        {t(`solutions.${tKey}.apps.${appIndex}.roles`)}
                      </p>
                    </div>
                    {Icon && (
                      <div
                        className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: `${colors.accent}20`,
                        }}
                      >
                        <Icon className="h-6 w-6" style={{ color: colors.accent }} />
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted mb-4">
                    {t(`solutions.${tKey}.apps.${appIndex}.description`)}
                  </p>

                  {/* Features */}
                  {appFeatures.length > 0 && (
                    <div className="space-y-2">
                      {appFeatures.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: colors.accent }} />
                          <span className="text-xs text-off-white">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* 3. What Sets This Apart - with numbered circles */}
      <Section>
        <Container>
          <div className="max-w-3xl mx-auto">
            <SectionHeading
              label={t('detail.differentiation_title')}
              title={t('detail.differentiation_title')}
              align="center"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
              {Array.from({ length: solution.differentiationCount }).map((_, i) => {
                try {
                  const diffText = t(`solutions.${tKey}.differentiation.${i}`);
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-4 rounded-2xl border backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.12]"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        borderColor: 'rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      {/* Numbered Circle */}
                      <div
                        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                        style={{
                          backgroundColor: colors.accent,
                        }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <span className="text-off-white text-sm mt-0.5">{diffText}</span>
                    </div>
                  );
                } catch {
                  return null;
                }
              })}
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. Pricing & Package (MERGED: pricing + what's included + customization) */}
      <Section background="navy-dark">
        <Container>
          <div className="max-w-4xl mx-auto">
            <SectionHeading
              title={t('detail.pricing_title')}
              align="center"
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
              {/* Base Package Card */}
              <div
                className="relative rounded-2xl border backdrop-blur-sm p-8 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.12]"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  borderColor: 'rgba(255, 255, 255, 0.06)',
                }}
              >
                {/* Category accent line */}
                <div
                  className="absolute inset-x-0 top-0 h-1 rounded-t-2xl"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)`,
                  }}
                />

                <h3 className="text-xl font-semibold text-white mb-6 mt-3">
                  {t('detail.base_package')}
                </h3>

                {/* Price */}
                <div className="mb-8">
                  <div className="text-4xl font-bold text-white">
                    {t(`solutions.${tKey}.starting_price`)}
                  </div>
                  <p className="text-sm text-muted mt-2">
                    {t('detail.without_customization')}
                  </p>
                </div>

                {/* Timeline */}
                <div
                  className="flex items-center gap-2 text-sm text-off-white mb-8 pb-8"
                  style={{ borderBottomColor: 'rgba(255, 255, 255, 0.06)', borderBottomWidth: '1px' }}
                >
                  <Clock className="h-4 w-4 flex-shrink-0" style={{ color: colors.accent }} />
                  <span>{t(`solutions.${tKey}.timeline`)}</span>
                </div>

                {/* What's Included */}
                <div className="mb-8">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
                    {t('detail.whats_included')}
                  </p>
                  <div className="space-y-3">
                    {includedItems.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: colors.accent }} />
                        <span className="text-sm text-off-white">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  href="/contact"
                  className="w-full block text-center py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    backgroundColor: colors.accent,
                  }}
                >
                  {t('detail.cta_primary')}
                </Link>
              </div>

              {/* Custom Package Card */}
              <div
                className="relative rounded-2xl border backdrop-blur-sm p-8 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.12]"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  borderColor: colors.border,
                }}
              >
                {/* Category accent line */}
                <div
                  className="absolute inset-x-0 top-0 h-1 rounded-t-2xl"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)`,
                  }}
                />

                <h3 className="text-xl font-semibold text-white mb-6 mt-3">
                  {t('detail.custom_package')}
                </h3>

                {/* Custom Timeline Label */}
                <div className="mb-8">
                  <div className="text-lg font-semibold text-white">
                    {t(`solutions.${tKey}.timeline_custom`)}
                  </div>
                  <p className="text-sm text-muted mt-2">
                    {t('detail.with_customization')}
                  </p>
                </div>

                {/* Customization Description */}
                <div
                  className="flex items-center gap-2 text-sm text-off-white mb-8 pb-8"
                  style={{ borderBottomColor: 'rgba(255, 255, 255, 0.06)', borderBottomWidth: '1px' }}
                >
                  <p className="text-xs text-muted">
                    {t('detail.customization_desc')}
                  </p>
                </div>

                {/* Customization Options */}
                <div className="mb-8">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
                    {t('detail.customization_title')}
                  </p>
                  <div className="space-y-3">
                    {customizationItems.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
                          style={{
                            backgroundColor: colors.accent,
                          }}
                        />
                        <span className="text-sm text-off-white">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  href="/contact"
                  className="w-full block text-center py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    backgroundColor: colors.accent,
                  }}
                >
                  {t('detail.cta_secondary')}
                </Link>
              </div>
            </div>

            {/* Price Note */}
            {t.has(`solutions.${tKey}.price_note`) && (
              <p className="text-center text-muted text-sm mt-8">
                {t(`solutions.${tKey}.price_note`)}
              </p>
            )}
          </div>
        </Container>
      </Section>

      {/* 5. Related Solutions - with thumbnails */}
      <Section>
        <Container>
          <div className="max-w-5xl mx-auto">
            <SectionHeading title={t('detail.related_title')} align="center" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {solutions
                .filter((s) => s.slug !== solution.slug)
                .sort((a, b) => {
                  // Parse price from string (e.g., "$15,000" or "$20,000 - $50,000")
                  const getFirstPrice = (str: string) => {
                    const match = str.replace('$', '').split('-')[0].trim();
                    return parseInt(match.replace(/,/g, '')) || 0;
                  };
                  const aPrice = getFirstPrice(t(`solutions.${slugToKey[a.slug] || a.slug}.starting_price`));
                  const bPrice = getFirstPrice(t(`solutions.${slugToKey[b.slug] || b.slug}.starting_price`));
                  const currentPrice = getFirstPrice(t(`solutions.${tKey}.starting_price`));
                  return (
                    Math.abs(aPrice - currentPrice) -
                    Math.abs(bPrice - currentPrice)
                  );
                })
                .slice(0, 3)
                .map((relatedSolution) => {
                  const Icon = iconMap[relatedSolution.icon as keyof typeof iconMap];
                  const relatedTKey = slugToKey[relatedSolution.slug] || relatedSolution.slug;
                  const relatedColors = categoryColors[relatedSolution.category];

                  return (
                    <Link
                      key={relatedSolution.slug}
                      href={`/solutions/${relatedSolution.slug}`}
                      className="group flex flex-col h-full rounded-2xl overflow-hidden border backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.12]"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        borderColor: 'rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      {/* Hero Thumbnail */}
                      {relatedSolution.heroImage && (
                        <div className="relative w-full aspect-video overflow-hidden bg-slate-blue/20">
                          <Image
                            src={relatedSolution.heroImage}
                            alt={t(`solutions.${relatedTKey}.name`)}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 350px"
                          />
                          {/* Category Badge Overlay */}
                          <div
                            className="absolute top-3 inset-inline-start-3 flex items-center gap-1.5 rounded-md px-2.5 py-1 border backdrop-blur-md"
                            style={{
                              backgroundColor: relatedColors.bg,
                              borderColor: relatedColors.border,
                              color: relatedColors.accent,
                            }}
                          >
                            <span className="text-xs font-medium">
                              {t(`page.filter_${relatedSolution.category.replace(/-/g, '_')}`)}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 flex flex-col p-6">
                        {/* Icon */}
                        <div
                          className="flex items-center justify-center w-10 h-10 rounded-lg mb-4"
                          style={{
                            backgroundColor: `${relatedColors.accent}20`,
                          }}
                        >
                          {Icon && <Icon className="h-5 w-5" style={{ color: relatedColors.accent }} />}
                        </div>

                        {/* Name */}
                        <h3 className="text-lg font-semibold text-white mb-3 group-hover:transition-colors">
                          {t(`solutions.${relatedTKey}.name`)}
                        </h3>

                        {/* Price & Timeline */}
                        <div className="flex items-center gap-4 text-xs text-muted mb-4">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            <span>{t(`solutions.${relatedTKey}.starting_price`)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{t(`solutions.${relatedTKey}.timeline`)}</span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted line-clamp-2 mb-4 flex-1">
                          {t(`solutions.${relatedTKey}.description`)}
                        </p>

                        {/* Learn More Link */}
                        <div
                          className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all"
                          style={{ color: relatedColors.accent }}
                        >
                          <span>{t('page.learn_more')}</span>
                          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        </Container>
      </Section>

      {/* 6. CTA Banner */}
      <CTABanner
        heading={t('detail.cta_heading')}
        subtitle={t('detail.cta_subtitle')}
        primaryCTA={{ label: t('detail.cta_primary'), href: '/contact' }}
        secondaryCTA={{ label: t('detail.view_all'), href: '/solutions' }}
      />
    </div>
  );
}
