# Store traps

Things that have caught real apps on the way into the App Store and Google Play.
Each entry says what happened, how to check it today, where the rule comes from,
and when that source was last checked.

**Status meanings**

- **Checked:** the official source was opened and read on the date shown. Still
  re-check before relying on it; stores change rules.
- **From experience:** this happened to a real app, but no official page states it
  as a rule. Treat it as a strong lead, not as the rule.
- **Needs a human:** the answer sits behind a console login no automation can read.

Most entries come from a real Expo app, live on both stores since May 2026.

## Apple

### Buying must not require an account
- **What happened:** rejected in April 2026 because the paywall required signing in before purchase.
- **Rule:** Apple's guidelines say that if an app doesn't include significant account based features, people should be able to use it without a login. They do not spell out purchases; requiring sign in to buy is the part learned from the rejection.
- **How to check:** start a fresh install, skip sign in, and buy. Restore purchases must also work without an account.
- **Source:** [App Review Guidelines, 5.1.1(v) Account Sign-In](https://developer.apple.com/app-store/review/guidelines/#5.1.1v)
- **Status:** From experience.

### Apps that support accounts must offer deletion inside the app
- **What happened:** a standing requirement; the reviewer checks it.
- **How to check:** find a delete account option in the app's account settings. Deactivating is not enough.
- **Source:** [App Review Help: 5.1.1(v) Account deletion](https://developer.apple.com/help/app-review/guideline-reference/5-1-1-account-deletion)
- **Status:** Checked 2026-10-11 (official page opened and read).

### iPhone apps get reviewed on iPad too
- **What happened:** rejected in April 2026 for a layout that stretched badly on iPad, even though it was an iPhone app.
- **Rule:** Apple says iPhone apps should run on iPad whenever possible.
- **How to check:** run every screen on an iPad simulator. Cap content width on large screens.
- **Source:** [App Review Guidelines, 2.4.1 Hardware Compatibility](https://developer.apple.com/app-store/review/guidelines/#2.4.1)
- **Status:** Checked 2026-10-11 (official page opened and read). That reviewers test on iPad is from experience.

### Do not mention other platforms in the iOS app
- **What happened:** rejected in May 2026 because subscription text said "your App Store or Google Play account".
- **Rule:** Apple's guidelines say not to include names, icons or imagery of other mobile platforms or alternative app marketplaces in the app or its metadata.
- **How to check:** search the iOS build's strings for "Google Play" and "Android". Choose such text per platform.
- **Source:** [App Review Guidelines, 2.3.10 Accurate Metadata](https://developer.apple.com/app-store/review/guidelines/#2.3.10)
- **Status:** Checked 2026-10-11 (official page opened and read).

### Health and nutrition figures may need their sources shown
- **What happened:** rejected in May 2026 until a screen citing the sources of calorie and macro calculations was added.
- **Rule:** Apple requires apps to disclose data and methodology behind accuracy claims about health measurements. Applying that to nutrition figures is how it was enforced on a real app, not wording from Apple.
- **How to check:** if the app shows health calculations, doses or nutrition figures (including bundled sample content), link a sources screen from where the numbers appear.
- **Source:** [App Review Guidelines, 1.4.1 Safety, Physical Harm](https://developer.apple.com/app-store/review/guidelines/#1.4.1)
- **Status:** From experience.

### Support and privacy policy pages must exist before submitting
- **What happened:** submission was blocked until the support and privacy pages existed.
- **Rule:** App Store Connect requires a Support URL, and a Privacy Policy URL for iOS and macOS apps.
- **How to check:** the listing's support URL and privacy policy URL both load.
- **Source:** [App Store Connect Help: platform version information](https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information)
- **Status:** Checked 2026-10-11 (official page opened and read).

## Google Play

### New personal accounts must run a closed test first
- **What happened:** production access was refused in April 2026 because testers installed the app but did not use it; Android launch slipped by about six weeks.
- **Rule:** a personal developer account created after 13 November 2023 must run a closed test with at least 12 testers opted in continuously for at least 14 days before applying for production. It was 20 testers until December 2024. A tester who opts out and back in only counts if their 14 days are consecutive, so leaving restarts their clock. Google's page covers personal accounts only; it does not say how organization accounts are treated.
- **How to check:** start closed testing early, recruit more than 12 engaged testers, and ask them not to leave the test. Having fewer than 12 opted in is a listed reason Google asks for more testing; the page does not say whether a dip restarts the whole 14 days.
- **Source:** [Play Console Help: app testing requirements for new personal developer accounts](https://support.google.com/googleplay/android-developer/answer/14151465)
- **Status:** Checked 2026-10-11 (official page opened and read).

### Some libraries add photo permissions Google rejects
- **What happened:** a build was rejected in May 2026 under the Photo and Video Permissions policy. `expo-media-library` had silently added `READ_MEDIA_IMAGES` and `READ_MEDIA_VIDEO` to the manifest.
- **Rule:** apps may request these permissions only when system pickers (like the Android Photo Picker) are not enough for the app's core functionality, with a declaration. Others should use the system photo picker.
- **How to check:** list the permissions in the release build's merged manifest. Remove unwanted ones with a config plugin (`tools:node="remove"`).
- **Source:** [Play Console Help: Understanding Restricted Permissions with minimum scope alternatives (Photo and Video Permissions)](https://support.google.com/googleplay/android-developer/answer/14115180)
- **Status:** Checked 2026-10-11 (official page opened and read).

### Apps with accounts need a web page for deleting them
- **Rule:** if the app lets people create an account, it must offer deletion in the app and a web link where deletion can be requested, declared in the Data safety form.
- **How to check:** the deletion page loads without the app installed.
- **Source:** [Play Console Help: account deletion requirements](https://support.google.com/googleplay/android-developer/answer/13327111)
- **Status:** Checked 2026-10-11 (official page opened and read).

### Google raises the minimum target Android version every year
- **Rule:** since 31 August 2026, new apps and updates must target Android 16 (API 36); existing apps must target API 35 to stay available to new users on newer devices. An extension to 1 November 2026 could be requested.
- **How to check:** the target SDK in the Android build settings. Plan the yearly upgrade before the August deadline.
- **Source:** [Android Developers: target API level requirements](https://developer.android.com/google/play/requirements/target-sdk)
- **Status:** Checked 2026-10-11 (official page opened and read).

### Play Console screens move often
- **What happened:** navigation paths given from memory were wrong, repeatedly.
- **Rule for agents:** fetch current Google documentation before giving any Play Console path.
- **Status:** Needs a human.

### Code shrinking may never have been turned on
- **What happened:** Play Console flagged low app optimization in September 2026. Code shrinking (R8) had never been turned on.
- **Rule:** Android recommends always enabling code shrinking and resource shrinking for release builds. In Expo, `expo-build-properties` turns it on (`enableMinifyInReleaseBuilds`).
- **How to check:** confirm release builds enable minification, then test the release build, since shrinking can break libraries that load code by reflection.
- **Source:** [Android Developers: enable app optimization](https://developer.android.com/topic/performance/app-optimization/enable-app-optimization), [Expo: BuildProperties](https://docs.expo.dev/versions/latest/sdk/build-properties/)
- **Status:** Checked 2026-10-11 (official pages opened and read). That it was off in a real app is from experience.

## Builds and versions

### Never run the clean rebuild once native folders are committed
- **What happened:** `expo prebuild --clean` deleted hand written native fixes and files.
- **Rule:** Expo's docs say the `--clean` option deletes any existing native directories before generating them.
- **How to check:** use plain `npx expo prebuild`, then read `git diff ios/ android/`.
- **Source:** [Expo: Prebuild](https://docs.expo.dev/workflow/prebuild/)
- **Status:** Checked 2026-10-11 (official page opened and read).

### Changes in app.json may not reach a committed native project
- **What happened:** Android settings added to `app.json` never reached the build, because the `android/` folder was committed and nothing regenerated it.
- **Rule:** Expo's docs say that when a project has `android` and `ios` folders, EAS Build does not run prebuild, to avoid overwriting changes made there.
- **How to check:** after changing native settings in `app.json`, confirm they appear in the generated native files.
- **Source:** [Expo: Prebuild](https://docs.expo.dev/workflow/prebuild/)
- **Status:** Checked 2026-10-11 (official page opened and read).

### Every upload needs a higher build number
- **Rule:** Google Play will not accept a version code that has already been used, and Apple uses the build string to identify each build uniquely.
- **How to check:** one counter shared by iOS and Android, increased on every build.
- **Source:** [Android Developers: version your app](https://developer.android.com/studio/publish/versioning), [App Store Connect Help: upload builds](https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds)
- **Status:** Checked 2026-10-11 (official pages opened and read).

### Some code crashes only in the release build
- **What happened:** `console.time` and UUID helpers relying on Node crypto threw "undefined is not a function" only in release builds, with no stack trace.
- **Rule:** Expo's docs say running the app in production mode locally shows errors that normally would not be thrown.
- **How to check:** test the release build before submitting. Track the current step inside long async operations so an error says where it happened.
- **Source:** [Expo: runtime issues](https://docs.expo.dev/debugging/runtime-issues/)
- **Status:** Checked 2026-10-11 (official page opened and read). The two specific causes are from experience.

## Things that fail silently

### Crash reporting can be installed and still report nothing
- **What happened:** for months no crash reached the dashboard. Three separate causes: the key pointed at another account, the native module was excluded from the build, and an availability check always returned false in the new architecture.
- **How to check:** trigger a deliberate test error in a release build and confirm it arrives. Zero events over a long period is a delivery fault, not a perfect app.
- **Status:** From experience.

### The privacy policy drifts from what the app does
- **What happened:** the published policy described a feature as not active while it shipped on by default.
- **Rule:** Apple asks you to update your privacy answers in App Store Connect when your practices change, and Google asks you to update the Data safety section when the app's data practices change.
- **How to check:** whenever the app starts sending something new to a server, update the privacy policy, Apple's privacy labels and Play's Data safety form together.
- **Source:** [Apple: App privacy details](https://developer.apple.com/app-store/app-privacy-details/), [Play Console Help: Data safety section](https://support.google.com/googleplay/android-developer/answer/10787469)
- **Status:** Checked 2026-10-11 (official pages opened and read).

### On Android, store prices only load for a licence tester or a Play install
- **What happened:** checklist items asked to verify prices on a test phone where they could never load.
- **Rule:** Google Play billing is blocked for apps not signed and uploaded to Google Play, but licence testers bypass that check, even on sideloaded debug builds, as long as the package name matches the app in Play.
- **How to check:** sign in on the device with a Google account added as a licence tester in Play Console, and use the same package name. Otherwise install from a Play testing track. A build with neither cannot load prices.
- **Source:** [Android Developers: test your Google Play Billing integration](https://developer.android.com/google/play/billing/test)
- **Status:** Checked 2026-10-11 (official page opened and read).

### Paid tiers get in the way of testing
- **What happened:** automated test runs used up the free tier and recorded the paywall; giving yourself premium hid every free tier screen.
- **How to check:** a server side allowlist of test devices that skips limits, and a development only switch to be treated as free.
- **Status:** From experience.
