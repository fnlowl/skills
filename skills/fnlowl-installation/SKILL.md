---
name: fnlowl-installation
description: Install or troubleshoot FnlOwl's website embed on generic sites, WordPress, Shopify, Webflow, or Framer. Use for script-tag setup, WordPress shortcode or block setup, platform connection, and placement troubleshooting. Do not use for authoring widgets or email automation. Trigger on phrases like "install the fnlowl script", "add the fnlowl widget to WordPress", "fnlowl shortcode", "connect fnlowl to Webflow", or "the widget is not showing on my page".
metadata:
  api: 4bff472
  openapi_paths: 90
  mcp_tools: 40
  mcp_tools_gated: 4
  mcp_surface: "Counts include configured Composio tools; without them, 39 published and 2 gated."
---

# FnlOwl — installation

Choose the least invasive supported path for the host platform.

## Generic website

Load the account-wide embed once with the account's public site key:

```html
<script src="https://cdn.fnlowl.com/embed.js" data-site="usr_..." async></script>
```

Place an inline widget with `<div data-fnlowl-widget="wg_..."></div>`. The
embed creates its own shadow root; do not copy its markup or stylesheet into
the host page.

Popups and announcement bars need no placement: on a page that names no widget,
the embed loads every live one for the site and each decides for itself whether
to show (its trigger, its cooldown, and its URL rules `showOnValue` and
`hideOnValue`). To limit the embed to one workspace's widgets, add
`data-project="prj_..."` to the script tag.

## WordPress

Use the FnlOwl plugin when the site owner wants a settings page, shortcode, or
block. It requires a site key and does not load the embed until the site's
consent manager signals `fnlowl_consent_granted`. Do not bypass that gate.

## Shopify

Shopify has two parts, and they do different jobs.

- **The FnlOwl app** is an embedded Shopify admin app. Opened from the Shopify
  admin it shows the FnlOwl dashboard inside the admin, with the product menu in
  Shopify's own sidebar. A store with no linked FnlOwl account is asked to
  connect one first: the merchant signs in to FnlOwl and connects the store, and
  nothing is created automatically. Once linked, captured leads sync into the
  store's customer list. Stores that subscribe in Shopify are billed through
  Shopify Billing, not the dashboard's own checkout.
- **The theme app embed** puts the widget on the storefront. Use it, not a
  ScriptTag: the merchant enables the app embed in the theme editor (Online
  Store > Themes > Customize > App embeds) and enters the FnlOwl site key.

Both are implemented in the product, but whether a merchant can install them
from the Shopify App Store depends on the app's listing being approved; verify
that before promising an install path on a merchant's store.

## Webflow and Framer

Webflow has an OAuth-based embed install in the dashboard; availability depends
on the Webflow app credentials being configured. Framer uses the generic embed
snippet in an Embed component or page/site custom code, then the site must be
published. These paths install the same account-wide embed; they do not create a
separate widget or require a different key.

## Troubleshooting

- No views after installation usually means the script or site key is missing.
- An inline widget also needs a valid widget id on its placeholder.
- Do not expose account API keys in page code; embeds use a public site key.
- This skill has no MCP operation: installation is page/theme configuration,
  not an agent action against a FnlOwl account.
