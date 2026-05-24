import { useState } from "react";
import { recordTelehealthConsent } from "../../../lib/wrappers/healthcare/consent-flow";
import { validateQuebecResidency } from "../../../lib/wrappers/healthcare/law25-validator";
import { screenClinicalFit } from "../../../lib/wrappers/healthcare/brand-mode-pipeline";

interface Props {
  entityId: string;
}

export default function IntakeShield({ entityId }: Props) {
  const [name, setName] = useState("");
  const [province, setProvince] = useState("QC");
  const [signed, setSigned] = useState(false);
  const [signature, setSignature] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const residency = validateQuebecResidency({
      storageRegion: "QC",
      processingRegion: "QC",
      containsPhi: true,
    });
    if (!residency.ok) {
      setStatus(`Blocked: ${residency.violations.join(", ")}`);
      return;
    }
    const fit = screenClinicalFit({ province, crisis_immediate: false });
    if (!fit.fit) {
      setStatus(`Clinical fit: blocked — ${fit.blockers.join(", ")}`);
      return;
    }
    if (!signed || !signature.trim()) {
      setStatus("Telehealth consent required.");
      return;
    }
    recordTelehealthConsent({
      entityId,
      signerName: name,
      signaturePayload: signature,
      ipAddress: "127.0.0.1",
      acceptedTermsVersion: "2026-05-01",
    });
    setStatus("Intake secured. Zone 3 clinical path unlocked for licensed professional.");
  }

  return (
    <form className="shield-panel" onSubmit={submit}>
      <div className="shield-header">
        <span className="shield-icon" aria-hidden />
        <div>
          <h3>Intake Shield</h3>
          <p>Law 25 · PIPEDA · Telehealth consent</p>
        </div>
      </div>
      <label>
        Full name
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>
        Province
        <select value={province} onChange={(e) => setProvince(e.target.value)}>
          <option value="QC">Quebec</option>
          <option value="ON">Ontario (refer out)</option>
        </select>
      </label>
      <label className="consent-row">
        <input type="checkbox" checked={signed} onChange={(e) => setSigned(e.target.checked)} />
        I consent to telehealth under Quebec clinical guidelines
      </label>
      <label>
        Digital signature (typed)
        <input value={signature} onChange={(e) => setSignature(e.target.value)} placeholder="Full legal name" />
      </label>
      <button type="submit">Submit secure intake</button>
      {status && <p className="status-msg">{status}</p>}
    </form>
  );
}
