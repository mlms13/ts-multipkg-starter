import { defineConfig } from 'tsdown';

import { baseConfig } from '../../tsdown.base.config.ts';

export default defineConfig({
  ...baseConfig,
  entry: ['src/index.ts'],
  format: ['iife'],
  platform: 'browser',
  dts: false, // No types for the browser build
  clean: false, // Don't clean on second build
  deps: {
    // tsdown externalizes dependencies by default, but IIFE builds need
    // everything inlined since there's no module loader at runtime. This only
    // affects packages that are actually imported.
    alwaysBundle: [/@my-project\/.*/],
  },
  outputOptions: {
    name: 'Client',
    entryFileNames: '[name].browser.js',
  },
});
