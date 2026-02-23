import { describe, it, expect } from 'vitest';
import {
  roiFormSchema,
  roiFormSchemaV2,
  estimateFormSchema,
  ideaLabDiscoverSchema,
  ideaLabGenerateSchema,
  analyzeIdeaSchema,
  generateFeaturesSchema,
} from '../validators';

// ============================================================
// Shared test constants
// ============================================================

const PHONE = '+962790685302';
const NAME = 'Ali Odat';

// ============================================================
// roiFormSchema
// ============================================================

describe('roiFormSchema', () => {
  const validBase = {
    processType: 'orders' as const,
    hoursPerWeek: 10,
    employees: 5,
    hourlyCost: 15,
    currency: 'USD' as const,
    customerGrowth: { answer: 'yes' as const, percentage: 20 },
    retentionImprovement: { answer: 'no' as const },
    name: NAME,
    phone: PHONE,
    whatsapp: false,
  };

  it('accepts valid minimal data', () => {
    expect(roiFormSchema.safeParse(validBase).success).toBe(true);
  });

  it('accepts all optional fields when provided', () => {
    const full = {
      ...validBase,
      customProcess: 'Managing daily order intake and dispatch',
      issues: ['errors-rework', 'missed-opportunities'] as const,
      monthlyRevenue: 5000,
      email: 'ali@aviniti.app',
      company: 'Aviniti',
    };
    expect(roiFormSchema.safeParse(full).success).toBe(true);
  });

  it('rejects missing required field: processType', () => {
    const { processType: _, ...data } = validBase;
    expect(roiFormSchema.safeParse(data).success).toBe(false);
  });

  it('rejects missing required field: hoursPerWeek', () => {
    const { hoursPerWeek: _, ...data } = validBase;
    expect(roiFormSchema.safeParse(data).success).toBe(false);
  });

  it('rejects missing required field: employees', () => {
    const { employees: _, ...data } = validBase;
    expect(roiFormSchema.safeParse(data).success).toBe(false);
  });

  it('rejects missing required field: hourlyCost', () => {
    const { hourlyCost: _, ...data } = validBase;
    expect(roiFormSchema.safeParse(data).success).toBe(false);
  });

  it('rejects missing required field: currency', () => {
    const { currency: _, ...data } = validBase;
    expect(roiFormSchema.safeParse(data).success).toBe(false);
  });

  it('rejects invalid processType enum value', () => {
    expect(roiFormSchema.safeParse({ ...validBase, processType: 'invalid' }).success).toBe(false);
  });

  it('rejects invalid currency enum value', () => {
    expect(roiFormSchema.safeParse({ ...validBase, currency: 'EUR' }).success).toBe(false);
  });

  it('accepts all valid currency values', () => {
    for (const currency of ['USD', 'JOD', 'AED', 'SAR'] as const) {
      expect(roiFormSchema.safeParse({ ...validBase, currency }).success).toBe(true);
    }
  });

  it('rejects hoursPerWeek below minimum (0)', () => {
    expect(roiFormSchema.safeParse({ ...validBase, hoursPerWeek: 0 }).success).toBe(false);
  });

  it('rejects hoursPerWeek above maximum (201)', () => {
    expect(roiFormSchema.safeParse({ ...validBase, hoursPerWeek: 201 }).success).toBe(false);
  });

  it('accepts hoursPerWeek at boundaries (1 and 200)', () => {
    expect(roiFormSchema.safeParse({ ...validBase, hoursPerWeek: 1 }).success).toBe(true);
    expect(roiFormSchema.safeParse({ ...validBase, hoursPerWeek: 200 }).success).toBe(true);
  });

  it('rejects employees below minimum (0)', () => {
    expect(roiFormSchema.safeParse({ ...validBase, employees: 0 }).success).toBe(false);
  });

  it('rejects employees above maximum (101)', () => {
    expect(roiFormSchema.safeParse({ ...validBase, employees: 101 }).success).toBe(false);
  });

  it('rejects non-positive hourlyCost (0)', () => {
    expect(roiFormSchema.safeParse({ ...validBase, hourlyCost: 0 }).success).toBe(false);
  });

  it('rejects negative hourlyCost', () => {
    expect(roiFormSchema.safeParse({ ...validBase, hourlyCost: -5 }).success).toBe(false);
  });

  it('rejects customerGrowth.percentage below 1', () => {
    const data = {
      ...validBase,
      customerGrowth: { answer: 'yes' as const, percentage: 0 },
    };
    expect(roiFormSchema.safeParse(data).success).toBe(false);
  });

  it('rejects customerGrowth.percentage above 200', () => {
    const data = {
      ...validBase,
      customerGrowth: { answer: 'yes' as const, percentage: 201 },
    };
    expect(roiFormSchema.safeParse(data).success).toBe(false);
  });

  it('rejects invalid customerGrowth answer value', () => {
    const data = {
      ...validBase,
      customerGrowth: { answer: 'maybe' },
    };
    expect(roiFormSchema.safeParse(data).success).toBe(false);
  });

  it('rejects customProcess shorter than 10 chars', () => {
    expect(roiFormSchema.safeParse({ ...validBase, customProcess: 'short' }).success).toBe(false);
  });

  it('rejects customProcess longer than 200 chars', () => {
    expect(roiFormSchema.safeParse({ ...validBase, customProcess: 'a'.repeat(201) }).success).toBe(false);
  });

  it('accepts monthlyRevenue of 0 (nonnegative)', () => {
    expect(roiFormSchema.safeParse({ ...validBase, monthlyRevenue: 0 }).success).toBe(true);
  });

  it('rejects negative monthlyRevenue', () => {
    expect(roiFormSchema.safeParse({ ...validBase, monthlyRevenue: -1 }).success).toBe(false);
  });
});

// ============================================================
// roiFormSchemaV2
// ============================================================

describe('roiFormSchemaV2', () => {
  const validFromEstimate = {
    mode: 'from-estimate' as const,
    projectName: 'Delivery App',
    projectSummary: 'A delivery platform for restaurants',
    projectType: 'mobile' as const,
    estimatedCost: { min: 8000, max: 12000 },
    estimatedTimeline: { weeks: 12 },
    approach: 'custom' as const,
    features: ['user auth', 'order tracking'],
    techStack: ['React Native', 'Firebase'],
    strategicInsights: [
      { type: 'strength' as const, title: 'Strong demand', description: 'Growing food delivery market' },
    ],
    matchedSolution: null,
    targetMarket: 'mena' as const,
    name: NAME,
    phone: PHONE,
    whatsapp: false,
    locale: 'en' as const,
  };

  const validStandalone = {
    mode: 'standalone' as const,
    ideaDescription: 'An e-commerce platform for handmade crafts in Jordan',
    targetMarket: 'mena' as const,
    name: NAME,
    phone: PHONE,
    whatsapp: false,
    locale: 'en' as const,
  };

  // --- from-estimate mode ---
  it('accepts valid from-estimate data', () => {
    expect(roiFormSchemaV2.safeParse(validFromEstimate).success).toBe(true);
  });

  it('accepts from-estimate with a matched solution object', () => {
    const data = {
      ...validFromEstimate,
      matchedSolution: {
        slug: 'delivery-app',
        name: 'Delivery App',
        startingPrice: 10000,
        deploymentTimeline: '35 days',
        featureMatchPercentage: 85,
      },
    };
    expect(roiFormSchemaV2.safeParse(data).success).toBe(true);
  });

  it('rejects from-estimate missing projectName', () => {
    const { projectName: _, ...data } = validFromEstimate;
    expect(roiFormSchemaV2.safeParse(data).success).toBe(false);
  });

  it('rejects from-estimate missing estimatedCost', () => {
    const { estimatedCost: _, ...data } = validFromEstimate;
    expect(roiFormSchemaV2.safeParse(data).success).toBe(false);
  });

  it('rejects from-estimate missing estimatedTimeline', () => {
    const { estimatedTimeline: _, ...data } = validFromEstimate;
    expect(roiFormSchemaV2.safeParse(data).success).toBe(false);
  });

  it('rejects from-estimate with non-positive estimatedCost.min', () => {
    const data = { ...validFromEstimate, estimatedCost: { min: 0, max: 10000 } };
    expect(roiFormSchemaV2.safeParse(data).success).toBe(false);
  });

  it('rejects from-estimate with invalid approach enum', () => {
    const data = { ...validFromEstimate, approach: 'bespoke' };
    expect(roiFormSchemaV2.safeParse(data).success).toBe(false);
  });

  it('rejects from-estimate with invalid targetMarket enum', () => {
    const data = { ...validFromEstimate, targetMarket: 'mars' };
    expect(roiFormSchemaV2.safeParse(data).success).toBe(false);
  });

  it('rejects from-estimate with invalid locale', () => {
    const data = { ...validFromEstimate, locale: 'fr' };
    expect(roiFormSchemaV2.safeParse(data).success).toBe(false);
  });

  // --- standalone mode ---
  it('accepts valid standalone data', () => {
    expect(roiFormSchemaV2.safeParse(validStandalone).success).toBe(true);
  });

  it('rejects standalone missing ideaDescription', () => {
    const { ideaDescription: _, ...data } = validStandalone;
    expect(roiFormSchemaV2.safeParse(data).success).toBe(false);
  });

  it('rejects standalone with ideaDescription shorter than 20 chars', () => {
    const data = { ...validStandalone, ideaDescription: 'Too short' };
    expect(roiFormSchemaV2.safeParse(data).success).toBe(false);
  });

  it('rejects standalone with invalid targetMarket', () => {
    const data = { ...validStandalone, targetMarket: 'invalid' };
    expect(roiFormSchemaV2.safeParse(data).success).toBe(false);
  });

  it('accepts standalone with optional budgetRange', () => {
    const data = { ...validStandalone, budgetRange: { min: 0, max: 20000 } };
    expect(roiFormSchemaV2.safeParse(data).success).toBe(true);
  });

  it('rejects standalone when budgetRange.min exceeds max', () => {
    const data = { ...validStandalone, budgetRange: { min: 50000, max: 10000 } };
    expect(roiFormSchemaV2.safeParse(data).success).toBe(false);
  });

  it('rejects when mode is missing entirely', () => {
    const { mode: _, ...data } = validStandalone;
    expect(roiFormSchemaV2.safeParse(data).success).toBe(false);
  });

  it('rejects when mode is an unknown discriminant value', () => {
    expect(roiFormSchemaV2.safeParse({ ...validStandalone, mode: 'other' }).success).toBe(false);
  });
});

// ============================================================
// estimateFormSchema
// ============================================================

describe('estimateFormSchema', () => {
  const validWithIds = {
    projectType: 'mobile' as const,
    description: 'A delivery application for local restaurants',
    answers: { 'q1': true, 'q2': false },
    questions: [{ id: 'q1', question: 'Do you need GPS?', context: 'Location tracking' }],
    selectedFeatureIds: ['feat-1', 'feat-2'],
    name: NAME,
    phone: PHONE,
    whatsapp: false,
  };

  const validWithFeatures = {
    projectType: 'web' as const,
    description: 'An e-commerce platform for artisans',
    answers: { 'q1': true },
    questions: [{ id: 'q1', question: 'Do you need payments?', context: 'Payment integration' }],
    selectedFeatures: [
      { id: 'feat-1', name: 'Payment Gateway', description: 'Process online payments', category: 'must-have' as const },
    ],
    name: NAME,
    phone: PHONE,
    whatsapp: false,
  };

  it('accepts valid data with selectedFeatureIds', () => {
    expect(estimateFormSchema.safeParse(validWithIds).success).toBe(true);
  });

  it('accepts valid data with selectedFeatures array', () => {
    expect(estimateFormSchema.safeParse(validWithFeatures).success).toBe(true);
  });

  it('rejects when neither selectedFeatureIds nor selectedFeatures is provided (refinement fails)', () => {
    const { selectedFeatureIds: _, ...data } = validWithIds;
    expect(estimateFormSchema.safeParse(data).success).toBe(false);
  });

  it('rejects when selectedFeatureIds is an empty array (refinement fails)', () => {
    const data = { ...validWithIds, selectedFeatureIds: [] };
    expect(estimateFormSchema.safeParse(data).success).toBe(false);
  });

  it('rejects when selectedFeatures is an empty array and selectedFeatureIds is absent', () => {
    const data = {
      projectType: 'mobile' as const,
      description: 'Valid description here',
      answers: { 'q1': true },
      questions: [{ id: 'q1', question: 'Question?', context: 'Context' }],
      selectedFeatures: [],
      name: NAME,
      phone: PHONE,
      whatsapp: false,
    };
    expect(estimateFormSchema.safeParse(data).success).toBe(false);
  });

  it('rejects missing projectType', () => {
    const { projectType: _, ...data } = validWithIds;
    expect(estimateFormSchema.safeParse(data).success).toBe(false);
  });

  it('rejects description shorter than 10 chars', () => {
    expect(estimateFormSchema.safeParse({ ...validWithIds, description: 'Short' }).success).toBe(false);
  });

  it('rejects description longer than 2000 chars', () => {
    expect(estimateFormSchema.safeParse({ ...validWithIds, description: 'a'.repeat(2001) }).success).toBe(false);
  });

  it('rejects invalid projectType enum value', () => {
    expect(estimateFormSchema.safeParse({ ...validWithIds, projectType: 'blockchain' }).success).toBe(false);
  });

  it('accepts all valid projectType enum values', () => {
    for (const projectType of ['mobile', 'web', 'ai', 'cloud', 'fullstack'] as const) {
      expect(estimateFormSchema.safeParse({ ...validWithIds, projectType }).success).toBe(true);
    }
  });

  it('rejects missing name', () => {
    const { name: _, ...data } = validWithIds;
    expect(estimateFormSchema.safeParse(data).success).toBe(false);
  });

  it('rejects missing phone', () => {
    const { phone: _, ...data } = validWithIds;
    expect(estimateFormSchema.safeParse(data).success).toBe(false);
  });

  it('accepts optional email as empty string', () => {
    expect(estimateFormSchema.safeParse({ ...validWithIds, email: '' }).success).toBe(true);
  });
});

// ============================================================
// ideaLabDiscoverSchema
// ============================================================

describe('ideaLabDiscoverSchema', () => {
  const valid = {
    persona: 'small-business' as const,
    industry: 'ecommerce-retail' as const,
    locale: 'en' as const,
  };

  it('accepts valid data', () => {
    expect(ideaLabDiscoverSchema.safeParse(valid).success).toBe(true);
  });

  it('accepts optional inputLanguage field', () => {
    expect(ideaLabDiscoverSchema.safeParse({ ...valid, inputLanguage: 'ar' }).success).toBe(true);
    expect(ideaLabDiscoverSchema.safeParse({ ...valid, inputLanguage: 'en' }).success).toBe(true);
  });

  it('rejects missing persona', () => {
    const { persona: _, ...data } = valid;
    expect(ideaLabDiscoverSchema.safeParse(data).success).toBe(false);
  });

  it('rejects missing industry', () => {
    const { industry: _, ...data } = valid;
    expect(ideaLabDiscoverSchema.safeParse(data).success).toBe(false);
  });

  it('rejects missing locale', () => {
    const { locale: _, ...data } = valid;
    expect(ideaLabDiscoverSchema.safeParse(data).success).toBe(false);
  });

  it('rejects invalid persona enum value', () => {
    expect(ideaLabDiscoverSchema.safeParse({ ...valid, persona: 'enterprise' }).success).toBe(false);
  });

  it('rejects invalid industry enum value', () => {
    expect(ideaLabDiscoverSchema.safeParse({ ...valid, industry: 'mining' }).success).toBe(false);
  });

  it('rejects invalid locale value', () => {
    expect(ideaLabDiscoverSchema.safeParse({ ...valid, locale: 'fr' }).success).toBe(false);
  });

  it('rejects invalid inputLanguage value', () => {
    expect(ideaLabDiscoverSchema.safeParse({ ...valid, inputLanguage: 'de' }).success).toBe(false);
  });

  it('accepts all valid persona values', () => {
    for (const persona of ['small-business', 'professional', 'creative', 'student', 'hobby', 'manager'] as const) {
      expect(ideaLabDiscoverSchema.safeParse({ ...valid, persona }).success).toBe(true);
    }
  });

  it('accepts all valid industry values', () => {
    const industries = [
      'health-wellness', 'finance-banking', 'education-learning', 'ecommerce-retail',
      'logistics-delivery', 'entertainment-media', 'travel-hospitality', 'real-estate',
      'food-restaurant', 'social-community', 'other',
    ] as const;
    for (const industry of industries) {
      expect(ideaLabDiscoverSchema.safeParse({ ...valid, industry }).success).toBe(true);
    }
  });
});

// ============================================================
// ideaLabGenerateSchema
// ============================================================

describe('ideaLabGenerateSchema', () => {
  const validAnswers = [
    { questionId: 'q1', questionText: 'What is your target audience?', answer: 'Young adults 18-35' },
    { questionId: 'q2', questionText: 'What problem do you solve?', answer: 'Food ordering friction' },
    { questionId: 'q3', questionText: 'What is your revenue model?', answer: 'Subscription + commission' },
  ];

  const valid = {
    persona: 'small-business' as const,
    industry: 'food-restaurant' as const,
    discoveryAnswers: validAnswers,
    name: NAME,
    phone: PHONE,
    whatsapp: false,
    locale: 'en' as const,
  };

  it('accepts valid data', () => {
    expect(ideaLabGenerateSchema.safeParse(valid).success).toBe(true);
  });

  it('accepts optional fields (email, previousIdeaNames)', () => {
    const data = {
      ...valid,
      email: 'ali@aviniti.app',
      previousIdeaNames: ['FoodieConnect', 'QuickBite'],
    };
    expect(ideaLabGenerateSchema.safeParse(data).success).toBe(true);
  });

  it('rejects fewer than 3 discoveryAnswers', () => {
    const data = { ...valid, discoveryAnswers: validAnswers.slice(0, 2) };
    expect(ideaLabGenerateSchema.safeParse(data).success).toBe(false);
  });

  it('rejects more than 10 discoveryAnswers', () => {
    const extraAnswers = Array.from({ length: 11 }, (_, i) => ({
      questionId: `q${i}`,
      questionText: `Question ${i}?`,
      answer: `Answer ${i}`,
    }));
    expect(ideaLabGenerateSchema.safeParse({ ...valid, discoveryAnswers: extraAnswers }).success).toBe(false);
  });

  it('accepts exactly 10 discoveryAnswers (boundary)', () => {
    const tenAnswers = Array.from({ length: 10 }, (_, i) => ({
      questionId: `q${i}`,
      questionText: `Question ${i}?`,
      answer: `Answer ${i}`,
    }));
    expect(ideaLabGenerateSchema.safeParse({ ...valid, discoveryAnswers: tenAnswers }).success).toBe(true);
  });

  it('rejects a discoveryAnswer with empty questionId', () => {
    const badAnswers = [
      ...validAnswers.slice(0, 2),
      { questionId: '', questionText: 'Question?', answer: 'Answer' },
    ];
    expect(ideaLabGenerateSchema.safeParse({ ...valid, discoveryAnswers: badAnswers }).success).toBe(false);
  });

  it('rejects a discoveryAnswer with empty answer', () => {
    const badAnswers = [
      ...validAnswers.slice(0, 2),
      { questionId: 'q3', questionText: 'Question?', answer: '' },
    ];
    expect(ideaLabGenerateSchema.safeParse({ ...valid, discoveryAnswers: badAnswers }).success).toBe(false);
  });

  it('rejects missing name', () => {
    const { name: _, ...data } = valid;
    expect(ideaLabGenerateSchema.safeParse(data).success).toBe(false);
  });

  it('rejects missing phone', () => {
    const { phone: _, ...data } = valid;
    expect(ideaLabGenerateSchema.safeParse(data).success).toBe(false);
  });

  it('rejects invalid locale', () => {
    expect(ideaLabGenerateSchema.safeParse({ ...valid, locale: 'de' }).success).toBe(false);
  });

  it('accepts locale "ar"', () => {
    expect(ideaLabGenerateSchema.safeParse({ ...valid, locale: 'ar' }).success).toBe(true);
  });
});

// ============================================================
// analyzeIdeaSchema
// ============================================================

describe('analyzeIdeaSchema', () => {
  const valid = {
    projectType: 'mobile' as const,
    description: 'A delivery app for local restaurants',
  };

  it('accepts valid data', () => {
    expect(analyzeIdeaSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects missing projectType', () => {
    const { projectType: _, ...data } = valid;
    expect(analyzeIdeaSchema.safeParse(data).success).toBe(false);
  });

  it('rejects missing description', () => {
    const { description: _, ...data } = valid;
    expect(analyzeIdeaSchema.safeParse(data).success).toBe(false);
  });

  it('rejects invalid projectType enum value', () => {
    expect(analyzeIdeaSchema.safeParse({ ...valid, projectType: 'desktop' }).success).toBe(false);
  });

  it('rejects description shorter than 10 chars', () => {
    expect(analyzeIdeaSchema.safeParse({ ...valid, description: 'Short' }).success).toBe(false);
  });

  it('rejects description exactly at minimum boundary minus 1 (9 chars)', () => {
    expect(analyzeIdeaSchema.safeParse({ ...valid, description: 'a'.repeat(9) }).success).toBe(false);
  });

  it('accepts description exactly at minimum boundary (10 chars)', () => {
    expect(analyzeIdeaSchema.safeParse({ ...valid, description: 'a'.repeat(10) }).success).toBe(true);
  });

  it('rejects description longer than 2000 chars', () => {
    expect(analyzeIdeaSchema.safeParse({ ...valid, description: 'a'.repeat(2001) }).success).toBe(false);
  });

  it('accepts description exactly at maximum boundary (2000 chars)', () => {
    expect(analyzeIdeaSchema.safeParse({ ...valid, description: 'a'.repeat(2000) }).success).toBe(true);
  });

  it('accepts all valid projectType enum values', () => {
    for (const projectType of ['mobile', 'web', 'ai', 'cloud', 'fullstack'] as const) {
      expect(analyzeIdeaSchema.safeParse({ ...valid, projectType }).success).toBe(true);
    }
  });
});

// ============================================================
// generateFeaturesSchema
// ============================================================

describe('generateFeaturesSchema', () => {
  const valid = {
    projectType: 'web' as const,
    description: 'An e-commerce platform for handmade crafts',
    answers: { 'q1': true, 'q2': false, 'q3': true },
    questions: [
      { id: 'q1', question: 'Do you need user authentication?', context: 'Auth system' },
      { id: 'q2', question: 'Do you need a mobile app?', context: 'Mobile strategy' },
      { id: 'q3', question: 'Do you need payment processing?', context: 'Payment gateway' },
    ],
  };

  it('accepts valid data', () => {
    expect(generateFeaturesSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects missing projectType', () => {
    const { projectType: _, ...data } = valid;
    expect(generateFeaturesSchema.safeParse(data).success).toBe(false);
  });

  it('rejects missing description', () => {
    const { description: _, ...data } = valid;
    expect(generateFeaturesSchema.safeParse(data).success).toBe(false);
  });

  it('rejects missing answers', () => {
    const { answers: _, ...data } = valid;
    expect(generateFeaturesSchema.safeParse(data).success).toBe(false);
  });

  it('rejects missing questions', () => {
    const { questions: _, ...data } = valid;
    expect(generateFeaturesSchema.safeParse(data).success).toBe(false);
  });

  it('rejects empty questions array (minimum 1)', () => {
    expect(generateFeaturesSchema.safeParse({ ...valid, questions: [] }).success).toBe(false);
  });

  it('rejects more than 10 questions', () => {
    const tooMany = Array.from({ length: 11 }, (_, i) => ({
      id: `q${i}`,
      question: `Question ${i}?`,
      context: `Context ${i}`,
    }));
    expect(generateFeaturesSchema.safeParse({ ...valid, questions: tooMany }).success).toBe(false);
  });

  it('accepts exactly 10 questions (boundary)', () => {
    const ten = Array.from({ length: 10 }, (_, i) => ({
      id: `q${i}`,
      question: `Question ${i}?`,
      context: `Context ${i}`,
    }));
    expect(generateFeaturesSchema.safeParse({ ...valid, questions: ten }).success).toBe(true);
  });

  it('rejects description shorter than 10 chars', () => {
    expect(generateFeaturesSchema.safeParse({ ...valid, description: 'Too short' }).success).toBe(false);
  });

  it('rejects description longer than 2000 chars', () => {
    expect(generateFeaturesSchema.safeParse({ ...valid, description: 'a'.repeat(2001) }).success).toBe(false);
  });

  it('rejects invalid projectType enum value', () => {
    expect(generateFeaturesSchema.safeParse({ ...valid, projectType: 'blockchain' }).success).toBe(false);
  });

  it('accepts all valid projectType enum values', () => {
    for (const projectType of ['mobile', 'web', 'ai', 'cloud', 'fullstack'] as const) {
      expect(generateFeaturesSchema.safeParse({ ...valid, projectType }).success).toBe(true);
    }
  });

  it('accepts answers record with boolean values', () => {
    const data = { ...valid, answers: { 'q1': true, 'q2': false } };
    expect(generateFeaturesSchema.safeParse(data).success).toBe(true);
  });

  it('accepts empty answers record', () => {
    // z.record does not enforce non-empty — an empty record is valid
    expect(generateFeaturesSchema.safeParse({ ...valid, answers: {} }).success).toBe(true);
  });
});
