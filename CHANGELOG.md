# Changelog

## 0.2.0 (unreleased)

- `ship`: the status board gains a `risk` state, for a rule the app may be breaking
  that has already shipped through approved releases. The board had only `blocked`,
  so on an app already in the stores every long standing finding painted red next to
  the one that was actually stopping the release. The sweep now also checks a listing
  rule against the live listing rather than the project's draft copy, and names which
  store the rule belongs to.

- New skill `extract-lessons`: harvests a finished session for anything general enough
  to help beyond one project, routes it to the right skill, spots when a cluster of
  homeless lessons means the toolkit has a gap, and recognises when a body of knowledge
  is its own domain and wants a separate repo rather than bloating this one. Its stated
  default outcome is to find nothing.

- Other agents: the README says plainly that only Claude Code is tested, a "Doesn't
  work in my agent" form and label take reports, and CONTRIBUTING asks whoever adds
  support for an agent to keep it working.

- Contributing a trap is easier: "This caught me" is now a form whose fields match a
  trap entry, and a `trap` label exists for it. ship drafts the report itself after a
  rejection, with the project's details stripped. improve-skill can add a trap and
  works through a fork for anyone without push access. CONTRIBUTING promises a reply
  within 48 hours.

- Websites: setup asks whether the project is web only and sets a website goal;
  session-end words checklist items for the live site after a deploy; see-it-work
  has a website section (Playwright screenshots at phone and desktop widths, real
  sign in, journeys from the real arrival URL); ship stops early for a web only
  project instead of walking store steps.

- reference-hunt: picks the platform from the rules file before searching, so a
  web only project gets web screens from Mobbin instead of iOS ones, and uses live
  public pages in place of store listings when the project is a website.

- setup: looks at the user's other projects for a rules file that already says how
  they like to be talked to, and offers to carry that and any "every repo"
  decisions over, instead of asking again.

- connect-tools: after connecting a server, checks this app's project is in the
  account it reached, since people often have two accounts with a vendor.

- sync: a way to set up the project copy when the agent refuses to run a script it
  just downloaded (use a local clone of the source), and a check for the plugin
  being enabled as well, which loads every skill twice, with the command that turns
  it off for one project.

- mine-community now reads a community's public feed first, instead of asking the
  user to open a URL in a signed in browser and save the file. Reddit refuses its
  JSON endpoint to scripts but answers the Atom feed with the full post body, so
  the manual step was unnecessary. The saved page stays as the fallback for when
  there is no feed or the scores are needed, and the skill now says what a feed
  cannot tell you: at most 25 entries, and no score or comment count.

- New skill: store-listing. Picks keywords by checking who already owns each phrase
  (a small script asks Apple's public search API for the top apps and their rating
  counts), spends the name and subtitle on one lane, writes both stores' copy and the
  first three screenshot captions, finds a screenshot look from the live listings,
  and keeps a dated keyword file with a baseline and change log. Ship's listing step
  now hands off to it.
- ship: TestFlight is an option, not a step. A release build installed straight from
  Xcode is enough to test on iOS, and many people submit straight to review.
- The sync guide now covers the whole loop for anyone's repos: plugin or project copy,
  a one prompt setup, updating the plugin, and using your own fork as the source so
  your skill fixes reach your projects before (or without) a pull request here.
- Every ship reference re-checked claim by claim against the saved official pages
  (2026-10-19). Fixed wrong or stale rules (template apps, login exceptions, account
  deletion, screenshot sizes, DNS record rules, RevenueCat launch steps), added missed
  ones (Google health declaration, contacts permission, Test Store key crash, first
  subscription ships with an app version), and marked what is only experience.
- Keeping the facts accurate is now a routine, not a one off. The weekly snapshot job
  opens a "Re-check facts" issue naming which reference files cite a page that
  changed or failed. Fact-check covers every ship reference and console steps, with a
  new status for what the user's own screen showed, and Apple's script-built
  documentation pages are now saved through Apple's JSON.
- Play Console's Create app form now asks for the package name, which Google's help
  page does not show yet. The trap says so, and that the user's screen beats the page.
- ship: where the 12 closed test testers actually come from. Reciprocal testing
  communities fill the headcount quickly and cannot answer the engagement question the
  production application asks, so a test made only of swaps can hold 12 for the full 14
  days and still be sent back for more testing. The trap now names that as the cause of
  the April 2026 refusal.
- ship: record where the store pages are hosted when another project's server
  serves them, and check a static only host can answer app links before relying
  on it. session-end: the summary ends with a table of items, with what needs the
  user first.

- New skill, one-time-surface: for anything meant to appear once and then stop,
  a coach mark, tooltip, primer or review ask. The three questions that decide
  whether it works for real people, why a count beats a boolean, the rule that
  nothing may be decided from a store that has not answered yet (and that a
  failed read must still answer), and the number to watch after release, which
  is how many eligible people never saw it.

- New skill, lean-out: find the structural clutter that is making every new
  change land wrong, ranked by what it would have prevented rather than by
  taste. Produces an audit and a list to work through in pieces, says plainly
  when not to run it, and carries the loop for doing the work: green before and
  after is the floor, and every extracted rule needs a test verified red by
  reverting, because a suite that was green while the bug existed will be green
  after you refactor it.

- New skill, feature-demo: builds a tap-through demo of a feature in the app's own
  colours and fonts, so a flow can be seen and argued with before it is finished,
  with references for the preview harness and the traps that waste the most time.

- New skill, connect-tools: finds the services a project uses, connects their
  official MCP servers with the right scope, proves each one works, and records
  them in the rules file. Ships a list of 18 official servers checked on the
  vendors' own pages on 2026-10-17, and names the two stores that have none.

- Contributing: a policy for outside skills and tools published elsewhere. Point
  at them rather than copying them in, check the thing exists before
  recommending it, read what a script will run, test one of its claims against
  the primary source, and date the recommendation.

- see-it-work: how to test a state only a real paying or comped customer can
  reach, by granting a throwaway identity the entitlement through the provider's
  own API and revoking it after, plus the rule that an item nobody can perform
  does not belong on a release checklist.

- New payments reference for ship: store products and RevenueCat in the order they
  must be set up, with RevenueCat's own docs saved weekly by the snapshot job.
- The ship journal keeps stats: sessions, days, hands on time in consoles and tokens,
  next to the level and platforms chosen. `docs/IDEAS.md` holds the next two ideas:
  a leaderboard that rewards shipping well, and shipping from a phone end to end.
- Release levels and platforms: setup asks which stores (both, iOS only, Android
  only) and how much before the first launch (Quick ship, Standard, Full features),
  saves both in Settings, and ship plans only that much (`references/levels.md`).
- ship's rejection sweep now walks the full rulebooks (Apple's App Review
  Guidelines, Google Play's Developer Program Policy and Health Content policy),
  section by section from saved copies, and checks bundled content and copy as well
  as code. The traps stay as the list of what has actually caught apps.
- New trap: content a model rewrote can lose its safety caveat, and how to guard
  the prompt and check the bundled content.
- ship keeps a journal from the first run to live on both stores (`store/journal.md`):
  what moved, who did it, what was caught, the user's own words and screenshots,
  ready to become a launch post at the end.
- A status board for ship: one row for everything between the app and the stores,
  kept in `store/status.json`. `scripts/board.mjs` shows it as an animated page that
  works on a phone and as a board in the terminal, and checks the web pages the
  stores need are live. No dependencies. Run `/ship status` to see where you stand.
  Pages a cloud session cannot reach are checked from GitHub by a small workflow,
  so a blocked network never leaves a row unknown. No settings or keys.
  Rows that need you carry links straight to where it gets done (the domain search
  with your name filled in, the console page), as buttons on the page.
- New `/sync` skill: updates a project's copy of the skills, commits and pushes,
  so cloud sessions on the phone never need a command run by hand.
- New domains reference for ship: when a domain is worth it, the bare domain DNS
  rule, and where to add records and email forwarding at Porkbun, Namecheap,
  Cloudflare, GoDaddy and Squarespace, for Railway, Vercel, Netlify and GitHub Pages.
- A weekly job saves a text copy of every official page the traps cite into
  `sources/` on the `snapshots` branch, and fact-check reads it when a session's network blocks the page
  (cloud sessions block Google's help site by default). No settings needed, and a
  changed copy flags a rule that moved.
- ship asks about the web pages the stores need (privacy policy, support, account
  deletion) in its first step, since the privacy link is built into the app, and
  says when a custom domain is worth it.
- New trap: settle the bundle id and package name before the first upload. The Apple
  privacy trap now covers the link inside the app (5.1.1), and the Google closed test
  trap now says it applies to every app on the account, not only the first.
- fact-check keeps going when a page is blocked: other routes, a domain limited
  search as a lead, and the exact host to allow in the session's network settings.
- ship works for any stack: Expo, React Native, Flutter, native iOS and Android,
  Capacitor, .NET MAUI, Kotlin Multiplatform, and web apps that need wrapping. A new
  stacks reference covers versions, builds and uploads for each, from official docs.
- ship works without setup, keeps its answers in `SHIPPING.md`, drafts the store
  listing and privacy answers, and uploads and submits after asking.
- Nine new traps checked against official pages on 2026-10-12, including wrapped
  websites (4.2), social login (4.8), demo accounts, privacy manifests and web apps
  on Google Play. Expo only traps moved to their own section.
- New facts: listing limits, screenshot sizes and the current Xcode minimum.
- README leads with `/ship`.
- improve-skill: fix a skill that misfired, from inside the project where it
  happened, as a pull request here. session-end now lists skill problems.
- sync: a script and a GitHub workflow that copy the skills into a project's
  `.claude/skills/`, so cloud sessions on the phone and web can use them.

## 0.1.0 (unreleased)

- First public version with nine skills: setup, session-end, see-it-work,
  reference-hunt, research, set-goals, port-feature, ship and fact-check.
- see-it-work templates: the test after edit hook, a test only seed link, smoke cases
  and a coverage check.
- Store traps reference with sources and verification status: 13 of 20 traps
  checked against official pages on 2026-10-11.
- Facts file for numbers that change, including store fees and Mobbin pricing.
- Contribution setup: templates, code owners and a validation check for pull requests.
