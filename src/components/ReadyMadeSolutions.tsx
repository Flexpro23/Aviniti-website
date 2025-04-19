'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import ImageWithFallback from './utils/ImageWithFallback';
import { useRef, useState, useEffect } from 'react';

interface ReadyMadeSolutionsProps {
  onContactClick: (solutionTitle: string) => void;
}

// Define a type for the solution objects
interface Solution {
  id: string;
  image: string;
}

// Define types for the translations
interface SolutionTranslation {
  title: string;
  price: string;
  description: string;
  features: string[];
}

interface ReadyMadeSolutionsTranslation {
  title: string;
  subtitle: string;
  days: string;
  getStarted: string;
  keyFeatures: string;
  solutions: {
    [key: string]: SolutionTranslation;
  };
}

// List of solutions that have webp versions available
const hasWebpVersion = [
  'Kindergarten Management App Solution',
  'Hypermarket Management App Solution',
  'Office Management App Solutions',
  'Airbnb-Style Marketplace App Solutions'
];

// Fallback translations in case the translations are not available
const fallbackTranslations: ReadyMadeSolutionsTranslation = {
  title: 'Ready-Made App Solutions',
  subtitle: 'Launch your digital product faster with our pre-built, customizable app solutions. Save time and money while still getting a high-quality product tailored to your needs.',
  days: 'days',
  getStarted: 'Get Started',
  keyFeatures: 'Key Features',
  solutions: {
    delivery: {
      title: 'Delivery App Solution',
      price: '$10,000',
      description: 'A complete delivery application solution with user, driver, and restaurant/store admin panels. Includes real-time tracking, payment processing, and order management.',
      features: ['User & Driver Apps', 'Admin Dashboard', 'Real-time Tracking', 'Multiple Payment Methods', 'Rating System']
    },
    kindergarten: {
      title: 'Kindergarten Management App Solution',
      price: '$8,000',
      description: 'Comprehensive kindergarten management system for administrators, teachers, and parents. Track attendance, activities, progress reports and facilitate seamless communication.',
      features: ['Parent & Teacher Portals', 'Attendance Tracking', 'Activity Management', 'Progress Reports', 'Communication Tools']
    },
    hypermarket: {
      title: 'Hypermarket Management App Solution',
      price: '$15,000',
      description: 'Advanced hypermarket management solution for inventory tracking, POS integration, customer management, and analytics. Streamline operations and improve customer experience.',
      features: ['Inventory Management', 'POS Integration', 'Customer Management', 'Analytics Dashboard', 'Multi-branch Support']
    },
    office: {
      title: 'Office Management App Solutions',
      price: '$8,000',
      description: 'Office management solution that handles task management, attendance, document sharing, and collaboration. Increase productivity and streamline office operations.',
      features: ['Task Management', 'Attendance System', 'Document Sharing', 'Team Collaboration', 'Meeting Scheduler']
    },
    gym: {
      title: 'Gym Management App Solutions',
      price: '$25,000',
      description: 'Complete gym management solution for membership, class scheduling, trainer management, payment processing, and fitness tracking. Create exceptional member experience with a modern digital platform.',
      features: ['Membership Management', 'Class Scheduling', 'Trainer Management', 'Payment Processing', 'Workout Tracking']
    },
    airbnb: {
      title: 'Airbnb-Style Marketplace App Solutions',
      price: '$15,000',
      description: 'Property rental marketplace platform similar to Airbnb. Connects hosts with travelers, includes booking system, payment processing, review, and secure payment processing.',
      features: ['User & Host Portals', 'Booking System', 'Search & Filters', 'Review System', 'Secure Payment']
    }
  }
};

export default function ReadyMadeSolutions({ onContactClick }: ReadyMadeSolutionsProps) {
  const { t } = useLanguage();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Mouse drag scrolling state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startScrollPosition, setStartScrollPosition] = useState(0);
  
  // Access translations with type assertion and fallback
  const translations = t as any;
  
  // First try to get translations from services.readyMadeSolutions, if not available use fallback
  const readyMadeSolutionsT = translations.services?.readyMadeSolutions as ReadyMadeSolutionsTranslation || fallbackTranslations;
  
  // Ensure the title is translated - if services.readyMadeSolutions.title doesn't exist, use navigation.readyMadeSolutions as fallback
  const sectionTitle = readyMadeSolutionsT.title || translations.navigation?.readyMadeSolutions || fallbackTranslations.title;
  
  // Pre-made app solutions data
  const solutions: Solution[] = [
    {
      id: 'delivery',
      image: '/Ready-made-solutions/Delivery App Solution.svg'
    },
    {
      id: 'kindergarten',
      image: '/Ready-made-solutions/Kindergarten Management App Solution.svg'
    },
    {
      id: 'hypermarket',
      image: '/Ready-made-solutions/Hypermarket Management App Solution.svg'
    },
    {
      id: 'office',
      image: '/Ready-made-solutions/Office Management App Solutions.svg'
    },
    {
      id: 'gym',
      image: '/Ready-made-solutions/Gym Management App Solutions.svg'
    },
    {
      id: 'airbnb',
      image: '/Ready-made-solutions/Airbnb-Style Marketplace App Solutions.svg'
    }
  ];

  // Update active index when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current && !isDragging) {
        const scrollPosition = carouselRef.current.scrollLeft;
        const itemWidth = carouselRef.current.clientWidth;
        const newIndex = Math.round(scrollPosition / itemWidth);
        if (newIndex !== activeIndex && newIndex >= 0 && newIndex < solutions.length) {
          setActiveIndex(newIndex);
        }
      }
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', handleScroll);
      return () => carousel.removeEventListener('scroll', handleScroll);
    }
  }, [activeIndex, solutions.length, isDragging]);

  // Function to determine if we should try webp or use original format
  const getImageSrc = (solution: Solution): string => {
    // Check if this solution has a webp version available
    const solutionData = readyMadeSolutionsT.solutions[solution.id] || fallbackTranslations.solutions[solution.id];
    const title = solutionData.title;
    if (hasWebpVersion.includes(title)) {
      return solution.image.replace(/\.(png|jpg|jpeg|svg)$/, '.webp');
    }
    // Otherwise use the original format
    return solution.image;
  };

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
      const newIndex = Math.min(solutions.length - 1, activeIndex + 1);
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
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{sectionTitle}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {readyMadeSolutionsT.subtitle}
          </p>
        </div>
        
        <div className="relative">
          {/* Carousel navigation buttons */}
          {solutions.length > 1 && (
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
            
            {solutions.map((solution) => {
              const solutionData = readyMadeSolutionsT.solutions[solution.id] || fallbackTranslations.solutions[solution.id];
              return (
                <div 
                  key={solution.id} 
                  className="bg-white rounded-lg shadow-lg overflow-hidden flex-shrink-0 snap-start scroll-ml-4"
                  style={{ width: 'min(100%, 350px)' }}
                >
                  <div className="relative h-48">
                    <ImageWithFallback
                      src={getImageSrc(solution)}
                      fallbackSrc={solution.image}
                      alt={solutionData.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{solutionData.title}</h3>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-blue-600">{solutionData.price}</span>
                      <span className="text-gray-500">{readyMadeSolutionsT.days} {solution.id === 'gym' ? 60 : 35}</span>
                    </div>
                    <p className="text-gray-600 mb-6 line-clamp-3">{solutionData.description}</p>
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{readyMadeSolutionsT.keyFeatures}:</h4>
                      <ul className="space-y-1">
                        {solutionData.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-center text-gray-700">
                            <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                            <span className="line-clamp-1">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button 
                      onClick={() => onContactClick(solutionData.title)}
                      className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                      {readyMadeSolutionsT.getStarted}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Right scroll button */}
          {solutions.length > 1 && (
            <button 
              onClick={scrollToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-100 focus:outline-none"
              aria-label="Scroll right"
              style={{ 
                opacity: activeIndex === solutions.length - 1 ? 0.5 : 1,
                cursor: activeIndex === solutions.length - 1 ? 'default' : 'pointer'
              }}
              disabled={activeIndex === solutions.length - 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Improved pagination dots */}
        {solutions.length > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {solutions.map((_, index) => (
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