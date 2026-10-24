```
 _____ _            _              _     __  __ _ _
|_   _| |__   ___  | |    __ _ ___| |_  |  \/  (_) | ___
  | | | '_ \ / _ \ | |   / _` / __| __| | |\/| | | |/ _ \
  | | | | | |  __/ | |__| (_| \__ \ |_  | |  | | | |  __/
  |_| |_| |_|\___| |_____\__,_|___/\__| |_|  |_|_|_|\___|
```

## Build it with AI. Ship it with one command.

**`/ship` takes your app from your laptop to the App Store and Google Play.** Any
stack.

Building it was the fun part. Then comes the last mile: developer accounts,
certificates, build numbers, screenshots in five sizes, privacy questionnaires, and
a reviewer who rejects you for saying "Google Play" on your paywall. It's where most
AI built apps quietly stall.

Your app doesn't need to be perfect. It needs to be in the store, because that's
the only place it can get a user, and a user is the only person who can ever pay
you for it.

`/ship` handles the last mile. Getting real users and paying users comes next, and
that's where this repo is going.

```
/plugin marketplace add namedtoaster/the-last-mile
/plugin install the-last-mile@the-last-mile
```

Then, in your app's folder:

```
/ship
```

![Version](https://img.shields.io/badge/version-0.2.0-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![Stage](https://img.shields.io/badge/status-early-orange)

## What `/ship` does

1. **Works out what you have.** Expo, React Native, Flutter, Swift, Kotlin,
   Capacitor, .NET MAUI, Kotlin Multiplatform, or a web app from Lovable, Bolt or v0
   that needs wrapping first. iOS, Android or both. First release or an update.
2. **Finds what will get you rejected, before a reviewer does.** It checks your code
   against a list of traps that actually caught real apps, each with the official
   rule it comes from and the date someone last checked it.
3. **Fixes what it can.** Version and build numbers, permissions you don't need, text
   that names the other store, missing account deletion, and so on.
4. **Builds the release version and has you test it**, because some bugs only exist
   there.
5. **Writes your store listing.** Name, subtitle, keywords, description, review notes,
   and a draft of the privacy answers based on the SDKs your app actually uses.
6. **Uploads and submits** from the command line where the stores allow it, after you
   say yes.
7. **Tells you exactly what only you can do,** like paying for the developer account or
   signing the agreements, then picks up where it left off.
8. **Shows where you stand.** `/ship status` puts every item on a board, on your
   phone or your desktop, with what only you can do at the top.

To see what it finds without starting a release, run `/ship sweep`. It checks the app,
fixes what you agree to, and stops before the version bump. Nothing is built,
uploaded or submitted.

It looks up the current store rules every time instead of trusting its memory, because
Apple and Google change them.

> [!NOTE]
> Early release. The shipping process comes from a real app live on the App Store and
> Google Play. The paths for other stacks follow each framework's official docs and
> have had less real-world use. Tell us what breaks.

## What it won't do

- **Judge your idea.** It gets you through review. Whether people want the app is still up to you.
- **Click "Submit for review" without asking you.**
- **Make up store rules.** Every rule it checks has a link to Apple's or Google's own
  page. If it can't check one, it says so.
- **Guarantee approval.** Every rule it checks is one someone read and dated against
  Apple's or Google's own page. A reviewer is still a person, and one can say no for a
  reason nobody has written down. That's what the next section is for.

## Got rejected anyway?

Run `/ship` with the rejection message. It fixes only what the reviewer asked for,
drafts a short reply, and resubmits.

Then [tell us what caught you](https://github.com/namedtoaster/the-last-mile/issues/new?template=this-caught-me.yml).
Every rejection someone reports becomes a check for everyone after them.

## Then: users. Then: money.

Being in the store gets you zero users on its own. Nobody searches for your app.

Next up in this repo, from what actually worked (and didn't) for a real app:

| Next skill | What it does |
| --- | --- |
| analytics | Tracks the few things that matter: who opened it, who came back, who paid |
| store-listing | A name, subtitle, keywords and screenshots someone might actually tap |
| creator-codes | Free premium codes for a creator's audience, with tracking. Cost so far: nothing |
| ugc-brief | Finding small creators and paying them to make videos. The best move so far |
| release-notes | Turns your commit log into notes people want to read |

Fair warning: the author has a handful of paying users, not a growth machine. These
skills will say what worked, what didn't, and how sure anyone is.

## Other agents

Cursor, Codex, Gemini CLI and other agents that read skills:

```
npx skills add namedtoaster/the-last-mile
```

I only use Claude Code, so these are untested anywhere else. If something breaks in
your agent, [tell me](https://github.com/namedtoaster/the-last-mile/issues/new?template=other-agent.yml)
or send the fix.

**Cloud sessions** (Claude Code on the web and the Claude app on your phone) do not
load plugins. Keep a synced copy of the skills in your project instead, which works
on every device. [sync/README.md](sync/README.md) covers setting it up (one prompt),
staying current with `/sync`, and fixing a skill from your own fork.

## The rest of the kit

`/ship` stands on its own. These are for the days between releases. Most are
written for any stack; see-it-work is still Expo first.

| Skill | What it does |
| --- | --- |
| ship | Rejection sweep, version bump, release build, store listing, upload and submit |
| extract-lessons | Harvests a finished session for anything general enough to help beyond one project, and usually finds nothing |
| fact-check | Re-checks the store rules against the official pages and updates their dates |
| setup | Interview that writes your rules file, first goal, handoff file and release checklist |
| session-end | Wraps up a session: checks, docs, gotchas, goals, commit only what this session touched, push |
| see-it-work | Shows a change working with seeded simulator screenshots and release build smoke runs (Expo) |
| reference-hunt | Finds how real apps solve a screen and saves a reference card |
| store-listing | Writes the store listing from evidence: keywords a small app can win, one lane for the name and subtitle, three screenshot captions, and a dated record to measure changes against |
| screen-atlas | Captures every screen in your app and lays them out as the flows people walk, so you can see the whole thing at once |
| feature-demo | Builds a tap-through demo of a feature in the app's own colours, so you can see it and argue with it before it ships |
| connect-tools | Connects Claude to the services your app uses (RevenueCat, PostHog, Sentry, Expo and more) through their official MCP servers, from a checked list |
| research | Answers a question from official sources and files it where it will be read again |
| set-goals | Writes the 6 week goal and closes the last cycle in a few lines |
| port-feature | Brings a feature over from another of your own repos, adapted to this one |
| improve-skill | Fixes a skill that misfired, from the project where it happened, as a pull request here |
| lean-out | Finds the structural clutter that makes every new change land wrong, ranked by what it would have prevented |
| one-time-surface | Builds or checks a hint, tour or review ask meant to appear once, so it works for real people and not just on your phone |
| mine-community | Mines a founder community for what is working, filtered for survivorship bias and promo posts |
| search-pages | Finds the search phrases you can win and builds the pages that get the app found |
| sync | Brings a project's copy of these skills up to date and pushes it, from your phone or desktop |

## Contributing

The most useful thing you can send is a trap: something that got your app rejected or
broke your release, with the official page if you have one. Fixes for a stack you know
well come next. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Where this comes from

Built while shipping [MyMealStream](https://mymealstream.com/), a meal planning app on
the App Store and Google Play: 1,220 commits with Claude Code, one person, and
rejections from both stores along the way. The traps are the ones that cost real days.

## About the course

I'm putting together a course on how I actually did this: idea to an app in the App
Store with paying users, built with Claude Code. I don't have a lot of users or a lot
of money, but I got there. If you'd be interested, leave a comment on
[this discussion](https://github.com/namedtoaster/the-last-mile/discussions/1). That's
how I'll tell you when it's out. No email, no sign up.

## License

MIT. See [LICENSE](LICENSE).
