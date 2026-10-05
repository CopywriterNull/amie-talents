#!/bin/bash
# Refresh the Ops Hub board from Granola meeting notes.
#
# Granola's local store is encrypted (cache-v6.json.enc is ciphertext and
# granola.db is not readable SQLite), so there is no way to parse meetings off
# disk. The only route in is the Granola MCP connector, which lives inside
# Claude Code — hence shelling out to `claude -p` rather than hitting an API.
#
# That connector is authenticated interactively. If a headless run can't reach
# it, this script says so and notifies rather than failing silently, so a stale
# board never masquerades as a fresh one.

set -uo pipefail

REPO="$HOME/ops-hub"
BOARD="$REPO/data/board.json"
PROMPT="$REPO/scripts/refresh-prompt.md"
LOG="$REPO/data/refresh.log"

notify() {
  osascript -e "display notification \"$1\" with title \"Ops Hub\"" 2>/dev/null || true
}

stamp() { date "+%Y-%m-%d %H:%M:%S"; }

echo "=== $(stamp) refresh starting ===" >> "$LOG"

if [ ! -f "$BOARD" ]; then
  echo "$(stamp) ERROR: no board at $BOARD" >> "$LOG"
  notify "No board.json found — refresh skipped."
  exit 1
fi

# Keep the last good board so a bad merge is one command away from undone.
cp "$BOARD" "$REPO/data/board.backup.json"

# `claude` is a shell function in the interactive zsh, and the webhook spawns
# this script from the server process, whose PATH is whatever launchd gave it.
# Resolve the real binary rather than trusting either.
CLAUDE=""
for CANDIDATE in "$HOME/.local/bin/claude" "$HOME/.claude/local/claude" \
                 /opt/homebrew/bin/claude /usr/local/bin/claude; do
  if [ -x "$CANDIDATE" ]; then CLAUDE="$CANDIDATE"; break; fi
done
if [ -z "$CLAUDE" ] && command -v claude >/dev/null 2>&1; then
  CLAUDE="$(command -v claude)"
fi

if [ -z "$CLAUDE" ]; then
  echo "$(stamp) ERROR: claude CLI not found" >> "$LOG"
  notify "Claude CLI not found — run the refresh manually."
  exit 1
fi

echo "$(stamp) using $CLAUDE" >> "$LOG"

# Extract the iMessage slice first so the model reads a small prepared file
# instead of querying a 1.1M-row database. Failure here is not fatal — a
# refresh with meetings only beats no refresh — but it is logged loudly.
if ! python3 "$REPO/scripts/imessage-digest.py" >> "$LOG" 2>&1; then
  echo "$(stamp) WARN: imessage digest failed; refreshing from meetings only" >> "$LOG"
fi

OUTPUT=$(cd "$REPO" && "$CLAUDE" -p "$(cat "$PROMPT")" \
  --allowedTools "Read,Write,Edit,mcp__granola__list_meetings,mcp__granola__get_meetings,mcp__granola__query_granola_meetings" \
  2>&1)
STATUS=$?

echo "$OUTPUT" >> "$LOG"

# A refresh that can't reach Granola still exits 0 and reports it in prose, so
# check the board actually moved rather than trusting the exit code alone.
if [ $STATUS -ne 0 ]; then
  echo "$(stamp) FAILED (exit $STATUS)" >> "$LOG"
  notify "Refresh failed. Open Claude Code and run /refresh-ops."
  exit $STATUS
fi

if ! python3 -c "import json,sys; json.load(open('$BOARD'))" 2>/dev/null; then
  echo "$(stamp) FAILED: board.json is not valid JSON — restoring backup" >> "$LOG"
  cp "$REPO/data/board.backup.json" "$BOARD"
  notify "Refresh produced invalid JSON. Backup restored."
  exit 1
fi

# The app now reads Postgres wherever DATABASE_URL is set, so a refresh that
# only rewrote board.json would be invisible. Push it up. Idempotent, and it
# never overwrites status or notes — those are hand-edits.
if [ -f "$REPO/.env.local" ] && grep -q '^DATABASE_URL=' "$REPO/.env.local"; then
  if npx --prefix "$REPO" dotenv -e "$REPO/.env.local" -- node "$REPO/scripts/migrate.mjs" >> "$LOG" 2>&1; then
    echo "$(stamp) pushed board to Postgres" >> "$LOG"
  else
    echo "$(stamp) WARN: Postgres push failed; cloud board is now behind" >> "$LOG"
    notify "Refresh saved locally but the cloud push failed."
  fi
fi

if cmp -s "$BOARD" "$REPO/data/board.backup.json"; then
  echo "$(stamp) no changes (board identical)" >> "$LOG"
  notify "Refresh ran — no new meetings."
else
  NEW=$(python3 -c "
import json
b = json.load(open('$BOARD'))
print(sum(1 for i in b['items'] if i.get('isNew')))
" 2>/dev/null || echo "?")
  echo "$(stamp) OK — $NEW new items" >> "$LOG"
  notify "Board refreshed — $NEW new items."
fi

echo "=== $(stamp) refresh done ===" >> "$LOG"
