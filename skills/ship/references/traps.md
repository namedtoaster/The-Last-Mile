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
- **Not yet checked:** the official page could not be opened when the entry was
  written; the wording comes from a search result quoting it. Open the page before
  relying on it, then change the status.

The entries marked "What happened" come from a real Expo app, live on both stores
since May 2026. The rest come from the official rules, and apply to every stack.
Stack specific traps are at the end.

## Apple

**What Apple actually rejects.** Apple publishes the counts, so the order below is not a
guess. In the 2025 reporting year it reviewed **9,100,620** submissions and rejected
**2,093,244** of them, nearly one in four.

| Guideline section | Rejections |
| --- | --- |
| 2. Performance | 1,354,418 |
| 5. Legal | 495,673 |
| 4. Design | 415,532 |
| 3. Business | 283,820 |
| 1. Safety | 151,159 |
| Other | 4,145 |

A submission can be rejected under more than one section, so those add up to more than
the total. Read them as which sections bite, not as a partition.

The guideline number on each trap below tells you which section it sits under, because
Apple numbers them 1. Safety, 2. Performance, 3. Business, 4. Design, 5. Legal. So a trap
citing 2.3.10 is in the section that caused 1.35 million rejections, and one citing 4.3
is in the one that caused 415,532.

- **Source:** [2025 App Store Transparency Report](https://www.apple.com/legal/app-store/transparency/2025/) and the [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- **Status:** Both checked 2026-10-20.

### Buying must not require an account
- **What happened:** rejected in April 2026 because the paywall required signing in before purchase.
- **Rule:** Apple's guidelines say that if an app doesn't include significant account based features, people should be able to use it without a login, and that apps may not require personal information to function unless it is directly relevant to the core functionality. They do not spell out purchases; requiring sign in to buy is the part learned from the rejection. Apple also asks for a restore mechanism for restorable purchases (3.1.1); that restore must work without an account is from experience.
- **How to check:** start a fresh install, skip sign in, and buy. Restore purchases must also work without an account.
- **Source:** [App Review Guidelines, 5.1.1(v) Account Sign-In](https://developer.apple.com/app-store/review/guidelines/#5.1.1v)
- **Status:** Guideline wording checked 2026-10-19 (saved copy fetched 2026-10-18). The purchase part is from experience.

### Apps that support accounts must offer deletion inside the app
- **What happened:** a standing requirement; the reviewer checks it.
- **Rule:** apps that support account creation must let people start deleting the account inside the app, and only deactivating it is not enough. This includes accounts the app creates automatically ("guest" or anonymous accounts). Apps outside highly regulated fields must not send people to a phone call, email or support chat to do it. Apps with Sign in with Apple should revoke the user's tokens through Apple's REST API. If the person has a subscription, tell them billing continues through Apple until they cancel it.
- **How to check:** find a delete account option in the app (account settings is typical). It deletes the account and its data, works for silent or guest accounts too, needs no email or chat, and warns subscribers that billing continues until they cancel with Apple.
- **Source:** [App Review Help: 5.1.1(v) Account deletion](https://developer.apple.com/help/app-review/guideline-reference/5-1-1-account-deletion)
- **Status:** Checked 2026-10-19 (saved copy fetched 2026-10-12).

### iPhone apps get reviewed on iPad too
- **What happened:** rejected in April 2026 for a layout that stretched badly on iPad, even though it was an iPhone app.
- **Rule:** Apple says iPhone apps should run on iPad whenever possible.
- **How to check:** run every screen on an iPad simulator. Cap content width on large screens.
- **Source:** [App Review Guidelines, 2.4.1 Hardware Compatibility](https://developer.apple.com/app-store/review/guidelines/#2.4.1)
- **Status:** Checked 2026-10-11 (official page opened and read). That reviewers test on iPad is from experience.

### Do not mention other platforms in the iOS app
- **What happened:** rejected in May 2026 because subscription text said "your App Store or Google Play account".
- **Rule:** Apple's guidelines say not to include names, icons or imagery of other mobile platforms or alternative app marketplaces in the app or its metadata, unless there is specific, approved interactive functionality.
- **How to check:** search the iOS build's strings for "Google Play" and "Android". Choose such text per platform.
- **Source:** [App Review Guidelines, 2.3.10 Accurate Metadata](https://developer.apple.com/app-store/review/guidelines/#2.3.10)
- **Status:** Checked 2026-10-11 (official page opened and read).

### Health and nutrition figures may need their sources shown
- **What happened:** rejected in May 2026 until a screen citing the sources of calorie and macro calculations was added.
- **Rule:** Apple requires apps to disclose data and methodology behind accuracy claims about health measurements. Applying that to nutrition figures is how it was enforced on a real app, not wording from Apple.
- **How to check:** if the app shows health calculations, doses or nutrition figures (including bundled sample content), link a sources screen from where the numbers appear. The same guideline says apps should remind users to check with a doctor before making medical decisions; add that line where health content appears.
- **Source:** [App Review Guidelines, 1.4.1 Safety, Physical Harm](https://developer.apple.com/app-store/review/guidelines/#1.4.1)
- **Status:** Guideline wording checked 2026-10-19 (saved copy fetched 2026-10-18). Applying it to nutrition figures is from experience.

### Support and privacy policy pages must exist before submitting
- **What happened:** submission was blocked until the support and privacy pages existed.
- **Rule:** App Store Connect requires a Support URL, which must lead to real contact information (an email at least; some countries' laws want a legal address and phone number too), and a Privacy Policy URL for iOS and macOS apps. Apple's guidelines also require the privacy policy link inside the app, in an easily accessible manner, not only in the listing, and say what the policy must cover: what data is collected and how it is used, that third parties get equal protection, how long data is kept and how it is deleted, and how to withdraw consent.
- **How to check:** the listing's support URL and privacy policy URL both load, and the app itself links to the policy (a settings or about screen is enough; a paywall is a good second place). The link is baked into the build, so the page has to exist at its final address before the build is made.
- **Source:** [App Store Connect Help: platform version information](https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information) (Support URL), [App Store Connect Help: app information](https://developer.apple.com/help/app-store-connect/reference/app-information/) (Privacy Policy URL), [App Review Guidelines, 5.1.1 Data Collection and Storage](https://developer.apple.com/app-store/review/guidelines/#5.1.1)
- **Status:** Checked 2026-10-19 (saved copies fetched 2026-10-12 and 2026-10-18).

### A website in an app wrapper gets rejected
- **Rule:** Apple's guidelines say an app should include features, content and UI that elevate it beyond a repackaged website (4.2), and that apps shouldn't primarily be web clippings, content aggregators or a collection of links (4.2.2).
- **How to check:** if the app is mostly a web view (Capacitor, a WebView screen, a site built in Lovable, Bolt or v0 and wrapped), list what it does that the website cannot: push notifications, offline use, the camera, widgets, purchases, a native home screen. If the answer is nothing, add at least one before submitting, and say what it is in the review notes.
- **Source:** [App Review Guidelines, 4.2 Minimum Functionality](https://developer.apple.com/app-store/review/guidelines/#4.2)
- **Status:** Checked 2026-10-19 (saved copy fetched 2026-10-18). That Apple has no route for a web app without a native wrapper is an inference; no page says it.

### Template and copycat apps get rejected as spam
- **Rule:** apps made from a commercial template or an app generation service are rejected unless the provider of the app's content submits them (4.2.6). Apple also says not to submit apps that are indistinguishable from what's already widely available, and names crowded categories (dating, flashlight, sound effects, wallpaper, simple timers, fortune telling) that it won't accept without a meaningfully different experience (4.3(b)). Submitting the same app under several bundle IDs is spam (4.3(a)).
- **How to check:** the app is submitted from the account of whoever owns its content, not a template seller's. In one sentence, say what this app does that the top results for its category don't. Put that sentence at the start of the description and the review notes.
- **Source:** [App Review Guidelines, 4.2.6](https://developer.apple.com/app-store/review/guidelines/#4.2.6), [App Review Guidelines, 4.3 Spam](https://developer.apple.com/app-store/review/guidelines/#4.3)
- **Status:** Checked 2026-10-19 (saved copy fetched 2026-10-18).

### Social login needs a private login option next to it
- **Rule:** an app that uses a third party or social login (Google, Facebook and so on) for the main account must also offer an equivalent login that limits data to name and email, lets people keep their email private, and doesn't collect interactions for advertising without consent. Sign in with Apple is the usual way to meet this, though the guideline no longer names it. Exceptions: apps that only use the company's own accounts, education or enterprise apps that need an existing school or work account, apps using a government or industry backed electronic ID, and alternative app marketplaces using their own login.
- **How to check:** open the sign in screen. If it shows Google or another social login, confirm Sign in with Apple (or an equivalent) is there too.
- **Source:** [App Review Guidelines, 4.8 Login Services](https://developer.apple.com/app-store/review/guidelines/#4.8)
- **Status:** Checked 2026-10-19 (saved copy fetched 2026-10-18).

### Reviewers need a way in
- **Rule:** if the app has a login, give App Review a demo account (and keep the server running), including the login for any single sign on service the app uses. A built in demo mode instead of an account is allowed only when legal or security reasons prevent a demo account, and with Apple's approval first. The demo account must not expire. In-app purchases must be complete, visible to the reviewer and working; if one can't be found, explain why in the review notes.
- **How to check:** create a demo account with realistic content, put it in App Review Information, and sign in with it on a fresh install the day you submit.
- **Source:** [App Review Guidelines, 2.1 App Completeness](https://developer.apple.com/app-store/review/guidelines/#2.1), [App Store Connect Help: platform version information](https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information)
- **Status:** Checked 2026-10-19 (saved copies fetched 2026-10-12 and 2026-10-18).

### Uploads are refused without a privacy manifest for certain APIs
- **Rule:** since 1 May 2024, App Store Connect does not accept apps that use "required reason" APIs without declaring an approved reason in the privacy manifest (the `NSPrivacyAccessedAPITypes` array in `PrivacyInfo.xcprivacy`). Each third party SDK must declare its own use in its own manifest; it can't rely on the app's. Apple emails a reminder when an upload uses one without a reason. The API categories (file timestamp, system boot time, disk space, active keyboards, user defaults) are listed on the page.
- **How to check:** look for `PrivacyInfo.xcprivacy` in the iOS project. Keep SDKs current, since older versions may lack their manifest. If an upload is refused, the email names the missing API.
- **Source:** [Apple: describing use of required reason API](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api), [Apple: upcoming requirements](https://developer.apple.com/news/upcoming-requirements/)
- **Status:** Checked 2026-10-19 (saved copy fetched 2026-10-19). The category names are not yet in the saved copy; re-check them once the snapshot includes the page's topic list.

### Builds must use a recent Xcode
- **Rule:** Apple raises the minimum Xcode and SDK version for uploads each year, and the minimum deployment target too. The current values are in `facts.md`.
- **How to check:** the Xcode version used for the build, local or in the cloud. Cloud build machines can lag behind the newest Xcode (from experience).
- **Source:** [Apple: upcoming requirements](https://developer.apple.com/news/upcoming-requirements/)
- **Status:** Checked 2026-10-19 (saved copy fetched 2026-10-12).

### Privacy labels are only in App Store Connect's website
- **Rule:** the App Store Connect API can upload listing text and screenshots, but has no way to set the App Privacy answers. They are filled in on the website by the Account Holder, an Admin or an App Manager.
- **How to check:** draft the answers from the code, including data collected by third party SDKs (analytics, crash reporting, purchases), which Apple says the answers must cover. Update them whenever the app's practices change.
- **Source:** [App Store Connect Help: manage app privacy](https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy)
- **Status:** Checked 2026-10-12 (help page opened and read; that no API exists is from the API index listing none).

## Google Play

### New personal accounts must run a closed test first
- **What happened:** production access was refused in April 2026 because testers installed the app but did not use it. The 12 had been recruited from a reciprocal testing community, which fills the headcount and nothing else. Android launch slipped by about six weeks.
- **Rule:** a personal developer account created after 13 November 2023 must run a closed test with at least 12 testers opted in continuously for at least 14 days before applying for production. A tester who opts out and back in only counts if their 14 days are consecutive, so leaving restarts their clock. Google lists fewer than 12 opted in testers or "insufficient tester engagement" as reasons it may require more testing. The application asks you to summarize tester feedback and how you collected it, and review "usually takes seven days or less". Google's page covers personal accounts only; it does not say how organization accounts are treated. That it was 20 testers before December 2024 is from experience.
- **How to check:** first check whether it applies to this app at all (see "Does this apply to this app?" in `play-closed-test.md`): Production is disabled in Play Console until the requirement is met, so an open "Create production release" page means it is not blocking. If it applies, start closed testing early, recruit more than 12 testers who will actually use the app (reaching 12 and getting them engaged are two different jobs, and only the first can be traded for: see "Where the 12 come from" in `play-closed-test.md`), ask them not to leave the test, and keep a record of their feedback for the application. The page does not say whether a dip below 12 restarts the whole 14 days. It applies to every app on such an account, not only the first: Google's page says these accounts must "test their apps before those apps are eligible for distribution". That production access is then granted app by app is an inference. Start each new app's closed test as early as possible.
- **Source:** [Play Console Help: app testing requirements for new personal developer accounts](https://support.google.com/googleplay/android-developer/answer/14151465)
- **Status:** Checked 2026-10-19 (saved copy fetched 2026-10-12).

### Some libraries add photo permissions Google rejects
- **What happened:** from experience, a build was rejected in May 2026 under the Photo and Video Permissions policy. `expo-media-library` had silently added `READ_MEDIA_IMAGES` and `READ_MEDIA_VIDEO` to the manifest.
- **Rule:** apps targeting Android 13 (API 33) or later may request these permissions only when system pickers (like the Android Photo Picker) are not sufficient for core functionality, with a declaration in Play Console. Others should use a system picker.
- **Contacts too:** apps targeting Android 17 (API 37) or later may request `READ_CONTACTS` only if the Android Contact Picker is not sufficient. Play Console has prompted for a declaration since September 2026, and compliance is mandatory on 27 January 2027, with a 30 day automatic self extension in Console.
- **How to check:** list the permissions in the release build's merged manifest. Remove unwanted ones with `tools:node="remove"` in the app's manifest. In Expo, list them under `android.blockedPermissions` in app config, which Expo's docs call the only way to remove permissions a library adds.
- **Source:** [Play Console Help: Understanding Restricted Permissions with minimum scope alternatives](https://support.google.com/googleplay/android-developer/answer/16935362), [Expo: permissions](https://docs.expo.dev/guides/permissions/)
- **Status:** Checked 2026-10-19 (saved copies fetched 2026-10-12; the old link 14115180 now redirects to 16935362).

### Apps with accounts need a web page for deleting them
- **Rule:** if the app lets people create an account, it must offer deletion in the app and a web link where deletion can be requested, declared in the Data safety form. The web link must load without error, make the deletion path easy to find, and name the app or developer as it appears on the store listing. The in app path must be easy to find too (for example in account settings). Freezing or deactivating an account is not deletion: the associated data must be deleted too, and any data kept for security, fraud or legal reasons must be disclosed, for example in the privacy policy.
- **How to check:** the deletion page loads without the app installed, names the app as the listing does, and lets someone request deletion without reinstalling. Deleting a test account actually removes its data.
- **Source:** [Play Console Help: account deletion requirements](https://support.google.com/googleplay/android-developer/answer/13327111), [Play Console Help: User Data policy](https://support.google.com/googleplay/android-developer/answer/10144311)
- **Status:** Checked 2026-10-19 (saved copies fetched 2026-10-12).

### Google raises the minimum target Android version every year
- **Rule:** since 31 August 2026, new apps and updates must target Android 16 (API 36); existing apps must target API 35 to stay available to new users on newer devices. An extension to 1 November 2026 could be requested. Wear OS and Android Automotive OS apps need only API 35, and Android TV and Android XR apps API 34.
- **How to check:** the target SDK in the Android build settings. That the floor rises every year with an August deadline is an inference from past years, so check the page each spring.
- **Source:** [Android Developers: target API level requirements](https://developer.android.com/google/play/requirements/target-sdk)
- **Status:** Checked 2026-10-19 (saved copy fetched 2026-10-12).

### Every app needs a privacy policy, even one that collects nothing
- **Rule:** all apps must post a privacy policy link in Play Console and a link or text inside the app. Apps that access no personal or sensitive data must still have one. It must be on an active, public, non-geofenced URL (no PDFs), non-editable, and clearly labelled as a privacy policy. It must name the developer or company shown on the store listing, or name the app. The Data safety answers must match it.
- **How to check:** the policy loads in a private browser window, its title says privacy policy, it names you or the app as the listing does, and the app links to it (a settings or about screen is enough).
- **Source:** [Play Console Help: User Data policy](https://support.google.com/googleplay/android-developer/answer/10144311)
- **Status:** Checked 2026-10-19 (saved copy fetched 2026-10-12).

### A web app on Play needs its site to vouch for the app
- **Rule:** a web app can ship on Google Play as a Trusted Web Activity (Bubblewrap builds one). The site must publish `/.well-known/assetlinks.json` matching the key that signs the app. If verification fails, the app shows the site as a Custom Tab with browser UI at the top. The same happens on a device where no installed browser supports Trusted Web Activities. Google's app signing key is the one installed devices see, so list its fingerprint (and the upload key's if you sideload test builds).
- **How to check:** install the build from a Play testing track and confirm no address bar shows. Compare the SHA-256 fingerprint in `assetlinks.json` with the app signing key in Play Console.
- **Source:** [Android Developers: Trusted Web Activities quick start](https://developer.android.com/develop/ui/views/layout/webapps/guide-trusted-web-activities-version2)
- **Status:** Checked 2026-10-19 (saved copy fetched 2026-10-12).

### Play Console screens move often
- **What happened:** navigation paths given from memory were wrong, repeatedly. In October 2026 the Create app form asked for the **package name**, which Google's own help page (saved copy) did not mention; that page still listed a contact email field the form no longer had.
- **Rule for agents:** read the saved copy of Google's page before giving any Play Console steps, and say which parts come from it. When the user's screen disagrees with the page, the screen wins: ask them to paste or screenshot it, then update this file.
- **Package name at Create app:** enter the app's final package name (the same as the build's `applicationId`). Google says package names are permanent and can never be deleted or reused, so it must match the rename decided before the first upload.
- **Source:** [Play Console Help: Create and set up your app](https://support.google.com/googleplay/android-developer/answer/9859152)
- **Status:** Seen on the live form 2026-10-19; the permanence rule checked against the saved copy fetched 2026-10-12, unchanged on 2026-10-18.

### Code shrinking may never have been turned on
- **What happened:** Play Console flagged low app optimization in September 2026. Code shrinking (R8) had never been turned on.
- **Rule:** Android recommends always enabling code shrinking and resource shrinking for release builds. In Expo, `expo-build-properties` turns them on (`enableMinifyInReleaseBuilds`, and `enableShrinkResourcesInReleaseBuilds` alongside it).
- **How to check:** confirm release builds enable minification, then test the release build, since shrinking can break libraries that load code by reflection.
- **Source:** [Android Developers: enable app optimization](https://developer.android.com/topic/performance/app-optimization/enable-app-optimization), [Expo: BuildProperties](https://docs.expo.dev/versions/latest/sdk/build-properties/)
- **Status:** Checked 2026-10-19 (saved copies fetched 2026-10-12 and 2026-10-18). That it was off in a real app is from experience.

## Builds and versions

### Settle the app's id before the first upload
- **What happened:** an app renamed after its first development builds still carried the old name in its bundle id and package name, weeks before its first store upload. The rename only cost a rebuild because nothing had been uploaded yet.
- **Rule:** Google says to never change the application ID once the app is published, because Play treats an upload with a new ID as a completely different app. Apple lets an App Store Connect record's bundle ID change only until a build is uploaded, and its SKU never; the name can change until the app is submitted. So an existing record made under an old name can be renamed and repointed, not recreated, if nothing was uploaded to it.
- **How to check:** before the first upload, confirm the bundle ID and package name use the final name, and the deep link scheme too. Changing them later means a new store listing with no reviews or users. From experience: a changed id also installs as a separate app on test phones, with its own local data, so testers start over, and local storage keys should stay as they are when renaming, because changing them wipes saved data.
- **Source:** [Android Developers: configure the app module](https://developer.android.com/build/configure-app-module), [App Store Connect Help: App information](https://developer.apple.com/help/app-store-connect/reference/app-information/app-information)
- **Status:** Checked 2026-10-19 (saved copies fetched 2026-10-12).

### Every upload needs a new build number (increase it every time)
- **Rule:** Google Play will not accept a version code that has already been used, and the greatest value it allows is 2100000000. Apple uses the build string to identify each build uniquely.
- **How to check:** one counter shared by iOS and Android, increased on every build.
- **Source:** [Android Developers: version your app](https://developer.android.com/studio/publish/versioning), [App Store Connect Help: upload builds](https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds)
- **Status:** Checked 2026-10-19 (saved copies fetched 2026-10-12).

### Some code crashes only in the release build
- **What happened:** in a React Native app, `console.time` and UUID helpers relying on Node crypto threw "undefined is not a function" only in release builds, with no stack trace.
- **Rule:** Expo's docs say running the app in production mode locally shows errors that normally would not be thrown, with `npx expo start --no-dev --minify`.
- **How to check:** run that command for a quick look, and test the real release build before submitting, on every stack. Track the current step inside long async operations so an error says where it happened.
- **Source:** [Expo: runtime issues](https://docs.expo.dev/debugging/runtime-issues/)
- **Status:** Checked 2026-10-19 (saved copy fetched 2026-10-12). The two specific causes are from experience.

### Test the build a new user gets, not the one on your machine

- **What happened:** reported by a reader after the skill was posted: development mode hides failures that only exist in a release build, so the build that gets submitted is often the first one nobody has run.
- **Rule:** the causes are ordinary and invisible in development. Values from the environment are baked in when the bundle is built, not read when the app runs, so a variable that is set in your shell and missing from the build environment is simply absent from the app. Expo's docs put it plainly: Expo CLI "replaces all references in your code to `process.env.EXPO_PUBLIC_[VARNAME]` with the corresponding value set in the .env files", which happens at build time. Permission strings live in the native config rather than in JavaScript, so a permission the code requests can be missing from the built app. And anything that quietly relied on the development server being up has nothing to fall back on once it is not.
- **How to check:** install the exact build you are about to submit, on a real device, as a **clean install** rather than over the existing one, with the development server stopped. An upgrade keeps the previous install's data and granted permissions, so the path a new user takes is the one that stays untested. Then cold start it once with **airplane mode on**, which catches first launch network assumptions: a splash screen waiting on a request that never returns, a remote config with no default, a sign in check that blocks the first screen.
- **Source:** [Expo: environment variables](https://docs.expo.dev/guides/environment-variables/)
- **Status:** From experience, reported by a reader. The environment variable behaviour was checked 2026-10-20.

## Things that fail silently

### Crash reporting can be installed and still report nothing
- **What happened:** for months no crash reached the dashboard. Three separate causes: the key pointed at another account, the native module was excluded from the build, and an availability check always returned false in the new architecture.
- **How to check:** trigger a deliberate test error in a release build and confirm it arrives. Zero events over a long period is a delivery fault, not a perfect app.
- **Status:** From experience.

### The privacy policy drifts from what the app does
- **What happened:** the published policy described a feature as not active while it shipped on by default.
- **Rule:** Apple asks you to update your privacy answers in App Store Connect when your practices change, and says "you do not need to submit an app update in order to change your answers". Google asks you to update the Data safety section when the app's data practices change.
- **How to check:** whenever the app starts sending something new to a server, update the privacy policy, Apple's privacy labels and Play's Data safety form together.
- **Source:** [Apple: App privacy details](https://developer.apple.com/app-store/app-privacy-details/), [Play Console Help: Data safety section](https://support.google.com/googleplay/android-developer/answer/10787469)
- **Status:** Checked 2026-10-19 (saved copies fetched 2026-10-12).

### Content a model rewrote can lose its safety caveat
- **What happened:** from experience, a baby app bundled 91 real social posts, with titles and tips rewritten by a model. A creator wrote "Side/Stomach (while holding NOT sleeping in crib)" and the app showed "Side/Stomach", which is the unsafe version. No test or review would notice, because the text still reads well.
- **Rule:** Apple says medical apps that could provide inaccurate information "may be reviewed with greater scrutiny" (1.4.1), and that apps "should remind users to check with a doctor". Google Play does not allow misleading or harmful health functionality. Every app with health features must complete the Health apps declaration form on the App content page in Play Console. Health apps that are not regulated medical devices must say in the store description that the app is "not a medical device and does not diagnose, treat, cure, or prevent any medical condition", and apps must remind users to consult a healthcare professional.
- **How to check:** find every place a model writes or rewrites content the app shows (sample content, imports, summaries). Its prompt must keep safety caveats with the advice they qualify, leave out doses, thresholds, diagnosis and treatment, and send mostly medical posts to "ask your doctor". Then read the bundled content against the original posts, looking for a caveat that went missing. In the app, remind users to check with a doctor or healthcare professional. On Play, complete the Health apps declaration and put the not a medical device line in the store description.
- **Source:** [App Review Guidelines, 1.4.1](https://developer.apple.com/app-store/review/guidelines/#1.4.1), [Play Console Help: Health Content and Services](https://support.google.com/googleplay/android-developer/answer/16679511)
- **Status:** Checked 2026-10-19 (saved copies fetched 2026-10-18 for Apple and 2026-10-13 for Google).

### On Android, store prices only load for a licence tester or a Play install
- **What happened:** checklist items asked to verify prices on a test phone where they could never load.
- **Rule:** Google Play billing is blocked for apps not signed and uploaded to Google Play, but licence testers bypass that check, even on sideloaded debug builds, as long as the package name matches the app in Play. On a test track, purchases cost real money unless the user is a licence tester.
- **How to check:** sign in on the device with a Google account added as a licence tester in Play Console, and use the same package name. Otherwise install from a Play testing track: each tester must opt in, and a newly published track can take a few hours to be available. A build with neither cannot load prices.
- **Source:** [Android Developers: test your Google Play Billing integration](https://developer.android.com/google/play/billing/test)
- **Status:** Checked 2026-10-19 (saved copy fetched 2026-10-18).

### Paid tiers get in the way of testing
- **What happened:** automated test runs used up the free tier and recorded the paywall; giving yourself premium hid every free tier screen.
- **How to check:** a server side allowlist of test devices that skips limits, and a development only switch to be treated as free.
- **Status:** From experience.

## Stack specific: Expo and React Native

### Never run the clean rebuild once native folders are managed by hand
- **What happened:** `expo prebuild --clean` deleted hand written native fixes and files.
- **Rule:** Expo's docs say `--clean` deletes any existing native directories before generating them. For projects whose native folders are managed by hand, Expo says not to run `npx expo prebuild` at all, and suggests moving those edits into app config or config plugins. Without hand edits, `--clean` is the mode Expo generally recommends.
- **How to check:** if native folders carry hand edits, from experience: use plain `npx expo prebuild` only when you must, then read `git diff ios/ android/`.
- **Source:** [Expo: Continuous Native Generation](https://docs.expo.dev/workflow/continuous-native-generation/)
- **Status:** Checked 2026-10-19 (saved copy fetched 2026-10-12).

### Changes in app.json may not reach a committed native project
- **What happened:** Android settings added to `app.json` never reached the build, because the `android/` folder was committed and nothing regenerated it.
- **Rule:** Expo's docs say that when a project has `android` and `ios` folders, EAS Build does not run prebuild, to avoid overwriting changes made there. The alternative is to list those folders in `.gitignore` or `.easignore`, so EAS generates fresh ones during the build.
- **How to check:** after changing native settings in `app.json`, confirm they appear in the generated native files.
- **Source:** [Expo: Continuous Native Generation](https://docs.expo.dev/workflow/continuous-native-generation/)
- **Status:** Checked 2026-10-19 (saved copy fetched 2026-10-12).
