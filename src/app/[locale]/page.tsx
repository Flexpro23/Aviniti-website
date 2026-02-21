import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAlternateLinks } from '@/lib/i18n/config';
import {
  HeroSection,
  CompanyLogos,
  TrustIndicators,
  ServicesOverview,
  AIToolsSpotlight,
  SolutionsPreview,
  LiveAppsShowcase,
  WhyChooseUs,
  Testimonials,
  CaseStudiesPreview,
  FinalCTA,
} from '@/components/homepage';
import { SectionDivider } from '@/components/shared/SectionDivider';

/**
 * Homepage - Main landing page
 *
 * Composed of 13 sections:
 * 1. HeroSection - Full-viewport hero with headline, CTAs, and device mockup
 * 2. AIToolsSpotlight - 4 AI tools with color accents
 * 3. CompanyLogos - Infinite scrolling marquee of client logos
 * 4. ServicesOverview - 4 core services grid
 * 5. SolutionsPreview - Ready-made solutions preview
 * 6. Testimonials - Client testimonials carousel
 * 7. TrustIndicators - Counter stats and trust badges
 * 8. LiveAppsShowcase - Grid of live apps in stores
 * 9. WhyChooseUs - 4 differentiator cards
 * 10. CaseStudiesPreview - 2-3 case study highlights
 * 11. FinalCTA - Full-width call-to-action
 *
 * Optional sections (uncomment to enable):
 * - BlogPreview - Latest blog posts
 * - ProcessOverview - How we work (6 steps)
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'home.meta' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: getAlternateLinks(''),
    openGraph: {
      title: t('og_title'),
      description: t('og_description'),
      type: 'website',
      locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('twitter_title'),
      description: t('twitter_description'),
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
      {/* 1. Hero Section */}
      <HeroSection />

      {/* Glow divider — strong visual break after hero */}
      <SectionDivider variant="glow" />

      {/* 2. AI Tools Spotlight */}
      <div id="ai-tools">
        <AIToolsSpotlight />
      </div>

      <SectionDivider variant="line" />

      {/* 3. Company Logos - Immediate credibility */}
      <CompanyLogos />

      <SectionDivider variant="gradient" />

      {/* 4. Services Overview */}
      <ServicesOverview />

      <SectionDivider variant="line" />

      {/* 5. Solutions Preview */}
      <SolutionsPreview />

      <SectionDivider variant="glow" />

      {/* 6. Testimonials - Social proof after showing what we offer */}
      <Testimonials />

      <SectionDivider variant="line" />

      {/* 7. Trust Indicators - Enhanced with count-up animations */}
      <TrustIndicators />

      <SectionDivider variant="gradient" />

      {/* 8. Live Apps Showcase */}
      <LiveAppsShowcase />

      <SectionDivider variant="line" />

      {/* 9. Why Choose Us */}
      <WhyChooseUs />

      <SectionDivider variant="glow" />

      {/* 10. Case Studies Preview */}
      <CaseStudiesPreview />

      {/* Optional: Blog Preview (uncomment to enable) */}
      {/* <BlogPreview /> */}

      {/* Optional: Process Overview (uncomment to enable) */}
      {/* <ProcessOverview /> */}

      <SectionDivider variant="line" />

      {/* 11. Final CTA */}
      <FinalCTA />
    </div>
  );
}
