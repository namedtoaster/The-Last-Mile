---
name: ship
description: Take an Expo app build to the App Store and Google Play. Walks the release checklist, bumps the version, builds and tests the release build, prepares submission, and checks the known store traps against current official docs. Use when the user wants to release, submit, upload, publish, cut a build, or respond to an App Store or Google Play rejection.
---

# Ship

Read the project's rules file **Settings** table first, then `references/traps.md`
and `references/facts.md` in this skill's folder.

## The one rule

**Store rules change. Never state one from memory.** Before telling the user what a
store requires, or how to find something in App Store Connect or Play Console,
open the source link for it in `references/traps.md` or search the current
official docs. If what you find differs from the reference, follow the current docs,
tell the user what changed, and update the entry and its **Last checked** date.
Console screens move often, so give navigation steps only from docs fetched now.

## Scope

Check the app's code, config, assets and docs, and the official store pages. Do not
query or change live services (databases, payment dashboards, analytics, crash
reporting) unless the user asks. If something looks risky there, note it as a
question for the user instead. Keep the report to what blocks this release: list
the blockers first, then passes in one line each.

## 1. Pre flight

1. Run the project's check command. Everything must pass.
2. Open `RELEASE_TEST_CHECKLIST.md`. Report how many items in the current
   **Verify on** block are unticked, and which ones block shipping.
3. Walk the traps in `references/traps.md` that apply to this app and this release
   (iOS, Android, or both). For each, check the app, not just the docs: for example,
   search the iOS build's text for "Google Play", or list the Android release
   manifest's permissions. Report anything that fails as a short list.
4. Check the things a reviewer sees first:
   - **Icon and splash:** open the icon and splash images and confirm they are the
     app's own, not the Expo template.
   - **Health, medical or nutrition content:** if the app shows doses, calorie or
     macro figures, or health advice (including bundled sample content), confirm a
     source is shown for it. Apple has rejected apps for this under 1.4.1.

## 2. Version bump

- Bump the user facing version: patch for fixes, minor for new features.
- Bump the build number. Both stores reject a build number they have already seen,
  so keep one counter shared by iOS and Android and always increase it.
- `app.json` is the usual source of truth. If the native folders are committed,
  confirm the native version fields match it after the bump.
- Move the release checklist's **Pending** items into a new **Verify on <version>**
  block and drop the previous one.
- Commit the bump on its own.

## 3. Build

If the rules file's **How builds are made** setting is filled in, use it. Otherwise
ask which the user uses, and write the answer into that setting:

- **iOS:** a local Xcode archive (Product, then Archive, then Distribute), or a
  cloud build service. Cloud build machines can lag behind the newest Xcode.
- **Android:** an app bundle (`.aab`), built locally or in the cloud.

## 4. Test the release build

A release build is not the development build. Some code only fails here.

- Install the release build on a real device: TestFlight for iOS, an internal or
  closed testing track for Android.
- Work through **Verify on <version>** and tick items with evidence.
- Open the app cold, sign in, reach the paywall, and confirm crash reporting
  receives a deliberate test error from this build.
- On Android, real store prices only load for a Google account set up as a licence
  tester in Play Console (signed in on the device, same package name), or in a build
  installed from a Play testing track.

## 5. Submit

Prepare, then let the user press the final button:

- **Release notes:** written for users, not a commit log.
- **App Store Connect:** screenshots for every required device size, privacy labels
  that match what the app actually collects, support and privacy policy URLs.
- **Play Console:** the Data safety form, the account deletion link, and any
  permission declarations. A new personal developer account must finish closed
  testing before it can publish to production; see the traps reference.

## 6. If the review comes back rejected

1. Read the message. It names a guideline number.
2. Fix only what it asks for. Unrelated changes invite new questions.
3. Reply in the review conversation in two or three polite sentences saying what
   changed. If the reviewer misunderstood, explain with a screenshot.
4. Resubmit.
5. Add the rejection to the project's gotchas with the date and the guideline, and
   if it would catch other apps, suggest contributing it as a trap to The Last Mile.

## 7. After it ships

- Clear the shipped **Verify on** block from the release checklist and update the
  **Last release** line with the version, the date, and how many items were verified.
- Tag the release in git (`v<version>`), if the project tags releases.
- Note the release in `CURRENT_WORK.md`.
