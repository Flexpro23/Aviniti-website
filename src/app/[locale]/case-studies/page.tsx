'use client';

import { useState } from 'react';
import { ArrowRight, TrendingUp, Users, Zap } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { Container, Section, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge } from '@/components/ui';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { CTABanner } from '@/components/shared/CTABanner';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  industry: string;
  excerpt: string;
  metrics: { label: string; value: string; icon: 'trending' | 'users' | 'zap' }[];
  tags: string[];
}

const caseStudies: CaseStudy[] = [
  {
    slug: 'logistics-delivery-optimization',
    title: 'Streamlining Delivery Operations with a Multi-Vendor Platform',
    client: 'Regional Logistics Company',
    industry: 'Logistics',
    excerpt:
      'How we built a complete delivery management system that reduced delivery times by 40% and increased order capacity by 300%.',
    metrics: [
      { label: 'Faster Deliveries', value: '40%', icon: 'zap' },
      { label: 'Order Capacity Increase', value: '300%', icon: 'trending' },
      { label: 'Active Daily Users', value: '5,000+', icon: 'users' },
    ],
    tags: ['Mobile App', 'Real-Time Tracking', 'Payment Integration'],
  },
  {
    slug: 'ecommerce-retail-automation',
    title: 'Digital Transformation for a Regional Hypermarket Chain',
    client: 'Leading Retail Group',
    industry: 'E-Commerce',
    excerpt:
      'End-to-end digital transformation including POS system, inventory management, and customer loyalty program, resulting in 25% revenue increase.',
    metrics: [
      { label: 'Revenue Increase', value: '25%', icon: 'trending' },
      { label: 'Inventory Accuracy', value: '99.2%', icon: 'zap' },
      { label: 'Loyalty Members', value: '50K+', icon: 'users' },
    ],
    tags: ['E-Commerce', 'POS System', 'Analytics Dashboard'],
  },
  {
    slug: 'education-kindergarten-system',
    title: 'Modernizing Early Childhood Education Management',
    client: 'Network of Kindergartens',
    industry: 'Education',
    excerpt:
      'A comprehensive management platform connecting parents, teachers, and administrators, improving parent satisfaction by 85%.',
    metrics: [
      { label: 'Parent Satisfaction', value: '85%', icon: 'users' },
      { label: 'Admin Time Saved', value: '60%', icon: 'zap' },
      { label: 'Schools Onboarded', value: '12', icon: 'trending' },
    ],
    tags: ['Education', 'Parent Portal', 'Staff Management'],
  },
];

const industries = ['All', 'Logistics', 'E-Commerce', 'Education'];

const MetricIcon = ({ icon }: { icon: 'trending' | 'users' | 'zap' }) => {
  switch (icon) {
    case 'trending':
      return <TrendingUp className="h-5 w-5 text-bronze" />;
    case 'users':
      return <Users className="h-5 w-5 text-bronze" />;
    case 'zap':
      return <Zap className="h-5 w-5 text-bronze" />;
  }
};

export default function CaseStudiesPage() {
  const [activeIndustry, setActiveIndustry] = useState('All');

  const filteredStudies =
    activeIndustry === 'All'
      ? caseStudies
      : caseStudies.filter((s) => s.industry === activeIndustry);

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
            label="Case Studies"
            title="Real Results for Real Businesses"
            subtitle="See how we have helped companies across industries achieve their digital transformation goals."
          />
        </Container>
      </Section>

      {/* Industry Filter */}
      <Section padding="compact">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {industries.map((industry) => (
              <button
                key={industry}
                onClick={() => setActiveIndustry(industry)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeIndustry === industry
                    ? 'bg-bronze text-white'
                    : 'bg-slate-blue text-muted hover:text-white hover:bg-slate-blue-light'
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
        </Container>
      </Section>

      {/* Case Studies Grid */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredStudies.map((study) => (
              <ScrollReveal key={study.slug}>
                <Card hover className="h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="default" size="sm">
                        {study.industry}
                      </Badge>
                    </div>
                    <CardTitle className="text-white text-xl">
                      {study.title}
                    </CardTitle>
                    <p className="text-sm text-bronze mt-1">{study.client}</p>
                  </CardHeader>

                  <CardContent className="flex-1 pt-2">
                    <CardDescription className="mb-6">
                      {study.excerpt}
                    </CardDescription>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-3">
                      {study.metrics.map((metric, index) => (
                        <div
                          key={index}
                          className="bg-navy rounded-lg p-3 text-center border border-slate-blue-light"
                        >
                          <div className="flex justify-center mb-2">
                            <MetricIcon icon={metric.icon} />
                          </div>
                          <div className="text-lg font-bold text-white">
                            {metric.value}
                          </div>
                          <div className="text-xs text-muted mt-1">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {study.tags.map((tag) => (
                        <Badge key={tag} variant="outline" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="border-t border-slate-blue-light mt-4">
                    <Link
                      href={`/case-studies/${study.slug}`}
                      className="text-bronze font-medium hover:text-bronze-light transition-colors flex items-center gap-2"
                    >
                      Read Full Case Study
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </CardFooter>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          {filteredStudies.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted text-lg">
                No case studies found for this industry. Check back soon!
              </p>
            </div>
          )}
        </Container>
      </Section>

      {/* CTA */}
      <CTABanner
        heading="Ready to Write Your Success Story?"
        subtitle="Let us help you achieve similar results. Get started with a free consultation."
        primaryCTA={{ label: 'Get Free Consultation', href: '/contact' }}
        secondaryCTA={{ label: 'View Solutions', href: '/solutions' }}
      />
    </main>
  );
}
