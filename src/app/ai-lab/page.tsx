'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import ChatInterface from '@/components/AIIdeaLab/ChatInterface';
import { useLanguage } from '@/lib/context/LanguageContext';

// Lobby component for language selection
const Lobby = ({ onLanguageSelect }: { onLanguageSelect: (lang: 'en' | 'ar') => void }) => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageSelect = (lang: 'en' | 'ar') => {
    setLanguage(lang);
    onLanguageSelect(lang);
  };

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto px-6"
      >
        {/* Animated bronze infinity logo */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 mx-auto mb-8 bg-bronze rounded-full flex items-center justify-center"
        >
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </motion.div>

        {/* Welcome text */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-slate-blue mb-8"
        >
          Welcome to the Aviniti AI Strategy Bot
        </motion.h1>

        {/* Language selection buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <button
            onClick={() => handleLanguageSelect('en')}
            className="w-full bg-slate-blue text-white py-4 px-8 rounded-xl font-semibold hover:bg-slate-blue-600 transition-colors duration-300 shadow-lg"
          >
            Start in English
          </button>
          
          <button
            onClick={() => handleLanguageSelect('ar')}
            className="w-full bg-bronze text-white py-4 px-8 rounded-xl font-semibold hover:bg-bronze-600 transition-colors duration-300 shadow-lg"
          >
            ابدأ باللغة العربية
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default function AILabPage() {
  const { dir } = useLanguage();
  const [sessionStarted, setSessionStarted] = useState(false);

  const handleLanguageSelect = (lang: 'en' | 'ar') => {
    setSessionStarted(true);
  };

  return (
    <main dir={dir} className="min-h-screen">
      <Navbar />
      
      {!sessionStarted ? (
        <Lobby onLanguageSelect={handleLanguageSelect} />
      ) : (
        <div className="pt-16">
          <ChatInterface />
        </div>
      )}
    </main>
  );
}
