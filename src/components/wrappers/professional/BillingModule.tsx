import { useState } from "react";
import {
  ACCOUNTANT_PACKAGES,
  billableEventsToDocketTotal,
  invoiceFromPackage,
  type AccountantPackage,
} from "../../../lib/wrappers/professional/billing-ghost";
import {
  extractBillableEventsFromLog,
  MOCK_COMMUNICATION_LOG,
} from "../../../lib/wrappers/professional/docket-extraction";

interface Props {
  professionalId: string;
}

export default function BillingModule({ professionalId }: Props) {
  const [log, setLog] = useState(MOCK_COMMUNICATION_LOG);
  const [events, setEvents] = useState<ReturnType<typeof extractBillableEventsFromLog>>([]);
  const [pkg, setPkg] = useState<AccountantPackage>("fixed_fee_tax");
  const [invoice, setInvoice] = useState<string | null>(null);

  function runExtraction() {
    const extracted = extractBillableEventsFromLog(professionalId, log);
    setEvents(extracted);
    fetch("/api/professional/billable", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ events: extracted }),
    }).then(() => {
      window.dispatchEvent(new CustomEvent("prospine-billable-updated"));
    });
  }

  function generateInvoice() {
    const inv = invoiceFromPackage("entity-ghost-demo", pkg);
    setInvoice(JSON.stringify(inv, null, 2));
  }

  const docketCents = billableEventsToDocketTotal(events, 22000);

  return (
    <div className="pro-wrap pro-panel">
      <div className="ghost-badge">100% professional retention</div>
      <h3>Analista · time recovery</h3>
      <label>
        Communication log
        <textarea
          value={log}
          onChange={(e) => setLog(e.target.value)}
          rows={4}
          style={{
            width: "100%",
            background: "#0a0a0a",
            border: "1px solid #2a2a2a",
            color: "#f5f5f5",
            fontFamily: "monospace",
            fontSize: "0.8rem",
          }}
        />
      </label>
      <button type="button" onClick={runExtraction}>
        Extract billable events
      </button>
      {events.length > 0 && (
        <p className="pro-msg">
          {events.length} events · {events.reduce((s, e) => s + e.durationMinutes, 0)} min · est. $
          {(docketCents / 100).toFixed(2)} CAD @ $220/hr
        </p>
      )}
      <hr style={{ borderColor: "#2a2a2a", margin: "1rem 0" }} />
      <label>
        Package template
        <select value={pkg} onChange={(e) => setPkg(e.target.value as AccountantPackage)}>
          {Object.entries(ACCOUNTANT_PACKAGES).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label} — ${(v.amountCents / 100).toFixed(0)}
            </option>
          ))}
        </select>
      </label>
      <button type="button" onClick={generateInvoice}>
        Generate Ghost invoice
      </button>
      {invoice && (
        <pre className="pro-msg" style={{ overflow: "auto", maxHeight: "12rem" }}>
          {invoice}
        </pre>
      )}
    </div>
  );
}
