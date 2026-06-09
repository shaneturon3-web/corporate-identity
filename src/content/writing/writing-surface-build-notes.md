---
title: "Writing Surface — Build Notes"
date: 2026-05-27
category: projects
summary: "Markdown-first publishing on shaneturon.ca — no CRM, no D1, static content collection only."
tags: ["astro", "content", "shaneturon"]
draft: false
language: en
---

This section lives entirely in **Astro content collections** — markdown files under `src/content/writing/`.

## Scope boundary

- No `/systems/crm/` activation
- No D1 bindings for posts
- Static build → Cloudflare Pages

## Publishing flow

1. Create `src/content/writing/your-slug.md`
2. Fill frontmatter: `title`, `date`, `category`, `summary`, `tags`, `draft`, `language`
3. Write body in Markdown
4. Set `draft: true` until ready
5. `npm run build` locally, then deploy via existing Pages pipeline

Filenames become URL slugs: `your-slug` → `/writing/{category}/your-slug/`.
