import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAlternateLinks } from '@/lib/i18n/config';
import {
  HeroSection,
  CompanyLogos,
  TrustIndicators,
  ServicesOverview,
  WhyChooseUs,
  Testimonials,
  FinalCTA,
} from '@/components/homepage';
import { SectionDivider } from '@/components/shared/SectionDivider';

/**
 * Homepage - Main landing page
 *
 * Streamlined to 7 focused sections for clear conversion:
 * 1. HeroSection - Single CTA: "Get Your Free Estimate"
 * 2. TrustIndicators - Immediate credibility (moved up)
 * 3. ServicesOverview - "What We Actually Build" with AI specifics
 * 4. CompanyLogos - Real client logos only
 * 5. Testimonials - 5 real client stories
 * 6. WhyChooseUs - Reframed differentiators
 * 7. FinalCTA - Get Estimate + Book a Call + WhatsApp
 *
 * Removed from homepage (still accessible as separate pages):
 * - AIToolsSpotlight → tools accessible via nav/estimate flow
 * - SolutionsPreview → demoted to /solutions page
 * - CaseStudiesPreview → dedicated /case-studies page
 * - LiveAppsShowcase → merged into testimonials
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'home.meta' });

  const ogTitle = encodeURIComponent(t('og_title'));
  const ogDesc = encodeURIComponent(t('og_description'));

  return {
    title: t('title'),
    description: t('description'),
    alternates: getAlternateLinks(''),
    openGraph: {
      title: t('og_title'),
      description: t('og_description'),
      type: 'website',
      locale,
      images: [
        {
          url: `/api/og?title=${ogTitle}&description=${ogDesc}&type=page&locale=${locale}`,
          width: 1200,
          height: 630,
          alt: t('og_title'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('twitter_title'),
      description: t('twitter_description'),
      images: [`/api/og?title=${ogTitle}&description=${ogDesc}&type=page&locale=${locale}`],
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="min-h-screen bg-navy">
      {/* 1. Hero — Single CTA: Get Your Free Estimate */}
      <HeroSection />

      {/* Glow divider — strong visual break after hero */}
      <SectionDivider variant="glow" />

      {/* 2. Trust Indicators — Immediate credibility right after hero */}
      <TrustIndicators />

      <SectionDivider variant="gradient" />

      {/* 3. What We Build — Services with real AI specifics */}
      <ServicesOverview />

      <SectionDivider variant="line" />

      {/* 4. Client Logos — Real clients only */}
      <CompanyLogos />

      <SectionDivider variant="glow" />

      {/* 5. Real Results — 5 authentic client testimonials */}
      <Testimonials />

      <SectionDivider variant="line" />

      {/* 6. Why Aviniti — Reframed differentiators */}
      <WhyChooseUs />

      <SectionDivider variant="glow" />

      {/* 7. Final CTA — Get Estimate + Book a Call + WhatsApp */}
      <FinalCTA />
    </div>
  );
}
