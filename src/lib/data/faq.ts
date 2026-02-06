// Static data for FAQ categories and questions

export interface FAQItem {
  questionKey: string;
  answerKey: string;
}

export interface FAQCategory {
  slug: string;
  nameKey: string;
  icon: string;
  questions: FAQItem[];
}

export const faqCategories: FAQCategory[] = [
  {
    slug: 'pricing',
    nameKey: 'faq.categories.pricing',
    icon: 'DollarSign',
    questions: [
      {
        questionKey: 'faq.pricing.q1.question',
        answerKey: 'faq.pricing.q1.answer',
      },
      {
        questionKey: 'faq.pricing.q2.question',
        answerKey: 'faq.pricing.q2.answer',
      },
      {
        questionKey: 'faq.pricing.q3.question',
        answerKey: 'faq.pricing.q3.answer',
      },
      {
        questionKey: 'faq.pricing.q4.question',
        answerKey: 'faq.pricing.q4.answer',
      },
      {
        questionKey: 'faq.pricing.q5.question',
        answerKey: 'faq.pricing.q5.answer',
      },
    ],
  },
  {
    slug: 'process',
    nameKey: 'faq.categories.process',
    icon: 'GitBranch',
    questions: [
      {
        questionKey: 'faq.process.q1.question',
        answerKey: 'faq.process.q1.answer',
      },
      {
        questionKey: 'faq.process.q2.question',
        answerKey: 'faq.process.q2.answer',
      },
      {
        questionKey: 'faq.process.q3.question',
        answerKey: 'faq.process.q3.answer',
      },
      {
        questionKey: 'faq.process.q4.question',
        answerKey: 'faq.process.q4.answer',
      },
    ],
  },
  {
    slug: 'timeline',
    nameKey: 'faq.categories.timeline',
    icon: 'Clock',
    questions: [
      {
        questionKey: 'faq.timeline.q1.question',
        answerKey: 'faq.timeline.q1.answer',
      },
      {
        questionKey: 'faq.timeline.q2.question',
        answerKey: 'faq.timeline.q2.answer',
      },
      {
        questionKey: 'faq.timeline.q3.question',
        answerKey: 'faq.timeline.q3.answer',
      },
      {
        questionKey: 'faq.timeline.q4.question',
        answerKey: 'faq.timeline.q4.answer',
      },
    ],
  },
  {
    slug: 'technology',
    nameKey: 'faq.categories.technology',
    icon: 'Code',
    questions: [
      {
        questionKey: 'faq.technology.q1.question',
        answerKey: 'faq.technology.q1.answer',
      },
      {
        questionKey: 'faq.technology.q2.question',
        answerKey: 'faq.technology.q2.answer',
      },
      {
        questionKey: 'faq.technology.q3.question',
        answerKey: 'faq.technology.q3.answer',
      },
      {
        questionKey: 'faq.technology.q4.question',
        answerKey: 'faq.technology.q4.answer',
      },
    ],
  },
  {
    slug: 'support',
    nameKey: 'faq.categories.support',
    icon: 'LifeBuoy',
    questions: [
      {
        questionKey: 'faq.support.q1.question',
        answerKey: 'faq.support.q1.answer',
      },
      {
        questionKey: 'faq.support.q2.question',
        answerKey: 'faq.support.q2.answer',
      },
      {
        questionKey: 'faq.support.q3.question',
        answerKey: 'faq.support.q3.answer',
      },
      {
        questionKey: 'faq.support.q4.question',
        answerKey: 'faq.support.q4.answer',
      },
      {
        questionKey: 'faq.support.q5.question',
        answerKey: 'faq.support.q5.answer',
      },
    ],
  },
];
