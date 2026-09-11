#!/bin/sh
set -e

echo "=== LifeForge DB Init ==="
echo "Generating and applying database migrations..."

# Ensure the migrations directory exists
mkdir -p /pb_data/pb_migrations

# The forge CLI's getPBInstance() starts its own local PocketBase on
# the port derived from PB_HOST (localhost:8090). It then tries to
# authenticate with PB_EMAIL/PB_PASSWORD. We must create the superuser
# before the forge CLI runs, so we start PB ourselves, create the
# superuser, stop it, and let the forge CLI start its own instance.
echo "Starting temporary PocketBase for superuser creation..."
/usr/local/bin/pocketbase serve \
  --http=0.0.0.0:8090 \
  --dir=/pb_data \
  --migrationsDir=/pb_data/pb_migrations &
TEMP_PID=$!

# Wait for it to be ready
until wget -q --spider http://localhost:8090/api/health 2>/dev/null; do
  sleep 1
done
echo "PocketBase ready."

# Create superuser (the forge CLI needs this to authenticate)
/usr/local/bin/pocketbase superuser upsert "$PB_EMAIL" "$PB_PASSWORD" --dir=/pb_data
echo "Superuser created."

# Stop the temporary instance — the forge CLI will start its own
kill $TEMP_PID 2>/dev/null
wait $TEMP_PID 2>/dev/null
echo "Temporary PocketBase stopped."

# Now run forge db push — it starts its own local PB, authenticates,
# pushes schemas, then exits.
cd /app && ./node_modules/.bin/tsx --tsconfig=./tools/tsconfig.json tools/src/index.ts --log-level debug db push

echo "Migrations applied successfully!"
echo "=== DB Init Complete ==="
