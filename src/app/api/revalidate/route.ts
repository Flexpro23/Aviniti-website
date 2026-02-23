import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { z } from 'zod';
import { checkRateLimit, getClientIP, setRateLimitHeaders } from '@/lib/utils/rate-limit';
import { hashIP } from '@/lib/utils/api-helpers';
import { logServerError } from '@/lib/firebase/error-logging';

const revalidateSchema = z.object({
  secret: z.string().min(1),
  slug: z.string().max(100).regex(/^[a-z0-9\-]+$/).optional(),
  type: z.enum(['blog']),
});

/** Rate limit: 10 revalidate requests per IP per hour */
const RATE_LIMIT = 10;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;

/**
 * On-demand revalidation webhook.
 * Called by the cloud function after publishing a new blog post.
 *
 * Usage: POST /api/revalidate
 * Body: { secret: string, slug?: string, type: 'blog' }
 *
 * Set REVALIDATE_SECRET in environment variables.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitKey = `revalidate:${hashIP(clientIP)}`;
    const rateLimitResult = await checkRateLimit(rateLimitKey, RATE_LIMIT, RATE_LIMIT_WINDOW);

    const headers = new Headers();
    setRateLimitHeaders(headers, rateLimitResult);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers }
      );
    }

    // 2. Parse and validate body
    const body = await request.json();
    const parseResult = revalidateSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { secret, slug, type } = parseResult.data;

    // 3. Timing-safe secret comparison
    const expectedSecret = process.env.REVALIDATE_SECRET;
    if (!expectedSecret) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    const secretBuf = Buffer.from(secret, 'utf8');
    const expectedBuf = Buffer.from(expectedSecret, 'utf8');
    if (secretBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(secretBuf, expectedBuf)) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    if (type === 'blog') {
      revalidatePath('/en/blog');
      revalidatePath('/ar/blog');

      if (slug) {
        revalidatePath(`/en/blog/${slug}`);
        revalidatePath(`/ar/blog/${slug}`);
      }

      const response = NextResponse.json({
        revalidated: true,
        paths: ['/en/blog', '/ar/blog', slug ? `/en/blog/${slug}` : null].filter(Boolean),
        timestamp: new Date().toISOString(),
      });
      headers.forEach((v, k) => response.headers.set(k, v));
      return response;
    }

    return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
  } catch (error) {
    logServerError('api/revalidate', 'Revalidation error', error);
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
}
