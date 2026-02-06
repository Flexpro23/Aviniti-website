// Solution types for the ready-made solutions catalog

/** Solution category types */
export type SolutionCategory =
  | 'delivery'
  | 'education'
  | 'booking'
  | 'ecommerce'
  | 'restaurant'
  | 'operations'
  | 'social';

/** Solution interface */
export interface Solution {
  /** Unique URL slug (e.g., "delivery-app-system") */
  slug: string;

  /** Display name (translation key: "solutions.<slug>.name") */
  nameKey: string;

  /** Category for filtering */
  category: SolutionCategory;

  /** Lucide icon name (string reference, resolved in components) */
  icon: string;

  /** Starting price in USD */
  startingPrice: number;

  /** Estimated delivery in days */
  timelineDays: number;

  /** Short description translation key */
  descriptionKey: string;

  /** Feature list translation key prefix (features are indexed) */
  featuresKeyPrefix: string;

  /** Number of features to render */
  featureCount: number;

  /** Whether this solution has a live demo */
  hasDemo: boolean;

  /** Related case study slug, if any */
  relatedCaseStudy?: string;
}
