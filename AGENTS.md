# Agent instructions

A pnpm + Turborepo TypeScript monorepo template. Feature packages live in
`packages/`; shared eslint/prettier/tsconfig/vitest config lives in
`packages/configs` (`@my-project/configs`).

## Working in this repo

- Run everything from the repo root via `pnpm run <script>`. If a check you
  need has no script, flag the gap instead of improvising.
- `pnpm run check` is the full gate (symlinks, typecheck, lint, test, build,
  format) — exactly what CI runs. `pnpm run check:affected` covers only
  packages changed since the last commit.
- Shared dependency versions live in the catalog in `pnpm-workspace.yaml`.
  Reference them from package.json files with `catalog:`; update versions in
  the catalog, not in individual packages.
- Each package declares its lint environment explicitly by re-exporting a
  preset (`server` | `client` | `isomorphic`) from `@my-project/configs/eslint`
  in its own `eslint.config.mjs`. Prefer explicit configuration over
  auto-discovery.
- `CLAUDE.md` files are symlinks to sibling `AGENTS.md` files, kept in sync by
  `pnpm run claude-symlinks:fix` and verified in CI. Edit `AGENTS.md`; never
  create a `CLAUDE.md` by hand.
