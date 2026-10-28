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
node <this skill's folder>/scripts/board.mjs store/status.json --serve
```

It checks every row that has a `url` (a page the stores need to load), prints the
board in the terminal, writes `store/status.html`, and with `--serve` keeps running
on `http://localhost:4100` (`--port` to change it) so the page is **live**: its test
checklist has real checkboxes, ticking one writes straight back to `store/status.json`,
and the page polls so a change made to the file shows up in the browser within a few
seconds. The session reads the ticks back out of the status file.

- **Serve it when the user has a browser on the same machine** and give them the
  address. Run it in the background so the session keeps working while it is up, and
  say that stopping the session stops the page.
- **Without a browser there** (a cloud session, or the user is on their phone), the
  written `store/status.html` is still a complete page: open it with `--open`, or hand
  over the file. Its checkboxes render but cannot be ticked, and the page says so.
- **It is an ordinary local page, not a published artifact.** Nothing leaves the
  machine, so a private release's state stays private, and the file sits in the repo
  where the next session finds it.
- **Give the board's gist in a line or two,** led by what only the user can do, since
  the terminal output may not show its colors where the user reads it.
- Never report a page as live, or as broken, unless a check said so.

## Pages a session cannot reach

Cloud sessions (the Claude app on a phone, Claude Code on the web) block most of the
web, so the script cannot check the user's own site from there. GitHub is always
reachable, so GitHub does the checking: `templates/last-mile-checks.yml` is a
workflow that checks every `url` in the status file from GitHub's network and saves
the results to a `last-mile-checks` branch. The script reads that branch with `git
fetch` whenever it cannot reach a page itself. No settings, no keys, private repos
work.

- **Install it** when the project is on GitHub and has no
  `.github/workflows/last-mile-checks.yml`: copy the template there, commit it with
  the status file, and tell the user in one line what it does.
- **It runs** whenever `store/status.json` is pushed, every six hours, and from the
  Actions tab.
- **For a fresh check** after changing a row or fixing a page: commit and push the
  status file (or start the workflow with the session's GitHub tools), then run the
  script with `--wait`. It waits up to two minutes for results newer than the file.
- A row GitHub has not checked yet says so and keeps its state. If it stays that way,
  the workflow did not run: check the Actions tab is enabled and the file is on the
  branch that was pushed.

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
    { "group": "Web pages", "title": "Domain", "state": "todo", "owner": "you", "detail": "myapp.com looks free", "links": [{ "label": "Register at Porkbun", "url": "https://porkbun.com/checkout/search?q=myapp.com" }] },
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
| `state` | `done`, `active` (being worked on), `waiting` (on a store or someone else), `blocked` (stops the release until it is fixed), `risk` (a rule the app may be breaking that has already shipped through approved releases: real and worth fixing, not a certain rejection), `todo`. |
| `detail` | One short line: what was found, or what happens next. |
| `owner` | `you` when only the user can do it (paying, agreements, a console only form). These also show in a callout at the top. |
| `progress` | `{ "done", "total", "unit" }` when it is countable: days of a closed test, screenshots captured. |
| `since` | When the current state began (ISO time), shown as "for 2 days". Use for reviews. |
| `checks` | Top level, not per row: the release's test checklist, `[{ "id", "text", "note", "done" }]`. Rendered as checkboxes, and when the board is served, ticking one writes `done` back to this file. `id` is yours to pick and must not change once the user has started ticking. |
| `links` | `[{ "label", "url" }]`: where to go to get it done, first one the main button. See below. |
| `url` | A page that must load. The script checks it each run and sets the state itself: `done` when it loads, `blocked` when it returns an error. |

## Links

Every row that is not done and needs the user gets `links`, so they tap once instead
of searching. **The exact page, or no link at all.** A link to a console's front door
is not help: the user can already find their own console, and handing them one says
you did not know where the thing lives. When the references and the current docs give
no exact URL, leave `links` out and put the path to click in the `detail` instead,
said as a path ("Play Console, then Policy, then App content"), so it is honest about
being a direction rather than a destination. One or two links, the main one first.

### Writing a row

A row is read by someone deciding what to do next, so:

- **Say what it is in their words,** not the rule's. "The paywall shows the wrong
  price as the big number" beats the guideline number.
- **Never put a question on the board.** A row whose detail asks the user something
  looks like work that is underway and is not. If the session could not find the
  answer, ask it in the reply, as a question, and leave the board out of it.
- **One row per thing they would ask about.** If they would not ask, it is not a row.
- **A row the user has never thought about needs its first line to say why it is
  there,** or it reads as a problem that appeared out of nowhere.

Take every URL from this skill's references (`domains.md` for registrars and hosts,
`stacks.md` for build and upload tools, `facts.md` for store rules) or from the
current official docs. Never write a URL from memory. Start pages for the common
rows, listed 2026-10-13. Only the Google Play account how to page has a saved copy
(checked 2026-10-19, saved copy fetched 2026-10-12); the others are unverified:

| Row | Link |
| --- | --- |
| Apple Developer Program | https://developer.apple.com/programs/enroll/ |
| App Store Connect | https://appstoreconnect.apple.com/ |
| Apple agreements, tax and banking | https://appstoreconnect.apple.com/business |
| Google Play account, closed test, listing | https://play.google.com/console |
| Google Play account how to | https://support.google.com/googleplay/android-developer/answer/6112435 |
| Domain at Porkbun | `https://porkbun.com/checkout/search?q=<name>` (an undocumented search link; if it stops working, use https://porkbun.com) |
| Registering at Porkbun, how to | https://kb.porkbun.com/article/212-how-to-register-a-domain-at-porkbun |

For a domain, suggest the name from the app's name, and link the user's registrar if
the settings name one, otherwise the first registrar in `domains.md`.

## The rows

Start from what step 0 found, one row per thing the user would ask about. Drop rows
that do not apply (no Android row for an iOS only app). **Which rows exist depends on
whether this is a first release or an update**, and the two lists are not alike.

### A first release

Nearly nothing is true yet, so the board is the plan and the progress ring means
something real. Typical groups:

- **Accounts:** Apple Developer Program, Google Play account, the Google closed test
  if the account needs one (personal accounts created after 13 Nov 2023), agreements, tax and banking when the app sells anything.
- **Web pages:** privacy policy, support, account deletion, each with its `url`.
- **App:** rejection traps (how many checked, how many found), version and build
  number, release build tested.
- **Listing:** copy, screenshots, privacy answers, review notes and demo account.
- **Review:** one row per store, from upload to live.

### An update

There is no board unless the user asks for one. When they do, it has about four rows,
all of them about **this release and nothing else**:

- **This release:** what is in it, in the user's words. One row, `done`.
- **Blocks the upload:** one row each, only for something the stores will refuse or a
  rule the app started breaking since its last approved build. Usually there are
  none, and then there is no row and the board says so by not having one.
- **Testing:** put the release's test checklist in the top level `checks` array
  rather than in a row. The page renders it as real checkboxes, and the ring measures
  it automatically whenever it is there, because on an update that is the number the
  user actually came for.
- **Each store, once there is something to say.** A row reading "nothing uploaded
  yet" states the obvious to someone who is trying to upload. Add the row when the
  build goes up, and then it earns its place: `waiting` with `since` set turns into
  "App Store review, for 2 days", which is the thing nobody can find out by looking
  at their own repo.
- **Carried, not part of this release:** its own group, at the bottom, under a
  heading that says so. One row per thing the sweep found that predates the last
  approved build, as `risk` or as `todo` with `owner: "you"`.

### The carried group

Everything the first release settled stays off: the accounts, the web pages, the
listing copy. Those are finished, and a settled row with a full green bar is not
reassurance, it is a thing to scroll past.

A long standing **finding** is different, and it does belong on the board, in its own
group at the bottom, named so that nobody can mistake it for a gate. Those rules are
real, the user usually has never heard of them, and dropping them only in a reply
means they are gone the moment the conversation scrolls. On the board they are a
standing list the user can work through whenever they choose, including before this
release if they want to.

What makes that safe rather than alarming is where it sits and what it says: below
the release, under a heading that names it as not part of the release, with each row
carrying the date it first shipped. The ring never counts it, because the ring is
about getting this build out.

### An app that is already live

A first release has few rows that are true yet, so most of them are `todo`. An app
already in the stores is the opposite: nearly everything is `done`, and the sweep's
findings are mostly rules the app has been breaking for months without a reviewer
stopping it. Those are `risk`, not `blocked`, and the board says so: a risk is amber
and reads as a known risk, a blocker is red and reads as needing a fix.

Keep `blocked` for a row that stops this release: a store page that does not load, a
rule the app started breaking since its last approved build, an upload the stores
will refuse. If every finding is red, the one that actually stops the release is
hidden among the ones that have shipped fifty times. Give each risk row the date it
first shipped, so the reader can see it is long standing rather than new.

Every state comes from something checked this session or recorded in `SHIPPING.md`,
never assumed. Review status comes from the user, or from the store tools the project
already uses (for example `eas submit` output or fastlane); if neither says, leave the
row as it was and ask.

Update the file at the end of each step and whenever a row changes, set `updated`,
and show the board when it says something new: the end of step 0, after the
rejection sweep, after submitting, and whenever the user asks where things stand.
