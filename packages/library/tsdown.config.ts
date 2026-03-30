import { defineConfig } from 'tsdown';

import { baseConfig } from '../../tsdown.base.config.ts';

export default defineConfig({
  ...baseConfig,
  entry: ['src/index.ts'],
  format: ['esm'],
  // Isomorphic: no platform-specific code, works in both Node and browser
});
