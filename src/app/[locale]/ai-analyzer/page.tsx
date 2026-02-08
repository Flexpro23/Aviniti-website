'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowLeft, Check, AlertTriangle, TrendingUp, Shield, Coins, Swords, Link2, CheckCircle2, Info, X } from 'lucide-react';
import { ToolHero } from '@/components/ai-tools/ToolHero';
import { ToolForm } from '@/components/ai-tools/ToolForm';
import { StepTransition } from '@/components/ai-tools/StepTransition';
import { AIThinkingState } from '@/components/ai-tools/AIThinkingState';
import { ToolResults, ToolResultItem } from '@/components/ai-tools/ToolResults';
import { EmailCapture } from '@/components/ai-tools/EmailCapture';
import { CrossSellCTA } from '@/components/ai-tools/CrossSellCTA';
import { ScoreGauge } from '@/components/ai-tools/ScoreGauge';
import { useResultPersistence } from '@/hooks/useResultPersistence';
import type { AnalyzerResponse } from '@/types/api';

export default function AIAnalyzerPage() {
  const t = useTranslations('ai_analyzer');
  const locale = useLocale();
  const searchParams = useSearchParams();

  // Check for pre-fill from Idea Lab
  const fromIdea = searchParams.get('fromIdea') === 'true';
  const ideaName = searchParams.get('ideaName') || '';
  const ideaDescription = searchParams.get('ideaDescription') || '';

  const [showPrefilledBanner, setShowPrefilledBanner] = useState(fromIdea);

  // Form state
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [formData, setFormData] = useState({
    idea: fromIdea ? `${ideaName}\n\n${ideaDescription}` : '',
    email: '',
    whatsapp: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalyzerResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Navigation
  const goForward = () => {
    setDirection('forward');
    setStep((prev) => prev + 1);
  };

  const goBack = () => {
    setDirection('backward');
    setStep((prev) => prev - 1);
  };

  // Submit handler
  const handleSubmit = async (emailData: { email: string; whatsapp: boolean }) => {
    const updatedData = { ...formData, ...emailData };
    setFormData(updatedData);
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: updatedData.idea,
          email: updatedData.email,
          whatsapp: updatedData.whatsapp,
          locale,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.error?.message || t('errors.failed'));
      }
    } catch {
      setError(t('errors.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAnalysis = () => {
    const formSection = document.getElementById('analyzer-form');
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
            toolColor="blue"
            messages={[
              t('loading_processing'),
              t('loading_evaluating'),
              t('loading_assessing'),
              t('loading_compiling'),
            ]}
          />
        </div>
      </main>
    );
  }

  // Result persistence state
  const [isCopied, setIsCopied] = useState(false);
  const { saveResult, copyShareableUrl, savedId } = useResultPersistence('ai-analyzer');

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
    const { categories } = results;

    const handleCopyLink = async () => {
      const success = await copyShareableUrl();
      if (success) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    };

    return (
      <main className="min-h-screen bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Results Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 text-xs font-medium uppercase tracking-wider mb-4">
              <Check className="h-3.5 w-3.5" />
              {t('results_analysis_complete')}
            </div>
            <h2 className="text-h2 text-white">{results.ideaName}</h2>
            <p className="text-base text-muted mt-3 max-w-xl mx-auto">{results.summary}</p>
          </div>

          {/* Overall Score Gauge */}
          <ToolResults toolColor="blue" className="mb-8">
            <ToolResultItem className="flex justify-center py-6">
              <ScoreGauge
                score={results.overallScore}
                label={t('results_overall_score_label')}
                toolColor="blue"
                size="lg"
              />
            </ToolResultItem>
          </ToolResults>

          {/* 4 Analysis Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Market Potential */}
            <ToolResults toolColor="blue">
              <ToolResultItem>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{t('results_section_market')}</h3>
                    <span className="text-sm text-blue-400 font-medium">{categories.market.score}{t('results_score_suffix')}</span>
                  </div>
                </div>
                <p className="text-sm text-off-white leading-relaxed mb-4">{categories.market.analysis}</p>
                <ul className="space-y-2">
                  {categories.market.findings.map((finding: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted">
                      <Check className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      {finding}
                    </li>
                  ))}
                </ul>
              </ToolResultItem>
            </ToolResults>

            {/* Technical Feasibility */}
            <ToolResults toolColor="blue">
              <ToolResultItem>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{t('results_section_technical')}</h3>
                    <span className="text-sm text-blue-400 font-medium">{categories.technical.score}{t('results_score_suffix')}</span>
                  </div>
                </div>
                <p className="text-sm text-off-white leading-relaxed mb-4">{categories.technical.analysis}</p>
                <div className="mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">{t('results_complexity_label')}</span>
                  <span className="text-xs text-blue-300 capitalize">{categories.technical.complexity}</span>
                </div>
                {categories.technical.suggestedTechStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {categories.technical.suggestedTechStack.map((tech: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 text-xs font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <ul className="space-y-2">
                  {categories.technical.challenges.map((challenge: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted">
                      <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                      {challenge}
                    </li>
                  ))}
                </ul>
              </ToolResultItem>
            </ToolResults>

            {/* Monetization */}
            <ToolResults toolColor="blue">
              <ToolResultItem>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Coins className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{t('results_section_monetization')}</h3>
                    <span className="text-sm text-blue-400 font-medium">{categories.monetization.score}{t('results_score_suffix')}</span>
                  </div>
                </div>
                <p className="text-sm text-off-white leading-relaxed mb-4">{categories.monetization.analysis}</p>
                {categories.monetization.revenueModels.map((model, i: number) => (
                  <div key={i} className="mb-3 p-3 rounded-lg bg-slate-blue-light/30">
                    <h4 className="text-sm font-semibold text-white">{model.name}</h4>
                    <p className="text-xs text-muted mt-1">{model.description}</p>
                  </div>
                ))}
              </ToolResultItem>
            </ToolResults>

            {/* Competition */}
            <ToolResults toolColor="blue">
              <ToolResultItem>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Swords className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{t('results_section_competition')}</h3>
                    <span className="text-sm text-blue-400 font-medium">{categories.competition.score}{t('results_score_suffix')}</span>
                  </div>
                </div>
                <p className="text-sm text-off-white leading-relaxed mb-4">{categories.competition.analysis}</p>
                <div className="mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">{t('results_intensity_label')}</span>
                  <span className="text-xs text-blue-300 capitalize">{categories.competition.intensity.replace('-', ' ')}</span>
                </div>
                {categories.competition.competitors.map((competitor, i: number) => (
                  <div key={i} className="mb-2 p-3 rounded-lg bg-slate-blue-light/30">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-white">{competitor.name}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 text-xs capitalize">
                        {competitor.type}
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-1">{competitor.description}</p>
                  </div>
                ))}
              </ToolResultItem>
            </ToolResults>
          </div>

          {/* Recommendations */}
          <ToolResults toolColor="blue" className="mb-8">
            <ToolResultItem>
              <h3 className="text-lg font-semibold text-white mb-4">{t('results_section_recommendations')}</h3>
              <ol className="space-y-3">
                {results.recommendations.map((rec: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-off-white">
                    <span className="h-6 w-6 rounded-full bg-blue-500/15 flex items-center justify-center text-xs font-semibold text-blue-400 flex-shrink-0">
                      {i + 1}
                    </span>
                    {rec}
                  </li>
                ))}
              </ol>
            </ToolResultItem>
          </ToolResults>

          {/* Save Results Button */}
          <div className="flex justify-center mb-10">
            <button
              onClick={handleCopyLink}
              className="h-11 px-6 bg-slate-blue-light hover:bg-slate-blue-light/80 text-off-white rounded-lg font-semibold transition-all duration-200 inline-flex items-center gap-2"
            >
              {isCopied ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  {t('buttons_link_copied')}
                </>
              ) : (
                <>
                  <Link2 className="h-5 w-5" />
                  {t('buttons_save_share')}
                </>
              )}
            </button>
          </div>

          {/* Cross-sell */}
          <div className="mt-10 space-y-4">
            <CrossSellCTA
              targetTool="get-estimate"
              message={t('cross_sell_estimate')}
            />
            <CrossSellCTA
              targetTool="roi-calculator"
              message={t('cross_sell_roi')}
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
        toolSlug="ai-analyzer"
        title={t('hero_title')}
        description={t('hero_description')}
        ctaText={t('hero_cta')}
        toolColor="blue"
        onCTAClick={handleStartAnalysis}
      />

      {/* Form */}
      <section id="analyzer-form" className="py-12 md:py-16">
        {/* Pre-filled Banner */}
        {showPrefilledBanner && ideaName && (
          <div className="max-w-3xl mx-auto px-4 mb-6">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-blue-300">
                  {t('prefilled_from_idea_lab', { name: ideaName })}
                </p>
              </div>
              <button
                onClick={() => setShowPrefilledBanner(false)}
                className="text-blue-300 hover:text-white transition-colors"
                aria-label={t('aria_dismiss')}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <ToolForm totalSteps={2} currentStep={step} toolColor="blue">
          <StepTransition currentStep={step} direction={direction}>
            {/* ============================================================ */}
            {/* Step 1: Describe your idea */}
            {/* ============================================================ */}
            {step === 1 && (
              <div>
                <h2 className="text-h4 text-white mb-2">
                  {t('step1_title')}
                </h2>
                <p className="text-sm text-muted mb-6">
                  {t('step1_helper')}
                </p>

                <textarea
                  value={formData.idea}
                  onChange={(e) => setFormData((prev) => ({ ...prev, idea: e.target.value }))}
                  placeholder={t('form_textarea_placeholder')}
                  minLength={30}
                  maxLength={2000}
                  className="w-full min-h-[200px] md:min-h-[260px] p-4 bg-slate-blue border border-slate-blue-light rounded-xl text-base text-off-white placeholder:text-muted-light hover:border-gray-700 focus:bg-slate-blue-light focus:border-blue-500 focus:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y transition-all duration-200"
                />

                <div className="flex justify-end mt-1.5">
                  <span className={`text-xs ${formData.idea.length > 0 && formData.idea.length < 30 ? 'text-blue-400' : 'text-muted'}`}>
                    {t('form_char_limit', { count: formData.idea.length })}
                    {formData.idea.length > 0 && formData.idea.length < 30 && ` ${t('form_min_chars')}`}
                  </span>
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    onClick={goForward}
                    disabled={formData.idea.trim().length < 30}
                    className="h-11 px-6 bg-blue-500 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                  >
                    {t('buttons_continue')}
                    <ArrowLeft className="h-5 w-5 rotate-180" />
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* Step 2: Email Capture */}
            {/* ============================================================ */}
            {step === 2 && (
              <div>
                <div className="mb-4">
                  <button
                    onClick={goBack}
                    className="text-sm font-medium text-muted hover:text-off-white transition-colors duration-200 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {t('buttons_back')}
                  </button>
                </div>
                <EmailCapture toolColor="blue" onSubmit={handleSubmit} />
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
                {t('buttons_dismiss')}
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
