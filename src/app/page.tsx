import { routing } from '@/lib/i18n/routing';
import { redirect } from 'next/navigation';

// Redirect root to default locale — middleware handles locale detection
// from Accept-Language header and cookies for returning users.
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
