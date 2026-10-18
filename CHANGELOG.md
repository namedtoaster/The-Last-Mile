# Changelog

## 0.2.0 (unreleased)

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
