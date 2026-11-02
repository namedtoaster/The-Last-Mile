---
name: search-pages
description: Build the pages that get an app found in search, picking the topics from real search data and a check of who currently ranks rather than from taste. Puts the blog on the app's own domain, ships schema and a sitemap with the first post, and writes the comparison pages that actually pull traffic instead of the explainer pages that do not. Use when the user wants a blog, SEO, organic traffic, content marketing, to be found on Google, to get cited by ChatGPT, or asks what to write about.
---

# Search pages

The only acquisition channel a solo founder owns outright. No platform can switch
it off, and a page written in April still pulls readers in July without being
touched, which is the opposite of everything posted to a feed.

It is also the channel most often done backwards: people pick topics they find
interesting, write explainers, publish on a separate domain, and get nothing.

## What this is not

Not a content calendar, and not a cadence. Publishing frequency is the wrong
variable and chasing it is how people burn out on a channel that works. The
variables are which phrases you cover, whether you can win them, and whether the
page is better than what currently ranks.

## 1. Put it on the app's own domain

A blog at `yourapp.com/blog` builds authority that helps the app's other pages.
The same posts on a separate site, a subdomain, or a hosted publishing platform
build authority for somewhere else.

If the project already serves HTML from its own server, add a route there. A
static site generator means a second toolchain, a second deploy and a second
place for things to rot, and it buys nothing a route does not already give you.

Check before building: does the project already have a landing page? Who serves
it? That is where the blog goes.

## 2. Find what people actually type

Not what a keyword tool estimates. Google's autocomplete is free, needs no key,
and returns real queries:

```
https://suggestqueries.google.com/complete/search?client=firefox&q=<query>
```

Take 10 to 20 seed phrases covering what the app does and who it is for, and
expand each one with every letter a to z plus " for", " vs", " with". Collect and
dedupe. A few hundred seeds yields one to two thousand real phrases in a few
minutes.

Two things about that endpoint, because it fails quietly rather than loudly:

- **Send a browser User-Agent.** Without one it sometimes answers an empty list
  instead of an error, and an empty list is indistinguishable from a seed nobody
  searches.
- **Make the script refuse to write the file when too many calls failed.** It is
  undocumented and unmetered, so hammering it gets your IP answering empty lists.
  A throttled run therefore produces a short list that reads exactly like a niche
  with no demand, which is the worst possible failure: it looks like an answer.
  Count the failures, and stop above a threshold rather than writing a file that
  will be trusted. Go serially with a small pause.

Write this as a script in the repo rather than doing it by hand, and have it
record the date. The phrase list is the input to every later decision, and a
number nobody can regenerate is a number that gets quoted from memory once it is
stale.

Then filter hard:

- **Keep** anything naming what the product actually does.
- **Drop** adjacent categories the product does not serve. Ranking for them
  brings people who leave, and that costs you.
- **Drop** anything under three words. You will not win it.

## 3. Check who ranks, because that decides everything

This is the step people skip, and it is the one that decides whether the work
pays. Search each candidate phrase and look at page one.

**Big publishers on page one means do not write it.** Healthline, Wirecutter,
NYT, Forbes, a national newspaper. You will not outrank them from zero.

**Other small companies' own blogs on page one means write it.** When page one is
five competitors each ranking their own roundup, every one of those is a page a
small team wrote, and you can write a better one. That is the signal to look for,
and it is common in software categories because publishers do not cover them.

Mark the winnable ones. Everything else goes in a list for later, when the domain
has history.

## 4. Write the shapes that work

From a founder who measured this over 90 days, going from about 7 organic clicks
a day to roughly 100 with no ad spend:

> "Write comparison posts. My 'best [category] apps' and 'X vs Y' comparison
> posts do all the work, one gets 318 clicks a month at position ~6. My 'what is
> [concept]' educational posts barely move anyone."

So:

- **Write** "best X for Y", "X vs Y", "alternatives to X". High intent, and the
  reader is already deciding.
- **Do not write** "what is X" explainers. They can rank and still send nobody,
  because the answer gets shown in the results and the reader never clicks.

**List competitors honestly, including the ones beating you.**

> "A genuinely useful roundup ranks and gets clicked. A thinly veiled ad for
> yourself does neither, readers and Google both smell it."

Naming a competitor's genuine advantage costs you nothing and is the difference
between a page that ranks and a page that reads like marketing. It also forces
you to actually use their product, which is worth the afternoon on its own.

**Write from something only you know.** The pages that beat an established site
do it on substance, not word count. If the project has measured something, fixed
something, or found that the common advice is wrong, that is the post. Check the
project's own research and decision notes for it. An agent writing a generic
version of a page that already exists is wasted effort.

## 5. Ship the machinery with the first post, not later

All of this is cheap now and annoying to retrofit:

- `/sitemap.xml` listing every page with a last modified date
- `/robots.txt` pointing at the sitemap
- An `Article` JSON-LD block per post, with the real published date
- A canonical URL per page
- A meta description per page

Then submit the sitemap in Google Search Console, which needs the domain
verified first. Nothing gets crawled on schedule until that is done.

## 6. If you build the renderer, escape before you render

Posts become HTML, and a page built by joining strings is a page the type checker
cannot see inside. Two rules:

- **Escape the source before producing any markup**, not after. Then a post
  cannot inject HTML even by accident.
- **Test by parsing the output**, not by matching strings on it. A JSON-LD block
  gets `JSON.parse`d in a test. A page builder gets its HTML checked for the
  elements it should contain. A builder can emit something that compiles, type
  checks, and renders blank.

This bites hardest on a NEGATIVE assertion, where it fails in both directions at
once. "The page must not contain X", asserted against the rendered body, will
fail on a source comment that merely mentions X, and will PASS on a page whose
markup broke so badly it contains nothing at all. Both outcomes are wrong and the
second one is silent. Parse the blocks, then assert the field is absent from the
parsed object.

A markdown subset you write yourself (headings, paragraphs, lists, links, quotes,
tables, code) is usually less work than a markdown library plus a sanitiser
configured correctly.

## 7. Then stop publishing and start maintaining

After about a month, the job changes. The same founder, on what he did when
traffic dropped:

> "I didn't panic and post more. I rewrote the pages that dropped based on the
> metrics I saw in Search Console so they would answer the search, tightened the
> titles, and cut the fluff intros that pushed the answer below the fold. Two
> weeks later rankings recovered and kept climbing past where they'd been."

In Search Console, **sort by clicks, not impressions.** A page can collect
thousands of impressions at position 37 and send nobody, which looks like
progress and is not. A page at position 15 to 30 needs rewriting, not a sibling.

Read it from the command line rather than the console, for the same reason the
phrase list is a script: a figure you have to click through to and screenshot is
a figure that gets quoted from memory. The Search Analytics API is
`POST https://www.googleapis.com/webmasters/v3/sites/{siteUrl}/searchAnalytics/query`,
grouped by any of `query`, `page`, `country`, `device` or `date`. Three traps:

- **A service account is the auth that suits a script**, and the grant does not
  happen in Google Cloud. Enable the API there, then paste the service account's
  `client_email` into the property's own Settings, Users and permissions. Skipping
  that second half gives a 403 that reads as a broken key.
- **The property string must match how the domain was verified.** A domain
  verified by DNS is `sc-domain:example.com`, and passing `https://example.com/`
  for it 403s identically to having no permission at all.
- **Google service account keys are RSA and sign as plain RS256.** If you have
  already written a tool against App Store Connect, do not carry its EC signing
  workaround over; it will produce a signature Google rejects.

Data lags about two days, so a range ending yesterday has an empty tail that
drags the reported average position down for no reason.

## 8. Tell the user what to expect

Say this up front, because the first month looks like failure:

- A new domain takes weeks to be crawled and ranked at all.
- Expect near zero for the first month. That is not a signal.
- The payoff is slow and then compounds, and the pages do not expire.

## Language models are now a search surface

> "ChatGPT is now a real traffic channel and you can't buy it. People ask it
> 'best app for X', it names you, they click through. The only way in is writing
> something clear enough that the model decides to cite you."

The same founder measured it sending more visitors than his social channel over
90 days. Nothing special is required for it beyond the above: a clear page, a
real claim, an honest comparison table. The one trap he flagged is that analytics
tools undercount it badly, so check raw referrers rather than a prebuilt channel
bucket.

**There is no second discipline to buy here**, and this is worth saying because
an industry has grown up selling one. Google's own published position is that
optimizing for generative AI search is optimizing for the search experience, and
thus still SEO. The pages above are the AI-search work.

**Do not add an `llms.txt` file.** It is the most recommended tactic in this area
and it does nothing. Ahrefs looked at 137,210 domains in May 2026 and found 97%
of `llms.txt` files received zero requests from any bot; Google has said Search
ignores the file; no major crawler has committed to consuming it. Google's same
guidance separately rejects content chunking, AI-rephrasing and mention farming.
Check the current state before acting on this either way, but do not add the file
on the strength of a blog post recommending it.

**Do not go buying backlinks for AI visibility either.** The published
correlations put branded mentions across the open web well ahead of backlinks for
whether an engine names you, with video platform mentions ahead of both, and
backlink metrics close to the bottom. Read that carefully, because it is
correlational and comes from vendors who sell link tools: it says which brands
get named, not what makes an engine name them, and large brands accumulate both.
The safe conclusion is narrow and still useful, which is that link building is
the worst-evidenced thing to spend a solo founder's money on here, and being
genuinely talked about is the better-correlated signal.

## Other languages are mostly empty

If the product works in other markets, translated pages rank far faster than
English ones, because almost nobody writes them. Sort target markets by spend per
head rather than population, and have a native speaker read anything that will be
in front of a buyer. A machine translated page that reads oddly is worse than no
page.
