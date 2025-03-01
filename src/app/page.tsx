'use client';
import { useState, useEffect } from 'react';
import { PersonalDetails } from '../lib/firebase-utils';
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
import UserInfoForm from '@/components/UserInfoForm';
import AppDescriptionForm from '@/components/AppDescriptionForm';

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
      <Hero onEstimateClick={() => setIsUserInfoOpen(true)} />
      <Projects />
      <Services />
      <Expertise />
      <About />
      <Contact onContactClick={() => setIsContactOpen(true)} />
      <Footer />
      
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
    </main>
  );
} 