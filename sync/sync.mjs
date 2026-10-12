#!/usr/bin/env node
/**
 * Copies The Last Mile's skills into this project's .claude/skills/ folder, so
 * every session reads them as project skills: cloud sessions on the phone or web
 * (which do not load plugins) and the desktop alike.
 *
 * What it does, and nothing else:
 *   - reads .claude/last-mile/config.json: the source repo, the branch, and
 *     keepLocal, the skills this project keeps its own version of
 *   - clones the source repo into a temporary folder (or uses the path you pass)
 *   - for each skill in the source's skills/ folder, replaces .claude/skills/<name>
 *     with a fresh copy, except skills in keepLocal
 *   - never overwrites a skill this script did not put there; it warns instead
 *   - removes skills it synced before that the source no longer has
 *   - writes .claude/last-mile/synced.json: which skills came from where
 *
 * It never commits, pushes or touches anything outside .claude/.
 *
 * Run: node .claude/last-mile/sync.mjs [path to a local clone of the source]
 */

import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SKILLS = join(HERE, '..', 'skills');
const CONFIG = join(HERE, 'config.json');
const MANIFEST = join(HERE, 'synced.json');

const config = JSON.parse(readFileSync(CONFIG, 'utf8'));
const keepLocal = new Set(config.keepLocal ?? []);
const previous = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : { skills: [] };
const previouslySynced = new Set(previous.skills);

let source = process.argv[2];
let cleanup = null;
if (!source) {
  source = mkdtempSync(join(tmpdir(), 'last-mile-'));
  cleanup = source;
  execFileSync('git', ['clone', '--quiet', '--branch', config.ref ?? 'main', `https://github.com/${config.source}.git`, source], {
    stdio: 'inherit',
  });
}

try {
  const upstream = readdirSync(join(source, 'skills')).filter((name) => existsSync(join(source, 'skills', name, 'SKILL.md')));
  const synced = [];
  const report = [];

  for (const name of upstream) {
    const target = join(SKILLS, name);
    if (keepLocal.has(name)) {
      report.push(`kept local  ${name}`);
      continue;
    }
    if (existsSync(target) && !previouslySynced.has(name)) {
      report.push(`SKIPPED     ${name}: this project already has its own skill with that name. Add it to keepLocal in config.json, or delete the local one and sync again.`);
      continue;
    }
    rmSync(target, { recursive: true, force: true });
    cpSync(join(source, 'skills', name), target, { recursive: true });
    synced.push(name);
    report.push(`synced      ${name}`);
  }

  for (const name of previouslySynced) {
    if (synced.includes(name) || keepLocal.has(name)) continue; // a keepLocal copy stays as the project's own
    rmSync(join(SKILLS, name), { recursive: true, force: true });
    report.push(`removed     ${name} (no longer in the source)`);
  }

  const commit = execFileSync('git', ['-C', source, 'log', '-1', '--format=%H', '--', 'skills'], { encoding: 'utf8' }).trim();
  const manifest = {
    note: 'Written by sync.mjs. Skills listed here are copies from the source repo: edit them there, not here, or the next sync overwrites the change.',
    source: config.source,
    commit,
    skills: synced.sort(),
  };
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');

  console.log(report.join('\n'));
  console.log(`\nSource ${config.source} at ${commit.slice(0, 7)}. Review with: git status .claude/`);
} finally {
  if (cleanup) rmSync(cleanup, { recursive: true, force: true });
}
