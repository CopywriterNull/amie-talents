#!/bin/bash
# Fetch the brief from the cloud and text it to Lenny.
#
# Vercel composes it (it holds the queue); this Mac sends it (it is the only
# thing that can talk to Messages). Same sensor/brain split as the digests.
#
#   ./brief.sh            # send if there's something worth sending
#   ./brief.sh --force    # send regardless
#   ./brief.sh --dry      # print, don't send

set -uo pipefail

REPO="$HOME/Desktop/ops-hub"
LOG="$REPO/data/bridge.log"
TO="+17146038678"
BASE="${OPS_HUB_URL:-https://lenny-ops.vercel.app}"

FORCE=0; DRY=0
for a in "$@"; do
  [ "$a" = "--force" ] && FORCE=1
  [ "$a" = "--dry" ] && DRY=1
done

stamp() { date "+%Y-%m-%d %H:%M:%S"; }

SECRET=$(grep '^OPS_HUB_SECRET=' "$REPO/.env.local" 2>/dev/null | cut -d= -f2- | tr -d '"')
if [ -z "$SECRET" ]; then
  echo "$(stamp) brief: OPS_HUB_SECRET missing" >> "$LOG"
  exit 1
fi

RESP=$(curl -sS -m 45 -H "authorization: Bearer $SECRET" "$BASE/api/brief")
if [ -z "$RESP" ]; then
  echo "$(stamp) brief: no response from $BASE" >> "$LOG"
  exit 1
fi

TEXT=$(printf '%s' "$RESP" | python3 -c 'import json,sys; print(json.load(sys.stdin).get("text",""))')
WORTH=$(printf '%s' "$RESP" | python3 -c 'import json,sys; print(1 if json.load(sys.stdin).get("worthSending") else 0)')

if [ -z "$TEXT" ]; then
  echo "$(stamp) brief: empty text, nothing sent" >> "$LOG"
  exit 0
fi

if [ "$DRY" = "1" ]; then
  printf '%s\n' "$TEXT"
  exit 0
fi

# A brief that arrives every afternoon saying "nothing to do" trains you to
# ignore the one that says something. Quiet unless it earns the interruption.
if [ "$WORTH" != "1" ] && [ "$FORCE" != "1" ]; then
  echo "$(stamp) brief: nothing worth sending" >> "$LOG"
  exit 0
fi

TMP=$(mktemp -t opsbrief)
printf '%s' "$TEXT" > "$TMP"

osascript <<APPLESCRIPT >> "$LOG" 2>&1
set msg to (read POSIX file "$TMP" as «class utf8»)
tell application "Messages"
  set svc to 1st account whose service type = iMessage
  send msg to participant "$TO" of svc
end tell
APPLESCRIPT
RC=$?
rm -f "$TMP"

if [ "$RC" = "0" ]; then
  echo "$(stamp) brief: sent" >> "$LOG"
else
  echo "$(stamp) brief: send failed rc=$RC" >> "$LOG"
fi
exit $RC
