import { useMemo, useState } from "react";
import { canAccess, redactForZone } from "../../../lib/wrappers/healthcare/access-zones";
import type { AccessZone } from "../../../lib/wrappers/healthcare/types";
import { recordSessionRevenue } from "../../../lib/wrappers/healthcare/revenue-split";
import { CLINICAL_TEMPLATES } from "../../../lib/wrappers/healthcare/clinical-templates";

const MOCK_NOTE = {
  clinical_note: "Patient reports improved sleep hygiene.",
  session_summary: "CBT-I techniques reviewed.",
  billing_metadata: { amount_cents: 18000, status: "pending" },
  schedule_slot: "2026-05-25T14:00:00Z",
};

export default function ClinicalDashboard() {
  const [zone, setZone] = useState<AccessZone>("zone1_admin");
  const licenseId = "OPQ-12345";

  const view = useMemo(() => {
    const raw = { ...MOCK_NOTE };
    if (!canAccess({ role: zone, resource: "clinical_note", professionalLicenseId: licenseId, resourceOwnerLicenseId: licenseId })) {
      delete (raw as { clinical_note?: string }).clinical_note;
      delete (raw as { session_summary?: string }).session_summary;
    }
    return redactForZone(raw, zone);
  }, [zone]);

  const ledger =
    zone !== "zone1_admin"
      ? recordSessionRevenue("entity-demo", 18000, "sess-demo")
      : null;

  return (
    <div className="clinical-dash">
      <header>
        <h3>Clinical Dashboard</h3>
        <select value={zone} onChange={(e) => setZone(e.target.value as AccessZone)}>
          <option value="zone1_admin">Zone 1 — Admin (metadata only)</option>
          <option value="zone2_operations">Zone 2 — Operations</option>
          <option value="zone3_clinical">Zone 3 — Licensed Professional</option>
        </select>
      </header>
      <div className="zone-grid">
        <section>
          <h4>Visible data</h4>
          <pre>{JSON.stringify(view, null, 2)}</pre>
        </section>
        {ledger && (
          <section>
            <h4>33/67 ledger (session)</h4>
            <p>Clinic: ${(ledger.clinicShareCents / 100).toFixed(2)} CAD</p>
            <p>Therapist: ${(ledger.therapistShareCents / 100).toFixed(2)} CAD</p>
          </section>
        )}
        <section>
          <h4>Templates</h4>
          <ul>
            {CLINICAL_TEMPLATES.map((t) => (
              <li key={t.kind}>{t.title}</li>
            ))}
          </ul>
        </section>
      </div>
      <p
        style={{
          marginTop: "1.5rem",
          paddingTop: "1rem",
          borderTop: "1px solid #2a2a2a",
          fontSize: "0.8rem",
          color: "#94a3b8",
          fontStyle: "italic",
        }}
      >
        Clinical judgment always remains with the licensed professional.
      </p>
    </div>
  );
}
