# Cloudflare Pages limits — corporate-identity

Project: **corporate-identity** → `shaneturon.ca`

| Constraint | Limit |
|------------|--------|
| Max file size | **25 MiB** per file |
| Max files per deployment | **20,000** |
| Max deployment size | **20 GiB** |
| Max asset path length | **1,024** characters |

## This repo

- Astro `dist/` output is small (HTML + assets under `public/images/`).
- **Exclude** `node_modules/` from git (`.gitignore`).
- Store media only under `public/images/` as SVG or compressed WebP.

## Infographics

```markdown
![Caption](/images/your-diagram.svg)
```

Paths map to `public/images/your-diagram.svg` at build time.

## Pre-deploy check

```bash
find dist -type f | wc -l
du -sh dist
```

Both should remain well below Cloudflare limits for this static site.
