# Tool reference

41 core tools in the registry, **39 published over HTTP**. If Composio is
configured, it adds three tools: one published read and two withheld writes, for
44 total and 40 published. Grouped by the job they
belong to. Each tool's own `description` from `tools/list` is authoritative and
more detailed than this — the list below is for choosing which one to read.

`R` = read · `W` = write, reversible in the dashboard · `✗` = never published to
you ([approval-model.md](approval-model.md)).

## Scope — start here

| | tool | for |
|---|---|---|
| R | `list_projects` | the ids the `project` argument and the `x-fnlowl-project` header take. With neither, everything reads account-wide |
| W | `create_project` | adds a site or brand under the account and returns its id. Cannot delete one |
| R | `read_plan_usage` | the plan and what has been used of each monthly quota: leads, emails, AI messages, plus websites and widgets against their limits. Answers "what is my limit" and "how close am I" |
| R | `ask_question` | one plain-English question to fnlowl's own Advisor, which knows how the product works and reads the account to answer. Read-only, spends an AI credit, answers in about 120 words. Prefer a direct read tool when you know which one you need |
| R | `offer_choice` | hands a choice to the user when you are not confident: 2 to 4 options, then stop and wait for the answer. Does nothing on its own |

## Widgets — the thing on the page

| | tool | for |
|---|---|---|
| R | `list_widgets` | summaries only: id, name, kind, type, status, article, views, completions |
| R | `read_widget` | one widget in full — questions, quiz questions and options, tiers, calculator inputs |
| W | `create_widget` | six kinds; always created as a draft |
| W | `update_widget` | **sending any child array replaces all four.** Cannot change publication state; see [../recipes/author-a-widget.md](../recipes/author-a-widget.md) |
| W* | `request_widget_publish` | needs a `publish` scope (key or connector); returns `placement` (the embed placeholder or sitewide note) and `warnings`; repeat calls reuse the pending request; creates a pending approval with a before/after snapshot. It never publishes by itself — a signed-in person approves or rejects it on the Widgets screen, which shows a badge count of what's waiting |
| W | `start_experiment` | splits traffic between a control and 1-3 already-live variant widgets; on a small site test one variant at a time. holdoutPct (0-50, default 0) sees no widget and measures no lift |
| W | `stop_experiment` | ends a running split; a restart begins with fresh counts |

## Leads — the people it captured

| | tool | for |
|---|---|---|
| R | `list_leads` | newest first, **hard cap 200 per call**, optional `quality` filter (`good`, `warn`, `bad`, `unchecked`). `bad` leads were never mailed. Real addresses — read what you need, do not restate the list |
| R | `read_lead` | one lead with its answers, and its quiz score and tier frozen at submission |
| ✗ | `unsubscribe_lead` | withheld. There is no resubscribe at any risk level |

## Analytics — where it leaks

| | tool | for |
|---|---|---|
| R | `read_analytics` | project totals. Conversion `0` with `views: 0` means no data, not 0%. Optional `from` and `to` (epoch ms, both) add that window, the same-length window before it, and leads by device and UTM source |
| R | `list_widget_analytics` | per widget, best-converting first — "which magnet works" |
| R | `read_widget_results` | one widget's leads by referrer, the funnel (views, completions, leads, conversions, revenue in cents) and per-question drop-off. Same `from`/`to` |
| R | `read_experiment_results` | an A/B experiment's arms: views, leads, rate and lift in basis points, and per variant `beatsControlBp` (the chance it beats the control). `verdict` is `collecting`, `leaning` or `winner`, with a leader and a plain-language note; it informs a decision and never stops or publishes anything. `insufficient_data` means too few views in some arm and NO rate is given. The `holdout` arm sees no widget |

## Delivery health

| | tool | for |
|---|---|---|
| R | `read_sending_status` | domain verification, daily cap, reputation, and send readiness |
| R | `list_email_deliveries` | recent email outcomes; recipient addresses are masked |
| R | `list_integrations` | native provider availability, connection state, and sanitized error |
| R | `read_integration_delivery_status` | bounded recent queue outcomes and retries; no payload or lead id |
| R | `read_ai_generation_status` | last 24 hours of generation outcomes by widget; no visitor answers or generated content |

## Campaigns — one mail, one list

| | tool | for |
|---|---|---|
| R | `list_campaigns` | with status; opens and clicks come from the ledger, not a counter |
| W | `draft_campaign` | draft only. `recipientScope` is `"all"` or one widget id |
| W | `update_campaign` | drafts only — a sent campaign cannot be edited |

## Sequences — a chain per lead

| | tool | for |
|---|---|---|
| R | `list_sequences` | steps and branch. Linear, then at most one branch point |
| W | `draft_sequence` | draft only. A delay is its own step |
| W | `update_sequence` | edits a draft only, and cannot activate. `steps` and `branch` replace the whole part |
| R | `list_sequence_enrollments` | who is enrolled in a sequence and where they are |
| W | `pause_sequence` | back to draft, immediately |
| W* | `activate_sequence` | starts enrolment for future matching leads after explicit user confirmation; confirmation is conversational |

## Transactional

| | tool | for |
|---|---|---|
| R | `list_templates` | built-in starters are `isCustom: false` and cannot be deleted |
| W | `create_template` | category is `authentication`, `account`, `orders` or `notifications`. Sends nothing |
| W | `update_template` | only the fields sent; built-in starters can be rewritten. Sends nothing |
| ✗ | `send_transactional` | withheld. Reaches a real inbox, no undo |

## Account context

| | tool | for |
|---|---|---|
| R | `read_brand` | the effective brand: site name, accent colour, sender name, logo, postal address |
| W | `update_brand` | accent must be hex — it is interpolated into a live stylesheet. On a project-bound connector it writes that website's override only |
| R | `read_ai_context` | what the blog is about, pricing, value props, testimonials, tone |
| W | `update_ai_context` | the highest-leverage write here. **Do not invent testimonials or prices** — write what the site actually says. Refused on a project-bound connector (it is account-wide) |

`W*` marks a high-impact action that is listed remotely but must only be called
after explicit user confirmation in the conversation. This is not verified by
the server.

## Contexts without direct action tools

`identity` — authentication is not something an agent exercises. `capture` — it
is anonymous. `developer` — handing key management to an agent is the one thing
a key exists to protect against. Email and AI expose read-only diagnostics;
native integration connections are readable, but OAuth handshakes still need a
browser.

Do not look for a tool in any of those. The REST API covers some of it if the
person asking has a reason.

## Invented arguments are refused, not ignored

Every input schema is strict at its top level. A key nobody declared comes back
as an error naming it, rather than being stripped — because a stripped `filters`
returns unfiltered data shaped exactly like a filtered answer, and that is the
one wrong result you cannot detect and so cannot correct.
