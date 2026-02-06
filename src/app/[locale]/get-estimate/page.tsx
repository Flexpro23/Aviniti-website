'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Globe,
  Brain,
  Cloud,
  Layers,
  Zap,
  Clock,
  Calendar,
  HelpCircle,
  Check,
  ChevronDown,
  DollarSign,
  Wrench,
  Sparkles,
  Lightbulb,
  X,
} from 'lucide-react';
import { ToolHero } from '@/components/ai-tools/ToolHero';
import { ToolForm } from '@/components/ai-tools/ToolForm';
import { StepTransition } from '@/components/ai-tools/StepTransition';
import { AIThinkingState } from '@/components/ai-tools/AIThinkingState';
import { ToolResults, ToolResultItem } from '@/components/ai-tools/ToolResults';
import { CrossSellCTA } from '@/components/ai-tools/CrossSellCTA';
import type { ProjectType, FeatureId, TimelinePreference, EstimateResponse, EstimatePhase } from '@/types/api';

// ============================================================
// Project Type Options
// ============================================================
const PROJECT_TYPE_OPTIONS: { value: ProjectType; label: string; description: string; icon: typeof Smartphone }[] = [
  { value: 'mobile', label: 'Mobile App', description: 'iOS, Android, or Both', icon: Smartphone },
  { value: 'web', label: 'Web Application', description: 'SPA, Platform, Dashboard', icon: Globe },
  { value: 'ai', label: 'AI / ML Solution', description: 'Computer Vision, NLP, Analytics', icon: Brain },
  { value: 'cloud', label: 'Cloud Infrastructure', description: 'Scalable Backend & DevOps', icon: Cloud },
  { value: 'fullstack', label: 'Multiple / Full Stack', description: 'Mobile + Web + Backend + AI', icon: Layers },
];

// ============================================================
// Feature Categories
// ============================================================
interface FeatureOption {
  id: FeatureId;
  label: string;
  description: string;
}

interface FeatureCategory {
  name: string;
  features: FeatureOption[];
}

const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    name: 'Core Features',
    features: [
      { id: 'user-auth', label: 'User Authentication', description: 'Sign up, login, social auth, password reset' },
      { id: 'user-profiles', label: 'User Profiles', description: 'User dashboard, settings, preferences' },
      { id: 'push-notifications', label: 'Push Notifications', description: 'Real-time alerts and messaging' },
      { id: 'in-app-messaging', label: 'In-App Messaging', description: 'Chat or messaging between users' },
      { id: 'search-filtering', label: 'Search & Filtering', description: 'Advanced search with filters' },
      { id: 'admin-dashboard', label: 'Admin Dashboard', description: 'Content management, analytics, user management' },
    ],
  },
  {
    name: 'Payments & Commerce',
    features: [
      { id: 'payment-processing', label: 'Payment Processing', description: 'Credit card, debit, Stripe/PayPal integration' },
      { id: 'subscription-plans', label: 'Subscription / Plans', description: 'Recurring billing, plan management' },
      { id: 'shopping-cart', label: 'Shopping Cart', description: 'Product catalog, cart, checkout flow' },
      { id: 'invoice-generation', label: 'Invoice Generation', description: 'PDF invoices, billing history' },
    ],
  },
  {
    name: 'AI & Intelligence',
    features: [
      { id: 'ai-chatbot', label: 'AI Chatbot', description: 'Conversational AI assistant' },
      { id: 'image-recognition', label: 'Image Recognition', description: 'Computer vision, object detection' },
      { id: 'recommendation-engine', label: 'Recommendation Engine', description: 'Personalized content/product suggestions' },
      { id: 'nlp', label: 'Natural Language Processing', description: 'Text analysis, sentiment, translation' },
      { id: 'predictive-analytics', label: 'Predictive Analytics', description: 'Data-driven forecasting' },
    ],
  },
  {
    name: 'Media & Content',
    features: [
      { id: 'file-upload', label: 'File Upload & Storage', description: 'Images, documents, video upload' },
      { id: 'camera-integration', label: 'Camera Integration', description: 'Photo/video capture, QR scanning' },
      { id: 'maps-location', label: 'Maps & Location', description: 'GPS, geofencing, location services' },
      { id: 'video-streaming', label: 'Video Streaming', description: 'Live or recorded video playback' },
    ],
  },
  {
    name: 'Integration & Infrastructure',
    features: [
      { id: 'api-integration', label: 'API Integration', description: 'Connect with third-party services' },
      { id: 'social-sharing', label: 'Social Media Sharing', description: 'Share content to social platforms' },
      { id: 'analytics-reporting', label: 'Analytics & Reporting', description: 'Usage tracking, custom reports' },
      { id: 'multi-language', label: 'Multi-language Support', description: 'i18n, RTL support' },
      { id: 'offline-mode', label: 'Offline Mode', description: 'Work without internet connection' },
    ],
  },
];

// ============================================================
// Timeline Options
// ============================================================
const TIMELINE_OPTIONS: { value: TimelinePreference; label: string; description: string; icon: typeof Zap; badge?: string }[] = [
  { value: 'asap', label: 'ASAP', description: '1-2 months', icon: Zap, badge: 'Rush' },
  { value: 'standard', label: 'Standard', description: '2-4 months', icon: Clock, badge: 'Recommended' },
  { value: 'flexible', label: 'Flexible', description: '4-6 months', icon: Calendar, badge: 'Best Value' },
  { value: 'unsure', label: 'Not Sure', description: 'We will recommend', icon: HelpCircle },
];

export default function GetEstimatePage() {
  const t = useTranslations('get_estimate');

  // Form state
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [formData, setFormData] = useState({
    projectType: '' as ProjectType | '',
    features: [] as FeatureId[],
    customFeatures: [] as string[],
    customFeatureInput: '',
    timeline: '' as TimelinePreference | '',
    name: '',
    email: '',
    company: '',
    phone: '',
    description: '',
    whatsapp: false,
  });
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Core Features': true,
    'Payments & Commerce': false,
    'AI & Intelligence': false,
    'Media & Content': false,
    'Integration & Infrastructure': false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<EstimateResponse | null>(null);
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

  // Feature toggle
  const toggleFeature = (featureId: FeatureId) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter((f) => f !== featureId)
        : [...prev.features, featureId],
    }));
  };

  // Add custom feature
  const addCustomFeature = () => {
    const trimmed = formData.customFeatureInput.trim();
    if (trimmed && formData.customFeatures.length < 5) {
      setFormData((prev) => ({
        ...prev,
        customFeatures: [...prev.customFeatures, trimmed],
        customFeatureInput: '',
      }));
    }
  };

  // Remove custom feature
  const removeCustomFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      customFeatures: prev.customFeatures.filter((_, i) => i !== index),
    }));
  };

  // Submit handler
  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectType: formData.projectType,
          features: formData.features,
          customFeatures: formData.customFeatures.length > 0 ? formData.customFeatures : undefined,
          timeline: formData.timeline,
          name: formData.name,
          email: formData.email,
          company: formData.company || undefined,
          phone: formData.phone || undefined,
          description: formData.description || undefined,
          whatsapp: formData.whatsapp,
          locale: 'en',
        }),
      });

      const data = await res.json();

      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.error?.message || 'Failed to generate estimate. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEstimate = () => {
    const formSection = document.getElementById('estimate-form');
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
            toolColor="green"
            messages={[
              'Evaluating feature complexity...',
              'Calculating development effort...',
              'Generating detailed breakdown...',
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/15 text-green-300 text-xs font-medium uppercase tracking-wider mb-4">
              <Check className="h-3.5 w-3.5" />
              Estimate Ready
            </div>
            <h2 className="text-h2 text-white">
              {t('results_title') || 'Your Project Estimate Is Ready'}
            </h2>
            <p className="text-base text-muted mt-3 max-w-xl mx-auto">
              Based on your inputs, here is what we recommend for your project.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <ToolResults toolColor="green" className="text-center">
              <ToolResultItem>
                <div className="mx-auto mb-3 h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-400" />
                </div>
                <p className="text-sm text-muted">Estimated Cost</p>
                <p className="text-2xl font-bold text-white mt-1">
                  ${results.estimatedCost.min.toLocaleString()} - ${results.estimatedCost.max.toLocaleString()}
                </p>
              </ToolResultItem>
            </ToolResults>

            <ToolResults toolColor="green" className="text-center">
              <ToolResultItem>
                <div className="mx-auto mb-3 h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-green-400" />
                </div>
                <p className="text-sm text-muted">Estimated Timeline</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {results.estimatedTimeline.weeks} Weeks
                </p>
              </ToolResultItem>
            </ToolResults>

            <ToolResults toolColor="green" className="text-center">
              <ToolResultItem>
                <div className="mx-auto mb-3 h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Wrench className="h-5 w-5 text-green-400" />
                </div>
                <p className="text-sm text-muted">Recommended Approach</p>
                <p className="text-2xl font-bold text-white mt-1 capitalize">
                  {results.approach === 'ready-made' ? 'Ready-Made' : results.approach}
                </p>
              </ToolResultItem>
            </ToolResults>
          </div>

          {/* Breakdown Table */}
          <ToolResults toolColor="green" className="mb-8 p-0 overflow-hidden">
            <ToolResultItem>
              <div className="px-6 py-4 border-b border-slate-blue-light">
                <h3 className="text-lg font-semibold text-white">Project Breakdown</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-blue-light">
                      <th className="px-6 py-3 text-sm font-semibold text-muted uppercase tracking-wider">Phase</th>
                      <th className="px-6 py-3 text-sm font-semibold text-muted uppercase tracking-wider text-right">Cost</th>
                      <th className="px-6 py-3 text-sm font-semibold text-muted uppercase tracking-wider text-right">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-blue-light">
                    {results.breakdown.map((phase: EstimatePhase) => (
                      <tr key={phase.phase} className="hover:bg-navy/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="h-6 w-6 rounded-full bg-green-500/15 flex items-center justify-center text-xs font-semibold text-green-400">
                              {phase.phase}
                            </span>
                            <div>
                              <span className="text-sm font-medium text-off-white block">{phase.name}</span>
                              <span className="text-xs text-muted">{phase.description}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-off-white text-right">
                          ${phase.cost.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted text-right">{phase.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ToolResultItem>
          </ToolResults>

          {/* Key Insights */}
          <ToolResults toolColor="green" className="mb-8">
            <ToolResultItem>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">AI Insights</h3>
              </div>
              <ul className="space-y-3">
                {results.keyInsights.map((insight: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-off-white leading-relaxed">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    {insight}
                  </li>
                ))}
              </ul>
            </ToolResultItem>
          </ToolResults>

          {/* Cross-sell */}
          <div className="mt-10 space-y-4">
            <CrossSellCTA
              targetTool="roi-calculator"
              message="See your potential return on investment for this project."
            />
            <CrossSellCTA
              targetTool="ai-analyzer"
              message="Want to validate your idea before building? Analyze it with AI."
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
        toolSlug="get-estimate"
        title={t('hero_title') || 'Get Your AI-Powered Project Estimate'}
        description={t('hero_description') || 'Answer a few questions about your project and our AI will generate a detailed cost breakdown, timeline, and recommendations -- in under 2 minutes.'}
        ctaText={t('hero_cta') || 'Start Estimate'}
        toolColor="green"
        onCTAClick={handleStartEstimate}
      />

      {/* Form */}
      <section id="estimate-form" className="py-12 md:py-16">
        <ToolForm totalSteps={4} currentStep={step} toolColor="green">
          <StepTransition currentStep={step} direction={direction}>
            {/* ============================================================ */}
            {/* Step 1: Project Type */}
            {/* ============================================================ */}
            {step === 1 && (
              <div>
                <h2 className="text-h4 text-white mb-6">
                  {t('step1_title') || 'What type of project do you want to build?'}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Project type">
                  {PROJECT_TYPE_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const isSelected = formData.projectType === option.value;
                    return (
                      <button
                        key={option.value}
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setFormData((prev) => ({ ...prev, projectType: option.value }))}
                        className={`w-full flex items-start gap-4 p-4 md:p-5 rounded-lg border transition-all duration-200 text-left cursor-pointer ${
                          option.value === 'fullstack' ? 'sm:col-span-2' : ''
                        } ${
                          isSelected
                            ? 'border-2 border-green-500 bg-green-500/10'
                            : 'border border-slate-blue-light bg-navy hover:bg-green-500/5 hover:border-green-500/30'
                        }`}
                      >
                        <div className="h-10 w-10 rounded-lg bg-green-500/15 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-5 w-5 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <span className="block text-base font-semibold text-white">{option.label}</span>
                          <span className="block text-sm text-green-300/80 mt-0.5">{option.description}</span>
                        </div>
                        {isSelected && (
                          <div className="ml-auto flex-shrink-0 h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
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
                    disabled={!formData.projectType}
                    className="h-11 px-6 bg-green-500 text-white font-semibold rounded-lg shadow-sm hover:bg-green-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 inline-flex items-center gap-2"
                  >
                    Next: Features
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* Step 2: Features */}
            {/* ============================================================ */}
            {step === 2 && (
              <div>
                <h2 className="text-h4 text-white mb-2">
                  {t('step2_title') || 'What features does your project need?'}
                </h2>
                <p className="text-sm text-muted mb-6">
                  Select all that apply. You can also add custom features below.
                </p>

                <div className="space-y-4">
                  {FEATURE_CATEGORIES.map((category) => {
                    const isExpanded = expandedCategories[category.name] ?? false;
                    const selectedCount = category.features.filter((f) => formData.features.includes(f.id)).length;

                    return (
                      <div key={category.name} className="border border-slate-blue-light rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedCategories((prev) => ({ ...prev, [category.name]: !prev[category.name] }))
                          }
                          className="w-full flex items-center justify-between p-4 bg-navy hover:bg-slate-blue-light/30 transition-colors"
                          aria-expanded={isExpanded}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-base font-semibold text-white">{category.name}</span>
                            {selectedCount > 0 && (
                              <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                                {selectedCount} selected
                              </span>
                            )}
                          </div>
                          <ChevronDown
                            className={`h-5 w-5 text-muted transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </button>
                        {isExpanded && (
                          <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {category.features.map((feature) => {
                              const isChecked = formData.features.includes(feature.id);
                              return (
                                <label
                                  key={feature.id}
                                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-150 ${
                                    isChecked
                                      ? 'bg-green-500/10 border-green-500/25'
                                      : 'border-transparent hover:bg-green-500/5 hover:border-green-500/20'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => toggleFeature(feature.id)}
                                    className="mt-0.5 h-5 w-5 rounded border-2 border-slate-blue-light bg-transparent checked:bg-green-500 checked:border-green-500 transition-colors duration-200"
                                  />
                                  <div>
                                    <span className="block text-sm font-medium text-off-white">{feature.label}</span>
                                    <span className="block text-xs text-muted mt-0.5">{feature.description}</span>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Custom features */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-off-white mb-1.5">
                    Need something else? Add custom features
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={formData.customFeatureInput}
                      onChange={(e) => setFormData((prev) => ({ ...prev, customFeatureInput: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomFeature())}
                      className="flex-1 h-11 px-3 py-2.5 bg-navy border border-slate-blue-light rounded-lg text-base text-off-white placeholder:text-muted-light focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none transition-all duration-200"
                      placeholder="e.g., Barcode scanner, loyalty points..."
                    />
                    <button
                      type="button"
                      onClick={addCustomFeature}
                      className="h-11 px-4 bg-green-500/15 text-green-300 border border-green-500/30 rounded-lg text-sm font-medium hover:bg-green-500/25 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {formData.customFeatures.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.customFeatures.map((cf, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-300 text-sm border border-green-500/20"
                        >
                          {cf}
                          <button
                            type="button"
                            onClick={() => removeCustomFeature(i)}
                            aria-label={`Remove ${cf}`}
                            className="hover:text-white transition-colors"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-sm text-green-300 mt-4">
                  {formData.features.length + formData.customFeatures.length} features selected
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
                    disabled={formData.features.length === 0}
                    className="h-11 px-6 bg-green-500 text-white font-semibold rounded-lg shadow-sm hover:bg-green-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 inline-flex items-center gap-2"
                  >
                    Next: Timeline
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* Step 3: Timeline */}
            {/* ============================================================ */}
            {step === 3 && (
              <div>
                <h2 className="text-h4 text-white mb-2">
                  {t('step3_title') || "What's your ideal timeline?"}
                </h2>
                <p className="text-sm text-muted mb-6">
                  This helps us recommend the right approach and team size.
                </p>

                <div className="space-y-3" role="radiogroup" aria-label="Timeline preference">
                  {TIMELINE_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const isSelected = formData.timeline === option.value;
                    return (
                      <button
                        key={option.value}
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setFormData((prev) => ({ ...prev, timeline: option.value }))}
                        className={`relative w-full flex items-center gap-4 p-4 md:p-5 rounded-lg border transition-all duration-200 text-left cursor-pointer ${
                          isSelected
                            ? 'border-2 border-green-500 bg-green-500/10'
                            : 'border border-slate-blue-light bg-navy hover:bg-green-500/5 hover:border-green-500/30'
                        }`}
                      >
                        {option.badge && (
                          <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500 text-white shadow-sm">
                            {option.badge}
                          </span>
                        )}
                        <div className="h-10 w-10 rounded-lg bg-green-500/15 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-5 w-5 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <span className="block text-base font-semibold text-white">{option.label}</span>
                          <span className="block text-sm text-muted mt-0.5">{option.description}</span>
                        </div>
                        {isSelected && (
                          <div className="ml-auto flex-shrink-0 h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
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
                    onClick={goForward}
                    disabled={!formData.timeline}
                    className="h-11 px-6 bg-green-500 text-white font-semibold rounded-lg shadow-sm hover:bg-green-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 inline-flex items-center gap-2"
                  >
                    Next: Contact Info
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* Step 4: Contact Information */}
            {/* ============================================================ */}
            {step === 4 && (
              <div>
                <h2 className="text-h4 text-white mb-2">
                  {t('step4_title') || 'Almost there! How should we send your estimate?'}
                </h2>
                <p className="text-sm text-muted mb-6">
                  We will email you the full estimate with a downloadable PDF.
                </p>

                <div className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="est-name" className="block text-sm font-medium text-off-white">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="est-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full h-11 px-3 py-2.5 bg-navy border border-slate-blue-light rounded-lg text-base text-off-white placeholder:text-muted-light hover:border-gray-700 focus:bg-slate-blue-light focus:border-green-500 focus:text-white focus:outline-none focus:ring-1 focus:ring-green-500 transition-all duration-200"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="est-email" className="block text-sm font-medium text-off-white">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="est-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full h-11 px-3 py-2.5 bg-navy border border-slate-blue-light rounded-lg text-base text-off-white placeholder:text-muted-light hover:border-gray-700 focus:bg-slate-blue-light focus:border-green-500 focus:text-white focus:outline-none focus:ring-1 focus:ring-green-500 transition-all duration-200"
                      placeholder="you@company.com"
                    />
                  </div>

                  {/* Company */}
                  <div className="space-y-1.5">
                    <label htmlFor="est-company" className="block text-sm font-medium text-off-white">
                      Company <span className="text-muted text-xs">(optional)</span>
                    </label>
                    <input
                      id="est-company"
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                      className="w-full h-11 px-3 py-2.5 bg-navy border border-slate-blue-light rounded-lg text-base text-off-white placeholder:text-muted-light hover:border-gray-700 focus:bg-slate-blue-light focus:border-green-500 focus:text-white focus:outline-none focus:ring-1 focus:ring-green-500 transition-all duration-200"
                      placeholder="Your Company"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label htmlFor="est-phone" className="block text-sm font-medium text-off-white">
                      Phone Number <span className="text-muted text-xs">(optional)</span>
                    </label>
                    <input
                      id="est-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      className="w-full h-11 px-3 py-2.5 bg-navy border border-slate-blue-light rounded-lg text-base text-off-white placeholder:text-muted-light hover:border-gray-700 focus:bg-slate-blue-light focus:border-green-500 focus:text-white focus:outline-none focus:ring-1 focus:ring-green-500 transition-all duration-200"
                      placeholder="+962 7XX XXX XXX"
                    />
                  </div>

                  {/* Project Description */}
                  <div className="space-y-1.5">
                    <label htmlFor="est-desc" className="block text-sm font-medium text-off-white">
                      Project Description <span className="text-muted text-xs">(optional)</span>
                    </label>
                    <textarea
                      id="est-desc"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      className="w-full min-h-[100px] px-3 py-2.5 bg-navy border border-slate-blue-light rounded-lg text-base text-off-white placeholder:text-muted-light resize-y hover:border-gray-700 focus:bg-slate-blue-light focus:border-green-500 focus:text-white focus:outline-none focus:ring-1 focus:ring-green-500 transition-all duration-200"
                      placeholder="Briefly describe your project vision..."
                      maxLength={500}
                    />
                    <span className="text-xs text-muted">{formData.description.length}/500 characters</span>
                  </div>

                  {/* WhatsApp checkbox */}
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-slate-blue-light hover:border-green-500/30 hover:bg-green-500/5 transition-all duration-150">
                    <input
                      type="checkbox"
                      checked={formData.whatsapp}
                      onChange={(e) => setFormData((prev) => ({ ...prev, whatsapp: e.target.checked }))}
                      className="h-5 w-5 rounded border-2 border-slate-blue-light bg-transparent checked:bg-green-500 checked:border-green-500 transition-colors duration-200"
                    />
                    <span className="text-sm text-off-white">Also send estimate via WhatsApp</span>
                  </label>

                  {/* Privacy note */}
                  <p className="text-xs text-muted">
                    By submitting, you agree to our{' '}
                    <a href="/privacy" className="text-green-400 hover:underline">
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
                    disabled={!formData.name.trim() || !formData.email.trim()}
                    className="h-12 px-8 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 inline-flex items-center gap-2 text-lg"
                  >
                    <Sparkles className="h-5 w-5" />
                    Generate My Estimate
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
