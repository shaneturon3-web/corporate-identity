import { useEffect, useState } from "react";
import type { AssociateHoldingsSnapshot } from "../../lib/holding/compensation-matrix";

export default function AssociateDashboard() {
  const [data, setData] = useState<AssociateHoldingsSnapshot | null>(null);

  useEffect(() => {
    fetch("/api/holding/associate?role=BACKEND_ADMIN")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  if (!data) {
    return <p style={{ color: "#94a3b8" }}>Loading holdings…</p>;
  }

  const fmt = (cents: number) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(cents / 100);

  return (
    <div className="assoc-dash">
      <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
        Associate {data.associateId} · period {data.period}
      </p>
      <table>
        <tbody>
          <tr>
            <td>Administrator Share</td>
            <td>{fmt(data.administratorShareCents)}</td>
          </tr>
          <tr>
            <td>Lead Fees</td>
            <td>{fmt(data.leadFeesCents)}</td>
          </tr>
          <tr>
            <td>Referral Commissions</td>
            <td>{fmt(data.referralCommissionsCents)}</td>
          </tr>
          <tr className="assoc-net">
            <td>Net to Associate</td>
            <td>{fmt(data.netToAssociateCents)}</td>
          </tr>
        </tbody>
      </table>
      <style>{`
        .assoc-dash table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        .assoc-dash td {
          padding: 0.5rem 0;
          border-bottom: 1px solid #2a2a2a;
          font-size: 0.9rem;
        }
        .assoc-dash td:last-child { text-align: right; font-variant-numeric: tabular-nums; }
        .assoc-net td { font-weight: 600; color: #e2e8f0; border-bottom: none; }
      `}</style>
    </div>
  );
}
