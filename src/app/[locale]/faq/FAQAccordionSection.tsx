'use client';

/**
 * FAQ Accordion Section — Premium Edition
 *
 * Interactive FAQ with search, category filtering, and frosted glass accordion.
 * Per-category accent colors matching the site's design language.
 */

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { DollarSign, GitBranch, Clock, Code, LifeBuoy, Search, X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { faqCategories } from '@/lib/data/faq';
import { Container, Section, Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

// Per-category accent colors for visual identity
const categoryAccents: Record<string, { accent: string; bg: string; border: string; iconBg: string }> = {
  pricing:    { accent: '#34D399', bg: 'rgba(52, 211, 153, 0.06)',  border: 'rgba(52, 211, 153, 0.15)',  iconBg: 'rgba(52, 211, 153, 0.12)' },
  process:    { accent: '#A78BFA', bg: 'rgba(167, 139, 250, 0.06)', border: 'rgba(167, 139, 250, 0.15)', iconBg: 'rgba(167, 139, 250, 0.12)' },
  timeline:   { accent: '#F97316', bg: 'rgba(249, 115, 22, 0.06)',  border: 'rgba(249, 115, 22, 0.15)',  iconBg: 'rgba(249, 115, 22, 0.12)' },
  technology: { accent: '#60A5FA', bg: 'rgba(96, 165, 250, 0.06)',  border: 'rgba(96, 165, 250, 0.15)',  iconBg: 'rgba(96, 165, 250, 0.12)' },
  support:    { accent: '#C08460', bg: 'rgba(192, 132, 96, 0.06)',  border: 'rgba(192, 132, 96, 0.15)',  iconBg: 'rgba(192, 132, 96, 0.12)' },
};

// Icon component mapping (components, not pre-rendered JSX, so we can pass style props)
const iconComponents: Record<string, React.FC<{ className?: string; style?: React.CSSProperties }>> = {
  DollarSign,
  GitBranch,
  Clock,
  Code,
  LifeBuoy,
};

export function FAQAccordionSection() {
  const t = useTranslations('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Build searchable FAQ data and filter based on search + category
  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return faqCategories
      .map((category) => {
        if (activeCategory !== 'all' && category.slug !== activeCategory) {
          return null;
        }

        if (!query) {
          return category;
        }

        const matchingQuestions = category.questions.filter((q) => {
          try {
            const questionKeyParts = q.questionKey.replace('faq.', '');
            const answerKeyParts = q.answerKey.replace('faq.', '');
            const question = t(questionKeyParts).toLowerCase();
            const answer = t(answerKeyParts).toLowerCase();
            return question.includes(query) || answer.includes(query);
          } catch {
            return false;
          }
        });

        if (matchingQuestions.length === 0) return null;

        return { ...category, questions: matchingQuestions };
      })
      .filter(Boolean);
  }, [searchQuery, activeCategory, t]);

  const hasResults = filteredCategories.length > 0;

  const totalQuestions = useMemo(() => {
    return faqCategories.reduce((sum, cat) => sum + cat.questions.length, 0);
  }, []);

  return (
    <Section>
      <Container>
        <div className="max-w-3xl mx-auto space-y-10">
          {/* Search Input — frosted glass */}
          <div className="relative">
            <Search className="absolute start-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted pointer-events-none" />
            <input
              id="faq-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('page.search_placeholder')}
              className="w-full rounded-2xl ps-12 pe-12 py-4 text-off-white placeholder:text-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/50 transition-all duration-200 backdrop-blur-sm"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'rgba(255, 255, 255, 0.08)',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute end-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-muted hover:text-white hover:bg-white/[0.08] transition-all duration-200"
                aria-label={t('page.aria_clear_search')}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Filter Buttons — color-coded */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {/* "All" button */}
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                activeCategory === 'all'
                  ? 'bg-bronze text-white border-bronze'
                  : 'text-muted hover:text-white border-white/[0.06] hover:border-white/[0.12]'
              }`}
              style={activeCategory !== 'all' ? { backgroundColor: 'rgba(255, 255, 255, 0.03)' } : undefined}
            >
              {t('categories.all')}
              <span className="ms-1.5 text-xs opacity-60">({totalQuestions})</span>
            </button>

            {faqCategories.map((cat) => {
              const colors = categoryAccents[cat.slug];
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border"
                  style={{
                    backgroundColor: isActive ? colors.accent : 'rgba(255, 255, 255, 0.03)',
                    borderColor: isActive ? colors.accent : 'rgba(255, 255, 255, 0.06)',
                    color: isActive ? '#fff' : colors.accent,
                  }}
                >
                  {t(`categories.${cat.slug}`)}
                  <span className="ms-1.5 text-xs opacity-60">({cat.questions.length})</span>
                </button>
              );
            })}
          </div>

          {/* FAQ Categories */}
          <AnimatePresence mode="wait">
            {hasResults ? (
              <motion.div
                key={`${activeCategory}-${searchQuery}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                {filteredCategories.map((category) => {
                  if (!category) return null;

                  const colors = categoryAccents[category.slug];
                  const categoryName = t(`categories.${category.slug}`);
                  const IconComp = iconComponents[category.icon] || Code;

                  return (
                    <ScrollReveal key={category.slug}>
                      {/* Category Container — frosted glass */}
                      <div
                        className="rounded-2xl border overflow-hidden backdrop-blur-sm"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                          borderColor: 'rgba(255, 255, 255, 0.06)',
                        }}
                      >
                        {/* Category accent line at top */}
                        <div
                          className="h-px"
                          style={{
                            background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)`,
                          }}
                        />

                        {/* Category Header */}
                        <div
                          className="flex items-center gap-4 px-6 py-5 border-b"
                          style={{ borderColor: 'rgba(255, 255, 255, 0.04)' }}
                        >
                          <div
                            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: colors.iconBg }}
                          >
                            <IconComp className="h-5 w-5" style={{ color: colors.accent }} />
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold text-white">
                              {categoryName}
                            </h2>
                            <p className="text-xs text-muted mt-0.5">
                              {category.questions.length} {category.questions.length === 1 ? 'question' : 'questions'}
                            </p>
                          </div>
                        </div>

                        {/* Questions Accordion */}
                        <div className="px-6">
                          <Accordion type="multiple" className="w-full">
                            {category.questions.map((q, index) => {
                              const questionKeyParts = q.questionKey.replace('faq.', '');
                              const answerKeyParts = q.answerKey.replace('faq.', '');

                              let question: string;
                              let answer: string;

                              try {
                                question = t(questionKeyParts);
                                answer = t(answerKeyParts);
                              } catch {
                                return null;
                              }

                              return (
                                <AccordionItem
                                  key={`${category.slug}-${index}`}
                                  value={`${category.slug}-${index}`}
                                  className="border-b last:border-b-0"
                                  style={{ borderColor: 'rgba(255, 255, 255, 0.04)' }}
                                >
                                  <AccordionTrigger className="text-start py-5 text-[0.95rem]">
                                    {question}
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div
                                      className="rounded-xl px-4 py-3 mb-3 text-sm leading-relaxed text-off-white/80"
                                      style={{
                                        backgroundColor: colors.bg,
                                        borderInlineStart: `2px solid ${colors.accent}`,
                                      }}
                                    >
                                      {answer}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              );
                            })}
                          </Accordion>
                        </div>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="no-results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-7 h-7 text-muted" />
                </div>
                <p className="text-muted text-lg mb-2">{t('page.search_no_results')}</p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                  className="text-sm text-bronze hover:text-bronze-light transition-colors"
                >
                  {t('page.clear_search')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </Section>
  );
}
