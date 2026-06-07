import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = import.meta.dirname || process.cwd();
const packagesDir = join(rootDir, 'packages');

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
  prettier: prettierConfig,
};

// Presets keyed by projectType. Adding a new type means adding an entry here.
const presets = {
  backend: {
    globals: serverGlobals,
    plugins: basePlugins,
    rules: baseRules,
  },
  frontend: {
    globals: clientGlobals,
    plugins: { ...basePlugins, 'react-hooks': reactHooks },
    rules: {
      ...baseRules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  // Isomorphic packages get no globals — add by hand in source if needed.
  isomorphic: {
    plugins: basePlugins,
    rules: baseRules,
  },
};

// Discover packages and their declared projectType. Single source of truth.
const workspacePackages = readdirSync(packagesDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => {
    const pkg = JSON.parse(
      readFileSync(join(packagesDir, d.name, 'package.json'), 'utf-8')
    );
    if (!pkg.projectType) {
      throw new Error(
        `packages/${d.name}/package.json is missing "projectType". ` +
          `Set one of: ${Object.keys(presets).join(', ')}.`
      );
    }
    if (!presets[pkg.projectType]) {
      throw new Error(
        `Unknown projectType "${pkg.projectType}" in packages/${d.name}/package.json. ` +
          `Known: ${Object.keys(presets).join(', ')}.`
      );
    }
    return { dir: d.name, projectType: pkg.projectType };
  });

const blockForPackage = ({ dir, projectType }) => {
  const preset = presets[projectType];
  return {
    files: [`packages/${dir}/src/**/*.{ts,tsx}`],
    languageOptions: {
      ...baseParser,
      parserOptions: {
        ...baseParser.parserOptions,
        project: `./packages/${dir}/tsconfig.json`,
        tsconfigRootDir: rootDir,
      },
      ...(preset.globals && { globals: preset.globals }),
    },
    plugins: preset.plugins,
    rules: preset.rules,
  };
};

export default [
  ...workspacePackages.map(blockForPackage),

  // Test files (relaxed console/any usage, no globals). Project list is
  // auto-generated from discovered packages.
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
        project: workspacePackages.map(
          p => `./packages/${p.dir}/tsconfig.json`
        ),
        tsconfigRootDir: rootDir,
      },
      // No globals - test helpers like describe, expect, etc. must be imported
    },
    plugins: basePlugins,
    rules: {
      ...baseRules,
      '@typescript-eslint/no-non-null-assertion': 'off', // Allowed in tests
      'no-console': 'off', // Console allowed in tests
      'max-lines-per-function': 'off', // Disabled for tests - describe blocks can be long
    },
  },
];
