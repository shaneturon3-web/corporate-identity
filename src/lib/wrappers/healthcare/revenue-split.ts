import { createLedgerEntry, type LedgerEntry } from "../../spine/billing/ledger-engine";
import type { RevenueSplit } from "../../spine/types";

/** PsyNova Brand Mode: 33% Clinic / 67% Therapist (same ratio as CoreSpine default). */
export const PSYNOVA_REVENUE_SPLIT: RevenueSplit = {
  operatorPct: 33,
  professionalPct: 67,
};

export interface PsyNovaLedgerLine {
  clinicShareCents: number;
  therapistShareCents: number;
  entry: LedgerEntry;
}

export function recordSessionRevenue(
  entityId: string,
  amountCents: number,
  sessionRef: string,
): PsyNovaLedgerLine {
  const entry = createLedgerEntry({
    entityId,
    amountCents,
    currency: "CAD",
    split: PSYNOVA_REVENUE_SPLIT,
    invoiceRef: `PSY-${sessionRef}`,
    metadata: { vertical: "healthcare", brandMode: true },
  });
  return {
    clinicShareCents: entry.operatorShareCents,
    therapistShareCents: entry.professionalShareCents,
    entry,
  };
}
