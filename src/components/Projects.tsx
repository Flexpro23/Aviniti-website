'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import Image from 'next/image';
import { useState } from 'react';

type ProjectCategory = 'all' | 'web' | 'mobile' | 'ai';

export default function Projects() {
  const { t, dir } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');

  const projects = [
    {
      key: 'flexPro',
      image: 'https://placehold.co/600x400/e2e8f0/1e40af?text=Flex+Pro',
      category: 'web' as ProjectCategory,
      data: t.projects.flexPro
    },
    {
      key: 'secretary',
      image: 'https://placehold.co/600x400/e2e8f0/1e40af?text=Secretary',
      category: 'ai' as ProjectCategory,
      data: t.projects.secretary
    },
    {
      key: 'farmHouse',
      image: 'https://placehold.co/600x400/e2e8f0/1e40af?text=Farm+House',
      category: 'mobile' as ProjectCategory,
      data: t.projects.farmHouse
    },
    {
      key: 'letsPlay',
      image: 'https://placehold.co/600x400/e2e8f0/1e40af?text=Lets+Play',
      category: 'web' as ProjectCategory,
      data: t.projects.letsPlay
    },
    {
      key: 'nayNursery',
      image: 'https://placehold.co/600x400/e2e8f0/1e40af?text=Nay+Nursery',
      category: 'web' as ProjectCategory,
      data: t.projects.nayNursery
    },
    {
      key: 'wearShare',
      image: 'https://placehold.co/600x400/e2e8f0/1e40af?text=Wear+Share',
      category: 'mobile' as ProjectCategory,
      data: t.projects.wearShare
    },
    {
      key: 'skinverse',
      image: 'https://placehold.co/600x400/e2e8f0/1e40af?text=Skinverse',
      category: 'ai' as ProjectCategory,
      data: t.projects.skinverse
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
    <section className="py-16 sm:py-20 bg-gray-50">
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
                <div className={`flex items-center ${dir === 'rtl' ? 'justify-start' : 'justify-end'}`}>
                  <span className="text-xs sm:text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                    {project.category === 'web' ? t.projects.categories.web :
                     project.category === 'mobile' ? t.projects.categories.mobile :
                     project.category === 'ai' ? t.projects.categories.ai : ''}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 