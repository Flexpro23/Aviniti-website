'use client';
import { useState } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactPopup from '@/components/ContactPopup';
import FloatingContact from '@/components/FloatingContact';
import Link from 'next/link';
import Script from 'next/script';

// Define the structure for a blog post translation
interface BlogPostTranslation {
  title?: string;
  excerpt?: string;
  date?: string;
  readTimeValue?: number;
  schemaHeadline?: string;
  schemaDescription?: string;
  headerSubtitle?: string;
  introParagraph?: string;
  // ... Add other fields present in costGuide like breakdownTitle, tableHeaders, etc.
  // For simplicity now, we assume they might exist or be undefined
  [key: string]: any; // Allow other potential fields
}

// Define the expected structure for the posts object
interface BlogPostsTranslation {
  costGuide?: BlogPostTranslation;
  integration?: BlogPostTranslation;
  trends?: BlogPostTranslation;
  [key: string]: BlogPostTranslation | undefined; // Index signature
}

// Define props for the component
interface BlogPostClientProps {
  postId: 'costGuide' | 'integration' | 'trends';
}

export default function BlogPostClient({ postId }: BlogPostClientProps) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const { t, dir } = useLanguage();

  const openContactWithSubject = (subject: string) => {
    setContactSubject(subject);
    setIsContactOpen(true);
  };

  // Dynamically access the specific post translations based on postId
  const postsData = t.blog?.posts as BlogPostsTranslation | undefined;
  const post = postsData?.[postId];

  // Determine category based on postId (adjust keys if needed)
  let categoryKey: 'development' | 'integration' | 'trends' = 'development'; // Default
  if (postId === 'integration') categoryKey = 'integration';
  else if (postId === 'trends') categoryKey = 'trends';
  const category = t.blog?.categories?.[categoryKey] || postId; // Fallback to postId

  const postDate = post?.date || 'Date Unavailable';
  const readTime = `${post?.readTimeValue || 5} ${t.blog?.readTimeUnit || 'min read'}`; // Default 5 min
  const defaultTitle = postId.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <main dir={dir} className="min-h-screen bg-gray-50">
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ // Use translated schema data or fallbacks
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post?.schemaHeadline || post?.title || defaultTitle,
            description: post?.schemaDescription || post?.excerpt || 'Article description unavailable.',
            image: `https://aviniti.app/blog/${postId}.jpg`, // Assume image name matches postId
            author: { '@type': 'Organization', name: 'Aviniti', url: 'https://aviniti.app' },
            publisher: { '@type': 'Organization', name: 'Aviniti', logo: { '@type': 'ImageObject', url: 'https://aviniti.app/logo.svg' } },
            datePublished: post?.date ? new Date(post.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0], // Format date
            dateModified: post?.date ? new Date(post.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
          })
        }}
      />
      
      <Navbar />
      
      <article className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="mb-12">
          <div className="flex items-center mb-4">
            <span className="text-sm font-medium text-blue-600 mr-4">{category}</span>
            <span className="text-sm text-gray-500">{postDate}</span>
            <span className="text-sm text-gray-500 ml-4">{readTime}</span>
          </div>
          <h1 className="text-4xl font-bold mb-6">{post?.title || defaultTitle}</h1>
          {(post?.headerSubtitle) && (
             <p className="text-xl text-gray-600" dangerouslySetInnerHTML={{ __html: post.headerSubtitle }} />
          )}
        </header>
        
        <div className="prose prose-lg max-w-none">
          {/* Render content dynamically - Add more sections as needed based on translation structure */}
          {(post?.introParagraph) && (
            <p dangerouslySetInnerHTML={{ __html: post.introParagraph }} />
          )}

          {/* Example: Render cost breakdown section only if data exists */}
          {(postId === 'costGuide' && post?.breakdownTitle) && (
            <>
              <h2 className="text-2xl font-bold mt-10 mb-4">{post.breakdownTitle}</h2>
              <table className="w-full border-collapse border border-gray-300 mb-8">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-3 text-left">{post.tableHeaders?.complexity}</th>
                    <th className="border border-gray-300 p-3 text-left">{post.tableHeaders?.costRange}</th>
                    <th className="border border-gray-300 p-3 text-left">{post.tableHeaders?.devTime}</th>
                  </tr>
                </thead>
                 <tbody>
                   <tr>
                     <td className="border border-gray-300 p-3">{post.tableRows?.basic?.complexity}</td>
                     <td className="border border-gray-300 p-3">{post.tableRows?.basic?.cost}</td>
                     <td className="border border-gray-300 p-3">{post.tableRows?.basic?.time}</td>
                   </tr>
                   <tr>
                     <td className="border border-gray-300 p-3">{post.tableRows?.mid?.complexity}</td>
                     <td className="border border-gray-300 p-3">{post.tableRows?.mid?.cost}</td>
                     <td className="border border-gray-300 p-3">{post.tableRows?.mid?.time}</td>
                   </tr>
                   <tr>
                     <td className="border border-gray-300 p-3">{post.tableRows?.enterprise?.complexity}</td>
                     <td className="border border-gray-300 p-3">{post.tableRows?.enterprise?.cost}</td>
                     <td className="border border-gray-300 p-3">{post.tableRows?.enterprise?.time}</td>
                   </tr>
                 </tbody>
              </table>
            </>
          )}
          
          {/* Add rendering logic for other sections (keyFactors, hiddenCosts, etc.) similarly */}
          {/* Check if the corresponding data exists in `post` before rendering */}
           {(post?.keyFactorsTitle && post?.keyFactorsList) && (
            <>
              <h2 className="text-2xl font-bold mt-10 mb-4">{post.keyFactorsTitle}</h2>
              <ol className="list-decimal pl-6 space-y-4 mb-8">
                {post.keyFactorsList.map((item: string, index: number) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ol>
            </>
          )}

          {/* Placeholder for missing content */}
          {(!post?.introParagraph && !post?.breakdownTitle && !post?.keyFactorsTitle) && (
              <p>Full content for this article will be available soon.</p>
          )}

          {/* Add rendering for conclusion, CTA etc. checking if post data exists */}
           {(post?.conclusionTitle && post?.conclusionParagraph1) && (
             <>
                <h2 className="text-2xl font-bold mt-10 mb-4">{post.conclusionTitle}</h2>
                <p dangerouslySetInnerHTML={{ __html: post.conclusionParagraph1 }} />
                {post.conclusionParagraph2 && <p dangerouslySetInnerHTML={{ __html: post.conclusionParagraph2 }} />}
             </>
           )}
        </div>
        
         {(post?.ctaBoxTitle) && (
             <div className="mt-12 p-6 bg-gray-100 rounded-lg">
               <h3 className="text-xl font-bold mb-4">{post.ctaBoxTitle}</h3>
               {post.ctaBoxDescription && <p className="mb-6">{post.ctaBoxDescription}</p>}
               <button 
                 onClick={() => openContactWithSubject(`${post.title || defaultTitle} Inquiry`)}
                 className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300"
               >
                 {post.ctaButton || t.contact?.cta || 'Contact Us'}
               </button>
             </div>
         )}
        
        <div className="mt-12">
          <Link href="/blog" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
            {t.blog?.backToBlog || '← Back to Blog'}
          </Link>
        </div>
      </article>
      
      <Footer />
      
      <FloatingContact onContactClick={() => openContactWithSubject(`Blog Post Inquiry - ${post?.title || defaultTitle}`)} />
      
      <ContactPopup 
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        initialSubject={contactSubject}
      />
    </main>
  );
} 