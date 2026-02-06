'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, ArrowLeft, Briefcase, User, GraduationCap, Palette, MoreHorizontal, Heart, DollarSign, BookOpen, ShoppingCart, Truck, Film, Plane, Home, UtensilsCrossed, Users, Check, Star } from 'lucide-react';
import { ToolHero } from '@/components/ai-tools/ToolHero';
import { ToolForm } from '@/components/ai-tools/ToolForm';
import { StepTransition } from '@/components/ai-tools/StepTransition';
import { AIThinkingState } from '@/components/ai-tools/AIThinkingState';
import { ToolResults, ToolResultItem } from '@/components/ai-tools/ToolResults';
import { EmailCapture } from '@/components/ai-tools/EmailCapture';
import { CrossSellCTA } from '@/components/ai-tools/CrossSellCTA';
import type { Background, Industry } from '@/types/api';
import type { IdeaLabResponse, IdeaLabIdea } from '@/types/api';

// ============================================================
// Background options for Step 1
// ============================================================
const BACKGROUND_OPTIONS: { value: Background; label: string; icon: typeof Briefcase }[] = [
  { value: 'entrepreneur', label: 'Entrepreneur / Business Owner', icon: Briefcase },
  { value: 'professional', label: 'Professional / Employee', icon: User },
  { value: 'student', label: 'Student / Academic', icon: GraduationCap },
  { value: 'creative', label: 'Creative / Freelancer', icon: Palette },
  { value: 'other', label: 'Other', icon: MoreHorizontal },
];

// ============================================================
// Industry options for Step 2
// ============================================================
const INDUSTRY_OPTIONS: { value: Industry; label: string; icon: typeof Heart }[] = [
  { value: 'health-wellness', label: 'Health and Wellness', icon: Heart },
  { value: 'finance-banking', label: 'Finance and Banking', icon: DollarSign },
  { value: 'education-learning', label: 'Education and Learning', icon: BookOpen },
  { value: 'ecommerce-retail', label: 'E-commerce and Retail', icon: ShoppingCart },
  { value: 'logistics-delivery', label: 'Logistics and Delivery', icon: Truck },
  { value: 'entertainment-media', label: 'Entertainment and Media', icon: Film },
  { value: 'travel-hospitality', label: 'Travel and Hospitality', icon: Plane },
  { value: 'real-estate', label: 'Real Estate', icon: Home },
  { value: 'food-restaurant', label: 'Food and Restaurant', icon: UtensilsCrossed },
  { value: 'social-community', label: 'Social and Community', icon: Users },
  { value: 'other', label: 'Other / Multiple', icon: MoreHorizontal },
];

// ============================================================
// Inspiration prompts for Step 3
// ============================================================
const INSPIRATION_PROMPTS = [
  'I run a clinic and patients always complain about wait times',
  "Students in my country can't find affordable tutoring",
  'Small restaurants struggle to manage delivery orders',
];

export default function IdeaLabPage() {
  const t = useTranslations('idea_lab');

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
          locale: 'en',
        }),
      });

      const data = await res.json();

      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.error?.message || 'Failed to generate ideas. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
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
              'Analyzing your industry and background...',
              'Exploring market opportunities...',
              'Generating creative app concepts...',
            ]}
          />
        </div>
      </main>
    );
  }

  // ============================================================
  // Results state
  // ============================================================
  if (results) {
    return (
      <main className="min-h-screen bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Results Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 text-orange-300 text-xs font-medium uppercase tracking-wider mb-4">
              <Check className="h-3.5 w-3.5" />
              Ideas Generated
            </div>
            <h2 className="text-h2 text-white">
              {t('results_title') || 'Here Are Your Personalized App Ideas'}
            </h2>
            <p className="text-base text-muted mt-3 max-w-xl mx-auto">
              Based on your background as {formData.background ? BACKGROUND_OPTIONS.find(b => b.value === formData.background)?.label : 'a professional'} in{' '}
              {formData.industry ? INDUSTRY_OPTIONS.find(i => i.value === formData.industry)?.label : 'your field'}, here are ideas that match your vision.
            </p>
          </div>

          {/* Idea Cards */}
          <ToolResults toolColor="orange" className="space-y-6 bg-transparent border-0 p-0">
            {results.ideas.map((idea: IdeaLabIdea, index: number) => (
              <ToolResultItem key={idea.id}>
                <article className="bg-slate-blue border border-slate-blue-light rounded-xl p-6 md:p-8 hover:border-orange-500/30 transition-all duration-300 group">
                  {/* Card header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                        Idea {index + 1}
                      </span>
                      <h3 className="text-xl md:text-2xl font-bold text-white mt-1">
                        {idea.name}
                      </h3>
                    </div>
                    <button
                      className="h-9 w-9 rounded-lg flex items-center justify-center text-muted hover:text-orange-400 hover:bg-orange-500/10 transition-colors duration-200"
                      aria-label={`Bookmark ${idea.name}`}
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
                      Key Features
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
                      <span className="text-xs text-muted block">Estimated Cost</span>
                      <span className="text-lg font-bold text-white mt-0.5 block">
                        ${idea.estimatedCost.min.toLocaleString()} - ${idea.estimatedCost.max.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-blue-light/40 rounded-lg p-3">
                      <span className="text-xs text-muted block">Timeline</span>
                      <span className="text-lg font-bold text-white mt-0.5 block">
                        {idea.estimatedTimeline}
                      </span>
                    </div>
                  </div>

                  {/* Card actions */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <a
                      href={`/ai-analyzer?idea=${encodeURIComponent(idea.description)}`}
                      className="h-11 px-5 bg-orange-500 text-white font-semibold rounded-lg shadow-sm hover:bg-orange-600 hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 flex-1 sm:flex-initial"
                    >
                      Explore This Idea
                      <ArrowRight className="h-4 w-4" />
                    </a>
                    <a
                      href={`/get-estimate?idea=${encodeURIComponent(idea.name)}`}
                      className="h-11 px-5 bg-transparent text-orange-400 border border-orange-500/30 font-semibold rounded-lg hover:bg-orange-500/10 hover:border-orange-500/50 transition-all duration-200 flex items-center justify-center gap-2 flex-1 sm:flex-initial"
                    >
                      Get Estimate
                    </a>
                  </div>
                </article>
              </ToolResultItem>
            ))}
          </ToolResults>

          {/* Cross-sell */}
          <div className="mt-10 space-y-4">
            <CrossSellCTA
              targetTool="ai-analyzer"
              message="Want to validate one of these ideas? Let our AI analyze its market potential."
            />
            <CrossSellCTA
              targetTool="get-estimate"
              message="Ready to build? Get a detailed cost and timeline estimate."
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
        title={t('hero_title') || "Don't Have an App Idea? Let's Discover One Together."}
        description={t('hero_description') || 'Answer 3 quick questions and our AI will generate personalized app ideas tailored to your background, industry, and vision.'}
        ctaText={t('hero_cta') || 'Start Discovery'}
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
                  {t('step1_title') || "Tell me about yourself -- what's your background?"}
                </h2>
                <p className="text-sm text-muted mb-6">
                  {t('step1_helper') || 'This helps us match ideas to your strengths and experience.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="radiogroup" aria-label="Background selection">
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
                          {option.label}
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
                    Continue
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
                  {t('step2_title') || 'What industry or area interests you most?'}
                </h2>
                <p className="text-sm text-muted mb-6">
                  {t('step2_helper') || 'Pick the area where you see the most opportunity.'}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4" role="radiogroup" aria-label="Industry selection">
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
                          {option.label}
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
                    Back
                  </button>
                  <button
                    onClick={goForward}
                    disabled={!formData.industry}
                    className="h-11 px-6 bg-orange-500 text-white font-semibold rounded-lg shadow-sm hover:bg-orange-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                  >
                    Continue
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
                  {t('step3_title') || 'What problem do you want to solve or what opportunity do you see?'}
                </h2>
                <p className="text-sm text-muted mb-6">
                  {t('step3_helper') || 'Be as specific as you can -- the more detail you give, the better your ideas will be.'}
                </p>

                <textarea
                  value={formData.problem}
                  onChange={(e) => setFormData((prev) => ({ ...prev, problem: e.target.value }))}
                  placeholder="Describe the challenge you're facing or the opportunity you've spotted..."
                  minLength={10}
                  maxLength={500}
                  className="w-full min-h-[160px] md:min-h-[200px] p-4 bg-slate-blue border border-slate-blue-light rounded-xl text-base text-off-white placeholder:text-muted-light hover:border-gray-700 focus:bg-slate-blue-light focus:border-orange-500 focus:text-white focus:outline-none focus:ring-1 focus:ring-orange-500 resize-y transition-all duration-200"
                />

                <div className="flex justify-end mt-1.5">
                  <span className={`text-xs ${formData.problem.length < 10 ? 'text-orange-400' : 'text-muted'}`}>
                    {formData.problem.length} / 500 chars
                    {formData.problem.length > 0 && formData.problem.length < 10 && ' (minimum 10 characters)'}
                  </span>
                </div>

                {/* Inspiration section */}
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-light mb-3">
                    Need inspiration?
                  </p>
                  <div className="space-y-2">
                    {INSPIRATION_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, problem: prompt }))}
                        className="w-full text-left p-3 rounded-lg bg-slate-blue-light/30 border border-transparent text-sm text-muted-light italic hover:bg-slate-blue-light/50 hover:border-slate-blue-light hover:text-muted transition-all duration-200"
                      >
                        &ldquo;{prompt}&rdquo;
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={goBack}
                    className="text-sm font-medium text-muted hover:text-off-white transition-colors duration-200 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                  <button
                    onClick={goForward}
                    disabled={formData.problem.trim().length < 10}
                    className="h-11 px-6 bg-orange-500 text-white font-semibold rounded-lg shadow-sm hover:bg-orange-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                  >
                    Continue
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
                    Back
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
                Dismiss
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
