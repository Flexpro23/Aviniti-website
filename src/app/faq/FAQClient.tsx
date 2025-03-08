'use client';
import { useState } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactPopup from '@/components/ContactPopup';
import FloatingContact from '@/components/FloatingContact';
import Script from 'next/script';

export default function FAQClient() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { dir } = useLanguage();
  
  const faqs = [
    {
      question: "How does AI app development reduce business costs?",
      answer: "AI app development reduces business costs by automating repetitive tasks (saving 30-40% in operational expenses), optimizing resource allocation through predictive analytics, minimizing human error in critical processes, enabling 24/7 customer service through chatbots, and providing data-driven insights that improve decision-making efficiency. Most businesses see ROI within 6-12 months of implementation."
    },
    {
      question: "What is the typical timeline for developing a custom AI application?",
      answer: "The typical timeline for developing a custom AI application ranges from 3-9 months depending on complexity. Simple AI integrations may take 2-3 months, while enterprise-level solutions with custom algorithms require 6-9 months. Our development process includes: requirements gathering (2-3 weeks), design and prototyping (3-4 weeks), development (8-16 weeks), testing (2-4 weeks), and deployment (1-2 weeks)."
    },
    {
      question: "How much does it cost to develop a mobile app with AI features?",
      answer: "Mobile app development with AI features typically costs between $30,000-$150,000 depending on complexity. Basic apps with simple AI integrations (like recommendation engines) start at $30,000-$50,000. Mid-range apps with custom AI algorithms and multiple features range from $50,000-$100,000. Enterprise-level applications with advanced AI capabilities (natural language processing, computer vision) can exceed $100,000. Factors affecting cost include AI model complexity, data requirements, integration needs, and platform choices."
    },
    {
      question: "What industries benefit most from AI app development?",
      answer: "Industries benefiting most from AI app development include healthcare (diagnostic tools, patient monitoring), finance (fraud detection, algorithmic trading), retail (inventory management, personalized recommendations), manufacturing (predictive maintenance, quality control), logistics (route optimization, demand forecasting), and customer service (intelligent chatbots, sentiment analysis). These sectors see significant ROI through cost reduction, efficiency improvements, and enhanced customer experiences."
    },
    {
      question: "How do you ensure data privacy and security in AI applications?",
      answer: "We ensure data privacy and security in AI applications through: data encryption (AES-256) for storage and transmission, strict access controls and authentication protocols, data minimization practices (collecting only necessary information), regular security audits and penetration testing, compliance with regulations (GDPR, HIPAA, CCPA), secure API integrations with proper authentication, and transparent data usage policies. We also implement privacy by design principles throughout the development lifecycle."
    },
    {
      question: "What's the difference between native and cross-platform mobile app development?",
      answer: "Native app development creates platform-specific applications (iOS/Android) using languages like Swift or Kotlin, offering optimal performance, full access to device features, and better user experience but at higher development costs. Cross-platform development uses frameworks like React Native or Flutter to build apps that work on multiple platforms from a single codebase, reducing development time and cost by 30-40% while maintaining 90% of native performance. The choice depends on project requirements, budget constraints, and performance needs."
    },
    {
      question: "How can existing businesses integrate AI into their current systems?",
      answer: "Businesses can integrate AI into existing systems through: API-based integration with current software, middleware solutions that connect legacy systems with AI capabilities, microservices architecture to add AI components without disrupting core systems, data pipeline creation to feed information to AI models, gradual implementation starting with pilot projects, and hybrid cloud solutions for scalability. We typically begin with a thorough system assessment, identify high-impact integration points, and implement a phased approach to minimize disruption."
    },
    {
      question: "What ongoing maintenance is required for AI applications?",
      answer: "AI applications require ongoing maintenance including: regular model retraining (typically quarterly) to maintain accuracy, performance monitoring and optimization, data quality management, security updates and vulnerability patching, API and integration updates as third-party services evolve, user feedback incorporation, and scaling infrastructure as usage grows. We offer maintenance packages that include 24/7 monitoring, scheduled model updates, and technical support to ensure optimal performance."
    }
  ];

  return (
    <main dir={dir} className="min-h-screen bg-gray-50">
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(faq => ({
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
      
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h1>
        <p className="text-lg text-center mb-16 max-w-3xl mx-auto">
          Get answers to common questions about AI app development, custom software solutions, 
          and how our services can transform your business.
        </p>
        
        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-8 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-3">{faq.question}</h2>
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="mb-6">Our team is ready to help you with any specific questions about your project.</p>
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