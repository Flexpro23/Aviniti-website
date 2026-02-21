import { Metadata } from 'next';
import { getAlternateLinks } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/lib/i18n/navigation';
import { Container, Section, Badge } from '@/components/ui';
import { ShareButtons } from '@/components/shared/ShareButtons';
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
  content: string;
}

const blogPosts: BlogPost[] = [
  {
    slug: 'ai-transforming-mobile-app-development',
    title: 'How AI is Transforming Mobile App Development in 2025',
    excerpt:
      'Discover how artificial intelligence is revolutionizing the way we build, test, and deploy mobile applications.',
    category: 'AI',
    author: 'Aviniti Team',
    date: '2025-03-15',
    readTime: 8,
    content: `
Artificial intelligence is no longer a futuristic concept in mobile app development -- it is here and reshaping every stage of the development lifecycle.

## AI-Powered Code Generation

Modern AI tools can now generate boilerplate code, suggest completions, and even write entire functions based on natural language descriptions. This dramatically accelerates development timelines while maintaining code quality.

## Automated Testing and QA

AI-driven testing frameworks can automatically generate test cases, identify edge cases that human testers might miss, and continuously monitor app performance in production. This results in more robust applications with fewer bugs reaching end users.

## Intelligent User Experiences

From personalized content recommendations to natural language interfaces, AI enables apps to understand and adapt to individual user behaviors. Chatbots, voice assistants, and predictive features are becoming standard expectations.

## What This Means for Businesses

For businesses looking to build mobile apps, AI integration is no longer optional -- it is a competitive necessity. Companies that leverage AI in their apps see higher user engagement, better retention rates, and increased revenue.

At Aviniti, we integrate AI capabilities into every solution we build, from our ready-made platforms to custom development projects. Our team stays at the forefront of AI advancements to ensure our clients benefit from the latest innovations.

## Looking Ahead

The pace of AI advancement shows no signs of slowing. We expect to see even more sophisticated AI features becoming accessible to businesses of all sizes, from small startups to large enterprises.

Want to explore how AI can enhance your mobile app? Contact our team for a free consultation.
    `,
  },
  {
    slug: 'choosing-right-tech-stack-startup',
    title: 'Choosing the Right Tech Stack for Your Startup',
    excerpt:
      'A comprehensive guide to selecting the best technologies for your startup project.',
    category: 'Tutorials',
    author: 'Aviniti Team',
    date: '2025-03-01',
    readTime: 12,
    content: `
Choosing the right technology stack is one of the most critical decisions for any startup. The wrong choice can lead to scalability issues, increased costs, and delayed launches.

## Mobile: React Native vs Flutter

Both React Native and Flutter are excellent cross-platform frameworks. React Native leverages JavaScript and has a massive ecosystem, while Flutter uses Dart and offers superior performance for complex animations. Your choice should depend on your team's expertise and specific app requirements.

## Backend: Node.js vs Python

Node.js excels at handling real-time applications and high-concurrency scenarios. Python, with frameworks like Django and FastAPI, is ideal for data-heavy applications and AI/ML integration. Many modern apps use both.

## Database Choices

PostgreSQL remains the gold standard for relational data, while MongoDB offers flexibility for document-based storage. Firebase provides an excellent real-time database for mobile apps with built-in authentication and hosting.

## Cloud Infrastructure

AWS offers the most comprehensive service catalog, while Google Cloud Platform excels in AI/ML services. For startups seeking simplicity, platforms like Vercel and Railway provide excellent developer experiences.

## Our Recommendation

There is no one-size-fits-all answer. The best tech stack depends on your specific requirements, team expertise, budget, and timeline. At Aviniti, we evaluate each project individually and recommend the optimal technology combination.

Ready to discuss your project's tech stack? Use our AI Estimate tool for personalized recommendations.
    `,
  },
  {
    slug: 'building-scalable-delivery-apps',
    title: 'Building Scalable Delivery Apps: Lessons from the Field',
    excerpt:
      'Key insights from building delivery platforms that handle thousands of orders daily.',
    category: 'Mobile',
    author: 'Aviniti Team',
    date: '2025-02-18',
    readTime: 10,
    content: `
Building a delivery app that can scale from hundreds to thousands of orders per day requires careful architectural planning and the right technology choices.

## Real-Time Tracking Architecture

The backbone of any delivery app is its real-time tracking system. We use WebSocket connections combined with GPS polling to provide smooth, accurate location updates. The key is balancing update frequency with battery consumption.

## Order Management at Scale

Efficient order management requires a well-designed state machine that handles the complete order lifecycle. From placement to delivery confirmation, each state transition must be reliable and auditable.

## Driver Matching Algorithms

Smart driver assignment can make or break a delivery platform. We implement proximity-based matching with load balancing to ensure fair distribution and minimize delivery times.

## Payment Processing

Integrating reliable payment gateways with support for multiple payment methods is essential for the Middle East market. We support credit cards, cash on delivery, and digital wallets.

## Performance Optimization

Lazy loading, image optimization, and efficient caching strategies ensure the app remains responsive even under heavy load. We regularly load test our applications to identify and address bottlenecks.

## Key Takeaways

Building a scalable delivery app requires expertise across mobile development, backend architecture, and DevOps. Our ready-made Delivery App System incorporates all these lessons learned and can be customized for your specific market.
    `,
  },
  {
    slug: 'web-app-performance-optimization',
    title: 'Web App Performance Optimization: A Complete Guide',
    excerpt:
      'Learn proven techniques to make your web applications faster.',
    category: 'Web',
    author: 'Aviniti Team',
    date: '2025-02-05',
    readTime: 15,
    content: `
Performance is a critical factor in user experience and SEO. Here are the key techniques we use to ensure our web applications are lightning fast.

## Server-Side Rendering (SSR)

Using Next.js with server-side rendering ensures fast initial page loads and excellent SEO. We leverage incremental static regeneration for content that changes periodically.

## Code Splitting and Lazy Loading

Breaking your application into smaller chunks and loading them on demand dramatically reduces initial bundle size. Route-based code splitting is the easiest win.

## Image Optimization

Using modern formats like WebP and AVIF, combined with responsive images and lazy loading, can reduce page weight by 50% or more. Next.js Image component handles this automatically.

## Caching Strategies

Implementing proper caching at multiple levels -- browser cache, CDN cache, and application cache -- ensures returning users experience near-instant load times.

## Core Web Vitals

Google's Core Web Vitals (LCP, FID, CLS) directly impact search rankings. We optimize for all three metrics to ensure our applications rank well and provide excellent user experiences.

## Monitoring and Continuous Improvement

Performance optimization is not a one-time task. We implement monitoring with tools like Lighthouse CI and real user monitoring to track and improve performance over time.

These optimization techniques are built into every project we deliver at Aviniti.
    `,
  },
  {
    slug: 'future-of-ai-powered-business-tools',
    title: 'The Future of AI-Powered Business Tools',
    excerpt:
      'How AI-powered tools are changing the business landscape.',
    category: 'AI',
    author: 'Aviniti Team',
    date: '2025-01-20',
    readTime: 7,
    content: `
AI-powered business tools are rapidly evolving from novelties to necessities. Here is what we see shaping the future of enterprise AI.

## Conversational AI

Advanced chatbots and virtual assistants are handling increasingly complex customer interactions. From support tickets to sales consultations, AI agents are becoming indispensable team members.

## Predictive Analytics

AI-powered analytics tools can now predict customer behavior, market trends, and operational issues before they occur. This proactive approach to business management is a game-changer.

## Automated Content Generation

From marketing copy to technical documentation, AI tools are streamlining content creation processes. The key is using AI as an assistant rather than a replacement for human creativity.

## Custom AI Solutions

Off-the-shelf AI tools are giving way to custom solutions trained on specific business data. These tailored models deliver significantly better results for specialized use cases.

## Integration and Interoperability

The future belongs to AI tools that seamlessly integrate with existing business systems. APIs and middleware that connect AI capabilities to legacy systems are becoming crucial.

## Our AI Tools

At Aviniti, we have built AI-powered tools directly into our service offering. Our Get AI Estimate tool uses machine learning to provide accurate project estimates, while our AI App Builder helps visualize and plan applications before development begins.

The future of business is AI-powered, and we are here to help you navigate that transition.
    `,
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'blog' });
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return { title: t('meta.not_found') };
  }

  return {
    title: `${post.title} - ${t('meta.blog_suffix')}`,
    description: post.excerpt,
    alternates: getAlternateLinks(`/blog/${slug}`),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'blog' });
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Simple markdown-like rendering: headings and paragraphs
  const renderContent = (content: string) => {
    const lines = content.trim().split('\n');
    const elements: React.ReactNode[] = [];
    let currentParagraph: string[] = [];

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const text = currentParagraph.join(' ').trim();
        if (text) {
          elements.push(
            <p key={`p-${elements.length}`} className="text-off-white leading-relaxed mb-4">
              {text}
            </p>
          );
        }
        currentParagraph = [];
      }
    };

    lines.forEach((line) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('## ')) {
        flushParagraph();
        elements.push(
          <h2 key={`h-${elements.length}`} className="text-xl font-semibold text-white mt-8 mb-4">
            {trimmed.replace('## ', '')}
          </h2>
        );
      } else if (trimmed === '') {
        flushParagraph();
      } else {
        currentParagraph.push(trimmed);
      }
    });

    flushParagraph();
    return elements;
  };

  return (
    <div className="min-h-screen bg-navy">
      {/* Breadcrumbs */}
      <Section padding="compact">
        <Container>
          <Breadcrumbs />
        </Container>
      </Section>

      {/* Article Header */}
      <Section padding="hero">
        <Container>
          <div className="max-w-3xl mx-auto">
            {/* Back Link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-muted hover:text-bronze transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              {t('post.back_to_blog')}
            </Link>

            {/* Category Badge */}
            <Badge variant="default" className="mb-4">
              {t(`page.categories.${post.category.toLowerCase()}`)}
            </Badge>

            {/* Title */}
            <h1 className="text-h2 md:text-[2.5rem] text-white mt-4 leading-tight">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(post.date).toLocaleDateString(locale === 'ar' ? 'ar-JO' : 'en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {t('post.reading_time', { minutes: post.readTime })}
              </span>
            </div>

            {/* Share Buttons */}
            <div className="mt-6 pt-6 border-t border-slate-blue-light">
              <ShareButtons
                url={`https://aviniti.app/${locale}/blog/${post.slug}`}
                title={post.title}
                description={post.excerpt}
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* Article Body */}
      <Section>
        <Container>
          <div className="max-w-3xl mx-auto">
            <ContentLanguageNotice namespace="blog" />
          </div>
          <article className="max-w-3xl mx-auto prose-custom">
            {renderContent(post.content)}
          </article>
        </Container>
      </Section>

      {/* Bottom Share & Navigation */}
      <Section padding="compact" background="navy-dark">
        <Container>
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-slate-blue-light">
            <ShareButtons
              url={`https://aviniti.app/${locale}/blog/${post.slug}`}
              title={post.title}
              description={post.excerpt}
            />
            <Link
              href="/blog"
              className="text-bronze hover:text-bronze-light transition-colors font-medium flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              {t('post.all_articles')}
            </Link>
          </div>
        </Container>
      </Section>
    </div>
  );
}
