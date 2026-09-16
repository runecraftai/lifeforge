#!/bin/sh
set -e

echo "Waiting for PocketBase to be ready..."
until wget -q --spider http://db:8090/api/health 2>/dev/null; do
    echo "  PocketBase not ready, retrying in 2s..."
    sleep 2
done
echo "PocketBase is ready."

echo "Building workspace packages..."
pnpm turbo build --filter=@lifeforge/server... \
      --filter=@lifeforge/federation \
      --filter=@lifeforge/localization \
      --filter=@lifeforge/ui && \
  pnpm --filter './modules/*' run build

echo "Starting API server in dev mode..."
cd /lifeforge/apps/api
exec node --watch --import tsx ./src/index.ts
