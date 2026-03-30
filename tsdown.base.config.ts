import type { UserConfig } from 'tsdown';

/**
 * Shared base configuration for tsdown builds across packages
 */
export const baseConfig: UserConfig = {
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  target: 'es2022',
  minify: false,
  format: ['esm'],
};
