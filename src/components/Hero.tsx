'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import Image from 'next/image';

interface HeroProps {
  onEstimateClick?: () => void;
}

export default function Hero({ onEstimateClick }: HeroProps = {}) {
  const { t, dir } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center py-16 sm:py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900">
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-20"></div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${dir === 'rtl' ? 'lg:flex-row-reverse' : ''}`}>
          {/* Text Content */}
          <div className={`text-center lg:text-left ${dir === 'rtl' ? 'lg:text-right' : ''}`}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
              {t.hero.title} <br />
              <span className="text-blue-200">{t.hero.subtitle}</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-blue-100 mb-2">
              {t.hero.description}
            </p>
            <p className="text-base sm:text-lg text-blue-200 mb-8 sm:mb-10">
              {t.hero.subDescription}
            </p>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start ${dir === 'rtl' ? 'lg:justify-end' : ''}`}>
              <button
                onClick={onEstimateClick}
                className="px-8 py-4 bg-white text-blue-700 rounded-xl font-semibold shadow-lg hover:bg-blue-50 transition-colors duration-300"
                title={t.hero.estimateDescription}
              >
                {t.hero.getEstimate}
              </button>
              <button
                className="px-8 py-4 bg-blue-800 text-white border border-blue-400 rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors duration-300"
                title={t.hero.solutionsDescription}
              >
                {t.hero.exploreSolutions}
              </button>
            </div>

            {/* Consultation Button */}
            <button
              className="mt-6 text-blue-200 hover:text-white font-medium flex items-center justify-center sm:justify-start mx-auto lg:mx-0 group"
              title={t.hero.consultationDescription}
            >
              <span className="mr-2">{t.hero.getFreeConsultation}</span>
              <svg
                className={`w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1 ${dir === 'rtl' ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Hero Image */}
          <div className="relative h-64 sm:h-72 md:h-96 lg:h-full">
            <Image
              src="/hero/hero-image.svg"
              alt="Hero Illustration"
              fill
              className="object-contain brightness-110 drop-shadow-2xl"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
} 