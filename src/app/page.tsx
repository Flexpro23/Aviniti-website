'use client';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import ContactSection from '../components/ContactSection';
import { useState, useEffect } from 'react';
import ContactPopup from '../components/ContactPopup';
import UserInfoForm from '../components/UserInfoForm';
import AppDescriptionForm from '../components/AppDescriptionForm';
import { PersonalDetails } from '../lib/firebase-utils';
import { useLanguage } from '@/lib/context/LanguageContext';
import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import Services from '@/components/Services';
import Expertise from '@/components/Expertise';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

interface AppDetails {
  description: string;
  answers: {
    problem: string[];
    targetAudience: string[];
    keyFeatures: string[];
    competitors: string;
    platforms: string[];
    integrations: string[];
  };
}

export default function Home() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
  const [isAppDescriptionOpen, setIsAppDescriptionOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { dir } = useLanguage();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleUserInfoSubmit = (userInfo: PersonalDetails, newUserId: string) => {
    setUserId(newUserId);
    setIsUserInfoOpen(false);
    setIsAppDescriptionOpen(true);
  };

  const handleAppDescriptionSubmit = (details: AppDetails) => {
    setIsAppDescriptionOpen(false);
    // Here we'll handle the AI analysis later
    console.log('App details submitted:', details);
  };

  // Only render the full content after mounting on the client
  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <main dir={dir} className="min-h-screen">
      <Navbar />
      <Hero />
      <Projects />
      <Services />
      <Expertise />
      <About />
      <Contact />
      <Footer />
      
      {/* Hero Section */}
      <section className="relative bg-primary-900 text-white pt-20 md:pt-32 pb-16 md:pb-20 overflow-hidden">
        {/* Background Animation Container - Moved to back */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] aspect-square">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-secondary-400/50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-primary-400/50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-secondary-500/50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7 mb-12 lg:mb-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                Transform Your Vision
                <span className="block text-secondary-400 mt-2">With AI-Powered Apps</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8">
                From Innovative Concept to Enterprise Scale
              </p>
              <p className="text-sm sm:text-base text-gray-300 mb-8 sm:mb-12 max-w-2xl">
                Leverage our expertise in AI, mobile development, and cloud solutions to build innovative applications that drive real business growth and user engagement.
              </p>
              
              {/* AI Estimate Button - Moved to top */}
              <div className="flex flex-col items-center sm:items-start mb-8 sm:mb-10">
                <button
                  onClick={() => setIsUserInfoOpen(true)}
                  className="w-full sm:w-auto btn-primary btn-prominent"
                >
                  Get Instant AI Estimate
                  <svg className="ml-3 w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </button>
                <span className="text-gray-300 text-sm sm:text-base mt-3">Get an instant project estimate powered by AI</span>
              </div>

              {/* Other buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
                <div className="flex flex-col items-center sm:items-start">
                  <a href="#contact" className="w-full sm:w-auto btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                    Get a Free Consultation
                    <svg className="ml-2 w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                  <span className="text-gray-300 text-xs sm:text-sm mt-2">Schedule a 30-minute strategy session</span>
                </div>
                <div className="flex flex-col items-center sm:items-start">
                  <a href="#solutions" className="w-full sm:w-auto btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
                    Explore Solutions
                    <svg className="ml-2 w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                  <span className="text-gray-300 text-xs sm:text-sm mt-2">View our services and case studies</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              {/* Enhanced decorative elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full border border-white/20 animate-spin-slow"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] rounded-full border border-white/10 animate-spin-slow-reverse"></div>
              
              <div className="relative z-10">
                <div className="relative w-full max-w-lg mx-auto">
                  <Image
                    src="/hero-illustration.svg"
                    alt="AI and Mobile App Development"
                    width={600}
                    height={600}
                    className="w-full h-auto filter drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Apps Section */}
      <section className="bg-primary-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">Trusted By</h2>
            <p className="text-lg sm:text-xl text-white/70">Innovative solutions powering modern businesses</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              { 
                name: 'Flex Pro',
                logo: '/company-logos/flex-pro.png',
                description: "A comprehensive package delivery system streamlining operations for sellers, drivers, and administrators.",
                industry: 'Logistics & Delivery'
              },
              {
                name: 'Secrtary',
                logo: '/company-logos/secrtary.png',
                description: "An office management system simplifying appointment booking and client management for various businesses.",
                industry: 'Business Management & Productivity'
              },
              {
                name: 'Farm House',
                logo: '/company-logos/farm-house.png',
                description: "An Airbnb-style platform connecting users with unique farm stays and experiences.",
                industry: 'Travel & Hospitality'
              },
              {
                name: 'Let\'s Play',
                logo: '/company-logos/lets-play.png',
                description: "An app connecting sports enthusiasts to book courts, create games, and find players.",
                industry: 'Sports & Recreation'
              },
              {
                name: 'Nay Nursery',
                logo: '/company-logos/nay-nursery.png',
                description: "A nursery management system empowering parents to stay connected with their child's daily activities and progress.",
                industry: 'Education & Childcare'
              },
              {
                name: 'Wear & Share',
                logo: '/company-logos/wear-share.png',
                description: "A clothing marketplace connecting users to buy and sell pre-owned fashion items, promoting sustainable style.",
                industry: 'Fashion & Retail'
              },
              {
                name: 'Skinverse',
                logo: '/company-logos/skinverse.png',
                description: "An AI-powered skincare app delivering personalized skin reports and product recommendations based on facial analysis.",
                industry: 'Beauty & Wellness'
              }
            ].map((app, index) => (
              <div key={index} className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-white/20 transition-all duration-300 h-full">
                <div className="flex flex-col h-full">
                  <div className="mb-4 sm:mb-6">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white/10 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                      <div className="relative w-full h-full">
                        <Image
                          src={app.logo}
                          alt={app.name}
                          fill
                          className="object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 64px, 96px"
                          priority={index < 4}
                        />
                      </div>
                    </div>
                    <h3 className="text-white text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                      {app.name}
                    </h3>
                    <p className="text-white/60 text-xs sm:text-sm font-medium">
                      {app.industry}
                    </p>
                  </div>
                  <p className="text-white/80 text-sm sm:text-base leading-relaxed line-clamp-3">
                    {app.description}
                  </p>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Accelerate Your Digital Transformation</h2>
            <p className="text-sm sm:text-base text-gray-600">Leverage our expertise to build innovative solutions that give you a competitive edge.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                title: "Custom Development",
                description: "Tailored solutions that perfectly align with your business objectives and user needs",
                icon: "/icons/custom-dev.svg"
              },
              {
                title: "AI & Machine Learning",
                description: "Harness the power of AI to automate processes and gain actionable insights",
                icon: "/icons/ai.svg"
              },
              {
                title: "Mobile Apps",
                description: "Native iOS/Android and cross-platform solutions with Flutter and React Native",
                icon: "/icons/mobile.svg"
              },
              {
                title: "Cloud Solutions",
                description: "Scalable cloud infrastructure using AWS, Google Cloud, and Azure",
                icon: "/icons/cloud.svg"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    fill
                    className="object-contain transform group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 48px, 64px"
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-padding bg-neutral-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-lg mb-6">Our Expertise</h2>
            <p className="text-lg text-neutral-600">
              Discover how our technical expertise and industry knowledge can transform your business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {[
              {
                title: "App Development",
                description: "End-to-end mobile application development services, from custom solutions to ready-made apps, with a focus on exceptional user experience.",
                icon: "/icons/app-dev.svg",
                features: [
                  "Custom iOS & Android Development",
                  "Cross-Platform Solutions (Flutter/React)",
                  "Ready-Made App Solutions",
                  "Professional UI/UX Design",
                  "Comprehensive Testing & QA"
                ]
              },
              {
                title: "AI & Automation Solutions",
                description: "Cutting-edge AI solutions that transform business operations through intelligent automation and data-driven insights.",
                icon: "/icons/ai.svg",
                features: [
                  "AI-Powered Customer Support Systems",
                  "Intelligent CRM & Sales Automation",
                  "Business Process Automation",
                  "Computer Vision & Image Analysis",
                  "Predictive Analytics & Insights"
                ]
              },
              {
                title: "Consulting & Analytics",
                description: "Strategic consulting and data analytics services to drive your digital transformation journey.",
                icon: "/icons/support.svg",
                features: [
                  "Digital Transformation Strategy",
                  "AI Implementation Consulting",
                  "Data Analytics & Visualization",
                  "Technology Roadmapping",
                  "Custom Reporting Solutions"
                ]
              }
            ].map((service, index) => (
              <div key={index} className="card">
                <div className="mb-6">
                  <Image
                    src={service.icon}
                    alt={service.title}
                    width={64}
                    height={64}
                    className="w-16 h-16"
                  />
                </div>
                <h3 className="heading-md mb-4">{service.title}</h3>
                <p className="text-neutral-600 mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-neutral-700">
                      <svg className="w-5 h-5 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <a href="#contact" className="btn-primary px-8 py-4 text-lg font-semibold group hover:scale-105">
                    Get Started
                    <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">About Aviniti</h2>
            <p className="text-lg text-gray-600 mb-6">
              Aviniti is a dynamic and innovative software development company based in Amman, Jordan. 
              We specialize in creating user-friendly mobile applications and integrating cutting-edge AI technologies.
            </p>
            <p className="text-lg text-gray-600">
              Our commitment to quality and innovation drives us to deliver exceptional solutions that help businesses 
              streamline operations, increase customer engagement, and improve ROI.
            </p>
          </div>
        </div>
      </section>

      <ContactSection onContactClick={() => setIsContactOpen(true)} />
      
      <ContactPopup 
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <UserInfoForm
        isOpen={isUserInfoOpen}
        onClose={() => setIsUserInfoOpen(false)}
        onContinue={handleUserInfoSubmit}
      />

      {userId && (
        <AppDescriptionForm
          isOpen={isAppDescriptionOpen}
          onClose={() => setIsAppDescriptionOpen(false)}
          userId={userId}
          onAnalyze={handleAppDescriptionSubmit}
        />
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">© {new Date().getFullYear()} Aviniti. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
} 