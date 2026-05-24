import type { AccessZone } from "./types";

export type ClinicalResource =
  | "billing_metadata"
  | "schedule_slot"
  | "clinical_note"
  | "session_summary"
  | "intake_answers";

const ZONE_PERMISSIONS: Record<AccessZone, Set<ClinicalResource>> = {
  zone1_admin: new Set(["billing_metadata", "schedule_slot"]),
  zone2_operations: new Set(["billing_metadata", "schedule_slot", "intake_answers"]),
  zone3_clinical: new Set([
    "billing_metadata",
    "schedule_slot",
    "intake_answers",
    "clinical_note",
    "session_summary",
  ]),
};

export interface AccessRequest {
  role: AccessZone;
  resource: ClinicalResource;
  professionalLicenseId?: string;
  resourceOwnerLicenseId?: string;
}

/** Zone 3: only licensed professional accesses clinical notes/summaries. */
export function canAccess(req: AccessRequest): boolean {
  const allowed = ZONE_PERMISSIONS[req.role];
  if (!allowed.has(req.resource)) return false;

  if (req.resource === "clinical_note" || req.resource === "session_summary") {
    if (req.role !== "zone3_clinical") return false;
    if (!req.professionalLicenseId) return false;
    if (
      req.resourceOwnerLicenseId &&
      req.professionalLicenseId !== req.resourceOwnerLicenseId
    ) {
      return false;
    }
  }
  return true;
}

export function redactForZone<T extends Record<string, unknown>>(
  payload: T,
  role: AccessZone,
): Partial<T> {
  if (role === "zone3_clinical") return payload;
  const safe: Partial<T> = { ...payload };
  for (const key of Object.keys(safe) as (keyof T)[]) {
    if (
      String(key).includes("clinical") ||
      String(key).includes("note") ||
      String(key).includes("summary")
    ) {
      delete safe[key];
    }
  }
  return safe;
}
