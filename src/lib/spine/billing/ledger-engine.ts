import { DEFAULT_REVENUE_SPLIT, type RevenueSplit } from "../types";

export interface LedgerEntryInput {
  entityId: string;
  amountCents: number;
  currency?: string;
  split?: RevenueSplit;
  invoiceRef?: string;
  metadata?: Record<string, unknown>;
}

export interface LedgerEntry {
  id: string;
  entityId: string;
  amountCents: number;
  currency: string;
  operatorShareCents: number;
  professionalShareCents: number;
  status: "pending" | "paid" | "failed";
  invoiceRef?: string;
  createdAt: string;
}

function id(): string {
  return `led-${crypto.randomUUID()}`;
}

/** Core transactional ledger with configurable revenue split. */
export function createLedgerEntry(input: LedgerEntryInput): LedgerEntry {
  const split = input.split ?? DEFAULT_REVENUE_SPLIT;
  const total = split.operatorPct + split.professionalPct;
  if (total !== 100) {
    throw new Error(`Revenue split must sum to 100, got ${total}`);
  }
  const operatorShareCents = Math.round((input.amountCents * split.operatorPct) / 100);
  const professionalShareCents = input.amountCents - operatorShareCents;
  return {
    id: id(),
    entityId: input.entityId,
    amountCents: input.amountCents,
    currency: input.currency ?? "CAD",
    operatorShareCents,
    professionalShareCents,
    status: "pending",
    invoiceRef: input.invoiceRef,
    createdAt: new Date().toISOString(),
  };
}

export function markLedgerPaid(entry: LedgerEntry): LedgerEntry {
  return { ...entry, status: "paid" };
}
