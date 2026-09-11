#!/bin/sh
set -e

# ── Validate required environment variables ──────────────────────────
missing=""
for var in PB_EMAIL PB_PASSWORD MASTER_KEY; do
  eval "val=\$$var"
  if [ -z "$val" ]; then
    missing="$missing $var"
  fi
done
if [ -n "$missing" ]; then
  echo "ERROR: Missing required environment variables:$missing"
  exit 1
fi

if ! echo "$PB_EMAIL" | grep -qE '^[^@]+@[^@]+\.[^@]+$'; then
  echo "ERROR: PB_EMAIL is not a valid email address"
  exit 1
fi
if [ ${#PB_PASSWORD} -lt 8 ]; then
  echo "ERROR: PB_PASSWORD must be at least 8 characters"
  exit 1
fi
if [ ${#MASTER_KEY} -lt 16 ]; then
  echo "ERROR: MASTER_KEY must be at least 16 characters"
  exit 1
fi

echo "Environment variables validated."

# ── Create / upsert superuser ────────────────────────────────────────
echo "Setting up superuser..."
/usr/local/bin/pocketbase superuser upsert "$PB_EMAIL" "$PB_PASSWORD" --dir=/pb_data
echo "Superuser configured."

# ── Start PocketBase for migration application ───────────────────────
# Start PB in background on a temporary port, apply any pending
# migrations from the pb_migrations directory, then restart on the
# real port.
echo "Starting PocketBase (temp) for migration check..."
/usr/local/bin/pocketbase serve \
  --http=0.0.0.0:19999 \
  --dir=/pb_data \
  --migrationsDir=/pb_data/pb_migrations &
TEMP_PID=$!

# Wait for it to be ready
until wget -q --spider http://localhost:19999/api/health 2>/dev/null; do
  sleep 1
done
echo "PocketBase (temp) is ready."

# PocketBase auto-applies migrations on startup. By starting it with
# --migrationsDir pointing to the shared volume, any migration files
# present are applied automatically.

# Stop the temporary instance
kill $TEMP_PID 2>/dev/null
wait $TEMP_PID 2>/dev/null
echo "PocketBase (temp) stopped."

# ── Start PocketBase on the real port ────────────────────────────────
echo "Starting PocketBase on :8090 ..."
exec /usr/local/bin/pocketbase serve \
  --http=0.0.0.0:8090 \
  --dir=/pb_data \
  --migrationsDir=/pb_data/pb_migrations
