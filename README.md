```
 _____ _            _              _     __  __ _ _
|_   _| |__   ___  | |    __ _ ___| |_  |  \/  (_) | ___
  | | | '_ \ / _ \ | |   / _` / __| __| | |\/| | | |/ _ \
  | | | | | |  __/ | |__| (_| \__ \ |_  | |  | | | |  __/
  |_| |_| |_|\___| |_____\__,_|___/\__| |_|  |_|_|_|\___|
```

**From a working build to an app people pay for.** Skills and templates for Claude Code that take an Expo app through shipping, store review and the first users, extracted from an app that actually launched.

![Version](https://img.shields.io/badge/version-0.1.0-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![Stage](https://img.shields.io/badge/status-early-orange)

> [!NOTE]
> Early release. The building and shipping parts come from a real app on the App Store and Google Play. The growth parts are less proven, and they say so.

## Choose your path

| You are... | Start with | You get |
| --- | --- | --- |
| Starting a new app | `/the-last-mile:setup` | A short interview that writes your rules file, your first goal and a handoff file |
| Building day to day | `/the-last-mile:session-end` | Checks run, docs and gotchas updated, only this session's files committed, pushed |
| Getting into the stores | `/the-last-mile:ship` | A release checklist, version bump, store submission steps and the traps that catch first launches |

The short forms `/setup`, `/session-end` and `/ship` work too, unless another plugin uses the same name.

## Install

**Claude Code:**

```
/plugin marketplace add namedtoaster/the-last-mile
/plugin install the-last-mile@the-last-mile
```

**Cloud sessions** (Claude Code on the web and the Claude app on your phone) do not load plugins. Copy the skills into your project instead and keep them in sync: see [sync/README.md](sync/README.md).

**Other agents that read skills** (Cursor, Codex, Gemini CLI and others):

```
npx skills add namedtoaster/the-last-mile
```

## The basic workflow

1. **Run setup once.** It asks one question at a time: what the app does, who it is for, how you want Claude to talk to you, how you push code, and your first 6 week goal.
2. **Build.** Describe what the person sees and taps. Use reference-hunt before designing a screen, and see-it-work to see each change working instead of trusting a passing test.
3. **End every session with session end.** It runs your checks, records anything surprising as a dated gotcha, updates the docs, checks your goal and commits only what this session touched.
4. **Ship with ship.** It checks the current store rules before telling you what to do, because they change.

## What's inside

| Skill | What it does |
| --- | --- |
| setup | Interview that writes the rules file, goals file, handoff file and release checklist |
| session-end | Fully automatic wrap up: checks, docs, gotchas, goals, commit, push |
| see-it-work | Shows a change working: tests written first, seeded simulator screenshots, a smoke test of every screen, release build runs |
| reference-hunt | Finds how real apps solve a screen, from screens someone has actually seen, and saves a reference card |
| research | Answers a question from official sources and files it where it will be read again |
| set-goals | Writes the 6 week goal and closes the last cycle in a few lines |
| port-feature | Brings a feature over from another of your own repos, adapted to this one |
| ship | Release checklist, version bump, submission steps, and a reference of store traps with sources |
| fact-check | Re-checks store rules and facts against the official pages and updates their dates |
| improve-skill | Fixes a skill that misfired, from the project where it happened, as a pull request here |

Coming next: growth skills (analytics, store listing, creator codes, UGC briefs, release notes).

## Philosophy

- **A rules file is the product.** Every surprise becomes a dated rule, so the next session starts smarter.
- **Done means seen working,** not a passing test.
- **Facts carry receipts.** Every store rule here has a source and a last checked date, and is worded to survive the stores changing their minds.
- **Honest about what is proven.** Building and shipping worked. Growth is still being figured out.

## Contributing

Fixes, improvements to existing skills and new traps with sources are welcome by pull request. New skills start as an idea in Discussions. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Where this comes from

Built while making [MyMealStream](https://mymealstream.com/), a meal planning app live on the App Store and Google Play.

## About the course

I'm putting together a course on how I actually did this: idea to an app in the App Store with paying users, built with Claude Code. I don't have a lot of users or a lot of money, but I got there, and I'm still refining the process as I go. The course will be exactly what I did, including what went wrong. If you'd be interested, give [this discussion](https://github.com/namedtoaster/the-last-mile/discussions/1) a thumbs up. No email, no sign up.

## License

MIT. See [LICENSE](LICENSE).
