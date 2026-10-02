---
name: fnlowl-follow-up-automation
description: Draft or review FnlOwl lead-magnet delivery, ESP and webhook handoff, campaigns, and follow-up sequences. Use when asked to create a nurture sequence, draft a campaign, diagnose a delivery or enrolment problem, or plan quiz-based follow-up. Do not use to create on-page widgets or analyse conversion.
metadata:
  api: 4bff472
  openapi_paths: 90
  mcp_tools: 40
  mcp_tools_gated: 4
  mcp_surface: "Counts include configured Composio tools; without them, 39 published and 2 gated."
---

# FnlOwl — follow-up automation

FnlOwl's capture loop is: personalise when the widget is AI-powered, deliver
the promised magnet, queue connected ESP/webhook handoff, then enrol matching
active sequences. This skill handles the automation side without claiming an
agent can send mail. A sequence can be activated only after the person confirms
that it should begin enrolling future leads.

## Ground rules

1. **Drafting is not sending.** The remote MCP surface has no campaign-send or
   transactional-send action and cannot unsubscribe a person. A sequence can
   be activated after explicit user confirmation, which starts future
   enrolments but does not manually send a campaign.
2. **A campaign and a sequence are different.** A campaign is one email to an
   audience; a sequence is timed, per-lead follow-up after capture.
3. **Delivery is configuration-dependent.** A verified sending domain is
   required, and suppressed or unconfirmed addresses are not mailable. Read
   [known-gaps.md](../fnlowl-capture/references/known-gaps.md) before promising
   a message will be delivered.
4. **Sequence branches must be explicit.** FnlOwl supports one linear sequence
   with at most one first-match-wins branch, using `quizTierLabel` or
   `unsubscribed`. Put the catch-all last.
5. **Connected integrations are asynchronous.** ESP pushes and webhooks are
   queued after capture, with retries; they never prove that the original
   capture or email delivery failed.
6. **Know which handoffs exist.** An account can connect Kit, Mailchimp,
   Klaviyo, ActiveCampaign, or a signed webhook with an API key or URL, and a
   Shopify store for customer sync. Others, such as beehiiv, are listed but not
   available. `list_integrations` is the live answer; trust it over this list.
7. Use `read_sending_status`, `list_email_deliveries`,
   `list_integrations`, `read_integration_delivery_status`, and
   `read_ai_generation_status` to diagnose the corresponding automation stage.
   These return masked or summary data, not secrets or visitor content.

## Recipes and references

- [draft-a-follow-up.md](recipes/draft-a-follow-up.md) — campaign and sequence authoring
- [00-preflight.md](../fnlowl-capture/recipes/00-preflight.md) — establish the project and live tool surface
- [approval-model.md](../fnlowl-capture/references/approval-model.md) — why sending is not an agent action
- [tool-reference.md](../fnlowl-capture/references/tool-reference.md) — current tool availability
