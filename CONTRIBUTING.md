# Contributing

Thanks for helping. The Last Mile is maintained by one person, so the bar is
simple: every change should make shipping a real app easier, and every fact
should be checkable.

## What gets accepted

| Change | How |
| --- | --- |
| Fixes and clarifications to an existing skill | Pull request |
| A new trap: something that caught your app in review or a release | Pull request, or the [This caught me](https://github.com/namedtoaster/the-last-mile/issues/new?template=this-caught-me.yml) form |
| Updating a fact or a trap whose rule changed | Pull request, with the new source |
| A new skill | Start a post in Discussions first. Skills are curated so the set stays coherent |
| A skill or tool that already exists somewhere else | Pull request that POINTS at it. See Outside skills and tools |

All changes reach `main` through a pull request. The maintainer's own pull requests merge by themselves once the checks pass; everyone else's are reviewed by the maintainer.

**You'll hear back within 48 hours** on any issue or pull request: a merge, a question, or a plain no with the reason. If a trap report is too thin to become an entry yet, it stays open with the `trap` label until someone can source it.

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
- A page read from the saved copy in `sources/` on the `snapshots` branch (made weekly by `scripts/snapshot-sources.mjs`) counts as opened on the copy's `fetched` date.
- Word rules flexibly: "Apple has rejected apps for X", "as of 2026, Google requires X".
- If you could not check the official page, mark it **From experience**. That is fine and honest.

## Writing a skill

- One folder under `skills/` with a `SKILL.md`, following the [Agent Skills format](https://agentskills.io).
- Frontmatter needs `name` and a `description` that starts with what the skill does, then when to use it.
- Keep `SKILL.md` under 500 lines. Put long reference material in a `references/` folder the skill points to.
- Write for someone who will act on it: concrete steps, a clear finish.

## Outside skills and tools

Plenty of what a skill would cover is already published by somebody else. Using
their work is good. Absorbing it is not.

**Point at it, never copy it in.** A copied skill is a fork from the day it
lands: their fixes stop reaching you, the authorship gets muddy, and the licence
travels badly. Add a link and one line saying what it is for, in the skill that
would otherwise have done that job.

**Check it exists before you recommend it.** An agent will describe a plausible
package or a plausible install command that was never real, and the person
reading it loses an afternoon. Open the repository. Run the command. If you
could not, say so in the same breath.

Then, before it earns a link:

- **A maintainer and a pulse.** Who owns it, and when did they last touch it. A
  single author who stopped a year ago is a dead end wearing a tidy README.
- **What it runs.** A skill is prose and is low risk. A script, an installer or
  anything that reaches the network runs on the reader's machine, and the bar
  for linking it is that you have read the lines it will run.
- **Does its advice survive a check.** Pull one claim it makes and take it to
  the primary source. One of these recommended a file the search engine it
  names says it ignores. A skill that is confidently wrong about one thing has
  no special claim on the rest.
- **Does it carry a method.** A skill that restates a vendor's documentation
  earns nothing a link to the documentation would not. Take the ones that carry
  a way of working you would otherwise have had to write.

**Date the recommendation.** Write the month and year you checked it, the same
as a trap. A repository that was the right answer in October can be abandoned
by March, and an undated link keeps being followed long after.

**Their claim never becomes our fact.** Anything from an outside skill that
ends up in `facts.md` or `traps.md` needs its own primary source and its own
date, exactly as if nobody had written it down before.

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
