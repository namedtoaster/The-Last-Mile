# Store traps

Things that have caught real apps on the way into the App Store and Google Play.
Each entry says what happened, how to check it today, where the rule comes from,
and when that source was last checked.

**Status meanings**

- **Checked:** the official source was checked on the date shown. Still re-check
  before relying on it; stores change rules.
- **From experience:** this happened to a real app, but the current official wording
  has not been checked yet. Treat it as a strong lead, not as the rule.
- **Needs a human:** the answer sits behind a console login no automation can read.

Most entries come from MyMealStream (an Expo app on both stores since May 2026).

## Apple

### Buying must not require an account
- **What happened:** rejected in April 2026 because the paywall required signing in before purchase.
- **How to check:** start a fresh install, skip sign in, and buy. Restore purchases must also work without an account.
- **Source:** [App Review Guidelines, 5.1.1 Data Collection and Storage](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage)
- **Status:** From experience. Last checked: never.

### Apps that support accounts must offer deletion inside the app
- **What happened:** a standing requirement; the reviewer checks it.
- **How to check:** find a delete account option in the app's account settings. Deactivating is not enough.
- **Source:** [App Review Help: 5.1.1(v) Account deletion](https://developer.apple.com/help/app-review/guideline-reference/5-1-1-account-deletion)
- **Status:** Checked 2026-10-11 (via the official page's published text).

### iPhone apps get reviewed on iPad too
- **What happened:** rejected in April 2026 for a layout that stretched badly on iPad, even though it was an iPhone app.
- **How to check:** run every screen on an iPad simulator. Cap content width on large screens.
- **Source:** [App Review Guidelines, 2.4.1 Hardware Compatibility](https://developer.apple.com/app-store/review/guidelines/#hardware-compatibility)
- **Status:** From experience. Last checked: never.

### Do not mention other platforms in the iOS app
- **What happened:** rejected in May 2026 because subscription text said "your App Store or Google Play account".
- **How to check:** search the iOS build's strings for "Google Play" and "Android". Choose such text per platform.
- **Source:** [App Review Guidelines, 2.3.10 Accurate Metadata](https://developer.apple.com/app-store/review/guidelines/#accurate-metadata)
- **Status:** From experience. Last checked: never.

### Health and nutrition figures may need their sources shown
- **What happened:** rejected in May 2026 until a screen citing the sources of calorie and macro calculations was added.
- **How to check:** if the app shows health calculations, link a sources screen from where the numbers appear.
- **Source:** [App Review Guidelines, 1.4.1 Physical Harm](https://developer.apple.com/app-store/review/guidelines/#physical-harm)
- **Status:** From experience. Last checked: never.

### Support and privacy policy pages must exist before submitting
- **What happened:** submission was blocked until support, privacy and terms pages existed.
- **How to check:** the listing's support URL and privacy policy URL both load.
- **Source:** [App Store Connect help](https://developer.apple.com/help/app-store-connect/)
- **Status:** From experience. Last checked: never.

## Google Play

### New personal accounts must run a closed test first
- **What happened:** production access was refused in April 2026 because testers installed the app but did not use it; Android launch slipped by about six weeks.
- **Rule:** a personal developer account created after November 2023 must run a closed test with at least 12 testers opted in for the last 14 days continuously before applying for production. It was 20 testers until December 2024. Organization accounts are exempt.
- **How to check:** start closed testing early, recruit more than 12 engaged testers, and avoid letting the count drop.
- **Source:** [Play Console Help: app testing requirements for new personal developer accounts](https://support.google.com/googleplay/android-developer/answer/14151465)
- **Status:** Checked 2026-10-11 (via the official page's published text). Whether a dip below 12 resets the 14 days comes from third party guides, not Google's page.

### Some libraries add photo permissions Google rejects
- **What happened:** a build was rejected in May 2026 under the Photo and Video Permissions policy. `expo-media-library` had silently added `READ_MEDIA_IMAGES` and `READ_MEDIA_VIDEO` to the manifest.
- **Rule:** apps may hold these permissions only when broad photo access is core to the app, with a declaration; others should use the system photo picker.
- **How to check:** list the permissions in the release build's merged manifest. Remove unwanted ones with a config plugin (`tools:node="remove"`).
- **Source:** [Play Console Help: Photo and Video Permissions policy](https://support.google.com/googleplay/android-developer/answer/14115180)
- **Status:** Checked 2026-10-11 (via the official page's published text).

### Apps with accounts need a web page for deleting them
- **Rule:** if the app lets people create an account, it must offer deletion in the app and a web link where deletion can be requested, declared in the Data safety form.
- **How to check:** the deletion page loads without the app installed.
- **Source:** [Play Console Help: account deletion requirements](https://support.google.com/googleplay/android-developer/answer/13327111)
- **Status:** Checked 2026-10-11 (via the official page's published text).

### Google raises the minimum target Android version every year
- **Rule:** since 31 August 2026, new apps and updates must target Android 16 (API 36); existing apps must target API 35 to stay available to new users on newer devices. An extension to 1 November 2026 could be requested.
- **How to check:** the target SDK in the Android build settings. Plan the yearly upgrade before the August deadline.
- **Source:** [Android Developers: target API level requirements](https://developer.android.com/google/play/requirements/target-sdk)
- **Status:** Checked 2026-10-11 (via the official page's published text).

### Play Console screens move often
- **What happened:** navigation paths given from memory were wrong, repeatedly.
- **Rule for agents:** fetch current Google documentation before giving any Play Console path.
- **Status:** Needs a human.

### Code shrinking may be off by default
- **What happened:** Play Console flagged low app optimization in September 2026. Code shrinking (R8) had never been turned on.
- **How to check:** confirm release builds enable minification, then test the release build, since shrinking can break libraries that load code by reflection.
- **Status:** From experience. Last checked: never.

## Builds and versions

### Never run the clean rebuild once native folders are committed
- **What happened:** `expo prebuild --clean` deleted hand written native fixes and files.
- **How to check:** use plain `npx expo prebuild`, then read `git diff ios/ android/`.
- **Status:** From experience.

### Changes in app.json may not reach a committed native project
- **What happened:** Android settings added to `app.json` never reached the build, because the `android/` folder was committed and nothing regenerated it.
- **How to check:** after changing native settings in `app.json`, confirm they appear in the generated native files.
- **Status:** From experience.

### Every upload needs a higher build number
- **Rule:** both stores reject a build number they have seen before.
- **How to check:** one counter shared by iOS and Android, increased on every build.
- **Status:** From experience.

### Some code crashes only in the release build
- **What happened:** `console.time` and UUID helpers relying on Node crypto threw "undefined is not a function" only in release builds, with no stack trace.
- **How to check:** test the release build before submitting. Track the current step inside long async operations so an error says where it happened.
- **Status:** From experience.

## Things that fail silently

### Crash reporting can be installed and still report nothing
- **What happened:** for months no crash reached the dashboard. Three separate causes: the key pointed at another account, the native module was excluded from the build, and an availability check always returned false in the new architecture.
- **How to check:** trigger a deliberate test error in a release build and confirm it arrives. Zero events over a long period is a delivery fault, not a perfect app.
- **Status:** From experience.

### The privacy policy drifts from what the app does
- **What happened:** the published policy described a feature as not active while it shipped on by default.
- **How to check:** whenever the app starts sending something new to a server, update the privacy policy, Apple's privacy labels and Play's Data safety form together.
- **Status:** From experience.

### On Android, store prices only appear in store installed builds
- **What happened:** checklist items asked to verify prices in a locally built app, which can never show them.
- **How to check:** test purchases from a build installed through a Play testing track by a licence tester.
- **Status:** From experience.

### Paid tiers get in the way of testing
- **What happened:** automated test runs used up the free tier and recorded the paywall; giving yourself premium hid every free tier screen.
- **How to check:** a server side allowlist of test devices that skips limits, and a development only switch to be treated as free.
- **Status:** From experience.
