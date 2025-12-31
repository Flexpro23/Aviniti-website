'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question, UserAnswer, INITIAL_QUESTIONS } from './types';
import { useLanguage } from '@/lib/context/LanguageContext';
import { FaArrowRight, FaArrowLeft, FaCheck, FaLightbulb, FaSpinner } from 'react-icons/fa';

interface QuestionFlowProps {
  onComplete: (answers: UserAnswer[]) => void;
  onBack: () => void;
}

const QuestionFlow: React.FC<QuestionFlowProps> = ({ onComplete, onBack }) => {
  const { language, dir } = useLanguage();
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string | string[]>('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [aiQuestionsGenerated, setAiQuestionsGenerated] = useState(false);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;
  const isArabic = language === 'ar';

  // After question 3, generate AI follow-up questions
  const generateFollowUpQuestions = async (currentAnswers: UserAnswer[]) => {
    setIsGeneratingQuestions(true);
    
    try {
      const response = await fetch('/api/idea-lab/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: currentAnswers,
          language
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const data = await response.json();
      
      if (data.questions && data.questions.length > 0) {
        // Append AI-generated questions to the list
        setQuestions(prev => [...prev, ...data.questions]);
      }
      
      setAiQuestionsGenerated(true);
    } catch (error) {
      console.error('Error generating follow-up questions:', error);
      // Fallback: add some default follow-up questions
      const fallbackQuestions: Question[] = [
        {
          id: 'target',
          question: "Who would be the primary users of your solution?",
          questionAr: "من سيكون المستخدمون الأساسيون لحلك؟",
          type: 'multiChoice',
          options: [
            { value: 'consumers', label: 'Individual Consumers (B2C)', labelAr: 'المستهلكين الأفراد' },
            { value: 'businesses', label: 'Businesses (B2B)', labelAr: 'الشركات' },
            { value: 'enterprise', label: 'Enterprise / Large Companies', labelAr: 'المؤسسات الكبيرة' },
            { value: 'students', label: 'Students / Educational', labelAr: 'الطلاب / التعليم' }
          ],
          isAIGenerated: true
        },
        {
          id: 'platform',
          question: "What platforms would you like to target?",
          questionAr: "ما هي المنصات التي تريد استهدافها؟",
          type: 'multiChoice',
          options: [
            { value: 'ios', label: 'iOS (iPhone/iPad)', labelAr: 'iOS (آيفون/آيباد)' },
            { value: 'android', label: 'Android', labelAr: 'أندرويد' },
            { value: 'web', label: 'Web Application', labelAr: 'تطبيق ويب' },
            { value: 'all', label: 'All Platforms', labelAr: 'جميع المنصات' }
          ],
          isAIGenerated: true
        },
        {
          id: 'urgency',
          question: "How urgent is this problem for your target users?",
          questionAr: "ما مدى إلحاح هذه المشكلة للمستخدمين المستهدفين؟",
          type: 'choice',
          options: [
            { value: 'critical', label: 'Critical - they need a solution now', labelAr: 'حرج - يحتاجون حلاً الآن' },
            { value: 'important', label: 'Important - would significantly help', labelAr: 'مهم - سيساعد بشكل كبير' },
            { value: 'nice', label: 'Nice to have - would improve their life', labelAr: 'مفيد - سيحسن حياتهم' }
          ],
          isAIGenerated: true
        }
      ];
      setQuestions(prev => [...prev, ...fallbackQuestions]);
      setAiQuestionsGenerated(true);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const handleOptionSelect = (value: string) => {
    if (currentQuestion.type === 'multiChoice') {
      const currentSelection = Array.isArray(currentAnswer) ? currentAnswer : [];
      if (currentSelection.includes(value)) {
        setCurrentAnswer(currentSelection.filter(v => v !== value));
      } else {
        setCurrentAnswer([...currentSelection, value]);
      }
    } else {
      setCurrentAnswer(value);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentAnswer(e.target.value);
  };

  const isAnswerValid = () => {
    if (currentQuestion.type === 'multiChoice') {
      return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    }
    if (currentQuestion.type === 'text') {
      return typeof currentAnswer === 'string' && currentAnswer.trim().length > 10;
    }
    return currentAnswer !== '';
  };

  const handleNext = async () => {
    if (!isAnswerValid() || isAnimating || isGeneratingQuestions) return;

    setIsAnimating(true);
    
    // Save the current answer
    const newAnswers = [
      ...answers.filter(a => a.questionId !== currentQuestion.id),
      { questionId: currentQuestion.id, answer: currentAnswer }
    ];
    setAnswers(newAnswers);

    // Check if we just completed question 3 (the problem/opportunity question)
    // and haven't generated AI questions yet
    if (currentIndex === 2 && !aiQuestionsGenerated) {
      setIsAnimating(false);
      await generateFollowUpQuestions(newAnswers);
      setCurrentIndex(currentIndex + 1);
      setCurrentAnswer('');
      return;
    }

    if (currentIndex < questions.length - 1) {
      // Move to next question
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setCurrentAnswer('');
        setIsAnimating(false);
      }, 300);
    } else {
      // All questions answered, complete the flow
      onComplete(newAnswers);
    }
  };

  const handlePrevious = () => {
    if (isAnimating || isGeneratingQuestions) return;

    if (currentIndex > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        // Restore previous answer
        const prevAnswer = answers.find(a => a.questionId === questions[currentIndex - 1].id);
        setCurrentAnswer(prevAnswer?.answer || '');
        setIsAnimating(false);
      }, 300);
    } else {
      onBack();
    }
  };

  const renderQuestionContent = () => {
    if (isGeneratingQuestions) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <div className="w-16 h-16 bg-bronze-100 rounded-full flex items-center justify-center mb-4">
            <FaSpinner className="w-8 h-8 text-bronze-500 animate-spin" />
          </div>
          <h3 className="text-xl font-bold text-slate-blue-700 mb-2">
            {isArabic ? 'نحضر أسئلة مخصصة لك...' : 'Preparing personalized questions...'}
          </h3>
          <p className="text-slate-blue-500 text-center">
            {isArabic 
              ? 'بناءً على ما أخبرتنا به، نصمم أسئلة تساعدنا على فهم رؤيتك بشكل أفضل'
              : 'Based on what you told us, we\'re crafting questions to better understand your vision'}
          </p>
        </motion.div>
      );
    }

    switch (currentQuestion.type) {
      case 'choice':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentQuestion.options?.map((option, index) => (
              <motion.button
                key={option.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleOptionSelect(option.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  currentAnswer === option.value
                    ? 'border-bronze-500 bg-bronze-50 text-slate-blue-700'
                    : 'border-gray-200 hover:border-bronze-300 hover:bg-gray-50 text-slate-blue-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    currentAnswer === option.value
                      ? 'border-bronze-500 bg-bronze-500'
                      : 'border-gray-300'
                  }`}>
                    {currentAnswer === option.value && (
                      <FaCheck className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="font-medium">
                    {isArabic ? option.labelAr : option.label}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        );

      case 'multiChoice':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 mb-4">
              {isArabic ? 'يمكنك اختيار أكثر من خيار' : 'You can select multiple options'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentQuestion.options?.map((option, index) => {
                const isSelected = Array.isArray(currentAnswer) && currentAnswer.includes(option.value);
                return (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleOptionSelect(option.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      isSelected
                        ? 'border-bronze-500 bg-bronze-50 text-slate-blue-700'
                        : 'border-gray-200 hover:border-bronze-300 hover:bg-gray-50 text-slate-blue-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-bronze-500 bg-bronze-500'
                          : 'border-gray-300'
                      }`}>
                        {isSelected && <FaCheck className="w-3 h-3 text-white" />}
                      </div>
                      <span className="font-medium">
                        {isArabic ? option.labelAr : option.label}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        );

      case 'text':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <textarea
              value={typeof currentAnswer === 'string' ? currentAnswer : ''}
              onChange={handleTextChange}
              placeholder={isArabic ? currentQuestion.placeholderAr : currentQuestion.placeholder}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-bronze-500 focus:ring-2 focus:ring-bronze-200 transition-all resize-none h-32 text-slate-blue-700"
              dir={dir}
            />
            <p className="text-sm text-gray-500 mt-2">
              {isArabic ? 'الحد الأدنى 10 أحرف' : 'Minimum 10 characters'}
            </p>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-[600px] flex flex-col" dir={dir}>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-blue-600">
            {isArabic ? `السؤال ${currentIndex + 1} من ${totalQuestions}` : `Question ${currentIndex + 1} of ${totalQuestions}`}
          </span>
          <span className="text-sm font-medium text-bronze-600">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-bronze-500 to-bronze-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          {!isGeneratingQuestions && (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: isArabic ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isArabic ? 50 : -50 }}
              transition={{ duration: 0.3 }}
            >
              {/* Question Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-bronze-100 rounded-full flex items-center justify-center">
                    <FaLightbulb className="w-6 h-6 text-bronze-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-slate-blue-100 text-slate-blue-700 rounded-full text-sm font-medium">
                      {isArabic ? `السؤال ${currentIndex + 1}` : `Question ${currentIndex + 1}`}
                    </span>
                    {currentQuestion.isAIGenerated && (
                      <span className="px-2 py-1 bg-bronze-100 text-bronze-700 rounded-full text-xs font-medium">
                        {isArabic ? 'مخصص' : 'Personalized'}
                      </span>
                    )}
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-blue-700 leading-relaxed">
                  {isArabic ? currentQuestion.questionAr : currentQuestion.question}
                </h2>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Answer Options */}
        {renderQuestionContent()}
      </div>

      {/* Navigation Buttons */}
      {!isGeneratingQuestions && (
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={handlePrevious}
            className={`flex items-center gap-2 px-6 py-3 text-slate-blue-600 hover:text-slate-blue-800 transition-colors ${
              isArabic ? 'flex-row-reverse' : ''
            }`}
          >
            {isArabic ? <FaArrowRight className="w-4 h-4" /> : <FaArrowLeft className="w-4 h-4" />}
            {isArabic ? 'السابق' : 'Previous'}
          </button>

          <button
            onClick={handleNext}
            disabled={!isAnswerValid()}
            className={`flex items-center gap-2 px-8 py-3 bg-bronze-500 text-white rounded-xl font-semibold 
              hover:bg-bronze-600 transition-all shadow-lg hover:shadow-xl
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-bronze-500 disabled:hover:shadow-lg
              ${isArabic ? 'flex-row-reverse' : ''}`}
          >
            {currentIndex === questions.length - 1 ? (
              <>
                <FaLightbulb className="w-4 h-4" />
                {isArabic ? 'اكتشف أفكارك' : 'Discover Ideas'}
              </>
            ) : (
              <>
                {isArabic ? 'التالي' : 'Next'}
                {isArabic ? <FaArrowLeft className="w-4 h-4" /> : <FaArrowRight className="w-4 h-4" />}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionFlow;
