Extract recent Slack activity into a digest file. Do not touch the board or the
owed queue — merging happens in the cloud. Your only job here is extraction.

Slack matters for a specific reason: client reporting channels live there. A
merchant asking about their test in a shared channel is the same urgency as one
texting, and until now that was invisible to Ops Hub.

1. List the channels and DMs with activity in the last 7 days.
2. For each, pull the recent messages.
3. Write `~/Desktop/ops-hub/data/slack-digest.json` in **exactly the shape
   below** — it deliberately mirrors the iMessage digest so the owed extractor
   can consume both without special-casing either.

```json
{
  "generatedAt": "<ISO 8601>",
  "lookbackDays": 7,
  "scanned": ["Slack — #channel-or-dm-name", "..."],
  "waiting": [
    {
      "label": "Slack — #channel-name",
      "kind": "group",
      "participants": ["Display Name", "..."],
      "lastFrom": "who sent the last message",
      "waitingSince": "YYYY-MM-DDTHH:MM",
      "hoursWaiting": 12.5,
      "recent": [
        { "at": "YYYY-MM-DDTHH:MM", "from": "Display Name", "text": "..." }
      ]
    }
  ]
}
```

Rules that decide whether this is useful or noise:

- **`scanned` must list every channel and DM you looked at**, whether or not
  anyone is waiting. A label in `scanned` but not in `waiting` is how the cloud
  knows Lenny already replied and can close that row. Omitting it means rows
  never close.
- **`waiting` is only for conversations where the last human message is NOT from
  Lenny.** If he sent the last message, it does not belong there. This is a
  fact, not a judgement — do not infer that he "should probably follow up".
- Prefix every label with `Slack — ` so it can't collide with an iMessage
  thread of the same name.
- Skip channels that are only bots, alerts, integrations, or joins/leaves.
- `recent` is the last 8 real messages, oldest first, each truncated to ~400
  characters. Strip Slack markup that adds nothing (`<@U123>` → the display
  name where you can resolve it).
- `waitingSince` is the timestamp of that last unanswered message, in local
  time, and `hoursWaiting` is measured from it to now.

If Slack is not authenticated, write the file with empty `scanned` and `waiting`
arrays plus an `"error"` field saying so, then say it in one line. Do not
invent activity.
