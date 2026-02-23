import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    css: false,
    coverage: {
      provider: 'v8',
      include: [
        'src/lib/**/*.ts',
        'src/app/api/**/*.ts',
        // UI primitives and feature components under test (Priority 3)
        'src/components/ui/Badge.tsx',
        'src/components/ui/Card.tsx',
        'src/components/ui/Input.tsx',
        'src/components/ui/Accordion.tsx',
        'src/components/ui/Tabs.tsx',
        'src/components/ui/Modal.tsx',
        'src/components/ui/Select.tsx',
        'src/components/ui/Checkbox.tsx',
        'src/components/shared/SectionHeading.tsx',
        'src/components/shared/ContactCapture.tsx',
        'src/components/blog/BlogCard.tsx',
        'src/components/ai-tools/SmartNudge.tsx',
      ],
      exclude: [
        // Test files
        'src/lib/**/__tests__/**',
        'src/lib/**/index.ts',
        'src/app/api/**/__tests__/**',
        // Client-only code (requires browser APIs / window.gtag / Firebase SDK)
        'src/lib/analytics/**',
        'src/lib/utils/analytics.ts',
        'src/lib/utils/client-error-logger.ts',
        'src/lib/firebase/client.ts',
        // Static data arrays — no branching logic
        'src/lib/data/**',
        // Config / routing boilerplate
        'src/lib/i18n/**',
        'src/lib/config.ts',
        // Animation utilities (UI-only, no server logic)
        'src/lib/motion/**',
        // Firebase infrastructure — tested implicitly via API route tests
        'src/lib/firebase/admin.ts',
        'src/lib/firebase/collections.ts',
        // AI prompt builders — large string templates, no branching
        'src/lib/gemini/prompts.ts',
        'src/lib/gemini/prompts/**',
        // Zod schema definitions — config-like, no executable branching
        'src/lib/gemini/schemas.ts',
        // Pure constants — no executable branching to measure
        'src/lib/utils/image.ts',
      ],
      thresholds: {
        lines: 70,
        functions: 70,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
