'use client';

/**
 * Why Choose Us Section
 *
 * Highlights 4 key differentiators with icons and descriptions.
 * Explains why companies choose Aviniti.
 */

import { useTranslations } from 'next-intl';
import { Zap, Sparkles, DollarSign, HeadphonesIcon, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { staggerContainer, fadeInUp } from '@/lib/motion/variants';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';

interface Differentiator {
  Icon: LucideIcon;
  titleKey: string;
  descriptionKey: string;
}

const DIFFERENTIATORS: Differentiator[] = [
  { Icon: Zap, titleKey: 'reason_1_title', descriptionKey: 'reason_1_description' },
  { Icon: Sparkles, titleKey: 'reason_2_title', descriptionKey: 'reason_2_description' },
  { Icon: DollarSign, titleKey: 'reason_3_title', descriptionKey: 'reason_3_description' },
  { Icon: HeadphonesIcon, titleKey: 'reason_4_title', descriptionKey: 'reason_4_description' },
];

export function WhyChooseUs() {
  const t = useTranslations('home.why_choose');

  return (
    <Section className="bg-navy" aria-labelledby="why-choose-heading">
      <Container>
        <ScrollReveal>
          <SectionHeading
            id="why-choose-heading"
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {DIFFERENTIATORS.map((item, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card hover className="h-full">
                <CardHeader className="space-y-4">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-xl bg-bronze/10 flex items-center justify-center text-bronze">
                    <item.Icon className="w-10 h-10" aria-hidden="true" />
                  </div>

                  {/* Title */}
                  <CardTitle className="text-xl">{t(item.titleKey)}</CardTitle>

                  {/* Description */}
                  <CardDescription className="leading-relaxed">
                    {t(item.descriptionKey)}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Section-level CTA */}
        <div className="mt-12 flex justify-center">
          <Button
            asChild
            variant="primary"
            size="lg"
            rightIcon={<ArrowRight className="h-5 w-5 rtl:rotate-180" />}
          >
            <Link href="/get-estimate">{t('cta')}</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
