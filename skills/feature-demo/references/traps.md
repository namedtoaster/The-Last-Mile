# Traps when building a feature demo

Each of these cost real time in a session. Symptom first, because that is how you
will meet them.

### A screenshot of a sheet comes back blank, but the text is in the page

- **Symptom:** The capture is empty or shows only the backdrop. Dumping the DOM
  finds the copy perfectly well.
- **Cause:** React Native Web's `Modal`, and most modal libraries, render into a
  portal outside the element being captured.
- **Fix:** Give the component a preview-only prop and take the plain overlay branch
  when it is set. Most apps already have that branch, because a native Android
  Dialog can freeze some devices, so the same code path serves both.
- **Status:** From experience

### Every variant screenshot is exactly the same file size

- **Symptom:** Three captures, three identical byte counts.
- **Cause:** They are all the same blank page. Usually the portal trap above, or a
  bundle that failed and left the root empty.
- **Fix:** Check before you read the images: identical sizes means identical
  content. Dump the DOM and grep for a string you expect.
- **Status:** From experience

### Headless Chrome shows every animation at frame zero

- **Symptom:** Animated content is always in its starting position, whatever delay
  you pass.
- **Cause:** `--virtual-time-budget` does not advance React Native's Animated.
- **Fix:** For static content, headless Chrome is fine and needs no install. For a
  mid-animation frame, drive a real browser with real waits (Playwright). Check it
  is actually installed before depending on it; a harness written in a cloud session
  may point at a global path that does not exist locally.
- **Status:** From experience

### The bottom of the capture is cut off

- **Symptom:** The last button is missing from the screenshot but present on screen.
- **Cause:** The capture window is the phone's height, and the page is taller.
- **Fix:** Shoot at a taller window than the phone and crop, or set an explicit tall
  window size.
- **Status:** From experience

### Two buttons on one screen with identical copy

- **Symptom:** A test fails with "found multiple elements with text X", or a driver
  taps the wrong one.
- **Cause:** New copy duplicated an existing string elsewhere on the same screen.
- **Fix:** Name what is being declined rather than using a generic "Not now". It is
  better copy anyway, and it is why the collision is worth fixing rather than
  working around in the selector.
- **Status:** From experience

### A test id that is a prefix of another test id

- **Symptom:** An end to end driver reports a visible button as not visible.
- **Cause:** Drivers match ids by substring. A footer button `thing-today` also
  matches a 4pt dot called `thing-today-2026-10-16`, and the driver resolves to the
  dot.
- **Fix:** Never let one id be a prefix of another. Rename the shorter one.
- **Status:** From experience

### The demo shows a state the code cannot produce

- **Symptom:** Somebody builds to the demo and the state never appears.
- **Cause:** Hand written HTML drifts from the component, or the state was invented
  to make the flow read nicely.
- **Fix:** Build the state list from the code's own state union, not from the story
  you want to tell. If a state is aspirational, label it in the demo as not built.
- **Status:** From experience

### The person reviews the design instead of the feature

- **Symptom:** All the feedback is about spacing and colour.
- **Cause:** The demo used generic styling, so the styling is the most obviously
  wrong thing on screen.
- **Fix:** Use the app's real tokens and fonts from the start. Feedback moves to the
  feature once the look stops being distracting.
- **Status:** From experience
