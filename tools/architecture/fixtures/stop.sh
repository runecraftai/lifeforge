#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
PID_DIR="$SCRIPT_DIR/.pids"

stop_service() {
  local name=$1
  local pid_file="$PID_DIR/$name.pid"
  local expected=$2

  [[ -f "$pid_file" ]] || return 0

  local pid
  pid=$(<"$pid_file")
  if [[ "$pid" =~ ^[0-9]+$ ]] && kill -0 "$pid" 2>/dev/null; then
    local command
    command=$(ps -p "$pid" -o args= 2>/dev/null || true)
    if [[ "$command" == *"$expected"* ]]; then
      kill -TERM -- "-$pid" 2>/dev/null || kill -TERM "$pid" 2>/dev/null || true
      for _ in {1..40}; do
        kill -0 "$pid" 2>/dev/null || break
        sleep 0.25
      done
      kill -KILL -- "-$pid" 2>/dev/null || kill -KILL "$pid" 2>/dev/null || true
    fi
  fi

  rm -f "$pid_file"
}

stop_service web 'apps/web exec vite'
stop_service api 'pnpm'
stop_service pocketbase 'pocketbase serve'
