'use client';
import { useState, useEffect, Suspense, lazy } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import Services from '@/components/Services';
// Use lazy loading for components that aren't immediately visible
const Expertise = lazy(() => import('@/components/Expertise'));
const About = lazy(() => import('@/components/About'));
const Footer = lazy(() => import('@/components/Footer'));
import ContactPopup from '@/components/ContactPopup';
const AIEstimateModal = lazy(() => import('@/components/AIEstimate/AIEstimateModal'));
const ReadyMadeSolutions = lazy(() => import('@/components/ReadyMadeSolutions'));

// Loading fallback component
const LoadingFallback = () => <div className="min-h-[200px] flex items-center justify-center">
  <div className="animate-pulse w-full h-48 bg-gray-100 rounded-lg"></div>
</div>;

export default function Home() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAIEstimateOpen, setIsAIEstimateOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const { dir } = useLanguage();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Function to open contact popup with specific subject
  const openContactWithSubject = (subject: string) => {
    setContactSubject(subject);
    setIsContactOpen(true);
  };

  // Only render the full content after mounting on the client
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">Loading...</div>
          <div className="text-sm text-gray-500">Preparing content...</div>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">Loading...</div>
          <div className="text-sm text-gray-500">Preparing content...</div>
        </div>
      </div>
    }>
    <main dir={dir} className="min-h-screen">
      <Navbar />
      {/* Hero section with primary heading */}
      <header role="banner" id="hero-section">
        <Hero 
          onEstimateClick={() => setIsAIEstimateOpen(true)} 
          onConsultationClick={() => openContactWithSubject('Free Consultation Request')} 
        />
      </header>
      {/* Main content sections */}
      <div role="main">
        <Projects />
        <div id="services-section">
          <Services />
        </div>
        <div id="ready-made-solutions">
          <Suspense fallback={<LoadingFallback />}>
            <ReadyMadeSolutions onContactClick={(solutionTitle) => openContactWithSubject(`Ready-Made Solution: ${solutionTitle}`)} />
          </Suspense>
        </div>
        <Suspense fallback={<LoadingFallback />}>
          <Expertise />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <About />
        </Suspense>
      </div>
      <Suspense fallback={<LoadingFallback />}>
        <Footer />
      </Suspense>
      
      <ContactPopup 
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        initialSubject={contactSubject}
      />

        <Suspense fallback={<LoadingFallback />}>
          <AIEstimateModal
            isOpen={isAIEstimateOpen}
            onClose={() => setIsAIEstimateOpen(false)}
          />
        </Suspense>
    </main>
    </Suspense>
  );
} 