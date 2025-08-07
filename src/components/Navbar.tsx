'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ContactPopup from './ContactPopup';
import NavLinks from './NavLinks';
import { useLanguage } from '@/lib/context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const { t, dir } = useLanguage();
  const pathname = usePathname();
  
  // Check if we're on the homepage (/) or a page with a dark background
  const isHomePage = pathname === '/';
  const needsBackgroundWhenNotScrolled = !isHomePage;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Set scrolled state for styling
      setIsScrolled(currentScrollY > 20);
      
      // Handle visibility - hide when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide navbar
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show navbar
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Function to open contact popup with specific subject
  const openContactWithSubject = (subject: string) => {
    setContactSubject(subject);
    setIsContactOpen(true);
  };

  return (
    <>
      <nav 
        className={`fixed w-full z-50 bg-slate-blue-600 shadow-lg py-4 transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        dir={dir}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2">
                {/* Logo Image */}
                <div className="relative w-20 h-20">
                  <Image
                    src="/justLogo.png"
                    alt="Aviniti Logo"
                    fill
                    className="object-contain"
                    sizes="80px"
                    priority
                  />
                </div>
                {/* Logo Text */}
                <div className="flex flex-col">
                  <span className="nav-logo-text text-3xl text-white">
                    AVINITI
                  </span>
                  <span className="nav-logo-subtext text-base text-gray-200">
                    YOUR IDEAS, OUR REALITY
                  </span>
                </div>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center justify-center space-x-6 flex-1">
              <NavLinks 
                isScrolled={false}
              />
              <LanguageSwitcher isScrolled={false} />
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md transition-colors text-white hover:text-slate-blue-200"
                aria-label={isMenuOpen ? "Close main menu" : "Open main menu"}
                aria-expanded={isMenuOpen}
              >
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute w-full">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
              <Link 
                href="/estimate" 
                className="block px-4 py-3 text-slate-blue-600 hover:text-bronze-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Get AI Estimate
              </Link>
              <Link 
                href="/faq" 
                className="block px-4 py-3 text-slate-blue-600 hover:text-bronze-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.navigation.faq || 'FAQ'}
              </Link>
              <Link 
                href="/blog" 
                className="block px-4 py-3 text-slate-blue-600 hover:text-bronze-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-left px-4 py-3 text-slate-blue-600 hover:text-bronze-500 transition-colors"
              >
                {t.navigation.contact}
              </Link>
              <div className="px-4 py-3">
                <LanguageSwitcher isScrolled={true} />
              </div>
            </div>
          </div>
        )}
      </nav>

      <ContactPopup 
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        initialSubject={contactSubject}
      />
    </>
  );
} 