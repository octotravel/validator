import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: {
    target: 'ESNext',
  },
  cacheDir: '.cache/vitest',
  test: {
    passWithNoTests: true,
    isolate: true,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: false,
        isolate: true,
      },
    },
    fileParallelism: true,
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
