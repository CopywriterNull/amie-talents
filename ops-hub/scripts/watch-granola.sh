#!/bin/bash
# Fires the Ops Hub webhook when a Granola meeting finishes.
#
# Granola exposes no outbound webhook, and its local store is encrypted, so
# there is nothing to subscribe to and nothing to parse. What IS observable is
# that the app rewrites its cache when a note is captured and synced. launchd
# watches that directory and runs this script on every change.
#
# Two things make that signal usable:
#   - a settle delay, because Granola writes in bursts while transcribing and
#     the summary isn't final until well after the call ends
#   - a cooldown in the endpoint itself, so a burst of writes is one refresh

set -uo pipefail

REPO="$HOME/ops-hub"
SECRET_FILE="$REPO/data/hook.secret"
LOG="$REPO/data/watch.log"

# Wait for the note to finish syncing before asking Claude to read it. Five
# minutes is comfortably past Granola's post-meeting summary generation.
SETTLE_SECONDS=300

stamp() { date "+%Y-%m-%d %H:%M:%S"; }

if [ ! -f "$SECRET_FILE" ]; then
  echo "$(stamp) no hook.secret — run scripts/install.sh" >> "$LOG"
  exit 1
fi

echo "$(stamp) granola cache changed, settling for ${SETTLE_SECONDS}s" >> "$LOG"
sleep "$SETTLE_SECONDS"

# Granola just wrote a note. Run the bridge so the digest reaches the cloud,
# where the merge happens. This used to POST /api/hook to trigger a local merge
# into board.json; that path is retired — two writers to the same Postgres board
# produced duplicates.
if bash "$REPO/scripts/bridge.sh" >> "$LOG" 2>&1; then
  echo "$(stamp) bridge run complete" >> "$LOG"
else
  echo "$(stamp) bridge failed" >> "$LOG"
fi
