'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { DollarSign, GitBranch, Clock, Code, LifeBuoy, Search, X } from 'lucide-react';
import { faqCategories } from '@/lib/data/faq';
import { Container, Section, Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

const iconMap: Record<string, React.ReactNode> = {
  DollarSign: <DollarSign className="h-5 w-5 text-bronze" />,
  GitBranch: <GitBranch className="h-5 w-5 text-bronze" />,
  Clock: <Clock className="h-5 w-5 text-bronze" />,
  Code: <Code className="h-5 w-5 text-bronze" />,
  LifeBuoy: <LifeBuoy className="h-5 w-5 text-bronze" />,
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
        // Filter by category first
        if (activeCategory !== 'all' && category.slug !== activeCategory) {
          return null;
        }

        // If no search query, return all questions in this category
        if (!query) {
          return category;
        }

        // Filter questions by search query
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

        // If no matching questions, don't include this category
        if (matchingQuestions.length === 0) {
          return null;
        }

        return {
          ...category,
          questions: matchingQuestions,
        };
      })
      .filter(Boolean);
  }, [searchQuery, activeCategory, t]);

  const hasResults = filteredCategories.length > 0;

  return (
    <Section>
      <Container>
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute start-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('page.search_placeholder')}
              className="w-full bg-slate-blue border border-slate-blue-light rounded-xl ps-12 pe-12 py-3 text-off-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-bronze/50 focus:border-bronze transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute end-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {['all', 'general', 'pricing', 'process', 'technology', 'support'].map((catKey) => (
              <button
                key={catKey}
                onClick={() => setActiveCategory(catKey)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeCategory === catKey
                    ? 'bg-bronze text-white'
                    : 'bg-slate-blue text-muted hover:text-white hover:bg-slate-blue-light'
                }`}
              >
                {t(`categories.${catKey}`)}
              </button>
            ))}
          </div>

          {/* FAQ Categories */}
          {hasResults ? (
            <div className="space-y-12">
              {filteredCategories.map((category) => {
                if (!category) return null;

                const categoryName = t(`categories.${category.slug}`);

                return (
                  <ScrollReveal key={category.slug}>
                    <div>
                      {/* Category Header */}
                      <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-lg bg-bronze/10 flex items-center justify-center border border-bronze/20">
                          {iconMap[category.icon] || <Code className="h-5 w-5 text-bronze" />}
                        </div>
                        <h2 className="text-xl font-semibold text-white">
                          {categoryName}
                        </h2>
                      </div>

                      {/* Questions Accordion */}
                      <Accordion type="single" collapsible className="w-full">
                        {category.questions.map((q, index) => {
                          // Parse keys: "faq.pricing.q1.question" -> "pricing.q1.question"
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
                            >
                              <AccordionTrigger className="text-start">
                                {question}
                              </AccordionTrigger>
                              <AccordionContent>
                                {answer}
                              </AccordionContent>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted text-lg">{t('page.search_no_results')}</p>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
