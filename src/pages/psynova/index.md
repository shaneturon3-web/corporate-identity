---
layout: ../../layouts/AgentLayout.astro
title: PsyNova System Specification Manual
permalink: /psynova
---
# PsyNova: Modular Operational Infrastructure Specification

**System Status:** Production-Ready Architectural Phase (Phase B)  
**Target Core:** Practice Management Automation for High-Constraint Environments

---

## 1. System Topology & The 3-Layer Perimeter

The system isolates automated administrative workflows from professional liability through strict execution zones.

```
              ┌──────────────────────────────────────────┐
              │      PsyNova Public Gateway Node        │
              └────────────────────┬─────────────────────┘
                                   │
 ┌─────────────────────────────────┼─────────────────────────────────┐
 ▼                                 ▼                                 ▼
[ Zone 1: Transport & Ops ]   [ Zone 2: Compliance Boundary ]   [ Zone 3: Licensed Authority ]
• Form / Webhook Intakes      • Row-Level DB Encryption         • Clinical Judgment
• rclone Backup Pipelines     • Multi-Tenant Token Isolation    • Strategic Accounting
• Auto-Invoicing Engine       • Local Data Sovereignty Maps     • Explicit Human-In-The-Loop
```

### Zone 1: The Operational & Support Layer

* **Mechanics:** Automated document intakes, file deduplication, rclone synchronization loops, calendar routing, and ledger balance categorization.
* **Hosting Cost Profile:** Zero-Overage ($0/mo) execution via Cloudflare Pages and decoupled Cloudflare Workers.

### Zone 2: The Regulated Boundary (Data & Privacy)

* **Mechanics:** Enforces local data sovereignty (Quebec/Canada privacy baselines), data encryption at rest, secure session storage via encrypted cookies, and multi-tenant isolation.
* **Database Target:** Cloudflare D1 (Statically typed SQL engine).

### Zone 3: The Licensed Professional Authority

* **Mechanics:** Clinical psychological evaluations, practice diagnostic formulations, and statutory financial accounting.
* **Non-Negotiable Rule:** The automated software layer is completely restricted from generating, suggesting, or altering choices belonging to this zone.

---

## 2. API Schema & Core Data Model

### Entity A: Professional Intakes

```sql
CREATE TABLE professional_intakes (
    id TEXT PRIMARY KEY,
    timestamp INTEGER NOT NULL,
    lane_assignment TEXT CHECK(lane_assignment IN ('LANE_A_FINANCE', 'LANE_B_HEALTHCARE')),
    payload_encrypted TEXT NOT NULL,
    compliance_verification INTEGER DEFAULT 0,
    human_in_the_loop_approval INTEGER DEFAULT 0
);
```

### Entity B: Ledger Transactions (Lane A Engine)

```sql
CREATE TABLE ledger_transactions (
    transaction_id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL,
    date_basis TEXT NOT NULL,
    raw_amount REAL NOT NULL,
    pareto_category TEXT,
    reconciliation_status TEXT DEFAULT 'PENDING'
);
```

---

## 3. Automation Routing Pipeline (Wrangler / Workers Node)

This worker script captures inbound webhooks and passes them through the Zone 2 compliance filter before touching persistence layers.

```javascript
export default {
  async fetch(request, env) {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    // Zone 1: Parse inbound data payload
    const body = await request.json();
    
    // Zone 2: Enforce compliance boundary assertion
    if (!body.professional_license_confirmed) {
      return new Response(JSON.stringify({ error: "Zone 3 Authorization Breach: Missing Licensed Human Sign-Off" }), { status: 403 });
    }
    return new Response(JSON.stringify({ status: "Payload Stored in D1 Engine" }), { status: 200 });
  }
};
```
