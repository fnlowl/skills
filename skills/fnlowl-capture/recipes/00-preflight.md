# Pre-flight

Run this before anything else, including a read-only ask.

It exists because the two things most easily got wrong here are both silent: a
correct answer about the wrong project, and a confident claim that mail was sent
by a surface that cannot send mail.

## Steps

1. **`tools/list`.** Read the names and the `annotations`. `readOnlyHint: true`
   is a read; `false` is a write. Review its effect before making user-visible
   changes. The deployment may expose 39 tools, or 40 when Composio is configured.

   Some high-impact publish/activate actions are intentionally exposed with a
   conversational confirmation requirement. Tool availability is not consent;
   ask before invoking them. Direct sends and unsubscribe remain withheld.

2. **`list_projects`.** A project is one site or brand under the account, and
   every widget, lead, campaign and sequence belongs to exactly one. The list
   comes back regardless of which project header you sent, so this is safe to
   call first.

   Then pick one and send its id as the `x-fnlowl-project` header on every
   later call. **With no header, every tool reads across the whole account** —
   which is not an error and produces no warning, so a widget list spanning
   three brands looks exactly like one brand's list.

   Quote the project name back to the person before changing anything.

3. **`read_analytics`.** The overview numbers for the scope you just chose.
   Two seconds, and it tells you whether there is any data to reason about at
   all. Zero views everywhere means the embed snippet is not installed on the
   site — say that, rather than reporting "no leads" as if it were a finding
   about the copy.

## What a failure means

- **401 `invalid_api_key`** — the key is missing, wrong, revoked, or not a
  fnlowl key. Keys start `fnlk_` and are created in Settings → API. There is no
  public/secret split: fnlowl has one key class, and the browser-side widget
  uses a *site key* that is a different thing entirely and is not accepted here.
- **An empty `list_projects`** — the key is valid and its account has no
  projects, which should not happen; an account gets one on sign-up. Report it
  rather than proceeding against a null project.
- **A tool named in this skill that `tools/list` does not return** — the skill
  is stale, or the tool is gated. Check
  [../references/approval-model.md](../references/approval-model.md) for the
  actions gated by design; anything else means work from the live list and say
  the skill is out of date.
