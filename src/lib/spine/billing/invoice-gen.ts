import type { LedgerEntry } from "./ledger-engine";

export interface InvoiceLine {
  description: string;
  amountCents: number;
}

export interface InvoiceDocument {
  invoiceRef: string;
  entityId: string;
  issuedAt: string;
  currency: string;
  lines: InvoiceLine[];
  totalCents: number;
  operatorShareCents: number;
  professionalShareCents: number;
}

export function generateInvoiceFromLedger(entry: LedgerEntry, lines?: InvoiceLine[]): InvoiceDocument {
  const invoiceRef = entry.invoiceRef ?? `INV-${entry.id}`;
  const defaultLines: InvoiceLine[] = lines ?? [
    { description: "Professional session", amountCents: entry.amountCents },
  ];
  const totalCents = defaultLines.reduce((s, l) => s + l.amountCents, 0);
  return {
    invoiceRef,
    entityId: entry.entityId,
    issuedAt: new Date().toISOString(),
    currency: entry.currency,
    lines: defaultLines,
    totalCents,
    operatorShareCents: entry.operatorShareCents,
    professionalShareCents: entry.professionalShareCents,
  };
}
