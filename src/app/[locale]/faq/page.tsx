import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAlternateLinks } from '@/lib/i18n/config';
import { faqCategories } from '@/lib/data/faq';
import { Container, Section } from '@/components/ui';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { CTABanner } from '@/components/shared/CTABanner';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { FAQAccordionSection } from './FAQAccordionSection';

export const revalidate = 86400; // Revalidate daily

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'faq' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: getAlternateLinks('/faq'),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      locale,
    },
  };
}

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'faq' });

  // Build FAQ data with resolved translations for JSON-LD
  const resolvedFAQs: { category: string; question: string; answer: string }[] = [];

  for (const category of faqCategories) {
    const categoryName = t(`categories.${category.slug}`);
    for (const q of category.questions) {
      try {
        // Extract the translation keys -- they follow pattern: faq.<category>.<qN>.question
        // We need to parse: "faq.pricing.q1.question" -> "pricing.q1.question"
        const questionKeyParts = q.questionKey.replace('faq.', '');
        const answerKeyParts = q.answerKey.replace('faq.', '');
        resolvedFAQs.push({
          category: categoryName,
          question: t(questionKeyParts),
          answer: t(answerKeyParts),
        });
      } catch {
        // Skip if translation is missing
      }
    }
  }

  // FAQ Schema.org JSON-LD
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: resolvedFAQs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-navy">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

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

      {/* FAQ Accordion Sections (client component for interactivity) */}
      <FAQAccordionSection />

      {/* CTA */}
      <CTABanner
        heading={t('cta.heading')}
        subtitle={t('cta.subtitle')}
        primaryCTA={{ label: t('cta.primary_label'), href: '/contact' }}
        secondaryCTA={{ label: t('cta.secondary_label'), href: '/get-estimate' }}
      />
    </div>
  );
}
