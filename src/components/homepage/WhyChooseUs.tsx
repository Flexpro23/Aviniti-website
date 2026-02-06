/**
 * Why Choose Us Section
 *
 * Highlights 4 key differentiators with icons and descriptions.
 * Explains why companies choose Aviniti.
 */

import { useTranslations } from 'next-intl';
import { Zap, Sparkles, DollarSign, HeadphonesIcon } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { staggerContainer, fadeInUp } from '@/lib/motion/variants';
import { motion } from 'framer-motion';

interface Differentiator {
  icon: React.ReactNode;
  titleKey: string;
  descriptionKey: string;
}

export function WhyChooseUs() {
  const t = useTranslations('home.why_choose');

  const differentiators: Differentiator[] = [
    {
      icon: <Zap className="w-10 h-10" />,
      titleKey: 'reason_1_title',
      descriptionKey: 'reason_1_description',
    },
    {
      icon: <Sparkles className="w-10 h-10" />,
      titleKey: 'reason_2_title',
      descriptionKey: 'reason_2_description',
    },
    {
      icon: <DollarSign className="w-10 h-10" />,
      titleKey: 'reason_3_title',
      descriptionKey: 'reason_3_description',
    },
    {
      icon: <HeadphonesIcon className="w-10 h-10" />,
      titleKey: 'reason_4_title',
      descriptionKey: 'reason_4_description',
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {differentiators.map((item, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card hover className="h-full">
                <CardHeader className="space-y-4">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-xl bg-bronze/10 flex items-center justify-center text-bronze">
                    {item.icon}
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
      </Container>
    </Section>
  );
}
