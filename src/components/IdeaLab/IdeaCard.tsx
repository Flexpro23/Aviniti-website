'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneratedIdea } from './types';
import { useLanguage } from '@/lib/context/LanguageContext';
import { 
  FaLightbulb, 
  FaUsers, 
  FaRocket, 
  FaMobile, 
  FaDesktop, 
  FaGlobe,
  FaCheck,
  FaStar,
  FaChartLine,
  FaEye,
  FaTimes,
  FaChartPie,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowRight
} from 'react-icons/fa';

interface IdeaCardProps {
  idea: GeneratedIdea;
  index: number;
  isSelected: boolean;
  onSelect: (idea: GeneratedIdea) => void;
}

const platformIcons: Record<string, React.ReactNode> = {
  ios: <FaMobile className="w-3 h-3" />,
  android: <FaMobile className="w-3 h-3" />,
  web: <FaGlobe className="w-3 h-3" />,
  desktop: <FaDesktop className="w-3 h-3" />,
  all: <FaGlobe className="w-3 h-3" />
};

const complexityColors = {
  simple: 'bg-green-100 text-green-700',
  moderate: 'bg-yellow-100 text-yellow-700',
  complex: 'bg-red-100 text-red-700'
};

const marketPotentialColors = {
  low: 'text-gray-400',
  medium: 'text-yellow-500',
  high: 'text-green-500'
};

const IdeaCard: React.FC<IdeaCardProps> = ({ 
  idea, 
  index, 
  isSelected, 
  onSelect
}) => {
  const { language, dir } = useLanguage();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const isArabic = language === 'ar';

  const getComplexityLabel = () => {
    const labels = {
      simple: isArabic ? 'بسيط' : 'Simple',
      moderate: isArabic ? 'متوسط' : 'Moderate',
      complex: isArabic ? 'معقد' : 'Complex'
    };
    return labels[idea.complexity];
  };

  const handleCardClick = () => {
    setIsPreviewOpen(true);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(idea);
  };

  return (
    <>
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.15 }}
        onClick={handleCardClick}
        className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 cursor-pointer group ${
          isSelected ? 'border-bronze-500 ring-4 ring-bronze-100' : 'border-gray-100 hover:border-bronze-200'
        }`}
        dir={dir}
      >
        {/* Selection Checkbox */}
        <div 
          className="absolute top-4 right-4 z-10"
          onClick={handleCheckboxClick}
        >
          <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer hover:scale-110 ${
            isSelected 
              ? 'bg-bronze-500 border-bronze-500' 
              : 'bg-white border-gray-300 hover:border-bronze-400'
          }`}>
            {isSelected && <FaCheck className="w-4 h-4 text-white" />}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          {/* Icon and Title */}
          <div className="flex items-start gap-4 mb-4 pr-10">
            <div className="w-14 h-14 bg-gradient-to-br from-bronze-400 to-bronze-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <FaLightbulb className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${complexityColors[idea.complexity]}`}>
                  {getComplexityLabel()}
                </span>
                <div className="flex items-center gap-0.5">
                  {[...Array(idea.marketPotential === 'high' ? 3 : idea.marketPotential === 'medium' ? 2 : 1)].map((_, i) => (
                    <FaStar key={i} className={`w-3 h-3 ${marketPotentialColors[idea.marketPotential]}`} />
                  ))}
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-blue-700 line-clamp-2">
                {idea.title}
              </h3>
            </div>
          </div>

          {/* One Liner */}
          <p className="text-slate-blue-600 text-sm leading-relaxed mb-4 line-clamp-2">
            {idea.oneLiner}
          </p>

          {/* Platforms */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            {idea.platforms.slice(0, 3).map(platform => (
              <span 
                key={platform}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
              >
                {platformIcons[platform]}
                {platform.toUpperCase()}
              </span>
            ))}
          </div>

          {/* Target Users Preview */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <FaUsers className="w-4 h-4" />
            <span className="truncate">{idea.targetUsers.slice(0, 2).join(', ')}</span>
            {idea.targetUsers.length > 2 && (
              <span className="text-xs text-gray-400">+{idea.targetUsers.length - 2}</span>
            )}
          </div>

          {/* Key Features Preview */}
          <div className="mb-4">
            <ul className="space-y-1">
              {idea.keyFeatures.slice(0, 2).map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <FaCheck className="w-3 h-3 text-bronze-500 mt-1 flex-shrink-0" />
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
              {idea.keyFeatures.length > 2 && (
                <li className="text-sm text-gray-400 pl-5">
                  +{idea.keyFeatures.length - 2} {isArabic ? 'ميزات أخرى' : 'more features'}
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* View Details Footer */}
        <div className="border-t border-gray-100 p-4 bg-gray-50 group-hover:bg-bronze-50 transition-colors">
          <div className="flex items-center justify-center gap-2 text-slate-blue-600 group-hover:text-bronze-600 font-medium">
            <FaEye className="w-4 h-4" />
            {isArabic ? 'عرض التفاصيل' : 'View Details'}
            <FaArrowRight className={`w-3 h-3 transition-transform group-hover:translate-x-1 ${isArabic ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </motion.div>

      {/* Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsPreviewOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              dir={dir}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-slate-blue-600 to-slate-blue-700 text-white p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                      <FaLightbulb className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          idea.complexity === 'simple' ? 'bg-green-500/20 text-green-200' :
                          idea.complexity === 'moderate' ? 'bg-yellow-500/20 text-yellow-200' :
                          'bg-red-500/20 text-red-200'
                        }`}>
                          {getComplexityLabel()}
                        </span>
                        <div className="flex items-center gap-1">
                          {[...Array(idea.marketPotential === 'high' ? 3 : idea.marketPotential === 'medium' ? 2 : 1)].map((_, i) => (
                            <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold mb-1">{idea.title}</h2>
                      <p className="text-slate-blue-100">{idea.oneLiner}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsPreviewOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-blue-700 mb-3 flex items-center gap-2">
                        <FaLightbulb className="w-5 h-5 text-bronze-500" />
                        {isArabic ? 'وصف الفكرة' : 'Idea Description'}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">{idea.description}</p>
                    </div>

                    {/* Target Users */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-blue-700 mb-3 flex items-center gap-2">
                        <FaUsers className="w-5 h-5 text-bronze-500" />
                        {isArabic ? 'المستخدمون المستهدفون' : 'Target Users'}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {idea.targetUsers.map((user, i) => (
                          <span key={i} className="px-3 py-1.5 bg-slate-blue-50 text-slate-blue-700 rounded-lg text-sm">
                            {user}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Key Features */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-blue-700 mb-3 flex items-center gap-2">
                        <FaRocket className="w-5 h-5 text-bronze-500" />
                        {isArabic ? 'الميزات الرئيسية' : 'Key Features'}
                      </h3>
                      <ul className="space-y-2">
                        {idea.keyFeatures.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <FaCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Market Potential Visualization */}
                    <div className="bg-gradient-to-br from-slate-blue-50 to-bronze-50 rounded-2xl p-5">
                      <h3 className="text-lg font-bold text-slate-blue-700 mb-4 flex items-center gap-2">
                        <FaChartLine className="w-5 h-5 text-bronze-500" />
                        {isArabic ? 'إمكانية السوق' : 'Market Potential'}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">{isArabic ? 'طلب السوق' : 'Market Demand'}</span>
                            <span className="font-medium text-slate-blue-700">
                              {idea.marketPotential === 'high' ? '90%' : idea.marketPotential === 'medium' ? '65%' : '40%'}
                            </span>
                          </div>
                          <div className="h-3 bg-white rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-bronze-400 to-bronze-600 rounded-full transition-all"
                              style={{ width: idea.marketPotential === 'high' ? '90%' : idea.marketPotential === 'medium' ? '65%' : '40%' }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">{isArabic ? 'فرصة النمو' : 'Growth Opportunity'}</span>
                            <span className="font-medium text-slate-blue-700">
                              {idea.marketPotential === 'high' ? '85%' : idea.marketPotential === 'medium' ? '60%' : '35%'}
                            </span>
                          </div>
                          <div className="h-3 bg-white rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all"
                              style={{ width: idea.marketPotential === 'high' ? '85%' : idea.marketPotential === 'medium' ? '60%' : '35%' }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">{isArabic ? 'الميزة التنافسية' : 'Competitive Edge'}</span>
                            <span className="font-medium text-slate-blue-700">
                              {idea.complexity === 'complex' ? '80%' : idea.complexity === 'moderate' ? '65%' : '50%'}
                            </span>
                          </div>
                          <div className="h-3 bg-white rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-slate-blue-400 to-slate-blue-600 rounded-full transition-all"
                              style={{ width: idea.complexity === 'complex' ? '80%' : idea.complexity === 'moderate' ? '65%' : '50%' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Business Model */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-blue-700 mb-3 flex items-center gap-2">
                        <FaChartPie className="w-5 h-5 text-bronze-500" />
                        {isArabic ? 'نموذج العمل' : 'Business Model'}
                      </h3>
                      <p className="text-gray-600 bg-gray-50 rounded-xl p-4">{idea.businessModel}</p>
                    </div>

                    {/* Differentiators */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-blue-700 mb-3 flex items-center gap-2">
                        <FaStar className="w-5 h-5 text-bronze-500" />
                        {isArabic ? 'ما يميز هذه الفكرة' : 'What Makes It Unique'}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {idea.differentiators.map((diff, i) => (
                          <span key={i} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200">
                            ✓ {diff}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Platforms */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-blue-700 mb-3">
                        {isArabic ? 'المنصات المستهدفة' : 'Target Platforms'}
                      </h3>
                      <div className="flex gap-3">
                        {idea.platforms.map(platform => (
                          <div key={platform} className="flex items-center gap-2 px-4 py-2 bg-slate-blue-50 rounded-xl">
                            {platformIcons[platform]}
                            <span className="font-medium text-slate-blue-700">{platform.toUpperCase()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tech Stack */}
                {idea.techStack && idea.techStack.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-slate-blue-700 mb-3">
                      {isArabic ? 'التقنيات المقترحة' : 'Suggested Technologies'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {idea.techStack.map((tech, i) => (
                        <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-100 p-6 bg-gray-50">
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={() => setIsPreviewOpen(false)}
                    className="px-6 py-3 text-slate-blue-600 hover:bg-slate-blue-50 rounded-xl transition-colors font-medium"
                  >
                    {isArabic ? 'إغلاق' : 'Close'}
                  </button>
                  <button
                    onClick={() => {
                      onSelect(idea);
                      setIsPreviewOpen(false);
                    }}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${
                      isSelected
                        ? 'bg-green-500 text-white'
                        : 'bg-bronze-500 text-white hover:bg-bronze-600'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <FaCheck className="w-5 h-5" />
                        {isArabic ? 'تم الاختيار' : 'Selected'}
                      </>
                    ) : (
                      <>
                        <FaCheck className="w-5 h-5" />
                        {isArabic ? 'اختر هذه الفكرة' : 'Select This Idea'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default IdeaCard;
