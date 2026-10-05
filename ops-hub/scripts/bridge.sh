#!/bin/bash
# Push local-only sources to the cloud board.
#
# Granola and iMessage cannot be read from Vercel — Granola's store is encrypted
# and reachable only through the MCP connector inside Claude Code, and iMessage
# lives in a Full-Disk-Access-gated SQLite file on this Mac. So this machine acts
# as a sensor: it extracts, pushes raw digests to /api/ingest, and the cloud does
# the merging.
#
# Nothing here decides what a commitment is. That judgment lives in the cloud
# merge, so changing it doesn't mean redeploying a shell script.

set -uo pipefail

REPO="$HOME/ops-hub"
LOG="$REPO/data/bridge.log"
ENDPOINT="${OPS_HUB_URL:-https://lenny-ops.vercel.app}/api/ingest"

stamp() { date "+%Y-%m-%d %H:%M:%S"; }
notify() { osascript -e "display notification \"$1\" with title \"Ops Hub\"" 2>/dev/null || true; }

echo "=== $(stamp) bridge starting ===" >> "$LOG"

SECRET=$(grep '^OPS_HUB_SECRET=' "$REPO/.env.local" 2>/dev/null | cut -d= -f2- | tr -d '"')
if [ -z "$SECRET" ]; then
  echo "$(stamp) ERROR: OPS_HUB_SECRET missing — run: vercel env pull .env.local --yes" >> "$LOG"
  notify "Bridge can't authenticate. Pull env vars."
  exit 1
fi

push() {
  local source="$1" file="$2"
  [ -s "$file" ] || { echo "$(stamp) skip $source (no payload)" >> "$LOG"; return; }

  local code
  code=$(python3 - "$file" "$source" "$ENDPOINT" "$SECRET" <<'PY'
import json, sys, urllib.request, urllib.error
path, source, endpoint, secret = sys.argv[1:5]
body = json.dumps({"source": source, "payload": json.load(open(path))}).encode()
req = urllib.request.Request(
    endpoint, data=body, method="POST",
    headers={"content-type": "application/json", "authorization": f"Bearer {secret}"},
)
try:
    with urllib.request.urlopen(req, timeout=60) as r:
        print(r.status)
except urllib.error.HTTPError as e:
    print(e.code)
except Exception:
    print(0)
PY
)
  case "$code" in
    202) echo "$(stamp) pushed $source" >> "$LOG" ;;
    401) echo "$(stamp) $source rejected — bad secret" >> "$LOG" ;;
    0)   echo "$(stamp) $source failed — endpoint unreachable" >> "$LOG" ;;
    *)   echo "$(stamp) $source returned $code" >> "$LOG" ;;
  esac
}

# iMessage: deterministic extraction, no model involved.
if python3 "$REPO/scripts/imessage-digest.py" >> "$LOG" 2>&1; then
  push imessage "$REPO/data/imessage-digest.json"
else
  echo "$(stamp) WARN: imessage digest failed (Full Disk Access?)" >> "$LOG"
fi

# Granola: only Claude Code holds the connector, so shell out for the extraction.
CLAUDE=""
for C in "$HOME/.local/bin/claude" "$HOME/.claude/local/claude" /opt/homebrew/bin/claude; do
  [ -x "$C" ] && { CLAUDE="$C"; break; }
done

if [ -n "$CLAUDE" ]; then
  "$CLAUDE" -p "$(cat "$REPO/scripts/granola-digest-prompt.md")" \
    --allowedTools "Read,Write,mcp__granola__list_meetings,mcp__granola__get_meetings" \
    >> "$LOG" 2>&1
  push granola "$REPO/data/granola-digest.json"

  # Email closes the loop. Without it the merge keeps re-proposing follow-ups
  # for leads who already declined by email, because the text thread never
  # records the outcome.
  "$CLAUDE" -p "$(cat "$REPO/scripts/gmail-digest-prompt.md")" \
    --allowedTools "Read,Write,mcp__claude_ai_Gmail__search_threads,mcp__claude_ai_Gmail__get_thread" \
    >> "$LOG" 2>&1
  push gmail "$REPO/data/gmail-digest.json"

  # Slack carries the client reporting channels. Needs the connector to be
  # authorised; the prompt writes an empty digest with an error rather than
  # inventing activity when it isn't.
  "$CLAUDE" -p "$(cat "$REPO/scripts/slack-digest-prompt.md")" \
    --allowedTools "Read,Write,mcp__claude_ai_Slack__*" \
    >> "$LOG" 2>&1
  push slack "$REPO/data/slack-digest.json"
else
  echo "$(stamp) WARN: claude CLI not found; granola skipped" >> "$LOG"
fi

echo "=== $(stamp) bridge done ===" >> "$LOG"
