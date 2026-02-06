import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import {
  HeroSection,
  TrustIndicators,
  ServicesOverview,
  AIToolsSpotlight,
  SolutionsPreview,
  LiveAppsShowcase,
  WhyChooseUs,
  CaseStudiesPreview,
  FinalCTA,
} from '@/components/homepage';

/**
 * Homepage - Main landing page
 *
 * Composed of 11 sections:
 * 1. HeroSection - Full-viewport hero with headline, CTAs, and device mockup
 * 2. TrustIndicators - Counter stats and trust badges
 * 3. ServicesOverview - 4 core services grid
 * 4. AIToolsSpotlight - 4 AI tools with color accents
 * 5. SolutionsPreview - Ready-made solutions preview
 * 6. LiveAppsShowcase - Grid of live apps in stores
 * 7. WhyChooseUs - 4 differentiator cards
 * 8. CaseStudiesPreview - 2-3 case study highlights
 * 9. FinalCTA - Full-width call-to-action
 *
 * Optional sections (uncomment to enable):
 * - BlogPreview - Latest blog posts
 * - ProcessOverview - How we work (6 steps)
 */

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'home.meta' });

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('og_title'),
      description: t('og_description'),
      type: 'website',
      locale: params.locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('twitter_title'),
      description: t('twitter_description'),
    },
  };
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-navy">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Trust Indicators */}
      <TrustIndicators />

      {/* 3. Services Overview */}
      <ServicesOverview />

      {/* 4. AI Tools Spotlight */}
      <AIToolsSpotlight />

      {/* 5. Solutions Preview */}
      <SolutionsPreview />

      {/* 6. Live Apps Showcase */}
      <LiveAppsShowcase />

      {/* 7. Why Choose Us */}
      <WhyChooseUs />

      {/* 8. Case Studies Preview */}
      <CaseStudiesPreview />

      {/* Optional: Blog Preview (uncomment to enable) */}
      {/* <BlogPreview /> */}

      {/* Optional: Process Overview (uncomment to enable) */}
      {/* <ProcessOverview /> */}

      {/* 9. Final CTA */}
      <FinalCTA />
    </main>
  );
}
