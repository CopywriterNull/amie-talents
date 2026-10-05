Refresh the Ops Hub board from Granola meeting notes.

The board lives at `~/Desktop/ops-hub/data/board.json`. Read it first — the
`coversThrough` field is the date of the newest meeting already folded in, and
`items[]` holds everything currently tracked.

The board has two sources: Granola meeting notes, and iMessage threads with a
handful of business contacts. Meetings produce tidy action items; texts produce
commitments buried in banter. Both land in the same `items[]`.

## What to do

1. Read `~/Desktop/ops-hub/data/board.json`.
2. Call `mcp__granola__list_meetings` for the range from `coversThrough` to today.
3. Call `mcp__granola__get_meetings` on the new meetings (batches of 10 max) and
   pull out every action item, commitment, and deadline assigned to Lenny.
4. Read `~/Desktop/ops-hub/data/imessage-digest.json` — already extracted by
   `scripts/imessage-digest.py`, so do not query chat.db yourself. See the
   iMessage rules below for what counts.
5. If neither source produced anything new, update `lastRefresh` only and stop.
6. Merge into `items[]`:
   - **New action item** → append with a fresh kebab-case `id`, the right
     `section`, a `due` date if one was stated or clearly implied, `status`
     `"open"` (or `"unknown"` if the note leaves the outcome unrecorded), a
     one-line `source` in the form `"Meeting title — Mon D"`, and `isNew: true`.
   - **Already tracked** → leave `status` and `notes` alone. Those are Lenny's
     hand-edits and must never be overwritten by a refresh. You may sharpen
     `detail` or add a `due` that a later meeting made concrete.
   - **Completed in a later meeting** → set `status` to `"done"`, but only when
     a note says so explicitly. Do not infer completion from silence.
   - **Never delete items.** If something looks obsolete, add a line to its
     `detail` saying so and leave it for Lenny to close.
7. Set `isNew: false` on every item that was already in the file, so the
   highlight only marks genuinely new arrivals.
8. Update `coversThrough` to the newest meeting date and `lastRefresh` to now
   (ISO 8601).
9. Write the file back as valid JSON, two-space indented.

## Reading iMessage

Most of a thread is chatter. Add an item only when one of these is true:

- **Lenny promised something** — "I'll send it tonight", "lemme build", "I gotu"
- **Someone is waiting on him** — a direct ask that has no reply after it
- **A deal moved** — a trial closed, a lead went warm, terms were proposed
- **A number or date was committed to** — a billing date, a split, a deadline
- **A problem was raised and not resolved** — especially one a client chased twice

Skip banter, logistics that already happened, and anything the thread itself
resolves a few messages later. When a promise was clearly kept in a later
message, don't add it.

Set `source` to `iMessage — <thread label>, <Mon D>` so provenance stays
visible; the UI styles message-sourced items differently on the strength of
that `iMessage —` prefix, so keep the wording exact.

**Dedupe hard against meetings.** The same deal usually appears in both — a
call in Granola and the follow-up over text. If an existing item covers it,
sharpen that item's `detail` or add the date instead of creating a second one.
A person's name matching is not enough; ask whether the *action* is the same.

Group chats named `chatNNNN…` have no display name — label them by their
participants, which the digest already resolves.

## Sections

`today` (fires within 24h) · `runbook` (dated launch sequence) · `slipped`
(past its date) · `pipeline` (Escape Hatch prospects) · `build` (GFuel flows,
CRO, listings) · `tiktok` (TikTok Shop health) · `decisions` (choices with a
clock) · `people` (owed someone a reply) · `yours` (comp, career, manager) ·
`personal`.

Re-file items as dates move: anything in `runbook` whose `due` has passed and
isn't `done` belongs in `slipped`. Anything due today belongs in `today`.

## Finally

Print a short plain-text summary: how many meetings were read, which items were
added, and which were closed. Keep it under 10 lines.
