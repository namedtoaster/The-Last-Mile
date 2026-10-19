# Teardown: compare every flow against shipped apps, at the level of single taps

A rejection sweep proves the app is allowed in the store. This proves it behaves like
an app people already trust. The bugs it catches are small and constant: a card that is
still there after you chose an option in its sheet, a feed that goes blank for your
heaviest user, the same item saved twice, a sheet that closes and leaves the screen
unchanged. Users rarely report these. They just leave.

Run it at the **Standard** level and above, after the release build works and before
the store listing, so the screenshots show the fixed screens.

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

### One teardown

**Mind the machine's memory.** The emulator is already heavy, and each decompile can take
most of the RAM (jadx defaults to 70% of it). Decompile one app at a time, never in
parallel, with the heap capped and at low priority (for the jadx CLI:
`JAVA_OPTS="-Xmx2g" nice -n 19 jadx -j 2 ...`), and check free memory before each. Do not
decompile React Native (Hermes) or Flutter apps with jadx: their feature code is not in
the Java layer, so it costs memory and yields nothing.

1. Install the app from the Play Store on the emulator and use the feature once, so its
   screens and settings exist.
2. Pull it: `rea pull-adb-package <serial> <package id> --output-directory <dir>` (the
   serial is what `adb devices` prints). It pulls the complete split APK set with a
   digest for each file. Keep raw output in a gitignored `teardown/<app>-<date>/`
   folder in the project. Never commit another company's code.
3. Inspect it with REA's Android tools (`inspect_android_package`, then search classes,
   strings and resources for the feature's words: the button labels, the setting name).
4. **What the build is made of decides what you get.** Native Kotlin or Java apps
   decompile to readable logic. For React Native (`libreactnative.so`, `libhermes.so`)
   and Flutter (`libflutter.so`) apps, REA names the framework but the feature code
   is compiled into a bundle or native library, so expect strings, resources, config
   names and preference keys rather than readable logic. Prefer native apps when you
   need the mechanism.
5. Write what you found as names and shapes (preference keys, model fields, remote
   config names), each marked **seen in code** or **inferred**. Never paste their code
   into this app; learn the mechanism and write your own.

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
Medium and large go to the backlog with the reference link. Add a checklist item for
each fix to `RELEASE_TEST_CHECKLIST.md` so the next release build is checked by hand.
Save the findings next to `teardown-apps.md` with the date.
