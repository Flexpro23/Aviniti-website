'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  ArrowRight,
  ArrowLeft,
  Store,
  Briefcase,
  Palette,
  GraduationCap,
  Heart as HeartIcon,
  Users,
  DollarSign,
  BookOpen,
  ShoppingCart,
  Truck,
  Film,
  Plane,
  Home,
  UtensilsCrossed,
  Users as UsersIcon,
  MoreHorizontal,
  Check,
  CheckCircle2,
  Link2,
  Sparkles,
  Zap,
  Lightbulb,
  RefreshCw,
} from 'lucide-react';
import { ToolHero } from '@/components/ai-tools/ToolHero';
import { ToolForm } from '@/components/ai-tools/ToolForm';
import { StepTransition } from '@/components/ai-tools/StepTransition';
import { AIThinkingState } from '@/components/ai-tools/AIThinkingState';
import { ToolResults, ToolResultItem } from '@/components/ai-tools/ToolResults';
import { ContactCapture } from '@/components/shared/ContactCapture';
import type { ContactCaptureData } from '@/components/shared/ContactCapture';
import { ConsultationCTA } from '@/components/ai-tools/ConsultationCTA';
import { DiscoveryProgress } from '@/components/ai-tools/DiscoveryProgress';
import { IdeaDetailPanel } from '@/components/ai-tools/IdeaDetailPanel';
import { useResultPersistence } from '@/hooks/useResultPersistence';
import { useUserContact } from '@/hooks/useUserContact';
import type {
  Persona,
  Industry,
  DiscoveryQuestion,
  DiscoveryAnswer,
  IdeaLabResponse,
  IdeaLabIdea,
} from '@/types/api';

// ============================================================
// Persona options for Step 1
// ============================================================
const PERSONA_OPTIONS: {
  value: Persona;
  labelKey: string;
  subtitleKey: string;
  icon: typeof Store;
}[] = [
  { value: 'small-business', labelKey: 'personas.small_business', subtitleKey: 'personas.small_business_subtitle', icon: Store },
  { value: 'professional', labelKey: 'personas.professional', subtitleKey: 'personas.professional_subtitle', icon: Briefcase },
  { value: 'creative', labelKey: 'personas.creative', subtitleKey: 'personas.creative_subtitle', icon: Palette },
  { value: 'student', labelKey: 'personas.student', subtitleKey: 'personas.student_subtitle', icon: GraduationCap },
  { value: 'hobby', labelKey: 'personas.hobby', subtitleKey: 'personas.hobby_subtitle', icon: HeartIcon },
  { value: 'manager', labelKey: 'personas.manager', subtitleKey: 'personas.manager_subtitle', icon: Users },
];

// ============================================================
// Industry options for Step 2
// ============================================================
const INDUSTRY_OPTIONS: {
  value: Industry;
  labelKey: string;
  icon: typeof HeartIcon;
}[] = [
  { value: 'health-wellness', labelKey: 'industries.health_wellness', icon: HeartIcon },
  { value: 'finance-banking', labelKey: 'industries.finance_banking', icon: DollarSign },
  { value: 'education-learning', labelKey: 'industries.education_learning', icon: BookOpen },
  { value: 'ecommerce-retail', labelKey: 'industries.ecommerce_retail', icon: ShoppingCart },
  { value: 'logistics-delivery', labelKey: 'industries.logistics_delivery', icon: Truck },
  { value: 'entertainment-media', labelKey: 'industries.entertainment_media', icon: Film },
  { value: 'travel-hospitality', labelKey: 'industries.travel_hospitality', icon: Plane },
  { value: 'real-estate', labelKey: 'industries.real_estate', icon: Home },
  { value: 'food-restaurant', labelKey: 'industries.food_restaurant', icon: UtensilsCrossed },
  { value: 'social-community', labelKey: 'industries.social_community', icon: UsersIcon },
  { value: 'other', labelKey: 'industries.other', icon: MoreHorizontal },
];

// ============================================================
// Tag icon and color mapping
// ============================================================
const TAG_CONFIG: Record<
  IdeaLabIdea['tag'],
  { icon: typeof Zap; colorClasses: string; labelKey: string }
> = {
  'easiest-to-start': {
    icon: Zap,
    colorClasses: 'bg-green-500/15 text-green-400 border-green-500/30',
    labelKey: 'tag_easiest',
  },
  'biggest-impact': {
    icon: Sparkles,
    colorClasses: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    labelKey: 'tag_impact',
  },
  'most-innovative': {
    icon: Lightbulb,
    colorClasses: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    labelKey: 'tag_innovative',
  },
};

// ============================================================
// Step phases
// ============================================================
type Phase =
  | 'persona'        // Step 1
  | 'industry'       // Step 2
  | 'discover-loading' // Brief AI loading
  | 'questions'      // Dynamic AI questions
  | 'email'          // Email capture
  | 'generate-loading' // Full AI loading
  | 'results';       // Results display

function phaseToStepNumber(phase: Phase, totalQuestions: number, currentQuestion: number): number {
  switch (phase) {
    case 'persona': return 1;
    case 'industry': return 2;
    case 'discover-loading': return 3;
    case 'questions': return 3 + currentQuestion;
    case 'email': return 3 + totalQuestions;
    case 'generate-loading': return 4 + totalQuestions;
    case 'results': return 4 + totalQuestions;
    default: return 1;
  }
}

export default function IdeaLabPage() {
  const t = useTranslations('idea_lab');
  const locale = useLocale();

  // ============================================================
  // State
  // ============================================================
  const [phase, setPhase] = useState<Phase>('persona');
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  // Form data
  const [persona, setPersona] = useState<Persona | ''>('');
  const [industry, setIndustry] = useState<Industry | ''>('');
  const [questions, setQuestions] = useState<DiscoveryQuestion[]>([]);
  const [contextSummary, setContextSummary] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Results
  const [results, setResults] = useState<IdeaLabResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Detail panel
  const [selectedIdea, setSelectedIdea] = useState<IdeaLabIdea | null>(null);

  // Refresh ("Try More Ideas")
  const [refreshCount, setRefreshCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [allPreviousIdeaNames, setAllPreviousIdeaNames] = useState<string[]>([]);
  const MAX_REFRESHES = 2;

  // Save/share
  const [isCopied, setIsCopied] = useState(false);
  const { saveResult, copyShareableUrl, savedId, loadedResult } = useResultPersistence('idea-lab', locale);

  // Shared contact store — persists across all AI tools
  const { updateContact } = useUserContact();

  // Save result when it changes
  useEffect(() => {
    if (results && !savedId) {
      saveResult(results);
    }
  }, [results, savedId, saveResult]);

  // Hydrate results from shareable URL
  useEffect(() => {
    if (loadedResult && !results) {
      setResults(loadedResult);
      setPhase('results');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedResult]);

  // ============================================================
  // Navigation helpers
  // ============================================================
  const goForward = useCallback(() => {
    setDirection('forward');
  }, []);

  const goBack = useCallback(() => {
    setDirection('backward');
  }, []);

  // ============================================================
  // Discover API call — generates questions
  // ============================================================
  const handleDiscoverSubmit = useCallback(async () => {
    if (!persona || !industry) return;

    goForward();
    setPhase('discover-loading');
    setError(null);

    try {
      const res = await fetch('/api/ai/idea-lab/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona,
          industry,
          locale,
        }),
      });

      if (!res.ok) {
        try {
          const errorData = await res.json();
          setError(errorData.error?.message || t('error_discover'));
        } catch {
          setError(t('error_discover'));
        }
        setPhase('industry');
        return;
      }
      const data = await res.json();

      if (data.success && data.data?.questions) {
        setQuestions(data.data.questions);
        setContextSummary(data.data.contextSummary || '');
        setCurrentQuestionIndex(0);
        setAnswers({});
        setPhase('questions');
      } else {
        setError(data.error?.message || t('error_discover'));
        setPhase('industry');
      }
    } catch {
      setError(t('error_generic'));
      setPhase('industry');
    }
  }, [persona, industry, locale, t, goForward]);

  // ============================================================
  // Generate API call — generates ideas
  // ============================================================
  const handleGenerate = useCallback(async (contactData: ContactCaptureData) => {
    goForward();
    setPhase('generate-loading');
    setError(null);

    // Persist contact info to the shared store (single contact capture across tools)
    updateContact({
      name: contactData.name,
      phone: contactData.phone,
      ...(contactData.email ? { email: contactData.email } : {}),
      whatsapp: contactData.whatsapp,
    });

    // Store phone (primary identifier) and email for potential refresh calls
    try {
      localStorage.setItem('aviniti_idealab_phone', contactData.phone);
      if (contactData.email) {
        localStorage.setItem('aviniti_idealab_email', contactData.email);
      }
    } catch { /* ignore */ }

    // Build discovery answers array
    const discoveryAnswers: DiscoveryAnswer[] = questions.map((q) => ({
      questionId: q.id,
      questionText: q.text,
      answer: answers[q.id] || '',
    }));

    try {
      const res = await fetch('/api/ai/idea-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona,
          industry,
          discoveryAnswers,
          name: contactData.name,
          phone: contactData.phone,
          ...(contactData.email ? { email: contactData.email } : {}),
          whatsapp: contactData.whatsapp,
          locale,
        }),
      });

      if (!res.ok) {
        try {
          const errorData = await res.json();
          setError(errorData.error?.message || t('error_generate'));
        } catch {
          setError(t('error_generate'));
        }
        setPhase('email');
        return;
      }
      const data = await res.json();

      if (data.success && data.data?.ideas) {
        setResults(data.data);
        // Track generated idea names for potential refresh
        setAllPreviousIdeaNames(data.data.ideas.map((i: IdeaLabIdea) => i.name));
        setPhase('results');
      } else {
        setError(data.error?.message || t('error_generate'));
        setPhase('email');
      }
    } catch {
      setError(t('error_generic'));
      setPhase('email');
    }
  }, [persona, industry, questions, answers, locale, t, goForward]);

  // ============================================================
  // Refresh — generate fresh ideas (limited to MAX_REFRESHES)
  // ============================================================
  const handleRefreshIdeas = useCallback(async () => {
    if (refreshCount >= MAX_REFRESHES || isRefreshing) return;

    setIsRefreshing(true);
    setError(null);

    const discoveryAnswers: DiscoveryAnswer[] = questions.map((q) => ({
      questionId: q.id,
      questionText: q.text,
      answer: answers[q.id] || '',
    }));

    // Retrieve stored contact info from the last submission
    const storedPhone = localStorage.getItem('aviniti_idealab_phone') || '';
    const storedEmail = localStorage.getItem('aviniti_idealab_email') || '';

    try {
      const res = await fetch('/api/ai/idea-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona,
          industry,
          discoveryAnswers,
          phone: storedPhone,
          ...(storedEmail ? { email: storedEmail } : {}),
          whatsapp: false,
          locale,
          previousIdeaNames: allPreviousIdeaNames,
        }),
      });

      if (!res.ok) {
        try {
          const errorData = await res.json();
          setError(errorData.error?.message || t('error_generate'));
        } catch {
          setError(t('error_generate'));
        }
        return;
      }
      const data = await res.json();

      if (data.success && data.data?.ideas) {
        setResults(data.data);
        const newNames = data.data.ideas.map((i: IdeaLabIdea) => i.name);
        setAllPreviousIdeaNames((prev) => [...prev, ...newNames]);
        setRefreshCount((prev) => prev + 1);
        setSelectedIdea(null);
      } else {
        setError(data.error?.message || t('error_generate'));
      }
    } catch {
      setError(t('error_generic'));
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshCount, isRefreshing, questions, answers, persona, industry, locale, allPreviousIdeaNames, t]);

  // ============================================================
  // Question navigation
  // ============================================================
  const currentQuestion = questions[currentQuestionIndex] ?? null;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const canAdvanceQuestion = currentQuestion ? !!answers[currentQuestion.id] : false;

  const handleAnswerQuestion = useCallback((questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }, []);

  const handleNextQuestion = useCallback(() => {
    if (isLastQuestion) {
      goForward();
      setPhase('email');
    } else {
      goForward();
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [isLastQuestion, goForward]);

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex === 0) {
      goBack();
      setPhase('industry');
    } else {
      goBack();
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex, goBack]);

  // ============================================================
  // Scroll to form helper
  // ============================================================
  const handleStartDiscovery = () => {
    const formSection = document.getElementById('idea-lab-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ============================================================
  // Computed step for ToolForm stepper
  // ============================================================
  const totalFormSteps = 3 + questions.length + 1; // persona + industry + questions + email
  const currentFormStep = phaseToStepNumber(phase, questions.length, currentQuestionIndex);

  // ============================================================
  // LOADING: Discover (brief)
  // ============================================================
  if (phase === 'discover-loading') {
    return (
      <div className="min-h-screen bg-navy">
        <div className="max-w-3xl mx-auto px-4 py-32">
          <AIThinkingState
            toolColor="orange"
            messages={[
              t('discovery_loading_messages.analyzing'),
              t('discovery_loading_messages.almost'),
            ]}
          />
        </div>
      </div>
    );
  }

  // ============================================================
  // LOADING: Generate (full)
  // ============================================================
  if (phase === 'generate-loading') {
    return (
      <div className="min-h-screen bg-navy">
        <div className="max-w-3xl mx-auto px-4 py-32">
          <AIThinkingState
            toolColor="orange"
            messages={[
              t('generating_messages.analyzing'),
              t('generating_messages.crafting'),
            ]}
          />
        </div>
      </div>
    );
  }

  // ============================================================
  // RESULTS
  // ============================================================
  if (phase === 'results' && results) {
    const handleCopyLink = async () => {
      const success = await copyShareableUrl(results);
      if (success) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    };

    return (
      <div className="min-h-screen bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Results Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tool-orange/15 text-tool-orange-light text-xs font-medium uppercase tracking-wider mb-4">
              <Check className="h-3.5 w-3.5" />
              {t('results_badge')}
            </div>
            <h2 className="text-h2 text-white">
              {t('results_title')}
            </h2>
            <p className="text-base text-muted mt-3 max-w-xl mx-auto">
              {t('results_subtitle', { count: results.ideas.length })}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <button
              onClick={handleCopyLink}
              className="h-11 px-6 bg-slate-blue-light hover:bg-slate-blue-light/80 text-off-white rounded-lg font-semibold transition-all duration-200 inline-flex items-center gap-2"
            >
              {isCopied ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  {t('link_copied')}
                </>
              ) : (
                <>
                  <Link2 className="h-5 w-5" />
                  {t('save_share')}
                </>
              )}
            </button>
          </div>

          {/* Idea Cards */}
          <ToolResults toolColor="orange" className="space-y-6 bg-transparent border-0 p-0">
            {results.ideas.map((idea: IdeaLabIdea) => {
              const tagConfig = TAG_CONFIG[idea.tag];
              const TagIcon = tagConfig.icon;

              return (
                <ToolResultItem key={idea.id}>
                  <article className="bg-slate-blue border border-slate-blue-light rounded-xl p-6 md:p-8 hover:border-tool-orange/30 transition-all duration-300 group">
                    {/* Tag Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${tagConfig.colorClasses}`}
                      >
                        <TagIcon className="h-3 w-3" />
                        {t(tagConfig.labelKey)}
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                      {idea.name}
                    </h3>

                    {/* Tagline */}
                    <p className="text-base text-tool-orange font-medium mb-4">
                      {idea.tagline}
                    </p>

                    {/* Benefits */}
                    <ul className="space-y-2 mb-6">
                      {idea.benefits.map((benefit: string, bIdx: number) => (
                        <li
                          key={bIdx}
                          className="flex items-start gap-2.5 text-sm text-off-white"
                        >
                          <Check className="h-4 w-4 text-tool-orange-light mt-0.5 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>

                    {/* Social Proof (subtle) */}
                    <p className="text-xs text-muted italic mb-5 ps-4 border-s-2 border-tool-orange/30">
                      {idea.socialProof}
                    </p>

                    {/* View Details Button */}
                    <button
                      onClick={() => setSelectedIdea(idea)}
                      className="h-11 px-6 bg-tool-orange text-white font-semibold rounded-lg shadow-sm hover:bg-tool-orange/90 hover:shadow-md transition-all duration-200 flex items-center gap-2"
                      aria-label={t('aria_view_details', { name: idea.name })}
                    >
                      {t('view_details')}
                      <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                    </button>
                  </article>
                </ToolResultItem>
              );
            })}
          </ToolResults>

          {/* Consultation CTA */}
          <div className="mt-10">
            <ConsultationCTA projectName={t('results_title')} />
          </div>

          {/* Try More Ideas — Refresh Button */}
          <div className="mt-10 text-center">
            {refreshCount < MAX_REFRESHES ? (
              <div className="space-y-3">
                <button
                  onClick={handleRefreshIdeas}
                  disabled={isRefreshing}
                  className="h-12 px-8 bg-slate-blue border border-slate-blue-light hover:border-tool-orange/30 hover:bg-slate-blue-light text-off-white font-semibold rounded-xl shadow-sm transition-all duration-200 inline-flex items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`h-4.5 w-4.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? t('refresh_ideas_loading') : t('refresh_ideas_btn')}
                </button>
                <p className="text-xs text-muted">
                  {t('refresh_ideas_subtitle')}
                </p>
                <p className="text-xs text-muted/60">
                  {t('refresh_count', { current: refreshCount, total: MAX_REFRESHES })}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted italic">
                {t('refresh_limit_reached')}
              </p>
            )}
          </div>
        </div>

        {/* Idea Detail Panel */}
        {selectedIdea && (
          <IdeaDetailPanel
            idea={selectedIdea}
            isOpen={!!selectedIdea}
            onClose={() => setSelectedIdea(null)}
          />
        )}
      </div>
    );
  }

  // ============================================================
  // FORM STATE (persona, industry, questions, email)
  // ============================================================
  return (
    <div className="min-h-screen bg-navy">
      {/* Hero */}
      <ToolHero
        toolSlug="idea-lab"
        title={t('hero_title')}
        description={t('hero_description')}
        ctaText={t('hero_cta')}
        toolColor="orange"
        onCTAClick={handleStartDiscovery}
      />

      {/* Form */}
      <section id="idea-lab-form" className="py-12 md:py-16">
        <ToolForm
          totalSteps={phase === 'questions' || phase === 'email' ? totalFormSteps : 4}
          currentStep={phase === 'questions' || phase === 'email' ? currentFormStep : phase === 'persona' ? 1 : 2}
          toolColor="orange"
        >
          <StepTransition
            currentStep={
              phase === 'persona'
                ? 1
                : phase === 'industry'
                ? 2
                : phase === 'questions'
                ? 100 + currentQuestionIndex
                : phase === 'email'
                ? 200
                : 1
            }
            direction={direction}
          >
            {/* ============================================================ */}
            {/* Step 1: Persona Selection */}
            {/* ============================================================ */}
            {phase === 'persona' && (
              <div>
                <h2 className="text-h4 text-white mb-2">
                  {t('step1_title')}
                </h2>
                <p className="text-sm text-muted mb-6">
                  {t('step1_helper')}
                </p>

                <div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  role="radiogroup"
                  aria-label={t('aria_persona_selection')}
                >
                  {PERSONA_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const isSelected = persona === option.value;
                    return (
                      <button
                        key={option.value}
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setPersona(option.value)}
                        className={`w-full flex items-start gap-4 p-4 md:p-5 rounded-xl border transition-all duration-200 text-start cursor-pointer ${
                          isSelected
                            ? 'bg-tool-orange/10 border-tool-orange/50 ring-1 ring-tool-orange/30'
                            : 'bg-slate-blue border-slate-blue-light hover:bg-slate-blue-light/50'
                        }`}
                      >
                        <div
                          className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? 'bg-tool-orange/20 text-tool-orange-light'
                              : 'bg-slate-blue-light text-muted'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span
                            className={`text-base font-medium block ${
                              isSelected ? 'text-white' : 'text-off-white'
                            }`}
                          >
                            {t(option.labelKey)}
                          </span>
                          <span className="text-xs text-muted mt-0.5 block">
                            {t(option.subtitleKey)}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="h-5 w-5 rounded-full bg-tool-orange flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    onClick={() => {
                      goForward();
                      setPhase('industry');
                    }}
                    disabled={!persona}
                    className="h-11 px-6 bg-tool-orange text-white font-semibold rounded-lg shadow-sm hover:bg-tool-orange/90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                  >
                    {t('continue_btn')}
                    <ArrowRight className="h-5 w-5 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* Step 2: Industry Selection */}
            {/* ============================================================ */}
            {phase === 'industry' && (
              <div>
                <h2 className="text-h4 text-white mb-2">
                  {t('step2_title')}
                </h2>
                <p className="text-sm text-muted mb-6">
                  {t('step2_helper')}
                </p>

                <div
                  className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
                  role="radiogroup"
                  aria-label={t('aria_industry_selection')}
                >
                  {INDUSTRY_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const isSelected = industry === option.value;
                    return (
                      <button
                        key={option.value}
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setIndustry(option.value)}
                        className={`w-full flex items-center gap-3 p-3 md:p-4 rounded-xl border transition-all duration-200 text-start cursor-pointer ${
                          isSelected
                            ? 'bg-tool-orange/10 border-tool-orange/50 ring-1 ring-tool-orange/30'
                            : 'bg-slate-blue border-slate-blue-light hover:bg-slate-blue-light/50'
                        }`}
                      >
                        <div
                          className={`h-8 w-8 md:h-10 md:w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? 'bg-tool-orange/20 text-tool-orange-light'
                              : 'bg-slate-blue-light text-muted'
                          }`}
                        >
                          <Icon className="h-4 w-4 md:h-5 md:w-5" />
                        </div>
                        <span
                          className={`text-sm md:text-base font-medium ${
                            isSelected ? 'text-white' : 'text-off-white'
                          }`}
                        >
                          {t(option.labelKey)}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={() => {
                      goBack();
                      setPhase('persona');
                    }}
                    className="text-sm font-medium text-muted hover:text-off-white transition-colors duration-200 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                    {t('back_btn')}
                  </button>
                  <button
                    onClick={handleDiscoverSubmit}
                    disabled={!industry}
                    className="h-11 px-6 bg-tool-orange text-white font-semibold rounded-lg shadow-sm hover:bg-tool-orange/90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                  >
                    {t('continue_btn')}
                    <ArrowRight className="h-5 w-5 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* Dynamic Questions Phase */}
            {/* ============================================================ */}
            {phase === 'questions' && currentQuestion && (
              <div>
                {/* Context summary from the discover API */}
                {contextSummary && (
                  <p className="text-sm text-tool-orange-light bg-tool-orange/10 border border-tool-orange/20 rounded-lg px-4 py-3 mb-6">
                    {contextSummary}
                  </p>
                )}

                {/* Progress indicator */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-h4 text-white mb-1">
                      {t('questions_title')}
                    </h2>
                    <p className="text-xs text-muted">
                      {t('question_of', {
                        current: currentQuestionIndex + 1,
                        total: questions.length,
                      })}
                    </p>
                  </div>
                  <DiscoveryProgress
                    totalQuestions={questions.length}
                    answeredCount={Object.keys(answers).length}
                    isActive={true}
                  />
                </div>

                {/* Question text */}
                <p className="text-lg text-off-white font-medium mb-6">
                  {currentQuestion.text}
                </p>

                {/* Yes/No type */}
                {currentQuestion.type === 'yes-no' && (
                  <div className="grid grid-cols-2 gap-4" role="radiogroup" aria-label={t('aria_question_answer')}>
                    {['yes', 'no'].map((option) => {
                      const isSelected = answers[currentQuestion.id] === option;
                      return (
                        <button
                          key={option}
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() =>
                            handleAnswerQuestion(currentQuestion.id, option)
                          }
                          className={`flex items-center justify-center gap-3 p-5 rounded-xl border text-lg font-semibold transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? 'bg-tool-orange/10 border-tool-orange/50 ring-1 ring-tool-orange/30 text-white'
                              : 'bg-slate-blue border-slate-blue-light hover:bg-slate-blue-light/50 text-off-white'
                          }`}
                        >
                          {isSelected && (
                            <Check className="h-5 w-5 text-tool-orange-light" />
                          )}
                          {option === 'yes' ? t('yes') : t('no')}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Multiple Choice type */}
                {currentQuestion.type === 'multiple-choice' &&
                  currentQuestion.options && (
                    <div className="space-y-3" role="radiogroup" aria-label={t('aria_question_answer')}>
                      {currentQuestion.options.map((option) => {
                        const isSelected =
                          answers[currentQuestion.id] === option;
                        return (
                          <button
                            key={option}
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() =>
                              handleAnswerQuestion(currentQuestion.id, option)
                            }
                            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-start cursor-pointer ${
                              isSelected
                                ? 'bg-tool-orange/10 border-tool-orange/50 ring-1 ring-tool-orange/30'
                                : 'bg-slate-blue border-slate-blue-light hover:bg-slate-blue-light/50'
                            }`}
                          >
                            <div
                              className={`h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                isSelected
                                  ? 'border-tool-orange bg-tool-orange'
                                  : 'border-muted'
                              }`}
                            >
                              {isSelected && (
                                <Check className="h-3 w-3 text-white" />
                              )}
                            </div>
                            <span
                              className={`text-sm font-medium ${
                                isSelected ? 'text-white' : 'text-off-white'
                              }`}
                            >
                              {option}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                {/* Single Line type */}
                {currentQuestion.type === 'single-line' && (
                  <div>
                    <input
                      id="idea-lab-question-input"
                      type="text"
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) =>
                        handleAnswerQuestion(currentQuestion.id, e.target.value)
                      }
                      placeholder={
                        currentQuestion.placeholder || t('single_line_placeholder')
                      }
                      className="w-full h-12 px-4 bg-slate-blue border border-slate-blue-light rounded-xl text-base text-off-white placeholder:text-muted-light hover:border-gray-700 focus-visible:bg-slate-blue-light focus-visible:border-tool-orange focus-visible:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-tool-orange transition-all duration-200"
                      aria-label={t('aria_question_answer')}
                    />
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={handlePreviousQuestion}
                    className="text-sm font-medium text-muted hover:text-off-white transition-colors duration-200 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                    {t('back_btn')}
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    disabled={!canAdvanceQuestion}
                    className="h-11 px-6 bg-tool-orange text-white font-semibold rounded-lg shadow-sm hover:bg-tool-orange/90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                  >
                    {isLastQuestion ? t('continue_btn') : t('continue_btn')}
                    <ArrowRight className="h-5 w-5 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* Contact Capture Step */}
            {/* ============================================================ */}
            {phase === 'email' && (
              <div>
                <div className="mb-4">
                  <button
                    onClick={() => {
                      goBack();
                      setCurrentQuestionIndex(questions.length - 1);
                      setPhase('questions');
                    }}
                    className="text-sm font-medium text-muted hover:text-off-white transition-colors duration-200 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                    {t('back_btn')}
                  </button>
                </div>
                <ContactCapture
                  toolColor="orange"
                  onSubmit={handleGenerate}
                />
              </div>
            )}
          </StepTransition>
        </ToolForm>

        {/* Error message */}
        {error && (
          <div className="max-w-3xl mx-auto px-4 mt-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
              <p className="text-sm text-red-400">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-xs text-muted hover:text-white transition-colors"
              >
                {t('dismiss_btn')}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
