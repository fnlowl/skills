# @fnlowl/skills

Agent skills for operating [fnlowl](https://fnlowl.com) (pronounced *Funnel Owl* —
**Funnel Intelligence, Agentified!**) — lead-capture widgets, the leads they
produce, and the mail that follows.

Four skills:

- **`fnlowl-capture`** — build and diagnose widgets, leads, and funnel analytics.
- **`fnlowl-follow-up-automation`** — draft and review delivery, integration handoff, campaigns, and sequences.
- **`fnlowl-installation`** — install embeds on generic sites, WordPress, Shopify, Webflow, and Framer.
- **`fnlowl-mcp`** — connect an agent to the remote MCP surface safely.

Read them in [skills/](skills/).

## Install

```bash
npx skills add fnlowl/skills --list
npx skills add fnlowl/skills --global --agent claude-code
npx skills add fnlowl/skills --global --agent claude-code --skill fnlowl-capture
npx skills add fnlowl/skills --global --agent claude-code --skill fnlowl-follow-up-automation
npx skills add fnlowl/skills --global --agent claude-code --skill fnlowl-installation
npx skills add fnlowl/skills --global --agent claude-code --skill fnlowl-mcp
```

Name your agent with `--agent` (for example `claude-code`, `codex` or `cursor`). Without it, a
non-interactive run (`--yes`) installs into every agent the installer supports.

### Pin a release

Releases are tagged on GitHub. For a stable install, pin a tag instead of the default branch:

```bash
npx skills add fnlowl/skills#v0.1.0 --global --agent claude-code
```

The skills are versioned together as one bundle. A release that renames or removes a skill says so in its notes.

## Install as a Claude Code plugin

The repo is also a plugin marketplace, so Claude Code can install it directly:

```text
/plugin marketplace add fnlowl/skills
/plugin install fnlowl@fnlowl-plugins
```

## How to invoke skills

| Platform | Typical invocation |
| --- | --- |
| **Claude Code** | `/fnlowl-capture`, `/fnlowl-follow-up-automation`, `/fnlowl-installation`, `/fnlowl-mcp` |
| **Cursor** | the same names after typing `/` in Agent chat |
| **Codex** | describe the task, or `$fnlowl-capture` and the other skill names |

## Verify install

Try a task that should trigger one of the skills:

- "Create a quiz widget for my pricing page."
- "Why is this widget not converting?"
- "Draft a three-email nurture sequence for people who finish the quiz."
- "Add the fnlowl widget to my WordPress site."
- "Connect Claude to fnlowl and list the tools it can use."

## What's included

- four skills that load when relevant
- reference files and recipes for the capture and follow-up skills
- `.mcp.json`, which points an agent at the hosted MCP server (OAuth sign-in on first use)

It does not ship slash commands or an MCP server of its own; the server runs at `https://api.fnlowl.com/v1/mcp`.

## Use it

The MCP server is at `https://api.fnlowl.com/v1/mcp` (streamable HTTP, OAuth). `.mcp.json` in
this package points there. Your client opens fnlowl's consent screen the first time: sign in and
approve the scopes and website. Tokens are `fnla_`, revocable under **Settings → API →
Connected apps**; a connector limited to one website is already project-bound, so `x-fnlowl-project` is
ignored.

Claude.ai and ChatGPT work the same way: add the URL as a custom connector (OAuth, leave client id
and secret blank).

For scripts and the CLI you can use an API key from **Settings → API** instead. It starts `fnlk_`,
is shown once, and is sent as `Authorization: Bearer fnlk_...`.

Scope calls to one project with the `x-fnlowl-project` header. `list_projects`
returns the ids.

## What it will not do

The remote MCP surface has no campaign or transactional send tool and cannot
unsubscribe anyone. Publishing widgets and activating sequences are separate
confirmation-required actions; the server cannot verify that conversational
confirmation. High-risk Composio connection/action tools are withheld when that
optional integration is configured. See
[references/approval-model.md](skills/fnlowl-capture/references/approval-model.md).

## Develop

```bash
node scripts/check-skills.mjs
```

Markdown and JSON, no dependencies — Node 18 or later. The one rule is
**describe only what is built**, and a limitation goes in
[references/known-gaps.md](skills/fnlowl-capture/references/known-gaps.md)
rather than being left out.

The package also includes Codex, Claude, Cursor, and agent-marketplace plugin
manifests.

## License

MIT — see [LICENSE](LICENSE).

## Repository layout

```text
LICENSE
.agents/plugins/marketplace.json
.claude-plugin/marketplace.json
.claude-plugin/plugin.json
.codex-plugin/plugin.json
.cursor-plugin/plugin.json
.github/workflows/validate.yml
assets/logo.svg
skills/
install.sh
```
