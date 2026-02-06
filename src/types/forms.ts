// Form state types for multi-step forms

/** Get AI Estimate multi-step form state */
export interface EstimateFormData {
  step: 1 | 2 | 3 | 4;
  projectType: string;
  features: string[];
  customFeatures: string;
  timeline: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  sendWhatsApp: boolean;
  description: string;
}

/** Idea Lab multi-step form state */
export interface IdeaLabFormData {
  step: 1 | 2 | 3 | 4 | 5;
  background: string;
  industry: string;
  problem: string;
  email: string;
  sendWhatsApp: boolean;
}

/** ROI Calculator multi-step form state */
export interface ROIFormData {
  step: 1 | 2 | 3 | 4 | 5 | 6;
  process: string;
  customProcess: string;
  hoursPerWeek: number;
  employeesInvolved: number;
  hourlyCost: number;
  currency: 'USD' | 'JOD' | 'AED' | 'SAR';
  issues: string[];
  canServeMoreCustomers: 'yes' | 'no' | 'unsure';
  customerIncreasePercent: number;
  canIncreaseRetention: 'yes' | 'no' | 'unsure';
  retentionIncreasePercent: number;
  email: string;
  sendWhatsApp: boolean;
}

/** Chatbot session state */
export interface ChatSessionState {
  sessionId: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
  }>;
  isOpen: boolean;
  hasInteracted: boolean;
}

/** Contact form data */
export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  message: string;
  whatsapp: boolean;
}
