# Order 001 — Infrastructure & Routing

## Perimeter

| Host | Behavior |
|------|----------|
| `shaneturon.ca` | Static institutional identity (Astro `dist/`) |
| `www.shaneturon.ca` | 301 → apex |
| `psynova.shaneturon.ca` | Rewrite to `/psynova/` on same Pages project |
| `shipyard.shaneturon.ca` | Reverse proxy → `SHIPYARD_ORIGIN` (`shipyard-web.*.workers.dev`; not the public hostname) |

Implementation: `functions/_middleware.ts`

## DNS (Cloudflare zone `shaneturon.ca`)

| Record | Type | Target |
|--------|------|--------|
| `@` | CNAME or A | Cloudflare Pages (`shaneturon-ca`) |
| `www` | CNAME | `shaneturon.ca` |
| `psynova` | CNAME | `shaneturon.ca` |
| `shipyard` | CNAME | `shaneturon.ca` |

Add custom domains in Pages: **Workers & Pages → shaneturon-ca → Custom domains** (all four hostnames).

## Deploy

```bash
npm run build
npm run deploy
```

## Verify

```bash
curl -sI https://shaneturon.ca/ | head -1
curl -sI https://shipyard.shaneturon.ca/ | head -1   # should match Worker
curl -sI https://psynova.shaneturon.ca/ | head -1    # 200, psynova content
```

Local edge test (after build):

```bash
npx wrangler pages dev dist
```
