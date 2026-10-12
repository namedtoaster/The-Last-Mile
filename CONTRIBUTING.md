# Contributing

Thanks for helping. The Last Mile is maintained by one person, so the bar is
simple: every change should make shipping a real app easier, and every fact
should be checkable.

## What gets accepted

| Change | How |
| --- | --- |
| Fixes and clarifications to an existing skill | Pull request |
| A new trap: something that caught your app in review or a release | Pull request, or the "This caught me" issue template |
| Updating a fact or a trap whose rule changed | Pull request, with the new source |
| A new skill | Start a post in Discussions first. Skills are curated so the set stays coherent |

All changes reach `main` through a pull request reviewed by the maintainer.

## Adding a trap

Add it to `skills/ship/references/traps.md` under the right heading, in this shape:

```
### <What the trap is, in plain words>
- **What happened:** <what it did to a real app, with the month and year>
- **Rule:** <the current rule, worded so it survives small changes>
- **How to check:** <what someone can do today to see if it affects them>
- **Source:** [<official page title>](<official URL>)
- **Status:** Checked <YYYY-MM-DD> | From experience | Needs a human | Not yet checked
```

- Prefer official sources: Apple, Google, and the docs of the framework involved. A blog post can be a lead, not a source.
- If a trap only affects one stack, add it under that stack's **Stack specific** section, or start one.
- If you could only read a page through a search result, mark it **Not yet checked**.
- A page read from the saved copy in `sources/` (made weekly by `scripts/snapshot-sources.mjs`) counts as opened on the copy's `fetched` date.
- Word rules flexibly: "Apple has rejected apps for X", "as of 2026, Google requires X".
- If you could not check the official page, mark it **From experience**. That is fine and honest.

## Writing a skill

- One folder under `skills/` with a `SKILL.md`, following the [Agent Skills format](https://agentskills.io).
- Frontmatter needs `name` and a `description` that starts with what the skill does, then when to use it.
- Keep `SKILL.md` under 500 lines. Put long reference material in a `references/` folder the skill points to.
- Write for someone who will act on it: concrete steps, a clear finish.

## Style

- Plain words. Name what a person experiences, not internal code names.
- No long dashes (em or en dashes) in prose. Use a period, a comma or parentheses.
- Date anything that can go stale.

## Scripts

Skills may include scripts that run on a user's machine. Keep them few and small,
explain what they do at the top, and expect every line to be read in review.

## Checks

Pull requests run `node scripts/validate.mjs`, which checks skill frontmatter, trap
entries and style. Run it locally before opening a pull request.

If you change the ship skill or its references, run the evals before and after
(`node evals/run.mjs`) and put both scores in the pull request. See
[evals/README.md](evals/README.md).
