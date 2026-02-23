import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Sparkles, Target, Shield, Users, ArrowRight } from 'lucide-react';
import { Container, Section, Card, CardContent, Badge } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Link } from '@/lib/i18n/navigation';

export const revalidate = 86400; // Revalidate daily

const valueIcons = [Sparkles, Shield, Users, Target];

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'about' });

  const values = [0, 1, 2, 3].map((i) => ({
    title: t(`mission.values.${i}.title`),
    description: t(`mission.values.${i}.description`),
    icon: valueIcons[i],
  }));

  const steps = [0, 1, 2, 3].map((i) => ({
    title: t(`approach.steps.${i}.title`),
    description: t(`approach.steps.${i}.description`),
  }));

  const stats = [0, 1, 2, 3].map((i) => ({
    value: t(`stats.items.${i}.value`),
    label: t(`stats.items.${i}.label`),
  }));

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
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-6">
              {t('hero.badge')}
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-off-white sm:text-5xl lg:text-6xl">
              {t('hero.title')}
            </h1>
            <p className="text-lg leading-relaxed text-muted sm:text-xl">
              {t('hero.description')}
            </p>
          </div>
        </Container>
      </Section>

      {/* Founder Story */}
      <Section className="bg-white/[0.01]">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-bronze">
              {t('founder.label')}
            </p>
            <h2 className="mb-8 text-3xl font-bold text-off-white sm:text-4xl">
              {t('founder.title')}
            </h2>
            <div className="space-y-6 text-base leading-relaxed text-muted">
              <p>{t('founder.paragraph_1')}</p>
              <p>{t('founder.paragraph_2')}</p>
              <p>{t('founder.paragraph_3')}</p>
              <p>{t('founder.paragraph_4')}</p>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-bronze/10">
                <span className="text-lg font-bold text-bronze">AO</span>
              </div>
              <div>
                <p className="font-semibold text-off-white">{t('founder.name')}</p>
                <p className="text-sm text-muted">{t('founder.role')}</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Mission & Values */}
      <Section>
        <Container>
          <SectionHeading
            label={t('mission.label')}
            title={t('mission.title')}
            subtitle={t('mission.description')}
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title} className="border-white/5 bg-white/[0.02]">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-bronze/10">
                      <Icon className="h-6 w-6 text-bronze" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-off-white">
                      {value.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Approach / Process */}
      <Section className="bg-white/[0.01]">
        <Container>
          <SectionHeading
            label={t('approach.label')}
            title={t('approach.title')}
            subtitle={t('approach.description')}
          />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bronze/10 text-sm font-bold text-bronze">
                  {i + 1}
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-off-white">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Stats */}
      <Section>
        <Container>
          <p className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-bronze">
            {t('stats.label')}
          </p>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-off-white sm:text-5xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section>
        <Container>
          <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-bronze/5 to-transparent p-8 text-center sm:p-12">
            <h2 className="mb-4 text-3xl font-bold text-off-white sm:text-4xl">
              {t('cta.title')}
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-muted">
              {t('cta.description')}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="h-5 w-5 rtl:rotate-180" />}
              >
                <Link href="/get-estimate">{t('cta.primary')}</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/ai-analyzer">{t('cta.secondary')}</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
