---
name: fnlowl-capture
description: Build, edit, and diagnose FnlOwl lead-capture widgets through MCP. Use for lead magnets, quizzes, surveys, popups, announcement bars, calculators, captured leads, and funnel analytics. Do not use for email campaigns, sequences, or installation guidance.
metadata:
  api: 4bff472
  openapi_paths: 90
  mcp_tools: 40
  mcp_tools_gated: 4
  mcp_surface: "Counts include configured Composio tools; without them, 39 published and 2 gated."
---

# fnlowl — capture

fnlowl puts a lead-capture widget on someone's site — a lead magnet, a quiz, a
survey, a popup, an announcement bar, a calculator — collects the addresses it earns,
and follows up by email. This skill is for the widget and funnel side of the
MCP server at `/v1/mcp`.

## Ground rules

1. **The live server is the source of truth, not this file.** Call `tools/list`
   before planning any non-trivial job. The frontmatter above pins what this
   skill was written against; if the live list disagrees, the live list wins and
   this file is stale. Say so rather than working from the stale one.
2. **The remote surface excludes direct send and unsubscribe actions.** `send_transactional` and
   `unsubscribe_lead` are omitted from `tools/list`. If Composio is configured,
   `start_composio_connection` and `execute_composio_action` are omitted too.
   There is no MCP tool for sending a campaign. Publishing a widget or
   activating a sequence is available only through a separate action after
   explicit user confirmation; this is a conversational guard, not server-verified approval.
   [references/approval-model.md](references/approval-model.md).
3. **Know which project you are in before you read anything.** A widget lives in
   one project, and with no project named every tool reads across the whole
   account. A correct answer about the wrong project is the easiest wrong answer
   to give confidently. [recipes/00-preflight.md](recipes/00-preflight.md).
4. **Read the widget before changing it.** `update_widget` replaces the content
   it is given. A quiz edited without its tiers, or a survey without its
   questions, comes back as a widget that renders nothing — and the visitor sees
   that, not you.

## Recipes

One file per job. Read the one you need; do not read them all.

- [00-preflight.md](recipes/00-preflight.md) — always first
- [author-a-widget.md](recipes/author-a-widget.md) — the six kinds, and what each one needs to be valid
- [diagnose-a-funnel.md](recipes/diagnose-a-funnel.md) — views → completions → leads, and where it leaks

## References

- [tool-reference.md](references/tool-reference.md) — the tools by job, and which approval-gated tools you will not see
- [approval-model.md](references/approval-model.md) — why sending is not yours
- [known-gaps.md](references/known-gaps.md) — things that exist but do not work yet, so you do not offer them

For campaigns, sequences, and post-capture delivery, use
[`fnlowl-follow-up-automation`](../fnlowl-follow-up-automation/SKILL.md).

## Connecting

`https://api.fnlowl.com/v1/mcp`, streamable HTTP, `Authorization: Bearer
fnlk_...`. Create a key in **Settings → API**; it is shown once.

Scope every call to one project with the `x-fnlowl-project` header —
`list_projects` returns the ids it takes. Without it, tools read across the
whole account.

The same key authenticates the REST API — `GET /widgets`, `GET /leads`, and 69
other paths — which is wider than the tool surface and is where anything the
tools do not cover lives. A CLI exists but is not installable; see
[references/known-gaps.md](references/known-gaps.md) before offering it.
