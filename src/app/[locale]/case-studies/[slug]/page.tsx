import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, TrendingUp, Users, Zap, Clock, Target, Lightbulb } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { Container, Section, Card, CardContent, Badge } from '@/components/ui';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { CTABanner } from '@/components/shared/CTABanner';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

interface CaseStudyDetail {
  slug: string;
  title: string;
  client: string;
  industry: string;
  duration: string;
  excerpt: string;
  heroDescription: string;
  challenge: {
    title: string;
    description: string;
    points: string[];
  };
  solution: {
    title: string;
    description: string;
    points: string[];
  };
  results: {
    title: string;
    description: string;
    metrics: { label: string; value: string; description: string }[];
  };
  technologies: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}

const caseStudies: CaseStudyDetail[] = [
  {
    slug: 'logistics-delivery-optimization',
    title: 'Streamlining Delivery Operations with a Multi-Vendor Platform',
    client: 'Regional Logistics Company',
    industry: 'Logistics',
    duration: '8 weeks',
    excerpt:
      'How we built a complete delivery management system that reduced delivery times by 40%.',
    heroDescription:
      'A regional logistics company needed to modernize their delivery operations to compete with global players. We built a comprehensive multi-vendor delivery platform from scratch.',
    challenge: {
      title: 'The Challenge',
      description:
        'The client was managing deliveries using phone calls, spreadsheets, and manual dispatching. This led to delays, miscommunication, and inability to scale operations.',
      points: [
        'Manual order processing causing 30+ minute delays',
        'No real-time visibility into driver locations',
        'Customer complaints about lack of tracking',
        'Inability to onboard new restaurant vendors efficiently',
        'Payment reconciliation taking days instead of hours',
      ],
    },
    solution: {
      title: 'Our Solution',
      description:
        'We deployed our Delivery App System with custom modifications tailored to the regional market, including multi-language support and local payment gateway integration.',
      points: [
        'Customer mobile app with real-time order tracking',
        'Driver app with optimized route navigation',
        'Vendor dashboard for menu and order management',
        'Admin panel with analytics and reporting',
        'Integrated payment processing with multiple methods',
        'Push notifications for order status updates',
        'Rating and review system for quality control',
      ],
    },
    results: {
      title: 'The Results',
      description:
        'Within 3 months of launch, the platform transformed the client\'s operations and market position.',
      metrics: [
        { label: 'Faster Deliveries', value: '40%', description: 'Average delivery time reduced from 55 to 33 minutes' },
        { label: 'Order Capacity', value: '300%', description: 'Daily order processing increased from 200 to 800+' },
        { label: 'Active Users', value: '5,000+', description: 'Daily active users across customer and driver apps' },
        { label: 'Vendor Onboarding', value: '3 days', description: 'New vendors go live in 3 days vs 2 weeks previously' },
      ],
    },
    technologies: ['React Native', 'Node.js', 'PostgreSQL', 'Redis', 'Firebase', 'Google Maps API', 'Stripe'],
    testimonial: {
      quote: 'Aviniti transformed our entire delivery operation. What used to take hours of manual work now happens automatically. Our customers love the tracking feature.',
      author: 'Operations Director',
      role: 'Regional Logistics Company',
    },
  },
  {
    slug: 'ecommerce-retail-automation',
    title: 'Digital Transformation for a Regional Hypermarket Chain',
    client: 'Leading Retail Group',
    industry: 'E-Commerce',
    duration: '12 weeks',
    excerpt:
      'End-to-end digital transformation including POS system, inventory management, and customer loyalty program.',
    heroDescription:
      'A leading retail group operating multiple hypermarket locations needed a unified digital platform to streamline operations, reduce waste, and improve customer engagement.',
    challenge: {
      title: 'The Challenge',
      description:
        'Each store location operated independently with disconnected systems, leading to inventory discrepancies, slow checkout processes, and no unified customer data.',
      points: [
        'Disconnected inventory systems across 8 locations',
        'Average checkout time of 5+ minutes per customer',
        'No customer loyalty or retention program',
        'Manual stock counting leading to 15% waste',
        'No centralized reporting for management decisions',
      ],
    },
    solution: {
      title: 'Our Solution',
      description:
        'We implemented our Hypermarket Management System with custom integrations for the client\'s specific supply chain and regional payment methods.',
      points: [
        'Centralized POS system across all locations',
        'Real-time inventory management with automated reordering',
        'Customer loyalty program with digital cards',
        'Supplier portal for streamlined procurement',
        'Executive dashboard with multi-location analytics',
        'Barcode scanning and product management',
        'E-commerce integration for online ordering',
      ],
    },
    results: {
      title: 'The Results',
      description:
        'The digital transformation delivered measurable improvements across every aspect of the business within 6 months.',
      metrics: [
        { label: 'Revenue Increase', value: '25%', description: 'Overall revenue growth driven by loyalty program and efficiency' },
        { label: 'Inventory Accuracy', value: '99.2%', description: 'Up from 85% with automated tracking and alerts' },
        { label: 'Loyalty Members', value: '50K+', description: 'Customers enrolled in the loyalty program in first 6 months' },
        { label: 'Checkout Speed', value: '70%', description: 'Faster checkout processing with new POS system' },
      ],
    },
    technologies: ['Next.js', 'React Native', 'Node.js', 'PostgreSQL', 'Redis', 'ElasticSearch', 'AWS'],
    testimonial: {
      quote: 'The unified system has given us visibility we never had before. We can make data-driven decisions across all locations in real time.',
      author: 'CEO',
      role: 'Leading Retail Group',
    },
  },
  {
    slug: 'education-kindergarten-system',
    title: 'Modernizing Early Childhood Education Management',
    client: 'Network of Kindergartens',
    industry: 'Education',
    duration: '6 weeks',
    excerpt:
      'A comprehensive management platform connecting parents, teachers, and administrators.',
    heroDescription:
      'A growing network of kindergartens needed a unified platform to manage student records, communicate with parents, and streamline administrative operations across all locations.',
    challenge: {
      title: 'The Challenge',
      description:
        'The kindergarten network relied on paper-based records, WhatsApp groups for parent communication, and manual attendance tracking, creating chaos as they expanded.',
      points: [
        'Paper-based student records prone to loss and errors',
        'Unorganized parent communication via personal WhatsApp',
        'Manual attendance tracking taking 30+ minutes daily per class',
        'No visibility into student progress across locations',
        'Fee collection and tracking done manually with spreadsheets',
      ],
    },
    solution: {
      title: 'Our Solution',
      description:
        'We customized our Kindergarten Management System to fit the network\'s specific workflows, including Arabic language support and local cultural considerations.',
      points: [
        'Digital student profiles with enrollment management',
        'Parent mobile app with real-time updates and messaging',
        'Digital attendance with one-tap check-in/checkout',
        'Activity and progress reporting with photo sharing',
        'Automated fee management and payment tracking',
        'Staff scheduling and performance management',
        'Multi-location admin dashboard',
      ],
    },
    results: {
      title: 'The Results',
      description:
        'The platform was rolled out across all locations within 2 months, with immediate positive feedback from parents and staff.',
      metrics: [
        { label: 'Parent Satisfaction', value: '85%', description: 'Parents reporting improved communication and transparency' },
        { label: 'Admin Time Saved', value: '60%', description: 'Reduction in administrative overhead per location' },
        { label: 'Schools Onboarded', value: '12', description: 'All locations successfully migrated to the platform' },
        { label: 'Fee Collection', value: '95%', description: 'On-time fee collection rate up from 70%' },
      ],
    },
    technologies: ['React Native', 'Next.js', 'Node.js', 'MongoDB', 'Firebase', 'AWS S3'],
    testimonial: {
      quote: 'Parents love being able to see what their children are doing throughout the day. It has completely changed how we communicate with families.',
      author: 'Head of Operations',
      role: 'Network of Kindergartens',
    },
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((s) => s.slug === slug);

  if (!study) {
    return { title: 'Case Study Not Found - Aviniti' };
  }

  return {
    title: `${study.title} - Aviniti Case Study`,
    description: study.excerpt,
    openGraph: {
      title: study.title,
      description: study.excerpt,
      type: 'article',
    },
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const study = caseStudies.find((s) => s.slug === slug);

  if (!study) {
    notFound();
  }

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
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-muted hover:text-bronze transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              All Case Studies
            </Link>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="default">{study.industry}</Badge>
              <Badge variant="outline">{study.duration}</Badge>
            </div>

            {/* Title */}
            <h1 className="text-h2 md:text-[2.5rem] text-white leading-tight">
              {study.title}
            </h1>
            <p className="text-sm text-bronze mt-2 font-medium">{study.client}</p>
            <p className="text-lg text-muted mt-4 max-w-3xl">
              {study.heroDescription}
            </p>
          </div>
        </Container>
      </Section>

      {/* Key Metrics */}
      <Section padding="compact" background="navy-dark">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {study.results.metrics.map((metric, index) => (
                <div
                  key={index}
                  className="bg-slate-blue rounded-lg p-4 text-center border border-slate-blue-light"
                >
                  <div className="text-2xl md:text-3xl font-bold text-bronze">
                    {metric.value}
                  </div>
                  <div className="text-sm text-white font-medium mt-1">
                    {metric.label}
                  </div>
                  <div className="text-xs text-muted mt-1">
                    {metric.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Challenge Section */}
      <Section>
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-red-400" />
              </div>
              <h2 className="text-h3 text-white">{study.challenge.title}</h2>
            </div>
            <p className="text-muted mb-6">{study.challenge.description}</p>
            <ul className="space-y-3">
              {study.challenge.points.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-red-500/10 flex items-center justify-center mt-0.5">
                    <span className="text-xs text-red-400 font-bold">{index + 1}</span>
                  </div>
                  <span className="text-off-white">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* Solution Section */}
      <Section background="navy-dark">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-bronze/10 flex items-center justify-center">
                <Lightbulb className="h-5 w-5 text-bronze" />
              </div>
              <h2 className="text-h3 text-white">{study.solution.title}</h2>
            </div>
            <p className="text-muted mb-6">{study.solution.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {study.solution.points.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-slate-blue rounded-lg p-4 border border-slate-blue-light"
                >
                  <Check className="h-5 w-5 text-bronze flex-shrink-0 mt-0.5" />
                  <span className="text-off-white text-sm">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Results Section */}
      <Section>
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <h2 className="text-h3 text-white">{study.results.title}</h2>
            </div>
            <p className="text-muted mb-8">{study.results.description}</p>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {study.results.metrics.map((metric, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-bronze mb-2">
                      {metric.value}
                    </div>
                    <div className="text-white font-semibold">{metric.label}</div>
                    <div className="text-sm text-muted mt-1">
                      {metric.description}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Technologies */}
      <Section padding="compact" background="navy-dark">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-4">
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {study.technologies.map((tech) => (
                <Badge key={tech} variant="outline">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Testimonial */}
      {study.testimonial && (
        <Section>
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <blockquote className="text-xl md:text-2xl text-white italic leading-relaxed">
                &ldquo;{study.testimonial.quote}&rdquo;
              </blockquote>
              <div className="mt-6">
                <p className="text-bronze font-semibold">{study.testimonial.author}</p>
                <p className="text-muted text-sm">{study.testimonial.role}</p>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* CTA Banner */}
      <CTABanner
        heading="Ready to Achieve Similar Results?"
        subtitle="Let us discuss how we can help transform your business with technology."
        primaryCTA={{ label: 'Start Your Project', href: '/contact' }}
        secondaryCTA={{ label: 'View Solutions', href: '/solutions' }}
      />
    </main>
  );
}
