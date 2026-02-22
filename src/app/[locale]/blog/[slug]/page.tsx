import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import Image from 'next/image';
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react';
import { Container, Section } from '@/components/ui';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Link } from '@/lib/i18n/navigation';
import { BlogPostContent } from '@/components/blog/BlogPostContent';
import { ShareButtons } from '@/components/shared/ShareButtons';
import { getBlogPost, getAllBlogSlugs } from '@/lib/firebase/blog';
import { getAlternateLinks } from '@/lib/i18n/config';
import { getBlogPostingSchema } from '@/components/seo/structured-data';

export const revalidate = 3600;
export const dynamicParams = true;

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllBlogSlugs();
    return slugs.flatMap((slug) => [
      { locale: 'en', slug },
      { locale: 'ar', slug },
    ]);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: 'Post Not Found' };

  const localeData = locale === 'ar' ? post.ar : post.en;
  const ogImageUrl = post.featuredImage
    ? post.featuredImage
    : `/api/og?title=${encodeURIComponent(localeData.title)}&description=${encodeURIComponent(localeData.metaDescription ?? localeData.excerpt ?? '')}&type=blog&locale=${locale}`;

  return {
    title: `${localeData.title} | Aviniti Blog`,
    description: localeData.metaDescription ?? undefined,
    alternates: getAlternateLinks(`/blog/${slug}`),
    openGraph: {
      title: localeData.title,
      description: localeData.metaDescription ?? undefined,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: localeData.title }],
      type: 'article',
      publishedTime: post.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: localeData.title,
      description: localeData.metaDescription ?? undefined,
      images: [ogImageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [t, post] = await Promise.all([
    getTranslations({ locale, namespace: 'blog' }),
    getBlogPost(slug),
  ]);

  if (!post) notFound();

  const localeData = locale === 'ar' ? post.ar : post.en;
  const formattedDate = new Date(post.publishedAt).toLocaleDateString(
    locale === 'ar' ? 'ar-JO' : 'en-US',
    { month: 'long', day: 'numeric', year: 'numeric' }
  );

  const blogPostingSchema = getBlogPostingSchema({
    locale,
    slug,
    title: localeData.title,
    description: localeData.metaDescription ?? localeData.excerpt,
    publishedAt: post.publishedAt,
    featuredImage: post.featuredImage ?? undefined,
    tags: post.tags,
    readingTime: post.readingTime,
  });

  return (
    <div className="min-h-screen bg-navy">
      {/* BlogPosting JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />

      {/* Breadcrumbs */}
      <Section padding="compact">
        <Container>
          <Breadcrumbs />
        </Container>
      </Section>

      <Section>
        <Container>
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-white transition-colors duration-200 mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180 transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1" aria-hidden="true" />
            {t('post.back_to_blog')}
          </Link>

          <div className="max-w-3xl mx-auto">
            {/* Category + Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span
                className="px-3 py-1 rounded-lg text-xs font-semibold"
                style={{
                  background: 'rgba(192,132,96,0.12)',
                  color: '#C08460',
                  border: '1px solid rgba(192,132,96,0.25)',
                }}
              >
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {t('post.reading_time', { minutes: post.readingTime })}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              {localeData.title}
            </h1>

            {/* Excerpt */}
            <p className="text-lg text-muted leading-relaxed mb-8">
              {localeData.excerpt}
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 mb-8 pb-8 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <div
                className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ background: 'rgba(192,132,96,0.15)', color: '#C08460' }}
                aria-hidden="true"
              >
                A
              </div>
              <div>
                <p className="text-sm font-medium text-off-white">{t('author')}</p>
                <p className="text-xs text-muted">{t('post.published_on', { date: formattedDate })}</p>
              </div>
            </div>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                <Image
                  src={post.featuredImage}
                  alt={localeData.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
            )}

            {/* Markdown Content */}
            <BlogPostContent content={localeData.content} />

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-10 pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <Tag className="h-4 w-4 text-muted flex-shrink-0" aria-hidden="true" />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full text-muted"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share */}
            <div className="mt-8">
              <ShareButtons
                url={`https://aviniti.app/${locale}/blog/${slug}`}
                title={localeData.title}
              />
            </div>

            {/* Back to blog */}
            <div className="mt-12 pt-8 border-t text-center" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-bronze transition-all duration-200"
                style={{
                  background: 'rgba(192,132,96,0.1)',
                  border: '1px solid rgba(192,132,96,0.25)',
                }}
              >
                <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                {t('post.back_to_blog')}
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
