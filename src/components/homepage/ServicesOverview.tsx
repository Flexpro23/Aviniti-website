'use client';

/**
 * Services Overview Section
 *
 * Displays the 4 core services in a grid layout.
 * Each service card features an icon, title, and description.
 */

import { useTranslations } from 'next-intl';
import { Smartphone, Globe, Brain, Palette } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { staggerContainer, fadeInUp } from '@/lib/motion/variants';
import { motion } from 'framer-motion';

const serviceIcons: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone className="w-8 h-8" />,
  Globe: <Globe className="w-8 h-8" />,
  Brain: <Brain className="w-8 h-8" />,
  Palette: <Palette className="w-8 h-8" />,
};

export function ServicesOverview() {
  const t = useTranslations('home.services');

  const services = [
    { icon: 'Smartphone', slug: 'mobile-apps' },
    { icon: 'Globe', slug: 'web-applications' },
    { icon: 'Brain', slug: 'ai-solutions' },
    { icon: 'Palette', slug: 'ui-ux-design' },
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
          {services.map((service) => (
            <motion.div key={service.slug} variants={fadeInUp}>
              <Card hover className="h-full">
                <CardHeader className="space-y-4">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-bronze/10 flex items-center justify-center text-bronze">
                    {serviceIcons[service.icon]}
                  </div>

                  {/* Title */}
                  <CardTitle className="text-xl">
                    {t(`${service.slug}.name`)}
                  </CardTitle>

                  {/* Description */}
                  <CardDescription className="leading-relaxed">
                    {t(`${service.slug}.description`)}
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
