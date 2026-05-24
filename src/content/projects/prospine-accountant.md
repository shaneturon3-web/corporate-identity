---
title: "ProSpine Accountant"
tagline: "Recovering Billable Capacity from the Administrative Abyss."
status: NOW
layer: 2
icon: "ledger-ghost"
architecture:
  - "Layer 2 — Light Shield (PIPEDA / professional privacy)"
  - "Ghost Mode — 100% professional retention, white-label UI"
  - "CoreSpine billing + document vault on D1"
highlights:
  - "Travel-agency pipeline — Lead → Discovery → Document Collection"
  - "R2 document vault with D1 metadata index"
  - "Analista text-to-docket from communication logs"
  - "Fixed-fee tax package and monthly advisory templates"
businessModel: "Ghost Mode (SaaS / Managed Admin)"
complianceStrata: "Light Shield — not medical-grade Law 25"
demoUrl: "https://shaneturon.ca/professional/dashboard/"
draft: false
order: 3
---

## Problem

Solo accountants lose billable hours to email threads, receipt chasing, and tax-season coordination that never becomes a docket.

## Constraints

- **PIPEDA**-aligned professional privacy (Light Shield — no PsyNova-grade clinical zones).
- **Ghost Mode:** unbranded surfaces; **100%** fee retention to the professional.
- Document-heavy intake must map to **Client_ID** vault paths.

## Systems Analysis

ProSpine wraps CoreSpine with:

1. **Intake** — identity, entity type, secure uploads (T4, receipts, statements).
2. **Document vault** — client folders + D1 `document_metadata`.
3. **Analista engine** — `docket-extraction.ts` maps communication logs → `billable_events`.
4. **Dashboard** — capacity meter, tax-status kanban, lead-gen hook.

## Deployment

- Schema: `src/db/schema.sql` / `db/migrations/003-professional-accountant.sql`
- Dashboard: `/professional/dashboard/`
