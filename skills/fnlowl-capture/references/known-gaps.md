# Known gaps

Things that exist in the product surface but do not do what their name
suggests. Offering these as working features is the fastest way to lose
someone's trust, so they are written down rather than left to be discovered.

## There is no local MCP server you can install

`https://api.fnlowl.com/v1/mcp` is the only MCP surface a customer can reach.

There is a stdio server in the repository, but it is a **developer's** tool: it
opens a database file directly through a client the API marks tooling-only, so a
customer running it finds an empty database and is told their key is invalid. A
shipped local server would have to proxy the HTTP endpoint, and does not exist
yet.

**There is no `fnlowl-mcp` package on npm.** If a setup guide tells you to run
`npx -y fnlowl-mcp`, that guide is wrong.

## The CLI is not published

`fnlowl whoami`, `fnlowl widgets`, `fnlowl leads`, `fnlowl analytics` and
`fnlowl send` all work, and the same `fnlk_` key authenticates them. But the
package is private — **`npm install -g fnlowl-cli` does not resolve**, wherever
you saw it. It has to be built from the repository today.

Do not offer the CLI as an installable alternative to MCP.

## Nothing can be mailed until a domain is verified

Every send — campaign, sequence, transactional, and the magnet delivery a
capture triggers — is refused until the account has verified a sending domain by
publishing DNS records. A perfectly good drafted campaign will not go out, and
the reason is in Settings → Sending, not in the campaign.

Sending also pauses automatically above 5% bounces or 0.3% spam complaints in a
rolling 24 hours, and there is a daily cap per account. `read_sending_status`
exposes the current readiness and reputation summary; `list_email_deliveries`
shows recent outcomes with masked recipients. Full sending-domain DNS records
remain available in Settings → Sending.

## `list_leads` cannot tell you who is mailable

The lead projection carries `unsubscribed` and nothing about consent. Imported
addresses start unconfirmed and are excluded from every send until they click a
confirmation link — so a campaign's real audience can be much smaller than the
lead count you just read, and there is no field that shows you which ones.

Do not compute an expected audience size from `list_leads`.

## AI-personalised lead magnets may not be configured

`kind: 'lead-magnet'` with `type: 'ai'` generates its content per visitor
through an external model provider, configured by an `OPENROUTER_API_KEY` on the
deployment. Where that is absent, generation returns nothing and the visitor
gets the static fallback.

You can create the widget either way. `read_ai_generation_status` shows recent
outcomes, but no tool reveals whether the deployment's provider key is
configured when there has not yet been an attempt.

## Suppressed addresses are API-only

Bounces and complaints add addresses to a suppression list that silently
excludes them from every future send. The API exposes it at `GET /suppressions`.
There is no dashboard screen for it, so a customer asking "why did this person
not get it" has no way to look — and neither do you, from MCP.

## Purchase conversions need a re-connected Shopify

Conversions arrive from Shopify orders or from a merchant's own signed server
call. An existing Shopify connection predates the order and discount scopes, so
it must be re-authorised before orders are credited or unique discount codes are
created; until then a unique reward falls back to its static code.

## The Shopify app trusts the store, not the person

Inside the Shopify admin, the FnlOwl app signs a merchant in from Shopify's
session token. That token proves which store and which staff member is opening
the app; it does not say who owns the FnlOwl account. Any staff member who can
open the app therefore acts with the linked account's access. Do not describe
the embedded app as per-person access control, and do not promise a staff
member a read-only view.

## Per-website AI context does not exist

Brand can be overridden per website, but AI context is account-wide. A
connector bound to one website cannot change it (`update_ai_context` is
refused), and every website inherits the account's. Do not promise a site its
own voice or pricing context.

## Lead magnets need a placeholder

Popups, bars and floating buttons are sitewide and load with the site key. A
lead magnet, quiz or calculator only appears where the page has a
`data-fnlowl-widget` placeholder (or the embed is given its id). `read_widget`
returns `placement`; a magnet with no placeholder has zero views.

## A/B experiments compare whole widgets, and the odds are directional

An experiment splits traffic between a control widget and other live widgets of
the same kind. There is no element-level test — to test a headline, create a
variant widget with the new headline. Views are page loads, not unique visitors,
so a returning visitor counts more than once and the "beats control" odds read
as more certain than they are. A verdict waits for 100 views per arm, 20 leads
and 7 days, and even then only informs: nothing stops an experiment or
publishes a variant for you. `holdoutPct` sees no widget, so it can never
produce a lead and measures no lift; leave it at 0.
