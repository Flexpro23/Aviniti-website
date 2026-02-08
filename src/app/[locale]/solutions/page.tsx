'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Clock, DollarSign, ArrowRight } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { solutions } from '@/lib/data/solutions';
import type { SolutionCategory } from '@/types/solutions';
import { Container, Section, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Button } from '@/components/ui';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { CTABanner } from '@/components/shared/CTABanner';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

type FilterCategory = 'all' | SolutionCategory;

const categoryFilters: { key: FilterCategory; labelKey: string }[] = [
  { key: 'all', labelKey: 'filter_all' },
  { key: 'delivery', labelKey: 'filter_delivery' },
  { key: 'education', labelKey: 'filter_education' },
  { key: 'booking', labelKey: 'filter_booking' },
  { key: 'ecommerce', labelKey: 'filter_ecommerce' },
  { key: 'operations', labelKey: 'filter_operations' },
  { key: 'social', labelKey: 'filter_social' },
];

export default function SolutionsPage() {
  const t = useTranslations('solutions');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');

  const filteredSolutions =
    activeFilter === 'all'
      ? solutions
      : solutions.filter((s) => s.category === activeFilter);

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
            label={t('page.label')}
            title={t('page.title')}
            subtitle={t('page.subtitle')}
          />
        </Container>
      </Section>

      {/* Filter Tabs */}
      <Section padding="compact">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categoryFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeFilter === filter.key
                    ? 'bg-bronze text-white'
                    : 'bg-slate-blue text-muted hover:text-white hover:bg-slate-blue-light'
                }`}
              >
                {t(`page.${filter.labelKey}`)}
              </button>
            ))}
          </div>
        </Container>
      </Section>

      {/* Solutions Grid */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSolutions.map((solution) => {
              // Map slug to translation key
              const slugToKey: Record<string, string> = {
                'delivery-app-system': 'delivery-app-system',
                'kindergarten-management': 'kindergarten-management',
                'hypermarket-management': 'hypermarket-management',
                'office-management': 'office-management',
                'gym-management': 'gym-management',
                'airbnb-marketplace': 'airbnb-marketplace',
                'hair-transplant-ai': 'hair-transplant-ai',
              };
              const tKey = slugToKey[solution.slug] || solution.slug;

              return (
                <ScrollReveal key={solution.slug}>
                  <Card hover className="h-full flex flex-col">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="default" size="sm">
                          {t(`page.filter_${solution.category}`)}
                        </Badge>
                        {solution.hasDemo && (
                          <Badge variant="outline" size="sm">
                            {t('page.demo_available')}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-white">
                        {t(`solutions.${tKey}.name`)}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {t(`solutions.${tKey}.description`)}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1 pt-4">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5 text-bronze">
                          <DollarSign className="h-4 w-4" />
                          <span>{t(`solutions.${tKey}.starting_price`)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted">
                          <Clock className="h-4 w-4" />
                          <span>{t(`solutions.${tKey}.timeline`)}</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter>
                      <Button asChild variant="link" size="sm">
                        <Link href={`/solutions/${solution.slug}`}>
                          {t('page.learn_more')}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </ScrollReveal>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <CTABanner
        heading={t('page.cta_heading')}
        subtitle={t('page.cta_subtitle')}
        primaryCTA={{ label: t('page.cta_estimate'), href: '/get-estimate' }}
        secondaryCTA={{ label: t('page.cta_contact'), href: '/contact' }}
      />
    </main>
  );
}
