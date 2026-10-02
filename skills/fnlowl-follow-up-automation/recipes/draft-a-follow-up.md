# Draft a follow-up

Two mechanisms, and they are not interchangeable.

- A **campaign** is one email to an audience.
- A **sequence** is timed, per-lead follow-up after capture.

You can draft either. **You cannot start either.** Both end with a person.

## A campaign

1. **`list_campaigns`** — inspect existing campaigns and their status.
2. **`draft_campaign`** with `name`, `subject`, `body`, and `recipientScope`.
   Scope is either `"all"` or one widget id.
3. **`update_campaign`** to revise a draft. A sent campaign cannot be edited.

Unsubscribed and bounced addresses are excluded automatically. Do not claim the
lead count is the campaign's final deliverable audience.

## A sequence

1. **`list_sequences`** — inspect existing chains and their steps.
2. **`draft_sequence`** with `name`, `widgetId` (or `null` for every lead), and
   `steps`. An email and a delay are separate steps; two email steps without a
   delay run back to back.
3. **`update_sequence`** edits a **draft** — never an active one, and it cannot
   activate. Sending `steps` or `branch` replaces that whole part, so send the
   complete chain. To fix a live sequence: pause it, update it, then ask.
4. **`pause_sequence`** returns a sequence to draft and immediately stops new
   enrolments.

To activate a draft, show the audience, timing and messages and ask for explicit
confirmation, then call `activate_sequence`. It starts future enrolment and
sends on a timer; the server cannot verify that the user confirmed.

## Branching

One sequence may have one linear branch point. Paths are evaluated first-match
wins, left to right; a `field: null` catch-all must be last. Filters may only
test `unsubscribed` or `quizTierLabel`.

Report the result as drafted and ready for review, never sent or activated.
