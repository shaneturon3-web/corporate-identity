---
title: "Virtual Clinic Pilot"
tagline: "High-Compliance Virtual Practice Wrapper for Licensed Psychologists."
status: PILOT
layer: 2
icon: "shield-pulse"
architecture:
  - "Layer 2 — Thick Shield (Healthcare / Regulated)"
  - "Law 25 / PIPEDA residency + consent audit"
  - "Zone 1 Admin vs Zone 3 Clinical isolation"
highlights:
  - "Law 25 Ready — Quebec data privacy and professional boundary architecture"
  - "Lead Generation Engine — Brand Mode Facebook / WhatsApp pipeline"
  - "33/67 Revenue Split — automated clinic / therapist ledger"
  - "Clinical Authority Isolation — admin sees metadata only; licensed professional owns notes"
businessModel: "Brand Mode (Marketing + Operations Managed)"
complianceStrata: "Thick Shield (Healthcare/Regulated)"
demoUrl: "https://shaneturon.ca/psynova/clinical/"
draft: false
order: 2
---

## Problem

Licensed psychologists in Quebec cannot scale if they remain the accidental integrator for marketing leads, telehealth consent, billing splits, and clinical records across disconnected tools.

## Constraints

- **Law 25** data residency and explicit consent for PHI.
- **Zone 3** clinical notes visible only to the licensed professional on record.
- Brand-mode leads must pass **clinical fit** screening before booking.

## Systems Analysis

PsyNova Layer 2 wraps CoreSpine modules:

1. **Thick Shield** — `law25-validator`, `consent-flow`, `access-zones`
2. **Brand Mode** — `brand-mode-pipeline` (Facebook/WhatsApp → intake → fit gate)
3. **Telehealth** — `telehealth` room provisioning (Zoom / Daily.co boundary)
4. **Multidisciplinary** — `referral-logic` for optional adjunct providers

## Deployment

- Wrapper spec: `docs/PSYNOVA-HEALTHCARE-WRAPPER-SPEC.md`
- Interactive pilot: `/psynova/clinical/`
- Live app perimeter: `psynova.shaneturon.ca`
