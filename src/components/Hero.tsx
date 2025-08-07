'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ImageWithFallback from './utils/ImageWithFallback';
import Script from 'next/script';

interface HeroProps {
  onConsultationClick?: () => void;
}

export default function Hero({ onConsultationClick }: HeroProps = {}) {
  const { t, dir } = useLanguage();
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState(0);
  const phoneRef = useRef<HTMLDivElement>(null);
  
  // App screens to showcase in the phone frame - using actual app screenshots
  const appScreens = [
    {
      src: '/company-logos/flex-pro.webp',
      alt: 'Flex Pro App',
      color: 'bg-slate-blue-500'
    },
    {
      src: '/company-logos/secrtary.webp',
      alt: 'Secretary App',
      color: 'bg-bronze-500'
    },
    {
      src: '/company-logos/farm-house.webp',
      alt: 'Farm House App',
      color: 'bg-bronze-600',
      customStyle: {
        backgroundColor: '#a6714e', // Bronze-600 to match the Farm House app screen
        backgroundImage: 'linear-gradient(135deg, #a6714e 0%, #8a5d42 100%)'
      }
    },
    {
      src: '/company-logos/skinverse.webp',
      alt: 'Skinverse App',
      color: 'bg-slate-blue-400'
    }
  ];

  // Rotate through app screens
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScreen((prevScreen) => (prevScreen + 1) % appScreens.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [appScreens.length]);

  // Create a separate effect for mouse interactions to reduce unnecessary re-renders
  useEffect(() => {
    const phoneElement = phoneRef.current;
    if (!phoneElement) return;

    // Handle phone element mouse interactions
    const handleMouseMove = (e: MouseEvent) => {
      if (!phoneElement) return;
      
      // Calculate relative position
      const rect = phoneElement.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      // Apply subtle 3D transform
      phoneElement.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
    };
    
    const handleMouseLeave = () => {
      if (!phoneElement) return;
      // Reset transform on mouse leave - with smoother transition
      phoneElement.style.transition = 'transform 0.5s ease-out';
      phoneElement.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
    };
    
    const handleMouseEnter = () => {
      if (!phoneElement) return;
      // Remove transition on mouse enter for responsive movement
      phoneElement.style.transition = 'none';
    };

    // Add event listeners
    phoneElement.addEventListener('mousemove', handleMouseMove);
    phoneElement.addEventListener('mouseleave', handleMouseLeave);
    phoneElement.addEventListener('mouseenter', handleMouseEnter);
    
    // Cleanup
    return () => {
      phoneElement.removeEventListener('mousemove', handleMouseMove);
      phoneElement.removeEventListener('mouseleave', handleMouseLeave);
      phoneElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  // Memoize these functions to prevent unnecessary rerenders
  const scrollToReadyMadeSolutions = () => {
    document.getElementById('ready-made-solutions')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };
  
  const handleConsultationClick = () => {
    if (onConsultationClick) {
      onConsultationClick();
    }
  };

  return (
    <section className="relative min-h-screen flex items-center py-16 sm:py-20 overflow-hidden">
      {/* Structured Data for SEO */}
      <Script
        id="structured-data-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            'name': 'Aviniti',
            'description': 'Aviniti is a dynamic AI and app development company specializing in custom software solutions, mobile apps, and AI integration.',
            'url': 'https://aviniti.app',
            'logo': 'https://aviniti.app/logo.svg',
            'serviceType': ['AI Development', 'App Development', 'Software Solutions'],
            'areaServed': 'Worldwide',
            'sameAs': [
              'https://linkedin.com/company/aviniti',
              'https://twitter.com/aviniti'
            ]
          })
        }}
      />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-blue-600 to-slate-blue-800">
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-20"></div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center lg:items-center ${dir === 'rtl' ? 'lg:flex-row-reverse' : ''}`}>
          {/* Text Content */}
          <div className={`text-center lg:text-left flex flex-col justify-center h-full pt-12 ${dir === 'rtl' ? 'lg:text-right' : ''}`}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
              <span className="block mb-2">{t.hero.companyTitle}</span>
              <span className="block">{t.hero.title}</span>
              <span className="block text-slate-blue-200">{t.hero.subtitle}</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-slate-blue-100 mb-2">
              {t.hero.description}
            </p>
            <p className="text-base sm:text-lg text-slate-blue-200 mb-8">
              {t.hero.subDescription}
            </p>

            {/* Primary CTA Button - Updated to Bronze */}
            <div className={`flex justify-center lg:justify-start ${dir === 'rtl' ? 'lg:justify-end' : ''} mb-8`}>
              <button
                onClick={() => router.push('/estimate')}
                className="px-12 py-6 bg-bronze-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:bg-bronze-600 transition-all duration-300 transform hover:scale-105"
                title={t.hero.estimateDescription}
              >
                {t.hero.getEstimate}
              </button>
            </div>

            {/* Grouped Secondary Actions */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start ${dir === 'rtl' ? 'lg:justify-end' : ''}`}>
              <button
                onClick={scrollToReadyMadeSolutions}
                className="px-8 py-4 bg-transparent text-white border-2 border-slate-blue-300 rounded-xl font-semibold shadow-lg hover:bg-white hover:text-slate-blue-700 transition-colors duration-300"
                title="View our ready-made app solutions"
              >
                Ready-Made Solutions
              </button>
              {/* Contact Us Button */}
              <button
                onClick={() => router.push('/contact')}
                className="text-slate-blue-200 hover:text-white font-medium flex items-center justify-center sm:justify-start group py-4 px-2 sm:px-0" // Added padding for better mobile click area
                title="Get in touch with our team"
              >
                <span className="mr-2">Contact Us</span>
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
          </div>

          {/* Premium Phone Animation */}
          <div className="relative h-[550px] w-full flex items-center justify-center">
            {/* Animated Background Circles */}
            <div className="absolute inset-0 w-full h-full">
              <div className="absolute w-64 h-64 bg-slate-blue-400 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
              <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-bronze-400 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
              <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-slate-blue-300 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>
            
            {/* Phone Frame */}
            <div 
              ref={phoneRef}
              className="relative w-[280px] h-[580px] transform-gpu will-change-transform transition-all duration-500"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Phone Body */}
              <div className="absolute inset-0 rounded-[40px] overflow-hidden bg-black shadow-[0_0_40px_rgba(0,0,0,0.3)] border-[12px] border-black">
                {/* Inner Shadow for Realism */}
                <div className="absolute inset-0 shadow-inner pointer-events-none z-30"></div>
                
                {/* Phone Camera Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-b-[16px] z-30 flex justify-center items-end pb-1">
                  <div className="w-2 h-2 rounded-full bg-gray-700 mr-1"></div>
                  <div className="w-4 h-4 rounded-full bg-gray-800"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-700 ml-1"></div>
                </div>
                
                {/* Power Button */}
                <div className="absolute top-28 -right-[14px] w-[2px] h-10 bg-gray-800 rounded z-30"></div>
                
                {/* Volume Buttons */}
                <div className="absolute top-36 -left-[14px] w-[2px] h-8 bg-gray-800 rounded z-30"></div>
                <div className="absolute top-48 -left-[14px] w-[2px] h-8 bg-gray-800 rounded z-30"></div>

                {/* App Screens - 3D Animated */}
                <div className="absolute inset-0 rounded-[28px] overflow-hidden">
                  {appScreens.map((screen, index) => (
                    <div 
                      key={index}
                      className={`absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-700 ease-in-out ${screen.color}`}
                      style={{ 
                        opacity: currentScreen === index ? 1 : 0,
                        transform: currentScreen === index 
                          ? 'translateZ(0px) rotateY(0deg)' 
                          : `translateZ(-50px) rotateY(${(index - currentScreen) * 90}deg)`,
                        zIndex: currentScreen === index ? 10 : 0,
                        ...(screen.customStyle || {})
                      }}
                    >
                      <div className="relative w-full h-full flex items-center justify-center">
                        {/* App Logo */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white/20 p-2 shadow-inner">
                            <div className="absolute inset-0 rounded-full overflow-hidden bg-white flex items-center justify-center">
                              <ImageWithFallback
                                src={screen.src.replace(/\.(png|jpg|jpeg|svg)$/, '.webp')}
                                fallbackSrc={screen.src}
                                alt={screen.alt}
                                fill
                                className="object-contain p-2 rounded-full"
                                sizes="128px"
                              />
                            </div>
                            
                            {/* Subtle glow effect */}
                            <div className="absolute -inset-0.5 rounded-full opacity-30 blur-sm"></div>
                          </div>
                        </div>
                        
                        {/* Abstract UI Elements - Custom for Farm House */}
                        {index === 2 ? (
                          // Farm House specific UI elements
                          <>
                            <div className="absolute inset-x-0 top-20 flex justify-center">
                              <div className="w-3/5 h-8 bg-white/30 rounded-full"></div>
                            </div>
                            
                            <div className="absolute inset-x-6 bottom-32 grid grid-cols-2 gap-4">
                              <div className="h-16 bg-white/30 rounded-xl"></div>
                              <div className="h-16 bg-white/30 rounded-xl"></div>
                            </div>
                            
                            <div className="absolute inset-x-6 bottom-56 grid grid-cols-2 gap-4">
                              <div className="h-16 bg-white/30 rounded-xl"></div>
                              <div className="h-16 bg-white/30 rounded-xl"></div>
                            </div>
                          </>
                        ) : (
                          // Default UI elements for other apps
                          <>
                            <div className="absolute inset-x-0 top-16 flex justify-center">
                              <div className="w-4/5 h-8 bg-white/20 rounded-full"></div>
                            </div>
                            
                            <div className="absolute inset-x-6 bottom-20 grid grid-cols-2 gap-4">
                              <div className="h-20 bg-white/20 rounded-xl"></div>
                              <div className="h-20 bg-white/20 rounded-xl"></div>
                            </div>
                            
                            <div className="absolute inset-x-6 bottom-48 w-full">
                              <div className="h-12 bg-white/20 rounded-xl"></div>
                            </div>
                          </>
                        )}
                        
                        {/* Particle Effects */}
                        <div className="absolute inset-0 overflow-hidden">
                          {[...Array(15)].map((_, i) => (
                            <div 
                              key={i}
                              className={`absolute w-1 h-1 bg-white rounded-full animate-float-particle transform opacity-40`}
                              style={{ 
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${5 + Math.random() * 10}s`
                              }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Home Indicator */}
              <div className="absolute left-1/2 bottom-[2px] transform -translate-x-1/2 w-1/3 h-1 bg-gray-600 rounded-full z-30"></div>

              {/* Reflection Overlay */}
              <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none z-40 overflow-hidden"></div>
              
              {/* Screen light glow */}
              <div className="absolute -inset-10 z-[-1] opacity-30 bg-bronze-500 blur-3xl rounded-full animate-pulse-soft"></div>
            </div>
            
            {/* Floating Code Snippets */}
            <div className="absolute -right-8 top-14 transform rotate-6 animate-float-delayed">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 shadow-2xl border border-white/20">
                <pre className="text-[10px] text-slate-blue-200 font-mono">
                  <code>{`function useAI() {
  return AI.solutions();
}`}</code>
                </pre>
              </div>
            </div>
            
            <div className="absolute -left-8 bottom-20 transform -rotate-6 animate-float-delayed-2">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 shadow-2xl border border-white/20">
                <pre className="text-[10px] text-slate-blue-200 font-mono">
                  <code>{`<App
  innovation={true}
  performant={true}
/>`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 