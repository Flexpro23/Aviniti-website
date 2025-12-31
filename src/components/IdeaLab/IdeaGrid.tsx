'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneratedIdea } from './types';
import IdeaCard from './IdeaCard';
import { useLanguage } from '@/lib/context/LanguageContext';
import { FaRedo, FaArrowRight, FaArrowLeft, FaLightbulb, FaRocket, FaSpinner, FaChartBar } from 'react-icons/fa';

interface IdeaGridProps {
  ideas: GeneratedIdea[];
  onSelectIdea: (idea: GeneratedIdea) => void;
  onGenerateMore: () => Promise<void>;
  onProceedToEstimate: (idea: GeneratedIdea) => void;
  onBack: () => void;
  isGenerating: boolean;
}

const IdeaGrid: React.FC<IdeaGridProps> = ({
  ideas,
  onSelectIdea,
  onGenerateMore,
  onProceedToEstimate,
  onBack,
  isGenerating
}) => {
  const { language, dir } = useLanguage();
  const [selectedIdea, setSelectedIdea] = useState<GeneratedIdea | null>(null);
  const isArabic = language === 'ar';

  const handleSelectIdea = (idea: GeneratedIdea) => {
    if (selectedIdea?.id === idea.id) {
      setSelectedIdea(null);
    } else {
      setSelectedIdea(idea);
      onSelectIdea(idea);
    }
  };

  const handleProceed = () => {
    if (selectedIdea) {
      onProceedToEstimate(selectedIdea);
    }
  };

  // Only show first 3 ideas
  const displayedIdeas = ideas.slice(0, 3);

  return (
    <div className="min-h-screen" dir={dir}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-bronze-400 to-bronze-600 rounded-2xl mb-4 shadow-lg">
          <FaLightbulb className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-blue-700 mb-3">
          {isArabic ? 'أفكارك الشخصية' : 'Your Personalized Ideas'}
        </h2>
        <p className="text-slate-blue-500 text-lg max-w-2xl mx-auto">
          {isArabic 
            ? 'بناءً على إجاباتك، إليك 3 أفكار صممناها خصيصًا لك. اضغط على أي فكرة لمعرفة المزيد'
            : 'Based on your answers, here are 3 ideas tailored just for you. Click any card to learn more'}
        </p>
      </motion.div>

      {/* Ideas Grid - 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <AnimatePresence>
          {displayedIdeas.map((idea, index) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              index={index}
              isSelected={selectedIdea?.id === idea.id}
              onSelect={handleSelectIdea}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Generate More Ideas Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center mb-8"
      >
        <button
          onClick={() => !isGenerating && onGenerateMore()}
          disabled={isGenerating}
          className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all ${
            isGenerating
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-slate-blue-50 text-slate-blue-600 hover:bg-slate-blue-100 hover:shadow-lg'
          } ${isArabic ? 'flex-row-reverse' : ''}`}
        >
          {isGenerating ? (
            <>
              <FaSpinner className="w-5 h-5 animate-spin" />
              {isArabic ? 'جاري إنشاء أفكار جديدة...' : 'Generating new ideas...'}
            </>
          ) : (
            <>
              <FaRedo className="w-5 h-5" />
              {isArabic ? 'لم تعجبني؟ اكتشف أفكار أخرى' : "Don't like these? Generate new ideas"}
            </>
          )}
        </button>
      </motion.div>

      {/* Back Button */}
      {!selectedIdea && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center"
        >
          <button
            onClick={onBack}
            className={`flex items-center gap-2 px-6 py-3 text-slate-blue-600 hover:text-slate-blue-800 transition-colors ${
              isArabic ? 'flex-row-reverse' : ''
            }`}
          >
            {isArabic ? <FaArrowRight className="w-4 h-4" /> : <FaArrowLeft className="w-4 h-4" />}
            {isArabic ? 'العودة للأسئلة' : 'Back to Questions'}
          </button>
        </motion.div>
      )}

      {/* Selected Idea Action Bar */}
      <AnimatePresence>
        {selectedIdea && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50"
          >
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-bronze-100 rounded-xl flex items-center justify-center">
                    <FaLightbulb className="w-6 h-6 text-bronze-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-blue-700">{selectedIdea.title}</h4>
                    <p className="text-sm text-slate-blue-500 line-clamp-1">
                      {selectedIdea.oneLiner}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedIdea(null)}
                    className="px-6 py-3 text-slate-blue-600 hover:bg-slate-blue-50 rounded-xl transition-colors font-medium"
                  >
                    {isArabic ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    onClick={handleProceed}
                    className={`flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-bronze-500 to-bronze-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:from-bronze-600 hover:to-bronze-700 transition-all ${
                      isArabic ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <FaChartBar className="w-5 h-5" />
                    {isArabic ? 'تحليل وتقدير هذه الفكرة' : 'Analyze & Estimate'}
                    {isArabic ? <FaArrowLeft className="w-4 h-4" /> : <FaArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed action bar */}
      {selectedIdea && <div className="h-24" />}
    </div>
  );
};

export default IdeaGrid;
