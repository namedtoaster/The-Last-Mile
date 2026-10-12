```
 _____ _            _              _     __  __ _ _
|_   _| |__   ___  | |    __ _ ___| |_  |  \/  (_) | ___
  | | | '_ \ / _ \ | |   / _` / __| __| | |\/| | | |/ _ \
  | | | | | |  __/ | |__| (_| \__ \ |_  | |  | | | |  __/
  |_| |_| |_|\___| |_____\__,_|___/\__| |_|  |_|_|_|\___|
```

## You built your shitty app. Now ship it.

AI got you a working app in a weekend. It's probably a little shitty. That's fine,
everyone's first one is. But an app that never leaves your laptop has exactly zero
users, and the App Store is where most of these apps go to die: developer accounts,
certificates, build numbers, screenshots in five sizes, privacy questionnaires, and
a reviewer who rejects you for saying "Google Play" on a paywall.

**`/ship` gets it out of your laptop and into the stores.** Any stack. One command.

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

It looks up the current store rules every time instead of trusting its memory, because
Apple and Google change them.

> [!NOTE]
> Early release. The shipping process comes from a real app live on the App Store and
> Google Play. The paths for other stacks follow each framework's official docs and
> have had less real-world use. Tell us what breaks.

## What it won't do

- **Pretend your app is good.** It gets you through review. Whether anyone wants it is
  still on you.
- **Click "Submit for review" without asking you.**
- **Make up store rules.** Every rule it checks has a link to Apple's or Google's own
  page. If it can't check one, it says so.

## Got rejected anyway?

Run `/ship` with the rejection message. It fixes only what the reviewer asked for,
drafts a short reply, and resubmits.

Then [tell us what caught you](https://github.com/namedtoaster/the-last-mile/issues/new?template=this-caught-me.md).
Every rejection someone reports becomes a check for everyone after them.

## Other agents

Cursor, Codex, Gemini CLI and other agents that read skills:

```
npx skills add namedtoaster/the-last-mile
```

## The rest of the kit

`/ship` stands on its own. These are for the days between releases. Most are
written for any stack; see-it-work is still Expo first.

| Skill | What it does |
| --- | --- |
| ship | Rejection sweep, version bump, release build, store listing, upload and submit |
| fact-check | Re-checks the store rules against the official pages and updates their dates |
| setup | Interview that writes your rules file, first goal, handoff file and release checklist |
| session-end | Wraps up a session: checks, docs, gotchas, goals, commit only what this session touched, push |
| see-it-work | Shows a change working with seeded simulator screenshots and release build smoke runs (Expo) |
| reference-hunt | Finds how real apps solve a screen and saves a reference card |
| research | Answers a question from official sources and files it where it will be read again |
| set-goals | Writes the 6 week goal and closes the last cycle in a few lines |
| port-feature | Brings a feature over from another of your own repos, adapted to this one |

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
of money, but I got there. If you'd be interested, give
[this discussion](https://github.com/namedtoaster/the-last-mile/discussions/1) a thumbs
up. No email, no sign up.

## License

MIT. See [LICENSE](LICENSE).
