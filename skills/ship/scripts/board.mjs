#!/usr/bin/env node
/**
 * The release status board. Reads the status file the ship skill keeps, checks the
 * live parts it can (web pages that must load), then writes an HTML page and prints
 * the board in the terminal. No dependencies: Node 18 or later.
 *
 *   node board.mjs [status.json] [--html <file>] [--no-check] [--wait] [--open]
 *
 *   status.json  default store/status.json, relative to where it runs
 *   --html       where the page goes, default next to the status file as status.html
 *   --no-check   skip the live page checks (offline, or in a hurry)
 *   --wait       for pages blocked here, wait up to two minutes for GitHub's check
 *   --open       open the page in the default browser afterwards
 *
 * The file format is in ../references/board.md. Read only: the status file is never
 * changed; the live results go into the page and the terminal output.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { dirname, join, resolve, relative } from 'node:path';
import { spawn, execFileSync } from 'node:child_process';

const STATES = {
  done: { label: 'Ready', icon: '✔' },
  active: { label: 'In progress', icon: '◐' },
  waiting: { label: 'Waiting', icon: '◷' },
  blocked: { label: 'Needs a fix', icon: '✘' },
  risk: { label: 'Known risk', icon: '▲' },
  todo: { label: 'To do', icon: '○' },
};

// Arguments
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const positional = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--html');
const statusPath = resolve(positional[0] ?? 'store/status.json');
const htmlPath = resolve(option('--html') ?? join(dirname(statusPath), 'status.html'));

if (!existsSync(statusPath)) {
  console.error(`No status file at ${relative(process.cwd(), statusPath) || statusPath}. The ship skill writes it; see references/board.md.`);
  process.exit(1);
}

let status;
try {
  status = JSON.parse(readFileSync(statusPath, 'utf8'));
} catch (e) {
  console.error(`${statusPath} does not parse: ${e.message}`);
  process.exit(1);
}
const items = (status.items ?? []).map((item) => ({ ...item, state: STATES[item.state] ? item.state : 'todo' }));

// Live checks: an item with a url is a page the stores need to load. Checked from
// here first. A page this machine cannot reach at all (a cloud session's network
// rules block most sites) is read from the checks GitHub runs instead: the project's
// "Last Mile checks" workflow saves them to the last-mile-checks branch.
function applyResult(item, r, where) {
  item.checked = r.checked;
  if (r.ok) {
    item.state = 'done';
    item.detail = `Live (${r.status})${where}`;
  } else {
    item.state = 'blocked';
    if (r.status) item.detail = `Returns ${r.status}${where}`;
    else if (r.error === 'ENOTFOUND') item.detail = `The domain does not resolve${where}`;
    else item.detail = `Does not load (${r.error ?? 'no answer'})${where}`;
  }
}

async function checkHere(item) {
  try {
    const res = await fetch(item.url, { redirect: 'follow', signal: AbortSignal.timeout(8000), headers: { 'user-agent': 'the-last-mile-board' } });
    applyResult(item, { ok: res.ok, status: res.status, checked: new Date().toISOString() }, '');
    return true;
  } catch {
    return false; // blocked here, or really down: GitHub's check tells the two apart
  }
}

function checksFromGitHub() {
  const cwd = dirname(statusPath);
  try {
    execFileSync('git', ['fetch', '-q', 'origin', 'last-mile-checks'], { cwd, stdio: 'ignore', timeout: 30000 });
    return JSON.parse(execFileSync('git', ['show', 'FETCH_HEAD:checks.json'], { cwd, encoding: 'utf8' })).pages ?? {};
  } catch {
    return null; // no remote, no branch yet, or no git
  }
}

const unreached = [];
if (!flag('--no-check')) {
  const pages = items.filter((i) => i.url);
  const results = await Promise.all(pages.map(checkHere));
  unreached.push(...pages.filter((_, i) => !results[i]));
}
if (unreached.length) {
  // --wait: the workflow was just started (a push of the status file, or a manual
  // run), so wait up to two minutes for results newer than the status file.
  const changed = statSync(statusPath).mtimeMs;
  const deadline = Date.now() + (flag('--wait') ? 120000 : 0);
  let pages;
  for (;;) {
    pages = checksFromGitHub();
    const fresh = (u) => pages?.[u] && Date.parse(pages[u].checked) > changed;
    if (!flag('--wait') || unreached.every((i) => fresh(i.url)) || Date.now() > deadline) break;
    await new Promise((r) => setTimeout(r, 10000));
  }
  for (const item of unreached) {
    const r = pages?.[item.url];
    if (r) applyResult(item, r, `, checked by GitHub ${ago(r.checked)}${ago(r.checked) === 'just now' ? '' : ' ago'}`);
    else if (pages) item.detail = `${item.detail ? `${item.detail}. ` : ''}Blocked here, waiting on GitHub's check`;
    else item.detail = `${item.detail ? `${item.detail}. ` : ''}Blocked here. The Last Mile checks workflow checks it from GitHub`;
  }
}

// Shortcuts for a row: where to go to get it done. Only http(s) links are kept.
function links(item) {
  return (Array.isArray(item.links) ? item.links : []).filter((l) => l && l.label && /^https?:\/\//.test(l.url ?? ''));
}

// How full each row's bar is, from 0 to 1.
function fraction(item) {
  const p = item.progress;
  if (item.state === 'done') return 1;
  if (p && p.total > 0) return Math.max(0, Math.min(1, p.done / p.total));
  if (item.state === 'blocked') return 1;
  if (item.state === 'risk') return 1;
  if (item.state === 'active') return 0.35;
  if (item.state === 'waiting') return 1;
  return 0;
}

function ago(iso) {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return '';
  const s = Math.max(0, (Date.now() - t) / 1000);
  if (s < 90) return 'just now';
  if (s < 5400) return `${Math.round(s / 60)} min`;
  if (s < 129600) return `${Math.round(s / 3600)} h`;
  return `${Math.round(s / 86400)} days`;
}

function detailText(item) {
  const parts = [];
  if (item.detail) parts.push(item.detail);
  if (item.progress?.total) parts.push(`${item.progress.done} of ${item.progress.total}${item.progress.unit ? ` ${item.progress.unit}` : ''}`);
  if (item.since) parts.push(`for ${ago(item.since)}`);
  return parts.join(' · ');
}

const ready = items.filter((i) => i.state === 'done').length;
const resolved = { ...status, items: items.map((i) => ({ ...i, links: links(i), fraction: fraction(i), text: detailText(i) })), ready, total: items.length };

// HTML page
mkdirSync(dirname(htmlPath), { recursive: true });
writeFileSync(htmlPath, page(resolved));

// Terminal board
await printBoard(resolved);
console.log(`\n  Page: ${relative(process.cwd(), htmlPath) || htmlPath}`);

if (flag('--open')) {
  const cmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'cmd' : 'xdg-open';
  const cmdArgs = process.platform === 'win32' ? ['/c', 'start', '', htmlPath] : [htmlPath];
  try {
    spawn(cmd, cmdArgs, { stdio: 'ignore', detached: true }).on('error', () => {}).unref();
  } catch {
    // No browser here (a cloud session). The page is still written.
  }
}

// Terminal rendering

async function printBoard(data) {
  const out = process.stdout;
  const color = out.isTTY && !process.env.NO_COLOR;
  const truecolor = /truecolor|24bit/i.test(process.env.COLORTERM ?? '');
  const rgb = (r, g, b, basic) => (s) => (color ? `${truecolor ? `\x1b[38;2;${r};${g};${b}m` : `\x1b[${basic}m`}${s}\x1b[0m` : s);
  const paint = {
    done: rgb(63, 185, 80, 32),
    active: rgb(227, 179, 65, 33),
    waiting: rgb(88, 166, 255, 34),
    blocked: rgb(248, 81, 73, 31),
    risk: rgb(219, 123, 42, 33),
    todo: rgb(139, 148, 158, 90),
    bold: (s) => (color ? `\x1b[1m${s}\x1b[0m` : s),
    dim: (s) => (color ? `\x1b[2m${s}\x1b[0m` : s),
  };

  const width = Math.max(56, Math.min(out.columns || 80, 100));
  const titleWidth = Math.min(30, Math.max(18, ...data.items.map((i) => i.title.length + 1)));
  const barWidth = 10;
  const PARTS = ['', '▏', '▎', '▍', '▌', '▋', '▊', '▉'];
  const bar = (f, state) => {
    const cells = f * barWidth;
    const full = Math.floor(cells);
    const part = PARTS[Math.round((cells - full) * 7)] ?? '';
    const filled = '█'.repeat(full) + part;
    const empty = color ? '─'.repeat(Math.max(0, barWidth - filled.length)) : '.'.repeat(Math.max(0, barWidth - filled.length));
    return paint[state](filled) + paint.dim(empty);
  };
  const clip = (s, n) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

  const frame = (t) => {
    const lines = [];
    const head = `${data.app ?? 'Your app'}${data.version ? ` ${data.version}` : ''}${data.build ? ` (${data.build})` : ''}`;
    const count = `${data.ready} of ${data.total} ready`;
    lines.push('');
    lines.push(`  ${paint.bold(head)}${' '.repeat(Math.max(2, width - head.length - count.length - 4))}${paint.bold(count)}`);
    const overall = data.total ? data.ready / data.total : 0;
    const lineWidth = width - 4;
    const filled = Math.round(overall * t * lineWidth);
    lines.push(`  ${paint.done('━'.repeat(filled))}${paint.dim('━'.repeat(lineWidth - filled))}`);
    let group;
    for (const item of data.items) {
      if (item.group && item.group !== group) {
        group = item.group;
        lines.push('');
        lines.push(`  ${paint.dim(group.toUpperCase())}`);
      }
      const icon = paint[item.state](STATES[item.state].icon);
      const you = item.owner === 'you' && item.state !== 'done' ? paint.active(' you') : '';
      const title = clip(item.title, titleWidth - 1).padEnd(titleWidth);
      const room = width - titleWidth - barWidth - 10;
      lines.push(`  ${icon} ${title}${bar(item.fraction * t, item.state)}  ${clip(item.text || STATES[item.state].label, Math.max(8, room - (you ? 4 : 0)))}${you}`);
      if (item.state !== 'done') for (const l of links(item)) lines.push(paint.dim(`      ${l.label}: ${l.url}`));
    }
    return lines;
  };

  if (!color) {
    out.write(frame(1).join('\n') + '\n');
    return;
  }
  const steps = 18;
  let previous = 0;
  for (let s = 1; s <= steps; s++) {
    const t = 1 - Math.pow(1 - s / steps, 3); // ease out
    const lines = frame(t);
    if (previous) out.write(`\x1b[${previous}A`);
    out.write(lines.map((l) => `\x1b[2K${l}`).join('\n') + '\n');
    previous = lines.length;
    if (s < steps) await new Promise((r) => setTimeout(r, 28));
  }
}

// HTML rendering

function page(data) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  const title = `${data.app ?? 'Your app'} release`.replace(/[<&>"]/g, '');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<style>
:root {
  --bg: #f6f7f9; --card: #ffffff; --ink: #14171c; --muted: #66707c; --line: #e3e6ea; --track: #eceff2;
  --done: #1f9d55; --active: #c98a00; --waiting: #2f7de1; --blocked: #d93a3a; --risk: #c2660f; --todo: #9aa3ad;
  --glow: rgba(47, 125, 225, .18);
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0b0d11; --card: #14181e; --ink: #e8ebef; --muted: #8b95a1; --line: #222831; --track: #1e242c;
    --done: #3fb950; --active: #e3b341; --waiting: #58a6ff; --blocked: #f85149; --risk: #db7b2a; --todo: #5c6670;
    --glow: rgba(88, 166, 255, .22);
  }
}
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body {
  margin: 0; background: var(--bg); color: var(--ink);
  font: 15px/1.45 ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  padding: max(20px, env(safe-area-inset-top)) 16px max(32px, env(safe-area-inset-bottom));
}
main { max-width: 640px; margin: 0 auto; }
header { display: flex; align-items: center; gap: 18px; padding: 8px 4px 22px; }
.ring { position: relative; width: 84px; height: 84px; flex: none; }
.ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.ring circle { fill: none; stroke-width: 8; }
.ring .track { stroke: var(--track); }
.ring .fill { stroke: var(--done); stroke-linecap: round; transition: stroke-dashoffset 1.1s cubic-bezier(.2,.8,.2,1); }
.ring .pct { position: absolute; inset: 0; display: grid; place-items: center; font-weight: 700; font-size: 20px; font-variant-numeric: tabular-nums; }
h1 { margin: 0; font-size: 22px; line-height: 1.2; letter-spacing: -.01em; }
.sub { color: var(--muted); margin-top: 4px; font-size: 14px; }
.callout {
  background: var(--card); border: 1px solid var(--line); border-left: 4px solid var(--active);
  border-radius: 14px; padding: 14px 16px; margin-bottom: 18px;
}
.callout b { display: block; margin-bottom: 6px; }
.callout ul { margin: 0; padding-left: 18px; color: var(--muted); }
.callout li { margin: 2px 0; }
.group { margin: 22px 4px 8px; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
.card { background: var(--card); border: 1px solid var(--line); border-radius: 14px; overflow: hidden; }
.row {
  display: grid; grid-template-columns: 28px 1fr auto; gap: 4px 12px; align-items: center;
  padding: 14px 16px; border-top: 1px solid var(--line);
  opacity: 0; transform: translateY(6px); animation: rise .5s cubic-bezier(.2,.8,.2,1) forwards;
}
.row:first-child { border-top: 0; }
.dot { width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-size: 12px; font-weight: 700; color: #fff; grid-row: span 2; }
.done .dot { background: var(--done); }
.active .dot { background: var(--active); }
.waiting .dot { background: var(--waiting); box-shadow: 0 0 0 0 var(--glow); animation: pulse 1.8s ease-out infinite; }
.blocked .dot { background: var(--blocked); }
.risk .dot { background: var(--risk); }
.todo .dot { background: transparent; border: 2px solid var(--todo); }
.title { font-weight: 600; min-width: 0; overflow-wrap: anywhere; }
.chip { font-size: 12px; font-weight: 600; padding: 3px 9px; border-radius: 999px; white-space: nowrap; justify-self: end; }
.done .chip { color: var(--done); background: color-mix(in srgb, var(--done) 14%, transparent); }
.active .chip { color: var(--active); background: color-mix(in srgb, var(--active) 16%, transparent); }
.waiting .chip { color: var(--waiting); background: color-mix(in srgb, var(--waiting) 14%, transparent); }
.blocked .chip { color: var(--blocked); background: color-mix(in srgb, var(--blocked) 14%, transparent); }
.risk .chip { color: var(--risk); background: color-mix(in srgb, var(--risk) 14%, transparent); }
.todo .chip { color: var(--muted); background: var(--track); }
.meta { grid-column: 2 / 4; display: flex; align-items: center; gap: 12px; min-width: 0; }
.detail { color: var(--muted); font-size: 13.5px; flex: 1; min-width: 0; overflow-wrap: anywhere; }
.detail a { color: inherit; }
.links { grid-column: 2 / 4; display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
.links a {
  display: inline-flex; align-items: center; gap: 6px; min-height: 36px; padding: 7px 13px;
  border-radius: 10px; border: 1px solid var(--line); background: var(--bg); color: var(--ink);
  font-size: 13.5px; font-weight: 600; text-decoration: none;
}
.links a:first-child { background: var(--ink); color: var(--card); border-color: var(--ink); }
.links a::after { content: '\\2197'; font-weight: 400; opacity: .7; }
.links a:active { transform: scale(.98); }
.callout a { color: var(--ink); font-weight: 600; }
.you { font-size: 11px; font-weight: 700; color: var(--active); border: 1px solid currentColor; border-radius: 6px; padding: 0 5px; white-space: nowrap; }
.bar { grid-column: 2 / 4; height: 6px; border-radius: 99px; background: var(--track); overflow: hidden; margin-top: 4px; }
.bar i { display: block; height: 100%; width: 0; border-radius: inherit; transition: width 1s cubic-bezier(.2,.8,.2,1); }
.done .bar i { background: var(--done); }
.blocked .bar i { background: var(--blocked); }
.risk .bar i { background: var(--risk); }
.active .bar i {
  background: repeating-linear-gradient(-45deg, var(--active) 0 8px, color-mix(in srgb, var(--active) 70%, #fff) 8px 16px);
  background-size: 22.6px 100%; animation: stripes .8s linear infinite;
}
.waiting .bar i {
  background: linear-gradient(90deg, color-mix(in srgb, var(--waiting) 25%, transparent) 0%, var(--waiting) 50%, color-mix(in srgb, var(--waiting) 25%, transparent) 100%);
  background-size: 200% 100%; animation: shimmer 1.8s linear infinite;
}
footer { color: var(--muted); font-size: 12.5px; text-align: center; margin-top: 28px; }
footer a { color: inherit; }
@keyframes rise { to { opacity: 1; transform: none; } }
@keyframes pulse { 0% { box-shadow: 0 0 0 0 var(--glow); } 70% { box-shadow: 0 0 0 10px transparent; } 100% { box-shadow: 0 0 0 0 transparent; } }
@keyframes stripes { to { background-position: 22.6px 0; } }
@keyframes shimmer { from { background-position: 200% 0; } to { background-position: 0 0; } }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
  .row { opacity: 1; transform: none; }
}
</style>
</head>
<body>
<main id="app"></main>
<script id="data" type="application/json">${json}</script>
<script>
const data = JSON.parse(document.getElementById('data').textContent);
const LABEL = { done: 'Ready', active: 'In progress', waiting: 'Waiting', blocked: 'Needs a fix', risk: 'Known risk', todo: 'To do' };
const ICON = { done: '✓', active: '', waiting: '', blocked: '!', risk: '▲', todo: '' };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function ago(iso) {
  const t = Date.parse(iso); if (Number.isNaN(t)) return '';
  const s = Math.max(0, (Date.now() - t) / 1000);
  if (s < 90) return 'just now';
  if (s < 5400) return Math.round(s / 60) + ' min';
  if (s < 129600) return Math.round(s / 3600) + ' h';
  return Math.round(s / 86400) + ' days';
}
function detail(item) {
  const parts = [];
  if (item.detail) parts.push(esc(item.detail));
  if (item.progress && item.progress.total) parts.push(item.progress.done + ' of ' + item.progress.total + (item.progress.unit ? ' ' + esc(item.progress.unit) : ''));
  if (item.since) parts.push('for ' + ago(item.since));
  let text = parts.join(' · ');
  if (item.url && /^https?:/.test(item.url)) text += (text ? ' · ' : '') + '<a href="' + esc(item.url) + '">open</a>';
  return text;
}
const name = [data.app || 'Your app', data.version, data.build ? '(' + data.build + ')' : ''].filter(Boolean).join(' ');
const yours = data.items.filter((i) => i.owner === 'you' && i.state !== 'done');
const pct = data.total ? Math.round((data.ready / data.total) * 100) : 0;
const C = 2 * Math.PI * 36;
let html = '<header><div class="ring"><svg viewBox="0 0 84 84"><circle class="track" cx="42" cy="42" r="36"/>'
  + '<circle class="fill" cx="42" cy="42" r="36" stroke-dasharray="' + C + '" stroke-dashoffset="' + C + '"/></svg>'
  + '<div class="pct"><span><span id="pct">0</span>%</span></div></div>'
  + '<div><h1>' + esc(name) + '</h1><div class="sub">' + data.ready + ' of ' + data.total + ' ready'
  + (data.updated ? ' · updated ' + ago(data.updated) + (ago(data.updated) === 'just now' ? '' : ' ago') : '') + '</div></div></header>';
if (yours.length) {
  html += '<div class="callout"><b>Only you can do ' + (yours.length === 1 ? 'this' : 'these') + '</b><ul>'
    + yours.map((i) => '<li>' + (i.links.length ? '<a href="' + esc(i.links[0].url) + '">' + esc(i.title) + '</a>' : esc(i.title)) + (i.detail ? ': ' + esc(i.detail) : '') + '</li>').join('') + '</ul></div>';
}
let group = null, n = 0, open = false;
for (const item of data.items) {
  const g = item.group || '';
  if (g !== group || !open) {
    if (open) html += '</div>';
    if (g) html += '<div class="group">' + esc(g) + '</div>';
    html += '<div class="card">';
    group = g; open = true;
  }
  html += '<div class="row ' + item.state + '" style="animation-delay:' + (n++ * 45) + 'ms">'
    + '<div class="dot">' + ICON[item.state] + '</div>'
    + '<div class="title">' + esc(item.title) + '</div>'
    + '<span class="chip">' + LABEL[item.state] + '</span>'
    + '<div class="meta"><span class="detail">' + detail(item) + '</span>'
    + (item.owner === 'you' && item.state !== 'done' ? '<span class="you">YOU</span>' : '') + '</div>'
    + '<div class="bar"><i data-w="' + (item.fraction * 100).toFixed(1) + '"></i></div>'
    + (item.state !== 'done' && item.links.length ? '<div class="links">' + item.links.map((l) => '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + '</a>').join('') + '</div>' : '')
    + '</div>';
}
if (open) html += '</div>';
html += '<footer>Made by <a href="https://github.com/namedtoaster/the-last-mile">/ship</a> from The Last Mile</footer>';
document.getElementById('app').innerHTML = html;
requestAnimationFrame(() => requestAnimationFrame(() => {
  document.querySelectorAll('.bar i').forEach((el) => { el.style.width = el.dataset.w + '%'; });
  document.querySelector('.ring .fill').style.strokeDashoffset = C * (1 - pct / 100);
  const target = document.getElementById('pct');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { target.textContent = pct; return; }
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - start) / 1100);
    target.textContent = Math.round(pct * (1 - Math.pow(1 - t, 3)));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}));
</script>
</body>
</html>
`;
}
