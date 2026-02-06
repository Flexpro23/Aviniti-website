'use client';

import { useState } from 'react';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { Container, Section, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Button } from '@/components/ui';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
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
    readTime: '8 min read',
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
    readTime: '12 min read',
  },
  {
    slug: 'building-scalable-delivery-apps',
    title: 'Building Scalable Delivery Apps: Lessons from the Field',
    excerpt:
      'Key insights from building delivery platforms that handle thousands of orders daily. Architecture patterns, real-time tracking, and performance optimization.',
    category: 'Mobile',
    author: 'Aviniti Team',
    date: '2025-02-18',
    readTime: '10 min read',
  },
  {
    slug: 'web-app-performance-optimization',
    title: 'Web App Performance Optimization: A Complete Guide',
    excerpt:
      'Learn proven techniques to make your web applications faster. From lazy loading to server-side rendering, code splitting, and caching strategies.',
    category: 'Web',
    author: 'Aviniti Team',
    date: '2025-02-05',
    readTime: '15 min read',
  },
  {
    slug: 'future-of-ai-powered-business-tools',
    title: 'The Future of AI-Powered Business Tools',
    excerpt:
      'How AI-powered tools are changing the business landscape. From chatbots to predictive analytics, explore what is next for enterprise AI.',
    category: 'AI',
    author: 'Aviniti Team',
    date: '2025-01-20',
    readTime: '7 min read',
  },
];

const categories = ['All', 'AI', 'Mobile', 'Web', 'Tutorials'];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredPosts =
    activeCategory === 'All'
      ? blogPosts
      : blogPosts.filter((post) => post.category === activeCategory);

  return (
    <main className="min-h-screen bg-navy">
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
            label="Blog"
            title="Insights & Articles"
            subtitle="Expert perspectives on AI, mobile development, web technologies, and digital transformation."
          />
        </Container>
      </Section>

      {/* Category Filter */}
      <Section padding="compact">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-bronze text-white'
                    : 'bg-slate-blue text-muted hover:text-white hover:bg-slate-blue-light'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Container>
      </Section>

      {/* Blog Posts Grid */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <ScrollReveal key={post.slug}>
                <Card hover className="h-full flex flex-col">
                  {/* Placeholder image area */}
                  <div className="h-48 bg-slate-blue-light rounded-t-lg flex items-center justify-center border-b border-slate-blue-light">
                    <span className="text-muted text-sm">Featured Image</span>
                  </div>

                  <CardHeader className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default" size="sm">
                        {post.category}
                      </Badge>
                      {post.featured && (
                        <Badge variant="outline" size="sm">
                          Featured
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
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-bronze text-sm font-medium hover:text-bronze-light transition-colors flex items-center gap-1"
                    >
                      Read
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </CardFooter>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted text-lg">
                No articles found in this category. Check back soon!
              </p>
            </div>
          )}
        </Container>
      </Section>
    </main>
  );
}
