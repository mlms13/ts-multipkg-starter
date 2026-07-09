---
name: remove-a-package
description: Remove a workspace package, cleaning up root scripts, the workspace catalog, and orphaned dependencies. Use when slimming the template — e.g. dropping packages that aren't useful for the new project being initialized.
---

# Remove a Package

Few edits are needed when a package is removed: `pnpm-workspace.yaml` lists
`packages/*`, `.lintstagedrc.cjs` matches on `packages/*` globs, and each
package carries its own configs, which are deleted along with the directory. The
work that remains is the cleanup judgment below.

## Pre-flight: check for dependents

If the user didn't name a package, `ls packages/` and ask. Then:

```bash
PKG=<dir-name>
WSNAME=$(node -p "require('./packages/$PKG/package.json').name")
grep -rln "$WSNAME" packages --include="package.json" --include="*.ts" --include="*.tsx" | grep -v "packages/$PKG/"
```

If anything matches, STOP and tell the user. A package that other packages
depend on can't be removed in isolation.

## Steps

1. `rm -rf packages/$PKG`
2. Root `package.json`: remove scripts that target the package. Grep for `$PKG`
   and `$WSNAME`; typical patterns are `start:$PKG` and `--filter $WSNAME`.
3. Prune orphaned dependencies — follow the policy below.
4. `README.md`: grep for `$PKG` and `$WSNAME`; drop what no longer applies.
5. `pnpm install`
6. Verify: `pnpm run lint && pnpm run typecheck && pnpm run build && pnpm test`;
   Fix anything broken before reporting done.

## Dependency pruning policy

Candidates for removal: entries in the `pnpm-workspace.yaml` catalog, root
`devDependencies`, and `packages/configs/package.json` dependencies that nothing
references anymore.

**Keep deps imported by a shared config, even if no package seems to use it.**
`packages/configs/eslint/index.mjs` unconditionally imports
`eslint-plugin-react-hooks` and `globals` at module top level — pruning either
one breaks linting for every remaining package, even if no frontend package is
left. Check the imports in `packages/configs/` before removing anything they
might load.

For every other candidate, keep it if any surviving file still references it:

```bash
grep -rn "\"<dep>\"" packages/*/package.json package.json .lintstagedrc.cjs
```

Default to keeping the presets in `packages/configs/eslint/index.mjs` — an
unused preset costs nothing and a future package may want it. Only strip a
preset (plus its now-unused imports and deps) if the user explicitly asks to
drop support for that package type.

## Done

Report: what was deleted, which scripts / catalog entries / deps were pruned,
and that verification passed (or what failed and why).
