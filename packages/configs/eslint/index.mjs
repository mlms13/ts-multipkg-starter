// Shared ESLint flat-config presets for @my-project packages.
//
// Each package owns a tiny eslint.config.mjs that imports the preset matching
// its runtime environment and passes its own directory (to anchor typed
// linting):
//   import { server } from '@my-project/configs/eslint';
//   export default server(import.meta.dirname);
//
// Presets: server (Node globals), client (browser globals + React Hooks
// rules), isomorphic (no globals — import what you need in source).
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

// Node.js globals for server code (process, Buffer, __dirname, etc.)
const serverGlobals = Object.fromEntries(
  Object.keys(globals.node).map(key => [key, 'readonly'])
);

// Browser globals for client code (window, document, fetch, etc.)
const clientGlobals = Object.fromEntries(
  Object.keys(globals.browser).map(key => [key, 'readonly'])
);

const baseRules = {
  ...js.configs.recommended.rules,
  ...tseslint.configs.recommended.rules,
  ...prettierConfig.rules,

  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
    },
  ],

  // TypeScript-specific rules
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/prefer-readonly': 'error',
  '@typescript-eslint/no-unnecessary-type-assertion': 'error',
  '@typescript-eslint/array-type': ['error', { default: 'generic' }],

  // Async safety rules
  '@typescript-eslint/no-floating-promises': 'error',
  '@typescript-eslint/await-thenable': 'error',
  '@typescript-eslint/no-misused-promises': 'error',

  // General rules
  '@typescript-eslint/prefer-nullish-coalescing': 'error',
  '@typescript-eslint/prefer-optional-chain': 'error',
  '@typescript-eslint/strict-boolean-expressions': 'error',
  'no-implicit-coercion': ['error', { boolean: true }],
  '@typescript-eslint/no-unnecessary-condition': 'error',
  complexity: ['warn', 15],
  'max-depth': ['warn', 6],
  'max-lines-per-function': ['warn', 200],
  'max-params': ['warn', 6],
  'sort-imports': 'off', // handled by prettier
};

// Common plugins
const basePlugins = {
  '@typescript-eslint': tseslint,
};

// Build the flat config for one package. File globs resolve relative to the
// package's own eslint.config.mjs; `packageDir` anchors ./tsconfig.json for
// typed linting.
function createPreset(
  packageDir,
  { globals: presetGlobals, plugins: presetPlugins, rules: presetRules } = {}
) {
  const languageOptions = {
    parser: tsparser,
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      project: './tsconfig.json',
      tsconfigRootDir: packageDir,
    },
  };

  return [
    {
      files: ['src/**/*.{ts,tsx}'],
      languageOptions: {
        ...languageOptions,
        ...(presetGlobals && { globals: presetGlobals }),
      },
      plugins: { ...basePlugins, ...presetPlugins },
      rules: { ...baseRules, ...presetRules },
    },

    // Test files (relaxed console/any usage, no globals)
    {
      files: [
        'src/**/*.{test,spec}.{ts,tsx}',
        'tests/**/*.{ts,tsx}',
        '__tests__/**/*.{ts,tsx}',
      ],
      languageOptions,
      plugins: basePlugins,
      rules: {
        ...baseRules,
        '@typescript-eslint/no-non-null-assertion': 'off', // Allowed in tests
        'no-console': 'off', // Console allowed in tests
        'max-lines-per-function': 'off', // Disabled for tests - describe blocks can be long
      },
    },
  ];
}

export const server = packageDir =>
  createPreset(packageDir, { globals: serverGlobals });

export const client = packageDir =>
  createPreset(packageDir, {
    globals: clientGlobals,
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  });

// No globals... add by hand in source if needed
export const isomorphic = packageDir => createPreset(packageDir);
