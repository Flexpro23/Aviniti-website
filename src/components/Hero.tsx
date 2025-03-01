'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface HeroProps {
  onEstimateClick?: () => void;
}

export default function Hero({ onEstimateClick }: HeroProps = {}) {
  const { t, dir } = useLanguage();
  const [currentScreen, setCurrentScreen] = useState(0);
  
  // App screens to showcase in the phone frame
  const appScreens = [
    {
      src: '/company-logos/flex-pro.png',
      alt: 'AI Chatbot Interface'
    },
    {
      src: '/company-logos/secrtary.png',
      alt: 'Real-time Analytics Dashboard'
    },
    {
      src: '/company-logos/farm-house.png',
      alt: 'Mobile App Login Screen'
    },
    {
      src: '/company-logos/skinverse.png',
      alt: 'Predictive Modeling Results'
    }
  ];

  // Rotate through app screens
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScreen((prevScreen) => (prevScreen + 1) % appScreens.length);
    }, 3000); // Change screen every 3 seconds

    return () => clearInterval(interval);
  }, [appScreens.length]);

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

          {/* Phone Frame Animation */}
          <div className="relative h-[500px] w-full flex items-center justify-center">
            {/* Phone Frame */}
            <div className="relative w-[280px] h-[560px] animate-float phone-frame transform-gpu perspective-1000">
              {/* Phone Frame with Screen Inside */}
              <div className="absolute top-0 left-0 w-full h-full rounded-[40px] overflow-hidden">
                {/* Phone Body */}
                <div className="absolute inset-0 border-[12px] border-black rounded-[40px] bg-black shadow-2xl z-20">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-b-[16px] z-30"></div>
                  
                  {/* App Screens - Animated */}
                  <div className="absolute inset-0 rounded-[28px] overflow-hidden bg-gray-800">
                    {appScreens.map((screen, index) => (
                      <div 
                        key={index}
                        className="absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out"
                        style={{ 
                          opacity: currentScreen === index ? 1 : 0,
                          zIndex: currentScreen === index ? 10 : 0
                        }}
                      >
                        <Image
                          src={screen.src}
                          alt={screen.alt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Glowing Effect */}
              <div className="absolute -inset-4 bg-blue-500 opacity-20 blur-2xl rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 