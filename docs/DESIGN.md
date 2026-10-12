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
- **Stack:** any, for shipping. The ship skill works out the stack and follows its
  official docs (`skills/ship/references/stacks.md`). Store rules are the same for
  every stack, so the traps are too, apart from a stack specific section. Some of
  the day to day skills, see-it-work most of all, are still Expo first.
- **The hook is `/ship`.** Getting an AI built app into the stores is where most of
  them stall, and nothing else owns that step.
- **Tools first, not a journal.** Skills, scripts, templates and code to drop into
  an app.

## Roadmap

**Version 0.1 (this):** setup, session-end, see-it-work, reference-hunt, research,
set-goals, port-feature, ship and fact-check, with the store traps reference, the
facts file, and see-it-work's templates (including the test after edit hook).

**Next skills:**

| Skill | What it does | Source |
| --- | --- | --- |
| analytics | Sets up key events and a funnel, audits for orphaned or miscounted events | The author's analytics skills |
| store-listing | Name, subtitle, keywords, screenshots | The author's store listing work |
| creator-codes | Free premium codes for a creator's audience, with attribution | The author's referral code skill |
| ugc-brief | Finding small creators, outreach, and a short brief | The author's outreach playbooks |
| release-notes | Rewrites changes as notes users want to read | The author's release notes skill |

**Also planned:** the release checklist check script, the version bump script, the
plugin that strips unwanted Android media permissions, Discord alerts, Railway
notes, and a scheduled job that runs fact-check monthly and opens a pull request.

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
