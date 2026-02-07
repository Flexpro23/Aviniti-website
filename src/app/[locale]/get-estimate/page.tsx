'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Globe,
  Brain,
  Cloud,
  Layers,
  Check,
  DollarSign,
  Sparkles,
  Lightbulb,
  Link2,
  CheckCircle2,
  Clock,
  MessageSquare,
  ListChecks,
  FileText,
  ChevronDown,
} from 'lucide-react';
import { ToolHero } from '@/components/ai-tools/ToolHero';
import { ToolForm } from '@/components/ai-tools/ToolForm';
import { StepTransition } from '@/components/ai-tools/StepTransition';
import { AIThinkingState } from '@/components/ai-tools/AIThinkingState';
import { ProcessingState } from '@/components/ai-tools/ProcessingState';
import { ToolResults, ToolResultItem } from '@/components/ai-tools/ToolResults';
import { CrossSellCTA } from '@/components/ai-tools/CrossSellCTA';
import { CostBreakdownChart } from '@/components/ai-tools/charts/CostBreakdownChart';
import { TimelinePhases } from '@/components/ai-tools/TimelinePhases';
import { StrategicInsights } from '@/components/ai-tools/StrategicInsights';
import { PDFReport } from '@/components/ai-tools/PDFReport';
import { ConsultationCTA } from '@/components/ai-tools/ConsultationCTA';
import { TechStackToggle } from '@/components/ai-tools/TechStackToggle';
import { EstimateHeroVisual } from '@/components/ai-tools/EstimateHeroVisual';
import { ResultsNav } from '@/components/ai-tools/ResultsNav';
import { useResultPersistence } from '@/hooks/useResultPersistence';
import type {
  ProjectType,
  EstimateResponse,
  EstimatePhase,
  SmartQuestion,
  AIFeature,
  AnalyzeIdeaResponse,
  GenerateFeaturesResponse,
} from '@/types/api';

// ============================================================
// Project Type Options
// ============================================================
const PROJECT_TYPE_OPTIONS: {
  value: ProjectType;
  labelKey: string;
  descKey: string;
  icon: typeof Smartphone;
}[] = [
  { value: 'mobile', labelKey: 'mobile', descKey: 'mobile_desc', icon: Smartphone },
  { value: 'web', labelKey: 'web', descKey: 'web_desc', icon: Globe },
  { value: 'ai', labelKey: 'ai_ml', descKey: 'ai_ml_desc', icon: Brain },
  { value: 'cloud', labelKey: 'cloud', descKey: 'cloud_desc', icon: Cloud },
  { value: 'fullstack', labelKey: 'fullstack', descKey: 'fullstack_desc', icon: Layers },
];

// ============================================================
// Step icons for the stepper
// ============================================================
const STEP_ICONS = [Layers, MessageSquare, Brain, ListChecks, Sparkles, CheckCircle2];

// ============================================================
// Impact badge colors
// ============================================================
const IMPACT_COLORS = {
  low: 'bg-green-500/15 text-green-400 border-green-500/30',
  medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  high: 'bg-red-500/15 text-red-400 border-red-500/30',
};

export default function GetEstimatePage() {
  const t = useTranslations('get_estimate');
  const locale = useLocale();
  const searchParams = useSearchParams();

  // Check for pre-fill from Idea Lab
  const fromIdea = searchParams.get('fromIdea') === 'true';
  const ideaName = searchParams.get('ideaName') || '';
  const ideaDescription = searchParams.get('ideaDescription') || '';

  // Form state
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  // Step 1: Project Type
  const [projectType, setProjectType] = useState<ProjectType | ''>('');

  // Step 2: Description
  const [description, setDescription] = useState(
    fromIdea ? `${ideaName}\n\n${ideaDescription}` : ''
  );

  // Step 3: AI Questions
  const [aiSummary, setAiSummary] = useState('');
  const [questions, setQuestions] = useState<SmartQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, boolean | undefined>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Step 4: Features
  const [mustHaveFeatures, setMustHaveFeatures] = useState<AIFeature[]>([]);
  const [enhancementFeatures, setEnhancementFeatures] = useState<AIFeature[]>([]);
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<Set<string>>(new Set());
  const [isGeneratingFeatures, setIsGeneratingFeatures] = useState(false);

  // Step 5: Contact Info
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: false,
  });

  // Form validation errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Step 6: Results
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<EstimateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Abort controller for cancelling fetch
  const abortControllerRef = useRef<AbortController | null>(null);

  // Results: clickable alternative names
  const [displayName, setDisplayName] = useState('');
  const [altNames, setAltNames] = useState<string[]>([]);

  // Result persistence
  const [isCopied, setIsCopied] = useState(false);
  const { saveResult, copyShareableUrl, savedId } = useResultPersistence('estimate');

  // Save result when it arrives
  useEffect(() => {
    if (results && !savedId) {
      saveResult(results);
    }
  }, [results, savedId, saveResult]);

  // Set display name when results arrive
  useEffect(() => {
    if (results) {
      setDisplayName(results.projectName);
      setAltNames(results.alternativeNames || []);
    }
  }, [results]);

  // Step labels from translations
  const stepLabels = [
    t('steps.step_1'),
    t('steps.step_2'),
    t('steps.step_3'),
    t('steps.step_4'),
    t('steps.step_5'),
    t('steps.step_6'),
  ];

  // Navigation
  const goForward = () => {
    setDirection('forward');
    setStep((prev) => prev + 1);
  };

  const goBack = () => {
    setDirection('backward');
    setStep((prev) => prev - 1);
  };

  // ============================================================
  // Step 2 -> Step 3: Analyze idea with AI
  // ============================================================
  const handleAnalyzeIdea = async () => {
    setIsAnalyzing(true);
    setError(null);
    setDirection('forward');
    setStep(3);

    try {
      const res = await fetch('/api/ai/analyze-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectType,
          description,
          locale,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const response = data.data as AnalyzeIdeaResponse;
        setAiSummary(response.summary);
        setQuestions(response.questions);
        // Initialize all answers as undefined (unanswered)
        const initialAnswers: Record<string, boolean | undefined> = {};
        response.questions.forEach((q: SmartQuestion) => {
          initialAnswers[q.id] = undefined;
        });
        setAnswers(initialAnswers);
      } else {
        setError(data.error?.message || 'Failed to analyze your idea. Please try again.');
        setStep(2); // Go back to description
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setStep(2);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ============================================================
  // Step 3 -> Step 4: Generate features based on answers
  // ============================================================
  const handleGenerateFeatures = async () => {
    setIsGeneratingFeatures(true);
    setError(null);
    setDirection('forward');
    setStep(4);

    try {
      const res = await fetch('/api/ai/generate-features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectType,
          description,
          answers: Object.fromEntries(
            Object.entries(answers).map(([k, v]) => [k, v ?? false])
          ),
          questions,
          locale,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const response = data.data as GenerateFeaturesResponse;
        setMustHaveFeatures(response.mustHave);
        setEnhancementFeatures(response.enhancements);
        // Pre-select all must-have features
        const preSelected = new Set(response.mustHave.map((f: AIFeature) => f.id));
        setSelectedFeatureIds(preSelected);
      } else {
        setError(data.error?.message || 'Failed to generate features. Please try again.');
        setStep(3);
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setStep(3);
    } finally {
      setIsGeneratingFeatures(false);
    }
  };

  // Toggle feature selection
  const toggleFeature = (featureId: string) => {
    setSelectedFeatureIds((prev) => {
      const next = new Set(prev);
      if (next.has(featureId)) {
        next.delete(featureId);
      } else {
        next.add(featureId);
      }
      return next;
    });
  };

  // Get all selected features as AIFeature[]
  const getSelectedFeatures = (): AIFeature[] => {
    const allFeatures = [...mustHaveFeatures, ...enhancementFeatures];
    return allFeatures.filter((f) => selectedFeatureIds.has(f.id));
  };

  // ============================================================
  // Validation helpers
  // ============================================================
  const validateEmail = (email: string): boolean => {
    if (!email) return true; // Optional field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return false; // Required field
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 10;
  };

  const handleFieldBlur = (field: string) => {
    const errors: Record<string, string> = {};

    if (field === 'email' && contactInfo.email && !validateEmail(contactInfo.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (field === 'phone' && !validatePhone(contactInfo.phone)) {
      errors.phone = 'Phone number must be at least 10 digits';
    }

    setFormErrors((prev) => ({ ...prev, ...errors }));
  };

  // ============================================================
  // Step 5 -> Step 6: Generate full estimate
  // ============================================================
  const handleSubmit = async () => {
    // Validate before submitting
    const errors: Record<string, string> = {};

    if (!contactInfo.name.trim()) {
      errors.name = 'First name is required';
    }

    if (!validatePhone(contactInfo.phone)) {
      errors.phone = 'Phone number must be at least 10 digits';
    }

    if (contactInfo.email && !validateEmail(contactInfo.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);
    setFormErrors({});
    setDirection('forward');
    setStep(6);

    try {
      const res = await fetch('/api/ai/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectType,
          description,
          answers: Object.fromEntries(
            Object.entries(answers).map(([k, v]) => [k, v ?? false])
          ),
          questions,
          selectedFeatures: getSelectedFeatures(),
          name: contactInfo.name,
          email: contactInfo.email || undefined,
          phone: contactInfo.phone,
          whatsapp: contactInfo.whatsapp,
          locale,
        }),
        signal: controller.signal,
      });

      const data = await res.json();

      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.error?.message || 'Failed to generate estimate. Please try again.');
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // User cancelled — do nothing, state already reset in handleCancel
        return;
      }
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
    setDirection('backward');
    setStep(5);
  };

  const handleStartEstimate = () => {
    const formSection = document.getElementById('estimate-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopyLink = async () => {
    const success = await copyShareableUrl();
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Swap an alt name with the display name
  const handleSwapName = (clickedName: string) => {
    setAltNames((prev) => {
      const next = prev.filter((n) => n !== clickedName);
      next.push(displayName);
      return next;
    });
    setDisplayName(clickedName);
  };

  // Compute answer progress for Step 3
  const answeredCount = Object.values(answers).filter((v) => v !== undefined).length;
  const totalQuestions = questions.length;

  // Get project type label for review section
  const getProjectTypeLabel = () => {
    const option = PROJECT_TYPE_OPTIONS.find((o) => o.value === projectType);
    return option ? t(`step1.project_type.${option.labelKey}`) : '';
  };

  // ============================================================
  // Loading state (Step 6 processing) — Premium full-page experience
  // ============================================================
  if (step === 6 && isLoading) {
    return (
      <ProcessingState
        featureCount={getSelectedFeatures().length}
        messages={[
          t('loading.analyzing') || 'Understanding your project scope...',
          t('loading.calculating') || 'Calculating costs & timeline...',
          'Matching with our solution catalog...',
          'Generating your comprehensive blueprint...',
        ]}
        onCancel={handleCancel}
      />
    );
  }

  // ============================================================
  // Results Nav sections
  // ============================================================
  const navSections = [
    { id: 'results-summary', label: t('results.nav.summary') },
    { id: 'results-breakdown', label: t('results.nav.breakdown') },
    { id: 'results-cost-chart', label: t('results.nav.cost_chart') },
    { id: 'results-timeline', label: t('results.nav.timeline') },
    { id: 'results-insights', label: t('results.nav.insights') },
    { id: 'results-next-steps', label: t('results.nav.next_steps') },
  ];

  // ============================================================
  // Results state (Step 6 complete)
  // ============================================================
  if (step === 6 && results) {
    const costDisplay = `$${results.estimatedCost.min.toLocaleString()}–$${results.estimatedCost.max.toLocaleString()}`;

    return (
      <main className="min-h-screen bg-navy">
        {/* Sticky anchor navigation */}
        <ResultsNav sections={navSections} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Results Header */}
          <div id="results-summary" className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bronze/10 text-bronze-light text-xs font-medium uppercase tracking-wider mb-4 border border-bronze/20">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {t('results.title') || 'Project Blueprint Ready'}
            </div>
            <h2 className="text-h2 text-white">
              {displayName || 'Your Project Blueprint'}
            </h2>
            {altNames.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                <span className="text-xs text-muted">{t('results.also_consider')}</span>
                {altNames.map((name, i) => (
                  <button
                    key={i}
                    onClick={() => handleSwapName(name)}
                    className="px-3 py-1 rounded-full bg-slate-blue-light/60 text-off-white text-sm border border-slate-blue-light hover:border-bronze/40 hover:bg-bronze/10 transition-all duration-200 cursor-pointer"
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
            {results.projectSummary && (
              <p className="text-base text-muted mt-3 max-w-xl mx-auto">
                {results.projectSummary}
              </p>
            )}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <ToolResults toolColor="orange" className="text-center">
              <ToolResultItem>
                <div className="mx-auto mb-3 h-10 w-10 rounded-lg bg-bronze/15 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-bronze-light" />
                </div>
                <p className="text-sm text-muted">{t('results.estimated_cost') || 'Estimated Cost'}</p>
                <p className="text-2xl font-bold text-white mt-1">
                  ${results.estimatedCost.min.toLocaleString()} - $
                  {results.estimatedCost.max.toLocaleString()}
                </p>
              </ToolResultItem>
            </ToolResults>

            <ToolResults toolColor="orange" className="text-center">
              <ToolResultItem>
                <div className="mx-auto mb-3 h-10 w-10 rounded-lg bg-tool-blue/15 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-tool-blue-light" />
                </div>
                <p className="text-sm text-muted">{t('results.estimated_timeline') || 'Estimated Timeline'}</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {results.estimatedTimeline.weeks} Weeks
                </p>
              </ToolResultItem>
            </ToolResults>

            <ToolResults toolColor="orange" className="text-center">
              <ToolResultItem>
                <div className="mx-auto mb-3 h-10 w-10 rounded-lg bg-tool-purple/15 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-tool-purple-light" />
                </div>
                <p className="text-sm text-muted">Project Phases</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {results.breakdown.length} Phases
                </p>
              </ToolResultItem>
            </ToolResults>
          </div>

          {/* Tech Stack — Collapsible */}
          {results.techStack && results.techStack.length > 0 && (
            <div className="mb-8">
              <TechStackToggle techStack={results.techStack} />
            </div>
          )}

          {/* Breakdown Table */}
          <div id="results-breakdown">
            <ToolResults toolColor="orange" className="mb-8 p-0 overflow-hidden">
              <ToolResultItem>
                <div className="px-6 py-4 border-b border-slate-blue-light flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    {t('results.breakdown_title') || 'Project Breakdown'}
                  </h3>
                  <span className="text-sm text-bronze-light font-medium">
                    ${results.breakdown.reduce((s, p) => s + p.cost, 0).toLocaleString()} total
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-blue-light">
                        <th className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">
                          Phase
                        </th>
                        <th className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider text-right">
                          Cost
                        </th>
                        <th className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider text-right">
                          Duration
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-blue-light/50">
                      {results.breakdown.map((phase: EstimatePhase) => (
                        <tr key={phase.phase} className="hover:bg-navy/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className="h-6 w-6 rounded-full bg-bronze/15 flex items-center justify-center text-xs font-semibold text-bronze-light">
                                {phase.phase}
                              </span>
                              <div>
                                <span className="text-sm font-medium text-off-white block">
                                  {phase.name}
                                </span>
                                <span className="text-xs text-muted">{phase.description}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-off-white text-right">
                            ${phase.cost.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted text-right">
                            {phase.duration}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ToolResultItem>
            </ToolResults>
          </div>

          {/* Cost Chart — Full Width */}
          <div id="results-cost-chart" className="mb-8">
            <ToolResults toolColor="orange">
              <ToolResultItem>
                <CostBreakdownChart breakdown={results.breakdown} />
              </ToolResultItem>
            </ToolResults>
          </div>

          {/* Project Timeline */}
          <div id="results-timeline">
            <ToolResults toolColor="orange" className="mb-8">
              <ToolResultItem>
                <h3 className="text-lg font-semibold text-white mb-6">
                  {t('results.timeline_title') || 'Project Timeline'}
                </h3>
                <TimelinePhases
                  phases={results.breakdown.map((phase) => ({
                    name: phase.name,
                    description: phase.description,
                    duration: phase.duration,
                    cost: `$${phase.cost.toLocaleString()}`,
                  }))}
                  toolColor="orange"
                />
              </ToolResultItem>
            </ToolResults>
          </div>

          {/* Strategic Insights */}
          <div id="results-insights">
            {results.strategicInsights && results.strategicInsights.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-6">
                  {t('results.strategic_insights_title') || 'Strategic Insights'}
                </h3>
                <StrategicInsights insights={results.strategicInsights} />
              </div>
            )}

            {/* Key Insights */}
            <ToolResults toolColor="orange" className="mb-8">
              <ToolResultItem>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-bronze/15 flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-bronze-light" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {t('results.key_insights') || 'AI Insights'}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {results.keyInsights.map((insight: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-off-white leading-relaxed"
                    >
                      <Check className="h-4 w-4 text-bronze-light mt-0.5 flex-shrink-0" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </ToolResultItem>
            </ToolResults>
          </div>

          {/* Action Buttons */}
          <div id="results-next-steps" className="border-t border-slate-blue-light/50 pt-8 mt-10">
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <PDFReport
                results={results}
                userName={contactInfo.name}
                userEmail={contactInfo.email}
                className="flex-1 h-12 px-6 text-base shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
              />
              <button
                onClick={handleCopyLink}
                className="h-12 px-6 bg-slate-blue hover:bg-slate-blue-light text-off-white rounded-xl font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2 flex-1 border border-slate-blue-light/80 shadow-md"
              >
                {isCopied ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    {t('results.link_copied') || 'Link Copied!'}
                  </>
                ) : (
                  <>
                    <Link2 className="h-5 w-5" />
                    {t('results.copy_link') || 'Copy Shareable Link'}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Consultation CTA */}
          <div className="mb-10">
            <ConsultationCTA projectName={displayName || results.projectName} />
          </div>

          {/* Personalized Cross-sell */}
          <div className="mt-10 space-y-4">
            <CrossSellCTA
              targetTool="roi-calculator"
              message={t('cross_sell.roi', {
                projectName: displayName || results.projectName,
                cost: `${results.estimatedCost.min.toLocaleString()}–$${results.estimatedCost.max.toLocaleString()}`,
              })}
            />
            <CrossSellCTA
              targetTool="ai-analyzer"
              message={t('cross_sell.analyzer', {
                projectName: displayName || results.projectName,
              })}
            />
          </div>
        </div>
      </main>
    );
  }

  // ============================================================
  // Form (Steps 1-5)
  // ============================================================
  return (
    <main className="min-h-screen bg-navy">
      {/* Hero */}
      <ToolHero
        toolSlug="get-estimate"
        title={t('hero_title') || 'Get Your AI-Powered Project Estimate'}
        description={
          t('hero_description') ||
          'Describe your idea in plain language and our AI will generate a detailed Project Blueprint with cost breakdown, timeline, and recommendations.'
        }
        ctaText={t('hero_cta') || 'Start Estimate'}
        toolColor="green"
        onCTAClick={handleStartEstimate}
      />

      {/* Hero floating cards (desktop only) */}
      <div className="max-w-4xl mx-auto px-4">
        <EstimateHeroVisual />
      </div>

      {/* Social proof */}
      <div className="flex justify-center mt-6 mb-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-blue-light/50 border border-slate-blue-light">
          <div className="flex -space-x-1.5">
            <div className="w-5 h-5 rounded-full bg-bronze/60 border border-navy" />
            <div className="w-5 h-5 rounded-full bg-tool-blue/60 border border-navy" />
            <div className="w-5 h-5 rounded-full bg-tool-green/60 border border-navy" />
          </div>
          <span className="text-xs text-muted font-medium">
            {t('social_proof')}
          </span>
        </div>
      </div>

      {/* Form */}
      <section id="estimate-form" className="py-12 md:py-16">
        <ToolForm
          totalSteps={6}
          currentStep={step}
          toolColor="green"
          stepLabels={stepLabels}
          stepIcons={STEP_ICONS}
        >
          <StepTransition currentStep={step} direction={direction}>
            {/* ============================================================ */}
            {/* Step 1: Project Type */}
            {/* ============================================================ */}
            {step === 1 && (
              <div>
                <h2 className="text-h4 text-white mb-2">
                  {t('step1.title') || 'What type of project do you want to build?'}
                </h2>
                <p className="text-sm text-muted mb-6">
                  {t('step1.description') || 'Select the platform that best describes your project'}
                </p>

                <div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  role="radiogroup"
                  aria-label="Project type"
                >
                  {PROJECT_TYPE_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const isSelected = projectType === option.value;
                    return (
                      <button
                        key={option.value}
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setProjectType(option.value)}
                        className={`w-full flex items-start gap-4 p-4 md:p-5 rounded-lg border-2 transition-all duration-200 text-left cursor-pointer ${
                          option.value === 'fullstack' ? 'sm:col-span-2' : ''
                        } ${
                          isSelected
                            ? 'border-tool-green bg-tool-green/10'
                            : 'border-slate-blue-light bg-navy hover:bg-tool-green/5 hover:border-tool-green/30'
                        }`}
                      >
                        <div className="h-10 w-10 rounded-lg bg-tool-green/15 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-5 w-5 text-tool-green-light" />
                        </div>
                        <div className="flex-1">
                          <span className="block text-base font-semibold text-white">
                            {t(`step1.project_type.${option.labelKey}`)}
                          </span>
                          <span className="block text-sm text-tool-green-light mt-0.5">
                            {t(`step1.project_type.${option.descKey}`)}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="ml-auto flex-shrink-0 h-6 w-6 rounded-full bg-tool-green flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    onClick={goForward}
                    disabled={!projectType}
                    className="h-11 px-6 bg-tool-green text-white font-semibold rounded-lg shadow-sm hover:bg-tool-green/90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 inline-flex items-center gap-2"
                  >
                    Next: Describe Your Idea
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* Step 2: Describe Your Idea */}
            {/* ============================================================ */}
            {step === 2 && (
              <div>
                <h2 className="text-h4 text-white mb-2">
                  {t('step2.title')}
                </h2>
                <p className="text-sm text-muted mb-6">
                  {t('step2.description')}
                </p>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="est-desc" className="block text-sm font-medium text-off-white">
                      {t('step2.label')} <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="est-desc"
                      rows={6}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full min-h-[160px] px-4 py-3 bg-navy border border-slate-blue-light rounded-lg text-base text-off-white placeholder:text-muted-light resize-y hover:border-gray-700 focus:bg-slate-blue-light focus:border-tool-green focus:text-white focus:outline-none focus:ring-1 focus:ring-tool-green transition-all duration-200"
                      placeholder={t('step2.placeholder')}
                      maxLength={2000}
                    />
                    <div className="flex justify-between">
                      <span className="text-xs text-muted">
                        {t('step2.hint')}
                      </span>
                      <span className="text-xs text-muted">{description.length}/2000</span>
                    </div>
                  </div>

                  {/* Clickable Examples */}
                  <div className="bg-navy/50 border border-slate-blue-light/50 rounded-lg p-4">
                    <p className="text-xs font-medium text-muted mb-2 uppercase tracking-wider">
                      {t('step2.examples_title')}
                    </p>
                    <div className="space-y-1.5">
                      {(['example_1', 'example_2', 'example_3'] as const).map((key) => {
                        const example = t(`step2.${key}`);
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setDescription(example)}
                            className="flex items-start gap-2 w-full text-left text-xs text-muted hover:text-tool-green-light hover:bg-tool-green/5 rounded-md px-2 py-1.5 transition-all duration-150 cursor-pointer"
                          >
                            <span className="text-tool-green-light mt-0.5 flex-shrink-0">•</span>
                            &ldquo;{example}&rdquo;
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={goBack}
                    className="h-11 px-5 bg-transparent text-muted font-semibold rounded-lg hover:text-white hover:bg-slate-blue-light/40 transition-all duration-200 inline-flex items-center gap-2"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Back
                  </button>
                  <button
                    onClick={handleAnalyzeIdea}
                    disabled={description.trim().length < 10}
                    className="h-11 px-6 bg-tool-green text-white font-semibold rounded-lg shadow-sm hover:bg-tool-green/90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 inline-flex items-center gap-2"
                  >
                    <Brain className="h-5 w-5" />
                    Analyze My Idea
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* Step 3: AI Smart Questions */}
            {/* ============================================================ */}
            {step === 3 && (
              <div>
                {isAnalyzing ? (
                  <div className="py-8">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="text-center mb-6"
                    >
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tool-green/10 border border-tool-green/20 text-tool-green-light text-xs font-medium uppercase tracking-wider">
                        <Brain className="h-3 w-3" />
                        AI Analyzing
                      </span>
                      <p className="text-sm text-muted mt-3">
                        Our AI is reading your idea and preparing smart follow-up questions
                      </p>
                    </motion.div>
                    <AIThinkingState
                      toolColor="green"
                      messages={[
                        'Reading your idea...',
                        'Understanding the scope...',
                        'Preparing smart questions...',
                      ]}
                    />
                  </div>
                ) : (
                  <>
                    {/* AI Summary */}
                    {aiSummary && (
                      <div className="bg-tool-green/5 border border-tool-green/20 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-lg bg-tool-green/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Brain className="h-4 w-4 text-tool-green-light" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-tool-green-light mb-1">{t('step3.ai_summary')}</p>
                            <p className="text-sm text-off-white leading-relaxed">{aiSummary}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <h2 className="text-h4 text-white mb-2">
                      {t('step3.title')}
                    </h2>
                    <p className="text-sm text-muted mb-6">
                      {t('step3.description')}
                    </p>

                    <div className="space-y-4">
                      {questions.map((q) => (
                        <div
                          key={q.id}
                          className="bg-navy border border-slate-blue-light rounded-lg p-4"
                        >
                          <p className="text-base font-medium text-white mb-1">{q.question}</p>
                          <p className="text-xs text-muted mb-4">{q.context}</p>

                          <div className="flex gap-3">
                            <button
                              onClick={() =>
                                setAnswers((prev) => ({ ...prev, [q.id]: true }))
                              }
                              className={`flex-1 h-10 rounded-lg font-semibold text-sm transition-all duration-200 border ${
                                answers[q.id] === true
                                  ? 'bg-tool-green/80 text-white border-tool-green'
                                  : 'bg-slate-blue-light/50 text-muted border-transparent hover:text-off-white hover:bg-tool-green/10 hover:border-tool-green/20'
                              }`}
                            >
                              {t('step3.yes')}
                            </button>
                            <button
                              onClick={() =>
                                setAnswers((prev) => ({ ...prev, [q.id]: false }))
                              }
                              className={`flex-1 h-10 rounded-lg font-semibold text-sm transition-all duration-200 border ${
                                answers[q.id] === false
                                  ? 'bg-slate-blue-light text-off-white border-tool-orange/40 shadow-sm'
                                  : 'bg-slate-blue-light/50 text-muted border-transparent hover:text-off-white hover:bg-slate-blue-light/80'
                              }`}
                            >
                              {t('step3.no')}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Answer progress indicator */}
                    {totalQuestions > 0 && (
                      <div className="mt-6 mb-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-medium ${
                            answeredCount === totalQuestions ? 'text-tool-green-light' : 'text-muted'
                          }`}>
                            {answeredCount === totalQuestions
                              ? t('step3.all_answered')
                              : t('step3.progress', { answered: answeredCount, total: totalQuestions })
                            }
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-blue-light rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-tool-green"
                            initial={{ width: 0 }}
                            animate={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between mt-6">
                      <button
                        onClick={goBack}
                        className="h-11 px-5 bg-transparent text-muted font-semibold rounded-lg hover:text-white hover:bg-slate-blue-light/40 transition-all duration-200 inline-flex items-center gap-2"
                      >
                        <ArrowLeft className="h-5 w-5" />
                        Back
                      </button>
                      <button
                        onClick={handleGenerateFeatures}
                        disabled={questions.length === 0 || questions.some((q) => answers[q.id] === undefined)}
                        className="h-11 px-6 bg-tool-green text-white font-semibold rounded-lg shadow-sm hover:bg-tool-green/90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 inline-flex items-center gap-2"
                      >
                        <ListChecks className="h-5 w-5" />
                        Generate Features
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ============================================================ */}
            {/* Step 4: Feature Selection */}
            {/* ============================================================ */}
            {step === 4 && (
              <div>
                {isGeneratingFeatures ? (
                  <div className="py-8">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="text-center mb-6"
                    >
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tool-green/10 border border-tool-green/20 text-tool-green-light text-xs font-medium uppercase tracking-wider">
                        <ListChecks className="h-3 w-3" />
                        Building Feature List
                      </span>
                      <p className="text-sm text-muted mt-3">
                        Generating must-have and enhancement features based on your answers
                      </p>
                    </motion.div>
                    <AIThinkingState
                      toolColor="green"
                      messages={[
                        'Analyzing your requirements...',
                        'Identifying core features...',
                        'Suggesting enhancements...',
                      ]}
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-h4 text-white mb-2">
                      Review your project features
                    </h2>
                    <p className="text-sm text-muted mb-6">
                      We've identified the essential features for your project. You can also add
                      optional enhancements to get a more comprehensive estimate.
                    </p>

                    {/* Must-Have Features */}
                    {mustHaveFeatures.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="h-5 w-5 rounded bg-tool-green/20 flex items-center justify-center">
                            <Check className="h-3 w-3 text-tool-green-light" />
                          </div>
                          <h3 className="text-base font-semibold text-white">
                            Must-Have Features
                          </h3>
                          <span className="text-xs text-tool-green-light bg-tool-green/10 px-2 py-0.5 rounded-full">
                            Essential
                          </span>
                        </div>
                        <div className="space-y-3">
                          {mustHaveFeatures.map((feature) => {
                            const isChecked = selectedFeatureIds.has(feature.id);
                            return (
                              <label
                                key={feature.id}
                                className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all duration-150 ${
                                  isChecked
                                    ? 'bg-tool-green/8 border-tool-green/20'
                                    : 'border-slate-blue-light hover:bg-tool-green/5 hover:border-tool-green/20'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleFeature(feature.id)}
                                  className="mt-0.5 h-5 w-5 rounded border-2 border-slate-blue-light bg-transparent checked:bg-tool-green checked:border-tool-green transition-colors duration-200"
                                />
                                <div className="flex-1">
                                  <span className="block text-base font-medium text-off-white">
                                    {feature.name}
                                  </span>
                                  <span className="block text-xs text-muted mt-1 leading-relaxed">
                                    {feature.description}
                                  </span>
                                  {/* Cost/Time Impact Badges */}
                                  {(feature.costImpact || feature.timeImpact) && (
                                    <div className="flex gap-2 mt-2">
                                      {feature.costImpact && (
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${IMPACT_COLORS[feature.costImpact]}`}>
                                          <DollarSign className="h-2.5 w-2.5" />
                                          {t(`feature_impact.${feature.costImpact}`)}
                                        </span>
                                      )}
                                      {feature.timeImpact && (
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${IMPACT_COLORS[feature.timeImpact]}`}>
                                          <Clock className="h-2.5 w-2.5" />
                                          {t(`feature_impact.${feature.timeImpact}`)}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Enhancement Features */}
                    {enhancementFeatures.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="h-5 w-5 rounded bg-tool-purple/20 flex items-center justify-center">
                            <Sparkles className="h-3 w-3 text-tool-purple-light" />
                          </div>
                          <h3 className="text-base font-semibold text-white">
                            Enhancement Features
                          </h3>
                          <span className="text-xs text-tool-purple-light bg-tool-purple/10 px-2 py-0.5 rounded-full">
                            Optional
                          </span>
                        </div>
                        <div className="space-y-3">
                          {enhancementFeatures.map((feature) => {
                            const isChecked = selectedFeatureIds.has(feature.id);
                            return (
                              <label
                                key={feature.id}
                                className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all duration-150 ${
                                  isChecked
                                    ? 'bg-tool-purple/8 border-tool-purple/20'
                                    : 'border-slate-blue-light hover:bg-tool-purple/5 hover:border-tool-purple/20'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleFeature(feature.id)}
                                  className="mt-0.5 h-5 w-5 rounded border-2 border-slate-blue-light bg-transparent checked:bg-tool-purple checked:border-tool-purple transition-colors duration-200"
                                />
                                <div className="flex-1">
                                  <span className="block text-base font-medium text-off-white">
                                    {feature.name}
                                  </span>
                                  <span className="block text-xs text-muted mt-1 leading-relaxed">
                                    {feature.description}
                                  </span>
                                  {/* Cost/Time Impact Badges */}
                                  {(feature.costImpact || feature.timeImpact) && (
                                    <div className="flex gap-2 mt-2">
                                      {feature.costImpact && (
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${IMPACT_COLORS[feature.costImpact]}`}>
                                          <DollarSign className="h-2.5 w-2.5" />
                                          {t(`feature_impact.${feature.costImpact}`)}
                                        </span>
                                      )}
                                      {feature.timeImpact && (
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${IMPACT_COLORS[feature.timeImpact]}`}>
                                          <Clock className="h-2.5 w-2.5" />
                                          {t(`feature_impact.${feature.timeImpact}`)}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <p className="text-sm text-tool-green-light">
                      {selectedFeatureIds.size} features selected
                    </p>

                    <div className="flex justify-between mt-8">
                      <button
                        onClick={goBack}
                        className="h-11 px-5 bg-transparent text-muted font-semibold rounded-lg hover:text-white hover:bg-slate-blue-light/40 transition-all duration-200 inline-flex items-center gap-2"
                      >
                        <ArrowLeft className="h-5 w-5" />
                        Back
                      </button>
                      <button
                        onClick={goForward}
                        disabled={selectedFeatureIds.size === 0}
                        className="h-11 px-6 bg-tool-green text-white font-semibold rounded-lg shadow-sm hover:bg-tool-green/90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 inline-flex items-center gap-2"
                      >
                        Next: Contact Info
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ============================================================ */}
            {/* Step 5: Contact Information */}
            {/* ============================================================ */}
            {step === 5 && (
              <div>
                <h2 className="text-h4 text-white mb-2">
                  {t('step4.title') || 'Where should we send your Project Blueprint?'}
                </h2>
                <p className="text-sm text-muted mb-6">
                  {t('step4.description') ||
                    "We'll email you the full report with a downloadable PDF."}
                </p>

                {/* What You'll Get — Deliverables Card */}
                <div className="bg-tool-green/5 border border-tool-green/20 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-semibold text-tool-green-light mb-3">
                    {t('step5.deliverables_title')}
                  </h4>
                  <ul className="space-y-2">
                    {[
                      { icon: DollarSign, text: t('step5.deliverable_cost') },
                      { icon: Clock, text: t('step5.deliverable_timeline') },
                      { icon: Lightbulb, text: t('step5.deliverable_recommendations') },
                      { icon: FileText, text: t('step5.deliverable_pdf') },
                    ].map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <li key={i} className="flex items-center gap-2 text-sm text-off-white">
                          <Icon className="h-4 w-4 text-tool-green-light flex-shrink-0" />
                          {item.text}
                        </li>
                      );
                    })}
                  </ul>
                  <p className="text-xs text-muted mt-3">
                    {t('step5.deliverables_footer', { count: selectedFeatureIds.size })}
                  </p>
                </div>

                {/* Collapsible Review Your Choices */}
                <details className="group mb-6 bg-navy/50 border border-slate-blue-light/50 rounded-lg overflow-hidden">
                  <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer text-sm font-medium text-muted hover:text-off-white transition-colors">
                    <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                    {t('step5.review_title')}
                  </summary>
                  <div className="px-4 pb-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted">{t('step5.review_project_type')}</span>
                      <span className="text-off-white">{getProjectTypeLabel()}</span>
                    </div>
                    <div>
                      <span className="text-muted">{t('step5.review_description')}</span>
                      <p className="text-off-white text-xs mt-1 line-clamp-3">{description}</p>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">{t('step5.review_features')}</span>
                      <span className="text-off-white">{selectedFeatureIds.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">{t('step5.review_questions')}</span>
                      <span className="text-off-white">{answeredCount}/{totalQuestions}</span>
                    </div>
                  </div>
                </details>

                <div className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="est-name" className="block text-sm font-medium text-off-white">
                      First Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="est-name"
                      type="text"
                      required
                      value={contactInfo.name}
                      onChange={(e) => {
                        setContactInfo((prev) => ({ ...prev, name: e.target.value }));
                        if (formErrors.name) {
                          setFormErrors((prev) => ({ ...prev, name: '' }));
                        }
                      }}
                      onBlur={() => handleFieldBlur('name')}
                      className={`w-full h-11 px-3 py-2.5 bg-navy border rounded-lg text-base text-off-white placeholder:text-muted-light hover:border-gray-700 focus:bg-slate-blue-light focus:border-tool-green focus:text-white focus:outline-none focus:ring-1 focus:ring-tool-green transition-all duration-200 ${
                        formErrors.name ? 'border-red-500' : 'border-slate-blue-light'
                      }`}
                      placeholder="John"
                    />
                    {formErrors.name && (
                      <p className="text-xs text-red-400 mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="est-email"
                      className="block text-sm font-medium text-off-white"
                    >
                      Email Address <span className="text-muted text-xs">(optional)</span>
                    </label>
                    <input
                      id="est-email"
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => {
                        setContactInfo((prev) => ({ ...prev, email: e.target.value }));
                        if (formErrors.email) {
                          setFormErrors((prev) => ({ ...prev, email: '' }));
                        }
                      }}
                      onBlur={() => handleFieldBlur('email')}
                      className={`w-full h-11 px-3 py-2.5 bg-navy border rounded-lg text-base text-off-white placeholder:text-muted-light hover:border-gray-700 focus:bg-slate-blue-light focus:border-tool-green focus:text-white focus:outline-none focus:ring-1 focus:ring-tool-green transition-all duration-200 ${
                        formErrors.email ? 'border-red-500' : 'border-slate-blue-light'
                      }`}
                      placeholder="you@company.com"
                    />
                    {formErrors.email && (
                      <p className="text-xs text-red-400 mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="est-phone"
                      className="block text-sm font-medium text-off-white"
                    >
                      Phone Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="est-phone"
                      required
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) => {
                        setContactInfo((prev) => ({ ...prev, phone: e.target.value }));
                        if (formErrors.phone) {
                          setFormErrors((prev) => ({ ...prev, phone: '' }));
                        }
                      }}
                      onBlur={() => handleFieldBlur('phone')}
                      className={`w-full h-11 px-3 py-2.5 bg-navy border rounded-lg text-base text-off-white placeholder:text-muted-light hover:border-gray-700 focus:bg-slate-blue-light focus:border-tool-green focus:text-white focus:outline-none focus:ring-1 focus:ring-tool-green transition-all duration-200 ${
                        formErrors.phone ? 'border-red-500' : 'border-slate-blue-light'
                      }`}
                      placeholder="+962 7XX XXX XXX"
                    />
                    {formErrors.phone && (
                      <p className="text-xs text-red-400 mt-1">{formErrors.phone}</p>
                    )}
                    <p className="text-xs text-muted">Jordan format: +962</p>
                  </div>

                  {/* WhatsApp checkbox */}
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-slate-blue-light hover:border-tool-green/30 hover:bg-tool-green/5 transition-all duration-150">
                    <input
                      type="checkbox"
                      checked={contactInfo.whatsapp}
                      onChange={(e) =>
                        setContactInfo((prev) => ({
                          ...prev,
                          whatsapp: e.target.checked,
                        }))
                      }
                      className="h-5 w-5 rounded border-2 border-slate-blue-light bg-transparent checked:bg-tool-green checked:border-tool-green transition-colors duration-200"
                    />
                    <span className="text-sm text-off-white">
                      Also send my Project Blueprint via WhatsApp
                    </span>
                  </label>

                  {/* Privacy note */}
                  <p className="text-xs text-muted">
                    By submitting, you agree to our{' '}
                    <a href="/privacy" className="text-tool-green-light hover:underline">
                      Privacy Policy
                    </a>
                    . We will never share your information.
                  </p>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={goBack}
                    className="h-11 px-5 bg-transparent text-muted font-semibold rounded-lg hover:text-white hover:bg-slate-blue-light/40 transition-all duration-200 inline-flex items-center gap-2"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!contactInfo.name.trim() || !contactInfo.phone.trim()}
                    className="h-12 px-8 bg-tool-green text-white font-semibold rounded-lg shadow-md hover:bg-tool-green/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 inline-flex items-center gap-2 text-lg"
                  >
                    <Sparkles className="h-5 w-5" />
                    Generate My Blueprint
                  </button>
                </div>
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
