Extract recent Escape Hatch email into a digest file. Do not touch the board —
merging happens in the cloud. Extraction only.

1. Call `mcp__claude_ai_Gmail__search_threads` with
   `in:inbox OR in:sent newer_than:10d -from:hello@mercury.com
    -from:notifications@stripe.com -from:noreply@email.openai.com
    -from:updates@e.stripe.com -from:notification@slack-mail.com`
   and `view: THREAD_VIEW_MINIMAL`, pageSize 40.
2. For any thread that looks like a real conversation with a person — a lead, a
   client, a partner — call `mcp__claude_ai_Gmail__get_thread` with
   `messageFormat: MINIMAL` to see every message and who sent the last one.
   Skip automated notifications entirely.
3. Write `~/Desktop/ops-hub/data/gmail-digest.json`:

```json
{
  "generatedAt": "<ISO 8601>",
  "threads": [
    {
      "subject": "...",
      "participants": ["..."],
      "lastFrom": "who sent the most recent message",
      "lastAt": "YYYY-MM-DD",
      "messages": [{ "at": "YYYY-MM-DD", "from": "...", "snippet": "..." }]
    }
  ]
}
```

Include outcomes explicitly, especially declines and closures. The merge keeps
re-adding a follow-up for a lead who already passed by email, because it only
ever saw the text thread where the outcome was never mentioned. A dead thread
being visibly dead is the point of this digest.
