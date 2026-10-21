# Using The Last Mile in your repos

There are two ways to get the skills into a project. Pick one per project, never
both, or every skill shows up twice. If the plugin is installed for your user and
a project has the copy, turn the plugin off for that project only:
`claude plugin disable the-last-mile@the-last-mile -s local`.

| | Plugin | Project copy (sync) |
| --- | --- | --- |
| Works in | Claude Code on your computer | Everywhere: computer, Claude Code on the web, the Claude app on your phone |
| Lives in | Your Claude Code install | The project's `.claude/skills/`, committed |
| Stays current by | `claude plugin update the-last-mile@the-last-mile` | `/sync`, or a daily pull request |
| Best for | Trying it out, desktop only work | Anyone who works from a phone or the web |

Cloud sessions do not load plugins (as of October 2026). They do read skills
committed to the project. That is why the project copy exists.

## Plugin

```
/plugin marketplace add namedtoaster/the-last-mile
/plugin install the-last-mile@the-last-mile
```

To update later: `claude plugin marketplace update the-last-mile`, then
`claude plugin update the-last-mile@the-last-mile`, then restart Claude Code.

## Project copy

### The easy way

Open a Claude Code session in your project (phone, web or desktop) and paste:

> Set up The Last Mile sync in this repo, following
> https://github.com/namedtoaster/the-last-mile/blob/main/sync/README.md.
> Do the "By hand" steps yourself, then commit and push.

### By hand

1. Fetch the sync script into your project:

   ```
   mkdir -p .claude/last-mile
   curl -fsSL https://raw.githubusercontent.com/namedtoaster/the-last-mile/main/sync/sync.mjs -o .claude/last-mile/sync.mjs
   ```

2. Create `.claude/last-mile/config.json`:

   ```json
   {
     "source": "namedtoaster/the-last-mile",
     "ref": "main",
     "keepLocal": []
   }
   ```

   - `source`: the repo to copy from. Use your fork if you have one (see below).
   - `ref`: the branch or tag to copy from. `main` gets every change as it lands.
   - `keepLocal`: skills your project keeps its own version of (for example a
     `session-end` with steps only your app needs). The sync never touches them.

3. Run `node .claude/last-mile/sync.mjs` and commit `.claude/`.

   If your agent refuses to run a script it just downloaded (Claude Code's auto
   mode did, as of October 2026), use a local clone of the source instead: check
   it is on `main` and level with GitHub (`git fetch`, then `git status` says
   "up to date with origin/main"), copy `sync/sync.mjs` from it, and run
   `node .claude/last-mile/sync.mjs <path to the clone>`. The result is the same.
4. Optional, to stay current without asking: copy
   [`sync-last-mile.yml`](sync-last-mile.yml) to `.github/workflows/`, and turn on
   Settings > Actions > General > "Allow GitHub Actions to create and approve pull
   requests". It opens a pull request each morning the skills changed. You can also
   run it from the Actions tab, including in the GitHub mobile app.
5. If your linter lints everything (`eslint .`), ignore `.claude/`. The see-it-work
   templates are TypeScript meant to be copied into your app, not run where they sit.

The script only writes inside `.claude/`. It never commits or pushes. It will not
overwrite a skill it did not put there; it warns instead.

### Staying current

Type `/sync` in any session of the project. It runs the script, commits only the
skill files and pushes. New or changed skills load in the next session.

## Improving a skill

When a skill gets something wrong, say so in that session and use
`/improve-skill`. It decides whether the lesson belongs in your project's rules file
(most do) or in the skill itself, and for a skill fix it edits the source repo, never
the copy in your project. The next sync would overwrite an edit to the copy.

What happens next depends on whether you can push to the source.

### Contributing back (no fork)

You cannot push to `namedtoaster/the-last-mile`, so improve-skill opens a pull
request from a fork of it, or suggests an issue instead. The fix
reaches your project once the pull request is merged and you sync. Until then,
follow the fixed step by hand.

### Your own fork as the source

If you want your fixes now, not after review:

1. Fork the repo on GitHub.
2. Set `"source"` in `.claude/last-mile/config.json` to `<you>/the-last-mile`.
3. improve-skill now pushes fixes to your fork, and `/sync` picks them up straight
   away. Open a pull request to `namedtoaster/the-last-mile` too if the fix would
   help others.
4. To get upstream changes, press "Sync fork" on your fork's GitHub page, then
   `/sync` in your project. If you changed a skill that upstream also changed,
   GitHub asks you to resolve the conflict first.

One fork can be the source for all your projects. Project specific changes still
belong in each project's rules file or a `keepLocal` skill, not in the fork.
