#!/usr/bin/env node
/**
 * Checks the repo before a pull request is merged. Read only: it never changes a file.
 *
 *   - every skill has a SKILL.md with a name matching its folder and a description
 *   - every SKILL.md stays under 500 lines
 *   - every trap in skills/ship/references/traps.md has a Status line, and a
 *     "Checked" status carries a date
 *   - the plugin and marketplace JSON files parse
 *   - no long dashes (em or en) in any Markdown file
 *
 * Run: node scripts/validate.mjs
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git') continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

// Skills
const skillsDir = join(ROOT, 'skills');
for (const skill of readdirSync(skillsDir)) {
  const file = join(skillsDir, skill, 'SKILL.md');
  if (!existsSync(file)) {
    errors.push(`skills/${skill}: missing SKILL.md`);
    continue;
  }
  const text = readFileSync(file, 'utf8');
  const front = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!front) {
    errors.push(`skills/${skill}/SKILL.md: missing frontmatter`);
    continue;
  }
  const name = front[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const description = front[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();
  if (name !== skill) errors.push(`skills/${skill}/SKILL.md: name "${name}" should be "${skill}"`);
  if (!description) errors.push(`skills/${skill}/SKILL.md: missing description`);
  else if (description.length > 1536) errors.push(`skills/${skill}/SKILL.md: description over 1536 characters`);
  const lines = text.split('\n').length;
  if (lines > 500) errors.push(`skills/${skill}/SKILL.md: ${lines} lines, keep it under 500`);
}

// Traps
const trapsFile = join(ROOT, 'skills/ship/references/traps.md');
if (existsSync(trapsFile)) {
  const entries = readFileSync(trapsFile, 'utf8').split(/\n(?=### )/).filter((e) => e.startsWith('### '));
  for (const entry of entries) {
    const title = entry.split('\n')[0].slice(4);
    const status = entry.match(/\*\*Status:\*\*\s*(.+)/)?.[1];
    if (!status) {
      errors.push(`traps.md "${title}": missing a Status line`);
      continue;
    }
    if (/^Checked/.test(status) && !/\d{4}-\d{2}-\d{2}/.test(status)) {
      errors.push(`traps.md "${title}": a Checked status needs a date (YYYY-MM-DD)`);
    }
    const source = entry.match(/\*\*Source:\*\*\s*(.+)/)?.[1];
    if (/^Checked/.test(status) && !source) {
      errors.push(`traps.md "${title}": a Checked trap needs a Source link`);
    }
  }
}

// JSON
for (const file of ['.claude-plugin/plugin.json', '.claude-plugin/marketplace.json']) {
  try {
    JSON.parse(readFileSync(join(ROOT, file), 'utf8'));
  } catch (e) {
    errors.push(`${file}: does not parse (${e.message})`);
  }
}

// Style
for (const file of walk(ROOT).filter((f) => f.endsWith('.md'))) {
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      if (/[–—]/.test(line)) errors.push(`${relative(ROOT, file)}:${i + 1}: long dash, use a period, comma or parentheses`);
    });
}

if (errors.length) {
  console.error(`Validation failed:\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log('Validation passed.');
