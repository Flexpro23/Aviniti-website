'use client';

import { useState, useMemo } from 'react';
import { Calendar, Clock, ArrowRight, User, Search, X } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { Container, Section, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Button } from '@/components/ui';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ContentLanguageNotice } from '@/components/shared/ContentLanguageNotice';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: number;
  featured?: boolean;
}

const blogPosts: BlogPost[] = [
  {
    slug: 'ai-transforming-mobile-app-development',
    title: 'How AI is Transforming Mobile App Development in 2025',
    excerpt:
      'Discover how artificial intelligence is revolutionizing the way we build, test, and deploy mobile applications. From code generation to automated testing.',
    category: 'AI',
    author: 'Aviniti Team',
    date: '2025-03-15',
    readTime: 8,
    featured: true,
  },
  {
    slug: 'choosing-right-tech-stack-startup',
    title: 'Choosing the Right Tech Stack for Your Startup',
    excerpt:
      'A comprehensive guide to selecting the best technologies for your startup project. React Native vs Flutter, Node.js vs Python, and more.',
    category: 'Tutorials',
    author: 'Aviniti Team',
    date: '2025-03-01',
    readTime: 12,
  },
  {
    slug: 'building-scalable-delivery-apps',
    title: 'Building Scalable Delivery Apps: Lessons from the Field',
    excerpt:
      'Key insights from building delivery platforms that handle thousands of orders daily. Architecture patterns, real-time tracking, and performance optimization.',
    category: 'Mobile',
    author: 'Aviniti Team',
    date: '2025-02-18',
    readTime: 10,
  },
  {
    slug: 'web-app-performance-optimization',
    title: 'Web App Performance Optimization: A Complete Guide',
    excerpt:
      'Learn proven techniques to make your web applications faster. From lazy loading to server-side rendering, code splitting, and caching strategies.',
    category: 'Web',
    author: 'Aviniti Team',
    date: '2025-02-05',
    readTime: 15,
  },
  {
    slug: 'future-of-ai-powered-business-tools',
    title: 'The Future of AI-Powered Business Tools',
    excerpt:
      'How AI-powered tools are changing the business landscape. From chatbots to predictive analytics, explore what is next for enterprise AI.',
    category: 'AI',
    author: 'Aviniti Team',
    date: '2025-01-20',
    readTime: 7,
  },
];

const categoryKeys = ['all', 'ai', 'mobile', 'web', 'tutorials'] as const;

export default function BlogPage() {
  const t = useTranslations('blog');
  const locale = useLocale();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter posts by category and search query
  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    let posts = blogPosts;

    // Filter by category
    if (activeCategory !== 'all') {
      posts = posts.filter((post) => post.category.toLowerCase() === activeCategory);
    }

    // Filter by search query
    if (query) {
      posts = posts.filter((post) =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query)
      );
    }

    return posts;
  }, [activeCategory, searchQuery]);

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

      {/* Search Input */}
      <Section padding="compact">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
              <input
                id="blog-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('page.search_placeholder')}
                className="w-full bg-slate-blue border border-slate-blue-light rounded-xl ps-12 pe-12 py-3 text-off-white placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/50 focus-visible:border-bronze transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute end-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                  aria-label={t('page.aria_clear_search')}
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Category Filter */}
      <Section padding="compact">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categoryKeys.map((catKey) => (
              <button
                key={catKey}
                onClick={() => setActiveCategory(catKey)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeCategory === catKey
                    ? 'bg-bronze text-white'
                    : 'bg-slate-blue text-muted hover:text-white hover:bg-slate-blue-light'
                }`}
              >
                {t(`page.categories.${catKey}`)}
              </button>
            ))}
          </div>
        </Container>
      </Section>

      {/* Blog Posts Grid */}
      <Section>
        <Container>
          <ContentLanguageNotice namespace="blog" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <ScrollReveal key={post.slug}>
                <Card hover className="h-full flex flex-col">
                  {/* Placeholder image area */}
                  <div className="h-48 bg-slate-blue-light rounded-t-lg flex items-center justify-center border-b border-slate-blue-light">
                    <span className="text-muted text-sm">{t('post.featured_image')}</span>
                  </div>

                  <CardHeader className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default" size="sm">
                        {t(`page.categories.${post.category.toLowerCase()}`)}
                      </Badge>
                      {post.featured && (
                        <Badge variant="outline" size="sm">
                          {t('post.featured')}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-white leading-snug">
                      {post.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <CardDescription className="line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between border-t border-slate-blue-light pt-4 mt-4">
                    <div className="flex items-center gap-3 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.date).toLocaleDateString(locale === 'ar' ? 'ar-JO' : 'en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {t('post.reading_time', { minutes: post.readTime })}
                      </span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-bronze text-sm font-medium hover:text-bronze-light transition-colors flex items-center gap-1"
                    >
                      {t('post.read')}
                      <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                    </Link>
                  </CardFooter>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted text-lg">
                {searchQuery ? t('page.search_no_results') : t('empty.title')}
              </p>
            </div>
          )}
        </Container>
      </Section>

      {/* CTA Section */}
      <Section>
        <Container>
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-blue via-slate-blue to-slate-blue-light p-8 md:p-12 border border-bronze/20">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(205,147,89,0.15),transparent_50%)]" />
              </div>

              {/* Content */}
              <div className="relative z-10 text-center max-w-2xl mx-auto space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  {t('cta.heading')}
                </h2>
                <p className="text-lg text-muted">
                  {t('cta.subtitle')}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <Link href="/idea-lab">
                    <Button size="lg" variant="primary">
                      {t('cta.idea_lab')}
                    </Button>
                  </Link>
                  <Link href="/get-estimate">
                    <Button size="lg" variant="secondary">
                      {t('cta.estimate')}
                    </Button>
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
