import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Container, Section, Button } from '@/components/ui';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { Link } from '@/lib/i18n/navigation';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { getBlogPosts } from '@/lib/firebase/blog';

// ISR: revalidate every hour; on-demand revalidation via /api/revalidate
export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'blog' });

  let posts: Awaited<ReturnType<typeof getBlogPosts>> = [];
  let fetchError = false;
  try {
    posts = await getBlogPosts(locale, 50);
  } catch (err) {
    console.error('[Blog] Failed to fetch posts:', err);
    fetchError = true;
  }

  // Extract unique categories from posts for filter pills
  const categories = [...new Set(posts.map((p) => p.category))].filter(Boolean);

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
          <SectionHeading
            label={t('page.label')}
            title={t('page.title')}
            subtitle={t('page.subtitle')}
          />
        </Container>
      </Section>

      {/* Blog Grid with search + filter */}
      <Section>
        <Container>
          <Suspense fallback={<p className="text-center text-muted py-12">{t('loading')}</p>}>
            <BlogGrid posts={posts} categories={categories} fetchError={fetchError} />
          </Suspense>
        </Container>
      </Section>

      {/* CTA */}
      <Section>
        <Container>
          <ScrollReveal>
            <div
              className="relative overflow-hidden rounded-2xl p-8 md:p-12 text-center"
              style={{
                background: 'rgba(26,35,50,0.6)',
                border: '1px solid rgba(192,132,96,0.2)',
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at 50% 0%, rgba(192,132,96,0.08) 0%, transparent 60%)',
                }}
                aria-hidden="true"
              />
              <div className="relative z-10 max-w-xl mx-auto space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">{t('cta.heading')}</h2>
                <p className="text-muted">{t('cta.subtitle')}</p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link href="/idea-lab">
                    <Button size="lg" variant="primary">{t('cta.idea_lab')}</Button>
                  </Link>
                  <Link href="/get-estimate">
                    <Button size="lg" variant="secondary">{t('cta.estimate')}</Button>
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </Section>
    </div>
  );
}
