#!/usr/bin/env node
/**
 * Runs the ship skill's rejection sweep on each fixture app and scores it against
 * the fixture's answer key, so a skill change can be compared with the last run.
 *
 *   node evals/run.mjs                        every fixture
 *   node evals/run.mjs expo-meal-tracker      one fixture
 *   node evals/run.mjs --rescore <run folder> score saved findings again, no API calls
 *
 * Options: --model <id>, --budget <usd per fixture, default 3>, --fact-check
 * (let the run open official pages; off by default to save time and money).
 *
 * Each fixture is copied to a temporary folder with only the plugin next to it, so
 * the run never sees the answer keys. It calls the Claude Code CLI (`claude -p`),
 * which spends API credit. Results go to evals/results/: one folder per run with each
 * fixture's findings and transcript, and one line per fixture in history.jsonl.
 */

import { cpSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync, appendFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const EVALS = dirname(fileURLToPath(import.meta.url));
const ROOT = join(EVALS, '..');
const RESULTS = join(EVALS, 'results');

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  if (i === -1) return fallback;
  const value = args[i + 1];
  args.splice(i, 2);
  return value;
};
const flag = (name) => {
  const i = args.indexOf(name);
  if (i === -1) return false;
  args.splice(i, 1);
  return true;
};
const model = opt('--model', undefined);
const budget = opt('--budget', '3');
const rescore = opt('--rescore', undefined);
const factCheck = flag('--fact-check');

const PROMPT = `Use the ship skill from The Last Mile on the app in this folder, but only its
first two steps: "Where you stand" and the rejection sweep.

This is an automated evaluation, so nobody can answer questions. Assume a first
release to both the App Store and Google Play, and that both developer accounts exist.
${factCheck ? '' : 'Skip the fact-check step and use the references as they are.\n'}Do not change, build or install anything, and do not commit. The only file you may
write is ship-findings.json in this folder, shaped like this:

{
  "stack": "<the stack you detected, one lowercase word: expo, react-native, flutter, capacitor, maui, kmp, native-ios, native-android, web>",
  "findings": [
    {
      "title": "<the problem in a few words>",
      "rule": "<the guideline or policy, for example App Review Guidelines 2.3.10>",
      "file": "<path relative to this folder, or empty>",
      "line": <line number or null>,
      "severity": "blocker" or "warning"
    }
  ]
}

"blocker" means it would likely get the app rejected or stop the release. "warning"
means worth fixing before release. One entry per problem.`;

function git(...a) {
  try {
    return execFileSync('git', a, { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

function runFixture(name, runDir) {
  const work = mkdtempSync(join(tmpdir(), `tlm-${name}-`));
  const app = join(work, 'app');
  const plugin = join(work, 'plugin');
  cpSync(join(EVALS, 'fixtures', name), app, { recursive: true });
  mkdirSync(plugin);
  cpSync(join(ROOT, '.claude-plugin'), join(plugin, '.claude-plugin'), { recursive: true });
  cpSync(join(ROOT, 'skills'), join(plugin, 'skills'), { recursive: true });
  execFileSync('git', ['init', '-q'], { cwd: app });
  execFileSync('git', ['add', '-A'], { cwd: app });
  execFileSync('git', ['-c', 'user.name=eval', '-c', 'user.email=eval@example.com', 'commit', '-qm', 'fixture'], { cwd: app });

  const cli = [
    '-p', PROMPT,
    '--plugin-dir', plugin,
    '--output-format', 'stream-json', '--verbose',
    '--max-budget-usd', budget,
    '--permission-mode', 'acceptEdits',
    '--allowedTools', 'Read', 'Grep', 'Glob', 'Skill', 'Write', 'WebFetch', 'WebSearch', 'Bash(ls:*)', 'Bash(cat:*)', 'Bash(grep:*)', 'Bash(find:*)',
    '--no-session-persistence',
  ];
  if (model) cli.push('--model', model);

  const started = Date.now();
  const out = spawnSync('claude', cli, { cwd: app, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 20 * 60 * 1000 });
  const seconds = Math.round((Date.now() - started) / 1000);
  writeFileSync(join(runDir, `${name}.transcript.jsonl`), out.stdout || '');
  if (out.stderr) writeFileSync(join(runDir, `${name}.stderr.txt`), out.stderr);

  let cost = null;
  let usedSkill = false;
  for (const line of (out.stdout || '').split('\n')) {
    if (!line.trim()) continue;
    try {
      const event = JSON.parse(line);
      if (event.type === 'result') cost = event.total_cost_usd ?? null;
      const blocks = event.message?.content;
      if (Array.isArray(blocks) && blocks.some((b) => b.type === 'tool_use' && b.name === 'Skill' && /ship/.test(JSON.stringify(b.input)))) usedSkill = true;
    } catch {}
  }

  const findingsFile = join(app, 'ship-findings.json');
  const findings = existsSync(findingsFile) ? readFileSync(findingsFile, 'utf8') : null;
  if (findings) writeFileSync(join(runDir, `${name}.findings.json`), findings);
  rmSync(work, { recursive: true, force: true });
  return { cost, seconds, usedSkill };
}

const lower = (s) => String(s ?? '').toLowerCase();
const matches = (patterns, text) => patterns.some((p) => new RegExp(p, 'i').test(text));

export function score(name, findingsText) {
  const key = JSON.parse(readFileSync(join(EVALS, 'answers', `${name}.json`), 'utf8'));
  let report;
  try {
    report = JSON.parse(findingsText);
  } catch {
    return { error: 'no readable ship-findings.json' };
  }
  const findings = (report.findings || []).map((f) => ({ ...f, text: lower(`${f.title} ${f.rule}`), used: false }));

  // Pair each planted problem with at most one finding, trying every pairing
  // (augmenting paths), so one broad finding can't take another problem's credit.
  const fits = (f, want) => matches(want.match, f.text) && (!want.file || lower(f.file).includes(lower(want.file)));
  const owner = new Array(findings.length).fill(-1);
  function claim(w, seen) {
    for (let i = 0; i < findings.length; i++) {
      if (seen.has(i) || !fits(findings[i], key.expected[w])) continue;
      seen.add(i);
      if (owner[i] === -1 || claim(owner[i], seen)) {
        owner[i] = w;
        return true;
      }
    }
    return false;
  }
  const missed = [];
  key.expected.forEach((want, w) => {
    if (!claim(w, new Set())) missed.push(want.id);
  });
  owner.forEach((w, i) => {
    if (w !== -1) findings[i].used = true;
  });
  const extra = findings.filter(
    (f) => !f.used && !key.expected.some((want) => fits(f, want)) && !(key.allowed || []).some((a) => matches(a.match, f.text)),
  );
  return {
    stackOk: lower(report.stack) === key.stack,
    found: key.expected.length - missed.length,
    expected: key.expected.length,
    missed,
    falseAlarms: extra.filter((f) => f.severity === 'blocker').map((f) => f.title),
    otherWarnings: extra.filter((f) => f.severity !== 'blocker').map((f) => f.title),
  };
}

function print(rows) {
  console.log('\nfixture                   stack  found   false alarms  cost    time');
  for (const r of rows) {
    if (r.error) {
      console.log(`${r.fixture.padEnd(26)}${r.error}`);
      continue;
    }
    const cost = r.cost == null ? '  -   ' : `$${r.cost.toFixed(2)}`.padEnd(6);
    console.log(
      `${r.fixture.padEnd(26)}${(r.stackOk ? 'ok' : 'WRONG').padEnd(7)}${`${r.found}/${r.expected}`.padEnd(8)}${String(r.falseAlarms.length).padEnd(14)}${cost}  ${r.seconds ?? '-'}s`,
    );
    if (r.missed.length) console.log(`  missed: ${r.missed.join(', ')}`);
    for (const t of r.falseAlarms) console.log(`  false alarm: ${t}`);
  }
}

if (rescore) {
  const dir = join(RESULTS, rescore);
  const rows = readdirSync(dir)
    .filter((f) => f.endsWith('.findings.json'))
    .map((f) => {
      const fixture = f.replace('.findings.json', '');
      return { fixture, ...score(fixture, readFileSync(join(dir, f), 'utf8')) };
    });
  print(rows);
} else {
  const all = readdirSync(join(EVALS, 'fixtures'));
  const chosen = args.length ? args : all;
  for (const name of chosen) if (!all.includes(name)) throw new Error(`No fixture named ${name}`);

  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const runDir = join(RESULTS, stamp);
  mkdirSync(runDir, { recursive: true });
  const commit = git('rev-parse', '--short', 'HEAD');
  const dirty = git('status', '--porcelain', '--', 'skills').length > 0;

  const rows = [];
  for (const fixture of chosen) {
    console.log(`Running ${fixture}...`);
    const meta = runFixture(fixture, runDir);
    const file = join(runDir, `${fixture}.findings.json`);
    const result = existsSync(file) ? score(fixture, readFileSync(file, 'utf8')) : { error: 'no ship-findings.json written' };
    const row = { date: new Date().toISOString(), commit, skillsChanged: dirty, model: model ?? 'default', factCheck, fixture, ...meta, ...result };
    rows.push(row);
    appendFileSync(join(RESULTS, 'history.jsonl'), JSON.stringify({ run: stamp, ...row }) + '\n');
  }
  print(rows);
  console.log(`\nSaved to evals/results/${stamp}/ and evals/results/history.jsonl`);
}
