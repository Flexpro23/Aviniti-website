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
  const [contactSubject, setContactSubject] = useState('');
  const { dir } = useLanguage();
  
  // Function to open contact popup with specific subject
  const openContactWithSubject = (subject: string) => {
    setContactSubject(subject);
    setIsContactOpen(true);
  };
  
  const faqCategories = [
    {
      title: "General Questions",
      faqs: [
        {
          question: "What services does Aviniti offer?",
          answer: "Aviniti is a dynamic and innovative software and app development company based in Amman, Jordan. We specialize in creating custom applications tailored to your business needs, ensuring seamless integration and user-friendly designs."
        },
        {
          question: "How can I get a quote for my project?",
          answer: "You can reach out to us through our contact page or email us directly at contact@aviniti.app. Provide a brief description of your project, and our team will get back to you with an estimated quote and timeline."
        }
      ]
    },
    {
      title: "App Development",
      faqs: [
        {
          question: "What platforms do you develop apps for?",
          answer: "We develop applications for various platforms, including iOS, Android, and web-based solutions, ensuring cross-platform compatibility and optimal performance."
        },
        {
          question: "How does Aviniti ensure the security of the applications developed?",
          answer: "Security is a top priority at Aviniti. We implement industry-standard security protocols, conduct regular code reviews, and perform thorough testing to safeguard your application against potential threats."
        }
      ]
    },
    {
      title: "AI Services",
      faqs: [
        {
          question: "What AI services does Aviniti provide?",
          answer: "Aviniti offers a range of AI services, including machine learning model development, natural language processing, and data analytics, to help businesses leverage artificial intelligence for improved decision-making and efficiency."
        },
        {
          question: "Can Aviniti integrate AI solutions into existing applications?",
          answer: "Yes, we can integrate AI capabilities into your existing applications, enhancing their functionality and providing a more personalized user experience."
        }
      ]
    },
    {
      title: "Project Management",
      faqs: [
        {
          question: "What is the typical timeline for a project?",
          answer: "The timeline varies depending on the project's complexity and scope. After discussing your requirements, we provide a detailed project plan with estimated milestones and completion dates."
        },
        {
          question: "How does Aviniti handle project communication and updates?",
          answer: "We maintain transparent communication through regular updates, meetings, and progress reports, ensuring you are informed at every stage of the development process."
        },
        {
          question: "What development methodology does Aviniti follow?",
          answer: "We adhere to the Agile methodology, promoting adaptive planning, evolutionary development, early delivery, and continuous improvement, ensuring flexibility and client satisfaction throughout the development process."
        },
        {
          question: "What post-launch support plans does Aviniti offer?",
          answer: "We provide tiered support plans to cater to various client needs: Basic: Includes bug fixes and security updates at $99/month. Premium: Offers feature enhancements and 24/7 Service Level Agreements (SLAs) at $499/month. Enterprise: Provides a dedicated DevOps team and AI model retraining at $1,999/month."
        }
      ]
    },
    {
      title: "Company & Expertise",
      faqs: [
        {
          question: "Can you share details about the expertise and experience of your development and AI teams?",
          answer: "Our team comprises highly skilled professionals with extensive experience in app development and artificial intelligence, dedicated to delivering innovative solutions tailored to your business needs."
        },
        {
          question: "How does Aviniti involve clients during the development process?",
          answer: "We maintain open communication lines, providing regular updates and seeking feedback to ensure the project aligns with your expectations and requirements."
        },
        {
          question: "What project management tools does Aviniti use?",
          answer: "We utilize ClickUp for project management but are flexible and can adapt to the client's preferred communication tools to ensure seamless collaboration."
        },
        {
          question: "How does Aviniti approach AI integration into existing systems?",
          answer: "Our approach to AI integration is customized based on the client's existing systems, ensuring compatibility and optimal performance."
        },
        {
          question: "What measures are in place to ensure data privacy and compliance with regulations?",
          answer: "We adhere to industry standards and best practices to ensure data privacy and compliance with relevant regulations, safeguarding your information."
        },
        {
          question: "How does Aviniti estimate project costs?",
          answer: "Project costs are estimated based on the requested features and the timeline, providing a transparent and detailed breakdown to clients."
        },
        {
          question: "What technologies and programming languages does Aviniti specialize in?",
          answer: "We specialize in the most known and efficient programming languages, selecting those that best meet the client's needs to deliver optimal solutions."
        }
      ]
    },
    {
      title: "Previous Projects",
      faqs: [
        {
          question: "Can you provide examples of previous projects, especially those involving AI implementations?",
          answer: "Certainly, here are some of our notable projects: Flex Pro: A comprehensive package delivery system streamlining operations for sellers, drivers, and administrators. Secretary: An office management system simplifying appointment booking and client management for various businesses. Farm House: An Airbnb-style platform connecting users with unique farm stays and experiences. Let's Play: An app connecting sports enthusiasts to book courts, create games, and find players. Nay Nursery: A nursery management system empowering parents to stay connected with their child's daily activities and progress. Wear & Share: A clothing marketplace connecting users to buy and sell pre-owned fashion items, promoting sustainable style. Skinverse: An AI-powered skincare app delivering personalized skin reports and product recommendations based on facial analysis."
        }
      ]
    }
  ];

  // Flatten all FAQs for schema markup
  const allFaqs = faqCategories.flatMap(category => category.faqs);

  return (
    <main dir={dir} className="min-h-screen bg-gray-50">
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
      
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h1>
        <p className="text-lg text-center mb-16 max-w-3xl mx-auto">
          Get answers to common questions about our services, processes, and expertise.
        </p>
        
        <div className="max-w-4xl mx-auto">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-blue-800">{category.title}</h2>
              {category.faqs.map((faq, faqIndex) => (
                <div key={faqIndex} className="mb-6 bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">{faq.question}</h3>
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="mb-6">Our team is ready to help you with any specific questions about your project.</p>
          <button 
            onClick={() => openContactWithSubject('Question from FAQ Page')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300"
          >
            Contact Us
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
  );
} 