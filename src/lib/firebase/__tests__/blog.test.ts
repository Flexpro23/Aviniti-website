// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── vi.hoisted ──
// Variables defined here are available both inside vi.mock() factories
// (which are hoisted to before imports) AND in the test body.

const { mockGet } = vi.hoisted(() => {
  const mockGet = vi.fn();
  return { mockGet };
});

// ── Mock ──
// The Firestore query chain uses a fluent interface: every method returns the
// same object.  We expose `mockGet` so individual tests can control what .get()
// returns without re-wiring anything else.

vi.mock('@/lib/firebase/admin', () => {
  const mockGet = vi.fn(); // local — overridden by the hoisted one below
  const chain: Record<string, unknown> = {
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
    select: vi.fn(),
    get: mockGet,
  };
  (chain.where as ReturnType<typeof vi.fn>).mockReturnValue(chain);
  (chain.orderBy as ReturnType<typeof vi.fn>).mockReturnValue(chain);
  (chain.limit as ReturnType<typeof vi.fn>).mockReturnValue(chain);
  (chain.select as ReturnType<typeof vi.fn>).mockReturnValue(chain);
  return {
    getAdminDb: vi.fn().mockReturnValue({ collection: vi.fn().mockReturnValue(chain) }),
  };
});

// ── Subject under test ──
import { getBlogPosts, getBlogPost, getAllBlogSlugs } from '../blog';
import { getAdminDb } from '@/lib/firebase/admin';

// ── Helpers ──

const mockBlogPostData = {
  slug: 'test-post',
  status: 'published',
  publishedAt: '2025-01-15T10:00:00.000Z',
  featuredImage: '/blog/test-post.webp',
  tags: ['AI', 'Tech'],
  category: 'Technology',
  targetKeyword: 'AI apps',
  readingTime: 5,
  en: {
    title: 'Test Post',
    excerpt: 'A test post',
    content: '# Test',
    metaDescription: 'Test meta',
  },
  ar: {
    title: 'مقالة تجريبية',
    excerpt: 'مقالة اختبار',
    content: '# اختبار',
    metaDescription: 'وصف تجريبي',
  },
};

function makeDoc(id: string, data: object) {
  return { id, data: () => data };
}

/** Pull the `.get` mock off the chain that getAdminDb().collection() returns */
function getChainGet() {
  const db = getAdminDb();
  const chainRef = (db.collection as ReturnType<typeof vi.fn>).mock.results[0]?.value as {
    get: ReturnType<typeof vi.fn>;
  };
  return chainRef?.get ?? null;
}

// ── Setup ──

beforeEach(() => {
  vi.clearAllMocks();

  // Re-wire the fluent chain after clearAllMocks wiped implementations.
  const db = vi.mocked(getAdminDb).mockReturnValue({ collection: vi.fn() } as ReturnType<typeof getAdminDb>);
  const chain: Record<string, unknown> = {
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
    select: vi.fn(),
    get: vi.fn(),
  };
  (chain.where as ReturnType<typeof vi.fn>).mockReturnValue(chain);
  (chain.orderBy as ReturnType<typeof vi.fn>).mockReturnValue(chain);
  (chain.limit as ReturnType<typeof vi.fn>).mockReturnValue(chain);
  (chain.select as ReturnType<typeof vi.fn>).mockReturnValue(chain);

  vi.mocked(getAdminDb).mockReturnValue({
    collection: vi.fn().mockReturnValue(chain),
  } as ReturnType<typeof getAdminDb>);
});

/** Convenience: set what `.get()` returns for the next call */
function mockGetResolves(value: unknown) {
  const db = getAdminDb();
  const chain = (db.collection as ReturnType<typeof vi.fn>)('blog_posts');
  vi.mocked(chain.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(value);
}

function mockGetRejects(error: Error) {
  const db = getAdminDb();
  const chain = (db.collection as ReturnType<typeof vi.fn>)('blog_posts');
  vi.mocked(chain.get as ReturnType<typeof vi.fn>).mockRejectedValueOnce(error);
}

// ── Tests ──

describe('getBlogPosts', () => {
  it('returns empty array when Firestore throws', async () => {
    mockGetRejects(new Error('Firestore unavailable'));
    const result = await getBlogPosts('en');
    expect(result).toEqual([]);
  });

  it('returns English title and excerpt when locale is "en"', async () => {
    mockGetResolves({ docs: [makeDoc('doc1', mockBlogPostData)] });
    const result = await getBlogPosts('en');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Test Post');
    expect(result[0].excerpt).toBe('A test post');
  });

  it('returns Arabic title and excerpt when locale is "ar"', async () => {
    mockGetResolves({ docs: [makeDoc('doc1', mockBlogPostData)] });
    const result = await getBlogPosts('ar');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('مقالة تجريبية');
    expect(result[0].excerpt).toBe('مقالة اختبار');
  });

  it('maps all summary fields correctly', async () => {
    mockGetResolves({ docs: [makeDoc('doc1', mockBlogPostData)] });
    const result = await getBlogPosts('en');
    const post = result[0];
    expect(post.id).toBe('doc1');
    expect(post.slug).toBe('test-post');
    expect(post.publishedAt).toBe('2025-01-15T10:00:00.000Z');
    expect(post.featuredImage).toBe('/blog/test-post.webp');
    expect(post.tags).toEqual(['AI', 'Tech']);
    expect(post.category).toBe('Technology');
    expect(post.readingTime).toBe(5);
  });
});

describe('getBlogPost', () => {
  it('returns null when snapshot is empty', async () => {
    mockGetResolves({ empty: true, docs: [] });
    const result = await getBlogPost('test-post');
    expect(result).toBeNull();
  });

  it('returns full BlogPost with id when found', async () => {
    mockGetResolves({ empty: false, docs: [makeDoc('doc1', mockBlogPostData)] });
    const result = await getBlogPost('test-post');
    expect(result).not.toBeNull();
    expect(result!.id).toBe('doc1');
    expect(result!.slug).toBe('test-post');
    expect(result!.en.title).toBe('Test Post');
    expect(result!.ar.title).toBe('مقالة تجريبية');
    expect(result!.tags).toEqual(['AI', 'Tech']);
  });

  it('returns null when Firestore throws', async () => {
    mockGetRejects(new Error('Firestore error'));
    const result = await getBlogPost('test-post');
    expect(result).toBeNull();
  });
});

describe('getAllBlogSlugs', () => {
  it('returns an array of slugs from published posts', async () => {
    mockGetResolves({
      docs: [
        makeDoc('doc1', { slug: 'first-post' }),
        makeDoc('doc2', { slug: 'second-post' }),
        makeDoc('doc3', { slug: 'third-post' }),
      ],
    });
    const result = await getAllBlogSlugs();
    expect(result).toEqual(['first-post', 'second-post', 'third-post']);
  });

  it('returns empty array when Firestore throws', async () => {
    mockGetRejects(new Error('Firestore error'));
    const result = await getAllBlogSlugs();
    expect(result).toEqual([]);
  });
});
