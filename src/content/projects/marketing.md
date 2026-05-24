---
title: "MKT Research"
tagline: "Workflow intelligence for positioning, pipeline signals, and campaign-to-handoff traceability."
status: FUTURE
layer: 2
icon: "marketing-signal"
architecture:
  - "Layer 2 — Brand Mode pipeline (non-clinical)"
  - "Lead → qualification → handoff to execution slug"
  - "SugarCube semantic memory for campaign context"
highlights:
  - "MARKETING index slug (formerly JOB_SEARCH)"
  - "PsyNova Brand Mode integration surface"
  - "NotebookLM-isolated research sessions"
businessModel: "Internal growth ops"
complianceStrata: "No PHI — marketing metadata only"
demoUrl: ""
draft: false
order: 5
---

## Problem

Employment-transition and go-to-market research scattered across chats, Drive folders, and ad-hoc notes without a durable handoff into execution slugs.

## Constraints

- Must not merge clinical (PsyNova) and marketing notebooks in one session.
- Outputs feed CONTROL TOWER handoffs, not production runtime directly.

## Systems Analysis

MKT Research tracks:

1. **Positioning artifacts** — ICP, offer, proof points for portfolio gallery.
2. **Pipeline signals** — inbound, referrals, content performance.
3. **Handoff triggers** — when research locks, spawn or update `PORTFOLIO` / `PSYNOVA` planning files.

## Deployment

- Index slug: `MARKETING` in `06_PROJECT_INDEX/PROJECT_INDEX.md`
- Execution pack: ShipYard Orders 002–004 (portfolio gallery alignment)
