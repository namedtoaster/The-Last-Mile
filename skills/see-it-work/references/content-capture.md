# Content capture (experimental)

**Status: experimental.** This recipe records the real app doing its main action
on an Android emulator, for use in a marketing video. It worked, but it did not
clearly pay off for the time it took. Use it only if the user asks for app footage
and recording by hand on a phone is the bottleneck.

## The idea

1. An Android emulator runs a build of the app that is already onboarded.
2. A Maestro flow drives the core action (for example, pasting a link and waiting
   for the result) while the screen is recorded.
3. The recording is cropped (status and navigation bars removed) and the slow
   middle is cut, keeping a little before the key tap and a little after the
   result appears.
4. The clip is handed to whatever builds the video.

## Setup notes

- Make an emulator with a tall phone profile, so footage suits vertical video.
- Point the app at the development server as the emulator sees it: `10.0.2.2` is
  the emulator's name for the host machine, not `localhost`. Change it back for
  real device testing.
- Onboard once by hand and do not clear state in the flow, so footage starts
  clean.
- For footage identical to the store app, use a release build instead of a
  development build.
- If the action uses a free tier quota, put the emulator's app id on the server's
  test device allowlist (see `paid-tier-testing.md`), or the footage will show the
  paywall.

## Tuning

Three knobs, found once per video style and then left alone:

| Knob | What it does |
| --- | --- |
| Crop | Removes system bars. Find it once from a raw recording |
| Lead | Seconds kept before the key tap |
| Tail | Seconds kept after the result appears |

Record, render, watch where the reveal lands, adjust, repeat. Expect two or three
passes the first time.

## Limits

- Needs a machine that can run an Android emulator with hardware acceleration.
- Real network calls make timing vary from run to run.
- The footage is of an emulator, not a phone in a hand. It may not be what a
  video actually needs.
