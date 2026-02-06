/**
 * Process Overview Section
 *
 * Optional "How We Work" section showing 6 process steps.
 * Features numbered steps with connecting lines.
 */

import { useTranslations } from 'next-intl';
import {
  Search,
  Palette,
  Code,
  TestTube,
  Rocket,
  HeadphonesIcon,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { staggerContainer, fadeInUp } from '@/lib/motion/variants';
import { motion } from 'framer-motion';

interface ProcessStep {
  icon: React.ReactNode;
  titleKey: string;
  descriptionKey: string;
}

export function ProcessOverview() {
  const t = useTranslations('home.process');

  const steps: ProcessStep[] = [
    {
      icon: <Search className="w-6 h-6" />,
      titleKey: 'step_1_title',
      descriptionKey: 'step_1_description',
    },
    {
      icon: <Palette className="w-6 h-6" />,
      titleKey: 'step_2_title',
      descriptionKey: 'step_2_description',
    },
    {
      icon: <Code className="w-6 h-6" />,
      titleKey: 'step_3_title',
      descriptionKey: 'step_3_description',
    },
    {
      icon: <TestTube className="w-6 h-6" />,
      titleKey: 'step_4_title',
      descriptionKey: 'step_4_description',
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      titleKey: 'step_5_title',
      descriptionKey: 'step_5_description',
    },
    {
      icon: <HeadphonesIcon className="w-6 h-6" />,
      titleKey: 'step_6_title',
      descriptionKey: 'step_6_description',
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
          className="relative"
        >
          {/* Connecting Line (hidden on mobile) */}
          <div
            className="hidden lg:block absolute top-8 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-slate-blue-light to-transparent"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div key={index} variants={fadeInUp} className="relative">
                <div className="flex flex-col items-center text-center">
                  {/* Step Number & Icon */}
                  <div className="relative mb-4">
                    {/* Number Badge */}
                    <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-bronze text-white text-sm font-bold flex items-center justify-center shadow-lg z-10">
                      {index + 1}
                    </div>

                    {/* Icon Container */}
                    <div className="w-16 h-16 rounded-xl bg-slate-blue border border-slate-blue-light flex items-center justify-center text-bronze">
                      {step.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {t(step.titleKey)}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted leading-relaxed">
                    {t(step.descriptionKey)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
