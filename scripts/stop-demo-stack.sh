#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$ROOT/.demo-stack"
PORT="${DEMO_PORT:-4321}"

[[ -f "$LOG_DIR/tunnel.pid" ]] && kill "$(cat "$LOG_DIR/tunnel.pid")" 2>/dev/null || true
[[ -f "$LOG_DIR/dev.pid" ]] && kill "$(cat "$LOG_DIR/dev.pid")" 2>/dev/null || true
fuser -k "${PORT}/tcp" 2>/dev/null || true
echo "Demo stack stopped."
