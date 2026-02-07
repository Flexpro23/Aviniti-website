import createMiddleware from 'next-intl/middleware';
import { routing } from './src/lib/i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Root path (redirect to default locale)
    '/',
    // Match all locale pathnames except:
    // - API routes (/api/...)
    // - Next.js internals (/_next/...)
    // - Static files with extensions (.ico, .svg, .png, etc.)
    '/(en|ar)/:path*',
    '/((?!api|_next|.*\\..*).*)',
  ],
};
