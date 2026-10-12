# Using the skills in cloud sessions

Cloud sessions (Claude Code on the web, and the Claude app on your phone) do not
load plugins, as of October 2026. They do read skills committed to the project in
`.claude/skills/`. These files keep a copy of The Last Mile skills there, so the
same skills work on your phone and your desktop, while this repo stays the only
place they are edited.

## Set it up in a project

1. Copy `sync.mjs` to `.claude/last-mile/sync.mjs` in your project.
2. Create `.claude/last-mile/config.json`:

   ```json
   {
     "source": "namedtoaster/the-last-mile",
     "ref": "main",
     "keepLocal": []
   }
   ```

   `source` can be your fork. List in `keepLocal` any skill your project keeps its
   own version of (for example a `session-end` with steps only your app needs). The
   sync never touches those.
3. Run `node .claude/last-mile/sync.mjs` and commit `.claude/`.
4. Optional, to stay current without asking: copy `sync-last-mile.yml` to
   `.github/workflows/`, and turn on Settings > Actions > General > "Allow GitHub
   Actions to create and approve pull requests". It opens a pull request each
   morning the skills changed, and you can run it from the Actions tab.
5. If your linter lints everything (`eslint .`), ignore `.claude/`. The see-it-work
   templates are TypeScript meant to be copied into your app, not run where they sit.

Do not also install the plugin in that project, or every skill shows up twice.

## Improving a skill

Edit it here, never in the copy. From inside the project where it went wrong, the
improve-skill skill does this: it writes up what happened, changes the skill in this
repo and opens a pull request. Once it is merged, sync.
