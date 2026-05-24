---
layout: ../layouts/AgentLayout.astro
title: PsyNova Practice Operations Engine
permalink: /psynova
---

<div class="spec-hero">
  <div class="spec-meta">
    <span class="spec-badge">Production Active</span>
    <span class="spec-badge">Elite Build v2</span>
  </div>
  <p class="spec-host">OptiPlex Node → cloudflared → psynova.shaneturon.ca</p>
  <div class="spec-cta">
    <a href="https://psynova.shaneturon.ca" class="cta-live" target="_blank" rel="noopener noreferrer">Open Live Application ↗</a>
    <a href="/psynova/clinical/" class="cta-blueprint">Layer 2 Clinical Wrapper (PILOT) →</a>
    <a href="https://shipyard.shaneturon.ca/case-files/psynova-quebec/" class="cta-blueprint">Case File →</a>
  </div>
</div>

# PsyNova: The Practice Operations Wrapper

**System class:** Enterprise-grade modular administrative spine for regulated clinical and financial operations.

---

## 1. The Commercial Proposition

### The strategic bottleneck: the accidental system integrator trap

A licensed professional's most expensive asset is the billable hour. Solo practitioners and small clinical operators are routinely forced to function as *accidental system integrators*—losing up to six hours weekly to non-billable drag across fragmented software silos: calendars, intakes, dockets, ledgers, and retention policies.

Fragmented utilities do not fix this friction; they tax operational runway through context switching and administrative leakage. **Growth that collapses the human operator is not scalable infrastructure.**

### The infrastructure solution: an integrated operational spine

PsyNova consolidates the back-office engine into one pipeline: patient acquisition, scheduling, secure billing, and compliance-aware retention. It returns commodity administrative hours so you can focus on **operating at the highest level of your professional license.**

---

## 2. Architectural Blueprint: The 3-Layer Perimeter

Strict structural perimeters separate autonomous administrative technology from authoritative human judgment.

<figure class="spec-figure">
  <img src="/images/3-layer-perimeter.svg" alt="Diagram: PsyNova client gateway feeding three zones — transport and operations, compliance boundary, and licensed professional authority" width="640" height="200" />
  <figcaption>The 3-layer perimeter — administrative tech, regulated data boundary, licensed judgment.</figcaption>
</figure>

<div class="zone-card zone1">
  <h4>Zone 1 — Transport and operations (administrative tech)</h4>
  <p>Automated intake routing, calendar sync, invoicing sequences, text-to-docket parsing, and ledger categorization. NestJS controller pipelines and Vite workspaces optimized for high-throughput back-office automation.</p>
</div>

<div class="zone-card zone2">
  <h4>Zone 2 — Regulated boundary (data security and sovereignty)</h4>
  <p>Compliance wrappers for Quebec Law 25 and Canadian privacy baselines: encryption at rest, encrypted session cookies, multi-tenant token isolation. Postgres with deterministic migrations 01–10.</p>
</div>

<div class="zone-card zone3">
  <h4>Zone 3 — Licensed professional authority (human judgment)</h4>
  <p>Clinical diagnostics, treatment planning, and statutory accounting remain with the licensed professional. The platform cannot automate, generate, or suggest Zone 3 decisions. High-stakes mutations require human-in-the-loop sign-off.</p>
</div>

---

## 3. Core Technical Infrastructure Assets

The production environment runs a **76-module NestJS backend** and a **23-component Vite dashboard** on the OptiPlex node, exposed through Cloudflare at [psynova.shaneturon.ca](https://psynova.shaneturon.ca).

<div class="stat-grid">
  <div class="stat-pill"><span class="num">76</span><span class="label">Backend modules</span></div>
  <div class="stat-pill"><span class="num">23</span><span class="label">Frontend components</span></div>
  <div class="stat-pill"><span class="num">10</span><span class="label">Schema migrations</span></div>
</div>

### Relational domains (Elite migrations 08–10)

<ul class="migration-list">
  <li><strong>Migration 08 — Billing:</strong> Invoices, line items, payments, insurer-style claims, sliding-scale pricing rules, and receipts (amounts stored in cents, CAD default).</li>
  <li><strong>Migration 09 — Clinical records:</strong> Clinical notes (intake, SOAP, progress, assessment), signed revisions, consents, attachment metadata, and an append-only audit log with hash-chain integrity.</li>
  <li><strong>Migration 10 — Clinician workspace:</strong> Availability blocks, treatment plans and goals, secure messaging threads, and clinical decision-support alerts.</li>
</ul>

### Compliance boundary (operational rules)

Every protected API route requires a valid Bearer operational token. Sensitive POST mutations that touch professional judgment require explicit licensed sign-off in the request body—structurally enforced before business logic executes. No automation crosses into Zone 3.

---

## 4. Venture Monetization and Unit Economics

PsyNova operates as **infrastructure-as-a-utility**, scaling with practice realization rates—not generic SaaS overhead.

* **Standard clinical rate basis:** **$180.00 / hour** (model target).
* **33% / 67% operational split matrix:**
  * **67% ($120.60/hr)** retained by the executing professional for direct service, development, and clinical overhead.
  * **33% ($59.40/hr)** allocated to the PsyNova engine for acquisition, intake, text-to-docket, backups, and systems engineering.
* **Optimization target:** Recover non-billable friction and drive utilization toward **85–90%** without operator exhaustion.

<figure class="spec-figure">
  <img src="/images/unit-economics-matrix.svg" alt="Diagram: 67 percent professional retention versus 33 percent infrastructure allocation per billable hour" width="640" height="160" />
  <figcaption>33/67 split matrix — professional retention vs. infrastructure allocation.</figcaption>
</figure>

<div class="split-bar" role="img" aria-label="67 percent professional, 33 percent infrastructure">
  <div class="seg67">67% Professional</div>
  <div class="seg33">33% Infra</div>
</div>

---

## 5. System Connections

<ul class="connection-list">
  <li><a href="https://psynova.shaneturon.ca">Live application — psynova.shaneturon.ca</a></li>
  <li><a href="https://psynova.shaneturon.ca/api/healthcare/health">Operational health — /api/healthcare/health</a> (alias <a href="https://psynova.shaneturon.ca/api/health">/api/health</a>)</li>
  <li><a href="https://shaneturon.ca/">Portfolio gateway — shaneturon.ca</a></li>
</ul>

<p class="clinical-disclaimer" style="margin-top:2rem;padding-top:1rem;border-top:1px solid #2a2a2a;font-size:0.8rem;color:#94a3b8;font-style:italic;">
  Clinical judgment always remains with the licensed professional.
</p>
