#!/bin/sh
set -e

echo "=== LifeForge DB Init ==="
echo "Generating and applying database migrations..."

# Ensure the migrations directory exists
mkdir -p /pb_data/pb_migrations

# Generate and apply migrations using bundled forge CLI
# This starts a local PocketBase on :8090, applies schemas, then stops it.
# The volume mount ensures migrations persist to the host.
cd /app && pnpm forge --log-level debug db push

echo "Migrations applied successfully!"
echo "=== DB Init Complete ==="
