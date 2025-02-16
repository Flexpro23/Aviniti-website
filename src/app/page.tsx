'use client';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import ContactSection from '../components/ContactSection';
import { useState } from 'react';
import ContactPopup from '../components/ContactPopup';
import EstimateComponent from '../components/EstimateComponent';
import IdeaDescriptionComponent from '../components/IdeaDescriptionComponent';
import QuestionnaireComponent from '../components/QuestionnaireComponent';
import ProcessingComponent from '../components/ProcessingComponent';

interface UserDetails {
  fullName: string;
  phoneNumber: string;
  companyName: string;
  emailAddress: string;
}

interface IdeaDetails {
  description: string;
  audioUrl: string | null;
}

interface QuestionnaireAnswers {
  targetAudience: string[];
  platformType: string;
  developmentTimeline: string;
  budget: string;
  keyFeatures: string[];
  monetizationStrategy: string[];
  competitorNames: string;
  securityRequirements: string[];
  scalabilityNeeds: string;
  integrationRequirements: string[];
  customization: string;
  maintenanceSupport: string[];
}

export default function Home() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isEstimateOpen, setIsEstimateOpen] = useState(false);
  const [isIdeaDescriptionOpen, setIsIdeaDescriptionOpen] = useState(false);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [isProcessingOpen, setIsProcessingOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [ideaDetails, setIdeaDetails] = useState<IdeaDetails | null>(null);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<QuestionnaireAnswers | null>(null);

  const handleEstimateContinue = (details: UserDetails) => {
    setUserDetails(details);
    setIsEstimateOpen(false);
    setIsIdeaDescriptionOpen(true);
  };

  const handleIdeaDescriptionBack = () => {
    setIsIdeaDescriptionOpen(false);
    setIsEstimateOpen(true);
  };

  const handleIdeaDescriptionContinue = (details: IdeaDetails) => {
    setIdeaDetails(details);
    setIsIdeaDescriptionOpen(false);
    setIsQuestionnaireOpen(true);
  };

  const handleQuestionnaireBack = () => {
    setIsQuestionnaireOpen(false);
    setIsIdeaDescriptionOpen(true);
  };

  const handleQuestionnaireContinue = (answers: QuestionnaireAnswers) => {
    setQuestionnaireAnswers(answers);
    setIsQuestionnaireOpen(false);
    setIsProcessingOpen(true);
  };

  const handleProcessingBack = () => {
    setIsProcessingOpen(false);
    setIsQuestionnaireOpen(true);
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
          {/* Improved Network Background */}
          <div className="absolute inset-0 opacity-10" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
          {/* Added subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent"></div>
        </div>

        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight">
                Transform Your Vision
                <span className="text-secondary-400 block mt-2">With AI-Powered Apps</span>
                <span className="text-2xl lg:text-3xl text-gray-300 block mt-4">From Innovative Concept to Enterprise Scale</span>
              </h1>
              <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto lg:mx-0">
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
              
              {/* New AI Estimate Button */}
              <div className="mt-8 flex justify-center lg:justify-start">
                <div className="flex flex-col items-center sm:items-start">
                  <button
                    onClick={() => setIsEstimateOpen(true)}
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

              <div className="trusted-by-section mt-20">
                <p className="text-gray-300 mb-8 text-xl font-medium">Trusted by Industry Leaders</p>
                <div className="company-logos grid grid-cols-2 md:grid-cols-4 gap-10">
                  {[
                    { 
                      name: 'TechFlow Solutions',
                      logo: '/company-logos/techflow.svg',
                      testimonial: "Transformed our workflow efficiency by 200%",
                      industry: 'Enterprise Software'
                    },
                    {
                      name: 'HealthTech Innovations',
                      logo: '/company-logos/healthtech.svg',
                      testimonial: "Revolutionary AI-powered patient care system",
                      industry: 'Healthcare Technology'
                    },
                    {
                      name: 'SmartFinance AI',
                      logo: '/company-logos/smartfinance.svg',
                      testimonial: "Reduced processing time by 80%",
                      industry: 'FinTech'
                    },
                    {
                      name: 'EduTech Global',
                      logo: '/company-logos/edutech.svg',
                      testimonial: "Seamless integration of AI learning tools",
                      industry: 'Education Technology'
                    }
                  ].map((company, i) => (
                    <div key={i} className="glass rounded-xl p-6 flex flex-col items-center justify-center group hover:bg-white/20 transition-all duration-300">
                      <div className="w-20 h-20 mb-4 bg-white/10 rounded-lg flex items-center justify-center">
                        <svg className="w-12 h-12 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </div>
                      <span className="text-white font-medium text-base group-hover:scale-105 transition-transform">
                        {company.name}
                      </span>
                      <span className="text-white/80 text-sm mt-2 text-center">
                        {company.testimonial}
                      </span>
                      <span className="text-white/60 text-xs mt-1">
                        {company.industry}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative lg:ml-12">
              <div className="relative z-10 animate-float">
                <div className="relative w-full max-w-lg mx-auto">
                  {/* Enhanced blob animations */}
                  <div className="absolute top-0 -left-4 w-72 h-72 bg-secondary-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                  <div className="absolute top-0 -right-4 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                  <div className="absolute -bottom-8 left-20 w-72 h-72 bg-secondary-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                  <div className="relative">
                    <Image
                      src="/hero-illustration-new.svg"
                      alt="AI and Mobile App Development"
                      width={600}
                      height={600}
                      className="w-full h-auto filter drop-shadow-2xl"
                      priority
                    />
                  </div>
                </div>
              </div>
              {/* Enhanced decorative elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full border border-white/20 animate-spin-slow"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] rounded-full border border-white/10 animate-spin-slow-reverse"></div>
            </div>
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

      <EstimateComponent
        isOpen={isEstimateOpen}
        onClose={() => setIsEstimateOpen(false)}
        onContinue={handleEstimateContinue}
      />

      <IdeaDescriptionComponent
        isOpen={isIdeaDescriptionOpen}
        onClose={() => setIsIdeaDescriptionOpen(false)}
        onBack={handleIdeaDescriptionBack}
        onContinue={handleIdeaDescriptionContinue}
      />

      <QuestionnaireComponent
        isOpen={isQuestionnaireOpen}
        onClose={() => setIsQuestionnaireOpen(false)}
        onBack={handleQuestionnaireBack}
        onContinue={handleQuestionnaireContinue}
      />

      <ProcessingComponent
        isOpen={isProcessingOpen}
        onClose={() => setIsProcessingOpen(false)}
        onBack={handleProcessingBack}
        userDetails={userDetails!}
        ideaDetails={ideaDetails!}
        questionnaireAnswers={questionnaireAnswers!}
      />

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