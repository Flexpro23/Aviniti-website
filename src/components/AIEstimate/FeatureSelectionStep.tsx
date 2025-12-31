'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';
import { AIAnalysisResult, Feature } from '@/types/report';
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
    aiAnalysis.essentialFeatures.map(feature => ({ ...feature, isSelected: true }))
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

  // Custom Feature State
  const [isCustomFeatureModalOpen, setIsCustomFeatureModalOpen] = useState(false);
  const [customFeature, setCustomFeature] = useState({
    name: '',
    description: '',
    costEstimate: '',
    timeEstimate: ''
  });

  const handleAddCustomFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFeature.name || !customFeature.costEstimate) return;

    const newFeature: Feature = {
      id: `custom-${Date.now()}`,
      name: customFeature.name,
      description: customFeature.description || 'Custom feature added by user',
      purpose: 'Custom',
      costEstimate: customFeature.costEstimate.startsWith('$') ? customFeature.costEstimate : `$${customFeature.costEstimate}`,
      timeEstimate: customFeature.timeEstimate || '3 days',
      category: 'Custom',
      isSelected: true
    };

    setEnhancementFeatures(prev => [newFeature, ...prev]);
    setIsCustomFeatureModalOpen(false);
    setCustomFeature({ name: '', description: '', costEstimate: '', timeEstimate: '' });
    
    setNotification({
      message: language === 'en' ? 'Custom feature added successfully!' : 'تم إضافة الميزة المخصصة بنجاح!',
      type: 'info'
    });
  };

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

  // Scroll left function
  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const cardWidth = 320 + 24; // card width + gap
      container.scrollTo({
        left: container.scrollLeft - cardWidth,
        behavior: 'smooth'
      });
    }
  };

  // Scroll right function
  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const cardWidth = 320 + 24; // card width + gap
      container.scrollTo({
        left: container.scrollLeft + cardWidth,
        behavior: 'smooth'
      });
    }
  };

  // Dependency Rules
  const DEPENDENCY_RULES = [
    {
      triggers: ['notification', 'chat', 'message', 'profile', 'social', 'comment', 'login', 'sign up'],
      requires: ['authentication', 'login', 'sign up', 'account'],
      message: language === 'en' ? 'requires User Authentication' : 'يتطلب مصادقة المستخدم'
    },
    {
      triggers: ['payment', 'subscription', 'checkout', 'order', 'cart'],
      requires: ['authentication', 'login', 'sign up', 'account'],
      message: language === 'en' ? 'requires User Authentication' : 'يتطلب مصادقة المستخدم'
    },
    {
      triggers: ['map', 'location', 'gps', 'delivery'],
      requires: ['map', 'location', 'gps'],
      message: language === 'en' ? 'requires Maps Integration' : 'يتطلب دمج الخرائط'
    }
  ];

  const [notification, setNotification] = useState<{message: string, type: 'info' | 'warning'} | null>(null);

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const toggleFeatureSelection = (id: string) => {
    const allCurrentFeatures = [...essentialFeatures, ...enhancementFeatures];
    const targetFeature = allCurrentFeatures.find(f => f.id === id);
    
    if (!targetFeature) return;

    const isSelecting = !targetFeature.isSelected;
    
    // Logic for selecting a feature
    if (isSelecting) {
      let featureToAutoSelect: Feature | undefined;
      let dependencyReason = '';

      // Check if this feature triggers any dependency
      for (const rule of DEPENDENCY_RULES) {
        const nameLower = targetFeature.name.toLowerCase();
        if (rule.triggers.some(t => nameLower.includes(t))) {
          // Check if we already satisfy the requirement
          const satisfies = allCurrentFeatures.some(f => 
            f.isSelected && rule.requires.some(r => f.name.toLowerCase().includes(r))
          );

          if (!satisfies) {
            // Find a feature that can satisfy this
            featureToAutoSelect = allCurrentFeatures.find(f => 
              !f.isSelected && rule.requires.some(r => f.name.toLowerCase().includes(r))
            );
            if (featureToAutoSelect) {
              dependencyReason = rule.message;
              break; // Found a dependency to enforce
            }
          }
        }
      }

      // Apply selection
      const updateFeatures = (features: Feature[]) => features.map(f => {
        if (f.id === id) return { ...f, isSelected: true };
        if (featureToAutoSelect && f.id === featureToAutoSelect.id) return { ...f, isSelected: true };
        return f;
      });

      setEssentialFeatures(prev => updateFeatures(prev));
      setEnhancementFeatures(prev => updateFeatures(prev));

      if (featureToAutoSelect) {
        setNotification({
          message: language === 'en' 
            ? `Auto-selected ${featureToAutoSelect.name} as ${targetFeature.name} ${dependencyReason}.`
            : `تم تحديد ${featureToAutoSelect.name} تلقائيًا لأن ${targetFeature.name} ${dependencyReason}.`,
          type: 'info'
        });
      }

    } else {
      // Logic for deselecting a feature
      // Check if any OTHER selected feature depends on this one
      // This is harder because dependencies are defined "forward".
      // We need to see if any currently selected feature requires THIS feature.
      
      const dependentFeatures: Feature[] = [];
      
      // For every OTHER selected feature, check if it requires THIS feature
      const otherSelected = allCurrentFeatures.filter(f => f.isSelected && f.id !== id);
      
      for (const other of otherSelected) {
        for (const rule of DEPENDENCY_RULES) {
           if (rule.triggers.some(t => other.name.toLowerCase().includes(t))) {
             // The 'other' feature requires something from 'rule.requires'
             // Does THIS feature satisfy that?
             if (rule.requires.some(r => targetFeature.name.toLowerCase().includes(r))) {
               // Yes, we are deselecting a requirement. 
               // Are there OTHER selected features that also satisfy it?
               const alternatives = otherSelected.filter(f => 
                 f.id !== other.id && // not the dependent one
                 rule.requires.some(r => f.name.toLowerCase().includes(r))
               );
               
               if (alternatives.length === 0) {
                 dependentFeatures.push(other);
               }
             }
           }
        }
      }

      if (dependentFeatures.length > 0) {
        // Warn user
        const dependentNames = dependentFeatures.map(f => f.name).join(', ');
        const confirmMessage = language === 'en'
          ? `Deselecting ${targetFeature.name} will also deselect: ${dependentNames} because they depend on it. Continue?`
          : `إلغاء تحديد ${targetFeature.name} سيؤدي أيضًا إلى إلغاء تحديد: ${dependentNames} لأنها تعتمد عليه. هل تريد الاستمرار؟`;
          
        if (!window.confirm(confirmMessage)) {
          return; // Cancel deselect
        }
        
        // Deselect target AND dependents
        const idsToDeselect = [id, ...dependentFeatures.map(f => f.id)];
        
        const updateFeatures = (features: Feature[]) => features.map(f => 
          idsToDeselect.includes(f.id) ? { ...f, isSelected: false } : f
        );
        
        setEssentialFeatures(prev => updateFeatures(prev));
        setEnhancementFeatures(prev => updateFeatures(prev));
        
      } else {
        // Just deselect target
        const updateFeatures = (features: Feature[]) => features.map(f => 
          f.id === id ? { ...f, isSelected: false } : f
        );
        setEssentialFeatures(prev => updateFeatures(prev));
        setEnhancementFeatures(prev => updateFeatures(prev));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit([...essentialFeatures, ...enhancementFeatures]);
  };

  const allFeatures = [...essentialFeatures, ...enhancementFeatures];
  const selectedFeatures = allFeatures.filter(feature => feature.isSelected);
  
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

      {/* Notification Toast */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-xl border-l-4 ${
            notification.type === 'warning' ? 'bg-amber-50 border-amber-500 text-amber-800' : 'bg-blue-50 border-blue-500 text-blue-800'
          }`}
        >
          <div className="flex items-center">
            <svg className={`w-5 h-5 mr-2 ${notification.type === 'warning' ? 'text-amber-500' : 'text-blue-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {notification.type === 'warning' ? (
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              ) : (
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
            <p className="font-medium">{notification.message}</p>
          </div>
        </motion.div>
      )}

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
                  isSelected={feature.isSelected || false}
                  onToggle={toggleFeatureSelection}
                  category="essential"
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Section 2: Enhancement Features - Improved Grid Layout */}
        <motion.section variants={sectionVariants}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-slate-blue-500 rounded-xl flex items-center justify-center mr-4 shadow-sm">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-blue-600">Enhancement Features</h3>
                <p className="text-base text-slate-blue-500">Optional features to make your app stand out</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCustomFeatureModalOpen(true)}
              className="flex items-center px-4 py-2 bg-white border-2 border-dashed border-slate-blue-300 rounded-xl text-slate-blue-600 hover:bg-slate-blue-50 hover:border-slate-blue-400 transition-all text-sm font-medium group"
            >
              <svg className="w-5 h-5 mr-2 text-slate-blue-400 group-hover:text-slate-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {language === 'en' ? 'Add Custom Feature' : 'إضافة ميزة مخصصة'}
            </button>
          </div>

          {/* Compact Grid Layout for Enhancement Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enhancementFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-md group ${
                  feature.isSelected 
                    ? 'border-bronze-500 bg-bronze-50/30' 
                    : 'border-gray-100 bg-white hover:border-bronze-200'
                }`}
                onClick={() => toggleFeatureSelection(feature.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900 pr-8 leading-tight">{feature.name}</h4>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    feature.isSelected 
                      ? 'border-bronze-500 bg-bronze-500' 
                      : 'border-gray-300 group-hover:border-bronze-300'
                  }`}>
                    {feature.isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mb-3 line-clamp-2 min-h-[2.5em]">{feature.description}</p>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-600">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {feature.timeEstimate}
                  </span>
                  <span className="font-bold text-bronze-600 text-sm">{feature.costEstimate}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Navigation Buttons */}
        <motion.div
          className="flex flex-col gap-4 pt-8 border-t border-slate-blue-100"
          variants={sectionVariants}
        >
          <button
            type="submit"
            disabled={isProcessing || selectedFeatures.length === 0}
            className={`flex items-center justify-center w-full px-6 py-3 bg-bronze-500 text-white font-semibold rounded-xl transition-all duration-300 ${
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

          <button
            type="button"
            onClick={onBack}
            className="flex items-center justify-center w-full px-6 py-3 text-slate-blue-600 border border-slate-blue-300 rounded-xl hover:bg-slate-blue-50 transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {language === 'en' ? 'Back' : 'رجوع'}
          </button>
        </motion.div>
      </form>

      {/* Custom Feature Modal */}
      {isCustomFeatureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
          >
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              {language === 'en' ? 'Add Custom Feature' : 'إضافة ميزة مخصصة'}
            </h3>
            <form onSubmit={handleAddCustomFeature} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Feature Name' : 'اسم الميزة'} *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={customFeature.name}
                  onChange={e => setCustomFeature({...customFeature, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Description' : 'الوصف'}
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  value={customFeature.description}
                  onChange={e => setCustomFeature({...customFeature, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Est. Cost ($)' : 'التكلفة المقدرة'} *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="500"
                    value={customFeature.costEstimate}
                    onChange={e => setCustomFeature({...customFeature, costEstimate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Est. Time (days)' : 'الوقت المقدر (أيام)'}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="3 days"
                    value={customFeature.timeEstimate}
                    onChange={e => setCustomFeature({...customFeature, timeEstimate: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsCustomFeatureModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {language === 'en' ? 'Cancel' : 'إلغاء'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {language === 'en' ? 'Add Feature' : 'إضافة'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Live Summary Bar */}
      <LiveSummaryBar
        selectedFeatures={selectedFeatures}
        totalFeatures={allFeatures.length}
      />
    </motion.div>
  );
} 