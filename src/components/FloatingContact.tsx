'use client';

import { useLanguage } from '@/lib/context/LanguageContext';

interface FloatingContactProps {
  onContactClick: () => void;
}

export default function FloatingContact({ onContactClick }: FloatingContactProps) {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-blue-600 py-2 px-4 sm:py-3 shadow-lg flex flex-wrap sm:flex-nowrap justify-center gap-3">
      <button
        onClick={onContactClick}
        className="flex items-center justify-center px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-white rounded-lg transition-colors duration-300 w-full sm:w-auto font-medium"
      >
        <svg 
          className="w-5 h-5 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
          />
        </svg>
        Contact Us Now
      </button>
      
      <a 
        href="tel:+962790685302"
        className="flex items-center justify-center px-6 py-3 bg-blue-800 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300 w-full sm:w-auto font-medium"
      >
        <svg 
          className="w-5 h-5 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
          />
        </svg>
        Call Us Directly
      </a>
    </div>
  );
} 