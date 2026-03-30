# TS Multi-Package Starter

An opinionated template for setting up new TypeScript projects. The goal is to use fast, modern tooling, opinionated, strict configurations, and to make it as easy as possible to get new monorepo-style projects up and running quickly.

In a world of LLM-generated code, we opt for strictness and correctness with automated enforcement of our rules.

## Usage

This template makes some assumptions about project structure (e.g. it's currently specialized for client/server apps) and common libraries used (it assumes React for the client, vitest for testing, etc). When cloning this for a new project, you may wish to do the following:

1. Clone this repo
2. Edit `name`, `description`, and `author` in the root `package.json`
3. Edit the IIFE `name` in `packages/client/tsdown.config.ts` if you publish a browser build—the default `"Client"` is generic and may collide with other scripts
4. Edit `eslint.config.mjs` to customize paths to packages (currently expects `packages/server` and `packages/client`)
  - The server gets Node globals
  - The client gets browser globals and React Hooks rules.
5. **Not Using React?** Update `jsx` option in `tsconfig.base.json` and hooks-specific rules in `eslint.config.mjs`
6. **Not Using Vitest?** Update import order in `.prettierrc.cjs`
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
- Husky enforcing linting, formatting, tests, and build pre-commit

### Script Conventions

- Sub-packages own their own scripts, but each follows the same conventions
- The root package exposes the same scripts, and it will run those scripts for each child package
- When names are ambiguous, the default is "check" not "write"
  - e.g. `pnpm run lint` will print lint errors, `pnpm run lint:fix` will attempt to rewrite files
  - e.g. `pnpm run format` will print formatting errors, `pnpm run format:fix` will rewrite files
  - e.g. `pnpm run audit` will print issues, `pnpm run audit:fix` or `pnpm run audit:fix-force` will make package updates
