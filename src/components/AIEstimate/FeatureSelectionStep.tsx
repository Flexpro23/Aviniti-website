'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';
import { AIAnalysisResult, Feature } from './AIEstimateModal';
import FeatureCard from './FeatureCard';
import LiveSummaryBar from './LiveSummaryBar';

interface FeatureSelectionStepProps {
  aiAnalysis: AIAnalysisResult;
  onSubmit: (features: Feature[]) => void;
  onBack: () => void;
  isProcessing: boolean;
}

export default function FeatureSelectionStep({
  aiAnalysis,
  onSubmit,
  onBack,
  isProcessing
}: FeatureSelectionStepProps) {
  const { language, dir } = useLanguage();
  const [essentialFeatures, setEssentialFeatures] = useState<Feature[]>(
    aiAnalysis.essentialFeatures.map(feature => ({ ...feature, selected: true }))
  );
  const [enhancementFeatures, setEnhancementFeatures] = useState<Feature[]>(
    aiAnalysis.enhancementFeatures.map(feature => ({ ...feature }))
  );

  // Check if we're using mock data
  const isMockData = aiAnalysis.appOverview.includes("[MOCK DATA]");

  // Scroll control states
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Check scroll position
  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
      
      // Calculate scroll progress (0 to 1)
      const maxScroll = container.scrollWidth - container.clientWidth;
      const progress = maxScroll > 0 ? container.scrollLeft / maxScroll : 0;
      setScrollProgress(progress);
    }
  };

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  // Setup scroll listeners
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScroll();
      container.addEventListener('scroll', checkScroll);
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, [enhancementFeatures]);

  const toggleFeatureSelection = (id: string) => {
    // Check if it's an essential feature
    const isEssential = essentialFeatures.some(f => f.id === id);
    
    if (isEssential) {
      setEssentialFeatures(prevFeatures =>
        prevFeatures.map(feature =>
          feature.id === id ? { ...feature, selected: !feature.selected } : feature
        )
      );
    } else {
      setEnhancementFeatures(prevFeatures =>
        prevFeatures.map(feature =>
          feature.id === id ? { ...feature, selected: !feature.selected } : feature
        )
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit([...essentialFeatures, ...enhancementFeatures]);
  };

  const allFeatures = [...essentialFeatures, ...enhancementFeatures];
  const selectedFeatures = allFeatures.filter(feature => feature.selected);
  
  // Calculate estimated costs and time
  const calculateEstimates = () => {
    if (selectedFeatures.length === 0) {
      return { cost: language === 'en' ? '$0' : '0 دولار', time: language === 'en' ? '0 days' : '0 يوم' };
    }
    
    // For debugging - log all cost strings and their extracted values
    if (process.env.NODE_ENV === 'development') {
      console.log('Cost calculation debugging:');
      selectedFeatures.forEach(feature => {
        const costString = feature.costEstimate;
        const match = costString.match(/\$([0-9,]+)/);
        const extractedValue = match && match[1] ? parseInt(match[1].replace(/,/g, '')) : 'No match';
        console.log(`Feature: ${feature.name}, Cost string: ${costString}, Extracted: ${extractedValue}`);
      });
    }
    
    const costSum = selectedFeatures.reduce((total, feature) => {
      // Extract numeric value from cost strings like "$3,000" or "$500"
      const costString = feature.costEstimate;
      // Match any number after the $ symbol, with optional commas
      const match = costString.match(/\$([0-9,]+)/);
      if (match && match[1]) {
        // Remove commas and convert to integer
        return total + parseInt(match[1].replace(/,/g, ''));
      }
      return total;
    }, 0);
    
    // Extract actual time estimates from feature data
    const timeEstimates = selectedFeatures.map(feature => {
      const timeString = feature.timeEstimate;
      // Match the first number in strings like "10 days" or "2-3 days"
      const match = timeString.match(/(\d+)/);
      return match ? parseInt(match[1]) : 0;
    });
    
    // Calculate time range with parallelization factor
    // Not all tasks need to be done sequentially - some can be done in parallel
    const parallelizationFactor = 0.7; // Assume 30% efficiency from parallelization
    const totalDays = Math.ceil(
      timeEstimates.reduce((sum, time) => sum + time, 0) * parallelizationFactor
    );
    
    // Create a range around the calculated days
    const minDays = Math.max(Math.floor(totalDays * 0.9), 1);
    const maxDays = Math.ceil(totalDays * 1.1);
    
    return {
      cost: language === 'en' ? `$${costSum.toLocaleString()}` : `${costSum.toLocaleString()} دولار`,
      time: language === 'en' ? `${minDays}-${maxDays} days` : `${minDays}-${maxDays} يوم`
    };
  };
  
  const estimates = calculateEstimates();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto space-y-8 pb-40 px-4" // Extra padding for fixed summary bar
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="text-center" variants={sectionVariants}>
        <h2 className="text-3xl font-bold text-slate-blue-600 mb-4">
          🎯 Build Your Perfect App
        </h2>
        <p className="text-lg text-slate-blue-500 max-w-3xl mx-auto">
          Select features to craft your ideal application. Watch your estimate update in real-time as you build your vision.
        </p>
        
        {/* Mock Data Warning */}
        {isMockData && (
          <motion.div
            className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-amber-700 text-sm font-medium">
                Demo Mode - Connect Gemini API for personalized analysis
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Section 1: Essential Features */}
        <motion.section variants={sectionVariants} className="mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-bronze-500 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-blue-600">Essential Features</h3>
              <p className="text-base text-slate-blue-500">Core functionality recommended by our AI</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {essentialFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <FeatureCard
                  feature={feature}
                  isSelected={feature.selected}
                  onToggle={toggleFeatureSelection}
                  category="essential"
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Section 2: Enhancement Features - Horizontal Scroll */}
        <motion.section variants={sectionVariants}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-slate-blue-500 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-blue-600">Enhancement Features</h3>
                <p className="text-base text-slate-blue-500">Optional features to make your app stand out</p>
              </div>
            </div>
            
            {/* Scroll Indicator */}
            <div className="flex items-center space-x-2 text-slate-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
              <span className="text-sm">Scroll to explore</span>
            </div>
          </div>
          
          {/* Horizontal Scroll Container with Controls */}
          <div className="relative">
            {/* Left Arrow */}
            <motion.button
              type="button"
              onClick={scrollLeft}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 border-2 transition-all duration-200 ${
                canScrollLeft 
                  ? 'border-slate-blue-300 text-slate-blue-600 hover:border-bronze-400 hover:text-bronze-600 hover:shadow-xl' 
                  : 'border-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!canScrollLeft}
              animate={{ opacity: canScrollLeft ? 1 : 0.5 }}
              whileHover={canScrollLeft ? { scale: 1.05 } : {}}
              whileTap={canScrollLeft ? { scale: 0.95 } : {}}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            {/* Right Arrow */}
            <motion.button
              type="button"
              onClick={scrollRight}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 border-2 transition-all duration-200 ${
                canScrollRight 
                  ? 'border-slate-blue-300 text-slate-blue-600 hover:border-bronze-400 hover:text-bronze-600 hover:shadow-xl' 
                  : 'border-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!canScrollRight}
              animate={{ opacity: canScrollRight ? 1 : 0.5 }}
              whileHover={canScrollRight ? { scale: 1.05 } : {}}
              whileTap={canScrollRight ? { scale: 0.95 } : {}}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>

            {/* Scrollable Content */}
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto space-x-6 pb-6 px-16 carousel-container" 
              style={{
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none'
              }}
              onScroll={checkScroll}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {enhancementFeatures.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  className="flex-shrink-0 w-80"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FeatureCard
                    feature={feature}
                    isSelected={feature.selected}
                    onToggle={toggleFeatureSelection}
                    category="enhancement"
                  />
                </motion.div>
              ))}
              
              {/* End indicator */}
              <div className="flex-shrink-0 w-8 flex items-center justify-center">
                <div className="w-1 h-12 bg-gradient-to-b from-slate-blue-200 to-transparent rounded-full"></div>
              </div>
            </div>

            {/* Scroll Progress Indicator */}
            <div className="flex justify-center mt-4">
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-bronze-400 to-bronze-600 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${scrollProgress * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Navigation Buttons */}
        <motion.div
          className="flex justify-between items-center pt-8 border-t border-slate-blue-100"
          variants={sectionVariants}
        >
          <button
            type="button"
            onClick={onBack}
            className="flex items-center px-6 py-3 text-slate-blue-600 border border-slate-blue-300 rounded-xl hover:bg-slate-blue-50 transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {language === 'en' ? 'Back' : 'رجوع'}
          </button>
          
          <button
            type="submit"
            disabled={isProcessing || selectedFeatures.length === 0}
            className={`flex items-center px-8 py-4 bg-bronze-500 text-white font-semibold rounded-xl transition-all duration-300 ${
              isProcessing || selectedFeatures.length === 0
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-bronze-600 hover:scale-105 shadow-lg hover:shadow-xl'
            }`}
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {language === 'en' ? 'Creating Your Blueprint...' : 'جاري إنشاء المخطط...'}
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
                {language === 'en' ? 'Generate Executive Report' : 'إنشاء التقرير التنفيذي'}
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </motion.div>
      </form>

      {/* Live Summary Bar */}
      <LiveSummaryBar
        selectedFeatures={selectedFeatures}
        totalFeatures={allFeatures.length}
      />
    </motion.div>
  );
} 