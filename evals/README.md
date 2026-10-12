# Evals

Small fake apps with planted problems, and a script that runs the ship skill on them
and scores what it finds. Run it before and after changing a skill to see whether
the change helped, the same way reference data shows whether a feature got better.

## What's here

| Fixture | Stack | Planted problems |
| --- | --- | --- |
| `expo-meal-tracker` | Expo | Google Play named on the iOS paywall, buying needs sign in, Google login with no private option, no account deletion, a library that adds photo permissions, calorie figures with no source, lorem ipsum |
| `flutter-habit-tracker` | Flutter | Google Play named in shared text, Google login with no private option, no account deletion, photo permissions, an old target SDK, release signed with the debug key, a TODO on screen |
| `capacitor-web-wrapper` | Capacitor | a website in a wrapper with nothing native, no privacy policy |
| `expo-plant-log` | Expo | none. A control: anything reported as a blocker here is a false alarm |

Each fixture's answer key is in `answers/`, outside the app, so a run never sees it.
An answer key lists what should be found (`expected`) and things that are fair to
mention either way (`allowed`), so they count neither for nor against.

## Running it

```
node evals/run.mjs                        # every fixture
node evals/run.mjs flutter-habit-tracker  # one fixture
node evals/run.mjs --model <id>           # a specific model
node evals/run.mjs --fact-check           # let runs open official pages (slower, costs more)
node evals/run.mjs --rescore <run folder> # score saved findings again, free
```

It needs the Claude Code CLI signed in, and each fixture costs API credit (capped by
`--budget`, default US$3). Each fixture runs in a temporary copy with git, so nothing
here changes.

The output, per fixture: whether the stack was detected, problems found out of
those planted, false alarms (blockers not in the answer key), cost and time. Every
run is saved under `results/<date>/` with its findings and full transcript, and adds
a line per fixture to `results/history.jsonl` with the commit, so scores can be
compared over time.

Runs vary. Before trusting a change, run each fixture more than once.

## Adding a fixture

1. Make the smallest app that looks real for its stack, under `fixtures/<name>/`.
   Write code the way a person or an AI would, with no comments pointing at the
   problems.
2. Plant problems taken from `skills/ship/references/traps.md`, so every expected
   finding has a source.
3. Write `answers/<name>.json`: the stack, then each expected finding with an `id`,
   the `file` it lives in (when there is one), and `match`, a list of patterns any
   of which the finding's title or rule must contain. Add `allowed` entries for
   reasonable findings that aren't planted.
4. Run it a few times. If a correct finding is scored as a miss, widen `match`;
   if a fair finding is scored as a false alarm, add it to `allowed`.

## Next

- Fixtures for React Native, native iOS, native Android and .NET MAUI.
- A second tier of real open source apps already in the stores, pinned to a commit,
  as a check for false alarms on real code.
- Scoring the listing and privacy answers, not only the sweep.
