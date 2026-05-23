---
layout: ../layouts/AgentLayout.astro
title: PsyNova Practice Operations Engine • Architectural Blueprint
permalink: /psynova
---

# PsyNova: The Practice Operations Wrapper

**System Class:** Enterprise-Grade Modular Administrative Spine  
**Deployment State:** Production-Active (Elite Build v2)  
**Host Context:** Local OptiPlex Node Server ──[Secure cloudflared Tunnel]──> `psynova.shaneturon.ca`

---

## 1. The Commercial Proposition (The Marketing Layer)

### The Strategic Bottleneck: The "Accidental System Integrator" Trap

A licensed professional's most expensive asset is their billable hour. Yet, solo practitioners and small clinical operators are routinely forced to function as *accidental system integrators*. They lose up to an average of 6 hours weekly to non-billable back-office drag—manually moving sensitive client data across fragmented, uncooperative software silos, syncing calendars, managing intake forms, generating dockets, chasing accounting ledgers, and maintaining records retention policies.

Fragmented software utilities do not fix this friction; they silently tax your operational runway through constant context switching and administrative leakage. **Growth that collapses the human operator is not scalable infrastructure.**

### The Infrastructure Solution: An Integrated Operational Spine

PsyNova introduces a headless administrative wrapper engineered to consolidate your practice's back-office engine into a single, unified pipeline. Instead of forcing you to string together fragile, mismatched tools, PsyNova creates absolute operational continuity across patient acquisition, automated scheduling, secure billing, and long-term compliance-aware retention. It buys back your commodity administrative hours so you can focus entirely on the differentiator: **operating at the highest level of your professional license.**

---

## 2. Architectural Blueprint: The 3-Layer Perimeter

To eliminate regulatory, data privacy, and liability anxiety for licensed operators, the platform enforces strict structural perimeters between autonomous administrative tech and authoritative human judgment.

### Zone 1: The Operational & Support Layer (Administrative Tech)

* **Mechanics:** Automated multi-channel document intake routing, calendar scheduling syncs, automated invoicing sequences, text-to-docket parsing pipelines, and automated ledger balance categorization.
* **Stack State:** Decoupled NestJS controller pipelines and custom Vite user workspaces optimized for high-throughput, low-latency back-office automation.

### Zone 2: The Regulated Boundary (Data Security & Sovereignty)

* **Mechanics:** Enforces strict compliance wrappers meeting regional data sovereignty requirements (including Quebec Law 25 and Canadian privacy baselines). Outfitted with deep column-level database encryption at rest, secure isolated session state management via encrypted cookies, and multi-tenant token isolation.
* **Persistence Tier:** High-performance local relational engine managing complex schema migrations (01–10) with complete deterministic transactional integrity.

### Zone 3: The Licensed Professional Authority (Human Judgment)

* **Mechanics:** Clinical psychological diagnostics, psychotherapeutic treatment planning, and statutory corporate financial accounting.
* **The Non-Negotiable Constraint:** *Clinical and financial judgment always remains with the licensed professional.* The platform is structurally barred from automating, generating, or suggesting choices belonging to Zone 3. Every high-stakes diagnostic or ledger mutation remains strictly under the uncompromised jurisdiction of the human-in-the-loop professional.

---

## 3. Core Technical Infrastructure Assets

The production environment consists of 76 backend TypeScript files running a high-performance NestJS engine, backed by a 23-component Vite frontend dashboard.

### Authoritative Relational Schema (Elite Migrations 08-10)

```sql
-- Entity A: Secure Cross-Lane Intake Ledger
CREATE TABLE professional_intakes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    lane_assignment VARCHAR(50) NOT NULL CHECK (lane_assignment IN ('LANE_A_FINANCE', 'LANE_B_HEALTHCARE')),
    encrypted_payload TEXT NOT NULL,
    compliance_signature VARCHAR(255) NOT NULL,
    human_signed_off BOOLEAN DEFAULT FALSE NOT NULL
);

-- Entity B: Operational Ledger Tracking Matrix
CREATE TABLE practice_ledger (
    transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_identifier VARCHAR(100) NOT NULL,
    entry_date DATE NOT NULL,
    gross_amount NUMERIC(10, 2) NOT NULL,
    pareto_category VARCHAR(100),
    reconciliation_state VARCHAR(50) DEFAULT 'PENDING' CHECK (reconciliation_state IN ('PENDING', 'VERIFIED', 'EXCLUDED'))
);
```

### Zone 2 Compliance Filter (NestJS Routing Interceptor)

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ComplianceBoundaryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpException('Zone 1 Abort: Missing Operational Token', HttpStatus.UNAUTHORIZED);
    }

    if (request.method === 'POST' && !request.body.professional_license_confirmed) {
      throw new HttpException('Zone 3 Structural Breach: Missing Licensed Professional Sign-Off', HttpStatus.FORBIDDEN);
    }

    return next.handle();
  }
}
```

---

## 4. Venture Monetization & Unit Economics

PsyNova does not operate as software-as-a-service overhead; it operates as an **Infrastructure-as-a-Utility** asset, scaling directly with practice realization rates.

* **Standard Clinical Rate Basis:** Target rate modeled at **$180.00 / hour**.
* **The 33% / 67% Operational Split Matrix:**
  * **67% ($120.60)** is retained cleanly by the executing professional to account for direct service delivery, professional development, and diagnostic clinical overhead.
  * **33% ($59.40)** is allocated to the PsyNova infrastructure engine to fund automated client acquisition channels, client intake logic, secure text-to-docket conversions, continuous backups, and systems engineering management.
* **The Optimization Metric:** By eliminating non-billable front-end friction, the platform recovers administrative gaps, driving practice capacity safely toward an **85% to 90% utilization target** without adding operational exhaustion to the professional.

---

## 5. System Connections

* **Live Functional Application Platform:** [psynova.shaneturon.ca](https://psynova.shaneturon.ca)
* **Operational Health Gateway Node:** [psynova.shaneturon.ca/api/health](https://psynova.shaneturon.ca/api/health)
* **Platform Blueprint Directory:** [shaneturon.ca/psynova](https://shaneturon.ca/psynova)
