// Blog types

/** Blog category types */
export type BlogCategory =
  | 'ai'
  | 'mobile-development'
  | 'web-development'
  | 'case-study'
  | 'industry-insights'
  | 'tutorials';

/** Blog post interface */
export interface BlogPost {
  /** Unique URL slug */
  slug: string;

  /** Title translation key */
  titleKey: string;

  /** Excerpt/preview translation key */
  excerptKey: string;

  /** Category for filtering */
  category: BlogCategory;

  /** ISO 8601 date string */
  publishedAt: string;

  /** Reading time in minutes */
  readingTimeMinutes: number;

  /** Path to featured image in /public/images/blog/ */
  featuredImage: string;

  /** Author name */
  author: string;

  /** Array of tag strings */
  tags: string[];
}
