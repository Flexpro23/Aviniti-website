'use client';
import { useState } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactPopup from '@/components/ContactPopup';
import FloatingContact from '@/components/FloatingContact';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI & App Development Insights | Aviniti Blog',
  description: 'Explore the latest trends, insights, and best practices in AI app development, custom software solutions, and digital transformation.',
  keywords: 'AI app development blog, software development insights, mobile app trends, AI technology, digital transformation',
};

export default function BlogPage() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { dir } = useLanguage();
  
  const blogPosts = [
    {
      id: 'ai-app-development-cost-guide',
      title: 'The Complete Guide to AI App Development Costs in 2025',
      excerpt: 'Understand the factors that influence AI app development costs, from complexity and features to maintenance and scalability.',
      date: 'March 8, 2023',
      category: 'Development',
      readTime: '8 min read'
    },
    {
      id: 'ai-integration-legacy-systems',
      title: 'How to Successfully Integrate AI into Legacy Business Systems',
      excerpt: 'Learn practical strategies for incorporating AI capabilities into existing business systems without disrupting operations.',
      date: 'March 1, 2023',
      category: 'Integration',
      readTime: '6 min read'
    },
    {
      id: 'mobile-app-development-trends',
      title: '7 Mobile App Development Trends Reshaping User Experience in 2025',
      excerpt: 'Discover the latest trends in mobile app development that are creating more engaging and personalized user experiences.',
      date: 'February 22, 2023',
      category: 'Trends',
      readTime: '5 min read'
    }
  ];

  return (
    <main dir={dir} className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-4">Aviniti Blog</h1>
        <p className="text-lg text-center mb-16 max-w-3xl mx-auto">
          Insights, guides, and expert perspectives on AI, app development, and digital transformation.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link href={`/blog/${post.id}`} key={post.id}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-blue-600">{post.category}</span>
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-semibold mb-3">{post.title}</h2>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{post.date}</span>
                    <span className="text-blue-600 font-medium">Read more →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Want to discuss your project?</h2>
          <p className="mb-6">Our team of experts is ready to help you transform your ideas into reality.</p>
          <button 
            onClick={() => setIsContactOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300"
          >
            Contact Us
          </button>
        </div>
      </div>
      
      <Footer />
      
      <FloatingContact onContactClick={() => setIsContactOpen(true)} />
      
      <ContactPopup 
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </main>
  );
} 