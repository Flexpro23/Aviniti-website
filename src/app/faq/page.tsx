import { Metadata } from 'next';
import FAQClient from './FAQClient';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions About AI & App Development | Aviniti',
  description: 'Get answers to common questions about AI app development, custom software solutions, and mobile app development services provided by Aviniti.',
  keywords: 'AI app development FAQ, software development questions, mobile app cost, AI integration, custom software FAQ',
};

// Loading component with a nice skeleton UI
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Title skeleton */}
        <div className="w-3/4 h-8 bg-gray-200 rounded-lg mx-auto mb-8 animate-pulse"></div>
        {/* Subtitle skeleton */}
        <div className="w-2/3 h-4 bg-gray-200 rounded-lg mx-auto mb-16 animate-pulse"></div>
        
        {/* FAQ items skeleton */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-8">
            <div className="w-1/3 h-6 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
            {[1, 2].map((j) => (
              <div key={j} className="bg-white rounded-lg shadow-md p-6 mb-4">
                <div className="w-3/4 h-4 bg-gray-200 rounded mb-3 animate-pulse"></div>
                <div className="w-full h-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Wrap the page in a suspense boundary to ensure it renders after client-side hydration
export default function FAQPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <FAQClient />
    </Suspense>
  );
} 