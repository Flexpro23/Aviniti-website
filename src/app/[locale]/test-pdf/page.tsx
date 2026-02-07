'use client';

import { PDFReport } from '@/components/ai-tools/PDFReport';
import type { EstimateResponse } from '@/types/api';

const mockResults: EstimateResponse = {
  projectName: 'Amman Vogue',
  alternativeNames: ['Amman Style Hub', 'Vogue Jordan', 'StyleMap Amman'],
  projectSummary:
    'A premium fashion marketplace connecting local Amman boutiques with style-conscious consumers. The platform features AI-powered style recommendations, virtual try-on capabilities, and seamless delivery integration across the Greater Amman area.',
  estimatedCost: { min: 18000, max: 28000, currency: 'USD' },
  estimatedTimeline: {
    weeks: 16,
    phases: [
      { phase: 1, name: 'Discovery & Architecture', description: 'Requirements analysis, system architecture design, and project planning with stakeholder alignment.', cost: 3000, duration: '2 weeks' },
      { phase: 2, name: 'UI/UX Design', description: 'Wireframes, high-fidelity mockups, interactive prototypes, and design system creation.', cost: 4000, duration: '3 weeks' },
      { phase: 3, name: 'Core Development', description: 'Backend API development, database setup, authentication system, and core marketplace features.', cost: 7000, duration: '4 weeks' },
      { phase: 4, name: 'AI Integration', description: 'Style recommendation engine, virtual try-on module, and personalized feed algorithms.', cost: 5000, duration: '3 weeks' },
      { phase: 5, name: 'Testing & Launch', description: 'QA testing, performance optimization, app store submission, and production deployment.', cost: 3500, duration: '2 weeks' },
      { phase: 6, name: 'Post-Launch Support', description: 'Bug fixes, user feedback integration, analytics monitoring, and iterative improvements.', cost: 2500, duration: '2 weeks' },
    ],
  },
  approach: 'custom',
  matchedSolution: {
    slug: 'delivery-app',
    name: 'Aviniti Delivery Platform',
    startingPrice: 10000,
    deploymentTimeline: '5 weeks',
    featureMatchPercentage: 62,
  },
  techStack: ['React Native', 'Node.js', 'Firebase', 'TensorFlow Lite', 'Stripe', 'Google Maps API', 'Redis', 'PostgreSQL'],
  keyInsights: [
    'The Amman fashion market is growing 15% YoY with increasing demand for digital shopping experiences.',
    'AI-powered style recommendations can increase average order value by 25-35% based on similar platform data.',
    'Virtual try-on technology is a key differentiator that reduces return rates by up to 40%.',
    'Integration with local delivery services is critical for same-day delivery expectations in Amman.',
  ],
  strategicInsights: [
    { type: 'strength', title: 'First-Mover Advantage', description: 'No existing platform combines local Amman boutiques with AI styling. Early entry allows building brand loyalty and vendor relationships before competition arrives.' },
    { type: 'challenge', title: 'Vendor Onboarding', description: 'Convincing traditional Amman boutiques to digitize their inventory and adopt the platform will require dedicated sales effort and possibly initial incentives.' },
    { type: 'recommendation', title: 'Launch with MVP', description: 'Start with core marketplace features and add AI capabilities in Phase 2. This reduces initial investment while validating market demand quickly.' },
  ],
  breakdown: [
    { phase: 1, name: 'Discovery & Architecture', description: 'Requirements analysis, system architecture design, and project planning with stakeholder alignment.', cost: 3000, duration: '2 weeks' },
    { phase: 2, name: 'UI/UX Design', description: 'Wireframes, high-fidelity mockups, interactive prototypes, and design system creation.', cost: 4000, duration: '3 weeks' },
    { phase: 3, name: 'Core Development', description: 'Backend API development, database setup, authentication system, and core marketplace features.', cost: 7000, duration: '4 weeks' },
    { phase: 4, name: 'AI Integration', description: 'Style recommendation engine, virtual try-on module, and personalized feed algorithms.', cost: 5000, duration: '3 weeks' },
    { phase: 5, name: 'Testing & Launch', description: 'QA testing, performance optimization, app store submission, and production deployment.', cost: 3500, duration: '2 weeks' },
    { phase: 6, name: 'Post-Launch Support', description: 'Bug fixes, user feedback integration, analytics monitoring, and iterative improvements.', cost: 2500, duration: '2 weeks' },
  ],
};

export default function TestPDFPage() {
  return (
    <div style={{ background: '#0F1419', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, padding: 40 }}>
      <h1 style={{ color: '#F4F4F2', fontSize: 24, fontWeight: 'bold' }}>PDF Report Test Page</h1>
      <p style={{ color: '#94A3B8', fontSize: 14, maxWidth: 500, textAlign: 'center' }}>
        Click the button below to generate and download the 6-page Project Blueprint PDF with mock &quot;Amman Vogue&quot; data.
      </p>
      <PDFReport
        results={mockResults}
        userName="Ali Odat"
        userEmail="ali@aviniti.app"
        className="h-12 px-8 text-base"
      />
    </div>
  );
}
