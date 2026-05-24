---
title: "CoreSpine (SugarCube Engine)"
tagline: "The Headless Administrative Engine for Professional Operational Continuity."
status: NOW
layer: 1
icon: "corespine-node"
architecture:
  - "Layer 1 — Data Perimeter (Cloudflare D1 / KV)"
  - "Layer 2 — Vertical Wrappers (Healthcare, Professional skins)"
  - "Layer 3 — CONTROL TOWER governance"
highlights:
  - "Unified Infrastructure — intake, scheduling, billing, and CRM in one reusable layer"
  - "Vertical Agnostic — high-compliance clinics or low-constraint professional firms"
  - "Billable Recovery — automated workflows replace manual accidental integration"
  - "Semantic Memory — unstructured logs → structured operational intelligence"
businessModel: "Ghost Mode (Infrastructure-as-a-Service)"
complianceStrata: "Base Layer — vertical-specific Shields apply at Layer 2"
demoUrl: ""
draft: false
order: 1
---

## Problem

Professional operators lose continuity across fragmented tools: intake forms, calendars, billing spreadsheets, and session notes rarely share a single operational model.

## Constraints

- Must remain **vertical-agnostic** at Layer 1 (no PHI-specific logic in CoreSpine).
- Compliance "skins" attach at Layer 2 wrappers only.
- All state transitions auditable (Control Tower Lite).

## Systems Analysis

CoreSpine implements four headless modules backed by D1:

1. **Intake & Routing** — conditional multi-step capture with professional assignment.
2. **Scheduling & Context** — availability expansion and slot reservation without UI coupling.
3. **Billing & Recovery** — ledger entries with configurable revenue split (default 33/67).
4. **CRM & Memory** — denormalized memory matrix compatible with SugarCube export.

## Deployment

- Schema: `db/migrations/initial-spine-schema.sql`
- Spec: `docs/CORESPINE-002-SPEC.md`
- Live demo: reserved for next deployment gate.
