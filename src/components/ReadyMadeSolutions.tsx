'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import Image from 'next/image';

interface ReadyMadeSolutionsProps {
  onContactClick: () => void;
}

export default function ReadyMadeSolutions({ onContactClick }: ReadyMadeSolutionsProps) {
  const { t } = useLanguage();
  
  // Pre-made app solutions data
  const solutions = [
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
      description: 'Complete gym management solution for membership, class scheduling, trainer management, and fitness tracking. Enhance member experience with a modern digital solution.',
      image: '/Ready-made-solutions/Gym Management App Solutions.svg',
      features: ['Membership Management', 'Class Scheduling', 'Trainer Allocation', 'Fitness Tracking', 'Payment Processing']
    },
    {
      title: 'Airbnb-Style Marketplace App Solutions',
      price: '$15,000',
      days: 35,
      description: 'Property rental marketplace platform similar to Airbnb with property listings, booking management, reviews, and secure payment processing.',
      image: '/Ready-made-solutions/Airbnb-Style Marketplace App Solutions.svg',
      features: ['Property Listings', 'Booking System', 'Review & Rating', 'Secure Payments', 'Host & Guest Apps']
    }
  ];

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
                <Image
                  src={solution.image.replace(/\.(png|jpg|jpeg|svg)$/, '.webp')}
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
                    <span className="font-medium">{solution.days}</span> days
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{solution.description}</p>
                <div className="border-t pt-4 mb-auto">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Features:</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1">
                    {solution.features.map((feature, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start">
                        <svg className="w-4 h-4 text-green-500 mr-1 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="p-6 pt-0">
                <button 
                  onClick={onContactClick}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300"
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