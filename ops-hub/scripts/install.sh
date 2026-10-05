#!/bin/bash
# Install the four launchd jobs: the always-on server, the Granola watcher, the
# Postgres bridge, and the daily refresh.
# Re-runnable — unloads anything already registered before loading it again.

set -uo pipefail

# NOT ~/Desktop. A launchd agent inherits no TCC grants, so anything it spawns
# gets EPERM ("Operation not permitted") opening files under Desktop, Documents
# or Downloads — bash can't even read the script it was told to run. The repo
# lives outside those directories and ~/Desktop/ops-hub is a symlink to here.
REPO="$HOME/ops-hub"
AGENTS="$HOME/Library/LaunchAgents"
mkdir -p "$AGENTS"

# launchd does not source a shell profile, so nvm never initialises and `node`
# resolves to whatever sits in /usr/local/bin — here, a stale v18 that Next.js
# refuses to start on. Bake the current node's bin directory into the plists.
NODEBIN="$(dirname "$(command -v node)")"
NODEVER="$(node -v)"
echo "using node $NODEVER from $NODEBIN"

# Shared secret for the meeting-ended webhook. Generated once and reused, so
# re-running this script doesn't orphan the watcher's copy.
SECRET_FILE="$REPO/data/hook.secret"
if [ ! -f "$SECRET_FILE" ]; then
  openssl rand -hex 24 > "$SECRET_FILE"
  chmod 600 "$SECRET_FILE"
  echo "generated webhook secret"
fi

for JOB in server watch bridge refresh; do
  LABEL="com.lenny.opshub.$JOB"
  # The plists ship with __HOME__ placeholders because launchd does no tilde
  # expansion in ProgramArguments.
  sed -e "s|__HOME__|$HOME|g" -e "s|__NODEBIN__|$NODEBIN|g" \
    "$REPO/scripts/$LABEL.plist" > "$AGENTS/$LABEL.plist"

  launchctl bootout "gui/$UID/$LABEL" 2>/dev/null || true
  # launchd needs a moment after bootout before the same label can be
  # bootstrapped again, otherwise it returns EIO.
  sleep 1
  if ! launchctl bootstrap "gui/$UID" "$AGENTS/$LABEL.plist" 2>/dev/null; then
    echo "  bootstrap failed for $LABEL — retrying once"
    sleep 2
    launchctl bootstrap "gui/$UID" "$AGENTS/$LABEL.plist" || {
      echo "  STILL FAILING: $LABEL"
      continue
    }
  fi
  echo "loaded $LABEL"
done

echo
echo "Server:  http://localhost:4321  (starts at login, restarts if it dies)"
echo "Refresh: daily at 7:52am"
echo "Webhook: POST /api/hook fires on Granola cache change, 5m settle, 15m cooldown"
echo
echo "Stop everything:  bash $REPO/scripts/uninstall.sh"
