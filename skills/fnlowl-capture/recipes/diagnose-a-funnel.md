# Diagnose a funnel

Three numbers, in order: **views → completions → leads**. Each gap has a
different cause and a different fix, and reporting the wrong one sends someone
to rewrite copy that was never the problem.

## Steps

1. **`read_analytics`** — the account or project totals. Widgets, views,
   completions, conversion percentage, leads, unsubscribed.
2. **`list_widget_analytics`** — the same numbers per widget, best-converting
   first. This is what answers "which magnet is working".
3. **`read_widget_results`** on the interesting one — its leads grouped by
   referrer, the funnel down to conversions, and where visitors left a survey
   (`questionDropoff`). Pass `from` and `to` to compare a period with the one
   before it.
4. **`read_experiment_results`** if the widget is in an A/B test. Quote a rate
   or a lift only when `result` is `ok`; on `insufficient_data` say more traffic
   is needed and give no number. Call a winner only when `verdict.status` is
   `winner`; report `leaning` as unconfirmed; on `collecting` relay the note. The
   verdict informs — never stop an experiment or publish a variant on it alone,
   and ask the user first.
5. **`read_widget`** on the same one, to see the copy and questions the numbers
   are about.

## Reading the three gaps

**No views.** The widget is not on the page, or it is a draft. Check `status`
with `read_widget` before saying anything about the audience. A live widget with
zero views means the embed snippet was never installed — that is a five-minute
fix in Settings → Install by whoever owns the site, and no amount of rewriting
the headline will change it.

**Views but no completions.** This is the one that is genuinely about the
widget: the offer, the headline, the number of questions. `read_widget_results`
gives you the referrers, and traffic from one source converting far worse than
another usually means the page it sits on promised something different.

**Completions but no leads.** Not a fault. An announcement bar completes when it is
clicked and a calculator can complete without ever asking for an address —
`completions` counts the interaction, `leads` counts addresses captured. If the
customer expected addresses from either, the fix is a different kind of widget,
not different copy.

## Two things the numbers do not mean

- **Conversions are purchases credited to a lead.** A purchase counts only
  within 14 days of capture, by matching the email, and leads marked `bad` are
  excluded everywhere. Revenue is in cents.

- **Conversion `0` with `views: 0` means NO DATA**, not a 0% conversion rate.
  Say "nothing has been measured yet". Reporting 0% as a result is a wrong
  answer that reads like a finding.
- **The referrer is what the visitor's browser reported at submission.** It is
  rough attribution, not tracking. `Direct` is a large bucket that includes
  every source that stripped its referrer, so do not conclude a channel is dead
  because it is not in the list.

## What you cannot see from here

Opens and clicks on mail belong to the sent-email ledger, not to widget
analytics — `list_campaigns` carries them per campaign. There is no tool that
joins a lead to the mail it received.
