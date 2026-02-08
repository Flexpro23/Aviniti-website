'use client';

/**
 * Blog Preview Section
 *
 * Optional section showing 3 latest blog posts.
 * Features post cards with title, date, reading time, and excerpt.
 */

import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { Link } from '@/lib/i18n/navigation';
import { staggerContainer, fadeInUp } from '@/lib/motion/variants';
import { motion } from 'framer-motion';

interface BlogPost {
  slug: string;
  titleKey: string;
  date: string;
  readingTime: number;
  excerptKey: string;
}

export function BlogPreview() {
  const t = useTranslations('home.blog');
  const locale = useLocale();

  // Placeholder blog posts
  const posts: BlogPost[] = [
    {
      slug: 'ai-in-mobile-apps',
      titleKey: 'post_1_title',
      date: '2026-02-01',
      readingTime: 5,
      excerptKey: 'post_1_excerpt',
    },
    {
      slug: 'app-development-trends',
      titleKey: 'post_2_title',
      date: '2026-01-28',
      readingTime: 7,
      excerptKey: 'post_2_excerpt',
    },
    {
      slug: 'choosing-tech-stack',
      titleKey: 'post_3_title',
      date: '2026-01-25',
      readingTime: 6,
      excerptKey: 'post_3_excerpt',
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'ar' ? 'ar-JO' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Section className="bg-navy">
      <Container>
        <ScrollReveal>
          <SectionHeading
            title={t('title')}
            subtitle={t('subtitle')}
            align="center"
            className="mb-16"
          />
        </ScrollReveal>

        <motion.div
          variants={staggerContainer(0.1, 0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {posts.map((post) => (
            <motion.div key={post.slug} variants={fadeInUp}>
              <Card hover className="h-full flex flex-col">
                <CardHeader className="space-y-4 flex-1">
                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-muted">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.readingTime} {t('min_read')}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <CardTitle className="text-xl line-clamp-2">{t(post.titleKey)}</CardTitle>

                  {/* Excerpt */}
                  <CardDescription className="leading-relaxed line-clamp-3">
                    {t(post.excerptKey)}
                  </CardDescription>
                </CardHeader>

                <CardFooter>
                  <Button asChild variant="ghost" size="sm" className="w-full">
                    <Link href={`/blog/${post.slug}`}>
                      {t('read_more')}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <ScrollReveal delay={0.3}>
          <div className="text-center">
            <Button asChild variant="secondary" size="lg">
              <Link href="/blog">
                {t('view_all')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
