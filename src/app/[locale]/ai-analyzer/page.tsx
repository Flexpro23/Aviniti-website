'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Check, AlertTriangle, TrendingUp, Shield, Coins, Swords } from 'lucide-react';
import { ToolHero } from '@/components/ai-tools/ToolHero';
import { ToolForm } from '@/components/ai-tools/ToolForm';
import { StepTransition } from '@/components/ai-tools/StepTransition';
import { AIThinkingState } from '@/components/ai-tools/AIThinkingState';
import { ToolResults, ToolResultItem } from '@/components/ai-tools/ToolResults';
import { EmailCapture } from '@/components/ai-tools/EmailCapture';
import { CrossSellCTA } from '@/components/ai-tools/CrossSellCTA';
import { ScoreGauge } from '@/components/ai-tools/ScoreGauge';
import type { AnalyzerResponse } from '@/types/api';

export default function AIAnalyzerPage() {
  const t = useTranslations('ai_analyzer');

  // Form state
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [formData, setFormData] = useState({
    idea: '',
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
          locale: 'en',
        }),
      });

      const data = await res.json();

      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.error?.message || 'Failed to analyze idea. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
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
              'Analyzing market potential...',
              'Evaluating technical feasibility...',
              'Assessing competition landscape...',
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
    const { categories } = results;

    return (
      <main className="min-h-screen bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Results Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 text-xs font-medium uppercase tracking-wider mb-4">
              <Check className="h-3.5 w-3.5" />
              Analysis Complete
            </div>
            <h2 className="text-h2 text-white">{results.ideaName}</h2>
            <p className="text-base text-muted mt-3 max-w-xl mx-auto">{results.summary}</p>
          </div>

          {/* Overall Score Gauge */}
          <ToolResults toolColor="blue" className="mb-8">
            <ToolResultItem className="flex justify-center py-6">
              <ScoreGauge
                score={results.overallScore}
                label="Overall Viability Score"
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
                    <h3 className="text-lg font-semibold text-white">Market Potential</h3>
                    <span className="text-sm text-blue-400 font-medium">{categories.market.score}/100</span>
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
                    <h3 className="text-lg font-semibold text-white">Technical Feasibility</h3>
                    <span className="text-sm text-blue-400 font-medium">{categories.technical.score}/100</span>
                  </div>
                </div>
                <p className="text-sm text-off-white leading-relaxed mb-4">{categories.technical.analysis}</p>
                <div className="mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">Complexity: </span>
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
                    <h3 className="text-lg font-semibold text-white">Monetization</h3>
                    <span className="text-sm text-blue-400 font-medium">{categories.monetization.score}/100</span>
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
                    <h3 className="text-lg font-semibold text-white">Competition</h3>
                    <span className="text-sm text-blue-400 font-medium">{categories.competition.score}/100</span>
                  </div>
                </div>
                <p className="text-sm text-off-white leading-relaxed mb-4">{categories.competition.analysis}</p>
                <div className="mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">Intensity: </span>
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
              <h3 className="text-lg font-semibold text-white mb-4">Recommendations</h3>
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

          {/* Cross-sell */}
          <div className="mt-10 space-y-4">
            <CrossSellCTA
              targetTool="get-estimate"
              message="Like what you see? Get a detailed cost and timeline estimate for this idea."
            />
            <CrossSellCTA
              targetTool="roi-calculator"
              message="Curious about the return? Calculate the ROI of building this app."
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
        title={t('hero_title') || 'Validate Your App Idea with AI'}
        description={t('hero_description') || 'Describe your app idea and our AI will analyze its market potential, technical feasibility, monetization strategies, and competition.'}
        ctaText={t('hero_cta') || 'Analyze My Idea'}
        toolColor="blue"
        onCTAClick={handleStartAnalysis}
      />

      {/* Form */}
      <section id="analyzer-form" className="py-12 md:py-16">
        <ToolForm totalSteps={2} currentStep={step} toolColor="blue">
          <StepTransition currentStep={step} direction={direction}>
            {/* ============================================================ */}
            {/* Step 1: Describe your idea */}
            {/* ============================================================ */}
            {step === 1 && (
              <div>
                <h2 className="text-h4 text-white mb-2">
                  {t('step1_title') || 'Describe your app idea'}
                </h2>
                <p className="text-sm text-muted mb-6">
                  {t('step1_helper') || 'The more detail you provide, the better our AI can analyze your idea. Include what problem it solves, who it is for, and what makes it unique.'}
                </p>

                <textarea
                  value={formData.idea}
                  onChange={(e) => setFormData((prev) => ({ ...prev, idea: e.target.value }))}
                  placeholder="Describe your app idea in detail... What problem does it solve? Who is it for? What makes it different?"
                  minLength={30}
                  maxLength={2000}
                  className="w-full min-h-[200px] md:min-h-[260px] p-4 bg-slate-blue border border-slate-blue-light rounded-xl text-base text-off-white placeholder:text-muted-light hover:border-gray-700 focus:bg-slate-blue-light focus:border-blue-500 focus:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y transition-all duration-200"
                />

                <div className="flex justify-end mt-1.5">
                  <span className={`text-xs ${formData.idea.length > 0 && formData.idea.length < 30 ? 'text-blue-400' : 'text-muted'}`}>
                    {formData.idea.length} / 2000 chars
                    {formData.idea.length > 0 && formData.idea.length < 30 && ' (minimum 30 characters)'}
                  </span>
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    onClick={goForward}
                    disabled={formData.idea.trim().length < 30}
                    className="h-11 px-6 bg-blue-500 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                  >
                    Continue
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
                    Back
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
                Dismiss
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
