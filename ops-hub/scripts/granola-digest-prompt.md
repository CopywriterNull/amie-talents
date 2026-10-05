Extract recent Granola meetings into a digest file. Do not touch the board —
merging happens in the cloud. Your only job here is extraction.

1. Read `~/Desktop/ops-hub/data/granola-digest.json` if it exists and note its
   `coversThrough`. If it doesn't exist, use 14 days ago.
2. Call `mcp__granola__list_meetings` for that date through today.
3. Call `mcp__granola__get_meetings` on any meeting newer than `coversThrough`
   (batches of 10 max).
4. Write `~/Desktop/ops-hub/data/granola-digest.json`:

```json
{
  "generatedAt": "<ISO 8601>",
  "coversThrough": "<newest meeting date, YYYY-MM-DD>",
  "meetings": [
    {
      "title": "...",
      "date": "YYYY-MM-DD",
      "summary": "the meeting's own summary, verbatim",
      "nextSteps": ["each next step as written"]
    }
  ]
}
```

Keep `summary` and `nextSteps` close to the source wording. The cloud merge
decides what becomes an item, what duplicates something already tracked, and
what to ignore — it can only do that well if it sees what was actually said
rather than your paraphrase.

If no meetings are newer than `coversThrough`, write the file with an empty
`meetings` array and today's `generatedAt`, then say so in one line.
