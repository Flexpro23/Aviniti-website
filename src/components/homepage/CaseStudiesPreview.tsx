/**
 * Case Studies Preview Section
 *
 * Showcases 2-3 case studies with industry badges, headlines, and metrics.
 * Features prominent results and "Read More" CTAs.
 */

import { useTranslations } from 'next-intl';
import { ArrowRight, TrendingUp } from 'lucide-react';
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
}

export function CaseStudiesPreview() {
  const t = useTranslations('home.case_studies');

  // Placeholder case studies
  const caseStudies: CaseStudy[] = [
    {
      slug: 'ecommerce-retail',
      industry: 'E-Commerce',
      headlineKey: 'case_1_headline',
      metricValue: '3x',
      metricLabel: 'Sales Growth',
      excerptKey: 'case_1_excerpt',
    },
    {
      slug: 'healthcare-ai',
      industry: 'Healthcare',
      headlineKey: 'case_2_headline',
      metricValue: '85%',
      metricLabel: 'Time Saved',
      excerptKey: 'case_2_excerpt',
    },
    {
      slug: 'logistics-delivery',
      industry: 'Logistics',
      headlineKey: 'case_3_headline',
      metricValue: '50%',
      metricLabel: 'Cost Reduction',
      excerptKey: 'case_3_excerpt',
    },
  ];

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
          {caseStudies.map((study) => (
            <motion.div key={study.slug} variants={fadeInUp}>
              <Card hover className="h-full flex flex-col">
                <CardHeader className="space-y-4 flex-1">
                  {/* Industry Badge */}
                  <div>
                    <Badge variant="default" size="sm">
                      {study.industry}
                    </Badge>
                  </div>

                  {/* Headline */}
                  <CardTitle className="text-xl">{t(study.headlineKey)}</CardTitle>

                  {/* Key Metric */}
                  <div className="flex items-center gap-3 py-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-bronze" />
                      <span className="text-3xl font-bold text-bronze">{study.metricValue}</span>
                    </div>
                    <span className="text-sm text-muted">{study.metricLabel}</span>
                  </div>

                  {/* Excerpt */}
                  <CardDescription className="leading-relaxed">
                    {t(study.excerptKey)}
                  </CardDescription>
                </CardHeader>

                <CardFooter>
                  <Button asChild variant="ghost" size="sm" className="w-full">
                    <Link href={`/case-studies/${study.slug}`}>
                      Read Case Study
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
              <Link href="/case-studies">
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
