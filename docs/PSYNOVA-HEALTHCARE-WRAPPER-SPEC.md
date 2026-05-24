# PsyNova Quebec Clinical — Layer 2 Healthcare Wrapper

**Objective:** High-compliance vertical skin atop CoreSpine for Law 25 / PIPEDA and Brand-mode lead processing.

## Thick Shield

| Control | Module |
|---------|--------|
| Quebec data residency | `law25-validator.ts` |
| Telehealth consent + audit | `consent-flow.ts` |
| Zone 1 (admin) vs Zone 3 (clinical) | `access-zones.ts` |

## Brand Mode

| Flow | Module |
|------|--------|
| Facebook / WhatsApp leads | `brand-mode-pipeline.ts` |
| Clinical fit screening | `qualification-screen.ts` (in pipeline) |
| 33/67 ledger | `revenue-split.ts` |

## Clinical ops

| Feature | Module |
|---------|--------|
| Video rooms | `telehealth.ts` |
| Cross-referrals | `referral-logic.ts` |
| Note templates | `clinical-templates.ts` |

## UI

- `IntakeShield.tsx` — consent-gated intake
- `ClinicalDashboard.tsx` — role-based zones

## Strata

- **Layer 1:** CoreSpine (`src/lib/spine/`)
- **Layer 2:** This wrapper (`src/lib/wrappers/healthcare/`)
- **Layer 3:** CONTROL TOWER governance
