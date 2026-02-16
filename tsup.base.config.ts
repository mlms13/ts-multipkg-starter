import type { Options } from 'tsup';

/**
 * Shared base configuration for tsup builds across packages
 */
export const baseTsupConfig: Options = {
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  splitting: false,
  // Common external dependencies that shouldn't be bundled
  external: [],
  target: 'es2022',
  minify: false,
  format: ['esm'],
};
