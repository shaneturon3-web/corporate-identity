#!/usr/bin/env bash
# Enable R2 in dashboard first:
#   https://dash.cloudflare.com/50dc92db3985dbd88a69a85cff24a0d8/r2/overview
set -euo pipefail
cd "$(dirname "$0")/.."
source "${HOME}/.machine_env" 2>/dev/null || true

echo "Creating R2 bucket prospine-vault..."
npx wrangler r2 bucket create prospine-vault || npx wrangler r2 bucket list | grep -q prospine-vault

echo "Building and deploying with PROSPINE_VAULT binding..."
npm run build
npx wrangler pages deploy dist --project-name=corporate-identity --branch=main \
  --commit-hash="$(git rev-parse HEAD)" \
  --commit-message="deploy: enable PROSPINE_VAULT R2 binding" \
  --commit-dirty=true

echo "Done. Vault upload: POST /api/professional/vault/upload"
