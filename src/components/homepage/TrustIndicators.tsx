'use client';

/**
 * Trust Indicators Section
 *
 * Displays animated counter stats and trust badges.
 * Features count-up animation when scrolled into view.
 */

import { Shield, Lock, FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { useScrollReveal, useCountUp } from '@/lib/motion/hooks';

interface TrustMetric {
  value: number;
  suffix: string;
  labelKey: string;
}

interface TrustBadge {
  icon: React.ReactNode;
  labelKey: string;
}

export function TrustIndicators() {
  const t = useTranslations('home.trust');
  const { ref, inView } = useScrollReveal({ once: true });

  const metrics: TrustMetric[] = [
    { value: 24, suffix: '+', labelKey: 'metric_1_label' }, // 24+ Products Delivered
    { value: 9, suffix: '', labelKey: 'metric_2_label' }, // 9 Apps Live in Stores
    { value: 98, suffix: '%', labelKey: 'metric_3_label' }, // 98% Client Satisfaction
    { value: 16, suffix: '+', labelKey: 'metric_4_label' }, // 16+ Clients Served
  ];

  const badges: TrustBadge[] = [
    { icon: <Shield className="w-4 h-4" />, labelKey: 'badge_1' },
    { icon: <Lock className="w-4 h-4" />, labelKey: 'badge_2' },
    { icon: <FileText className="w-4 h-4" />, labelKey: 'badge_3' },
  ];

  return (
    <section className="relative py-16 lg:py-20 bg-navy-dark">
      {/* Subtle radial glow for visual depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(192,132,96,0.03) 0%, transparent 70%)',
        }}
      />
      <Container>
        {/* Section Heading */}
        <SectionHeading
          label={t('heading.label')}
          title={t('heading.title')}
          subtitle={t('heading.subtitle')}
          align="center"
          className="mb-12"
        />

        <div ref={ref}>
          {/* Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-10">
            {metrics.map((metric, index) => (
              <MetricCard
                key={index}
                value={metric.value}
                suffix={metric.suffix}
                label={t(metric.labelKey)}
                inView={inView}
                delay={index * 100}
              />
            ))}
          </div>

          {/* Trust Badges Row */}
          <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-8">
            {badges.map((badge, index) => (
              <div key={index} className="flex items-center gap-2 text-muted text-sm">
                <span className="text-muted" aria-hidden="true">
                  {badge.icon}
                </span>
                <span>{t(badge.labelKey)}</span>
                {index < badges.length - 1 && (
                  <div className="hidden sm:block w-px h-5 bg-slate-blue-light ms-6" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

interface MetricCardProps {
  value: number;
  suffix: string;
  label: string;
  inView: boolean;
  delay?: number;
}

function MetricCard({ value, suffix, label, inView, delay = 0 }: MetricCardProps) {
  const count = useCountUp(inView ? value : 0, { duration: 2000, delay });

  return (
    <div className="text-center group">
      <div className="relative inline-block">
        <div className="text-4xl lg:text-5xl font-bold text-white mb-2 relative z-10">
          {Math.round(count)}
          <span className="text-bronze">{suffix}</span>
        </div>
        {/* Bronze glow underline effect */}
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-1 bg-bronze/40 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          aria-hidden="true"
        />
      </div>
      <div className="text-sm font-medium text-muted uppercase tracking-widest mt-3">{label}</div>
    </div>
  );
}
