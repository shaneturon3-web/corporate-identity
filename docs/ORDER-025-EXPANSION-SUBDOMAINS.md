# Order 025 — Expansion Subdomains

## Hosts

| Host | Path | Content |
|------|------|---------|
| `insights.shaneturon.ca` | `/insights/` | Insights landing |
| `docs.shaneturon.ca` | `/docs/` | Documentation landing |
| `status.shaneturon.ca` | `/status/` | Status landing |

Edge routing: `functions/_middleware.ts` rewrites apex host requests to the path prefix above.

## DNS (Cloudflare zone `shaneturon.ca`)

| Record | Type | Target |
|--------|------|--------|
| `insights` | CNAME | `shaneturon.ca` |
| `docs` | CNAME | `shaneturon.ca` |
| `status` | CNAME | `shaneturon.ca` |

Add each hostname under **Workers & Pages → corporate-identity → Custom domains**.

## Deploy

```bash
cd ~/Projects/corporate-identity
npm run build
npm run deploy
```

## Verify

```bash
curl -sI https://insights.shaneturon.ca/ | head -3
curl -sI https://docs.shaneturon.ca/ | head -3
curl -sI https://status.shaneturon.ca/ | head -3
```

Local (after build):

```bash
npm run pages:dev
# Visit http://localhost:8788/insights/ etc.
```
