/**
 * Live Apps Showcase Section
 *
 * Displays a grid of live apps with App Store and Google Play links.
 * Features app icons, names, descriptions, and store badges.
 */

import { useTranslations } from 'next-intl';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { liveApps } from '@/lib/data/apps';
import { staggerContainer, fadeInUp } from '@/lib/motion/variants';
import { motion } from 'framer-motion';

export function LiveAppsShowcase() {
  const t = useTranslations('home.apps');
  const at = useTranslations('apps');

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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {liveApps.map((app) => (
            <motion.div key={app.name} variants={fadeInUp}>
              <Card hover className="h-full flex flex-col">
                <CardHeader className="space-y-4 flex-1">
                  {/* App Icon */}
                  <div className="w-16 h-16 rounded-[20px] bg-bronze/10 flex items-center justify-center overflow-hidden">
                    {app.icon ? (
                      <Image
                        src={app.icon}
                        alt={app.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-bronze">
                        {app.name.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* App Name */}
                  <CardTitle className="text-lg">{app.name}</CardTitle>

                  {/* Category Badge */}
                  <p className="text-xs text-muted uppercase tracking-wider">{app.category}</p>

                  {/* Description */}
                  <CardDescription className="text-sm leading-relaxed">
                    {at(app.descriptionKey)}
                  </CardDescription>
                </CardHeader>

                {/* Store Links */}
                <CardFooter className="flex flex-wrap gap-3">
                  {app.appStore && (
                    <a
                      href={app.appStore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-muted hover:text-bronze transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      App Store
                    </a>
                  )}
                  {app.googlePlay && (
                    <a
                      href={app.googlePlay}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-muted hover:text-bronze transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Google Play
                    </a>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
