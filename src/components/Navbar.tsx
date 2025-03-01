'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ContactPopup from './ContactPopup';
import NavLinks from './NavLinks';
import { useLanguage } from '@/lib/context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { t, dir } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white shadow-lg py-2' 
            : 'bg-transparent py-4'
        }`}
        dir={dir}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex flex-col">
                <span className={`nav-logo-text text-2xl transition-colors ${
                  isScrolled ? 'text-primary-900' : 'text-white'
                }`}>
                  AVINITI
                </span>
                <span className={`nav-logo-subtext transition-colors ${
                  isScrolled ? 'text-primary-700' : 'text-gray-200'
                }`}>
                  YOUR IDEAS, OUR REALITY
                </span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <NavLinks 
                isScrolled={isScrolled}
                onContactClick={() => setIsContactOpen(true)}
              />
              <LanguageSwitcher isScrolled={isScrolled} />
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-md transition-colors ${
                  isScrolled ? 'text-primary-900 hover:text-primary-600' : 'text-white hover:text-blue-200'
                }`}
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
              <a 
                href="#services" 
                className="block px-4 py-3 text-primary-900 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.navigation.services}
              </a>
              <a 
                href="#about" 
                className="block px-4 py-3 text-primary-900 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.navigation.about}
              </a>
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsContactOpen(true);
                }}
                className="block w-full text-left px-4 py-3 text-primary-900 hover:text-primary-600 transition-colors"
              >
                {t.navigation.contact}
              </button>
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
      />
    </>
  );
} 