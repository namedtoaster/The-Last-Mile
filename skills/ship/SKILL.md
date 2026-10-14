---
name: ship
description: Take any mobile app, on any stack, from a working build to the App Store and Google Play. Works out the stack, sweeps the code for known rejection traps, fixes what it can, bumps the version, builds and tests the release, writes the store listing and privacy answers, uploads and submits with the user's yes, and handles rejections. Works for Expo, React Native, Flutter, native iOS and Android, Capacitor, .NET MAUI, Kotlin Multiplatform, and web apps that need wrapping first. Use when the user wants to ship, release, submit, upload, publish, get into the App Store or Google Play, cut a build, or respond to a rejection.
---

# Ship

Get the app out of the user's laptop and into the stores. Many users have never shipped
before and built the app with AI, so explain each step in plain words and never assume
they know what a provisioning profile, a version code or an app bundle is.

Read these in this skill's folder before starting:

- `references/stacks.md`: where each stack keeps its version, and how it builds and uploads.
- `references/traps.md`: things that got real apps rejected, with sources.
- `references/facts.md`: numbers that change (fees, limits, deadlines).
- `references/board.md`: the status board's file and rows.
- `references/payments.md`: store products and RevenueCat, in the order they must be set up.

## The one rule

**Store rules change. Never state one from memory.** Before telling the user what a
store requires, or how to find something in App Store Connect or Play Console, open
the source link for it in the references or search the current official docs. If what
you find differs from the reference, follow the current docs, tell the user what
changed, and update the entry and its **Last checked** date. Console screens move
often, so give navigation steps only from docs fetched now.

## Where answers are kept

If the project has a rules file (`CLAUDE.md` or `AGENTS.md`) with a **Settings** table,
read it and keep shipping answers there. If not, keep them in `SHIPPING.md` at the
project root, created from `templates/shipping.md`, so the next release starts where
this one ended. Do not require the setup skill; `/ship` must work on a project that has
never seen The Last Mile.

## The status board

Keep `store/status.json`, one row per thing between the app and the stores, and show
it with `scripts/board.mjs`: an animated page that works on a phone, and a board in
the terminal. Give every row the user must act on a link straight to where it gets
done. `references/board.md` has the format, the rows, the links, and when to show it.
Pages the session's network blocks are checked from GitHub by a small workflow
(`templates/last-mile-checks.yml`); install it in GitHub projects, as that file says.
**`/ship status`, or the user asking where things stand,** always means the board, never
a text summary alone:

1. Create `store/status.json` if it does not exist (step 0's checks fill it), else
   refresh its rows from what can be checked now.
2. Run `scripts/board.mjs` on it.
3. Hand the user the page as `references/board.md` says (an artifact, or the file
   rendered in the app), then give its gist in two lines.
4. Commit and push `store/status.json` the way the project's rules say, and stop.

## The ship journal

Shipping a first app is a story people want to read, and nobody remembers the details
afterwards. Keep `store/journal.md` (from `templates/journal.md`), starting at the
first `/ship` run and ending when the app is live on both stores:

- Add an entry whenever the release moves: a blocker found or cleared, a console step
  done, a build uploaded, a review answered. Say what happened, who did it, roughly how
  long it took, and what was caught that would otherwise have cost a rejection or a week.
- Write the user's own words down exactly when they say something worth quoting, with
  their permission to use them.
- Ask for screenshots at the moments worth showing (console screens, the first
  TestFlight install, the approval email) and save them in `store/ship-journal/`.
- Keep the scoreboard current, including the stats: one more session each time a
  session moves the release, days since the first run, the user's hands on time in
  consoles, and tokens when the session can see them (say "not visible" otherwise,
  never guess). The point of the stats is a better process, so record what it cost
  next to what shipped, at the level chosen. Never record keys, passwords, tokens or anything
  personal, in the text or in a screenshot.

## Scope and permission

- Check the app's code, config, assets and docs, and the official store pages.
- Do not query or change live services (databases, payment dashboards, analytics)
  unless the user asks. Note anything risky there as a question instead.
- **Ask before anything that leaves the machine:** uploading a build, uploading
  metadata or screenshots, and above all submitting for review. Say what will be sent
  and where, then wait for a yes. A yes covers that one step, not the rest.
- Never paste or print signing keys, passwords or API keys. Point to where they live.

## 0. Where you stand

Work this out from the files before asking anything, then show it in a few lines:

1. **Stack:** match the project against the detection table in `references/stacks.md`.
   If it is a web app with no native project, follow that file's web app section
   first: it needs a native wrapper, and Apple rejects wrappers that add nothing over
   the website (see the minimum functionality trap).
2. **Platforms and level:** read **Platforms** and **Release level** from the rules
   file's Settings. If either is missing, ask (one question each) and save the answer:
   iOS, Android or both; and Quick ship, Standard or Full features.
   `references/levels.md` says what each level includes. Plan only that much, and
   leave out the rows for a platform that is not shipping.
3. **First release or update:** look for an existing bundle ID or package name, a
   previous version tag, or ask.
4. **Accounts:** for a first release, ask whether the user has an Apple Developer
   Program membership and a Google Play developer account. Fees and the closed testing
   rule for new personal Google accounts are in `references/facts.md`; tell the user
   early, because the Google one can delay an Android launch by weeks.

5. **Web pages:** the stores need public pages before submission: a privacy policy
   (both stores, and linked inside the app, so its address must be final before the
   build), a support page (Apple), and an account deletion page (Google, if the app
   has accounts). A custom domain is not a store requirement. Free hosting such as
   GitHub Pages works. Recommend a domain anyway when the app will need a contact
   email on it, invite or share links that open the app (universal links and App
   Links need a site the developer controls), or a name that should not move later.
   Ask which the user has; if neither, put the pages on the plan as an early task.
   `references/domains.md` covers registrars, hosts and email forwarding.

End this step with a short plan: the steps ahead, which ones need the user, and the
first thing only they can do (often paying for an account), so they can start it now.
Write the plan's rows into `store/status.json` and show the board.

## 1. Rejection sweep

This is the step that saves days. Run the fact-check skill on the traps that apply, so
the rules are current, then check each one **against the app, not the docs**:

- Search the iOS build's bundled text for other platforms' names, list the Android
  release manifest's permissions, open the icon and splash, find the account deletion
  screen, try to buy without signing in. `references/stacks.md` says where each stack
  keeps these.
- Walk every trap under **Apple** and **Google Play** that applies, and the section for
  this stack under **Stack specific**.
- Then walk the full rulebooks in `references/rulebooks.md`, section by section, from
  their saved copies. The traps are what has caught apps before; the rulebooks are
  everything else. List every section with "applies" or "does not apply" in one line,
  and check the ones that apply against the app, including its bundled content and
  copy, not only its code.
- Also check what a reviewer sees first: the icon and splash are the app's own, not a
  template's; nothing says "lorem ipsum", "TODO" or "test"; every button on the first
  screens does something.

For an update to an app that is already live, some rules allow exceptions granted in
the store consoles (for example, Google's declarations for photo and video
permissions). Before calling one of those a blocker, ask whether the app already has
the exception; if nobody can say, report it as a question, not a blocker.

Report blockers first, each with the file and line, the rule and its source, then the
passes in one line each. Offer to fix the blockers that are code. Fix them one at a
time and show each change.

## 2. Version bump

- Bump the user facing version: patch for fixes, minor for new features, 1.0.0 for a
  first release.
- Bump the build number. Both stores reject a build number they have already seen, so
  keep one counter shared by iOS and Android and always increase it.
- `references/stacks.md` lists where each stack keeps both. If a value is set in more
  than one place, confirm they agree after the bump.
- If the project has `RELEASE_TEST_CHECKLIST.md`, move its **Pending** items into a new
  **Verify on <version>** block and drop the previous one.
- Commit the bump on its own.

## 3. Build

If the settings record how builds are made, use that. Otherwise offer the default for
the stack from `references/stacks.md`, explain it in one line, and record the answer.

- iOS needs a Mac with Xcode for a local build. Without one, a cloud build service is
  the way (Expo's EAS Build, Codemagic, Xcode Cloud, GitHub Actions on macOS).
- Android needs an app bundle (`.aab`), signed with an upload key. If the user has no
  upload key yet, explain that losing it is serious, then help create and back it up.
- Check the build meets the stores' current minimums (Xcode and SDK version for Apple,
  target API level for Google) in `references/facts.md`.

## 4. Test the release build

A release build is not the development build. Some code only fails here.

- Install it on a real device: TestFlight for iOS, an internal testing track for
  Android.
- Open the app cold, go through the main thing it does start to finish, sign in, reach
  any paywall, and buy in the sandbox if it sells anything.
- If the project has `RELEASE_TEST_CHECKLIST.md`, work through **Verify on <version>**
  and tick items with evidence. The see-it-work skill can smoke test every screen.
- If crash reporting is installed, confirm a deliberate test error from this build
  arrives.

## 5. Store listing

Draft everything in `templates/store-listing.md`, saved as `store/listing.md` in the
project (or wherever the project keeps it), and show the user before uploading.

- **Copy:** name, subtitle, keywords, descriptions and release notes, within the
  limits in `references/facts.md`. Write for the person who would use the app, from
  what the code actually does. Nothing it cannot do yet.
- **Screenshots:** the sizes each store requires today (check `references/facts.md`,
  then the official page). Capture them from a simulator or emulator with realistic
  content, not an empty state. The see-it-work skill can seed data and capture them.
- **Privacy answers:** list every SDK and every network call that sends data
  (analytics, crash reporting, ads, sign in, payments, the app's own server). Map each
  to the data types Apple's privacy labels and Play's Data safety form ask about, and
  draft the answers. Mark each one as found in code or a guess, and tell the user the
  answers are theirs to confirm: they are a legal statement.
- **Privacy policy and support pages:** both must load. If the user has none, draft a
  privacy policy from the privacy answers and suggest a place to host it.
- **Review notes:** if the app has sign in, a demo account the reviewer can use, and
  how to reach anything hidden behind a purchase or a setting.

## 6. Upload and submit

Follow the upload path for the stack in `references/stacks.md`. Ask before each upload.

- **Command line first.** Use the stack's own tool (`eas submit`, Xcode's upload,
  Gradle Play Publisher, fastlane) when the project has it, or offer to set it up.
  fastlane's `deliver` and `supply` can upload listing text and screenshots too.
- **What only the user can do** (and say so plainly): enrolling and paying for
  developer accounts, accepting agreements, tax and banking, creating API keys, and any
  form the stores only offer in their consoles. Check the current docs for which forms
  are console only before saying so. For each, give the steps from docs fetched now,
  then wait.
- **Submit for review** only when the user says to. Then tell them what happens next
  and roughly how long, from the stores' current pages.

## 7. If the review comes back rejected

1. Read the message. It names a guideline or a policy.
2. Fix only what it asks for. Unrelated changes invite new questions.
3. Draft a reply in two or three polite sentences saying what changed. If the reviewer
   misunderstood, explain with a screenshot.
4. Bump the build number, rebuild, upload and resubmit, asking before each upload.
5. Record the rejection with its date and guideline in the project's gotchas or
   `SHIPPING.md`. If it would catch other apps, offer to open a "This caught me" issue
   on The Last Mile (`namedtoaster/the-last-mile`), with the guideline and no private
   details.

## 8. After it ships

- Record the release in the settings: version, build number, date, store links.
- Clear the shipped **Verify on** block from the release checklist, if there is one.
- Tag the release in git (`v<version>`), if the project tags releases.
- Add the final entry to `store/journal.md`, then offer to draft a launch post or
  thread from it: the story in the user's own words, with the screenshots.
- Tell the user it's live, with the store links. Then one line on what comes next:
  shipping was the last mile, and getting people to use it is the next one.
