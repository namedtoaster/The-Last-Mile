# Official MCP servers

Each server here is published by the vendor itself and was checked on the vendor's
own docs page on the date shown. Before adding one, open its docs link and confirm
the address and sign in method have not changed. Addresses and sign in methods
change often; the fact-check skill can re-check this file.

**How to read the columns**

- **Detect:** project files or packages that mean the app uses this service.
- **Sign in:** OAuth means a browser sign in through `/mcp` after adding, with no
  key to store. Key means a token the user creates in the vendor's dashboard.
- **Changes things:** whether the server can act on real data, and how to limit it.

## The usual Expo app stack

| Service | Detect | Add (Claude Code) | Sign in | Changes things | Checked |
| --- | --- | --- | --- | --- | --- |
| [RevenueCat](https://www.revenuecat.com/docs/tools/mcp/setup) | `react-native-purchases` | `claude mcp add -s user --transport http revenuecat https://mcp.revenuecat.ai/mcp` | OAuth, or an API v2 secret key | Yes: products, offerings, paywalls, and store prices and metadata in App Store Connect and Google Play. Read only only with a read only key | 2026-10-17 |
| [PostHog](https://posthog.com/docs/model-context-protocol/claude-code) | `posthog-react-native`, `posthog-node`, `posthog-js` | `claude mcp add -s user --transport http posthog https://mcp.posthog.com/mcp` | OAuth (one address for US and EU) | Yes: feature flags, issues. No read only mode documented | 2026-10-17 |
| [Sentry](https://mcp.sentry.dev/) | `@sentry/react-native`, `@sentry/node` | `claude mcp add -s user --transport http sentry https://mcp.sentry.dev/mcp/<org>/<project>` | OAuth | Can update issues. No read only mode documented. Scope it to one project as shown (or `/mcp/<org>`) | 2026-10-17 |
| [Expo (EAS)](https://docs.expo.dev/eas/ai/mcp/) | `expo`, `eas.json` | `claude mcp add -s user --transport http expo https://mcp.expo.dev/mcp` | OAuth (Expo account) | Yes: runs and cancels builds, submits to the stores, replies to store reviews. No read only mode | 2026-10-17 |
| [Supabase](https://supabase.com/docs/guides/getting-started/mcp) | `@supabase/supabase-js`, a `supabase/` folder | `claude mcp add -s project --transport http supabase "https://mcp.supabase.com/mcp?project_ref=<ref>&read_only=true"` | OAuth, or a personal access token for CI | Yes: SQL, migrations, edge functions, projects. `read_only=true` makes queries read only; `project_ref` limits it to one project | 2026-10-17 |
| [Stripe](https://docs.stripe.com/mcp) | `stripe`, `@stripe/stripe-react-native` | `claude mcp add -s user --transport http stripe https://mcp.stripe.com/` | OAuth with per environment permissions, or an agent API key | Yes: refunds, subscriptions, invoices, coupons. Refunds and payouts need approval through a link. Limit through OAuth permissions. From 2026-11-30 plain secret keys stop working | 2026-10-17 |
| [Firebase](https://firebase.google.com/docs/ai-assistance/mcp-server) | `@react-native-firebase/*`, `firebase`, `firebase.json` | `claude mcp add -s user firebase npx -- -y firebase-tools@latest mcp` | The Firebase CLI's sign in (`firebase login`) | Yes: deploys, Firestore data, Auth users, Remote Config, push messages. `--only auth,firestore` limits which tools load | 2026-10-17 |

## Server and hosting

| Service | Detect | Add (Claude Code) | Sign in | Changes things | Checked |
| --- | --- | --- | --- | --- | --- |
| [Vercel](https://vercel.com/docs/mcp/vercel-mcp) | `vercel.json`, a `.vercel/` folder | `claude mcp add -s user --transport http vercel https://mcp.vercel.com` | OAuth | Yes: deploys, projects, purchases, as your full account. No read only mode | 2026-10-17 |
| [Railway](https://docs.railway.com/reference/mcp-server) | `railway.json`, `railway.toml` | `claude mcp add -s user --transport http railway https://mcp.railway.com` (the docs give `railway mcp install` instead; no Claude Code command given) | OAuth, or your `railway login` session | Yes: deploys, variables, services, volumes. Destructive tools are marked | 2026-10-17 |
| [Cloudflare](https://developers.cloudflare.com/agents/model-context-protocol/mcp-servers-for-cloudflare/) | `wrangler.toml`, `wrangler` | `claude mcp add -s user --transport http cloudflare https://mcp.cloudflare.com/mcp` (no Claude Code command given) | OAuth with chosen permissions, or an API token | Yes. Limit through the permissions you grant | 2026-10-17 |
| [Neon](https://neon.com/docs/ai/neon-mcp-server) | `@neondatabase/serverless` | `claude mcp add -s user --transport http neon "https://mcp.neon.tech/mcp?readonly=true"` (no Claude Code command given) | OAuth, or an API key | Yes: SQL, migrations, projects, branches. `readonly=true` blocks those | 2026-10-17 |
| [Resend](https://resend.com/docs/mcp-server) | `resend` | `claude mcp add -s user --transport http resend https://mcp.resend.com/mcp` | OAuth, or an API key | Yes: sends email, deletes contacts, domains and keys. No read only mode | 2026-10-17 |

## Design, planning and docs

These leave no trace in the code. Ask whether the user uses them.

| Service | Add (Claude Code) | Sign in | Changes things | Checked |
| --- | --- | --- | --- | --- |
| [Mobbin](https://docs.mobbin.com/mcp/clients/claude-code) | `claude mcp add -s user --transport http mobbin https://api.mobbin.com/mcp` | OAuth (Mobbin account; plan needed is in the ship skill's `references/facts.md`) | No, search only. Used by reference-hunt | 2026-10-17 |
| [Figma](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/) | `claude mcp add -s user --transport http figma https://mcp.figma.com/mcp` | Browser sign in | Yes: writes to design, FigJam and Slides files | 2026-10-17 |
| [GitHub](https://github.com/github/github-mcp-server) | Remote address `https://api.githubcopilot.com/mcp/` (the Claude Code command is in GitHub's linked install guide). Many people need no server: Claude Code can use the `gh` command | OAuth, or a personal access token | Yes: pull requests, issues, merges. The local server has `--read-only` and `--toolsets` | 2026-10-17 |
| [Linear](https://linear.app/docs/mcp) | `claude mcp add -s user --transport http linear https://mcp.linear.app/mcp` | OAuth, or an API key | Yes: issues, projects, comments. Read only at `https://mcp.linear.app/mcp/readonly` | 2026-10-17 |
| [Notion](https://developers.notion.com/docs/get-started-with-mcp) | `claude mcp add -s user --transport http notion https://mcp.notion.com/mcp` | OAuth | Yes: pages and databases | 2026-10-17 |
| [Context7](https://context7.com/docs/clients/claude-code) | `claude mcp add -s user --transport http context7 https://mcp.context7.com/mcp` | None needed; an optional key raises the limits | No, looks up current library docs | 2026-10-17 |

## No official server (2026-10-17)

- **App Store Connect (Apple):** none. Community servers wrap Apple's API; offer
  them only labelled community. Expo's server covers submitting builds and replying
  to reviews, and RevenueCat's covers subscription products and prices.
- **Google Play Console:** none. Same as above: community servers exist, and Expo
  and RevenueCat cover parts of it.

## Vendor plugins

RevenueCat, Expo, Figma, Stripe, Firebase, Resend, Cloudflare and Context7 also
publish a Claude Code plugin that bundles the server with their own skills. Their
docs recommend the plugin over a bare `claude mcp add`. Offer it as the
alternative; do not install both, or the server is connected twice.

## Notes

- Commands above use `-s user` for a person's own accounts. Change the scope as
  described in the skill (project for shared sign in servers, local for keys).
- A server listed as `claude.ai <Name>` in `claude mcp list` comes from the user's
  claude.ai connectors and is already connected.
- Where a command says "no Claude Code command given", the address is the vendor's
  and the command follows Claude Code's standard form; it has not been run.
