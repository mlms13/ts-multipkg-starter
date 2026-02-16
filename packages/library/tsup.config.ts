import { defineConfig } from 'tsup';

import { baseTsupConfig } from '../../tsup.base.config';

export default defineConfig({
  ...baseTsupConfig,
  entry: ['src/index.ts'],
  format: ['esm'],
  // Isomorphic: no platform-specific code, works in both Node and browser
});
