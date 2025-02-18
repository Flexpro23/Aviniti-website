'use client';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import ContactSection from '../components/ContactSection';
import { useState } from 'react';
import ContactPopup from '../components/ContactPopup';
import UserInfoForm from '../components/UserInfoForm';
import AppDescriptionForm from '../components/AppDescriptionForm';

interface UserInfo {
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  companyName: string;
}

interface AppDetails {
  description: string;
  answers: string[];
}

export default function Home() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
  const [isAppDescriptionOpen, setIsAppDescriptionOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const handleUserInfoSubmit = (userInfo: UserInfo, newUserId: string) => {
    setUserId(newUserId);
    setIsUserInfoOpen(false);
    setIsAppDescriptionOpen(true);
  };

  const handleAppDescriptionSubmit = (appDetails: AppDetails) => {
    setIsAppDescriptionOpen(false);
    // Here we'll handle the AI analysis later
    console.log('App details submitted:', appDetails);
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-primary-900 text-white pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Transform Your Vision
                <span className="block text-secondary-400 mt-2">With AI-Powered Apps</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8">
                From Innovative Concept to Enterprise Scale
              </p>
              <p className="text-gray-300 mb-12">
                Leverage our expertise in AI, mobile development, and cloud solutions to build innovative applications that drive real business growth and user engagement.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <div className="flex flex-col items-center sm:items-start">
                  <a href="#contact" className="btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                    Get a Free Consultation
                    <svg className="ml-2 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                  <span className="text-gray-300 text-sm mt-2">Schedule a 30-minute strategy session</span>
                </div>
                <div className="flex flex-col items-center sm:items-start">
                  <a href="#solutions" className="btn-secondary text-lg px-8 py-4">
                    Explore Solutions
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                  <span className="text-gray-300 text-sm mt-2">View our services and case studies</span>
                </div>
              </div>
              
              {/* AI Estimate Button */}
              <div className="flex flex-col items-center sm:items-start mt-6">
                <button
                  onClick={() => setIsUserInfoOpen(true)}
                  className="btn-primary text-xl px-10 py-5 bg-gradient-to-r from-secondary-400 to-secondary-500 hover:from-secondary-500 hover:to-secondary-600 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  Get Instant AI Estimate
                  <svg className="ml-3 w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </button>
                <span className="text-gray-300 text-sm mt-2">Get an instant project estimate powered by AI</span>
              </div>
            </div>

            <div className="relative lg:ml-12 -mt-20">
              {/* Enhanced blob animations - moved to match red circle area */}
              <div className="absolute top-1/2 right-0 transform translate-x-1/4 -translate-y-1/2">
                <div className="relative w-[400px] h-[400px]">
                  <div className="absolute top-0 -left-4 w-72 h-72 bg-secondary-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                  <div className="absolute top-0 -right-4 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                  <div className="absolute -bottom-8 left-20 w-72 h-72 bg-secondary-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>
              </div>
              <div className="relative z-10">
                <div className="relative w-full max-w-lg mx-auto">
                  <Image
                    src="/hero-illustration.svg"
                    alt="AI and Mobile App Development"
                    width={600}
                    height={600}
                    className="w-full h-auto filter drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>
              {/* Enhanced decorative elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full border border-white/20 animate-spin-slow"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] rounded-full border border-white/10 animate-spin-slow-reverse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Apps Section */}
      <section className="bg-primary-900 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Trusted By</h2>
            <p className="text-xl text-white/70">Innovative solutions powering modern businesses</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
              <div key={index} className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex flex-col h-full">
                  <div className="mb-6">
                    <div className="w-24 h-24 bg-white/10 rounded-xl p-4 mb-4">
                      <div className="relative w-full h-full">
                        <Image
                          src={app.logo}
                          alt={app.name}
                          fill
                          className="object-cover rounded-xl"
                          sizes="(max-width: 768px) 96px, 96px"
                          priority={index < 4}
                        />
                      </div>
                    </div>
                    <h3 className="text-white text-xl font-semibold mb-2">
                      {app.name}
                    </h3>
                    <p className="text-white/60 text-sm font-medium">
                      {app.industry}
                    </p>
                  </div>
                  <p className="text-white/80 text-base leading-relaxed">
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Accelerate Your Digital Transformation</h2>
            <p className="text-gray-600">Leverage our expertise to build innovative solutions that give you a competitive edge.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              },
              {
                title: "UI/UX Design",
                description: "User-centered design that drives engagement and conversions",
                icon: "/icons/design.svg"
              },
              {
                title: "24/7 Support",
                description: "Dedicated support team ensuring your solutions run smoothly",
                icon: "/icons/support.svg"
              }
            ].map((feature, index) => (
              <div key={index} className="card group">
                <div className="mb-6 relative">
                  <div className="absolute -inset-2 bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={48}
                    height={48}
                    className="w-12 h-12 relative"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
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
                title: "Cloud & DevOps",
                description: "Robust cloud infrastructure and MLOps practices to deploy, scale, and manage your applications efficiently.",
                icon: "/icons/cloud.svg",
                features: [
                  "Multi-Cloud Infrastructure (AWS/GCP/Azure)",
                  "CI/CD Pipeline Implementation",
                  "MLOps & Model Deployment",
                  "Cloud Migration & Optimization",
                  "24/7 Infrastructure Monitoring"
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
                  <a href="#contact" className="btn-primary">
                    Get Started
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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