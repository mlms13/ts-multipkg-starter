import { defineConfig } from 'tsup';

import { baseTsupConfig } from '../../tsup.base.config';

export default defineConfig([
  // Browser build (IIFE)
  {
    ...baseTsupConfig,
    entry: ['src/index.ts'],
    format: ['iife'],
    dts: false, // No types for browser build
    clean: false, // Don't clean on second build
    external: [],
    globalName: 'Client',
    outExtension() {
      return {
        js: '.browser.js',
      };
    },
    esbuildOptions(options) {
      options.platform = 'browser';
    },
  },
]);
