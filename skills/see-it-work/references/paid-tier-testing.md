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

### A state only a real customer can reach is still yours to test
- **Symptom:** a checklist item reads "on a build signed into an account that
  holds a grant", or "as a subscriber", and the only person who can do it is a
  paying user you would have to ask.
- **Cause:** the state lives in the purchase provider, not in the app, so no seed
  or development switch can reach it.
- **Fix:** manufacture the state on a throwaway identity through the provider's
  own API. Most providers can grant promotional access to any customer id without
  a purchase, and every install already has one, including a simulator's anonymous
  id. The shape is: find the id the install is using, grant the entitlement with a
  short expiry, relaunch and check what you came to check, then revoke.
- Find the id by reading the provider SDK's own stored preferences in the app
  container, or by logging it in a development build.
- **Revoke when you are done, and say so.** A grant with a short expiry also
  clears itself, but do not leave it to that.
- This is a write to a production billing system, so ask the owner first, and
  only ever do it against an identity nobody owns. Never against a real customer.

### An item a person cannot perform does not belong on a release checklist
- **Symptom:** the list grows items that are never ticked, because performing them
  needs an account, a device or a purchase the person does not have.
- **Fix:** before writing an item, say out loud how the person will do it. If the
  answer is "ask a user", either reach the state yourself by the section above, or
  do not write the item. For the ones that genuinely need a person, say in the item
  WHY: two accounts on one phone, a clock change, a one shot reward on an account
  that has never claimed it. A reason is what makes an item doable later.
