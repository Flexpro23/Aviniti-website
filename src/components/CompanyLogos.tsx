'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import ImageWithFallback from './utils/ImageWithFallback';

export default function CompanyLogos() {
  const { t } = useLanguage();
  
  const logos = [
    { id: 1, src: '/company-logos/farm-house.webp', fallbackSrc: '/company-logos/farm-house.png', alt: 'Farm House' },
    { id: 2, src: '/company-logos/flex-pro.webp', fallbackSrc: '/company-logos/flex-pro.png', alt: 'Flex Pro' },
    { id: 3, src: '/company-logos/lets-play.webp', fallbackSrc: '/company-logos/lets-play.png', alt: 'Lets Play' },
    { id: 4, src: '/company-logos/nay-nursery.webp', fallbackSrc: '/company-logos/nay-nursery.png', alt: 'Nay Nursery' },
    { id: 5, src: '/company-logos/secrtary.webp', fallbackSrc: '/company-logos/secrtary.png', alt: 'Secrtary' },
    { id: 6, src: '/company-logos/skinverse.webp', fallbackSrc: '/company-logos/skinverse.png', alt: 'Skinverse' },
    { id: 7, src: '/company-logos/wear-share.webp', fallbackSrc: '/company-logos/wear-share.png', alt: 'Wear Share' },
    { id: 8, src: '/HairVision.png', fallbackSrc: '/HairVision.png', alt: 'HairVision Pro' },
  ];

  return (
    <section className="py-12 bg-off-white">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-2xl font-medium text-gray-700 mb-10">
          {t.projects.title}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center justify-items-center">
          {logos.map((logo) => (
            <div key={logo.id} className="logo-container h-16 w-full max-w-[160px]">
              <ImageWithFallback
                src={logo.src}
                fallbackSrc={logo.fallbackSrc}
                alt={logo.alt}
                width={160}
                height={64}
                className="w-auto h-auto max-h-16"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 