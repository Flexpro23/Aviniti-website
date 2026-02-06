'use client';

import { useTranslations } from 'next-intl';
import { DollarSign, GitBranch, Clock, Code, LifeBuoy } from 'lucide-react';
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

  return (
    <Section>
      <Container>
        <div className="max-w-3xl mx-auto space-y-12">
          {faqCategories.map((category) => {
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
      </Container>
    </Section>
  );
}
