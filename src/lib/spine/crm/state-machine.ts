import type { LifecycleStatus } from "../types";

export type TransitionActor = "operator" | "system" | "bridge";

export interface StateTransition {
  from: LifecycleStatus | "*";
  to: LifecycleStatus;
  event: string;
}

/** Control Tower Lite — entity lifecycle (vertical-agnostic labels). */
export const SPINE_TRANSITIONS: StateTransition[] = [
  { from: "lead", to: "active", event: "intake_complete" },
  { from: "lead", to: "inactive", event: "lead_disqualified" },
  { from: "active", to: "inactive", event: "case_closed" },
  { from: "active", to: "archived", event: "retention_expired" },
  { from: "inactive", to: "active", event: "re_engaged" },
  { from: "*", to: "archived", event: "gdpr_erasure" },
];

export function canTransition(
  current: LifecycleStatus,
  target: LifecycleStatus,
  event: string,
): boolean {
  return SPINE_TRANSITIONS.some(
    (t) =>
      t.event === event &&
      t.to === target &&
      (t.from === current || t.from === "*"),
  );
}

export function applyTransition(
  current: LifecycleStatus,
  event: string,
): { ok: true; next: LifecycleStatus } | { ok: false; reason: string } {
  const rule = SPINE_TRANSITIONS.find(
    (t) => t.event === event && (t.from === current || t.from === "*"),
  );
  if (!rule) {
    return { ok: false, reason: `No transition for ${current} + ${event}` };
  }
  return { ok: true, next: rule.to };
}
