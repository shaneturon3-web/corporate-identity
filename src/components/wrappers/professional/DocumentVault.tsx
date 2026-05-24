import { useEffect, useState } from "react";
import type { DocumentMetadata } from "../../../lib/wrappers/professional/types";

interface Props {
  clientId: string;
  professionalId: string;
}

export default function DocumentVault({ clientId, professionalId }: Props) {
  const [docs, setDocs] = useState<DocumentMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = new URLSearchParams({ clientId, professionalId });
    fetch(`/api/professional/vault/list?${q}`)
      .then((r) => r.json())
      .then((data) => setDocs(data.documents ?? []))
      .finally(() => setLoading(false));
  }, [clientId, professionalId]);

  return (
    <div className="pro-wrap pro-panel">
      <h3>Document vault</h3>
      <p className="pro-msg">Light Shield · client folder: {clientId}</p>
      {loading && <p className="pro-msg">Loading metadata…</p>}
      {!loading && docs.length === 0 && <p className="pro-msg">No documents indexed yet.</p>}
      <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.85rem" }}>
        {docs.map((d) => (
          <li
            key={d.id}
            style={{
              border: "1px solid #2a2a2a",
              padding: "0.5rem",
              marginBottom: "0.35rem",
            }}
          >
            <strong>{d.documentType}</strong> · {d.filingYear} · {d.encryptionStatus}
            <br />
            <span style={{ color: "#64748b", fontSize: "0.75rem" }}>{d.r2Key}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
