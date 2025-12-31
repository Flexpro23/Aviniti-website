'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirect from old /ai-lab to new /idea-lab
export default function AILabRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/idea-lab');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-off-white">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-bronze-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-slate-blue-600">Redirecting to Idea Lab...</p>
      </div>
    </div>
  );
}
