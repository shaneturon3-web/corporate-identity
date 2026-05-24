---
title: "Project Execution Orchestration"
tagline: "Single alignment point for humans, local AI, cloud AI, and handoff discipline."
status: NOW
layer: 3
icon: "control-tower"
architecture:
  - "Layer 3 — CONTROL TOWER governance"
  - "06_PROJECT_INDEX registry + tri-phase protocol"
  - "05_HANDOFFS per-slug Architect packets"
  - "ShipYard CLI continuity gates"
highlights:
  - "Google Drive source of truth with rclone mount"
  - "PROJECT_INDEX consolidation (PORTFOLIO, MARKETING, hidden slugs)"
  - "NotebookLM one-slug-per-session discipline"
businessModel: "Orchestration root (non-execution)"
complianceStrata: "Operational protocol — not a product SKU"
demoUrl: ""
draft: false
order: 4
---

## Problem

Multiple projects, machines, and AI surfaces drift without a single registry of slugs, handoffs, and execution pointers.

## Constraints

- CONTROL TOWER does not replace project execution directories (`~/Projects/`, `~/ShipYard/`).
- Machine identity only via `~/.machine_env` — never synced to Drive.
- Hidden slugs (e.g. deferred case work) live in `HIDDEN_SLUGS.md`, not the public index.

## Systems Analysis

CONTROL TOWER coordinates:

1. **06_PROJECT_INDEX** — canonical slug list consumed by ShipYard CLI and Web mirror.
2. **05_HANDOFFS/projects/<SLUG>/** — INTAKE, STATE, DOMAIN, EXECUTION_POINTER per project.
3. **09_SYNCHRONIZATION** — dry-run first, then apply to Drive.

## Deployment

- Local workspace: `~/CONTROL TOWER/`
- CLI: `shipyard list`, `shipyard refurbish <slug>`, `shipyard sync <slug>`
- Public narrative: consolidated under PORTFOLIO → `shaneturon.ca`
