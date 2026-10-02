# The approval model

Every fnlowl tool carries a `risk`, declared where the tool is written rather
than in a list somewhere that would have to name every context.

| risk | meaning | over HTTP |
|---|---|---|
| `low` | a read | published, `readOnlyHint: true` |
| `medium` | a write a person can see and undo in the dashboard | published, `readOnlyHint: false` |
| `high` | an effect that **leaves the system** — mail to a real inbox, an address removed from a list, or a live workflow | withheld unless an explicit remote-confirmation rule is declared |

## Tools you will not see

`send_transactional` and `unsubscribe_lead` are `high`. Over the remote
transport they are **omitted from `tools/list` entirely** — not listed and
refused on every call. Campaign sending has no tool at any risk level.

`activate_sequence` is also high-impact. It is listed remotely as an explicit
action tool, and the agent must first explain the effect and receive an
affirmative user response. MCP cannot verify that a human gave that response, so
this is a conversational safeguard, not an authorization boundary. Availability
alone is never consent.

`request_widget_publish` IS server-verified. It is listed only for an API key with the
`publish` scope (keys are `read`, `write` and `publish`; new keys are read-only),
and calling it does not publish: it stores a pending request with a before and
after snapshot and returns `pending`. The widget goes live only when a signed-in
person approves the request in the dashboard — an API key cannot approve. Tell
the user the approval is waiting; do not claim the widget is live.

When the optional Composio service is configured, its
`start_composio_connection` and `execute_composio_action` tools are also high
risk and omitted. `list_composio_connections` is a low-risk read and may appear.

That is a deliberate choice with a reason: describing a capability the transport
does not have spends your context to produce an error. So there is no flag, no
argument and no retry that reveals them. Their absence is the answer.

## Why the remote surface can never approve

An approval is a person's, and a model holding an API key is not a person. The
transport hardcodes it — a key is a credential in a config file, not somebody
sitting in front of a confirmation dialog. There is no header that changes it
and no plan tier that unlocks it.

A local stdio server does allow approvals, but it is a **developer's** tool run
against a local database and is not something a customer can install. See
[known-gaps.md](known-gaps.md).

## What this means for what you say

The failure mode is not being blocked. It is reporting success.

- "I've sent the campaign" — you cannot. There is no `send_campaign` tool at
  any risk level, for anyone.
- "I've unsubscribed them" — you cannot, and there is no resubscribe either.
  Putting someone back on a list is theirs to do, not yours.
- "I've emailed them the file" — you cannot. Capture sends the magnet by itself
  when a visitor submits; that is the product working, not you.

The accurate shape is: **drafted, and here is where the person finishes it.**

## What you can do without asking

Ordinary `medium` writes include creating a draft widget, editing a draft
campaign, changing the brand or AI context, and pausing a sequence. Publishing
and activation are separate high-impact actions; direct sends and unsubscribe
remain unavailable remotely.

Pausing is worth noticing: it is a write that *stops* mail, so it applies
immediately. Nothing that starts mail does.
