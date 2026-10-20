#!/usr/bin/env node
/**
 * Who owns each search phrase on the App Store, so a keyword is picked by whether
 * a small app can win it, not only by how often it is searched.
 *
 * For each phrase it asks Apple's public iTunes Search API (no key, no account) for
 * the top apps and prints each one's name, its rating count, and whether the phrase
 * sits in its name. It reads nothing on your machine and writes nothing.
 *
 * The API's order is close to, but not the same as, App Store search on a phone. Use
 * it to judge who holds a phrase; record your own rank by searching on a device.
 *
 * Usage:
 *   node keyword-check.mjs "baby checklist" "hospital bag" [--country us] [--limit 10] [--shots]
 *   --shots also prints each app's screenshot links, to open and look at.
 */

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const value = args[i + 1];
  args.splice(i, 2);
  return value;
};
const country = flag('country', 'us');
const limit = Number(flag('limit', '10'));
const shotsAt = args.indexOf('--shots');
const shots = shotsAt !== -1;
if (shots) args.splice(shotsAt, 1);

if (args.length === 0) {
  console.error('Give one or more search phrases, in quotes.');
  process.exit(1);
}

for (const phrase of args) {
  const url = `https://itunes.apple.com/search?${new URLSearchParams({
    term: phrase,
    entity: 'software',
    country,
    limit: String(limit),
  })}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.log(`\n${phrase}: the search API answered ${res.status}, skipped`);
    continue;
  }
  const { results } = await res.json();
  const words = phrase.toLowerCase().split(/\s+/);
  const ratings = results.map((r) => r.userRatingCount ?? 0);
  const small = ratings.filter((n) => n < 100).length;
  const inName = results.filter((r) =>
    words.every((w) => r.trackName.toLowerCase().includes(w)),
  ).length;

  console.log(`\n${phrase}  (${country}, top ${results.length})`);
  console.log(`  apps under 100 ratings: ${small}   phrase in the name: ${inName}`);
  results.forEach((r, i) => {
    const named = words.every((w) => r.trackName.toLowerCase().includes(w)) ? ' [in name]' : '';
    console.log(`  ${String(i + 1).padStart(2)}. ${String(r.userRatingCount ?? 0).padStart(8)}  ${r.trackName}${named}`);
    if (shots) for (const s of r.screenshotUrls ?? []) console.log(`        ${s}`);
  });
}
