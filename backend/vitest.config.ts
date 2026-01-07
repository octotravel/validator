import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    passWithNoTests: true,
    isolate: true,
    pool: 'forks',
    fileParallelism: true,
    mockReset: true,
    watch: false,
    testTimeout: 30000,
    hookTimeout: 30000,
    reporters: ['verbose'],
    include: ['**/__tests__/**/*.+(test.ts)'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.pnpm-store/**', '**/ops/**'],
    globalSetup: ['./vitestGlobalSetup.ts', './vitestGlobalTeardown.ts'],
  },
});
