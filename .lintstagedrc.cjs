const { resolve } = require('path');

//==============================================================================
// Why this config?
//
// lint-staged attempts to run tools on only changed files by passing those
// filenames as arguments to the tools. tsc doesn't support the combination of
// filename arguments and the --project flag. So instead we use the tsc-files
// package in combination with this more complex lint-staged config to run tsc
// on only the changed files, respecting each package's tsconfig.json file.
//
// see: https://github.com/microsoft/TypeScript/issues/27379
//
//==============================================================================

function createTscFilesCommand(packagePath, filenames) {
  // Convert absolute paths to relative paths from the package directory
  const packageAbsPath = resolve(packagePath);
  const relativeFiles = filenames
    .map(f => {
      const absPath = resolve(f);
      // Get relative path from package directory
      return absPath.replace(packageAbsPath + '/', '');
    })
    .join(' ');
  return `cd ${packagePath} && tsc-files --noEmit ${relativeFiles}`;
}

module.exports = {
  // TypeScript and TSX files in the server package
  'packages/server/{src,tests,__tests__}/**/*.{ts,tsx}': [
    'eslint --fix',
    'prettier --write',
    filenames => createTscFilesCommand('packages/server', filenames),
  ],

  // TypeScript and TSX files in the client package
  'packages/client/{src,tests,__tests__}/**/*.{ts,tsx}': [
    'eslint --fix',
    'prettier --write',
    filenames => createTscFilesCommand('packages/client', filenames),
  ],

  // TypeScript and TSX files in the library package
  'packages/library/{src,tests,__tests__}/**/*.{ts,tsx}': [
    'eslint --fix',
    'prettier --write',
    filenames => createTscFilesCommand('packages/client', filenames),
  ],

  // JSON, Markdown, and other files - just format with Prettier
  'packages/*/src/**/*.{json,md}': ['prettier --write'],
  '*.{json,md}': ['prettier --write'],

  // Root-level config files
  '*.{js,mjs,cjs,ts,json}': ['prettier --write'],
};
