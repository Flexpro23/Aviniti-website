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
    },
    {
      key: 'hairVisionPro',
      image: '/HairVision.png',
      categories: ['mobile', 'web', 'ai'] as ProjectCategory[],
      data: t.projects.hairVisionPro,
      iosUrl: '#',
      androidUrl: '#'
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

  // Categories with their labels
  const categories = React.useMemo(() => [
    { id: 'all' as ProjectCategory, label: t.projects.categories.all },
    { id: 'web' as ProjectCategory, label: t.projects.categories.web },
    { id: 'mobile' as ProjectCategory, label: t.projects.categories.mobile },
    { id: 'ai' as ProjectCategory, label: t.projects.categories.ai }
  ], [t.projects.categories]);

  // Scroll functions
  const scrollToNext = () => {
    if (carouselRef.current) {
      const cardWidth = 320; // Width of each card plus gap
      const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
      const currentScroll = carouselRef.current.scrollLeft;
      const nextScroll = Math.min(currentScroll + cardWidth, maxScroll);
      carouselRef.current.scrollTo({ left: nextScroll, behavior: 'smooth' });
    }
  };

  const scrollToPrev = () => {
    if (carouselRef.current) {
      const cardWidth = 320;
      const currentScroll = carouselRef.current.scrollLeft;
      const prevScroll = Math.max(currentScroll - cardWidth, 0);
      carouselRef.current.scrollTo({ left: prevScroll, behavior: 'smooth' });
    }
  };

  // Mouse drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setStartScrollPosition(carouselRef.current.scrollLeft);
    carouselRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = startScrollPosition - walk;
  };

  const handleMouseUp = () => {
    if (!carouselRef.current) return;
    setIsDragging(false);
    carouselRef.current.style.cursor = 'grab';
  };

  const handleMouseLeave = () => {
    if (!carouselRef.current) return;
    setIsDragging(false);
    carouselRef.current.style.cursor = 'grab';
  };

  return (
    <section className="py-12 sm:py-16 bg-off-white section-transition">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center max-w-3xl mx-auto mb-8 sm:mb-10 ${dir === 'rtl' ? 'rtl' : ''}`}>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-slate-blue-600">
            {t.projects.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-blue-500">
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
                  ? 'bg-gradient-to-r from-bronze-500 to-bronze-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-slate-blue-600 hover:bg-slate-blue-50 hover:shadow border border-slate-blue-100'
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
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-slate-blue-50 transition-colors border border-slate-blue-100"
              aria-label="Previous project"
            >
              <svg className="w-6 h-6 text-slate-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Projects carousel */}
          <div 
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 cursor-grab"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            {filteredProjects.map((project) => (
              <div
                key={project.key}
                className="flex-none w-[85vw] sm:w-80 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 snap-center group border border-slate-blue-100"
              >

                <div className="p-6 flex flex-col items-center">
                  {/* Circular Image with Gradient Border */}
                  <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden group-hover:scale-105 transition-transform duration-500 shadow-lg border-4 border-transparent bg-gradient-to-r from-bronze-400 via-bronze-500 to-bronze-600 p-[3px]">
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
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-bronze-400 via-bronze-500 to-bronze-600 opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300"></div>
                  </div>
                  
                  <div className={`text-center w-full`}>
                    <h3 className="text-xl font-semibold text-slate-blue-600 mb-2">
                      {project.data.title}
                    </h3>
                    
                    {/* Category Badges - Multiple categories displayed as badges */}
                    <div className="flex flex-wrap justify-center gap-1 mb-3">
                      {project.categories.map((category, index) => (
                        <span key={index} className={`text-xs px-2 py-1 ${
                          category === 'web' ? 'bg-slate-blue-100 text-slate-blue-700' :
                          category === 'mobile' ? 'bg-bronze-100 text-bronze-700' :
                          'bg-slate-blue-50 text-slate-blue-600'
                        } rounded-full font-medium`}>
                          {category === 'web' ? t.projects.categories.web :
                          category === 'mobile' ? t.projects.categories.mobile :
                          category === 'ai' ? t.projects.categories.ai : ''}
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-sm text-slate-blue-400 mb-4 line-clamp-3">
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
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-slate-blue-50 transition-colors border border-slate-blue-100"
              aria-label="Next project"
            >
              <svg className="w-6 h-6 text-slate-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </section>
  );
} 