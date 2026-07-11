#!/usr/bin/env node
// Every AGENTS.md gets a sibling CLAUDE.md symlink pointing at it, so Claude
// Code and other agents read the same instructions. AGENTS.md is canonical:
// edit it, never a CLAUDE.md.
//
//   node scripts/sync-claude-symlinks.mjs          # create missing links, prune stale ones
//   node scripts/sync-claude-symlinks.mjs --check  # report drift and exit 1 (CI)
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const checkMode = process.argv.includes('--check');
const problems = [];
const fixes = [];

// Tracked plus untracked-but-not-ignored files, so a brand-new AGENTS.md
// counts before it has been staged.
const gitFiles = execSync('git ls-files --cached --others --exclude-standard', {
  encoding: 'utf8',
})
  .split('\n')
  .filter(Boolean);

const agentsFiles = gitFiles.filter(f => path.basename(f) === 'AGENTS.md');
const claudeFiles = gitFiles.filter(f => path.basename(f) === 'CLAUDE.md');

const lstatOrNull = file => {
  try {
    return fs.lstatSync(file);
  } catch {
    return null;
  }
};

// Ensure each AGENTS.md has its CLAUDE.md -> AGENTS.md sibling.
for (const agents of agentsFiles) {
  const claude = path.join(path.dirname(agents), 'CLAUDE.md');
  const stat = lstatOrNull(claude);

  if (stat && !stat.isSymbolicLink()) {
    // Never overwrite a real file — a human wrote it; they must reconcile.
    problems.push(
      `${claude} is a regular file; merge its content into ${agents} and delete it`
    );
    continue;
  }
  if (stat && fs.readlinkSync(claude) === 'AGENTS.md') continue;

  if (checkMode) {
    problems.push(
      stat
        ? `${claude} points at the wrong target (should be AGENTS.md)`
        : `${claude} is missing (should symlink to AGENTS.md)`
    );
    continue;
  }
  if (stat) fs.unlinkSync(claude);
  fs.symlinkSync('AGENTS.md', claude);
  fixes.push(`linked ${claude} -> AGENTS.md`);
}

// Prune CLAUDE.md symlinks whose AGENTS.md is gone.
for (const claude of claudeFiles) {
  const stat = lstatOrNull(claude);
  if (!stat?.isSymbolicLink()) continue;
  if (fs.readlinkSync(claude) !== 'AGENTS.md') continue;
  if (fs.existsSync(path.join(path.dirname(claude), 'AGENTS.md'))) continue;

  if (checkMode) {
    problems.push(`${claude} is a stale symlink (its AGENTS.md was removed)`);
    continue;
  }
  fs.unlinkSync(claude);
  fixes.push(`pruned stale ${claude}`);
}

for (const fix of fixes) console.log(fix);
for (const problem of problems) console.error(`error: ${problem}`);
if (problems.length > 0) {
  if (checkMode) console.error('\nRun `pnpm run claude-symlinks:fix` to fix.');
  process.exit(1);
}
