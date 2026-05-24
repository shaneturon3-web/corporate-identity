#!/usr/bin/env bash
# Expose Astro dev server (localhost:4321) via Cloudflare quick tunnel.
set -euo pipefail
[[ -f "$HOME/.machine_env" ]] && source "$HOME/.machine_env"

PORT="${PORT:-4321}"
ORIGIN="http://127.0.0.1:${PORT}"

if ! curl -sf "$ORIGIN/" >/dev/null; then
  echo "Start dev server first: cd ~/Projects/corporate-identity && npm run dev"
  exit 1
fi

if ! command -v cloudflared >/dev/null; then
  echo "Install cloudflared: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/"
  exit 1
fi

echo "Tunneling $ORIGIN → trycloudflare.com (Ctrl+C to stop)"
exec cloudflared tunnel --url "$ORIGIN"
