---
name: fnlowl-mcp
description: Connect an AI agent to FnlOwl's remote MCP server or inspect its available tool surface. Use for FnlOwl API keys, MCP endpoint configuration, project scoping, tool availability, or MCP troubleshooting. Do not use for widget authoring or marketing strategy itself.
metadata:
  api: 4bff472
  openapi_paths: 90
  mcp_tools: 40
  mcp_tools_gated: 4
  mcp_surface: "Counts include configured Composio tools; without them, 39 published and 2 gated."
---

# FnlOwl — MCP connection

The remote MCP endpoint is `https://api.fnlowl.com/v1/mcp`. Authenticate with
`Authorization: Bearer fnlk_...`; create the key in **Settings → API**.

Claude.ai and ChatGPT can connect without a key: add the URL as a custom
connector (OAuth, no client id or secret), sign in, and approve the consent
screen. The grant carries `read`, `write` and `publish` scopes and may be
limited to one website; a project-bound grant ignores `x-fnlowl-project`, and
brand writes then set that website's override. `update_ai_context` is refused
for such a grant. In ChatGPT, set the app permission to "Allow read-only tools"
or write tools stay hidden.

## Connection rules

1. Call `tools/list` first. The live response is authoritative.
2. Call `list_projects`, choose a project, then send `x-fnlowl-project` on
   every later request. Without it, tools operate across the account.
3. The public remote surface has 39 tools without Composio, or 40 when its
   integration service is configured. `tools/list` is the source of truth for
   the current deployment.
4. `send_transactional` and `unsubscribe_lead` are omitted from remote
   `tools/list`; when Composio is configured, its connection-start and action
   execution tools are also withheld. There is no remote campaign-send tool.
   `activate_sequence` is available only after explicit user confirmation in
   the conversation; MCP does not independently verify it. `request_widget_publish` is
   listed only for a key with the `publish` scope, and even then it creates a
   pending approval that a signed-in person must accept in the dashboard.
   Keys carry `read`, `write` and `publish` scopes; a new key is read-only, and
   a tool above the key's scope is not listed and is refused if called.
5. The FnlOwl CLI exists in the source repository but is not publicly
   installable. Do not offer `npm install` or `npx` commands for it.

Read [tool-reference.md](../fnlowl-capture/references/tool-reference.md) for
the tool groups and [known-gaps.md](../fnlowl-capture/references/known-gaps.md)
for deployment limitations.
