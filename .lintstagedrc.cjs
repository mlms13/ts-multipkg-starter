//==============================================================================
// lint-staged runs eslint --fix and prettier --write on staged files only.
// Typecheck, build, and test for affected packages are handled by Turborepo
// directly in the pre-commit hook via --filter='...[HEAD]'.
//==============================================================================

module.exports = {
  // TypeScript and TSX files in the server package
  'packages/server/{src,tests,__tests__}/**/*.{ts,tsx}': [
    'eslint --fix',
    'prettier --write',
  ],

  // TypeScript and TSX files in the client package
  'packages/client/{src,tests,__tests__}/**/*.{ts,tsx}': [
    'eslint --fix',
    'prettier --write',
  ],

  // TypeScript and TSX files in the library package
  'packages/library/{src,tests,__tests__}/**/*.{ts,tsx}': [
    'eslint --fix',
    'prettier --write',
  ],

  // JSON, Markdown, and other files - format only
  'packages/*/src/**/*.{json,md}': ['prettier --write'],
  '*.{json,md}': ['prettier --write'],

  // Root-level config files
  '*.{js,mjs,cjs,ts,json}': ['prettier --write'],
};
