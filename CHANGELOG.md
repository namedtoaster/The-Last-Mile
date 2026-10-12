# Changelog

## 0.2.0 (unreleased)

- ship asks about the web pages the stores need (privacy policy, support, account
  deletion) in its first step, since the privacy link is built into the app, and
  says when a custom domain is worth it.
- New trap: settle the bundle id and package name before the first upload. The Apple
  privacy trap now covers the link inside the app (5.1.1), and the Google closed test
  trap says the page is silent on second apps.
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
