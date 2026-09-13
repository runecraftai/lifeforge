#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
ROOT_DIR=$(cd -- "$SCRIPT_DIR/../../.." && pwd)
ENV_FILE="$SCRIPT_DIR/fixture.env"
PID_DIR="$SCRIPT_DIR/.pids"
LOG_DIR="$SCRIPT_DIR/.logs"

if [[ ! -f "$ENV_FILE" ]]; then
  printf 'Fixture environment file is missing: %s\n' "$ENV_FILE" >&2
  exit 1
fi

set -a
# shellcheck source=fixture.env
source "$ENV_FILE"
set +a

: "${PB_PORT:?PB_PORT is required}"
: "${API_PORT:?API_PORT is required}"
: "${WEB_PORT:?WEB_PORT is required}"
: "${PB_HOST:?PB_HOST is required}"
: "${PB_EMAIL:?PB_EMAIL is required}"
: "${PB_PASSWORD:?PB_PASSWORD is required}"
: "${MASTER_KEY:?MASTER_KEY is required}"
: "${JWT_SIGNING_KEY:?JWT_SIGNING_KEY is required}"
: "${CORS_ALLOWED_ORIGINS:?CORS_ALLOWED_ORIGINS is required}"
: "${VITE_API_HOST:?VITE_API_HOST is required}"

if ! command -v pocketbase >/dev/null 2>&1; then
  printf 'PocketBase binary is not available on PATH.\n' >&2
  exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
  printf 'pnpm is not available on PATH.\n' >&2
  exit 1
fi

if [[ -f "$PID_DIR/pocketbase.pid" || -f "$PID_DIR/api.pid" || -f "$PID_DIR/web.pid" ]]; then
  bash "$SCRIPT_DIR/stop.sh"
fi

mkdir -p "$PID_DIR" "$LOG_DIR" "$SCRIPT_DIR/pb-data"

for port in "$PB_PORT" "$API_PORT" "$WEB_PORT"; do
  if ss -H -ltn "sport = :$port" 2>/dev/null | grep -q .; then
    printf 'Fixture port is already in use: %s\n' "$port" >&2
    exit 1
  fi
done

start_service() {
  local name=$1
  shift
  setsid "$@" >"$LOG_DIR/$name.log" 2>&1 &
  printf '%s\n' "$!" >"$PID_DIR/$name.pid"
}

wait_for_url() {
  local name=$1
  local url=$2
  local pid_file="$PID_DIR/$name.pid"
  local attempt=0

  until curl -fsS --max-time 1 "$url" >/dev/null 2>&1; do
    if [[ ! -s "$pid_file" ]] || ! kill -0 "$(<"$pid_file")" 2>/dev/null; then
      printf '%s failed to start.\n' "$name" >&2
      cat "$LOG_DIR/$name.log" >&2 || true
      bash "$SCRIPT_DIR/stop.sh"
      exit 1
    fi

    attempt=$((attempt + 1))
    if (( attempt >= 120 )); then
      printf '%s did not become ready: %s\n' "$name" "$url" >&2
      cat "$LOG_DIR/$name.log" >&2 || true
      bash "$SCRIPT_DIR/stop.sh"
      exit 1
    fi
    sleep 0.25
  done
}

pocketbase superuser upsert "$PB_EMAIL" "$PB_PASSWORD" --dir="$SCRIPT_DIR/pb-data"
start_service pocketbase pocketbase serve \
  --http="127.0.0.1:$PB_PORT" \
  --dir="$SCRIPT_DIR/pb-data" \
  --migrationsDir="$SCRIPT_DIR/pb-data/pb_migrations"
wait_for_url pocketbase "$PB_HOST/api/health"

start_service api env \
  PB_HOST="$PB_HOST" \
  PB_EMAIL="$PB_EMAIL" \
  PB_PASSWORD="$PB_PASSWORD" \
  MASTER_KEY="$MASTER_KEY" \
  JWT_SIGNING_KEY="$JWT_SIGNING_KEY" \
  CORS_ALLOWED_ORIGINS="$CORS_ALLOWED_ORIGINS" \
  PORT="$API_PORT" \
  pnpm --dir "$ROOT_DIR/apps/api" run dev
wait_for_url api "http://127.0.0.1:$API_PORT/"

start_service web env \
  VITE_API_HOST="$VITE_API_HOST" \
  pnpm --dir "$ROOT_DIR/apps/web" exec vite --host 127.0.0.1 --port "$WEB_PORT"
wait_for_url web "http://127.0.0.1:$WEB_PORT/"

printf 'LifeForge fixture started: PB %s, API %s, web %s\n' "$PB_PORT" "$API_PORT" "$WEB_PORT"
