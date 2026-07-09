//==============================================================================
// lint-staged runs eslint --fix and prettier --write on staged files only.
// Typecheck, build, and test for affected packages are handled by Turborepo
// directly in the pre-commit hook via --filter='...[HEAD]'.
//==============================================================================

module.exports = {
  // TypeScript and TSX files in any workspace package
  'packages/*/{src,tests,__tests__}/**/*.{ts,tsx}': [
    'eslint --fix',
    'prettier --write',
  ],

  // CSS, JSON, Markdown, and other files - format only
  'packages/*/src/**/*.{css,json,md}': ['prettier --write'],
  '*.{json,md}': ['prettier --write'],

  // Root-level TS config files are covered by the root eslint.config.mjs
  '*.{ts,mts}': ['eslint --fix', 'prettier --write'],

  // Other root-level config files
  '*.{js,mjs,cjs,json}': ['prettier --write'],
};
