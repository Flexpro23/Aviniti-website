'use client';
import { useState } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactPopup from '@/components/ContactPopup';
import FloatingContact from '@/components/FloatingContact';
import Link from 'next/link';

export default function BlogClient() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const { t, dir } = useLanguage();
  
  // Function to open contact popup with specific subject
  const openContactWithSubject = (subject: string) => {
    setContactSubject(subject);
    setIsContactOpen(true);
  };
  
  const blogPostsData = [
    {
      id: 'ai-app-development-cost-guide',
      data: t.blog?.posts?.costGuide
    },
    {
      id: 'ai-integration-legacy-systems',
      data: t.blog?.posts?.integration
    },
    {
      id: 'mobile-app-development-trends',
      data: t.blog?.posts?.trends
    }
  ];

  const blogPosts = blogPostsData.map(item => {
    const postData = item.data;
    let categoryKey: 'development' | 'integration' | 'trends' = 'development'; // Default
    if (item.id === 'ai-integration-legacy-systems') categoryKey = 'integration';
    else if (item.id === 'mobile-app-development-trends') categoryKey = 'trends';
    
    return {
      id: item.id,
      title: postData?.title || item.id.replace(/-/g, ' '),
      excerpt: postData?.excerpt || 'Excerpt unavailable.',
      date: postData?.date || 'Date unavailable',
      category: t.blog?.categories?.[categoryKey] || categoryKey,
      readTime: `${postData?.readTimeValue || 5} ${t.blog?.readTimeUnit || 'min read'}` // Use readTimeValue
    };
  });

  return (
    <main dir={dir} className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-4">{t.blog?.title || 'Aviniti Blog'}</h1>
        <p className="text-lg text-center mb-16 max-w-3xl mx-auto">
          {t.blog?.subtitle || 'Insights, guides, and expert perspectives on AI, app development, and digital transformation.'}
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link href={`/blog/${post.id}`} key={post.id}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-blue-700">{post.category}</span>
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-semibold mb-3">{post.title}</h2>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{post.date}</span>
                    <span className="text-blue-700 font-medium">{t.blog?.readMore || 'Read more'} →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">{t.blog?.cta?.title || 'Want to discuss your project?'}</h2>
          <p className="mb-6">{t.blog?.cta?.description || 'Our team of experts is ready to help you transform your ideas into reality.'}</p>
          <button 
            onClick={() => openContactWithSubject('Project Discussion from Blog')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300"
          >
            {t.contact?.cta || 'Contact Us'}
          </button>
        </div>
      </div>
      
      <Footer />
      
      <FloatingContact onContactClick={() => openContactWithSubject('Blog Page Inquiry')} />
      
      <ContactPopup 
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        initialSubject={contactSubject}
      />
    </main>
  );
} 