'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import ImageWithFallback from './utils/ImageWithFallback';

interface ReadyMadeSolutionsProps {
  onContactClick: () => void;
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

export default function ReadyMadeSolutions({ onContactClick }: ReadyMadeSolutionsProps) {
  const { t } = useLanguage();
  
  // Access translations with type assertion
  const translations = t as any;
  const readyMadeSolutionsT = translations.readyMadeSolutions as ReadyMadeSolutionsTranslation;
  
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

  // Function to determine if we should try webp or use original format
  const getImageSrc = (solution: Solution): string => {
    // Check if this solution has a webp version available
    const title = readyMadeSolutionsT.solutions[solution.id].title;
    if (hasWebpVersion.includes(title)) {
      return solution.image.replace(/\.(png|jpg|jpeg|svg)$/, '.webp');
    }
    // Otherwise use the original format
    return solution.image;
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{readyMadeSolutionsT.title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {readyMadeSolutionsT.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution) => {
            const solutionData = readyMadeSolutionsT.solutions[solution.id];
            return (
              <div key={solution.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                <div className="relative h-48">
                  <ImageWithFallback
                    src={getImageSrc(solution)}
                    fallbackSrc={solution.image}
                    alt={solutionData.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-bold mb-2">{solutionData.title}</h3>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-blue-600">{solutionData.price}</span>
                    <span className="text-gray-500">{readyMadeSolutionsT.days} {solution.id === 'gym' ? 60 : 35}</span>
                  </div>
                  <p className="text-gray-600 mb-6">{solutionData.description}</p>
                </div>
                <div className="px-6 pb-6">
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{readyMadeSolutionsT.keyFeatures}:</h4>
                    <ul className="space-y-1">
                      {solutionData.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button 
                    onClick={onContactClick}
                    className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300"
                  >
                    {readyMadeSolutionsT.getStarted}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
} 