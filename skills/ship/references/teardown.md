# Teardown: compare every flow against shipped apps, at the level of single taps

A rejection sweep proves the app is allowed in the store. This proves it behaves like
an app people already trust. The bugs it catches are small and constant: a card that is
still there after you chose an option in its sheet, a feed that goes blank for your
heaviest user, the same item saved twice, a sheet that closes and leaves the screen
unchanged. Users rarely report these. They just leave.

Run it at the **Standard** level and above, after the release build works and before
the store listing, so the screenshots show the fixed screens.

**Three layers, in this order, and all three.** A teardown that only does the first one
leaves an app that looks the same to its founder:

1. **Mechanics:** single taps and state. Does each thing resolve, answer, undo, count
   right, everywhere it shows. Steps 4 and 5, plus the state matrix below.
2. **Flows:** the medium layer. The order of screens, what each step asks for, where a
   flow ends and what it hands off to, compared flow against flow with the reference
   apps on the emulator.
3. **Layout and visible UX:** screen against screen. Hierarchy, density, what is on the
   first screenful, card shapes, how lists group, what empty and end states look like.
   Capture the reference app's screen and this app's screen side by side, and change
   the screen, not only its code paths.

**What a code-reading audit misses (from experience, 2026-10-19).** Four agents audited
every screen by reading its code and fixed about 110 issues, and the founder rebuilt and
saw little difference. Two reasons: nobody used the app, and each agent checked a screen
alone, so a card that went stale after acting on the same item on another screen was
invisible to all of them. The fix is the state matrix, and walking it on a running app.

### The state matrix

Bugs of the kind "I did it over there and it is still here" come from one object being
shown in several places that each read their own copy of its state. Find them all at once:

1. List the app's objects (an item, a saved post, a plan entry, a reminder).
2. For each object, list every **surface** that shows it (each card, list, badge and count)
   and the state each one reads to decide whether to show it and how.
3. List every **action** on that object anywhere in the app (every button, sheet and
   swipe, on every screen) and the state each one writes.
4. Any action whose write is not read by a surface that shows the same object is a bug:
   that surface goes stale. The cure is that surfaces read the object's own state, not a
   private list of what was done on that surface.
5. Then walk the worst rows on the running app: act on the object in one place, go to
   every other place it shows, and look.

## The one rule

Only compare against behaviour someone has actually seen: code read out of the app's own
package, a screen on a device, a Mobbin screen or flow opened this session, a screenshot
from the user. Never describe another app's behaviour from memory or a blog post.

## The tools, in order

1. **REA, on Android (primary).** [REA](https://github.com/morluto/rea) is an MCP that
   pulls an installed app off an Android emulator and decompiles it (JADX for the Java
   and Kotlin code, plus the manifest, resources and strings). It answers what screens
   cannot: how the app stores "already seen", what it counts, which rules come from a
   server config. One teardown per feature gives a specific reference, not a guess.
2. **The app on the emulator.** Tap through the flow while reading its code. The code
   proves a mechanism exists; only the screen proves when it fires.
3. **Mobbin (backup).** For iOS only apps, apps you cannot install, and layout and copy.
4. **The user's screenshots and store listing images.**

### Setting up REA (once per machine)

- An Android emulator with a **Google Play** system image (the "Google Play" variant in
  Android Studio's device manager), signed in to a Google account, so apps install from
  the Play Store as a person would.
- `npx rea-agents setup`, choose the agent, approve, restart the agent. Check the MCP
  is listed before relying on it.
- Android analysis needs a full JDK 17 or newer and the pinned JADX engine JAR. Follow
  REA's own `docs/android-analysis.md` ("Supply tools"): download it, verify the
  SHA-256 it gives, and set `REA_JADX_MCP_JAR` to its path. Do not copy the version or
  hash from here; REA pins them.
- `adb` from Android platform tools.

### The standard layout

Every teardown in every project uses the same layout, so the next session can pick it up
without asking.

**Raw material** (gitignored: add `teardown/` to `.gitignore` before the first pull, with
a comment that it is research only and never redistributed). Outside `/tmp`, so it
survives a reboot:

```
teardown/
  <app>-<YYYY-MM-DD>/        short lowercase app name, the pull date
    base.apk                 and every split_config.*.apk, flat, as pulled
    dex/                     classes*.dex unzipped from base.apk
    index.android.bundle     React Native apps only, from assets/
    all-strings.txt          every string in the code (strings -n 4 over dex/ and the bundle)
    identifiers.txt          the snake_case names in all-strings.txt, sorted and unique:
                             preference keys, remote config names, resource names
    strings.xml              decoded string resources (apktool, via REA)
    AndroidManifest.xml      decoded manifest (apktool, via REA)
    jadx/                    optional: a full decompile, only when a finding needs logic
```

**Findings** (committed): one file per app and topic in the research folder,
`RESEARCH_<APP>_TEARDOWN_<TOPIC>.md`, for example `RESEARCH_PINTEREST_TEARDOWN_DISCOVER.md`.
In this order:

1. A title that states the finding, then the source line: app name, version and
   version code, the pull date, and the raw folder path.
2. **What this evidence can and cannot say.** An identifier proves a mechanism exists
   and names its state; it does not prove when it fires or what a user sees.
3. **Finding 1, 2, ...**, each with the identifiers or code it rests on, marked
   **seen in code** or **inferred**, and what it means for this app.
4. **What to do, ranked**: small, medium, large.
5. **Already recorded elsewhere, do not duplicate**: links to the project's other docs.

The flow list and the app list stay in `teardown-apps.md` beside them.

### One teardown, cheapest step first

**Mind the machine's memory.** The emulator is already heavy, and a full decompile can
take most of the RAM (jadx defaults to 70% of it). Run Java tools (apktool, jadx) one at
a time, never in parallel, never while the emulator is running if memory is tight, with
the heap capped and at low priority (`JAVA_OPTS="-Xmx2g" nice -n 19`), and check free
memory first. Most questions are answered before any Java runs.

1. Install the app from the Play Store on the emulator and use the feature once, so its
   screens and settings exist.
2. Pull it: `rea pull-adb-package <serial> <package id> --output-directory <dir>` (the
   serial is what `adb devices` prints), then move the APKs flat into
   `teardown/<app>-<date>/`. Once pulled, the app can be uninstalled to free space.
3. **Cheap, no Java:** unzip `dex/`, build `all-strings.txt` and `identifiers.txt`, and
   check what the app is built with: `libreactnative.so` or `libhermes.so` in a split
   means React Native, `libflutter.so` means Flutter, otherwise native.
4. Search `identifiers.txt` and `all-strings.txt` for the feature's words: button labels,
   setting names, "seen", "dismiss", "count", "primer". This alone answered both of the
   first two teardowns this method came from.
5. **One Java step at a time:** `rea decode-android-resources` for `strings.xml` and the
   manifest; then, only for the classes a finding points at, `rea search-android-classes`
   and `rea inspect-android-method` (one method, not the whole app). A full jadx decompile
   into `jadx/` is the last resort, never for React Native or Flutter apps, whose feature
   code is not in the Java layer.
6. Write it up in the findings file above. Never paste their code into this app; learn
   the mechanism and write your own.

## 1. List the app's flows

Read the routes and screens, then write one line per flow as a job, not a screen name:
"save a shared post", "act on a suggestion card", "pick between two options", "undo a
dismiss", "browse a library", "change a setting". Include every card, sheet and modal
that asks the user to choose something. Those are where most of these bugs live.

## 2. Pick the apps to compare against

Pick about a dozen apps that between them cover every flow, each app covering as many
as possible, so the user installs a dozen apps rather than fifty. Include at least one
from a different category (the best pattern is often elsewhere). Check each one's Play
Store listing loads before listing it, and note what it is built with (native, React
Native, Flutter), because that decides what REA can read. Save the list in the
project's research folder as `teardown-apps.md`: app, package id, flows it covers, the
screen to look at, built with. The next teardown reuses it rather than choosing again.

## 3. Watch what the reference apps do after each tap

On the emulator with REA's teardown open beside it (Mobbin when the app cannot be
installed). For each step of each flow, write down what changes on screen **after**
the action, and the code or setting behind it. That "after" is the whole point:

- Where the action started: does the card, row or button that opened the sheet go
  away, change state ("Saved", a tick, greyed out) or move?
- What confirms it: a toast, a haptic, an inline change, nothing?
- Is there an undo, and for how long?
- What does going back show: the same scroll position, the updated item?

## 4. Walk the same flow in this app

On a real device or simulator, with realistic data (an empty account, a new account,
and a heavy account with everything saved). The see-it-work skill can capture each
step; screen-atlas gives the full map. Record the same "after" for every action.
Reading the code is not enough: these are state bugs that only show on screen.

Do not report a fix as done from reading code alone. Each fix needs one on-screen proof,
and every row of the state matrix that crosses screens needs a walk: act here, look there.

## 5. The granular checks

Walk each of these for every flow. Each is a real bug that shipped somewhere.

| Check | Fails when |
| --- | --- |
| **The prompt resolves** | You choose an option in a sheet or modal opened from a card, the sheet closes, and the original card is still there unchanged. After any choice, the thing that asked must go away or show the new state. |
| **Every tap answers** | A tap gives no pressed state, haptic, toast or visible change within a moment. |
| **Undo for anything that removes or dismisses** | A dismiss, delete or "not for me" has no undo, or the undo restores the wrong thing. |
| **Back keeps your place** | Returning from a detail screen loses the scroll position or shows stale data. |
| **Counts agree everywhere** | A count or badge on one screen does not change after acting on another. |
| **No duplicates** | Saving, sharing or importing the same thing twice creates two copies. Match on what makes it the same (the link, an id), not on a new row id. |
| **Never blank for heavy users** | A feed or library that hides what the user already has goes empty for the account that has everything. Mark saved items instead of removing them, and say when there is nothing new. |
| **Dismissed stays dismissed** | A one-time card comes back after a tab switch or relaunch. See the one-time-surface skill. |
| **Empty, loading, error, offline** | A list has no empty state, spins forever offline, or shows a raw error. |
| **Double tap** | Tapping a submit or save twice quickly does it twice. |
| **Long text and large type** | A long title, a long name or the largest system text size cuts off a button or overlaps. |
| **Keyboard** | The keyboard covers the field being typed in or the button that submits it. |

## 6. Report, fix, prove

Write each difference as a finding: the flow, the step, what this app does, what the
reference app does (with its link), and effort (small, medium, large). Blockers first,
then the rest ranked by how many users hit them.

Fix the small ones now, one at a time, and prove each on screen with see-it-work.
Medium and large go to the backlog with the reference link. Prove fixes with automated
tests where possible; add hand checks to `RELEASE_TEST_CHECKLIST.md` only for the
riskiest few (see session-end: at most 10 must-checks), never one per fix.
Save the findings next to `teardown-apps.md` with the date.
