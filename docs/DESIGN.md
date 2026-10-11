# Design

Why The Last Mile is shaped the way it is, and what comes next. Decided
2026-10-11. The full working notes live in Dave's design doc; this is the summary
the repo needs.

## What it is

A methodology plugin for Claude Code (and other agents that read skills): stages
from idea to launch to growth, each with skills that do the work and leave
documents behind. Built on how MyMealStream was actually built and shipped: 1,220
commits from February to October 2026, about 100 dated gotchas, and two store
launches.

- **Audience:** people who already use Claude Code. A website for planning and
  tracking, talking to Claude Code through an MCP server, comes later and stays
  closed source.
- **Stack:** Expo and React Native. Expo's official skills cover general Expo
  knowledge; this repo links to them and adds the process, the business layer and
  the traps.
- **Tools first, not a journal.** Skills, scripts, templates and code to drop into
  an app. The story of how it was built belongs in the course.

## Decisions

| Decision | Detail |
| --- | --- |
| Public repo under namedtoaster, MIT license | The hosted product stays closed; the license cannot protect an idea anyway |
| Text only logo | ASCII banner, narrow enough for phones |
| Curated skills | Fixes, improvements and traps by pull request; new skills start in Discussions |
| No session start skill | Unused in practice; its useful parts moved into session end and the goals file |
| Session end is fully automatic | No wrap up questions; a short summary at the end |
| Push behaviour comes from the setup interview | Straight to main, or a branch with a pull request |
| Goals in 6 week cycles | One small goals file; one short reminder when a cycle ends; "No current goal set" when there is none |
| reference-hunt, not "steal" | Mobbin first when connected, else user screenshots and App Store screenshots; only describe screens someone has actually seen |
| Traps live in the ship skill's reference | Only the everyday ones go in a project's rules file |
| Facts carry receipts | Source, last checked date, flexible wording; a fact-check skill and a monthly refresh |
| Scope goes past launch | Every growth and marketing tool Dave can offer, labelled honestly with how it went |

## Roadmap

**Version 0.1 (this):** setup, session-end, ship, the traps reference and facts file.

**Next skills:**

| Skill | What it does | Source |
| --- | --- | --- |
| set-goals | Writes or renews the 6 week goal and closes the last cycle | Replaces MyMealStream's weekly planning, quarter sync and progress review |
| research | Answers a question and files it in the right existing doc first | MyMealStream research skill |
| reference-hunt | Finds how real apps solve a screen; short answer with links, full write up saved | MyMealStream competitor card skill, reworked |
| port-feature | Brings a feature over from another of your own repos | NestAKeep's port skill |
| prove-it | Shows a change working: component tests, seeded simulator screenshots, a smoke test of every screen, release build runs, browser preview for cloud sessions, end to end journeys, and content capture as an experimental recipe | MyMealStream testing setup |
| fact-check | Re-checks facts against current official docs and updates dates | New |
| analytics | Sets up key events and a funnel, audits for orphaned or miscounted events | MyMealStream analytics skills |
| store-listing | Name, subtitle, keywords, screenshots | MyMealStream listing work |
| creator-codes | Free premium codes for a creator's audience, with attribution | MyMealStream referral code skill |
| ugc-brief | Finding small creators, outreach, and a short brief | MyMealStream outreach playbooks |
| release-notes | Rewrites changes as notes users want to read | MyMealStream release notes skill |

**Also planned:** the test after edit hook, the release checklist check script, the
"treat me as free" development switch, the test link that jumps to any seeded
screen, the plugin that strips unwanted Android media permissions, Discord alerts,
Railway notes, and a scheduled job that re-checks facts and opens a pull request.

## How growth tactics went for Dave

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
