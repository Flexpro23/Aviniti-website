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
    <main className="min-h-screen bg-navy">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. AI Tools Spotlight */}
      <div id="ai-tools">
        <AIToolsSpotlight />
      </div>

      {/* 3. Company Logos - Immediate credibility */}
      <CompanyLogos />

      {/* 4. Services Overview */}
      <ServicesOverview />

      {/* 5. Solutions Preview */}
      <SolutionsPreview />

      {/* 6. Testimonials - Social proof after showing what we offer */}
      <Testimonials />

      {/* 7. Trust Indicators - Enhanced with count-up animations */}
      <TrustIndicators />

      {/* 8. Live Apps Showcase */}
      <LiveAppsShowcase />

      {/* 9. Why Choose Us */}
      <WhyChooseUs />

      {/* 10. Case Studies Preview */}
      <CaseStudiesPreview />

      {/* Optional: Blog Preview (uncomment to enable) */}
      {/* <BlogPreview /> */}

      {/* Optional: Process Overview (uncomment to enable) */}
      {/* <ProcessOverview /> */}

      {/* 11. Final CTA */}
      <FinalCTA />
    </main>
  );
}
