// Blog post Firestore queries — server-only (uses Firebase Admin SDK)
// Each post has bilingual content: post.en.* and post.ar.*

import { getAdminDb } from './admin';
import { logServerError } from './error-logging';

export interface BlogPostLocalized {
  title: string;
  excerpt: string;
  content: string; // markdown
  metaDescription: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  status: 'published' | 'draft' | 'failed';
  publishedAt: string; // ISO string
  featuredImage: string | null;
  tags: string[];
  category: string;
  targetKeyword: string;
  readingTime: number;
  en: BlogPostLocalized;
  ar: BlogPostLocalized;
}

export interface BlogPostSummary {
  id: string;
  slug: string;
  publishedAt: string;
  featuredImage: string | null;
  tags: string[];
  category: string;
  readingTime: number;
  // Only the current locale fields (title + excerpt)
  title: string;
  excerpt: string;
}

/**
 * Fetch all published blog posts, ordered newest first.
 * Returns only the fields needed for the listing page.
 */
export async function getBlogPosts(locale: string, limit = 50): Promise<BlogPostSummary[]> {
  try {
    const db = getAdminDb();
    const snapshot = await db
      .collection('blog_posts')
      .where('status', '==', 'published')
      .orderBy('publishedAt', 'desc')
      .limit(limit)
      .select('slug', 'publishedAt', 'featuredImage', 'tags', 'category', 'readingTime', 'en', 'ar')
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data() as BlogPost;
      const localeData = locale === 'ar' ? data.ar : data.en;
      return {
        id: doc.id,
        slug: data.slug,
        publishedAt: data.publishedAt,
        featuredImage: data.featuredImage ?? null,
        tags: data.tags ?? [],
        category: data.category ?? 'General',
        readingTime: data.readingTime ?? 5,
        title: localeData?.title ?? data.en.title,
        excerpt: localeData?.excerpt ?? data.en.excerpt,
      };
    });
  } catch (error) {
    logServerError('firebase/blog', 'Failed to fetch blog posts', error);
    return [];
  }
}

/**
 * Fetch a single blog post by slug.
 * Returns full bilingual content.
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const db = getAdminDb();
    const snapshot = await db
      .collection('blog_posts')
      .where('slug', '==', slug)
      .where('status', '==', 'published')
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as BlogPost;
  } catch (error) {
    logServerError('firebase/blog', `Failed to fetch post "${slug}"`, error);
    return null;
  }
}

/**
 * Fetch all published slugs (for generateStaticParams).
 */
export async function getAllBlogSlugs(): Promise<string[]> {
  try {
    const db = getAdminDb();
    const snapshot = await db
      .collection('blog_posts')
      .where('status', '==', 'published')
      .select('slug')
      .get();

    return snapshot.docs.map((doc) => doc.data().slug as string);
  } catch (error) {
    logServerError('firebase/blog', 'Failed to fetch slugs', error);
    return [];
  }
}
