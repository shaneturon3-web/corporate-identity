/** Secret holding logic — Order 023 (BACKEND_ADMIN only surfaces). */

export interface CompensationLine {
  key: string;
  label: string;
  basis: "revenue_pct" | "flat_fee" | "referral_pct";
  rate: number;
  notes?: string;
}

export interface AssociateHoldingsSnapshot {
  associateId: string;
  period: string;
  administratorShareCents: number;
  leadFeesCents: number;
  referralCommissionsCents: number;
  netToAssociateCents: number;
  lines: CompensationLine[];
}

export const DEFAULT_COMPENSATION_LINES: CompensationLine[] = [
  {
    key: "administrator_share",
    label: "Administrator Share",
    basis: "revenue_pct",
    rate: 0.12,
    notes: "Platform operations & compliance overhead",
  },
  {
    key: "lead_fees",
    label: "Lead Fees",
    basis: "flat_fee",
    rate: 15000,
    notes: "Per qualified lead routed to associate (cents)",
  },
  {
    key: "referral_commissions",
    label: "Referral Commissions",
    basis: "referral_pct",
    rate: 0.08,
    notes: "Downstream professional referrals",
  },
];

export function computeAssociateHoldings(
  grossRevenueCents: number,
  leadCount: number,
  referralRevenueCents: number,
  associateId = "assoc-demo",
  period = new Date().toISOString().slice(0, 7),
): AssociateHoldingsSnapshot {
  const adminPct = DEFAULT_COMPENSATION_LINES[0].rate;
  const leadFee = DEFAULT_COMPENSATION_LINES[1].rate;
  const referralPct = DEFAULT_COMPENSATION_LINES[2].rate;

  const administratorShareCents = Math.round(grossRevenueCents * adminPct);
  const leadFeesCents = leadCount * leadFee;
  const referralCommissionsCents = Math.round(referralRevenueCents * referralPct);
  const deductions = administratorShareCents + leadFeesCents + referralCommissionsCents;

  return {
    associateId,
    period,
    administratorShareCents,
    leadFeesCents,
    referralCommissionsCents,
    netToAssociateCents: Math.max(0, grossRevenueCents - deductions),
    lines: DEFAULT_COMPENSATION_LINES,
  };
}
