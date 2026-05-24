import type { AuditLogEntry } from "./types";

/** Quebec Law 25 + PIPEDA residency and transfer checks. */
export const QUEBEC_ALLOWED_REGIONS = ["ca-central-1", "ca-east", "QC", "CA-QC"] as const;

export interface DataResidencyContext {
  storageRegion: string;
  processingRegion: string;
  containsPhi: boolean;
}

export interface Law25ValidationResult {
  ok: boolean;
  violations: string[];
  requiresExplicitConsent: boolean;
}

export function validateQuebecResidency(ctx: DataResidencyContext): Law25ValidationResult {
  const violations: string[] = [];
  const storageOk = QUEBEC_ALLOWED_REGIONS.some((r) =>
    ctx.storageRegion.toUpperCase().includes(r.replace("CA-", "")),
  );
  const processingOk =
    ctx.processingRegion === ctx.storageRegion ||
    QUEBEC_ALLOWED_REGIONS.some((r) => ctx.processingRegion.toUpperCase().includes(r));

  if (!storageOk) violations.push("storage_outside_quebec_perimeter");
  if (!processingOk) violations.push("processing_region_mismatch");

  return {
    ok: violations.length === 0,
    violations,
    requiresExplicitConsent: ctx.containsPhi && !storageOk,
  };
}

export function assertLaw25OrThrow(ctx: DataResidencyContext): void {
  const result = validateQuebecResidency(ctx);
  if (!result.ok) {
    throw new Error(`Law25 violation: ${result.violations.join(", ")}`);
  }
}

export function logComplianceCheck(
  actorId: string,
  resourceId: string,
  result: Law25ValidationResult,
): AuditLogEntry {
  return {
    id: `audit-${crypto.randomUUID()}`,
    actorId,
    action: result.ok ? "law25_pass" : "law25_block",
    resourceType: "data_residency",
    resourceId,
    zone: "zone2_operations",
    ipRegion: "CA-QC",
    createdAt: new Date().toISOString(),
    signatureHash: undefined,
  };
}
