#!/bin/bash
# Remove both launchd jobs. The app and its data are left untouched.

set -uo pipefail

for JOB in server refresh watch bridge; do
  LABEL="com.lenny.opshub.$JOB"
  launchctl bootout "gui/$UID/$LABEL" 2>/dev/null && echo "stopped $LABEL" || echo "$LABEL was not running"
  rm -f "$HOME/Library/LaunchAgents/$LABEL.plist"
done

echo "done"
