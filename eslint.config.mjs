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

const baseParser = {
  parser: tsparser,
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
};

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
  '@typescript-eslint/strict-boolean-expressions': 'warn',
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
  prettier: prettierConfig,
};

export default [
  // Server rules
  {
    files: ['packages/server/src/**/*.{ts,tsx}'],
    languageOptions: {
      ...baseParser,
      parserOptions: {
        ...baseParser.parserOptions,
        project: './packages/server/tsconfig.json',
        tsconfigRootDir: import.meta.dirname || process.cwd(),
      },
      globals: serverGlobals,
    },
    plugins: {
      ...basePlugins,
    },
    rules: {
      ...baseRules,
    },
  },

  // Library rules (isomorphic - no globals; add by hand if needed)
  {
    files: ['packages/library/src/**/*.{ts,tsx}'],
    languageOptions: {
      ...baseParser,
      parserOptions: {
        ...baseParser.parserOptions,
        project: './packages/library/tsconfig.json',
        tsconfigRootDir: import.meta.dirname || process.cwd(),
      },
    },
    plugins: {
      ...basePlugins,
    },
    rules: {
      ...baseRules,
    },
  },

  // Client library rules (browser globals, React Hooks)
  {
    files: ['packages/client/src/**/*.{ts,tsx}'],
    languageOptions: {
      ...baseParser,
      parserOptions: {
        ...baseParser.parserOptions,
        project: './packages/client/tsconfig.json',
        tsconfigRootDir: import.meta.dirname || process.cwd(),
      },
      globals: clientGlobals,
    },
    plugins: {
      ...basePlugins,
      'react-hooks': reactHooks,
    },
    rules: {
      ...baseRules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // Test files (relaxed console/any usage, no globals)
  {
    files: [
      'packages/*/src/**/*.{test,spec}.{ts,tsx}',
      'packages/*/tests/**/*.{ts,tsx}',
      'packages/*/__tests__/**/*.{ts,tsx}',
    ],
    languageOptions: {
      ...baseParser,
      parserOptions: {
        ...baseParser.parserOptions,
        // Test files will use their package's tsconfig
        // Note: TypeScript ESLint parser doesn't support globs well, so we
        // use a more permissive approach - each package's tsconfig will be used
        // when linting files from that package
        project: [
          './packages/server/tsconfig.json',
          './packages/client/tsconfig.json',
          './packages/library/tsconfig.json',
        ],
        tsconfigRootDir: import.meta.dirname || process.cwd(),
      },
      // No globals - test helpers like describe, expect, etc. must be imported
    },
    plugins: {
      ...basePlugins,
    },
    rules: {
      ...baseRules,
      '@typescript-eslint/no-non-null-assertion': 'off', // Allowed in tests
      'no-console': 'off', // Console allowed in tests
      'max-lines-per-function': 'off', // Disabled for tests - describe blocks can be long
    },
  },
];
