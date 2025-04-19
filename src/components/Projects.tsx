'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import AppStoreLinks from './AppStoreLinks';
import ImageWithFallback from './utils/ImageWithFallback';
import React from 'react';

type ProjectCategory = 'all' | 'web' | 'mobile' | 'ai';

// Memoize the projects array to prevent unnecessary re-renders
const useProjects = (t: any) => {
  return React.useMemo(() => [
    {
      key: 'flexPro',
      image: '/company-logos/flex-pro.webp',
      categories: ['mobile', 'web'] as ProjectCategory[],
      data: t.projects.flexPro,
      iosUrl: 'https://apps.apple.com/jo/app/flex-pro-drive/id6471506551',
      androidUrl: 'https://play.google.com/store/apps/details?id=com.mycompany.flexdrive&hl=en'
    },
    {
      key: 'secretary',
      image: '/company-logos/secrtary.webp',
      categories: ['mobile'] as ProjectCategory[],
      data: t.projects.secretary,
      iosUrl: 'https://apps.apple.com/jo/app/secrtary/id6481658380',
      androidUrl: 'https://play.google.com/store/apps/details?id=com.mycompany.secrtary&hl=en'
    },
    {
      key: 'farmHouse',
      image: '/company-logos/farm-house.webp',
      categories: ['mobile', 'web'] as ProjectCategory[],
      data: t.projects.farmHouse,
      iosUrl: 'https://apps.apple.com/jo/app/wear-and-share/id6740463663',
      androidUrl: 'https://play.google.com/store/apps/details?id=com.mycompany.restyle&hl=en'
    },
    {
      key: 'letsPlay',
      image: '/company-logos/lets-play.webp',
      categories: ['mobile'] as ProjectCategory[],
      data: t.projects.letsPlay,
      iosUrl: 'https://apps.apple.com/app/id6670760296',
      androidUrl: 'https://play.google.com/store/apps/details?id=com.mycompany.letsplaytogetherr&pcampaignid=web_share'
    },
    {
      key: 'nayNursery',
      image: '/company-logos/nay-nursery.webp',
      categories: ['mobile', 'web', 'ai'] as ProjectCategory[],
      data: t.projects.nayNursery,
      iosUrl: 'https://apps.apple.com/jo/app/nay-nursery/id6670321985',
      androidUrl: 'https://play.google.com/store/apps/details?id=com.mycompany.naynursery&hl=en'
    },
    {
      key: 'wearShare',
      image: '/company-logos/wear-share.webp',
      categories: ['mobile', 'ai'] as ProjectCategory[],
      data: t.projects.wearShare,
      iosUrl: 'https://apps.apple.com/jo/app/wear-and-share/id6740463663',
      androidUrl: 'https://play.google.com/store/apps/details?id=com.mycompany.restyle&hl=en'
    },
    {
      key: 'skinverse',
      image: '/company-logos/skinverse.webp',
      categories: ['mobile', 'web', 'ai'] as ProjectCategory[],
      data: t.projects.skinverse,
      iosUrl: 'https://apps.apple.com/jo/app/skinverse/id6502641700',
      androidUrl: 'https://play.google.com/store/apps/details?id=com.mycompany.singlevendorapp&hl=en'
    }
  ], [t.projects]);
};

export default function Projects() {
  const { t, dir } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const projects = useProjects(t);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Mouse drag scrolling state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startScrollPosition, setStartScrollPosition] = useState(0);
  
  // Memoize the filtered projects
  const filteredProjects = React.useMemo(() => {
    return activeCategory === 'all' 
      ? projects 
      : projects.filter(project => project.categories.includes(activeCategory));
  }, [projects, activeCategory]);

  // Reset active index when filtered projects change
  useEffect(() => {
    setActiveIndex(0);
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = 0;
    }
  }, [filteredProjects]);

  // Update active index when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current && !isDragging) {
        const scrollPosition = carouselRef.current.scrollLeft;
        const itemWidth = carouselRef.current.clientWidth;
        const newIndex = Math.round(scrollPosition / itemWidth);
        if (newIndex !== activeIndex && newIndex >= 0 && newIndex < filteredProjects.length) {
          setActiveIndex(newIndex);
        }
      }
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', handleScroll);
      return () => carousel.removeEventListener('scroll', handleScroll);
    }
  }, [activeIndex, filteredProjects.length, isDragging]);

  const categories = [
    { id: 'all' as ProjectCategory, label: t.projects.categories.all },
    { id: 'web' as ProjectCategory, label: t.projects.categories.web },
    { id: 'mobile' as ProjectCategory, label: t.projects.categories.mobile },
    { id: 'ai' as ProjectCategory, label: t.projects.categories.ai }
  ];

  // Scroll functions for the carousel
  const scrollToPrev = () => {
    if (carouselRef.current) {
      const newIndex = Math.max(0, activeIndex - 1);
      const slideWidth = carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({ 
        left: slideWidth * newIndex, 
        behavior: 'smooth' 
      });
      setActiveIndex(newIndex);
    }
  };

  const scrollToNext = () => {
    if (carouselRef.current) {
      const newIndex = Math.min(filteredProjects.length - 1, activeIndex + 1);
      const slideWidth = carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({ 
        left: slideWidth * newIndex, 
        behavior: 'smooth' 
      });
      setActiveIndex(newIndex);
    }
  };
  
  // Mouse drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (carouselRef.current) {
      setIsDragging(true);
      setStartX(e.pageX - carouselRef.current.offsetLeft);
      setStartScrollPosition(carouselRef.current.scrollLeft);
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Adjust the multiplier for speed sensitivity
    carouselRef.current.scrollLeft = startScrollPosition - walk;
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    // Snap to nearest slide after dragging ends
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.offsetWidth;
      const newIndex = Math.round(carouselRef.current.scrollLeft / slideWidth);
      carouselRef.current.scrollTo({
        left: slideWidth * newIndex,
        behavior: 'smooth'
      });
      setActiveIndex(newIndex);
    }
  };
  
  const handleDotClick = (index: number) => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({
        left: slideWidth * index,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-gray-50 section-transition">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center max-w-3xl mx-auto mb-8 sm:mb-10 ${dir === 'rtl' ? 'rtl' : ''}`}>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-blue-800">
            {t.projects.title}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {t.projects.subtitle}
          </p>
        </div>

        <div className={`flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-10 ${dir === 'rtl' ? 'space-x-reverse' : ''}`}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full text-sm sm:text-base transition-all duration-300 font-medium
                ${activeCategory === category.id
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-100 hover:shadow'
                }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="relative">
          {/* Carousel navigation buttons */}
          {filteredProjects.length > 1 && (
            <button 
              onClick={scrollToPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-100 focus:outline-none"
              aria-label="Scroll left"
              style={{ 
                opacity: activeIndex === 0 ? 0.5 : 1,
                cursor: activeIndex === 0 ? 'default' : 'pointer'
              }}
              disabled={activeIndex === 0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          {/* Carousel container with mouse drag functionality */}
          <div 
            ref={carouselRef}
            className={`flex overflow-x-auto gap-6 py-4 px-8 snap-x snap-mandatory hide-scrollbar ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <style jsx>{`
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            {filteredProjects.map((project) => (
              <div
                key={project.key}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 flex-shrink-0 snap-start scroll-ml-4"
                style={{ width: 'min(100%, 350px)' }}
              >
                <div className="p-6 flex flex-col items-center">
                  {/* Circular Image with Gradient Border */}
                  <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden group-hover:scale-105 transition-transform duration-500 
                              shadow-lg border-4 border-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 p-[3px]">
                    <div className="absolute inset-0 rounded-full overflow-hidden bg-white">
                      <ImageWithFallback
                        src={project.image.replace(/\.(png|jpg|jpeg|svg)$/, '.webp')}
                        fallbackSrc={project.image}
                        alt={project.data.title}
                        fill
                        className="object-cover rounded-full p-1"
                        sizes="(max-width: 640px) 160px, 160px"
                      />
                    </div>
                    
                    {/* Subtle glow effect on hover */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500"></div>
                  </div>
                  
                  <div className={`text-center w-full`}>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {project.data.title}
                    </h3>
                    
                    {/* Category Badges - Multiple categories displayed as badges */}
                    <div className="flex flex-wrap justify-center gap-1 mb-3">
                      {project.categories.map((category, index) => (
                        <span key={index} className={`text-xs px-2 py-1 ${
                          category === 'web' ? 'bg-blue-100 text-blue-700' :
                          category === 'mobile' ? 'bg-green-100 text-green-700' :
                          'bg-purple-100 text-purple-700'
                        } rounded-full font-medium`}>
                          {category === 'web' ? t.projects.categories.web :
                          category === 'mobile' ? t.projects.categories.mobile :
                          category === 'ai' ? t.projects.categories.ai : ''}
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {project.data.description}
                    </p>
                    
                    {/* App Store Links with improved spacing */}
                    <AppStoreLinks 
                      iosUrl={project.iosUrl} 
                      androidUrl={project.androidUrl}
                      className="mt-2" 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Right scroll button */}
          {filteredProjects.length > 1 && (
            <button 
              onClick={scrollToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-100 focus:outline-none"
              aria-label="Scroll right"
              style={{ 
                opacity: activeIndex === filteredProjects.length - 1 ? 0.5 : 1,
                cursor: activeIndex === filteredProjects.length - 1 ? 'default' : 'pointer'
              }}
              disabled={activeIndex === filteredProjects.length - 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Improved pagination dots */}
        {filteredProjects.length > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {filteredProjects.map((_, index) => (
              <button 
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === index 
                    ? 'bg-blue-600 scale-125'
                    : 'bg-gray-300 hover:bg-blue-400'
                }`}
                onClick={() => handleDotClick(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={activeIndex === index ? 'true' : 'false'}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 