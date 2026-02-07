'use client';

/**
 * Company Logos Section
 *
 * Infinite scrolling marquee of client company logos.
 * Features two rows scrolling in opposite directions with grayscale treatment.
 */

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { cn } from '@/lib/utils/cn';

interface CompanyLogo {
  name: string;
  image: string;
  width: number;
  height: number;
}

// Company logos with varied sizes for visual interest
const COMPANY_LOGOS: CompanyLogo[] = [
  { name: 'FlexPro Fitness', image: '/company-logos/flex-pro-medium.webp', width: 180, height: 60 },
  { name: 'SecretaryApp', image: '/company-logos/secrtary-medium.webp', width: 180, height: 60 },
  { name: 'FarmHouse Delivery', image: '/company-logos/farm-house-medium.webp', width: 180, height: 60 },
  { name: "Let's Play", image: '/company-logos/lets-play.webp', width: 180, height: 60 },
  { name: 'Nay Nursery', image: '/company-logos/nay-nursery.webp', width: 180, height: 60 },
  { name: 'SkinVerse', image: '/company-logos/skinverse-medium.webp', width: 180, height: 60 },
  { name: 'WearShare', image: '/company-logos/wear-share.webp', width: 180, height: 60 },
];

// Split logos into two rows
const ROW_1 = COMPANY_LOGOS.slice(0, 4);
const ROW_2 = COMPANY_LOGOS.slice(3, 7);

// Duplicate for seamless loop
const ROW_1_DUPLICATED = [...ROW_1, ...ROW_1, ...ROW_1];
const ROW_2_DUPLICATED = [...ROW_2, ...ROW_2, ...ROW_2];

export function CompanyLogos() {
  const t = useTranslations('home.company_logos');

  return (
    <Section className="bg-navy-dark overflow-hidden">
      <Container>
        <ScrollReveal>
          <SectionHeading
            title={t('title')}
            subtitle={t('subtitle')}
            align="center"
            className="mb-16"
          />
        </ScrollReveal>

        <div className="space-y-8 lg:space-y-12">
          {/* Row 1 - Scroll Left to Right */}
          <div className="relative">
            {/* Gradient fade edges */}
            <div
              className="absolute inset-y-0 start-0 w-32 z-10 pointer-events-none"
              style={{
                background: 'linear-gradient(to right, #0F1419 0%, transparent 100%)',
              }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-y-0 end-0 w-32 z-10 pointer-events-none"
              style={{
                background: 'linear-gradient(to left, #0F1419 0%, transparent 100%)',
              }}
              aria-hidden="true"
            />

            {/* Scrolling container */}
            <div className="flex gap-12 lg:gap-16 animate-marquee-ltr">
              {ROW_1_DUPLICATED.map((logo, index) => (
                <LogoCard key={`row1-${index}`} logo={logo} />
              ))}
            </div>
          </div>

          {/* Row 2 - Scroll Right to Left */}
          <div className="relative">
            {/* Gradient fade edges */}
            <div
              className="absolute inset-y-0 start-0 w-32 z-10 pointer-events-none"
              style={{
                background: 'linear-gradient(to right, #0F1419 0%, transparent 100%)',
              }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-y-0 end-0 w-32 z-10 pointer-events-none"
              style={{
                background: 'linear-gradient(to left, #0F1419 0%, transparent 100%)',
              }}
              aria-hidden="true"
            />

            {/* Scrolling container */}
            <div className="flex gap-12 lg:gap-16 animate-marquee-rtl">
              {ROW_2_DUPLICATED.map((logo, index) => (
                <LogoCard key={`row2-${index}`} logo={logo} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function LogoCard({ logo }: { logo: CompanyLogo }) {
  return (
    <div
      className={cn(
        'flex-shrink-0 flex items-center justify-center',
        'relative group transition-all duration-300'
      )}
    >
      <div className="relative w-32 h-20 lg:w-40 lg:h-24 flex items-center justify-center">
        <Image
          src={logo.image}
          alt={`${logo.name} logo`}
          width={logo.width}
          height={logo.height}
          className={cn(
            'w-auto h-auto max-w-full max-h-full object-contain',
            'grayscale opacity-60',
            'group-hover:grayscale-0 group-hover:opacity-100',
            'transition-all duration-500'
          )}
        />
      </div>
    </div>
  );
}
