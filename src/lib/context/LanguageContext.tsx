'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { en } from '../translations/en';
import { ar } from '../translations/ar';

// Define available languages
export type Language = 'en' | 'ar';

// Define the structure of our language context
export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Record<string, any>;
  dir: 'ltr' | 'rtl';
  t: Record<string, any>;
  refreshTranslations: () => void;
  getNestedTranslation: (path: string[], fallback?: any) => any;
}

// Create context with undefined as initial value
export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Define props for the LanguageProvider component
interface LanguageProviderProps {
  children: ReactNode;
}

// Create a provider component
export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Initialize with English as default
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<string, any>>(en);
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load saved language preference from localStorage (client-side only)
  useEffect(() => {
    if (!isClient) return;
    
    try {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error retrieving language from localStorage:', error);
    }
  }, [isClient]);

  // Update translations and document direction when language changes
  useEffect(() => {
    if (!isClient) return;

    try {
      // Save language preference to localStorage
      localStorage.setItem('language', language);

      // Update translations - use structuredClone for deep copy
      try {
        const translationsSource = language === 'en' ? en : ar;
        // Create a deep copy to prevent any reference issues
        const translationsCopy = structuredClone(translationsSource);
        setTranslations(translationsCopy);
        
        // Set direction based on language
        const newDir = language === 'ar' ? 'rtl' : 'ltr';
        setDir(newDir);
        
        // Update document direction and lang
        document.documentElement.setAttribute('dir', newDir);
        document.documentElement.setAttribute('lang', language);
        
        // Add RTL class to body when in RTL mode
        if (newDir === 'rtl') {
          document.body.classList.add('rtl');
        } else {
          document.body.classList.remove('rtl');
        }
      } catch (error) {
        console.error('Error updating translations:', error);
        // Fallback to English translations
        setTranslations(structuredClone(en));
      }
    } catch (error) {
      console.error('Error in language effect:', error);
    }
  }, [language, isClient]);

  // Function to refresh translations (useful after dynamic content changes)
  const refreshTranslations = useCallback(() => {
    if (!isClient) return;

    try {
      const translationsSource = language === 'en' ? en : ar;
      const freshTranslations = structuredClone(translationsSource);
      setTranslations(freshTranslations);
      
      // Force document attributes update
      document.documentElement.setAttribute('dir', dir);
      document.documentElement.setAttribute('lang', language);
      
      // Update body class
      if (dir === 'rtl') {
        document.body.classList.add('rtl');
      } else {
        document.body.classList.remove('rtl');
      }
    } catch (error) {
      console.error('Error refreshing translations:', error);
    }
  }, [language, dir, isClient]);

  // Helper function to safely access nested translation properties
  const getNestedTranslation = useCallback((path: string[], fallback: any = '') => {
    try {
      let current: any = translations;
      for (const key of path) {
        if (current && typeof current === 'object' && key in current) {
          current = current[key];
        } else {
          return fallback;
        }
      }
      return current || fallback;
    } catch (error) {
      console.error(`Error accessing translation path [${path.join('.')}]:`, error);
      return fallback;
    }
  }, [translations]);

  // Create context value object with all needed values
  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    translations,
    dir,
    t: translations, // Shorthand for accessing translations
    refreshTranslations,
    getNestedTranslation
  };

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};

// Create a custom hook to access the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Helper function to determine if we're server-side rendering
export function isSSR() {
  return typeof window === 'undefined';
} 