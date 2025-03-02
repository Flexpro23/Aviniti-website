'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import ImageWithFallback from './utils/ImageWithFallback';

interface ReadyMadeSolutionsProps {
  onContactClick: () => void;
}

// Define a type for the solution objects
interface Solution {
  title: string;
  price: string;
  days: number;
  description: string;
  image: string;
  features: string[];
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
  
  // Pre-made app solutions data
  const solutions: Solution[] = [
    {
      title: 'Delivery App Solution',
      price: '$10,000',
      days: 35,
      description: 'A complete delivery application solution with user, driver, and restaurant/store admin panels. Includes real-time tracking, payment processing, and order management.',
      image: '/Ready-made-solutions/Delivery App Solution.svg',
      features: ['User & Driver Apps', 'Admin Dashboard', 'Real-time Tracking', 'Multiple Payment Methods', 'Rating System']
    },
    {
      title: 'Kindergarten Management App Solution',
      price: '$8,000',
      days: 35,
      description: 'Comprehensive kindergarten management system for administrators, teachers, and parents. Track attendance, activities, progress reports and facilitate seamless communication.',
      image: '/Ready-made-solutions/Kindergarten Management App Solution.svg',
      features: ['Parent & Teacher Portals', 'Attendance Tracking', 'Activity Management', 'Progress Reports', 'Communication Tools']
    },
    {
      title: 'Hypermarket Management App Solution',
      price: '$15,000',
      days: 35,
      description: 'Advanced hypermarket management solution for inventory tracking, POS integration, customer management, and analytics. Streamline operations and improve customer experience.',
      image: '/Ready-made-solutions/Hypermarket Management App Solution.svg',
      features: ['Inventory Management', 'POS Integration', 'Customer Management', 'Analytics Dashboard', 'Multi-branch Support']
    },
    {
      title: 'Office Management App Solutions',
      price: '$8,000',
      days: 20,
      description: 'Office management solution that handles task management, attendance, document sharing, and collaboration. Increase productivity and streamline office operations.',
      image: '/Ready-made-solutions/Office Management App Solutions.svg',
      features: ['Task Management', 'Attendance System', 'Document Sharing', 'Team Collaboration', 'Meeting Scheduler']
    },
    {
      title: 'Gym Management App Solutions',
      price: '$25,000',
      days: 60,
      description: 'Complete gym management solution for membership, class scheduling, trainer management, payment processing, and fitness tracking. Create exceptional member experience with a modern digital platform.',
      image: '/Ready-made-solutions/Gym Management App Solutions.svg',
      features: ['Membership Management', 'Class Scheduling', 'Trainer Management', 'Payment Processing', 'Workout Tracking']
    },
    {
      title: 'Airbnb-Style Marketplace App Solutions',
      price: '$15,000',
      days: 35,
      description: 'Property rental marketplace platform similar to Airbnb. Connects hosts with travelers, includes booking system, payment processing, review, and secure payment processing.',
      image: '/Ready-made-solutions/Airbnb-Style Marketplace App Solutions.svg',
      features: ['User & Host Portals', 'Booking System', 'Search & Filters', 'Review System', 'Secure Payment']
    },
  ];

  // Function to determine if we should try webp or use original format
  const getImageSrc = (solution: Solution): string => {
    // Check if this solution has a webp version available
    if (hasWebpVersion.includes(solution.title)) {
      return solution.image.replace(/\.(png|jpg|jpeg|svg)$/, '.webp');
    }
    // Otherwise use the original format
    return solution.image;
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready-Made App Solutions</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Launch your digital product faster with our pre-built, customizable app solutions.
            Save time and money while still getting a high-quality product tailored to your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full"
            >
              <div className="relative h-52 w-full bg-white">
                <ImageWithFallback
                  src={getImageSrc(solution)}
                  fallbackSrc={solution.image}
                  alt={solution.title}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{solution.title}</h3>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-blue-600">{solution.price}</span>
                  <span className="text-gray-600 text-sm">
                    {solution.days} days
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{solution.description}</p>
                <div className="mt-auto">
                  <h4 className="font-medium text-gray-900 mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {solution.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={onContactClick}
                  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 