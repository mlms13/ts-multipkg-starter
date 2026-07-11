# Template Changelog

Notable changes to this template, for the benefit of projects that started
from it. Some entries originated in downstream forks.

## 2026-07

### Added

- **Single `check` gate** — `pnpm run check` runs the full pipeline, and CI
  runs exactly that one script, so local and CI can't drift. `check:affected`
  and `typecheck:affected` cover only packages changed since the last commit.
- **Dependabot** — weekly npm + GitHub Actions updates; minor/patch bumps
  grouped into one PR, majors individual.
- **Security audit workflow** — audits on push, PR, and a daily cron, failing
  on high-severity advisories. If copying an existing version, check that it
  _can_ fail — one in the wild suppresses every error.
- **AGENTS.md convention** — AGENTS.md is the canonical agent-instruction
  file, CLAUDE.md a symlink to it, repeatable in any directory. A sync script
  creates and repairs the links, and `check` enforces them.
- **Root ESLint coverage** — repo-root TS config files are now linted (they
  never were). Per-package configs remain authoritative for package code.
- **LICENSE file** (MIT) — previously declared but never shipped.
- **Root package.json hardening** — the workspace root is now private
  (no longer publishable by accident) and declares a minimum Node version.
- **README: recommended agent skills** — points at the
  [mattpocock/skills](https://github.com/mattpocock/skills) collection rather
  than bundling skills into the template.

### Changed

- **ESLint presets auto-locate tsconfigs** — typescript-eslint's
  `projectService` replaces manual per-package anchoring, so each package's
  ESLint config shrinks to a bare re-export of its preset.
- **Pre-commit is lint + typecheck only** — tests and build moved to CI, so
  failing-tests-first (TDD) work can still be committed. The guard for a
  repo's first commit is retained; some downstream hooks lost it and fail on
  initial commit.
- **`build:watch` is graph-aware** — downstream packages rebuild when
  upstream output changes. The syntax is `turbo watch build`;
  `turbo run build --watch` doesn't exist.
- **Node 20 → 24** — CI follows `.nvmrc` automatically.
- **pnpm 10 → 11** — the build-script allowlist moved into the workspace
  file, and pnpm's supply-chain release-age delay is active (see the comments
  there). Gotcha: pnpm 11 crashes with a cryptic error on Node 20 — upgrade
  Node first.
- **Catalog refresh** — notable majors: eslint 10, lint-staged 17.
  TypeScript stays deliberately pinned to 6.x: the TS 7 native compiler
  currently breaks typescript-eslint, taking lint down with it.
- **GitHub Actions bumped** to current majors; Dependabot keeps them current
  from here.
- **Markdown is prettier-formatted** — no longer prettierignored (gitignored
  files stay untouched).
- **Ignore-file cleanup** — build caches and local agent settings added to
  `.prettierignore`; redundant debug-log gitignore patterns consolidated.
- **Vitest excludes test helpers** — files under `tests/helpers/` are never
  collected as test entry points.
- **Root typecheck covers `.mts` files**, not just `.ts`.
- **lint-staged** — CSS files are now format-checked, and root TS config
  files get linted on commit.

### Fixed

- **Package tsconfigs slimmed to real overrides** — options that restated
  base-config values are gone, and JSX support moved from the shared base to
  the client (the one package that could ever use it).
  This also removes a stray `noEmit: false` in library/client, under which a
  bare `tsc` run would have emitted test files into `dist/`.
- **`audit:fix` scripts actually fix** — they passed `fix` as an argument
  instead of the `--fix` flag and silently did nothing. Worth grepping for.
- **README nested-list indentation** — 2-space indents under an ordered list
  aren't nesting in CommonMark; the bullets rendered as a separate list.
- **`remove-a-package` skill committed** — it was untracked, and rewritten
  around the actual judgment calls (dependents pre-flight, what to prune vs
  keep).
