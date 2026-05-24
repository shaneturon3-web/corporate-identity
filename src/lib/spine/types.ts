/** Shared CoreSpine types — vertical-agnostic. */

export type ProjectStatus = "NOW" | "PILOT" | "FUTURE";

export type LifecycleStatus = "lead" | "active" | "inactive" | "archived";

export type SessionType = "video" | "phone" | "in_person";

export type IntakeChannel = "web" | "referral" | "api" | "manual";

export interface SpineEntity {
  id: string;
  vertical: string;
  lifecycleStatus: LifecycleStatus;
  displayName?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface RevenueSplit {
  operatorPct: number;
  professionalPct: number;
}

export const DEFAULT_REVENUE_SPLIT: RevenueSplit = {
  operatorPct: 33,
  professionalPct: 67,
};
