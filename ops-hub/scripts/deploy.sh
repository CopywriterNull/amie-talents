#!/bin/bash
# Deploy to production and repoint lenny-ops.vercel.app at the new build.
#
# `vercel alias set` pins a name to one specific deployment, and `vercel domains
# add` refuses *.vercel.app subdomains (they're aliases, not domains you own).
# So the alias has to be re-pointed after every deploy or the pretty URL quietly
# serves a stale build — which is worse than an ugly URL, because nothing looks
# broken.

set -uo pipefail

REPO="$HOME/ops-hub"
ALIAS="${OPS_HUB_ALIAS:-lenny-ops.vercel.app}"

cd "$REPO" || exit 1

echo "building and deploying…"
vercel deploy --prod --yes >/dev/null 2>&1

DEPLOYMENT=$(vercel ls ops-hub 2>/dev/null \
  | grep -oE 'https://ops-[a-z0-9]+-copywriternulls-projects\.vercel\.app' \
  | head -1)

if [ -z "$DEPLOYMENT" ]; then
  echo "couldn't find the new deployment — alias not moved"
  exit 1
fi

echo "pointing $ALIAS at $DEPLOYMENT"
vercel alias set "$DEPLOYMENT" "$ALIAS" 2>&1 | tail -1

CODE=$(curl -s -o /dev/null -w "%{http_code}" -L "https://$ALIAS")
echo "https://$ALIAS -> $CODE"
