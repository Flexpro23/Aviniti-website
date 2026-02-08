'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight, ArrowLeft, Briefcase, User, GraduationCap, Palette, MoreHorizontal, Heart, DollarSign, BookOpen, ShoppingCart, Truck, Film, Plane, Home, UtensilsCrossed, Users, Check, Star, Link2, CheckCircle2, RefreshCw } from 'lucide-react';
import { ToolHero } from '@/components/ai-tools/ToolHero';
import { ToolForm } from '@/components/ai-tools/ToolForm';
import { StepTransition } from '@/components/ai-tools/StepTransition';
import { AIThinkingState } from '@/components/ai-tools/AIThinkingState';
import { ToolResults, ToolResultItem } from '@/components/ai-tools/ToolResults';
import { EmailCapture } from '@/components/ai-tools/EmailCapture';
import { CrossSellCTA } from '@/components/ai-tools/CrossSellCTA';
import { useResultPersistence } from '@/hooks/useResultPersistence';
import type { Background, Industry } from '@/types/api';
import type { IdeaLabResponse, IdeaLabIdea } from '@/types/api';

// ============================================================
// Background options for Step 1
// ============================================================
const BACKGROUND_OPTIONS: { value: Background; labelKey: string; icon: typeof Briefcase }[] = [
  { value: 'entrepreneur', labelKey: 'backgrounds.entrepreneur', icon: Briefcase },
  { value: 'professional', labelKey: 'backgrounds.professional', icon: User },
  { value: 'student', labelKey: 'backgrounds.student', icon: GraduationCap },
  { value: 'creative', labelKey: 'backgrounds.creative', icon: Palette },
  { value: 'other', labelKey: 'backgrounds.other', icon: MoreHorizontal },
];

// ============================================================
// Industry options for Step 2
// ============================================================
const INDUSTRY_OPTIONS: { value: Industry; labelKey: string; icon: typeof Heart }[] = [
  { value: 'health-wellness', labelKey: 'industries.health_wellness', icon: Heart },
  { value: 'finance-banking', labelKey: 'industries.finance_banking', icon: DollarSign },
  { value: 'education-learning', labelKey: 'industries.education_learning', icon: BookOpen },
  { value: 'ecommerce-retail', labelKey: 'industries.ecommerce_retail', icon: ShoppingCart },
  { value: 'logistics-delivery', labelKey: 'industries.logistics_delivery', icon: Truck },
  { value: 'entertainment-media', labelKey: 'industries.entertainment_media', icon: Film },
  { value: 'travel-hospitality', labelKey: 'industries.travel_hospitality', icon: Plane },
  { value: 'real-estate', labelKey: 'industries.real_estate', icon: Home },
  { value: 'food-restaurant', labelKey: 'industries.food_restaurant', icon: UtensilsCrossed },
  { value: 'social-community', labelKey: 'industries.social_community', icon: Users },
  { value: 'other', labelKey: 'industries.other', icon: MoreHorizontal },
];

// ============================================================
// Inspiration prompt keys for Step 3
// ============================================================
const INSPIRATION_PROMPT_KEYS = [
  'inspiration_prompts.prompt_1',
  'inspiration_prompts.prompt_2',
  'inspiration_prompts.prompt_3',
] as const;

export default function IdeaLabPage() {
  const t = useTranslations('idea_lab');
  const locale = useLocale();

  // Form state
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [formData, setFormData] = useState({
    background: '' as Background | '',
    industry: '' as Industry | '',
    problem: '',
    email: '',
    whatsapp: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<IdeaLabResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generationCount, setGenerationCount] = useState(1);
  const [rateLimitRemaining, setRateLimitRemaining] = useState<number>(3);

  // ============================================================
  // Navigation helpers
  // ============================================================
  const goForward = () => {
    setDirection('forward');
    setStep((prev) => prev + 1);
  };

  const goBack = () => {
    setDirection('backward');
    setStep((prev) => prev - 1);
  };

  // ============================================================
  // Submit handler
  // ============================================================
  const handleSubmit = async (emailData: { email: string; whatsapp: boolean }) => {
    const updatedData = { ...formData, ...emailData };
    setFormData(updatedData);
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/idea-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          background: updatedData.background,
          industry: updatedData.industry,
          problem: updatedData.problem,
          email: updatedData.email,
          whatsapp: updatedData.whatsapp,
          locale,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setResults(data.data);
        // Extract rate limit info from headers if available
        const remaining = res.headers.get('X-RateLimit-Remaining');
        if (remaining) {
          setRateLimitRemaining(parseInt(remaining, 10));
        }
      } else {
        setError(data.error?.message || t('error_generate'));
      }
    } catch {
      setError(t('error_generic'));
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // Generate More Ideas Handler
  // ============================================================
  const handleGenerateMore = async () => {
    if (!results || rateLimitRemaining <= 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const existingIdeaNames = results.ideas.map(idea => idea.name);

      const res = await fetch('/api/ai/idea-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          background: formData.background,
          industry: formData.industry,
          problem: formData.problem,
          email: formData.email,
          whatsapp: formData.whatsapp,
          locale,
          existingIdeas: existingIdeaNames,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setResults(data.data);
        setGenerationCount(prev => prev + 1);
        // Update rate limit
        const remaining = res.headers.get('X-RateLimit-Remaining');
        if (remaining) {
          setRateLimitRemaining(parseInt(remaining, 10));
        }
      } else {
        setError(data.error?.message || t('error_generate_more'));
      }
    } catch {
      setError(t('error_generic'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartDiscovery = () => {
    const formSection = document.getElementById('idea-lab-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ============================================================
  // Loading state
  // ============================================================
  if (isLoading) {
    return (
      <main className="min-h-screen bg-navy">
        <div className="max-w-3xl mx-auto px-4 py-32">
          <AIThinkingState
            toolColor="orange"
            messages={[
              t('loading_messages.exploring'),
              t('loading_messages.researching'),
              t('loading_messages.generating'),
              t('loading_messages.refining'),
            ]}
          />
        </div>
      </main>
    );
  }

  // Result persistence state
  const [isCopied, setIsCopied] = useState(false);
  const { saveResult, copyShareableUrl, savedId } = useResultPersistence('idea-lab');

  // Save result when it changes
  useEffect(() => {
    if (results && !savedId) {
      saveResult(results);
    }
  }, [results, savedId, saveResult]);

  // ============================================================
  // Results state
  // ============================================================
  if (results) {

    const handleCopyLink = async () => {
      const success = await copyShareableUrl();
      if (success) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    };

    // Resolve the background and industry labels for the results subtitle
    const backgroundLabel = formData.background
      ? t(BACKGROUND_OPTIONS.find(b => b.value === formData.background)?.labelKey ?? 'fallback_background')
      : t('fallback_background');
    const industryLabel = formData.industry
      ? t(INDUSTRY_OPTIONS.find(i => i.value === formData.industry)?.labelKey ?? 'fallback_industry')
      : t('fallback_industry');

    return (
      <main className="min-h-screen bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Results Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 text-orange-300 text-xs font-medium uppercase tracking-wider mb-4">
              <Check className="h-3.5 w-3.5" />
              {t('results_badge')}
            </div>
            <h2 className="text-h2 text-white">
              {t('results_title')}
            </h2>
            <p className="text-base text-muted mt-3 max-w-xl mx-auto">
              {t('results_subtitle', { background: backgroundLabel, industry: industryLabel })}
            </p>
          </div>

          {/* Save Results Button */}
          <div className="flex justify-center mb-10">
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
            {results.ideas.map((idea: IdeaLabIdea, index: number) => (
              <ToolResultItem key={idea.id}>
                <article className="bg-slate-blue border border-slate-blue-light rounded-xl p-6 md:p-8 hover:border-orange-500/30 transition-all duration-300 group">
                  {/* Card header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                          {t('idea_label', { number: index + 1 })}
                        </span>
                        {/* Complexity Badge */}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          idea.complexity === 'simple'
                            ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                            : idea.complexity === 'moderate'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-red-500/15 text-red-400 border border-red-500/30'
                        }`}>
                          {idea.complexity === 'simple' ? t('complexity_simple') :
                           idea.complexity === 'moderate' ? t('complexity_moderate') :
                           t('complexity_complex')}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-white">
                        {idea.name}
                      </h3>
                    </div>
                    <button
                      className="h-9 w-9 rounded-lg flex items-center justify-center text-muted hover:text-orange-400 hover:bg-orange-500/10 transition-colors duration-200 flex-shrink-0"
                      aria-label={t('bookmark_aria', { name: idea.name })}
                    >
                      <Star className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-base text-off-white leading-relaxed">
                    {idea.description}
                  </p>

                  {/* Features */}
                  <div className="mt-5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
                      {t('key_features')}
                    </h4>
                    <ul className="space-y-2">
                      {idea.features.map((feature: string, fIdx: number) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-sm text-muted">
                          <Check className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Estimates row */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-slate-blue-light/40 rounded-lg p-3">
                      <span className="text-xs text-muted block">{t('estimated_cost')}</span>
                      <span className="text-lg font-bold text-white mt-0.5 block">
                        ${idea.estimatedCost.min.toLocaleString()} - ${idea.estimatedCost.max.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-blue-light/40 rounded-lg p-3">
                      <span className="text-xs text-muted block">{t('timeline_label')}</span>
                      <span className="text-lg font-bold text-white mt-0.5 block">
                        {idea.estimatedTimeline}
                      </span>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  {idea.techStack && idea.techStack.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                        {t('tech_stack')}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {idea.techStack.map((tech: string, techIdx: number) => (
                          <span
                            key={techIdx}
                            className="px-2.5 py-1 rounded-md bg-slate-blue-light/50 text-xs text-off-white border border-slate-blue-light"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Card actions */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <a
                      href={`/ai-analyzer?fromIdea=true&ideaName=${encodeURIComponent(idea.name)}&ideaDescription=${encodeURIComponent(idea.description)}`}
                      className="h-11 px-5 bg-orange-500 text-white font-semibold rounded-lg shadow-sm hover:bg-orange-600 hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 flex-1 sm:flex-initial"
                    >
                      {t('explore_idea')}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                    <a
                      href={`/get-estimate?fromIdea=true&ideaName=${encodeURIComponent(idea.name)}&ideaDescription=${encodeURIComponent(idea.description)}&ideaFeatures=${encodeURIComponent(idea.features.join(','))}`}
                      className="h-11 px-5 bg-transparent text-orange-400 border border-orange-500/30 font-semibold rounded-lg hover:bg-orange-500/10 hover:border-orange-500/50 transition-all duration-200 flex items-center justify-center gap-2 flex-1 sm:flex-initial"
                    >
                      {t('get_estimate')}
                    </a>
                  </div>
                </article>
              </ToolResultItem>
            ))}
          </ToolResults>

          {/* Generate More Ideas Button */}
          {rateLimitRemaining > 0 && (
            <div className="flex flex-col items-center gap-3 mt-8">
              <button
                onClick={handleGenerateMore}
                disabled={isLoading}
                className="h-11 px-6 bg-transparent text-orange-400 border border-orange-500/30 font-semibold rounded-lg hover:bg-orange-500/10 hover:border-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 inline-flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {t('generate_more')}
              </button>
              <span className="text-xs text-muted">
                {t('generation_counter', { current: generationCount, total: 3 })}
              </span>
            </div>
          )}

          {/* Cross-sell */}
          <div className="mt-10 space-y-4">
            <CrossSellCTA
              targetTool="ai-analyzer"
              message={t('cross_sell_analyzer')}
            />
            <CrossSellCTA
              targetTool="get-estimate"
              message={t('cross_sell_estimate')}
            />
          </div>
        </div>
      </main>
    );
  }

  // ============================================================
  // Form state (default view)
  // ============================================================
  return (
    <main className="min-h-screen bg-navy">
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
        <ToolForm totalSteps={4} currentStep={step} toolColor="orange">
          <StepTransition currentStep={step} direction={direction}>
            {/* ============================================================ */}
            {/* Step 1: Background */}
            {/* ============================================================ */}
            {step === 1 && (
              <div>
                <h2 className="text-h4 text-white mb-2">
                  {t('step1_title')}
                </h2>
                <p className="text-sm text-muted mb-6">
                  {t('step1_helper')}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="radiogroup" aria-label={t('aria_background_selection')}>
                  {BACKGROUND_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const isSelected = formData.background === option.value;
                    return (
                      <button
                        key={option.value}
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setFormData((prev) => ({ ...prev, background: option.value }))}
                        className={`w-full flex items-center gap-4 p-4 md:p-5 rounded-xl border transition-all duration-200 text-left cursor-pointer ${
                          isSelected
                            ? 'bg-orange-500/10 border-orange-500/50 ring-1 ring-orange-500/30'
                            : 'bg-slate-blue border-slate-blue-light hover:bg-slate-blue-light/50'
                        }`}
                      >
                        <div
                          className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-blue-light text-muted'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className={`text-base font-medium ${isSelected ? 'text-white' : 'text-off-white'}`}>
                          {t(option.labelKey)}
                        </span>
                        {isSelected && (
                          <div className="ml-auto h-5 w-5 rounded-full bg-orange-500 flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    onClick={goForward}
                    disabled={!formData.background}
                    className="h-11 px-6 bg-orange-500 text-white font-semibold rounded-lg shadow-sm hover:bg-orange-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                  >
                    {t('continue_btn')}
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* Step 2: Industry */}
            {/* ============================================================ */}
            {step === 2 && (
              <div>
                <h2 className="text-h4 text-white mb-2">
                  {t('step2_title')}
                </h2>
                <p className="text-sm text-muted mb-6">
                  {t('step2_helper')}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4" role="radiogroup" aria-label={t('aria_industry_selection')}>
                  {INDUSTRY_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const isSelected = formData.industry === option.value;
                    return (
                      <button
                        key={option.value}
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setFormData((prev) => ({ ...prev, industry: option.value }))}
                        className={`w-full flex items-center gap-3 p-3 md:p-4 rounded-xl border transition-all duration-200 text-left cursor-pointer ${
                          isSelected
                            ? 'bg-orange-500/10 border-orange-500/50 ring-1 ring-orange-500/30'
                            : 'bg-slate-blue border-slate-blue-light hover:bg-slate-blue-light/50'
                        }`}
                      >
                        <div
                          className={`h-8 w-8 md:h-10 md:w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-blue-light text-muted'
                          }`}
                        >
                          <Icon className="h-4 w-4 md:h-5 md:w-5" />
                        </div>
                        <span className={`text-sm md:text-base font-medium ${isSelected ? 'text-white' : 'text-off-white'}`}>
                          {t(option.labelKey)}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={goBack}
                    className="text-sm font-medium text-muted hover:text-off-white transition-colors duration-200 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {t('back_btn')}
                  </button>
                  <button
                    onClick={goForward}
                    disabled={!formData.industry}
                    className="h-11 px-6 bg-orange-500 text-white font-semibold rounded-lg shadow-sm hover:bg-orange-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                  >
                    {t('continue_btn')}
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* Step 3: Problem Description */}
            {/* ============================================================ */}
            {step === 3 && (
              <div>
                <h2 className="text-h4 text-white mb-2">
                  {t('step3_title')}
                </h2>
                <p className="text-sm text-muted mb-6">
                  {t('step3_helper')}
                </p>

                <textarea
                  value={formData.problem}
                  onChange={(e) => setFormData((prev) => ({ ...prev, problem: e.target.value }))}
                  placeholder={t('textarea_placeholder')}
                  minLength={10}
                  maxLength={500}
                  className="w-full min-h-[160px] md:min-h-[200px] p-4 bg-slate-blue border border-slate-blue-light rounded-xl text-base text-off-white placeholder:text-muted-light hover:border-gray-700 focus:bg-slate-blue-light focus:border-orange-500 focus:text-white focus:outline-none focus:ring-1 focus:ring-orange-500 resize-y transition-all duration-200"
                />

                <div className="flex justify-end mt-1.5">
                  <span className={`text-xs ${formData.problem.length < 10 ? 'text-orange-400' : 'text-muted'}`}>
                    {t('char_counter', { count: formData.problem.length })}
                    {formData.problem.length > 0 && formData.problem.length < 10 && ` ${t('min_chars_warning')}`}
                  </span>
                </div>

                {/* Inspiration section */}
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-light mb-3">
                    {t('need_inspiration')}
                  </p>
                  <div className="space-y-2">
                    {INSPIRATION_PROMPT_KEYS.map((promptKey) => {
                      const promptText = t(promptKey);
                      return (
                        <button
                          key={promptKey}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, problem: promptText }))}
                          className="w-full text-left p-3 rounded-lg bg-slate-blue-light/30 border border-transparent text-sm text-muted-light italic hover:bg-slate-blue-light/50 hover:border-slate-blue-light hover:text-muted transition-all duration-200"
                        >
                          &ldquo;{promptText}&rdquo;
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={goBack}
                    className="text-sm font-medium text-muted hover:text-off-white transition-colors duration-200 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {t('back_btn')}
                  </button>
                  <button
                    onClick={goForward}
                    disabled={formData.problem.trim().length < 10}
                    className="h-11 px-6 bg-orange-500 text-white font-semibold rounded-lg shadow-sm hover:bg-orange-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                  >
                    {t('continue_btn')}
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* Step 4: Email Capture */}
            {/* ============================================================ */}
            {step === 4 && (
              <div>
                <div className="mb-4">
                  <button
                    onClick={goBack}
                    className="text-sm font-medium text-muted hover:text-off-white transition-colors duration-200 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {t('back_btn')}
                  </button>
                </div>
                <EmailCapture toolColor="orange" onSubmit={handleSubmit} />
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
    </main>
  );
}
