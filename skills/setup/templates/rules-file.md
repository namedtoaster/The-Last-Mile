# <App name>

<One sentence: what the app does.>

**The loop:** <the one sentence loop>.
**For:** <who, and the moment they reach for it>.

## Settings

Read by the session-end and ship skills.

| Setting | Value |
| --- | --- |
| Check command | `<npm run check>` |
| Push to | `<main, or a branch with a pull request>` |
| Docs to review at session end | `CURRENT_WORK.md`, `GOALS.md`, `BACKLOG.md`, `FEATURES.md`, `docs/ALGORITHMS.md` |
| Analytics check at session end | `<off>` |
| Mobbin connected | `<yes or no>` |

## How to talk to me

<Filled from the interview. Example: Short replies. Lead with the answer. Describe
what the user experiences instead of naming code. No long dashes.>

## Standing decisions

Decided and closed. Do not re-propose these unless I reopen them.

- **<YYYY-MM-DD>: <decision>.** <Why, in one line.>

## Gotchas

Every surprise that cost real time becomes an entry here, dated, with the symptom,
the cause, the fix and the general rule. Newest first.

- **Never run the clean rebuild (`expo prebuild --clean`) once native files are
  committed (<YYYY-MM-DD>).** It regenerates the native folders and silently drops
  any hand written native changes (Podfile hooks, extra native files, deployment
  targets). Plain `npx expo prebuild` is additive; read `git diff ios/ android/`
  after every prebuild.
- **Some code works while developing and crashes only in the store build
  (<YYYY-MM-DD>).** Release builds run on Hermes without the development
  conveniences. Seen in practice: `console.time`, and UUID helpers that rely on
  Node crypto, both throwing "undefined is not a function" with no stack. Test the
  release build before submitting, and keep a pure JavaScript id generator.

## Architecture

<Stack, folders, where state lives. Ask Claude to fill this in once there is code.>

## Commands

- `<npm start>`: <what it does>
- `<npm run check>`: <what it runs>

## Conventions

- <Naming, styling and testing rules the project follows.>

## Docs

One line per doc, with its headline number, so the summary is enough most of the time.

- `CURRENT_WORK.md`: where things stand and what is next
- `GOALS.md`: the current 6 week goal
