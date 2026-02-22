/** Solution category types */
export type SolutionCategory =
  | 'delivery'
  | 'education'
  | 'booking'
  | 'ecommerce'
  | 'operations'
  | 'health-beauty';

/** Demo availability status */
export type DemoStatus = 'full' | 'partial' | 'none';

/** App/component within a solution */
export interface SolutionApp {
  id: string;
  nameKey: string;
  descKey: string;
  icon: string;
  rolesKey: string;
  featureCount: number;
}

/** Solution interface */
export interface Solution {
  slug: string;
  nameKey: string;
  category: SolutionCategory;
  icon: string;
  appCount: number;
  apps: SolutionApp[];
  demoStatus: DemoStatus;
  heroImage?: string;
  differentiationCount: number;
  customizationCount: number;
  includedCount: number;
  hasDemo: boolean;
  descriptionKey: string;
  featuresKeyPrefix: string;
  featureCount: number;
  startingPrice: number;
  timelineDays: string;
}
