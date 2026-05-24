#!/usr/bin/env bash
# MANDATORY demo stack: local server + Cloudflare tunnel (OPERATING-DOCTRINE).
# Usage:
#   ./scripts/local-demo-stack.sh          # full: Pages Functions + D1 bindings
#   ./scripts/local-demo-stack.sh --ui     # Astro dev only (faster UI)
set -euo pipefail
[[ -f "$HOME/.machine_env" ]] && source "$HOME/.machine_env"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${DEMO_PORT:-4321}"
ORIGIN="http://127.0.0.1:${PORT}"
MODE="full"
LOG_DIR="$ROOT/.demo-stack"
URL_FILE="$LOG_DIR/public-url.txt"
PID_DEV="$LOG_DIR/dev.pid"
PID_TUNNEL="$LOG_DIR/tunnel.pid"

mkdir -p "$LOG_DIR"

if [[ "${1:-}" == "--ui" ]]; then
  MODE="ui"
fi

need_cmd() {
  command -v "$1" >/dev/null || { echo "Missing: $1"; exit 1; }
}

need_cmd cloudflared
need_cmd curl

stop_old() {
  [[ -f "$PID_TUNNEL" ]] && kill "$(cat "$PID_TUNNEL")" 2>/dev/null || true
  [[ -f "$PID_DEV" ]] && kill "$(cat "$PID_DEV")" 2>/dev/null || true
  fuser -k "${PORT}/tcp" 2>/dev/null || true
  sleep 1
}

wait_http() {
  local n=0
  until curl -sf "$ORIGIN/" >/dev/null 2>&1; do
    n=$((n + 1))
    if [[ $n -gt 90 ]]; then
      echo "ERROR: $ORIGIN did not become ready. See $LOG_DIR/dev.log"
      exit 1
    fi
    sleep 1
  done
}

start_dev() {
  cd "$ROOT"
  if [[ "$MODE" == "ui" ]]; then
    echo "Starting Astro dev on $PORT (UI only — no Pages Functions)..."
    nohup npm run dev -- --port "$PORT" --host >"$LOG_DIR/dev.log" 2>&1 &
  else
    echo "Starting full stack: build + wrangler pages dev on $PORT..."
    npm run build >>"$LOG_DIR/dev.log" 2>&1
    nohup npx wrangler pages dev dist --port "$PORT" --ip 0.0.0.0 >>"$LOG_DIR/dev.log" 2>&1 &
  fi
  echo $! >"$PID_DEV"
  wait_http
  echo "Local server ready: $ORIGIN"
}

start_tunnel() {
  echo "Starting Cloudflare quick tunnel → $ORIGIN"
  : >"$LOG_DIR/tunnel.log"
  nohup cloudflared tunnel --url "$ORIGIN" >>"$LOG_DIR/tunnel.log" 2>&1 &
  echo $! >"$PID_TUNNEL"
  local url=""
  for _ in $(seq 1 60); do
    url=$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' "$LOG_DIR/tunnel.log" | head -1 || true)
    [[ -n "$url" ]] && break
    sleep 1
  done
  if [[ -z "$url" ]]; then
    echo "ERROR: tunnel URL not found in $LOG_DIR/tunnel.log"
    exit 1
  fi
  echo "$url" >"$URL_FILE"
  sleep 2
  if curl -sfI "$url/" | head -1 | grep -q 200; then
    echo "Public demo URL (verified): $url"
  else
    echo "WARN: tunnel created but HTTP check failed — see $LOG_DIR/tunnel.log"
    echo "URL (unverified): $url"
  fi
}

stop_old
start_dev
start_tunnel

cat >"$LOG_DIR/README.txt" <<EOF
Demo stack running ($(date -Iseconds))
Mode: $MODE
Local: $ORIGIN
Public: $(cat "$URL_FILE")
Stop: $ROOT/scripts/stop-demo-stack.sh
EOF

echo ""
echo "=== Demo stack active ==="
echo "Local:  $ORIGIN"
echo "Public: $(cat "$URL_FILE")"
echo "Logs:   $LOG_DIR/"
