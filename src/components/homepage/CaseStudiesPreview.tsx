'use client';

/**
 * Case Studies Preview Section
 *
 * Showcases 2 real case studies with industry badges, headlines, and metrics.
 * Features prominent results and "Read More" CTAs.
 */

import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight, Truck, GraduationCap, Sparkles, Stethoscope, Scissors, CalendarDays } from 'lucide-react';
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
import { caseStudies } from '@/lib/data/case-studies';

interface CaseStudy {
  slug: string;
  industry: string;
  title: string;
  metricValue: string;
  metricLabel: string;
  excerpt: string;
  icon: React.ReactNode;
  accentColor: string;
}

export function CaseStudiesPreview() {
  const t = useTranslations('home.case_studies');
  const locale = useLocale() as 'en' | 'ar';

  // Map real case studies to display format
  const previewCaseStudies: CaseStudy[] = caseStudies.slice(0, 3).map((study) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      logistics: <Truck className="w-5 h-5" />,
      education: <GraduationCap className="w-5 h-5" />,
      beauty: <Sparkles className="w-5 h-5" />,
      medical: <Stethoscope className="w-5 h-5" />,
      barbershop: <Scissors className="w-5 h-5" />,
      business: <CalendarDays className="w-5 h-5" />,
    };

    const industryKeyMap: { [key: string]: string } = {
      Logistics: 'industry_logistics',
      Education: 'industry_education',
      'Health & Beauty': 'industry_beauty',
      Medical: 'industry_medical',
      'Business Operations': 'industry_business',
    };

    const industryValue = study.industry[locale];
    const titleValue = study.title[locale];
    const excerptValue = study.excerpt[locale];
    const metricLabelValue = study.listingMetrics[0]?.label[locale] ?? '';

    return {
      slug: study.slug,
      industry: industryKeyMap[industryValue] || 'industry_logistics',
      title: titleValue,
      metricValue: study.listingMetrics[0]?.value || '—',
      metricLabel: metricLabelValue,
      excerpt: excerptValue,
      icon: iconMap[study.industryKey] || <Truck className="w-5 h-5" />,
      accentColor: study.accentColor,
    };
  });

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
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {previewCaseStudies.map((study) => (
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
                  <CardTitle className="text-xl">{study.title}</CardTitle>

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
                      <span className="text-xs text-muted">{study.metricLabel}</span>
                    </div>
                  </div>

                  {/* Excerpt */}
                  <CardDescription className="leading-relaxed">
                    {study.excerpt}
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
