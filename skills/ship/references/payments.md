# Payments: store products and RevenueCat

Most indie apps sell subscriptions through RevenueCat, which sits between the app and
both stores. The order matters, because each step needs the one before it:

1. **Store products first.** In App Store Connect: a subscription group, then each
   product (duration, price, introductory offer such as a free trial), then a display
   name and description for the group and each product, or Apple marks them "Missing
   Metadata". The review screenshot is the paywall, taken from a real build, so it
   comes later. Play Console: the same products under Monetize, which needs the app's
   listing to exist first.
2. **RevenueCat project.** One project per app; never reuse another app's project or
   keys. Add an App Store app (bundle ID plus the In-App Purchase Key, which is account
   wide, so one key serves every app on the account) and a Play Store app (package
   name plus a Google Cloud service account, which can take up to 36 hours to start working; RevenueCat's page gives a trick that often speeds it up: edit and save any product description in Play Console, then revert it).
3. **Products, entitlement, offering.** Import the store products, attach them to one
   entitlement whose identifier matches the app's code, then create an offering (a new
   project has none: Offerings tab, + New, identifier `default`), add one package per
   duration, and make it the project's Default Offering. Apps that read the current
   offering, which is the usual pattern, show an empty paywall without that last step.
4. **Keys into the app.** The public SDK keys (`appl_...`, `goog_...`) are safe in the
   app's config; secret keys (`sk_...`) never go in the app.
5. **Test in sandbox** from a real build, then once from TestFlight or Play internal
   testing. Purchases do not work in a simulator without a StoreKit configuration file.
   Apple's steps are below.

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
  Integrations, In-App Purchase. Apple lets you download the .p8 file once. If the
  account already has a key in RevenueCat (another app), RevenueCat offers "Select
  existing key": choose it. It does not affect the other app.
- **App Store Connect API key:** the second key on the same RevenueCat page. It lets
  RevenueCat import the store products instead of typing their ids. Reuse an existing
  one the same way.
- **Apple Small Business Program toggle:** only changes RevenueCat's revenue charts
  (15% or 30% commission). What Apple pays depends on enrollment, which is per
  developer account, so every app on an enrolled account gets the lower rate. Check
  enrollment from Apple's confirmation email, or from proceeds in App Store Connect's
  Payments and Financial Reports. Not enrolled: apply on the program page; the rate
  applies from enrollment on, not to past sales.

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

**Status:** the order comes from shipping a real app on 2026-10-14. The one key for
every app and the 36 hour wait were checked 2026-10-14 against saved copies of
RevenueCat's pages. The links are saved weekly by the snapshot job.
