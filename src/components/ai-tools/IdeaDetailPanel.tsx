'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
  X,
  ArrowRight,
  TrendingUp,
  Calculator,
  Quote,
  ArrowRightLeft,
  Sparkles,
  BarChart3,
  Workflow,
  Check,
  Calendar,
  MessageCircle,
  Search,
} from 'lucide-react';
import type { IdeaLabIdea } from '@/types/api';

interface IdeaDetailPanelProps {
  idea: IdeaLabIdea;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * IdeaDetailPanel — Rich detail view for a single Idea Lab result.
 *
 * Shows full description, features, impact metrics, how-it-works,
 * before/after workflow, social proof, and CTAs to ROI & Estimate.
 *
 * CTAs pre-fill the destination tools with all relevant idea data
 * so the user doesn't have to re-enter anything.
 */
export function IdeaDetailPanel({ idea, isOpen, onClose }: IdeaDetailPanelProps) {
  const t = useTranslations('idea_lab');
  const locale = useLocale();
  const router = useRouter();

  const handleAnalyzeIdea = () => {
    sessionStorage.setItem(
      'aviniti_analyzer_idealab_data',
      JSON.stringify({
        ideaName: idea.name,
        ideaDescription: idea.description,
        features: idea.features,
        benefits: idea.benefits,
        impactMetrics: idea.impactMetrics,
        howItWorks: idea.howItWorks,
        source: 'idea-lab',
      })
    );
    router.push(`/${locale}/ai-analyzer?fromIdea=true&ideaName=${encodeURIComponent(idea.name)}&ideaDescription=${encodeURIComponent(idea.description)}`);
  };

  const handleGetEstimate = () => {
    // Store rich idea data in sessionStorage for Get Estimate
    sessionStorage.setItem(
      'aviniti_estimate_idealab_data',
      JSON.stringify({
        ideaName: idea.name,
        ideaDescription: idea.description,
        features: idea.features,
        benefits: idea.benefits,
        impactMetrics: idea.impactMetrics,
        source: 'idea-lab',
      })
    );
    router.push(`/${locale}/get-estimate?fromIdea=true&ideaName=${encodeURIComponent(idea.name)}&ideaDescription=${encodeURIComponent(idea.description)}`);
  };

  const handleSeeROI = () => {
    // Store rich idea data in sessionStorage for ROI Calculator
    sessionStorage.setItem(
      'aviniti_roi_idealab_data',
      JSON.stringify({
        ideaName: idea.name,
        ideaDescription: idea.description,
        features: idea.features,
        benefits: idea.benefits,
        impactMetrics: idea.impactMetrics,
        howItWorks: idea.howItWorks,
        source: 'idea-lab',
      })
    );
    router.push(`/${locale}/roi-calculator?fromIdeaLab=true`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-[3vh] sm:top-[5vh] sm:max-w-2xl sm:w-full max-h-[94vh] overflow-y-auto bg-navy border border-slate-blue-light rounded-2xl shadow-2xl shadow-black/40 z-50"
            role="dialog"
            aria-modal="true"
            aria-label={t('aria_view_details', { name: idea.name })}
          >
            {/* Header */}
            <div className="sticky top-0 bg-navy/95 backdrop-blur-sm border-b border-slate-blue-light p-5 flex items-start justify-between z-10">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white truncate">
                  {idea.name}
                </h3>
                <p className="text-sm text-tool-orange-light font-medium mt-1">
                  {idea.tagline}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 h-9 w-9 rounded-lg flex items-center justify-center text-muted hover:text-white hover:bg-slate-blue-light transition-colors duration-200 ms-3"
                aria-label={t('close_details')}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 space-y-6">

              {/* Description */}
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2.5">
                  {t('detail_description_title')}
                </h4>
                <p className="text-base text-off-white leading-relaxed">
                  {idea.description}
                </p>
              </section>

              {/* Key Features */}
              {idea.features && idea.features.length > 0 && (
                <section className="bg-slate-blue/60 border border-slate-blue-light rounded-xl p-5">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="h-7 w-7 rounded-lg bg-tool-orange/15 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-tool-orange-light" />
                    </div>
                    <h4 className="text-sm font-bold text-white">
                      {t('detail_features_title')}
                    </h4>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {idea.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <div className="h-5 w-5 rounded-full bg-tool-orange/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="h-3 w-3 text-tool-orange-light" />
                        </div>
                        <span className="text-sm text-off-white leading-snug">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Expected Impact */}
              {idea.impactMetrics && idea.impactMetrics.length > 0 && (
                <section className="bg-purple-500/5 border border-purple-500/15 rounded-xl p-5">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="h-7 w-7 rounded-lg bg-purple-500/15 flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 text-purple-400" />
                    </div>
                    <h4 className="text-sm font-bold text-white">
                      {t('detail_impact_title')}
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {idea.impactMetrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 bg-purple-500/5 rounded-lg px-4 py-3 border border-purple-500/10"
                      >
                        <TrendingUp className="h-4 w-4 text-purple-400 flex-shrink-0" />
                        <span className="text-sm text-off-white font-medium">
                          {metric}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* How It Works */}
              {idea.howItWorks && (
                <section className="bg-blue-500/5 border border-blue-500/15 rounded-xl p-5">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="h-7 w-7 rounded-lg bg-blue-500/15 flex items-center justify-center">
                      <Workflow className="h-4 w-4 text-blue-400" />
                    </div>
                    <h4 className="text-sm font-bold text-white">
                      {t('detail_how_it_works_title')}
                    </h4>
                  </div>
                  <p className="text-sm text-off-white leading-relaxed ps-10">
                    {idea.howItWorks}
                  </p>
                </section>
              )}

              {/* Before / After Workflow */}
              <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Before */}
                <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-6 w-6 rounded-full bg-red-500/15 flex items-center justify-center">
                      <ArrowRightLeft className="h-3.5 w-3.5 text-red-400" />
                    </div>
                    <h4 className="text-sm font-semibold text-red-300">
                      {t('detail_before_title')}
                    </h4>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">
                    {idea.workflowBefore}
                  </p>
                </div>

                {/* After */}
                <div className="bg-green-500/5 border border-green-500/15 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-6 w-6 rounded-full bg-green-500/15 flex items-center justify-center">
                      <TrendingUp className="h-3.5 w-3.5 text-green-400" />
                    </div>
                    <h4 className="text-sm font-semibold text-green-300">
                      {t('detail_after_title')}
                    </h4>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">
                    {idea.workflowAfter}
                  </p>
                </div>
              </section>

              {/* Social Proof */}
              <section className="bg-tool-orange/5 border border-tool-orange/15 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-tool-orange/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Quote className="h-4 w-4 text-tool-orange" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                      {t('detail_social_proof_title')}
                    </h4>
                    <p className="text-sm text-off-white leading-relaxed italic">
                      {idea.socialProof}
                    </p>
                  </div>
                </div>
              </section>

              {/* CTA Section */}
              <section className="border-t border-slate-blue-light pt-6 space-y-4">
                <div className="text-center mb-2">
                  <h4 className="text-base font-bold text-white">
                    {t('detail_cta_section_title')}
                  </h4>
                  <p className="text-xs text-muted mt-1">
                    {t('detail_cta_section_subtitle')}
                  </p>
                </div>

                {/* Analyze This Idea CTA */}
                <button
                  onClick={handleAnalyzeIdea}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-200 group text-start"
                >
                  <div className="h-10 w-10 rounded-lg bg-blue-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/25 transition-colors">
                    <Search className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-white block">
                      {t('detail_cta_analyze')}
                    </span>
                    <span className="text-xs text-muted block mt-0.5">
                      {t('detail_cta_analyze_desc')}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-blue-400 group-hover:translate-x-1 transition-transform flex-shrink-0 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </button>

                {/* ROI Calculator CTA */}
                <button
                  onClick={handleSeeROI}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all duration-200 group text-start"
                >
                  <div className="h-10 w-10 rounded-lg bg-purple-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/25 transition-colors">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-white block">
                      {t('detail_cta_roi')}
                    </span>
                    <span className="text-xs text-muted block mt-0.5">
                      {t('detail_cta_roi_desc')}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-purple-400 group-hover:translate-x-1 transition-transform flex-shrink-0 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </button>

                {/* Get Estimate CTA */}
                <button
                  onClick={handleGetEstimate}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 hover:border-green-500/30 transition-all duration-200 group text-start"
                >
                  <div className="h-10 w-10 rounded-lg bg-green-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/25 transition-colors">
                    <Calculator className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-white block">
                      {t('detail_cta_estimate')}
                    </span>
                    <span className="text-xs text-muted block mt-0.5">
                      {t('detail_cta_estimate_desc')}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-green-400 group-hover:translate-x-1 transition-transform flex-shrink-0 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </button>

                {/* Direct Booking Section */}
                <div className="mt-6 pt-6 border-t border-slate-blue-light">
                  <p className="text-xs text-muted text-center mb-3">
                    {t('detail_or_talk')}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href="https://calendly.com/aliodat-aviniti/30min"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-slate-blue border border-slate-blue-light hover:border-tool-orange/30 hover:bg-slate-blue-light text-off-white font-medium text-sm transition-all duration-200"
                    >
                      <Calendar className="h-4 w-4" />
                      {t('detail_book_call')}
                    </a>
                    <a
                      href="https://wa.me/962790685302"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/15 text-[#25D366] font-medium text-sm transition-all duration-200"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {t('detail_whatsapp')}
                    </a>
                  </div>
                </div>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
