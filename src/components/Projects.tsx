'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import Image from 'next/image';
import { useState } from 'react';
import AppStoreLinks from './AppStoreLinks';
import ImageWithFallback from './utils/ImageWithFallback';

type ProjectCategory = 'all' | 'web' | 'mobile' | 'ai';

export default function Projects() {
  const { t, dir } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');

  const projects = [
    {
      key: 'flexPro',
      image: '/company-logos/flex-pro.png',
      categories: ['mobile', 'web'] as ProjectCategory[],
      data: t.projects.flexPro,
      iosUrl: 'https://apps.apple.com/jo/app/flex-pro-drive/id6471506551',
      androidUrl: 'https://play.google.com/store/apps/details?id=com.mycompany.flexdrive&hl=en'
    },
    {
      key: 'secretary',
      image: '/company-logos/secrtary.png',
      categories: ['mobile'] as ProjectCategory[],
      data: t.projects.secretary,
      iosUrl: 'https://apps.apple.com/jo/app/secrtary/id6481658380',
      androidUrl: 'https://play.google.com/store/apps/details?id=com.mycompany.secrtary&hl=en'
    },
    {
      key: 'farmHouse',
      image: '/company-logos/farm-house.png',
      categories: ['mobile', 'web'] as ProjectCategory[],
      data: t.projects.farmHouse,
      iosUrl: 'https://apps.apple.com/jo/app/wear-and-share/id6740463663',
      androidUrl: 'https://play.google.com/store/apps/details?id=com.mycompany.restyle&hl=en'
    },
    {
      key: 'letsPlay',
      image: '/company-logos/lets-play.png',
      categories: ['mobile'] as ProjectCategory[],
      data: t.projects.letsPlay,
      iosUrl: 'https://apps.apple.com/app/id6670760296',
      androidUrl: 'https://play.google.com/store/apps/details?id=com.mycompany.letsplaytogetherr&pcampaignid=web_share'
    },
    {
      key: 'nayNursery',
      image: '/company-logos/nay-nursery.png',
      categories: ['mobile', 'web', 'ai'] as ProjectCategory[],
      data: t.projects.nayNursery,
      iosUrl: 'https://apps.apple.com/jo/app/nay-nursery/id6670321985',
      androidUrl: 'https://play.google.com/store/apps/details?id=com.mycompany.naynursery&hl=en'
    },
    {
      key: 'wearShare',
      image: '/company-logos/wear-share.png',
      categories: ['mobile', 'ai'] as ProjectCategory[],
      data: t.projects.wearShare,
      iosUrl: 'https://apps.apple.com/jo/app/wear-and-share/id6740463663',
      androidUrl: 'https://play.google.com/store/apps/details?id=com.mycompany.restyle&hl=en'
    },
    {
      key: 'skinverse',
      image: '/company-logos/skinverse.png',
      categories: ['mobile', 'web', 'ai'] as ProjectCategory[],
      data: t.projects.skinverse,
      iosUrl: 'https://apps.apple.com/jo/app/skinverse/id6502641700',
      androidUrl: 'https://play.google.com/store/apps/details?id=com.mycompany.singlevendorapp&hl=en'
    }
  ];

  const categories = [
    { id: 'all' as ProjectCategory, label: t.projects.categories.all },
    { id: 'web' as ProjectCategory, label: t.projects.categories.web },
    { id: 'mobile' as ProjectCategory, label: t.projects.categories.mobile },
    { id: 'ai' as ProjectCategory, label: t.projects.categories.ai }
  ];

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(project => project.categories.includes(activeCategory));

  return (
    <section className="py-16 sm:py-20 bg-gray-50 section-transition">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center max-w-3xl mx-auto mb-12 sm:mb-16 ${dir === 'rtl' ? 'rtl' : ''}`}>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-blue-800">
            {t.projects.title}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {t.projects.subtitle}
          </p>
        </div>

        <div className={`flex flex-wrap justify-center gap-2 sm:gap-4 mb-12 sm:mb-16 ${dir === 'rtl' ? 'space-x-reverse' : ''}`}>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          {filteredProjects.map((project) => (
            <div
              key={project.key}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
            >
              <div className="p-8 flex flex-col items-center">
                {/* Circular Image with Gradient Border */}
                <div className="relative w-40 h-40 mb-6 rounded-full overflow-hidden group-hover:scale-105 transition-transform duration-500 
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
                
                <div className={`text-center ${dir === 'rtl' ? 'text-right' : ''} w-full`}>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                    {project.data.title}
                  </h3>
                  
                  {/* Category Badges - Multiple categories displayed as badges */}
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {project.categories.map((category, index) => (
                      <span key={index} className={`text-xs sm:text-sm px-3 py-1 ${
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
                  
                  <p className="text-sm sm:text-base text-gray-600 mb-6 line-clamp-3">
                    {project.data.description}
                  </p>
                  
                  {/* App Store Links with improved spacing */}
                  <AppStoreLinks 
                    iosUrl={project.iosUrl} 
                    androidUrl={project.androidUrl}
                    className="mt-4" 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 