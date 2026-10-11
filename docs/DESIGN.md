# Design

Why The Last Mile is shaped the way it is, and what comes next.

## What it is

A methodology plugin for Claude Code (and other agents that read skills): stages
from idea to launch to growth, each with skills that do the work and leave
documents behind. Built on how a real Expo app was built and shipped: 1,220
commits from February to October 2026, about 100 dated gotchas, and launches on
both stores.

- **Audience:** people who already use Claude Code or another agent that reads
  skills.
- **Stack:** Expo and React Native. Expo's official skills cover general Expo
  knowledge; this repo links to them and adds the process, the business layer and
  the traps.
- **Tools first, not a journal.** Skills, scripts, templates and code to drop into
  an app.

## Roadmap

**Version 0.1 (this):** setup, session-end, ship, the traps reference and facts file.

**Next skills:**

| Skill | What it does | Source |
| --- | --- | --- |
| set-goals | Writes or renews the 6 week goal and closes the last cycle | Replaces separate weekly planning, quarter sync and progress review skills |
| research | Answers a question and files it in the right existing doc first | The author's research skill |
| reference-hunt | Finds how real apps solve a screen; short answer with links, full write up saved | The author's competitor design card skill, reworked |
| port-feature | Brings a feature over from another of your own repos | The author's port skill |
| prove-it | Shows a change working: component tests, seeded simulator screenshots, a smoke test of every screen, release build runs, browser preview for cloud sessions, end to end journeys, and content capture as an experimental recipe | The author's testing setup |
| fact-check | Re-checks facts against current official docs and updates dates | New |
| analytics | Sets up key events and a funnel, audits for orphaned or miscounted events | The author's analytics skills |
| store-listing | Name, subtitle, keywords, screenshots | The author's store listing work |
| creator-codes | Free premium codes for a creator's audience, with attribution | The author's referral code skill |
| ugc-brief | Finding small creators, outreach, and a short brief | The author's outreach playbooks |
| release-notes | Rewrites changes as notes users want to read | The author's release notes skill |

**Also planned:** the test after edit hook, the release checklist check script, the
"treat me as free" development switch, the test link that jumps to any seeded
screen, the plugin that strips unwanted Android media permissions, Discord alerts,
Railway notes, and a scheduled job that re-checks facts and opens a pull request.

## How growth tactics went for the author

The growth skills will carry these labels. This part is less proven than building
and shipping: a handful of paying users, not a growth machine.

| Tactic | Verdict |
| --- | --- |
| Paid UGC creators | Best move so far; affordable through a UGC platform |
| Creator codes with free premium | Keep using; costs nothing |
| Automated demo video pipeline | Mixed; never reuse other creators' clips without permission |
| Own content, including 3D videos | Did not work; the tooling was somewhat useful |
| App Store search work | Too early until people arrive from outside the store |
| Commenting under other posts | Not sustainable |
| Outreach contractor | Not worth the money |
| Coaches, roundup pitches | Unclear or not worth it |
