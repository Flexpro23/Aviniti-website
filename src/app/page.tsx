'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import Services from '@/components/Services';
import Expertise from '@/components/Expertise';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ContactPopup from '@/components/ContactPopup';
import AIEstimateModal from '@/components/AIEstimate/AIEstimateModal';
import FloatingContact from '@/components/FloatingContact';
import ReadyMadeSolutions from '@/components/ReadyMadeSolutions';

export default function Home() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAIEstimateOpen, setIsAIEstimateOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { dir } = useLanguage();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only render the full content after mounting on the client
  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <main dir={dir} className="min-h-screen">
      <Navbar />
      <Hero 
        onEstimateClick={() => setIsAIEstimateOpen(true)} 
        onConsultationClick={() => setIsContactOpen(true)} 
      />
      <Projects />
      <div id="services-section">
        <Services />
      </div>
      <div id="ready-made-solutions">
        <ReadyMadeSolutions onContactClick={() => setIsContactOpen(true)} />
      </div>
      <Expertise />
      <About />
      <div id="contact-section">
        <Contact onContactClick={() => setIsContactOpen(true)} />
      </div>
      <Footer />
      
      <FloatingContact onContactClick={() => setIsContactOpen(true)} />
      
      <ContactPopup 
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <AIEstimateModal
        isOpen={isAIEstimateOpen}
        onClose={() => setIsAIEstimateOpen(false)}
      />
    </main>
  );
} 