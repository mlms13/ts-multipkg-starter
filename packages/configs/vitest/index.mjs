import { defineConfig } from 'vitest/config';

/**
 * Base Vitest configuration shared by all @my-project packages. Each package's
 * vitest.config.ts re-exports it:
 *   export { default } from '@my-project/configs/vitest';
 *
 * Authored as .mjs (not .ts) so it is importable across the package boundary at
 * runtime — Vite externalizes node_modules when loading config files.
 */
export const baseConfig = {
  test: {
    globals: false, // Explicit imports required (matches eslint config)
    environment: 'node',
    passWithNoTests: true, // Allow commits when no tests exist yet
    include: [
      'src/**/*.{test,spec}.{ts,tsx}',
      'tests/**/*.{test,spec}.{ts,tsx}',
      '__tests__/**/*.{test,spec}.{ts,tsx}',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.{test,spec}.{ts,tsx}',
        'tests/**/*',
        '__tests__/**/*',
      ],
    },
  },
};

export default defineConfig(baseConfig);
