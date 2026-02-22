'use client';

/**
 * Services Overview Section
 *
 * Mobile-optimized design with two layouts:
 * - Mobile (<md): Compact cards with expandable details accordion
 * - Desktop (md+): Full content visible in 2-column grid, streamlined layout without capabilities section header
 *
 * Features:
 * - React useState for expand/collapse state
 * - AnimatePresence + motion.div for smooth height animations
 * - Full RTL support with logical CSS properties
 * - Bronze design system and Framer Motion animations
 * - All translation keys preserved (home.services namespace)
 */

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Smartphone, Globe, Brain, Palette, ChevronDown, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { Link } from '@/lib/i18n/navigation';
import { staggerContainer, fadeInUp } from '@/lib/motion/variants';
import { motion, AnimatePresence } from 'framer-motion';

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

/**
 * ServiceCard Component
 * Renders a single service card with responsive compact/expanded layout
 */
function ServiceCard({ service }: { service: ServiceConfig }) {
  const t = useTranslations('home.services');
  const [isExpanded, setIsExpanded] = useState(false);

  // Parse technologies from comma-separated string
  const technologies = t(`${service.slug}.technologies`)
    .split(/[,،]\s*/)
    .filter(Boolean);

  // Get first 3 technologies for mobile compact view
  const topTechnologies = technologies.slice(0, 3);

  return (
    <motion.div variants={fadeInUp}>
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
          className="relative rounded-lg p-6 md:p-8 flex flex-col
            bg-slate-blue border border-slate-blue-light
            transition-all duration-300
            group-hover/card:shadow-[0_0_20px_rgba(192,132,96,0.15)]
            group-hover/card:border-bronze/20
            group-hover/card:-translate-y-1"
        >
          {/* ===== MOBILE COMPACT VIEW ===== */}
          <div className="md:hidden space-y-4">
            {/* Header: Icon + Badge */}
            <div className="flex items-start justify-between gap-4">
              <div
                className="w-12 h-12 flex-shrink-0 rounded-xl bg-bronze/10 flex items-center justify-center text-bronze
                  transition-transform duration-300 group-hover/card:scale-105"
              >
                {service.icon}
              </div>
              <Badge variant="default" size="sm">
                {t(`${service.slug}.badge`)}
              </Badge>
            </div>

            {/* Title */}
            <h3 className="heading-h4 text-xl leading-none tracking-tight text-off-white">
              {t(`${service.slug}.name`)}
            </h3>

            {/* Bronze accent line */}
            <div className="w-8 h-0.5 bg-bronze/60" />

            {/* Description - single line on mobile */}
            <p className="text-muted leading-relaxed text-sm line-clamp-2">
              {t(`${service.slug}.description`)}
            </p>

            {/* Top tech tags on mobile */}
            {topTechnologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {topTechnologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium
                      rounded-md bg-navy-light/60 text-muted/80 border border-slate-blue-light/60"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {/* Expand/Collapse Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-center gap-2 text-bronze hover:text-bronze-light
                transition-colors duration-200 text-sm font-medium pt-2"
              aria-expanded={isExpanded}
              aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${t(`${service.slug}.name`)} details`}
            >
              <span>{isExpanded ? t('labels.hide_details') : t('labels.see_details')}</span>
              <ChevronDown
                className="w-4 h-4 transition-transform duration-300"
                style={{
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </button>
          </div>

          {/* ===== EXPANDED/DESKTOP DETAILS ===== */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="md:hidden overflow-hidden space-y-4 pt-4 border-t border-slate-blue-light/30"
              >
                {/* Full Description */}
                <p className="text-muted leading-relaxed text-sm">
                  {t(`${service.slug}.description`)}
                </p>

                {/* Capabilities */}
                <div>
                  <h4 className="text-xs font-semibold text-bronze/80 tracking-wider uppercase mb-2">
                    {t('labels.capabilities')}
                  </h4>
                  <div className="space-y-1.5">
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} className="flex items-start gap-2">
                        <span className="text-bronze mt-0.5 text-[6px] flex-shrink-0">●</span>
                        <span className="text-xs text-muted/90">
                          {t(`${service.slug}.cap_${n}`)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* All Technologies */}
                {technologies.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-bronze/80 tracking-wider uppercase mb-2">
                      {t('labels.technologies')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {technologies.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium
                            rounded-md bg-navy-light/60 text-muted/80 border border-slate-blue-light/60"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Industries Served */}
                <div>
                  <h4 className="text-xs font-semibold text-bronze/80 tracking-wider uppercase mb-2">
                    {t('labels.industries')}
                  </h4>
                  <p className="text-xs text-muted/70">
                    {t(`${service.slug}.industries`)}
                  </p>
                </div>

                {/* Mobile CTA */}
                <div className="pt-2">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center text-xs"
                    rightIcon={<ArrowRight className="w-4 h-4 rtl:rotate-180" />}
                  >
                    <Link href="/get-estimate">{t('card_cta')}</Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ===== DESKTOP FULL VIEW ===== */}
          <div className="hidden md:flex md:flex-col md:space-y-5 h-full">
            {/* Header: Icon + Badge */}
            <div className="flex items-start justify-between gap-4">
              <div
                className="w-14 h-14 flex-shrink-0 rounded-xl bg-bronze/10 flex items-center justify-center text-bronze
                  transition-transform duration-300 group-hover/card:scale-105"
              >
                {service.icon}
              </div>
              <Badge variant="default" size="sm">
                {t(`${service.slug}.badge`)}
              </Badge>
            </div>

            {/* Title */}
            <h3 className="heading-h4 text-2xl leading-none tracking-tight text-off-white">
              {t(`${service.slug}.name`)}
            </h3>

            {/* Bronze accent line */}
            <div className="w-12 h-0.5 bg-bronze/60" />

            {/* Description */}
            <p className="text-muted leading-relaxed">
              {t(`${service.slug}.description`)}
            </p>

            {/* Capabilities - no header, just text (streamlined) */}
            <div className="space-y-1.5">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="flex items-start gap-2">
                  <span className="text-bronze mt-1 text-[6px] flex-shrink-0">●</span>
                  <span className="text-sm text-muted/90">
                    {t(`${service.slug}.cap_${n}`)}
                  </span>
                </div>
              ))}
            </div>

            {/* Technologies */}
            {technologies.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-bronze/80 tracking-wider uppercase mb-3">
                  {t('labels.technologies')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech) => (
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
            )}

            {/* Industries Served */}
            <div>
              <h4 className="text-xs font-semibold text-bronze/80 tracking-wider uppercase mb-3">
                {t('labels.industries')}
              </h4>
              <p className="text-sm text-muted/70">
                {t(`${service.slug}.industries`)}
              </p>
            </div>

            {/* Desktop CTA - pushed to bottom */}
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
      </div>
    </motion.div>
  );
}

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
            <ServiceCard key={service.slug} service={service} />
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
