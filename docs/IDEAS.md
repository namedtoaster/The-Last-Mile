# Ideas

Not planned yet. Each one says why it matters and what would have to be true first.

## A leaderboard for shipping well

Every ship journal now keeps stats: sessions, days, hands on time, tokens, rejections,
and the level and platforms chosen. Pooled across apps (opt in, numbers only, no app
details), they could rank how well The Last Mile ships, and show which change to the
skills made shipping cheaper.

The score must reward the process, not a race. Speed alone rewards shipping an app that
does nothing. So:

- Only apps that are live, still live 30 days later, and shipped at Standard or above
  count.
- Score cost per ship: fewer sessions, fewer tokens, less hands on time, zero
  rejections.
- Compare skill versions, not people: the question is whether this month's Last Mile
  ships cheaper than last month's.

First: a few journals with real stats, and a format simple enough to submit by pull
request.

## Ship from a phone, start to finish

Most of the work already runs in cloud sessions from a phone: code, sweeps, the
listing, the journal, console steps one at a time. The gaps are builds and uploads.

- Android: EAS Build and EAS Submit run in the cloud and can be started from a GitHub
  workflow, so a phone session could trigger them. Needs the Play service account key
  stored as a repository secret.
- iOS: EAS Build in the cloud, or GitHub's macOS runners with Xcode, then upload to
  TestFlight with an App Store Connect API key. Watch the trap that cloud builders can
  lag the newest Xcode Apple requires.
- Testing a release build still needs a real device, which the phone already is
  (TestFlight, Play internal testing).

First: one app shipped this way end to end, then make it a ship option ("How builds
are made: cloud") with the setup steps.
