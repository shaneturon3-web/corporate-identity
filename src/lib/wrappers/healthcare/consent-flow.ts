import type { AuditLogEntry, ConsentType } from "./types";

export interface ConsentRecord {
  id: string;
  entityId: string;
  consentType: ConsentType;
  signedAt: string;
  signerName: string;
  signaturePayload: string;
  ipAddress: string;
  locale: string;
  auditTrail: AuditLogEntry[];
}

export interface TelehealthConsentInput {
  entityId: string;
  signerName: string;
  signaturePayload: string;
  ipAddress: string;
  acceptedTermsVersion: string;
}

function hashSignature(payload: string): string {
  let h = 0;
  for (let i = 0; i < payload.length; i++) {
    h = (Math.imul(31, h) + payload.charCodeAt(i)) | 0;
  }
  return `sig-${(h >>> 0).toString(16)}`;
}

/** Automated clinical telehealth consent with timestamped audit log. */
export function recordTelehealthConsent(input: TelehealthConsentInput): ConsentRecord {
  const signedAt = new Date().toISOString();
  const audit: AuditLogEntry = {
    id: `audit-${crypto.randomUUID()}`,
    actorId: input.entityId,
    action: "consent_signed",
    resourceType: "telehealth_consent",
    resourceId: input.entityId,
    zone: "zone3_clinical",
    createdAt: signedAt,
    signatureHash: hashSignature(input.signaturePayload),
  };

  return {
    id: `consent-${crypto.randomUUID()}`,
    entityId: input.entityId,
    consentType: "telehealth",
    signedAt,
    signerName: input.signerName,
    signaturePayload: input.signaturePayload,
    ipAddress: input.ipAddress,
    locale: "fr-CA",
    auditTrail: [audit],
  };
}

export function hasValidTelehealthConsent(
  records: ConsentRecord[],
  entityId: string,
): boolean {
  return records.some(
    (r) => r.entityId === entityId && r.consentType === "telehealth" && r.signaturePayload.length > 0,
  );
}
