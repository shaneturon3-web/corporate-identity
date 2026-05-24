import { useEffect, useState } from "react";
import ProgressTracker from "../../gallery/ProgressTracker";
import { parseRole, shouldRedactClientPii, type Role } from "../../../lib/auth/roles";
import { evaluateWeeklyBillable } from "../../../lib/core/gamification-engine";
import type { TaxFilingStatus } from "../../../lib/wrappers/professional/types";

const STATUSES: TaxFilingStatus[] = [
  "Discovery",
  "Documents_Pending",
  "Review",
  "Filed",
  "Completed",
];

interface DashboardData {
  billableMinutes: number;
  billableRecoveredCents: number;
  adminAbyssHoursSaved: number;
  byStatus: { status: TaxFilingStatus; count: number }[];
  leadGenActive: boolean;
}

interface Props {
  professionalId: string;
  role?: Role | string;
}

export default function ProSpineDashboard({ professionalId, role: roleProp = "PROFESSIONAL_USER" }: Props) {
  const role = parseRole(typeof roleProp === "string" ? roleProp : roleProp);
  const [data, setData] = useState<DashboardData | null>(null);
  const [leadGen, setLeadGen] = useState(false);
  const [gamNotice, setGamNotice] = useState<string | null>(null);

  function loadDashboard() {
    fetch(`/api/professional/dashboard?professionalId=${professionalId}&role=${role}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLeadGen(!!d.leadGenActive);
      });
  }

  useEffect(() => {
    loadDashboard();
    const onUpdate = () => loadDashboard();
    window.addEventListener("prospine-billable-updated", onUpdate);
    return () => window.removeEventListener("prospine-billable-updated", onUpdate);
  }, [professionalId, role]);

  const billedHours = (data?.billableMinutes ?? 0) / 60;
  const gam = evaluateWeeklyBillable(billedHours);

  useEffect(() => {
    if (gam.showUpgradeCta) setGamNotice(gam.ctaMessage);
  }, [gam.showUpgradeCta, gam.ctaMessage]);
  const saved = data?.adminAbyssHoursSaved ?? 0;
  const pct = saved > 0 ? Math.min(100, Math.round((billedHours / saved) * 100)) : 0;

  return (
    <div className="pro-wrap pro-dash-grid">
      <div className="pro-card pro-card-span-4">
        <h4>Billable capacity recovered</h4>
        <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: 0 }}>
          Analista · admin abyss recovery
        </p>
        <p style={{ fontSize: "1.5rem", margin: "0.5rem 0" }}>
          ${((data?.billableRecoveredCents ?? 0) / 100).toFixed(2)} CAD
        </p>
        <p style={{ fontSize: "0.9rem", color: "#cbd5e1", margin: "0 0 0.5rem" }}>
          {billedHours.toFixed(1)}h billed / {saved.toFixed(1)}h admin pool
        </p>
        <div className="pro-meter">
          <div className="pro-meter-fill" style={{ width: `${pct}%` }} />
        </div>
        <p style={{ fontSize: "0.75rem", color: "#64748b" }}>{pct}% conversion to dockets</p>
        {shouldRedactClientPii(role) && (
          <p style={{ fontSize: "0.75rem", color: "#f59e0b", marginTop: "0.5rem" }}>
            Supervisor view — client PII redacted in ledger; Analista metrics visible.
          </p>
        )}
        <ProgressTracker
          label="Weekly billable (Pareto)"
          progressPct={gam.progressPct}
          sublabel={`${billedHours.toFixed(1)}h / ${gam.threshold}h threshold`}
          highlight={gam.showUpgradeCta}
        />
        {gamNotice && (
          <p className="gam-cta" role="status">
            {gamNotice}
          </p>
        )}
      </div>

      <div className="pro-card pro-card-span-8">
        <h4>Tax-season state</h4>
        <div className="pro-kanban">
          {STATUSES.map((status) => {
            const col = data?.byStatus.find((x) => x.status === status);
            const count = col?.count ?? 0;
            return (
              <div key={status} className="pro-kanban-col">
                <h5>{status.replace(/_/g, " ")}</h5>
                <ul>
                  {count === 0 ? (
                    <li style={{ color: "#64748b" }}>—</li>
                  ) : (
                    Array.from({ length: Math.min(count, 5) }).map((_, i) => (
                      <li key={i}>
                        {shouldRedactClientPii(role) ? `Client ${String.fromCharCode(65 + i)}•••` : `Client ${i + 1}`}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pro-card pro-card-span-12">
        <h4>Growth hook</h4>
        <label className="pro-toggle">
          <input
            type="checkbox"
            checked={leadGen}
            onChange={(e) => {
              setLeadGen(e.target.checked);
              fetch("/api/professional/leadgen", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ professionalId, active: e.target.checked }),
              });
            }}
          />
          Activate managed lead gen (Marketing Module)
        </label>
        <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.5rem" }}>
          Hooks Brand-mode pipeline when enabled — Light Shield only (PIPEDA).
        </p>
      </div>
      <style>{`
        .gam-cta {
          margin: 0.5rem 0 0;
          padding: 0.5rem 0.65rem;
          border: 1px solid #94a3b8;
          font-size: 0.8rem;
          color: #e2e8f0;
          background: rgba(148, 163, 184, 0.08);
        }
      `}</style>
    </div>
  );
}
