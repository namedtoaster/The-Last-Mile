#!/usr/bin/env node
/**
 * Saves a plain text copy of every official page the ship references cite, so any
 * session can read the rules even when its own network blocks the store's site.
 *
 *   - collects every link in skills/ship/references/*.md (anchors dropped, deduplicated)
 *   - fetches each page, keeps the main article as plain text
 *   - writes sources/<host>/<path>.txt only when the text changed
 *   - writes sources/index.json: for each URL, its file, when it was last fetched,
 *     when its text last changed, and the error if the fetch failed
 *
 * A failed fetch keeps the previous copy. Nothing else in the repo is touched.
 * Runs weekly in .github/workflows/snapshot-sources.yml, which commits the result.
 *
 * Run: node scripts/snapshot-sources.mjs
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const REFS = join(ROOT, 'skills', 'ship', 'references');
const OUT = join(ROOT, 'sources');
const INDEX = join(OUT, 'index.json');
const today = new Date().toISOString().slice(0, 10);

function citedUrls() {
  const urls = new Set();
  for (const name of readdirSync(REFS).filter((n) => n.endsWith('.md'))) {
    const text = readFileSync(join(REFS, name), 'utf8');
    for (const m of text.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)) urls.add(m[1].split('#')[0]);
  }
  return [...urls].sort();
}

function fileFor(url) {
  const u = new URL(url);
  const path = (u.pathname.replace(/\/+$/, '') || '/index').replace(/[^a-zA-Z0-9/_-]/g, '-');
  return join(u.host, `${path}.txt`).replace(/\/\//g, '/');
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
function decode(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (all, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return ENTITIES[e.toLowerCase()] ?? all;
  });
}

function toText(html) {
  let h = html.replace(/<(script|style|noscript|svg|head|nav|footer|header|form|iframe)\b[\s\S]*?<\/\1>/gi, '');
  const main = h.match(/<article\b[\s\S]*<\/article>/i) ?? h.match(/<main\b[\s\S]*<\/main>/i);
  if (main) h = main[0];
  h = h
    .replace(/<h([1-6])\b[^>]*>/gi, (_, n) => `\n\n${'#'.repeat(Number(n))} `)
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<li\b[^>]*>/gi, '\n- ')
    .replace(/<(br|hr)\b[^>]*>/gi, '\n')
    .replace(/<\/(p|div|section|ul|ol|table|tr|blockquote|pre|dl|dd|dt)>/gi, '\n')
    .replace(/<\/t[dh]>/gi, ' | ')
    .replace(/<[^>]+>/g, '');
  return decode(h)
    .split('\n')
    .map((l) => l.replace(/[ \t ]+/g, ' ').trim())
    .filter((l) => !/^-+$/.test(l))
    .join('\n')
    .replace(/^(#+)\n+/gm, '$1 ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function fetchText(url) {
  const target = new URL(url);
  if (target.host === 'support.google.com' && !target.searchParams.has('hl')) target.searchParams.set('hl', 'en');
  let lastError;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(target, {
        headers: { 'User-Agent': 'Mozilla/5.0 (the-last-mile source snapshot)', 'Accept-Language': 'en' },
        redirect: 'follow',
        signal: AbortSignal.timeout(30000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = toText(await res.text());
      if (text.length < 200) throw new Error(`only ${text.length} characters of text, probably not the article`);
      return { text, finalUrl: res.url };
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}

const index = existsSync(INDEX) ? JSON.parse(readFileSync(INDEX, 'utf8')) : {};
const report = [];
for (const url of citedUrls()) {
  const file = fileFor(url);
  const path = join(OUT, file);
  const entry = index[url] ?? { file };
  try {
    const { text, finalUrl } = await fetchText(url);
    const body = `${text}\n`;
    const previous = existsSync(path) ? readFileSync(path, 'utf8').split('\n').slice(4).join('\n') : null;
    if (previous !== body) {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, `Source: ${url}\nFetched: ${today}\nThis is a plain text copy of the official page, made by scripts/snapshot-sources.mjs. The page itself is the rule.\n\n${body}`);
      entry.changed = today;
      report.push(`${previous === null ? 'NEW    ' : 'CHANGED'} ${url}`);
    }
    Object.assign(entry, { file, fetched: today, finalUrl: finalUrl !== url ? finalUrl : undefined, error: undefined });
  } catch (e) {
    entry.error = `${today}: ${e.message}`;
    report.push(`FAILED  ${url}: ${e.message}`);
  }
  index[url] = entry;
}

for (const url of Object.keys(index)) if (!citedUrls().includes(url)) delete index[url];
mkdirSync(OUT, { recursive: true });
writeFileSync(INDEX, `${JSON.stringify(index, null, 2)}\n`);
console.log(report.length ? report.join('\n') : 'No changes.');
