import { generateInvoiceFromLedger } from "../../spine/billing/invoice-gen";
import { createLedgerEntry } from "../../spine/billing/ledger-engine";
import type { BillableEvent } from "./types";

/** Ghost Mode: 100% professional retention (no clinic split). */
export const GHOST_REVENUE_SPLIT = { operatorPct: 0, professionalPct: 100 };

export type AccountantPackage = "fixed_fee_tax" | "monthly_advisory";

export interface PackageQuote {
  packageType: AccountantPackage;
  label: string;
  amountCents: number;
}

export const ACCOUNTANT_PACKAGES: Record<AccountantPackage, PackageQuote> = {
  fixed_fee_tax: {
    packageType: "fixed_fee_tax",
    label: "Fixed-Fee Tax Package",
    amountCents: 85000,
  },
  monthly_advisory: {
    packageType: "monthly_advisory",
    label: "Monthly Advisory Retainer",
    amountCents: 45000,
  },
};

export function invoiceFromPackage(
  entityId: string,
  pkg: AccountantPackage,
): ReturnType<typeof generateInvoiceFromLedger> {
  const quote = ACCOUNTANT_PACKAGES[pkg];
  const entry = createLedgerEntry({
    entityId,
    amountCents: quote.amountCents,
    currency: "CAD",
    split: GHOST_REVENUE_SPLIT,
    invoiceRef: `PRO-${pkg}`,
    metadata: { ghostMode: true, package: pkg },
  });
  return generateInvoiceFromLedger(
    entry,
    [{ description: quote.label, amountCents: quote.amountCents }],
  );
}

export function billableEventsToDocketTotal(events: BillableEvent[], ratePerHourCents: number): number {
  const minutes = events.reduce((s, e) => s + e.durationMinutes, 0);
  return Math.round((minutes / 60) * ratePerHourCents);
}
