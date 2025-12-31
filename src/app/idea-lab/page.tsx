'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/lib/context/LanguageContext';
import {
  IntroScreen,
  QuestionFlow,
  IdeaGrid,
  GeneratingAnimation,
  UserAnswer,
  GeneratedIdea
} from '@/components/IdeaLab';

type PageState = 'intro' | 'questions' | 'generating' | 'ideas';

export default function IdeaLabPage() {
  const { dir, language } = useLanguage();
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>('intro');
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<GeneratedIdea | null>(null);
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartQuestions = () => {
    setPageState('questions');
  };

  const handleQuestionsComplete = async (userAnswers: UserAnswer[]) => {
    setAnswers(userAnswers);
    setPageState('generating');
    setError(null);

    try {
      const response = await fetch('/api/idea-lab', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: userAnswers,
          language
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate ideas');
      }

      const data = await response.json();
      setIdeas(data.ideas);
      setPageState('ideas');
    } catch (err) {
      console.error('Error generating ideas:', err);
      setError(language === 'ar' 
        ? 'حدث خطأ أثناء إنشاء الأفكار. يرجى المحاولة مرة أخرى.'
        : 'Error generating ideas. Please try again.');
      setPageState('questions');
    }
  };

  const handleGenerateMore = async () => {
    setIsGeneratingMore(true);
    setError(null);

    try {
      const response = await fetch('/api/idea-lab', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers,
          language,
          regenerate: true,
          existingIdeas: ideas.map(i => i.title)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate more ideas');
      }

      const data = await response.json();
      setIdeas(data.ideas);
      setSelectedIdea(null); // Clear selection when new ideas are generated
    } catch (err) {
      console.error('Error generating more ideas:', err);
      setError(language === 'ar'
        ? 'حدث خطأ أثناء إنشاء المزيد من الأفكار.'
        : 'Error generating more ideas.');
    } finally {
      setIsGeneratingMore(false);
    }
  };

  const handleSelectIdea = (idea: GeneratedIdea) => {
    setSelectedIdea(idea);
  };

  const handleProceedToEstimate = (idea: GeneratedIdea) => {
    // Build the description from the idea
    const description = buildDescriptionFromIdea(idea);
    
    // Get selected platforms from answers
    const platformAnswer = answers.find(a => a.questionId === 'platform')?.answer;
    const platforms = Array.isArray(platformAnswer) ? platformAnswer : ['web'];
    
    // Map platform values to display names
    const platformMap: Record<string, string> = {
      'ios': 'iOS',
      'android': 'Android',
      'web': 'Web Application',
      'desktop': 'Desktop',
      'all': 'iOS,Android,Web Application'
    };
    
    const selectedPlatforms = platforms.flatMap(p => {
      if (p === 'all') return ['iOS', 'Android', 'Web Application'];
      return [platformMap[p] || p];
    });

    // Store all data in sessionStorage for the estimate page
    const ideaLabData = {
      idea: {
        ...idea,
        fullDescription: description
      },
      answers: answers,
      platforms: selectedPlatforms,
      autoAnalyze: true // Flag to auto-trigger analysis
    };
    
    sessionStorage.setItem('ideaLabData', JSON.stringify(ideaLabData));

    // Navigate to estimate page with prefilled data
    const encodedDescription = encodeURIComponent(description);
    const encodedPlatforms = encodeURIComponent(selectedPlatforms.join(','));
    router.push(`/estimate?description=${encodedDescription}&platforms=${encodedPlatforms}&fromIdeaLab=true&autoAnalyze=true`);
  };

  const buildDescriptionFromIdea = (idea: GeneratedIdea): string => {
    const isArabic = language === 'ar';
    
    let description = `${idea.title}\n\n`;
    description += `${idea.description}\n\n`;
    
    if (isArabic) {
      description += `المستخدمون المستهدفون: ${idea.targetUsers.join('، ')}\n\n`;
      description += `الميزات الرئيسية:\n`;
      idea.keyFeatures.forEach(f => {
        description += `• ${f}\n`;
      });
      description += `\nنموذج العمل: ${idea.businessModel}\n`;
      description += `\nما يميز هذه الفكرة:\n`;
      idea.differentiators.forEach(d => {
        description += `• ${d}\n`;
      });
    } else {
      description += `Target Users: ${idea.targetUsers.join(', ')}\n\n`;
      description += `Key Features:\n`;
      idea.keyFeatures.forEach(f => {
        description += `• ${f}\n`;
      });
      description += `\nBusiness Model: ${idea.businessModel}\n`;
      description += `\nWhat Makes It Unique:\n`;
      idea.differentiators.forEach(d => {
        description += `• ${d}\n`;
      });
    }
    
    return description;
  };

  const handleBackToIntro = () => {
    setPageState('intro');
    setAnswers([]);
    setIdeas([]);
    setSelectedIdea(null);
    setError(null);
  };

  const handleBackToQuestions = () => {
    setPageState('questions');
    setError(null);
  };

  return (
    <main dir={dir} className="min-h-screen bg-gradient-to-br from-off-white to-slate-blue-50" id="main-content">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center"
            >
              {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {pageState === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
                  <IntroScreen onStart={handleStartQuestions} />
                </div>
              </motion.div>
            )}

            {pageState === 'questions' && (
              <motion.div
                key="questions"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
                  <QuestionFlow 
                    onComplete={handleQuestionsComplete}
                    onBack={handleBackToIntro}
                  />
                </div>
              </motion.div>
            )}

            {pageState === 'generating' && (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
                  <GeneratingAnimation />
                </div>
              </motion.div>
            )}

            {pageState === 'ideas' && (
              <motion.div
                key="ideas"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
              >
                <IdeaGrid
                  ideas={ideas}
                  onSelectIdea={handleSelectIdea}
                  onGenerateMore={handleGenerateMore}
                  onProceedToEstimate={handleProceedToEstimate}
                  onBack={handleBackToQuestions}
                  isGenerating={isGeneratingMore}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
