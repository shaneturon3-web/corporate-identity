import { useState } from "react";
import { advancePipeline, pipelineToTaxStatus } from "../../../lib/wrappers/professional/pipeline";
import type { DocumentType, PipelineStage } from "../../../lib/wrappers/professional/types";

const STEPS = ["Identity", "Entity", "Documents"] as const;

interface Props {
  professionalId: string;
  onComplete?: (payload: Record<string, unknown>) => void;
}

export default function Intake({ professionalId, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [entityType, setEntityType] = useState<"individual" | "business">("individual");
  const [filingYear, setFilingYear] = useState(new Date().getFullYear() - 1);
  const [docType, setDocType] = useState<DocumentType>("T4");
  const [files, setFiles] = useState<FileList | null>(null);
  const [pipeline, setPipeline] = useState<PipelineStage>("lead");
  const [status, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function uploadDocuments(clientId: string) {
    if (!files?.length) return;
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const buf = await file.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
      const res = await fetch("/api/professional/vault/upload", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          clientId,
          professionalId,
          documentType: docType,
          filingYear,
          fileName: file.name,
          sizeBytes: file.size,
          contentBase64: base64,
        }),
      });
      if (!res.ok) {
        setStatus(`Upload failed: ${file.name}`);
        setUploading(false);
        return;
      }
    }
    setUploading(false);
  }

  async function submit() {
    const clientId = `cli-${crypto.randomUUID().slice(0, 8)}`;
    let stage = pipeline;
    stage = advancePipeline(stage);
    stage = advancePipeline(stage);
    const taxStatus = pipelineToTaxStatus(stage);

    const res = await fetch("/api/professional/clients", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        clientId,
        professionalId,
        displayName,
        entityType,
        taxFilingStatus: taxStatus,
        pipelineStage: "document_collection",
      }),
    });
    if (!res.ok) {
      setStatus("Failed to register client.");
      return;
    }
    await uploadDocuments(clientId);
    setStatus(`Client ${clientId} onboarded. Vault keys written (Light Shield).`);
    onComplete?.({ clientId, displayName, taxFilingStatus: taxStatus });
  }

  return (
    <div className="pro-wrap pro-panel">
      <div className="ghost-badge">Ghost Mode · Unbranded</div>
      <h3>Secure intake</h3>
      <div className="pro-steps">
        {STEPS.map((s, i) => (
          <span key={s} className={i === step ? "active" : ""}>
            {s}
          </span>
        ))}
      </div>
      {step === 0 && (
        <>
          <label>
            Client / entity name
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
          </label>
          <button type="button" onClick={() => setStep(1)}>
            Next
          </button>
        </>
      )}
      {step === 1 && (
        <>
          <label>
            Entity type
            <select
              value={entityType}
              onChange={(e) => setEntityType(e.target.value as "individual" | "business")}
            >
              <option value="individual">Individual</option>
              <option value="business">Business entity</option>
            </select>
          </label>
          <button type="button" onClick={() => setStep(0)}>
            Back
          </button>
          <button type="button" onClick={() => setStep(2)}>
            Next
          </button>
        </>
      )}
      {step === 2 && (
        <>
          <label>
            Filing year
            <input
              type="number"
              value={filingYear}
              onChange={(e) => setFilingYear(Number(e.target.value))}
            />
          </label>
          <label>
            Document type
            <select value={docType} onChange={(e) => setDocType(e.target.value as DocumentType)}>
              <option value="T4">T4</option>
              <option value="Receipt">Receipt</option>
              <option value="Bank_Statement">Bank Statement</option>
            </select>
          </label>
          <label>
            Upload files (R2 vault)
            <input
              type="file"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              accept=".pdf,.png,.jpg,.jpeg,.csv"
            />
          </label>
          <button type="button" onClick={() => setStep(1)}>
            Back
          </button>
          <button type="button" onClick={submit} disabled={uploading || !displayName}>
            {uploading ? "Uploading…" : "Complete intake"}
          </button>
        </>
      )}
      {status && <p className="pro-msg">{status}</p>}
    </div>
  );
}
