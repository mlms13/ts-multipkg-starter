import { defineConfig } from 'tsup';

import { baseTsupConfig } from '../../tsup.base.config';

export default defineConfig([
  // Main server entry point
  {
    ...baseTsupConfig,
    entry: ['src/index.ts'],
    format: ['esm'],
    // tsup externalizes node_modules by default, which is what we want for server packages
  },
]);
