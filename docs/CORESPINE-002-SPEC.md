# CoreSpine — Internal Technical Spec (002 Directive, Priority 1)

**Objective:** Vertical-agnostic administrative substrate; operational logic isolated from compliance skins and presentation wrappers.

## Conceptual matrix

```text
[ OPERATOR INTERFACE / WRAPPERS ]
           |
[ API / ORCHESTRATION LAYER ] <--> [ SUGARCUBE SEMANTIC MEMORY ]
           |
[ CORE MODULES ]
  ├── INTAKE & ROUTING
  ├── SCHEDULING & CONTEXT
  ├── BILLING & RECOVERY
  └── CRM & MEMORY
           |
[ DATA PERIMETER (Cloudflare D1 / KV) ]
```

## Module map (code)

| Module | Path | Responsibility |
|--------|------|----------------|
| Intake | `src/lib/spine/intake/` | Multi-step forms, qualification tags, professional routing |
| Scheduling | `src/lib/spine/scheduling/` | Headless availability, session types, slot selection |
| Billing | `src/lib/spine/billing/` | Ledger, invoices, revenue splits (e.g. 33/67) |
| CRM | `src/lib/spine/crm/` | Memory matrix, entity lifecycle state machine |
| Orchestration | `src/lib/spine/orchestration/` | Control Tower Lite transitions |
| SugarCube | `src/lib/sugarcube/` | Semantic bundle export for AI / handoff |

## API (Pages Functions)

- `GET /api/spine/health` — perimeter check
- Future: `/api/spine/intake`, `/api/spine/scheduling`, … (D1-bound)

## Database

- Migration: `db/migrations/initial-spine-schema.sql`
- Apply: `npm run db:spine:remote`

## Compliance strata

- **Layer 1:** CoreSpine (this repo) — no PHI-specific logic
- **Layer 2:** Vertical wrappers (`src/components/wrappers/`) — healthcare shields, etc.
- **Layer 3:** CONTROL TOWER governance — handoffs, refurbish gates

## Status

`NOW` — foundational build. Public card: `src/content/projects/corespine.md`.
