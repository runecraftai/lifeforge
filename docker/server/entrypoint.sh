#!/bin/sh
set -e

echo "Waiting for PocketBase to be ready..."
until wget -q --spider http://db:8090/api/health 2>/dev/null; do
    echo "  PocketBase not ready, retrying in 2s..."
    sleep 2
done
echo "PocketBase is ready."

# ── Symlink workspace packages so runtime resolution works ────────────
# pnpm's isolated linker hoists to node_modules; in the production
# image we copy dist + package.json only, so we link them by hand.
mkdir -p /lifeforge/node_modules/@lifeforge
ln -sf /lifeforge/packages/configs    /lifeforge/node_modules/@lifeforge/configs
ln -sf /lifeforge/packages/log        /lifeforge/node_modules/@lifeforge/log
ln -sf /lifeforge/packages/pocketbase /lifeforge/node_modules/@lifeforge/pocketbase
ln -sf /lifeforge/packages/server-utils /lifeforge/node_modules/@lifeforge/server-utils

# ── Report mounted modules ───────────────────────────────────────────
if [ -d "/lifeforge/modules" ] && [ "$(ls -A /lifeforge/modules 2>/dev/null)" ]; then
    module_count=$(ls -d /lifeforge/modules/*/ 2>/dev/null | wc -l | tr -d ' ')
    echo "Found $module_count module(s) mounted at /lifeforge/modules"
else
    echo "No modules mounted. Mount modules to /lifeforge/modules to enable them."
fi

echo "Starting API server on :3636 ..."
cd /lifeforge/apps/api
exec node dist/server.js
