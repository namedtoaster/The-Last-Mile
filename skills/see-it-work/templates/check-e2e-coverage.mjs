#!/usr/bin/env node
/**
 * Copy to scripts/check-e2e-coverage.mjs and run it from the project's check
 * command. Read only. Fails when a route file has no smoke case, a case points at
 * a missing file, a screen anchor (testID="screen-<id>") is not in the source, or
 * an exemption is stale. Set ROUTES_DIR if your routes live in src/app.
 */
import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SMOKE_CASES, NOT_SCREENS } from '../e2e/smoke/manifest.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const ROUTES_DIR = 'app';
// Files outside the routes folder that render a screen's anchor, if any.
const EXTRA_ANCHOR_FILES = [];

function routeFiles(dir = join(ROOT, ROUTES_DIR), out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) routeFiles(full, out);
    else if (/\.(tsx|ts)$/.test(name)) out.push(relative(ROOT, full));
  }
  return out;
}

const routes = routeFiles().sort();
const covered = new Set(SMOKE_CASES.map((c) => c.file));
const problems = [];

for (const r of routes) {
  if (!covered.has(r) && !(r in NOT_SCREENS)) {
    problems.push(`uncovered: ${r}. Add a case to e2e/smoke/manifest.mjs, or add it to NOT_SCREENS with a reason.`);
  }
}
for (const c of SMOKE_CASES) {
  if (!existsSync(join(ROOT, c.file))) problems.push(`stale case: ${c.id} points at ${c.file}, which is gone.`);
}
const source = [...routes, ...EXTRA_ANCHOR_FILES]
  .filter((f) => existsSync(join(ROOT, f)))
  .map((f) => readFileSync(join(ROOT, f), 'utf8'))
  .join('\n');
for (const c of SMOKE_CASES) {
  if (!source.includes(`testID="screen-${c.id}"`)) {
    problems.push(`missing anchor: add testID="screen-${c.id}" to the root of ${c.file}.`);
  }
}
for (const f of Object.keys(NOT_SCREENS)) {
  if (!existsSync(join(ROOT, f))) problems.push(`stale exemption: ${f} is gone. Remove it from NOT_SCREENS.`);
}

console.log(`Smoke coverage: ${SMOKE_CASES.length} case(s), ${routes.length} route file(s).`);
if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log('All routes covered.');
