/** PsyNova healthcare wrapper — regulated vertical types. */

export type AccessZone = "zone1_admin" | "zone2_operations" | "zone3_clinical";

export type ConsentType = "telehealth" | "pipeda_collection" | "law25_cross_border";

export type LeadChannel = "facebook" | "whatsapp" | "web" | "referral";

export type ReferralDiscipline =
  | "psychologist"
  | "coach"
  | "social_worker"
  | "yoga_instructor";

export type ClinicalNoteKind = "intake" | "assessment" | "follow_up" | "summary";

export interface AuditLogEntry {
  id: string;
  actorId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  zone: AccessZone;
  ipRegion?: string;
  createdAt: string;
  signatureHash?: string;
}
