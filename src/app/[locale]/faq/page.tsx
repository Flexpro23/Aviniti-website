import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { faqCategories } from '@/lib/data/faq';
import { Container, Section } from '@/components/ui';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { CTABanner } from '@/components/shared/CTABanner';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { FAQAccordionSection } from './FAQAccordionSection';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'faq' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
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
    <main className="min-h-screen bg-navy">
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
            label="FAQ"
            title={t('page.title')}
            subtitle={t('page.subtitle')}
          />
        </Container>
      </Section>

      {/* FAQ Accordion Sections (client component for interactivity) */}
      <FAQAccordionSection />

      {/* CTA */}
      <CTABanner
        heading="Still Have Questions?"
        subtitle="Our team is here to help. Reach out and we will get back to you within 24 hours."
        primaryCTA={{ label: 'Contact Us', href: '/contact' }}
        secondaryCTA={{ label: 'Get AI Estimate', href: '/get-estimate' }}
      />
    </main>
  );
}
