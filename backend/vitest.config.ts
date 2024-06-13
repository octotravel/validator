import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [],
  test: {
    isolate: true,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    fileParallelism: false,
    watch: false,
    globals: false,
    testTimeout: 30000,
    hookTimeout: 30000,
    reporters: ['verbose'],
    include: ['**/__tests__/**/*.+(test.ts)'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.pnpm-store/**', '**/ops/**'],
    setupFiles: ['./vitestSetup.ts'],
    globalSetup: ['./vitestGlobalSetup.ts', './vitestGlobalTeardown.ts'],
  },
});
