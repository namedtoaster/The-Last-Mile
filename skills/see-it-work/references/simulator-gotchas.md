# Simulator gotchas

Each of these has faked a result on a real app: a red run for a working screen,
or a green one for a broken screen. Check them before trusting a result.
All are **from experience** (2026), not from official docs.

### A red smoke run is usually a slow cold start
- **Symptom:** many screens fail together, but each one looks fine when you open it.
- **Cause:** a development build fetches its whole JavaScript bundle from Metro on a
  cold start. On a busy laptop that took over 30 seconds, so a 25 second wait
  checked a splash screen.
- **Check:** seed one failing screen by hand and take a screenshot. If it renders,
  the screen is fine.
- **Fix:** raise the anchor wait to 90 seconds. A healthy screen loses nothing,
  because the wait ends as soon as the anchor appears. A release build made with
  the E2E flag has no Metro and avoids this entirely.

### Metro may be serving a different checkout
- **Symptom:** the screenshot shows old copy while the file on disk is clearly new.
  Restarting the app does not help.
- **Cause:** a Metro started from another worktree or folder keeps serving that
  code on the same port.
- **Check:** `lsof -ti:8081 | xargs -n1 ps -o command= -p` and confirm the path,
  or read the "Starting project at" line in Metro's log.

### Captures do not reload JavaScript
- **Symptom:** a fix does not show up in the next screenshot.
- **Fix:** terminate the app (`xcrun simctl terminate <udid> <bundle id>`) before
  capturing again, so the cold start picks up the new bundle.

### An older OS on the simulator can pass a layout the user's OS breaks
- **Symptom:** the screenshot is clean, the user's phone is not.
- **Cause:** modal headers, safe areas and system chrome change between major iOS
  versions.
- **Fix:** for anything near headers, modals or insets, use a simulator on the same
  major OS version as the reporter. Keep one older simulator for Maestro if the
  newest is not supported yet, and check Maestro's release notes for support.

### Maestro cannot see inside a card that groups its children
- **Symptom:** `assertVisible` fails on text that is plainly visible in Maestro's
  own failure screenshot.
- **Cause:** on iOS a touchable wrapping a title, details and a nested button
  becomes one accessibility element. The inner text and inner testIDs disappear.
- **Fix:** put the `testID` on the outer touchable, or give the inner button
  `accessible={true}`.

### Synthetic swipes may not move a horizontal list
- **Symptom:** a swipe step "passes" but the carousel does not move on the
  simulator.
- **Fix:** tap a control instead (an arrow, a page dot, an item), or check that
  path on a device.

### Always pass the device
- **Symptom:** a flow runs on your own phone instead of the simulator.
- **Cause:** Maestro picks a connected device when you do not name one.
- **Fix:** always `maestro --device <udid> test ...`.

### Undo the fix and confirm the test fails
- **Symptom:** a navigation bug is "fixed", the test passes, the bug is still there.
- **Cause:** the test passed with or without the fix (it asserted a call, not a
  destination).
- **Fix:** after every fix, undo it, watch the test fail, restore it.

### A VPN on the Mac can cut a real phone off from Metro
- **Symptom:** the app on a real phone sits on the splash screen and gets killed
  for launching too slowly. It looks like a slow app.
- **Check:** `route -n get default | grep interface` should show the network card
  (often `en0`), not a tunnel (`utun*`). Then open `http://<mac lan ip>:8081/status`
  in the phone's browser. If that hangs, no bundler fix will help. Turn the VPN off
  or allow the local network.

### Cameras and some system screens do not exist on a simulator
- Screens that need a camera may never be reached and bounce back home. Mark
  those smoke cases as skipped with that reason, and check them on a device.
