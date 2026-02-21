'use client';

/**
 * Services Overview Section
 *
 * Displays the 4 core services in a rich 2x2 grid layout.
 * Each card features: icon + badge, title, bronze accent line,
 * expanded description, capabilities, tech badges, and industries served.
 */

import { useTranslations } from 'next-intl';
import { Smartphone, Globe, Brain, Palette } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { Link } from '@/lib/i18n/navigation';
import { staggerContainer, fadeInUp } from '@/lib/motion/variants';
import { motion } from 'framer-motion';

interface ServiceConfig {
  icon: React.ReactNode;
  slug: string;
}

const services: ServiceConfig[] = [
  { icon: <Smartphone className="w-8 h-8" />, slug: 'mobile-apps' },
  { icon: <Globe className="w-8 h-8" />, slug: 'web-applications' },
  { icon: <Brain className="w-8 h-8" />, slug: 'ai-solutions' },
  { icon: <Palette className="w-8 h-8" />, slug: 'ui-ux-design' },
];

export function ServicesOverview() {
  const t = useTranslations('home.services');

  return (
    <Section className="bg-navy" aria-labelledby="services-heading">
      <Container>
        <ScrollReveal>
          <SectionHeading
            id="services-heading"
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
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {services.map((service) => (
            <motion.div key={service.slug} variants={fadeInUp}>
              {/* Card wrapper with gradient border glow on hover */}
              <div className="relative group/card h-full">
                {/* Gradient border glow - appears on hover */}
                <div
                  className="absolute -inset-[2px] rounded-lg opacity-0 group-hover/card:opacity-100
                    transition-opacity duration-300 pointer-events-none blur-[2px]
                    bg-gradient-to-r from-bronze/60 via-bronze/40 to-bronze/20"
                />

                {/* Card body */}
                <div
                  className="relative h-full rounded-lg p-6 md:p-8 flex flex-col
                    bg-slate-blue border border-slate-blue-light
                    transition-all duration-300
                    group-hover/card:shadow-[0_0_20px_rgba(192,132,96,0.15)]
                    group-hover/card:border-bronze/20
                    group-hover/card:-translate-y-1"
                >
                  {/* Header: Icon + Badge */}
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="w-14 h-14 rounded-xl bg-bronze/10 flex items-center justify-center text-bronze
                        transition-transform duration-300 group-hover/card:scale-105"
                    >
                      {service.icon}
                    </div>
                    <Badge variant="default" size="sm">
                      {t(`${service.slug}.badge`)}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 className="heading-h4 text-2xl leading-none tracking-tight text-off-white mb-3">
                    {t(`${service.slug}.name`)}
                  </h3>

                  {/* Bronze accent line */}
                  <div className="w-12 h-0.5 bg-bronze/60 mb-4" />

                  {/* Description */}
                  <p className="text-muted leading-relaxed mb-6">
                    {t(`${service.slug}.description`)}
                  </p>

                  {/* Capabilities */}
                  <div className="mb-6">
                    <h4 className="text-xs font-semibold text-bronze/80 tracking-wider uppercase mb-3">
                      {t('labels.capabilities')}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="flex items-start gap-2">
                          <span className="text-bronze mt-1.5 text-[6px]">●</span>
                          <span className="text-sm text-muted/90">
                            {t(`${service.slug}.cap_${n}`)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="mb-6">
                    <h4 className="text-xs font-semibold text-bronze/80 tracking-wider uppercase mb-3">
                      {t('labels.technologies')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {t(`${service.slug}.technologies`)
                        .split(/[,،]\s*/)
                        .map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center px-2.5 py-1 text-xs font-medium
                              rounded-md bg-navy-light/60 text-muted/80 border border-slate-blue-light/60"
                          >
                            {tech}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Industries Served */}
                  <div className="mb-6">
                    <h4 className="text-xs font-semibold text-bronze/80 tracking-wider uppercase mb-3">
                      {t('labels.industries')}
                    </h4>
                    <p className="text-sm text-muted/70">
                      {t(`${service.slug}.industries`)}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-auto pt-2">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="w-full justify-center"
                      rightIcon={<ArrowRight className="w-4 h-4 rtl:rotate-180" />}
                    >
                      <Link href="/get-estimate">{t('card_cta')}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <ScrollReveal>
          <div className="mt-12 flex justify-center">
            <Button
              asChild
              variant="secondary"
              size="lg"
              rightIcon={<ArrowRight className="w-5 h-5 rtl:rotate-180" />}
            >
              <Link href="/solutions">{t('cta')}</Link>
            </Button>
          </div>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
