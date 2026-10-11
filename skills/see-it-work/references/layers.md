# The layers, one by one

Each layer proves some things and cannot prove others. Use the cheapest layer that
proves what the change needs, and say which one you used.

| Layer | Tool | Proves | Cannot prove |
| --- | --- | --- | --- |
| 1. Component tests | Jest + React Native Testing Library | What renders in each state, what a press does, where navigation goes | Geometry, anything native |
| 2. Seeded screenshots | Test only deep link + simulator screenshot | How a screen looks in a known state | How a person reaches it |
| 3. Smoke tier | Maestro, one case per screen | Every screen still mounts on a real OS | Layout, deep journeys |
| 4. Release build smoke | Same tier on a release build with the E2E flag | Nothing breaks only in a release build | Store only behaviour (real purchases, review prompts) |
| 5. Browser preview | react-native-web + a headless browser | Copy, colour, hierarchy inside a card | Gestures, native modules, real geometry |
| 6. Journeys | Maestro flows from the real entry point | How a person gets from A to B, and where they land | Layout details |

Commands below were checked against the official docs on 2026-10-11:
[Maestro](https://docs.maestro.dev), [Expo CLI](https://docs.expo.dev/more/expo-cli/),
[React Native Testing Library](https://oss.callstack.com/react-native-testing-library/docs/api/queries).

---

## 1. Component tests (write them first)

React Native Testing Library renders the component tree in Jest. It is fast and
runs anywhere, including a cloud session.

What to assert:

- **Full strings.** `screen.getByText('Add your first recipe')`. `getByText`
  matches the whole string by default (`exact` defaults to true), so a fragment
  match is a choice you made, and it hides truncated copy.
- **Every branch.** Loading, empty, success, error. A test per branch.
- **Presses.** Fire the press and assert what changed or what was called.
- **Navigation destination.** Mock the router and assert the route it was called
  with (`'/recipe/123'`), not just that `push` was called. Three bugs where a tap
  went to the wrong place passed tests that only checked a call happened.

The loop: write the test, watch it fail, implement, watch it pass, **undo the fix
and watch it fail again**, restore the fix.

The test after edit hook (`templates/ui-test-hook.sh`) makes this automatic: after
every edit to a screen or component file, it runs the test that imports that file
and feeds any failure back to the agent. When no test imports the file, it tells
the agent to write one first. It also runs the coverage check after edits to
route files.

## 2. Seeded simulator screenshots

Walking onboarding to reach a screen is slow and flaky. Instead, the app has a
test only deep link that seeds a known state and jumps straight to a screen:

```
<your-scheme>://test-seed?screen=<id>
<your-scheme>://test-seed?route=%2Fsome%2Froute
```

How it fits together (templates for each part):

- `e2eEnabled.ts`: one constant, true in development builds and in builds made
  with the E2E flag, false in store builds.
- `native-intent.ts`: Expo Router's `+native-intent` file. Its
  `redirectSystemPath({ path, initial })` sees the incoming link first. When the
  seam is on and the path is a test seed, it starts the seeding and returns `'/'`.
- `testSeed.ts`: sets up a signed in, onboarded user with sample data, silences
  every one time moment (review asks, celebrations, coach marks, permission
  primers), then navigates.

Silencing one time moments matters. Seeding data is exactly what arms "first
item" celebrations and review prompts, so without it the screen under test sits
behind an overlay. Keep the list of one time keys in one file and import it in the
seeder, so a new key is covered automatically. Variants that exist to show one of
those moments opt out.

Firing it and capturing:

```bash
# iOS simulator: bring the app under test to the front first. If another app is
# in front, iOS shows an "Open in <app>?" dialog and nothing seeds until it is
# answered (seen on iOS 18.6).
xcrun simctl launch <udid> <ios.bundle.id>
xcrun simctl openurl <udid> "<your-scheme>://test-seed?screen=home"
xcrun simctl io <udid> screenshot /tmp/shots/home.png

# Android emulator
adb -s <serial> shell am start -a android.intent.action.VIEW \
  -d "<your-scheme>://test-seed?screen=home" <android.package>
adb -s <serial> exec-out screencap -p > /tmp/shots/home.png
```

Then open the PNG and read it. If you need to scroll or open a sheet before the
shot, use a short Maestro flow that starts with `launchApp` and `stopApp: false`
(this brings the app forward without restarting it, so the seeded screen
survives) and ends with `takeScreenshot`.

Maestro's `openLink` also works. The same "Open in <app>?" dialog can appear, so
tap it with an optional step:

```yaml
- openLink: <your-scheme>://test-seed?screen=home
- tapOn:
    text: "Open"
    optional: true
```

To turn captures into regression checks, Maestro has `assertScreenshot`, which
compares against a saved image (`path`, optional `cropOn`, `thresholdPercentage`,
default 95). Use full screen images for inset and centring bugs, and `cropOn` for
one component. Seed fixed data so dates and numbers do not make every run differ,
and regenerate baselines on purpose in the same change as an intended UI change.

## 3. Smoke tier: one case per screen

The failures that reach users are mostly "the app opens and one screen is dead on
one platform". One shallow case per screen catches most of that.

- Every screen's root element carries `testID="screen-<id>"`. Put it on every top
  level branch (loading, empty, error, success), or an early return will fail the
  case while the screen is fine. Never put it on a list item.
- Assert on that testID, never on copy. Copy changes; an anchor only disappears
  when the screen stops rendering. Flows that asserted on old copy have sat dead
  for months with nothing saying so.
- One parameterised flow (`templates/smoke/_screen.yaml`) waits for the anchor.
  A manifest (`templates/smoke/manifest.mjs`) lists every case.
- The coverage check (`templates/check-e2e-coverage.mjs`) fails when a route file
  has no case, a case points at a deleted file, an anchor is missing from the
  source, or an exemption is stale. Exemptions need a reason. Run it from the
  project's check command, so a new screen cannot ship without a case.

A runner loops over the manifest. Per case, per platform:

1. Stop the app (`xcrun simctl terminate <udid> <bundle id>`, or
   `adb -s <serial> shell am force-stop <package>`).
2. Fire the seed link for the case.
3. Run the flow:
   `maestro --device <udid> test -e APP_ID=<id> -e SCREEN_ID=screen-<id> e2e/smoke/_screen.yaml`.
   `--device` goes before `test`.
4. Record pass, fail or skip. A skip carries a reason and is never counted as a
   pass.

Make the runner stop with "run incomplete" when the device itself goes away
(simulator shut down, emulator offline). Otherwise one dead device reports every
remaining screen as broken.

Expect roughly half a minute per case per platform. Run the whole tier before a
release, and single cases while working.

## 4. Release build smoke run

Some failures only exist in a release build: minification stripping something,
a native module guard taking its fallback branch, code that only runs when
development mode is off. A development build cannot find them.

Build a release configured app with the seam switched on:

```bash
EXPO_PUBLIC_E2E=1 npx expo run:ios --configuration Release
EXPO_PUBLIC_E2E=1 npx expo run:android --variant release
```

Expo inlines `process.env.EXPO_PUBLIC_*` at bundle time, and only when written
with dot notation (no destructuring, no brackets). A build made without the
variable folds the seam to `false`, the seed link falls through to the router, and
every case lands on "Unmatched Route". That is correct.

Run the smoke tier against it. Then build the store binary again WITHOUT the
flag. **Never upload a build made with the E2E flag.**

## 5. Browser preview (cloud sessions)

When there is no simulator, render the real components in a browser with
react-native-web and screenshot them at phone size.

- If the app runs on web: `npx expo install react-dom react-native-web @expo/metro-runtime`,
  then `npx expo start --web`.
- Otherwise build a small page that imports one component and stands in for
  stores and native modules with simple stubs.
- Screenshot with Playwright: set the viewport to 390 by 844, wait about two
  seconds for a settled frame (shorter to catch an animation), and save the page
  screenshot. Read every image before showing it.

Trust it for copy, colour, hierarchy and layout inside a card. Do not trust it for
safe areas, headers, scroll geometry, gestures, haptics, native modules or
animations driven natively. Say so whenever you show one.

## 6. End to end journeys

A seeded flow jumps straight to a screen, so it cannot prove how a person got
there. A journey starts where a real person starts (a cold launch, a deep link, a
share from another app) and asserts where it lands.

- Keep journeys few: onboarding, the core action, the paywall, any deep link
  people actually receive.
- Start the app, wait for it to settle, then act. A link fired at an app that is
  still cold starting is sometimes swallowed and the app opens on its home
  screen, which looks like a broken seed.
- Assert the destination screen's anchor, then assert the words that matter
  there. In a journey the words can be the behaviour under test.
- Mark system dialogs as `optional: true` so a flow works on first launch and
  after.

See `templates/journey.yaml`.
