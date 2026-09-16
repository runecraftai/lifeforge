#!/bin/sh
set -e

echo "Starting Vite dev server on :80 ..."
cd /app/apps/web
exec /app/node_modules/.bin/vite --config vite.config.dev.ts --port 80
