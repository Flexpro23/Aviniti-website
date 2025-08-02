'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/lib/context/LanguageContext';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  slug: string;
}

export default function BlogPage() {
  const { t, dir } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'AI Integration in Legacy Systems: A Complete Guide',
      excerpt: 'Learn how to seamlessly integrate AI capabilities into existing legacy systems without disrupting your business operations.',
      content: 'Full article content would go here...',
      author: 'Aviniti Team',
      date: '2024-01-15',
      readTime: '8 min read',
      category: 'AI',
      tags: ['AI', 'Legacy Systems', 'Integration'],
      slug: 'ai-integration-legacy-systems'
    },
    {
      id: '2',
      title: 'Mobile App Development Trends for 2024',
      excerpt: 'Discover the latest trends in mobile app development that are shaping the industry and driving innovation.',
      content: 'Full article content would go here...',
      author: 'Aviniti Team',
      date: '2024-01-10',
      readTime: '6 min read',
      category: 'Mobile',
      tags: ['Mobile', 'Trends', 'Development'],
      slug: 'mobile-app-development-trends'
    },
    {
      id: '3',
      title: 'AI App Development Cost Guide: Everything You Need to Know',
      excerpt: 'A comprehensive breakdown of AI app development costs, factors that influence pricing, and how to budget effectively.',
      content: 'Full article content would go here...',
      author: 'Aviniti Team',
      date: '2024-01-05',
      readTime: '10 min read',
      category: 'AI',
      tags: ['AI', 'Costs', 'Planning'],
      slug: 'ai-app-development-cost-guide'
    },
    {
      id: '4',
      title: 'Building Scalable Web Applications with Modern Frameworks',
      excerpt: 'Best practices for building scalable web applications using Next.js, React, and other modern frameworks.',
      content: 'Full article content would go here...',
      author: 'Aviniti Team',
      date: '2023-12-28',
      readTime: '7 min read',
      category: 'Web',
      tags: ['Web', 'Scalability', 'Frameworks'],
      slug: 'scalable-web-applications'
    },
    {
      id: '5',
      title: 'The Future of AI in Business: Opportunities and Challenges',
      excerpt: 'Explore how AI is transforming businesses across industries and the challenges organizations face in adoption.',
      content: 'Full article content would go here...',
      author: 'Aviniti Team',
      date: '2023-12-20',
      readTime: '9 min read',
      category: 'AI',
      tags: ['AI', 'Business', 'Future'],
      slug: 'future-of-ai-in-business'
    },
    {
      id: '6',
      title: 'Essential Security Practices for Modern Applications',
      excerpt: 'Learn about critical security measures every modern application should implement to protect user data.',
      content: 'Full article content would go here...',
      author: 'Aviniti Team',
      date: '2023-12-15',
      readTime: '8 min read',
      category: 'Security',
      tags: ['Security', 'Best Practices', 'Development'],
      slug: 'essential-security-practices'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Articles' },
    { value: 'AI', label: 'AI & Machine Learning' },
    { value: 'Mobile', label: 'Mobile Development' },
    { value: 'Web', label: 'Web Development' },
    { value: 'Security', label: 'Security' }
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <main dir={dir} className="min-h-screen bg-off-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-off-white py-20 border-b border-slate-blue-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-blue-600 pt-8">
            Aviniti Tech Blog
          </h1>
          <p className="text-xl text-slate-blue-500 max-w-3xl mx-auto">
            Insights, tutorials, and industry updates from our team of AI and app development experts
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.value
                    ? 'bg-bronze-500 text-white shadow-lg'
                    : 'bg-white text-slate-blue-600 hover:bg-slate-blue-50 hover:text-bronze-500 border border-slate-blue-100'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Article */}
        {filteredPosts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-slate-blue-600 mb-8">Featured Article</h2>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 bg-gradient-to-br from-slate-blue-600 to-slate-blue-700 p-8 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div className="text-sm opacity-90">Featured</div>
                  </div>
                </div>
                <div className="md:w-2/3 p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-bronze-100 text-bronze-600 px-3 py-1 rounded-full text-sm font-medium">
                      {filteredPosts[0].category}
                    </span>
                    <span className="text-slate-blue-400 text-sm">{filteredPosts[0].date}</span>
                    <span className="text-slate-blue-400 text-sm">{filteredPosts[0].readTime}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-blue-600 mb-4">
                    {filteredPosts[0].title}
                  </h3>
                  <p className="text-slate-blue-500 mb-6 leading-relaxed">
                    {filteredPosts[0].excerpt}
                  </p>
                  <Link 
                    href={`/blog/${filteredPosts[0].slug}`}
                    className="inline-flex items-center bg-transparent border-2 border-slate-blue-600 text-slate-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-slate-blue-600 hover:text-white transition-colors duration-300"
                  >
                    Read Full Article
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-blue-600 mb-8">
            {selectedCategory === 'all' ? 'Latest Articles' : `${categories.find(c => c.value === selectedCategory)?.label} Articles`}
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.slice(1).map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group border border-slate-blue-100">
                <div className="h-48 bg-gradient-to-br from-slate-blue-500 to-slate-blue-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="bg-bronze-100 text-bronze-600 px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-3 text-sm text-slate-blue-400">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-blue-600 mb-3 line-clamp-2 group-hover:text-bronze-600 transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="text-slate-blue-500 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="bg-slate-blue-100 text-slate-blue-600 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="text-bronze-500 font-medium hover:text-bronze-600 transition-colors duration-300"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-slate-blue-600 to-slate-blue-700 rounded-2xl p-8 text-center text-white border border-slate-blue-500">
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="text-slate-blue-200 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter to get the latest insights on AI, app development, and technology trends delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-slate-blue-600 placeholder-slate-blue-400 border border-slate-blue-300 focus:ring-2 focus:ring-bronze-500 focus:border-bronze-500"
            />
            <button className="bg-bronze-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-bronze-600 transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 