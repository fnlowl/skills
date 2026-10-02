# Author a widget

A widget is the thing a visitor sees on the customer's site. Six kinds, and the
kind decides which fields mean anything — sending quiz tiers to an announcement bar is
accepted and ignored, which looks like it worked.

## The six kinds

| kind | what it is | the fields that matter |
|---|---|---|
| `lead-magnet` | a downloadable in exchange for an address | `contentUrl`, or `questions` if `type: 'ai'` |
| `popup` | an interruption, optionally with questions | `headline`, `description`, `trigger` + `triggerValue`, `placement`, `triggers[]` (+ `triggerMode`), `startAt`/`endAt` |
| `survey` | questions first, address after | `questions` (`short`, `long`, `single`, `multi`) |
| `announcement-bar` | a strip across the top | `barMessage`, `barCtaText`, `barCtaUrl`, `barPosition` |
| `quiz` | scored answers, a result tier per score range | `quizQuestions` (each option has a `score`), `quizTiers` covering every possible total |
| `calculator` | numeric inputs, a computed answer | `calcInputs`, `calcFormula` (inputs are `a`, `b`, `c` by position), `calcOutputTemplate` (`{{result}}`) |

The dashboard's New widget screen offers about five ready-made templates per
kind. MCP creates a widget from its fields, not from a template id, so set the
fields directly and use the dashboard templates only as a guide to sensible copy.

Popups and bars appear sitewide from the install snippet, so decide where they
must **not** show: set `hideOnValue` (e.g. `/checkout, /thank-you`), or limit
them with `showOn: 'url'` and `showOnValue`. A popup starts on a time trigger of
8 seconds. For click/hover triggers or more than one condition, use `triggers[]`
with `triggerMode` ("any" or "all") instead of the single `trigger`/`triggerValue`
pair; `startAt`/`endAt` bound when a widget runs at all.

Send just `name` and `kind` and the rest starts from the builder's defaults for
that kind; style fields (`theme`, `accentColor`, …) are optional and inherit the
account's brand. Every result carries **`issues`**: what is still missing before
the widget could go live. Fix them with `update_widget`; a widget with issues
cannot be published.

When two reasonable options would build different things — which kind, what score
ranges, what trigger — and the user has not settled it, call **`offer_choice`**
with 2 to 4 options, put them to the user, and stop until they answer.

`type` is `static` or `ai`, and only means something for `lead-magnet`. An
AI-personalised one generates its content from what the visitor answered, so it
is **refused without at least one question with text** — it would otherwise
produce the same output for every visitor, which is the whole thing it exists
not to do.

## Steps

1. **`list_widgets`** first. Names collide, and the kind that already works on
   this site tells you more about the audience than any advice you can give.
2. **`read_widget`** if you are changing one. Always — see step 4.
3. **`create_widget`** with `name` and `kind` at minimum. It is always created
   as a **draft**. A person should look at it on the page before a visitor does.
4. **`update_widget`** changes only the fields you send, **with one exception
   that will cost you the widget if you miss it**: sending any one of
   `questions`, `quizQuestions`, `quizTiers` or `calcInputs` replaces **all
   four** with exactly what you sent. Adding a fifth question by sending one
   question deletes the other four, and the two quiz arrays with them.

   So: read the widget, send the complete set you want to end up with.

5. Report the id and that it is a draft. To publish, first show what visitors
   will see and ask for explicit confirmation, then call `request_widget_publish`. It
   does not publish: it creates a pending approval (`publish` scope required),
   and the widget goes live only when a signed-in person approves it in the
   dashboard. Report it as awaiting approval.

## What you cannot do

- **Set `views` or `completions`.** They are counted from real traffic. There is
  no tool argument for them and inventing one is refused, not ignored — the
  input schemas are strict at their top level, so a key nobody declared comes
  back as an error naming it.
- **Delete a widget.** No tool. A widget with leads attached is a record of
  where those people came from; removing it is a person's call in the dashboard.
- **Install it.** The embed snippet is copied from Settings → Install by whoever
  owns the site. Zero views on a live widget usually means this never happened.

## When a call is refused

Use the returned error to distinguish invalid or incomplete widget content (including
a widget that is not ready to go live, which lists what is missing), a
missing widget/project, and other validation or service failures. Do not reduce
every refusal to the AI lead-magnet case; the tool schema and live service
determine the accepted input.
