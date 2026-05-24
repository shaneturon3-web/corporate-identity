# Infographic assets (`public/images/`)

Referenced from `/psynova` as `/images/...` (Astro serves `public/` at site root).

## Required assets (SC-20260523-011)

| File | Section | Description |
|------|---------|-------------|
| `3-layer-perimeter.svg` | §2 | Client gateway → Zone 1 / 2 / 3 perimeter |
| `unit-economics-matrix.svg` | §4 | 33/67 operational split matrix |

## Export rules

- Prefer **SVG** for diagrams; **WebP** for photos.
- Keep each file **under 25 MiB** (Cloudflare Pages per-file limit).
- Total deployment must stay under **20,000 files** and **20 GiB**.

Placeholder SVGs ship until final artwork is ready. Replace files here, then `npm run build` and deploy `corporate-identity`.
