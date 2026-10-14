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
   entitlement whose identifier matches the app's code, and put them in the default
   offering.
4. **Keys into the app.** The public SDK keys (`appl_...`, `goog_...`) are safe in the
   app's config; secret keys (`sk_...`) never go in the app.
5. **Test in sandbox** from a real build, then once from TestFlight or Play internal
   testing. Purchases do not work in a simulator without a StoreKit configuration file.

Setup questions RevenueCat asks (category, platforms, framework) only shape its own
dashboard and docs; pick the closest and move on.

## Official pages

- [RevenueCat: Quickstart](https://www.revenuecat.com/docs/getting-started/quickstart)
- [RevenueCat: React Native installation](https://www.revenuecat.com/docs/getting-started/installation/reactnative)
- [RevenueCat: Configuring the SDK](https://www.revenuecat.com/docs/getting-started/configuring-sdk)
- [RevenueCat: Entitlements](https://www.revenuecat.com/docs/getting-started/entitlements)
- [RevenueCat: Displaying products](https://www.revenuecat.com/docs/getting-started/displaying-products)
- [RevenueCat: In-App Purchase Key configuration](https://www.revenuecat.com/docs/service-credentials/itunesconnect-app-specific-shared-secret/in-app-purchase-key-configuration)
- [RevenueCat: Google Play service credentials](https://www.revenuecat.com/docs/service-credentials/creating-play-service-credentials)
- [RevenueCat: Sandbox testing](https://www.revenuecat.com/docs/test-and-launch/sandbox)
- [RevenueCat: Launch checklist](https://www.revenuecat.com/docs/test-and-launch/launch-checklist)
- [App Store Connect Help: Offer auto-renewable subscriptions](https://developer.apple.com/help/app-store-connect/manage-subscriptions/offer-auto-renewable-subscriptions)
- [App Store Connect Help: Set up introductory offers](https://developer.apple.com/help/app-store-connect/manage-subscriptions/set-up-introductory-offers-for-auto-renewable-subscriptions)
- [Play Console Help: Create and manage subscriptions](https://support.google.com/googleplay/android-developer/answer/140504)

**Status:** the order comes from shipping a real app on 2026-10-14. The one key for
every app and the 36 hour wait were checked 2026-10-14 against saved copies of
RevenueCat's pages. The links are saved weekly by the snapshot job.
