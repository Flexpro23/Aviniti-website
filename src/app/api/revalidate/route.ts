import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

/**
 * On-demand revalidation webhook.
 * Called by the cloud function after publishing a new blog post.
 * 
 * Usage: POST /api/revalidate
 * Body: { secret: string, slug: string, type: 'blog' }
 * 
 * Set REVALIDATE_SECRET in environment variables.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, slug, type } = body;

    // Validate secret
    const expectedSecret = process.env.REVALIDATE_SECRET;
    if (!expectedSecret || secret !== expectedSecret) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    if (type === 'blog') {
      // Revalidate blog listing for both locales
      revalidatePath('/en/blog');
      revalidatePath('/ar/blog');

      // Revalidate the specific post if slug provided
      if (slug) {
        revalidatePath(`/en/blog/${slug}`);
        revalidatePath(`/ar/blog/${slug}`);
      }

      return NextResponse.json({
        revalidated: true,
        paths: ['/en/blog', '/ar/blog', slug ? `/en/blog/${slug}` : null].filter(Boolean),
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
  } catch (error) {
    console.error('[Revalidate] Error:', error);
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
}
