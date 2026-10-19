# Release levels and platforms

Not every launch needs everything. The user picks a level and the platforms during
setup (or the first time ship runs), and ship plans only that much. A level can go up
later; it never goes down silently.

The store requirements are the same at every level. A level only decides how much
past the requirements gets done before the first submission.

## Levels

### Quick ship
Get into the store as fast as the rules allow. Best for testing an idea, a free app,
or getting a first app through review to learn the process.

- Everything the stores require: the app's own icon (a splash screen is recommended,
  not a store rule), privacy policy (and the in app link), support page, account deletion if the app has accounts, the
  rejection sweep, privacy answers, the required screenshots.
- Free at launch. No in app purchases (adding them later is an update, not a new app).
- A plain listing: name, subtitle, description, keywords, written once.
- Crash reporting is recommended, not required.

### Standard
A launch a stranger could find and keep using. The default.

- Everything in Quick ship.
- Crash reporting, proved working from a release build.
- A teardown of every flow against shipped apps, tap by tap (`teardown.md`), with the
  small findings fixed.
- The release build tested on a real device against the release checklist.
- A listing written to be found: keywords researched, the first three screenshots
  carry captions that say what the app does.
- Paid features, if the app has them, with a paywall that passes review, and a way to
  restore purchases (Apple 3.1.1 requires a restore mechanism for restorable purchases).

### Full features
Everything planned is in before the first submission. Choose this only when the app
already has paying users waiting, or a launch date that press or a partner depends on.

- Everything in Standard.
- Analytics on the loop, so the first week's numbers can be read.
- Subscriptions with a free trial and the paywall reached from onboarding.
- A preview video, localized listings for the main markets, and an in app review prompt.

## Platforms

- **Both:** the default. Plan both stores side by side; neither waits for the other.
- **iOS only:** skip every Google Play row. Common when the developer is on a Mac and
  the Google account is new, since a personal Google account created after
  13 Nov 2023 must run a closed test with 12 testers for 14 consecutive days, then
  apply for production access (see `facts.md`). Android can follow as an update.
- **Android only:** skip every Apple row. Common when there is no Mac or the Apple fee
  is a blocker.

When one platform ships first, say so in the plan, and keep the other on the board as
"later" so it is not forgotten. Watch for text that names only one platform: Apple
rejects an iOS build that mentions Google Play.
