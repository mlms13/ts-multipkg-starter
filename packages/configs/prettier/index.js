// Shared Prettier config for @my-project packages. Referenced from each
// package's "prettier": "@my-project/configs/prettier" field (the repo root
// uses it too).
export default {
  // Basic formatting
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,

  // Bracket and spacing
  bracketSpacing: true,
  arrowParens: 'avoid',

  // Line endings
  endOfLine: 'lf',

  // Import sorting
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: ['^vitest$', '^@?\\w', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
