import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './src/lib/i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Allowed origins for API routes
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SITE_URL,
  'https://www.aviniti.app',
  'https://aviniti.app',
].filter(Boolean) as string[];

// In development, also allow localhost
if (process.env.NODE_ENV === 'development') {
  ALLOWED_ORIGINS.push('http://localhost:3000');
  ALLOWED_ORIGINS.push('http://localhost:3001');
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // CORS protection for API routes
  if (pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');

    // Allow requests with no origin (server-to-server, same-origin navigation)
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return new NextResponse(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // For preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': origin || '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Let API routes handle the request, but add CORS headers
    const response = NextResponse.next();
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }
    return response;
  }

  // For non-API routes, use the intl middleware
  const response = intlMiddleware(request);

  // Inject geo-country cookie from Vercel's geo header (defaults to JO for local dev)
  const country = request.headers.get('x-vercel-ip-country') || 'JO';
  response.cookies.set('geo-country', country, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 86400,
  });

  return response;
}

export const config = {
  matcher: [
    // Root path (redirect to default locale)
    '/',
    // API routes (for CORS protection)
    '/api/:path*',
    // Match all locale pathnames except:
    // - Next.js internals (/_next/...)
    // - Static files with extensions (.ico, .svg, .png, etc.)
    '/(en|ar)/:path*',
    '/((?!api|_next|.*\\..*).*)',
  ],
};
