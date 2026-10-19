# Payments: store products and RevenueCat

Most indie apps sell subscriptions through RevenueCat, which sits between the app and
both stores. The order matters, because each step needs the one before it:

0. **Before purchases can work:** agreements signed, tax forms done and banking
   added in both stores (RevenueCat: required to fetch products). On Apple, an app that
   has never been released must be released before in-app purchases work in
   production. If the release has new products, RevenueCat suggests releasing manually
   and waiting about 24 hours after "Cleared for Sale".
1. **Store products first.** In App Store Connect: a subscription group, then each
   product (duration, price, introductory offer such as a free trial), then a display
   name and description for the group and each product. The first auto renewable
   subscription must be submitted with a new app version: select Add for Review on the
   subscription's page, then submit it with the build. Metadata changes can take up to
   1 hour to reach sandbox. From experience (2026-10-14): Apple marks products without
   the names "Missing Metadata", and the review screenshot is the paywall, taken from a
   real build, so it comes later. Play Console: Monetize with Play, Products,
   Subscriptions; create the subscription, then a base plan, then any offer. Selling
   needs a payments profile. RevenueCat says Google may not recognize the package name
   until the store listing and the first build upload are done.
2. **RevenueCat project.** One project per app; never reuse another app's project or
   keys. Add an App Store app (bundle ID, the In-App Purchase Key and its Issuer ID;
   without the key, transactions fail to be recorded; one key serves every app on the same App Store Connect account) and a Play Store app (package
   name plus a Google Cloud service account). The service account needs the Pub/Sub
   Editor and Monitoring Viewer roles in Google Cloud, and four Play Console
   permissions: View app information and download bulk reports, View financial data,
   orders and cancellation survey responses, Manage orders and subscriptions, and
   Manage store presence. It can take up to 36 hours to start working; RevenueCat's
   page gives a trick that is not guaranteed: edit and save any product description in
   Play Console, then revert it.
3. **Products, entitlement, offering.** Import the store products, attach them to one
   entitlement whose identifier matches the app's code, then create an offering
   (Offerings tab; the identifier can't be changed later), add one package per
   duration, and make it the Default Offering (Offerings tab, the offering's Actions
   icon, Make Default). Apps that read the current offering, the usual pattern, show
   an empty paywall without that last step. From experience: a new project had no
   offering, and `default` is the usual identifier.
4. **Keys into the app.** Keys live under Project Settings, API keys. The public SDK
   keys are safe in the app's config; secret keys never go in the app (from
   experience, the prefixes are `appl_`, `goog_` and `sk_`). **You must replace a
   Test Store API key before release:** release builds crash on purpose when they find
   one. React Native: enable the In-App Purchase capability in Xcode, and set the
   purchasing Activity's `launchMode` to `standard` or `singleTop` (React Native's
   default `singleTask` can cancel purchases).
5. **Test in sandbox** from a real build, then once from TestFlight or Play internal
   testing. Apple's steps are below. On Google Play, billing is blocked for apps that
   aren't signed and uploaded to Play, unless the Google Account is a license tester.
   Make every tester a license tester: otherwise test track purchases cost real money.
   From experience: the release on the test track also had to be approved first.

## Testing an Apple purchase in sandbox

From Apple's own pages (saved copies fetched 2026-10-19):

1. **Before anything:** the Account Holder has signed the Paid Applications Agreement,
   and the test phone has **Developer Mode** on.
2. **Make a tester:** App Store Connect, **Users and Access**, the **Sandbox** tab, then
   **+** (the first time: **Create Test Accounts**). Not the People tab: **New User**
   there adds a team member and refuses a `+` in the email. On the Sandbox form a `+`
   subaddress is allowed if the email provider supports it. The email must never have
   been an Apple Account. Name, email and password can't be edited afterwards.
3. **Build from Xcode** onto the phone (a development signed build; no upload needed).
4. **Buy in the app.** The first purchase attempt asks you to sign in: use the sandbox
   tester. The purchase sheet then shows **[Environment: Sandbox]**; without it you are
   in production. After that first attempt, the account shows in **Settings,
   Developer, Sandbox Apple Account** (iOS 18 and later), with no need to sign out of
   your own Apple Account.
5. **Renewals are fast:** by default 1 month renews every 5 minutes, up to 12 times.
   The rate can be changed per tester. TestFlight is different: since December 2024
   TestFlight subscriptions renew once every 24 hours whatever their length.
6. **Prices may look wrong** in sandbox and TestFlight (often USD). RevenueCat says to
   check the purchase flow works, not the prices.


## Keys and settings people get stuck on

- **Where the In-App Purchase Key lives:** App Store Connect, Users and Access,
  Integrations, In-App Purchase, where the Issuer ID also shows (if it is missing,
  create an App Store Connect API key and it appears). Apple lets you download the .p8
  file once. From experience (2026-10-18): if the account already has a key in
  RevenueCat (another app), RevenueCat offers "Select existing key", and choosing it
  did not affect the other app.
- **App Store Connect API key:** the second key on the same RevenueCat page.
  Unverified, no saved page says it: it lets RevenueCat import the store products
  instead of typing their ids.
- **Apple Small Business Program:** for developers with up to 1 million USD in
  proceeds across all their apps (and any Associated Developer Accounts) in the prior
  calendar year, or new to the App Store; commission 15%. To enroll you must be the
  Account Holder, accept the latest Paid Apps agreement and list any Associated
  Developer Accounts. Proceeds are adjusted 15 days after the end of the fiscal month
  in which enrollment is approved, not for past sales. From experience: RevenueCat's
  toggle only changes its own revenue charts, and Apple's confirmation email is the
  quickest way to check enrollment.

Setup questions RevenueCat asks (category, platforms, framework) only shape its own
dashboard and docs; pick the closest and move on.

## Official pages

- [RevenueCat: Quickstart](https://www.revenuecat.com/docs/getting-started/quickstart)
- [RevenueCat: React Native installation](https://www.revenuecat.com/docs/getting-started/installation/reactnative)
- [RevenueCat: Configuring the SDK](https://www.revenuecat.com/docs/getting-started/configuring-sdk)
- [RevenueCat: Entitlements](https://www.revenuecat.com/docs/getting-started/entitlements)
- [RevenueCat: Offerings](https://www.revenuecat.com/docs/offerings/overview)
- [RevenueCat: docs index for AI agents](https://www.revenuecat.com/docs/llms.txt)
- [RevenueCat: Displaying products](https://www.revenuecat.com/docs/getting-started/displaying-products)
- [RevenueCat: In-App Purchase Key configuration](https://www.revenuecat.com/docs/service-credentials/itunesconnect-app-specific-shared-secret/in-app-purchase-key-configuration)
- [RevenueCat: Google Play service credentials](https://www.revenuecat.com/docs/service-credentials/creating-play-service-credentials)
- [RevenueCat: Sandbox testing](https://www.revenuecat.com/docs/test-and-launch/sandbox)
- [RevenueCat: Launch checklist](https://www.revenuecat.com/docs/test-and-launch/launch-checklist)
- [App Store Connect Help: Offer auto-renewable subscriptions](https://developer.apple.com/help/app-store-connect/manage-subscriptions/offer-auto-renewable-subscriptions)
- [App Store Connect Help: Set up introductory offers](https://developer.apple.com/help/app-store-connect/manage-subscriptions/set-up-introductory-offers-for-auto-renewable-subscriptions)
- [App Store Connect Help: Create a Sandbox Apple Account](https://developer.apple.com/help/app-store-connect/test-in-app-purchases/create-a-sandbox-apple-account)
- [App Store Connect Help: Manage Sandbox Apple Account settings](https://developer.apple.com/help/app-store-connect/test-in-app-purchases/manage-sandbox-apple-account-settings)
- [App Store Connect Help: Overview of testing in sandbox](https://developer.apple.com/help/app-store-connect/test-in-app-purchases/overview-of-testing-in-sandbox)
- [Apple Developer: Testing in-app purchases with sandbox](https://developer.apple.com/documentation/storekit/testing-in-app-purchases-with-sandbox)
- [RevenueCat: Apple App Store sandbox testing](https://www.revenuecat.com/docs/test-and-launch/sandbox/apple-app-store)
- [Apple: App Store Small Business Program](https://developer.apple.com/app-store/small-business-program/)
- [Play Console Help: Create and manage subscriptions](https://support.google.com/googleplay/android-developer/answer/140504)

**Status:** the order comes from shipping a real app on 2026-10-14. Store and
RevenueCat facts: Checked 2026-10-19 (saved copies fetched 2026-10-14, Small Business
Program 2026-10-18). Anything marked "from experience" is not on a saved page.
