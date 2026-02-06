// Case study types

/** Case study industry types */
export type CaseStudyIndustry =
  | 'healthcare'
  | 'ecommerce'
  | 'logistics'
  | 'education'
  | 'restaurant';

/** Case study metric for the hero bar */
export interface CaseStudyMetric {
  /** Metric value (e.g., "40%", "3x", "$120K") */
  value: string;

  /** Metric label translation key */
  labelKey: string;
}

/** Case study interface */
export interface CaseStudy {
  /** Unique URL slug */
  slug: string;

  /** Industry category */
  industry: CaseStudyIndustry;

  /** Result-focused headline translation key */
  headlineKey: string;

  /** Short excerpt translation key */
  excerptKey: string;

  /** Primary metric value (e.g., "40%", "3x") */
  keyMetric: string;

  /** Primary metric label translation key */
  keyMetricLabelKey: string;

  /** Array of 3-4 metrics for the hero bar */
  metrics: CaseStudyMetric[];

  /** Challenge section translation key */
  challengeKey: string;

  /** Solution section translation key */
  solutionKey: string;

  /** Results section translation key */
  resultsKey: string;

  /** Key takeaways translation key prefix (indexed) */
  takeawaysKeyPrefix: string;

  /** Number of takeaways to render */
  takeawaysCount: number;

  /** Optional client quote translation key */
  quoteKey?: string;

  /** Array of technology names used */
  technologies: string[];

  /** Optional path to featured image */
  featuredImage?: string;
}
