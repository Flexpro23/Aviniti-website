'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import Image from 'next/image';
import { useState } from 'react';
import AppStoreLinks from './AppStoreLinks';

type ProjectCategory = 'all' | 'web' | 'mobile' | 'ai';

export default function Projects() {
  const { t, dir } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');

  const projects = [
    {
      key: 'flexPro',
      image: '/company-logos/flex-pro.png',
      category: 'web' as ProjectCategory,
      data: t.projects.flexPro,
      iosUrl: 'https://apps.apple.com/jo/app/flex-pro-drive/id6471506551',
      androidUrl: 'https://play.google.com/store/apps/details?id=com.mycompany.flexdrive&hl=en'
    },
    {
      key: 'secretary',
      image: '/company-logos/secrtary.png',
      category: 'ai' as ProjectCategory,
      data: t.projects.secretary,
      iosUrl: 'https://apps.apple.com/jo/app/secrtary/id6481658380',
      androidUrl: 'https://play.google.com/store/apps/details?id=com.mycompany.secrtary&hl=en'
    },
    {
      key: 'farmHouse',
      image: '/company-logos/farm-house.png',
      category: 'mobile' as ProjectCategory,
      data: t.projects.farmHouse,
      iosUrl: 'https://apps.apple.com/jo/app/wear-and-share/id6740463663',
      androidUrl: 'https://play.google.com/store/apps/details?id=com.mycompany.restyle&hl=en'
    },
    {
      key: 'letsPlay',
      image: '/company-logos/lets-play.png',
      category: 'web' as ProjectCategory,
      data: t.projects.letsPlay,
      iosUrl: 'https://apps.apple.com/app/id6670760296',
      androidUrl: 'https://play.google.com/store/apps/details?id=com.mycompany.letsplaytogetherr&pcampaignid=web_share'
    },
    {
      key: 'nayNursery',
      image: '/company-logos/nay-nursery.png',
      category: 'web' as ProjectCategory,
      data: t.projects.nayNursery,
      iosUrl: 'https://apps.apple.com/jo/app/nay-nursery/id6670321985',
      androidUrl: 'https://play.google.com/store/apps/details?id=com.mycompany.naynursery&hl=en'
    },
    {
      key: 'wearShare',
      image: '/company-logos/wear-share.png',
      category: 'mobile' as ProjectCategory,
      data: t.projects.wearShare,
      iosUrl: 'https://apps.apple.com/jo/app/wear-and-share/id6740463663',
      androidUrl: 'https://play.google.com/store/apps/details?id=com.mycompany.restyle&hl=en'
    },
    {
      key: 'skinverse',
      image: '/company-logos/skinverse.png',
      category: 'ai' as ProjectCategory,
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
    : projects.filter(project => project.category === activeCategory);

  return (
    <section className="py-16 sm:py-20 bg-gray-50 section-transition">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center max-w-3xl mx-auto mb-12 sm:mb-16 ${dir === 'rtl' ? 'rtl' : ''}`}>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            {t.projects.title}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {t.projects.subtitle}
          </p>
        </div>

        <div className={`flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 ${dir === 'rtl' ? 'space-x-reverse' : ''}`}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm sm:text-base transition-all duration-300
                ${activeCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.key}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48 sm:h-56 lg:h-64">
                <Image
                  src={project.image}
                  alt={project.data.title}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className={`p-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  {project.data.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  {project.data.description}
                </p>
                <div className="flex flex-col gap-4">
                  <div className={`flex items-center ${dir === 'rtl' ? 'justify-start' : 'justify-end'}`}>
                    <span className="text-xs sm:text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {project.category === 'web' ? t.projects.categories.web :
                      project.category === 'mobile' ? t.projects.categories.mobile :
                      project.category === 'ai' ? t.projects.categories.ai : ''}
                    </span>
                  </div>
                  
                  {/* App Store Links */}
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