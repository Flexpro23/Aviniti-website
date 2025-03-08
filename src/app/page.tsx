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
    return null; // or a loading spinner
  }

  return (
    <main dir={dir} className="min-h-screen">
      <Navbar />
      <Hero 
        onEstimateClick={() => setIsAIEstimateOpen(true)} 
        onConsultationClick={() => openContactWithSubject('Free Consultation Request')} 
      />
      <Projects />
      <div id="services-section">
        <Services />
      </div>
      <div id="ready-made-solutions">
        <ReadyMadeSolutions onContactClick={(solutionTitle) => openContactWithSubject(`Ready-Made Solution: ${solutionTitle}`)} />
      </div>
      <Expertise />
      <About />
      <div id="contact-section">
        <Contact onContactClick={() => openContactWithSubject('General Inquiry')} />
      </div>
      <Footer />
      
      <FloatingContact onContactClick={() => openContactWithSubject('Website Inquiry')} />
      
      <ContactPopup 
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        initialSubject={contactSubject}
      />

      <AIEstimateModal
        isOpen={isAIEstimateOpen}
        onClose={() => setIsAIEstimateOpen(false)}
      />
    </main>
  );
} 