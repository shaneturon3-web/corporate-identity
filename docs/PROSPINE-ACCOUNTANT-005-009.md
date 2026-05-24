# ProSpine Accountant — Orders 005–009

## Order 005 — Verified structure

```text
src/lib/wrappers/professional/     # isolated from healthcare/
src/components/wrappers/professional/
src/db/schema.sql                  # reference DDL
db/migrations/003-professional-accountant.sql
```

Healthcare remains under `src/lib/wrappers/healthcare/` only.

## R2 note

Account `10042`: enable R2 in Cloudflare dashboard, then add to `wrangler.jsonc`:

```jsonc
"r2_buckets": [{ "binding": "PROSPINE_VAULT", "bucket_name": "prospine-vault" }]
```

Until then, uploads persist **metadata + r2_key path** with `encryption_status: pending`.

## Commands

```bash
npm run db:professional:remote
npm run build && npm run deploy
```

## URLs

- Dashboard: https://shaneturon.ca/professional/dashboard/
- Gallery card: https://shaneturon.ca/projects/prospine-accountant/
- ShipYard perimeter: https://shipyard.shaneturon.ca/ (when DNS configured)
