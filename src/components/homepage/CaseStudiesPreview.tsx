'use client';

/**
 * Case Studies Preview Section
 *
 * Showcases 2-3 case studies with industry badges, headlines, and metrics.
 * Features prominent results and "Read More" CTAs.
 */

import { useTranslations } from 'next-intl';
import { ArrowRight, TrendingUp, ShoppingCart, Activity, Truck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { Link } from '@/lib/i18n/navigation';
import { staggerContainer, fadeInUp } from '@/lib/motion/variants';
import { motion } from 'framer-motion';

interface CaseStudy {
  slug: string;
  industry: string;
  headlineKey: string;
  metricValue: string;
  metricLabel: string;
  excerptKey: string;
  icon: React.ReactNode;
  accentColor: string;
}

export function CaseStudiesPreview() {
  const t = useTranslations('home.case_studies');

  // Placeholder case studies
  const caseStudies: CaseStudy[] = [
    {
      slug: 'ecommerce-retail',
      industry: 'industry_ecommerce',
      headlineKey: 'case_1_headline',
      metricValue: '3x',
      metricLabel: 'metric_1_label',
      excerptKey: 'case_1_excerpt',
      icon: <ShoppingCart className="w-5 h-5" />,
      accentColor: '#4A7A5B', // var(--color-tool-green)
    },
    {
      slug: 'healthcare-ai',
      industry: 'industry_healthcare',
      headlineKey: 'case_2_headline',
      metricValue: '85%',
      metricLabel: 'metric_2_label',
      excerptKey: 'case_2_excerpt',
      icon: <Activity className="w-5 h-5" />,
      accentColor: '#5B7A9A', // var(--color-tool-blue)
    },
    {
      slug: 'logistics-delivery',
      industry: 'industry_logistics',
      headlineKey: 'case_3_headline',
      metricValue: '50%',
      metricLabel: 'metric_3_label',
      excerptKey: 'case_3_excerpt',
      icon: <Truck className="w-5 h-5" />,
      accentColor: '#9A6A3C', // var(--color-tool-orange)
    },
  ];

  return (
    <Section className="bg-navy-dark relative" aria-labelledby="case-studies-heading">
      {/* Subtle diagonal gradient for visual differentiation */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(135deg, rgba(192,132,96,0.02) 0%, transparent 50%, rgba(192,132,96,0.01) 100%)',
        }}
      />
      <Container>
        <ScrollReveal>
          <SectionHeading
            id="case-studies-heading"
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
          {caseStudies.map((study) => (
            <motion.div key={study.slug} variants={fadeInUp}>
              <Card
                hover
                className="h-full flex flex-col relative overflow-hidden"
                style={{ borderTopColor: study.accentColor, borderTopWidth: '3px' }}
              >
                <CardHeader className="space-y-4 flex-1">
                  {/* Industry Badge */}
                  <div>
                    <Badge
                      variant="default"
                      size="sm"
                      style={{ backgroundColor: `${study.accentColor}20`, color: study.accentColor, borderColor: `${study.accentColor}40` }}
                    >
                      {t(study.industry)}
                    </Badge>
                  </div>

                  {/* Headline */}
                  <CardTitle className="text-xl">{t(study.headlineKey)}</CardTitle>

                  {/* Key Metric */}
                  <div className="flex items-center gap-3 py-2">
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-lg"
                      style={{ backgroundColor: `${study.accentColor}15`, color: study.accentColor }}
                    >
                      {study.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-3xl font-bold" style={{ color: study.accentColor }}>
                        {study.metricValue}
                      </span>
                      <span className="text-xs text-muted">{t(study.metricLabel)}</span>
                    </div>
                  </div>

                  {/* Excerpt */}
                  <CardDescription className="leading-relaxed">
                    {t(study.excerptKey)}
                  </CardDescription>
                </CardHeader>

                <CardFooter>
                  <Button asChild variant="ghost" size="sm" className="w-full">
                    <Link href={`/case-studies/${study.slug}`}>
                      {t('read_study')}
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
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
              <Link href="/case-studies">
                {t('view_all')}
                <ArrowRight className="w-5 h-5 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
