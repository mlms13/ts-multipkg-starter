# TS Multi-Package Starter

An opinionated template for setting up new TypeScript projects. The goal is to use fast, modern tooling, opinionated, strict configurations, and to make it as easy as possible to get new monorepo-style projects up and running quickly.

In a world of LLM-generated code, we opt for strictness and correctness with automated enforcement of our rules.

## Usage

This template makes some assumptions about project structure (e.g. it's currently specialized for client/server apps) and common libraries used (it assumes React for the client, vitest for testing, etc). When cloning this for a new project, you may wish to do the following:

1. Clone this repo
2. Edit `name`, `description`, and `author` in the root `package.json`
3. Edit the IIFE `name` in `packages/client/tsdown.config.ts` if you publish a browser build—the default `"Client"` is generic and may collide with other scripts
4. Shared configs live in `packages/configs` (`@my-project/configs`). Each package's `eslint.config.mjs` imports the preset matching its runtime environment (`server` | `client` | `isomorphic`):
   - `server` gets Node globals
   - `client` gets browser globals and React Hooks rules
   - `isomorphic` gets neither; customize the presets in `packages/configs/eslint/index.mjs`
5. **Not Using React?** Update the `jsx` option in `packages/configs/tsconfig/base.json` and the hooks rules in `packages/configs/eslint/index.mjs`
6. **Not Using Vitest?** Update import order in `packages/configs/prettier/index.js`
7. **Not Using Fastify/Dotenv?** Update dependencies in `packages/server/package.json`
8. Replace this README with your own content

## Tooling and Opinions

### TypeScript Config

- strict settings related to soundness and correctness
- `tsdown` everywhere for building (both client and server)

### Common Libraries

- `vitest` configured to find all the right tests

### Monorepo Tooling

- pnpm workspaces for package management, with a shared version catalog in `pnpm-workspace.yaml`
- Turborepo + config

### Code Quality

- `eslint` with most TS defaults, plus extra strictness
- `prettier` with trailing commas, semicolons, and import sorting
- Husky running lint-staged and affected-package typechecks pre-commit; tests and build are deliberately left to CI so failing-tests-first (TDD) work can be committed
- `pnpm run check` runs the full gate (symlinks, typecheck, lint, test, build, format) — CI runs exactly this script

### Recommended Agent Skills

The template ships only repo-specific skills (see `.agents/skills/`). For general engineering-workflow skills — PRD writing, ADR and domain-glossary upkeep, TDD — we recommend installing from [mattpocock/skills](https://github.com/mattpocock/skills) per project rather than bundling them here. Ones that have proven useful alongside this template: `grill-with-docs`, `to-prd`, `improve-codebase-architecture`, and `tdd`. They bring their own document conventions (a `CONTEXT.md` glossary, numbered ADRs under `docs/adr/`) — adopt those in the projects that want them.

### Script Conventions

- Sub-packages own their own scripts, but each follows the same conventions
- The root package exposes the same scripts, and it will run those scripts for each child package
- When names are ambiguous, the default is "check" not "write"
  - e.g. `pnpm run lint` will print lint errors, `pnpm run lint:fix` will attempt to rewrite files
  - e.g. `pnpm run format` will print formatting errors, `pnpm run format:fix` will rewrite files
  - e.g. `pnpm run audit` will print issues, `pnpm run audit:fix` or `pnpm run audit:fix-force` will make package updates
