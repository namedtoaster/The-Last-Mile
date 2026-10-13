# The status board

One row for everything between the app and the stores, so the user can see where the
release stands at a glance, on a phone or a desktop. The ship skill keeps the rows in
a status file; `scripts/board.mjs` (in this skill's folder) turns them into an
animated page and a board in the terminal.

## Where it lives

`store/status.json` in the project, next to `store/listing.md`. Commit it: it is the
release's state, and the next session starts from it. The page the script writes
(`store/status.html`) is rebuilt every run, so the project can ignore it in git.

## Showing it

```
node <this skill's folder>/scripts/board.mjs store/status.json
```

It checks every row that has a `url` (a page the stores need to load), prints the
board, and writes the page. Then:

- **Show the page.** It is the board meant for people: on the phone it opens in the
  Claude app, on a desktop add `--open` to open it in the browser.
- **Give the board's gist in a line or two,** led by what only the user can do, since
  the terminal output may not show its colors where the user reads it.
- A row the script could not reach (a blocked network in a cloud session) keeps its
  state and says so. Do not report a page as live from that.

## The file

```json
{
  "app": "MyApp",
  "version": "1.2.0",
  "build": 42,
  "updated": "2026-10-13T14:00:00Z",
  "items": [
    { "group": "Accounts", "title": "Apple Developer Program", "state": "done", "detail": "Active", "owner": "you" },
    { "group": "Accounts", "title": "Google Play closed test", "state": "active", "progress": { "done": 6, "total": 14, "unit": "days" }, "owner": "you" },
    { "group": "Web pages", "title": "Privacy policy", "url": "https://myapp.com/privacy" },
    { "group": "App", "title": "Rejection traps", "state": "done", "detail": "30 checked, 0 found" },
    { "group": "Review", "title": "iOS review", "state": "waiting", "detail": "In Review", "since": "2026-10-13T09:14:00Z" }
  ]
}
```

| Field | Meaning |
| --- | --- |
| `group` | Heading the row sits under. Rows of a group stay together, in order. |
| `title` | What it is, in the user's words. |
| `state` | `done`, `active` (being worked on), `waiting` (on a store or someone else), `blocked` (something must be fixed), `todo`. |
| `detail` | One short line: what was found, or what happens next. |
| `owner` | `you` when only the user can do it (paying, agreements, a console only form). These also show in a callout at the top. |
| `progress` | `{ "done", "total", "unit" }` when it is countable: days of a closed test, screenshots captured. |
| `since` | When the current state began (ISO time), shown as "for 2 days". Use for reviews. |
| `url` | A page that must load. The script checks it each run and sets the state itself: `done` when it loads, `blocked` when it returns an error. |

## The rows

Start from what step 0 found, one row per thing the user would ask about. Drop rows
that do not apply (no Android row for an iOS only app). Typical groups:

- **Accounts:** Apple Developer Program, Google Play account, the Google closed test
  if the account needs one, agreements, tax and banking when the app sells anything.
- **Web pages:** privacy policy, support, account deletion, each with its `url`.
- **App:** rejection traps (how many checked, how many found), version and build
  number, release build tested.
- **Listing:** copy, screenshots, privacy answers, review notes and demo account.
- **Review:** one row per store, from upload to live.

Every state comes from something checked this session or recorded in `SHIPPING.md`,
never assumed. Review status comes from the user, or from the store tools the project
already uses (for example `eas submit` output or fastlane); if neither says, leave the
row as it was and ask.

Update the file at the end of each step and whenever a row changes, set `updated`,
and show the board when it says something new: the end of step 0, after the
rejection sweep, after submitting, and whenever the user asks where things stand.
