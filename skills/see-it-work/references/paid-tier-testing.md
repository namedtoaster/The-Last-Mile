# Testing free and paid tiers

Freemium apps have two apps inside them. Testing one tends to break your ability
to test the other. These are **from experience** (2026).

### Automation uses up the free tier
- **Symptom:** a capture or journey that does real work (imports, scans, AI calls)
  starts recording the paywall instead of the feature.
- **Cause:** the automation is a real anonymous user and hits the free limit.
- **Fix:** a server side **allowlist of test device ids**, read from server config
  so you can change it without a release. A device on the list skips usage limits.
  Verify an id is on the list with a request that reports the device's status,
  before trusting it.
- Keep the list private. Never commit real device ids.

### On Android, the id the app sees is not the one adb shows
- **Cause:** since Android 8, `ANDROID_ID` is scoped per app signing key.
  `adb shell settings get secure android_id` returns the shell's id, not your app's.
- **Fix:** read the app's id from the app itself (log it in a development build,
  or show it on a debug screen). On an emulator with root you can also find it in
  the system's per app id table. Apps signed with the same key share one id.

### Giving yourself paid hides every free screen
- **Symptom:** after granting yourself premium, you can no longer see the paywall
  prompts, the limit messages or the trial card. They all check one flag and exit
  early.
- **Fix:** a development only "treat me as free" switch. It does not touch the
  purchase provider; it only changes the answer the app gets when it asks.
  Guard it with `__DEV__` so it cannot exist in a store build:

```ts
// Development only: pretend this person is on the free tier.
let forceFree = false;
export function setForceFree(on: boolean) { if (__DEV__) forceFree = on; }
export function effectivePremium(real: boolean): boolean {
  return __DEV__ && forceFree ? false : real;
}
```

  Persist the switch in local storage if you want it to survive a restart, and put
  it on a development settings screen.
- Add a way to show one time prompts again (a "reset first run moments" button
  that clears the same keys the test seed silences).

### Development builds may not reach the real purchase backend
- **Symptom:** promo codes, grants or purchases fail in a development build and
  work in the store build.
- **Cause:** a development build pointed at a local server has no production keys.
- **Fix:** test purchases and grants against a build pointed at the real backend,
  or on a store testing track. Do not "fix" the purchase code because of a failure
  that only happens locally.

### A simulator has no eligible introductory offer
- **Symptom:** the trial copy on the paywall never appears in a screenshot.
- **Cause:** the simulator account has no trial eligibility, so the paywall
  correctly shows the plain price.
- **Fix:** a seed variant that patches the loaded offer with a trial, development
  only, applied after the paywall has loaded its offers (or the reload wipes it).
  Real prices and trials still need a store testing account on a device.
