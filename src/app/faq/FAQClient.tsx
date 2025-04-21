'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactPopup from '@/components/ContactPopup';
import FloatingContact from '@/components/FloatingContact';
import Script from 'next/script';

export default function FAQClient() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const { t, dir, language, setLanguage, refreshTranslations, getNestedTranslation } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  
  // Add a state variable to force re-renders
  const [forceUpdate, setForceUpdate] = useState(0);

  // Indicate when component is mounted on client side
  useEffect(() => {
    setIsMounted(true);
    // Set initial document direction
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, []);
  
  // Function to open contact popup with specific subject
  const openContactWithSubject = (subject: string) => {
    setContactSubject(subject);
    setIsContactOpen(true);
  };
  
  // Force component update when language changes
  useEffect(() => {
    console.log('Language changed to:', language, 'with direction:', dir);
    
    // Force content update immediately
    setForceUpdate(prev => prev + 1);
    
    // Update document direction and lang attributes
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    
    // Force another update after a delay to ensure translations are applied
    const timer = setTimeout(() => {
      refreshTranslations();
      setForceUpdate(prev => prev + 1);
      console.log('Delayed force update triggered');
    }, 150);
    
    return () => clearTimeout(timer);
  }, [language, dir, refreshTranslations]);
  
  // Debug function to log translation availability
  const checkTranslations = useCallback(() => {
    if (!t) {
      console.error('Translation object is missing');
      return;
    }
    
    console.log('----------------------------------------');
    console.log(`${language.toUpperCase()} FAQ DEBUG`);
    console.log('Translation object structure:', Object.keys(t));
    
    if (t.faq) {
      console.log('FAQ section keys:', Object.keys(t.faq));
      console.log('FAQ title:', getNestedTranslation(['faq', 'title'], 'Frequently Asked Questions'));
      console.log('FAQ subtitle:', getNestedTranslation(['faq', 'subtitle'], 'Get answers to common questions'));
      console.log('FAQ categories:', getNestedTranslation(['faq', 'categories'], {}));
      
      if (t.faq.categories) {
        console.log('Categories available:', Object.keys(t.faq.categories));
      }
      
      // Check general questions section
      if (t.faq.general) {
        console.log('General questions available:', Object.keys(t.faq.general));
      }
    } else {
      console.error('FAQ section is completely missing from translations');
    }
    
    console.log('----------------------------------------');
  }, [t, language, getNestedTranslation]);
  
  // Run translation check when language changes or on force update
  useEffect(() => {
    if (isMounted) {
      checkTranslations();
    }
  }, [isMounted, language, forceUpdate, checkTranslations]);
  
  // Use useMemo with the new getNestedTranslation function for translations
  const faqCategories = useMemo(() => {
    console.log('Generating FAQ categories for language:', language);
    
    // Create categories array with improved translation access
    return [
      {
        title: getNestedTranslation(['faq', 'categories', 'general'], "General Questions"),
        faqs: [
          {
            question: getNestedTranslation(['faq', 'general', 'services', 'question'], "What services does Aviniti offer?"),
            answer: getNestedTranslation(['faq', 'general', 'services', 'answer'], "Aviniti is a dynamic and innovative software and app development company based in Amman, Jordan. We specialize in creating custom applications tailored to your business needs, ensuring seamless integration and user-friendly designs.")
          },
          {
            question: getNestedTranslation(['faq', 'general', 'quote', 'question'], "How can I get a quote for my project?"),
            answer: getNestedTranslation(['faq', 'general', 'quote', 'answer'], "You can reach out to us through our contact page or email us directly at contact@aviniti.app. Provide a brief description of your project, and our team will get back to you with an estimated quote and timeline.")
          }
        ]
      },
      {
        title: getNestedTranslation(['faq', 'categories', 'appDevelopment'], "App Development"),
        faqs: [
          {
            question: getNestedTranslation(['faq', 'appDevelopment', 'platforms', 'question'], "What platforms do you develop apps for?"),
            answer: getNestedTranslation(['faq', 'appDevelopment', 'platforms', 'answer'], "We develop applications for various platforms, including iOS, Android, and web-based solutions, ensuring cross-platform compatibility and optimal performance.")
          },
          {
            question: getNestedTranslation(['faq', 'appDevelopment', 'security', 'question'], "How does Aviniti ensure the security of the applications developed?"),
            answer: getNestedTranslation(['faq', 'appDevelopment', 'security', 'answer'], "Security is a top priority at Aviniti. We implement industry-standard security protocols, conduct regular code reviews, and perform thorough testing to safeguard your application against potential threats.")
          }
        ]
      },
      {
        title: getNestedTranslation(['faq', 'categories', 'aiServices'], "AI Services"),
        faqs: [
          {
            question: getNestedTranslation(['faq', 'aiServices', 'servicesProvided', 'question'], "What AI services does Aviniti provide?"),
            answer: getNestedTranslation(['faq', 'aiServices', 'servicesProvided', 'answer'], "Aviniti offers a range of AI services, including machine learning model development, natural language processing, and data analytics, to help businesses leverage artificial intelligence for improved decision-making and efficiency.")
          },
          {
            question: getNestedTranslation(['faq', 'aiServices', 'integration', 'question'], "Can Aviniti integrate AI solutions into existing applications?"),
            answer: getNestedTranslation(['faq', 'aiServices', 'integration', 'answer'], "Yes, we can integrate AI capabilities into your existing applications, enhancing their functionality and providing a more personalized user experience.")
          }
        ]
      },
      {
        title: getNestedTranslation(['faq', 'categories', 'projectManagement'], "Project Management"),
        faqs: [
          {
            question: getNestedTranslation(['faq', 'projectManagement', 'timeline', 'question'], "What is the typical timeline for a project?"),
            answer: getNestedTranslation(['faq', 'projectManagement', 'timeline', 'answer'], "The timeline varies depending on the project's complexity and scope. After discussing your requirements, we provide a detailed project plan with estimated milestones and completion dates.")
          },
          {
            question: getNestedTranslation(['faq', 'projectManagement', 'communication', 'question'], "How does Aviniti handle project communication and updates?"),
            answer: getNestedTranslation(['faq', 'projectManagement', 'communication', 'answer'], "We maintain transparent communication through regular updates, meetings, and progress reports, ensuring you are informed at every stage of the development process.")
          },
          {
            question: getNestedTranslation(['faq', 'projectManagement', 'methodology', 'question'], "What development methodology does Aviniti follow?"),
            answer: getNestedTranslation(['faq', 'projectManagement', 'methodology', 'answer'], "We adhere to the Agile methodology, promoting adaptive planning, evolutionary development, early delivery, and continuous improvement, ensuring flexibility and client satisfaction throughout the development process.")
          },
          {
            question: getNestedTranslation(['faq', 'projectManagement', 'support', 'question'], "What post-launch support plans does Aviniti offer?"),
            answer: getNestedTranslation(['faq', 'projectManagement', 'support', 'answer'], "We provide tiered support plans to cater to various client needs: Basic: Includes bug fixes and security updates at $99/month. Premium: Offers feature enhancements and 24/7 Service Level Agreements (SLAs) at $499/month. Enterprise: Provides a dedicated DevOps team and AI model retraining at $1,999/month.")
          }
        ]
      },
      {
        title: getNestedTranslation(['faq', 'categories', 'companyExpertise'], "Company & Expertise"),
        faqs: [
          {
            question: getNestedTranslation(['faq', 'companyExpertise', 'teamExpertise', 'question'], "Can you share details about the expertise and experience of your development and AI teams?"),
            answer: getNestedTranslation(['faq', 'companyExpertise', 'teamExpertise', 'answer'], "Our team comprises highly skilled professionals with extensive experience in app development and artificial intelligence, dedicated to delivering innovative solutions tailored to your business needs.")
          },
          {
            question: getNestedTranslation(['faq', 'companyExpertise', 'clientInvolvement', 'question'], "How does Aviniti involve clients during the development process?"),
            answer: getNestedTranslation(['faq', 'companyExpertise', 'clientInvolvement', 'answer'], "We maintain open communication lines, providing regular updates and seeking feedback to ensure the project aligns with your expectations and requirements.")
          },
          {
            question: getNestedTranslation(['faq', 'companyExpertise', 'pmTools', 'question'], "What project management tools does Aviniti use?"),
            answer: getNestedTranslation(['faq', 'companyExpertise', 'pmTools', 'answer'], "We utilize ClickUp for project management but are flexible and can adapt to the client's preferred communication tools to ensure seamless collaboration.")
          },
          {
            question: getNestedTranslation(['faq', 'companyExpertise', 'aiIntegrationApproach', 'question'], "How does Aviniti approach AI integration into existing systems?"),
            answer: getNestedTranslation(['faq', 'companyExpertise', 'aiIntegrationApproach', 'answer'], "Our approach to AI integration is customized based on the client's existing systems, ensuring compatibility and optimal performance.")
          },
          {
            question: getNestedTranslation(['faq', 'companyExpertise', 'dataPrivacy', 'question'], "What measures are in place to ensure data privacy and compliance with regulations?"),
            answer: getNestedTranslation(['faq', 'companyExpertise', 'dataPrivacy', 'answer'], "We adhere to industry standards and best practices to ensure data privacy and compliance with relevant regulations, safeguarding your information.")
          },
          {
            question: getNestedTranslation(['faq', 'companyExpertise', 'costEstimation', 'question'], "How does Aviniti estimate project costs?"),
            answer: getNestedTranslation(['faq', 'companyExpertise', 'costEstimation', 'answer'], "Project costs are estimated based on the requested features and the timeline, providing a transparent and detailed breakdown to clients.")
          },
          {
            question: getNestedTranslation(['faq', 'companyExpertise', 'technologies', 'question'], "What technologies and programming languages does Aviniti specialize in?"),
            answer: getNestedTranslation(['faq', 'companyExpertise', 'technologies', 'answer'], "We specialize in the most known and efficient programming languages, selecting those that best meet the client's needs to deliver optimal solutions.")
          }
        ]
      },
      {
        title: getNestedTranslation(['faq', 'categories', 'previousProjects'], "Previous Projects"),
        faqs: [
          {
            question: getNestedTranslation(['faq', 'previousProjects', 'examples', 'question'], "Can you provide examples of previous projects, especially those involving AI implementations?"),
            answer: getNestedTranslation(['faq', 'previousProjects', 'examples', 'answer'], "Certainly, here are some of our notable projects: Flex Pro: A comprehensive package delivery system streamlining operations for sellers, drivers, and administrators. Secretary: An office management system simplifying appointment booking and client management for various businesses. Farm House: An Airbnb-style platform connecting users with unique farm stays and experiences. Let's Play: An app connecting sports enthusiasts to book courts, create games, and find players. Nay Nursery: A nursery management system empowering parents to stay connected with their child's daily activities and progress. Wear & Share: A clothing marketplace connecting users to buy and sell pre-owned fashion items, promoting sustainable style. Skinverse: An AI-powered skincare app delivering personalized skin reports and product recommendations based on facial analysis.")
          }
        ]
      }
    ];
  }, [language, getNestedTranslation, forceUpdate]);

  // Flatten all FAQs for schema markup
  const allFaqs = useMemo(() => {
    return faqCategories.flatMap(category => category.faqs);
  }, [faqCategories]);

  // If not yet mounted, return null to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  // Function to force reset language context
  const resetLanguageContext = () => {
    const currentLang = language;
    // Switch to opposite language temporarily
    setLanguage(currentLang === 'en' ? 'ar' : 'en');
    // Schedule switch back after a brief delay
    setTimeout(() => {
      setLanguage(currentLang);
      refreshTranslations();
      setForceUpdate(prev => prev + 1);
    }, 100);
  };

  // Render with a key based on language to force complete re-render when language changes
  return (
    <div key={`faq-container-${language}-${forceUpdate}`}>
      <main dir={dir} className={`min-h-screen bg-gray-50 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: allFaqs.map(faq => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faq.answer
                }
              }))
            })
          }}
        />
        
        <Navbar />
        
        {/* Debug language switcher */}
        <div className="bg-gray-100 p-4 flex justify-center items-center gap-4 text-xs">
          <span>Debug - Current: {language}</span>
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {getNestedTranslation(['common', 'english'], 'English')}
          </button>
          <button
            onClick={() => setLanguage('ar')}
            className={`px-3 py-1 rounded ${language === 'ar' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {getNestedTranslation(['common', 'arabic'], 'Arabic')}
          </button>
          <button
            onClick={() => {
              document.documentElement.dir = dir;
              document.documentElement.lang = language;
              console.log('Manual DOM update: dir=', dir, 'lang=', language);
            }}
            className="px-3 py-1 rounded bg-yellow-500 text-white"
          >
            Force DOM Update
          </button>
          <button
            onClick={() => {
              refreshTranslations();
              setTimeout(() => setForceUpdate(prev => prev + 1), 50);
              console.log('Manual translations refresh');
            }}
            className="px-3 py-1 rounded bg-green-500 text-white"
          >
            Refresh Translations
          </button>
          <button
            onClick={() => {
              resetLanguageContext();
              console.log('Reset language context');
            }}
            className="px-3 py-1 rounded bg-red-500 text-white"
          >
            Reset Context
          </button>
        </div>
        
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-center mb-12">
            {getNestedTranslation(['faq', 'title'], "Frequently Asked Questions")}
          </h1>
          <p className="text-lg text-center mb-16 max-w-3xl mx-auto">
            {getNestedTranslation(['faq', 'subtitle'], "Get answers to common questions about our services, processes, and expertise.")}
          </p>
          
          <div className={`max-w-4xl mx-auto ${dir === 'rtl' ? 'rtl-content' : ''}`}>
            {faqCategories.map((category, categoryIndex) => (
              <div key={`category-${categoryIndex}-${language}-${forceUpdate}`} className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-blue-800">{category.title}</h2>
                {category.faqs.map((faq, faqIndex) => (
                  <div key={`faq-${categoryIndex}-${faqIndex}-${language}-${forceUpdate}`} className="mb-6 bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">{faq.question}</h3>
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">
              {getNestedTranslation(['faq', 'cta', 'title'], "Still have questions?")}
            </h2>
            <p className="mb-6">
              {getNestedTranslation(['faq', 'cta', 'description'], "Our team is ready to help you with any specific questions about your project.")}
            </p>
            <button 
              onClick={() => openContactWithSubject('Question from FAQ Page')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300"
            >
              {getNestedTranslation(['contact', 'cta'], "Contact Us")}
            </button>
          </div>
        </div>
        
        <Footer />
        
        <FloatingContact onContactClick={() => openContactWithSubject('FAQ Page Inquiry')} />
        
        <ContactPopup 
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
          initialSubject={contactSubject}
        />
      </main>
    </div>
  );
} 