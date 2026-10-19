# Google Play: closed test to production access

New personal Play accounts (created after 13 Nov 2023) can't publish to production until
a closed test has had at least 12 testers opted in for the preceding 14 days. This is the
click path, from Google's and Expo's own pages. Founders get lost here because Google's
pages give the same menu several names, so name the screen and the button, never a guess.
Where a page is silent, say "Not stated by Google".

**Calendar.** Closed test release review: no time stated; new accounts can see reviews of
"up to seven days or longer". Opt-in link: "several hours" after the first publish. Then
14 consecutive days per tester. Production access review: "usually takes seven days or
less". Then the first production release is reviewed. Plan on 4 to 5 weeks from the first
upload (inference, not stated by Google).

## 0. Before creating the app

1. **Device verification:** Play Console **Home**; if the task "Verify that you have access
   to an Android mobile device" shows, **View details**, scan the QR code with a physical,
   non-rooted Android 10+ phone, sign in to the Play Console app as the owner, **Verify**.
2. **Target API:** new apps must target API 36 (see `facts.md`). Expo's SDK table gives
   SDK 56, 57 and 58 `targetSdkVersion` 36.
3. **Billing Library:** since 2026-08-31 new apps must use Play Billing Library 8 or later
   (extension to 2026-11-01). Check the purchases SDK's bundled version.

## 1. Create app

**Home**, **Create app**. Fields: default language; app name (30 characters); **App** or
**Game**; **Free** or **Paid**; a contact email. **Declarations:** Developer Program
Policies, US export laws, and accept the Play App Signing Terms of Service. **Create
app**. No package name is asked: the first uploaded bundle fixes it, permanently.

## 2. Store listing and settings

Closed testing requires "Complete app setup", and the store listing is shared with test
tracks. **Dashboard** lists the mandatory tasks (green tick when done).
**Main store listing** (Grow users > Store presence): name, short and full description,
graphics (sizes in `facts.md`). **Store settings** (same menu): **App category** (the app
list includes Parenting, Medical, Health and Fitness), **Manage tags** (up to 5),
**Contact Details** (email required, website recommended).

## 3. App content

One page, three paths in Google's own help (Policy and programs > App content; Policy >
App content; Monitor and improve > Policy and programs > App content). Each item:
**Start**, or **Manage** once filled. Do Ads, sign-in details and privacy policy before
Target audience, which requires them.

| Item | Closed test? | Notes |
| --- | --- | --- |
| Privacy policy | Needed for Data safety | URL on an active page |
| Ads | Not stated per track | In-app purchase offers are not "ads" for the label |
| Sign-in details (the Target audience page says "App access") | Not stated per track | No login but a paywall: still give instructions to reach paid content. **+ Add new instructions**, up to 5 sets |
| Target audience and content | Not stated per track | Any child age group brings the Families policy |
| Content ratings | Not stated per track | Email (for IARC), category, **Next**, answers, **Submit**. "Unrated" apps may be removed |
| Data safety | **Yes**: "closed, open, or production testing tracks"; internal only is exempt | Overview, Data collection and security, Data types, Data usage and handling, preview, **Submit**. Include third-party SDKs |
| Financial features | **Yes**, same wording | Even with none, select "My app doesn't provide any financial features" |
| Health apps | **Yes**, same wording | Even with none, declare "My app doesn't provide any health features". No entry for general parenting or pregnancy content: a judgment call |
| Government apps, News, COVID-19 | Not stated per track | Declare not applicable |
| Advertising ID | Not stated by Google | The help page covers only the `AD_ID` manifest permission |

Account deletion: an app that "enables account creation" needs an in-app delete path and
a web link, entered in Data safety. Whether a silent anonymous account counts: Not stated
by Google.

If **Create new release** is greyed out, Google says to finish the Dashboard setup tasks.

## 4. The app bundle

Expo: `eas build --platform android --profile production` makes an `.aab` (an APK can't
be submitted). Let EAS create the upload key; Google holds the app signing key (new apps
default to Google-generated, quantum-ready hybrid signing).

First upload: Expo (2026-10-09) says the default `eas submit` "works out of the box" for a
first submission and calls a manual upload optional. Google's API pages state no
first-upload limit. But `eas submit` needs a service account key first, and **defaults to
the internal track**. Its `track` option takes `production`, `beta`, `alpha`, `internal`;
that `alpha` is the default closed track is unverified. Simplest first time: upload by hand
on the closed track.

## 5. Closed test

**Internal testing trap:** "A user who opts into your app's internal test is no longer
eligible to receive an open or closed test" until they opt out. Keep the 12 off internal.

1. **Test and release > Testing > Closed testing**. A closed track exists already: **Manage
   track**. (**Create track** makes extra tracks, which can't use country targeting.)
2. **Testers** tab. **Email** (default): **Create email list**, name, addresses or **Upload
   CSV file** (one per line, not UTF-8 with BOM, overwrites), **Save changes**, **Create**,
   select it. Or **Google Groups**: `name@googlegroups.com`; testers join the group before
   opting in. Lists hold 2,000 each; Groups have no user limit. Google recommends neither
   for small tests: a list suits known testers, a group suits self-sign-up (inference).
3. Feedback URL or email (shown on the opt-in page). **Save changes**.
4. **Countries/regions** tab: synced to production by default; **Unsync countries/regions**,
   **Edit countries**. Targeting uses each tester's Play country, not location.
5. **Create new release**. First release: follow the Play App Signing prompts and keep the
   Google-generated key. **App bundles**, **Upload**. Release name (Console only). Release
   notes between language tags, 500 characters, no promotion. **Next**.
6. **Preview and confirm**: fix every item under **Errors summary** (**Show more**);
   warnings can stay. No rollout percentage on a first release. **Save** (or **Publish**,
   whichever shows).
7. **Publishing overview**, **Changes not yet sent for review**: pre-review checks (under
   15 minutes; missing declarations can't be skipped), then **Send for review**. Nothing is
   reviewed until you click it.

## 6. Testers join

Once the app status is **Published** (never in Draft or Pending publication): **Manage
track**, **Testers**, copy the shareable link. Testers open it signed in to the listed
Google account, read the tester terms, opt in, then install from Play (closed tests can't
be found by search). Tell them to stay opted in for 14 days; Google asks you to. Private
feedback: Play Store, Profile, **Manage apps & devices**, **Beta**, the app, **Private
feedback to developer**. Read it at **Monitor and improve > Ratings and reviews > Testing
feedback**.

**The rule:** at least 12 testers opted in continuously for the preceding 14 days when you
apply; opting out and back in restarts that tester's count. Not stated by Google: where
Console shows the count, whether the developer counts, whether an install is required.
Keep a sheet of emails and opt-in dates, and recruit 15 to 20 (inference).

## 7. Apply for production

**Dashboard**, **Apply for production** (Production, Pre-registration and Open testing stay
off until approved). Three parts, each lost on **Discard** or leaving the page:

- **About your closed test:** how easy recruiting was; whether testers used all features
  and matched expected usage; a feedback summary and how it was collected. **Next**.
- **About your app/game:** target audience; value to users; estimated first-year installs.
  Not public. **Next**.
- **About your production readiness:** changes made from testing; how you judged it ready.
  **Apply**.

The owner gets an email. Too few testers or weak engagement can mean more testing.

## 8. Subscriptions

Billing features (creating products) unlock only after a version with the Play Billing
Library is published to any track, internal included. Then **Monetize with Play > Products
> Subscriptions**, **Create subscription**, **Add base plan**, **Activate**. Product IDs
can't be changed or reused. A payments profile is required. **Settings > License testing**
makes test purchases free; the developer account is always a license tester; products
must be activated before testing. Internal test and draft purchases have spend limits. The
RevenueCat order is in `payments.md`.

## Official pages

- [Play Console Help: Create and set up your app](https://support.google.com/googleplay/android-developer/answer/9859152)
- [Play Console Help: Set up your app on the app dashboard](https://support.google.com/googleplay/android-developer/answer/9859454)
- [Play Console Help: App testing requirements for new personal developer accounts](https://support.google.com/googleplay/android-developer/answer/14151465)
- [Play Console Help: Device verification requirements](https://support.google.com/googleplay/android-developer/answer/14316361)
- [Play Console Help: Set up an open, closed, or internal test](https://support.google.com/googleplay/android-developer/answer/9845334)
- [Play Console Help: Prepare and roll out a release](https://support.google.com/googleplay/android-developer/answer/9859348)
- [Play Console Help: Publish your app](https://support.google.com/googleplay/android-developer/answer/9859751)
- [Play Console Help: Control when app changes are reviewed and published](https://support.google.com/googleplay/android-developer/answer/9859654)
- [Play Console Help: Pre-review checks](https://support.google.com/googleplay/android-developer/answer/14807773)
- [Play Console Help: Distribute app releases to specific countries](https://support.google.com/googleplay/android-developer/answer/9874837)
- [Play Console Help: Use Play App Signing](https://support.google.com/googleplay/android-developer/answer/9842756)
- [Play Console Help: Prepare your app for review](https://support.google.com/googleplay/android-developer/answer/9859455)
- [Play Console Help: Sign in details for review](https://support.google.com/googleplay/android-developer/answer/15748846)
- [Play Console Help: Target audience and app content](https://support.google.com/googleplay/android-developer/answer/9867159)
- [Play Console Help: Content ratings](https://support.google.com/googleplay/android-developer/answer/9859655)
- [Play Console Help: Data safety](https://support.google.com/googleplay/android-developer/answer/10787469)
- [Play Console Help: Account deletion requirements](https://support.google.com/googleplay/android-developer/answer/13327111)
- [Play Console Help: Financial features declaration](https://support.google.com/googleplay/android-developer/answer/13849271)
- [Play Console Help: Health apps declaration](https://support.google.com/googleplay/android-developer/answer/14738291)
- [Play Console Help: Government apps](https://support.google.com/googleplay/android-developer/answer/9514050)
- [Play Console Help: Advertising ID](https://support.google.com/googleplay/android-developer/answer/6048248)
- [Play Console Help: Category and tags](https://support.google.com/googleplay/android-developer/answer/9859673)
- [Play Console Help: Create and manage subscriptions](https://support.google.com/googleplay/android-developer/answer/140504)
- [Play Console Help: License testing](https://support.google.com/googleplay/android-developer/answer/6062777)
- [Google Play Help: Try new apps before release](https://support.google.com/googleplay/answer/7003180)
- [Android Developers: Getting ready (Play Billing)](https://developer.android.com/google/play/billing/getting-ready)
- [Google Play Developer API: tracks](https://developers.google.com/android-publisher/tracks)
- [Expo: Submit to the Google Play Store](https://docs.expo.dev/submit/android/)
- [Expo: Manual Android submission](https://docs.expo.dev/submit/android-manual/)
- [Expo: eas.json reference](https://docs.expo.dev/eas/json/)
- [Expo: Create your first build](https://docs.expo.dev/build/setup/)
- [Expo: SDK and Android versions](https://docs.expo.dev/versions/latest/)
- [Expo: Creating a Google Service Account key](https://github.com/expo/fyi/blob/main/creating-google-service-account.md)

**Status:** Checked 2026-10-19 (pages fetched 2026-10-19). Anything marked inference or
"Not stated by Google" is not on those pages.
