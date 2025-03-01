'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';

interface HeroProps {
  onEstimateClick?: () => void;
}

export default function Hero({ onEstimateClick }: HeroProps = {}) {
  const { t, dir } = useLanguage();
  const [currentScreen, setCurrentScreen] = useState(0);
  const phoneRef = useRef<HTMLDivElement>(null);
  
  // App screens to showcase in the phone frame - using actual app screenshots
  const appScreens = [
    {
      src: '/company-logos/flex-pro.png',
      alt: 'Flex Pro App',
      color: 'bg-blue-500'
    },
    {
      src: '/company-logos/secrtary.png',
      alt: 'Secretary App',
      color: 'bg-purple-500'
    },
    {
      src: '/company-logos/farm-house.png',
      alt: 'Farm House App',
      color: 'bg-green-500'
    },
    {
      src: '/company-logos/skinverse.png',
      alt: 'Skinverse App',
      color: 'bg-pink-500'
    }
  ];

  // Rotate through app screens
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScreen((prevScreen) => (prevScreen + 1) % appScreens.length);
    }, 3000); // Change screen every 3 seconds

    return () => clearInterval(interval);
  }, [appScreens.length]);

  // 3D parallax effect on mouse move
  useEffect(() => {
    const phone = phoneRef.current;
    if (!phone) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = phone.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      // Calculate distance from center as percentage
      const percentX = (e.clientX - centerX) / (window.innerWidth / 2) * 10;
      const percentY = (e.clientY - centerY) / (window.innerHeight / 2) * 10;
      
      // Apply smooth transformation
      phone.style.transform = `perspective(1000px) rotateY(${percentX}deg) rotateX(${-percentY}deg) translateZ(50px)`;
    };

    const handleMouseLeave = () => {
      phone.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
      phone.style.transition = 'all 0.5s ease-out';
    };

    const handleMouseEnter = () => {
      phone.style.transition = 'all 0.2s ease-out';
    };

    document.addEventListener('mousemove', handleMouseMove);
    phone.addEventListener('mouseleave', handleMouseLeave);
    phone.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (phone) {
        phone.removeEventListener('mouseleave', handleMouseLeave);
        phone.removeEventListener('mouseenter', handleMouseEnter);
      }
    };
  }, []);

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

          {/* Premium Phone Animation */}
          <div className="relative h-[550px] w-full flex items-center justify-center">
            {/* Animated Background Circles */}
            <div className="absolute inset-0 w-full h-full">
              <div className="absolute w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
              <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-purple-400 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
              <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-cyan-400 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
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
                        zIndex: currentScreen === index ? 10 : 0
                      }}
                    >
                      <div className="relative w-full h-full flex items-center justify-center">
                        {/* App Logo */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative w-32 h-32">
                            <Image
                              src={screen.src}
                              alt={screen.alt}
                              fill
                              className="object-contain"
                              sizes="128px"
                            />
                          </div>
                        </div>
                        
                        {/* Abstract UI Elements */}
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
              <div className="absolute -inset-10 z-[-1] opacity-30 bg-blue-500 blur-3xl rounded-full animate-pulse-soft"></div>
            </div>
            
            {/* Floating Code Snippets */}
            <div className="absolute -right-8 top-14 transform rotate-6 animate-float-delayed">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 shadow-2xl border border-white/20">
                <pre className="text-[10px] text-blue-200 font-mono">
                  <code>{`function useAI() {
  return AI.solutions();
}`}</code>
                </pre>
              </div>
            </div>
            
            <div className="absolute -left-8 bottom-20 transform -rotate-6 animate-float-delayed-2">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 shadow-2xl border border-white/20">
                <pre className="text-[10px] text-blue-200 font-mono">
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