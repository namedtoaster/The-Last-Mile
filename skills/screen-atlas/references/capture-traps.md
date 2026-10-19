# Capturing every screen: the traps

All four of these were measured on a real app in October 2026, on an iOS 26.4
simulator driving a development build with Maestro. The shapes generalise to
any flow runner and any seed deep link; the exact numbers do not, so measure
rather than copying them.

Every one of them produces failures that look like broken screens and are not.
Between them they cost most of a session.

## The tell, before anything else: read the duration

This is the cheapest diagnostic and it comes free with every run.

| How the case failed | What it means |
| --- | --- |
| Fast, well under the anchor budget | The runner or the driver errored. Not the screen |
| At the full anchor budget | The screen's anchor genuinely never appeared |
| Passes by hand every time, never in the runner | The seed link is being lost. See trap 1 |

A case that takes the full timeout is not "slow", it never saw the anchor. Those
are different faults and only the second is ever about the screen.

## Trap 1: a seed link fired too early is lost, silently

Two separate versions of the same problem.

**At a terminated app.** Firing the deep link at an app that is not running can
be swallowed outright, with the command still reporting success. The flow runner
then launches the app itself, it opens on its DEFAULT screen, and every case
whose target is not that screen burns its whole anchor budget. The signature is
brutal: the default screen passes and everything else fails, so the run looks
like one healthy screen and thirty six broken ones.

**At an app that is still starting.** Launching first is not enough. A
development build fetches its whole bundle from the dev server on a cold start,
and a link arriving before the router is listening is simply dropped. Measured:
a screen failed twice with a 12 second wait after launch, 439 seconds of wall
clock spent proving nothing, and passed in 80 seconds with a 30 second wait,
while the identical runner command passed by hand every single time.

**The rule: stop, launch, wait until the app is actually drawing, then seed.**

**A readiness poll is the better signal and can still be the wrong answer.**
Polling the UI hierarchy genuinely tells you the app is up and the driver is
responding. It also costs another driver session per case, and that doubling
caused more dropped connections than it prevented. A fixed wait, tuned by
measurement and overridable by an environment variable, was the better trade.

**The real fix is not a bigger number.** A release configured build with the
test seam compiled in has no dev server dependency, so its cold start is a
fraction of this and the whole class disappears. It is also the build shape a
release gate should be judging. Recommend it.

## Trap 2: the seed may only be claimed once per process

A seed that writes data often guards itself so it runs once per app process.
That guard usually exists for a good reason: a hot reloading dev session can
re-run the launch URL on every file save and pile seeded data onto a real
device.

A capture run that does not restart the app between screens shares one process,
so every repeat is refused. Nothing errors. The app simply stays on the screen
it was already on, and the case fails against the wrong screen.

Observed as seven screens reported missing, every one of which rendered
perfectly when seeded by hand with the force flag the guard already provided.

**The rule: a capture run forces the seed.** Use the escape hatch the guard
already has. If there is not one, add it rather than removing the guard.

## Trap 3: an optional tap is not failure proof

Flow runners let you mark a step optional so it passes when the element is
absent. That handles a permission dialog that only appears sometimes.

It does NOT make the step free, and it does not swallow every failure. Each one
is a real round trip to the device driver, and when that driver drops the
connection the step fails with a socket error that "optional" does not catch,
taking the whole case down in a few seconds.

**The rule: a capture flow carries no optional taps it does not need.** If the
dialogs are first launch only on one platform, give that platform its own flow
rather than paying the round trips on both.

## Trap 4: driver cost varies wildly by screen, and the budget buys attempts

A wait for an element polls, and each poll is a full hierarchy dump. So the
timeout buys a number of ATTEMPTS, not a number of seconds.

Measured on one app: a hierarchy dump of the recipe list took 17 seconds warm
and 31 cold, against 4 seconds for the home screen. It was not tree size, and
this is the part worth remembering, because the home screen's hierarchy was the
BIGGER of the two. On the slow screen a 90 second budget is three or four
attempts, so one hiccup fails a screen that is rendering correctly.

**The rule: give a capture run a much larger anchor budget than a release
gate.** It costs a healthy screen nothing, because the wait returns the moment
the element appears. And make the runner's own subprocess timeout exceed the
flow's budget, or it kills cases that were about to pass.

## Two more worth knowing

**A package script can buffer output.** A long run through a package manager
script wrote nothing to its log for minutes and looked hung while it was fine.
Invoke the script directly when you want to watch it.

**Check what the screens cost before running them repeatedly.** One tab fired
image recovery against a metered third party API on mount. It was safe only
because an earlier fix skipped the bundled sample content. Ask what a screen
does on mount before driving all of them in a loop, especially against a dev
server pointed at production credentials.
