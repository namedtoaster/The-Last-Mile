# Changelog

## 0.1.0 (unreleased)

- improve-skill: fix a skill that misfired, from inside the project where it
  happened, as a pull request here. session-end now lists skill problems.
- sync: a script and a GitHub workflow that copy the skills into a project's
  `.claude/skills/`, so cloud sessions on the phone and web can use them.
- The plugin no longer pins a version, so installs follow each commit instead of
  staying on a cached copy until the number changes.
- First public version with nine skills: setup, session-end, see-it-work,
  reference-hunt, research, set-goals, port-feature, ship and fact-check.
- see-it-work templates: the test after edit hook, a test only seed link, smoke cases
  and a coverage check.
- Store traps reference with sources and verification status: 13 of 20 traps
  checked against official pages on 2026-10-11.
- Facts file for numbers that change, including store fees and Mobbin pricing.
- Contribution setup: templates, code owners and a validation check for pull requests.
