import { applyTransition, canTransition, type TransitionActor } from "../crm/state-machine";
import type { LifecycleStatus } from "../types";

export interface OrchestrationEvent {
  entityId: string;
  fromStatus: LifecycleStatus;
  toStatus: LifecycleStatus;
  event: string;
  actor: TransitionActor;
  note?: string;
  createdAt: string;
}

export function recordTransition(
  entityId: string,
  current: LifecycleStatus,
  event: string,
  actor: TransitionActor,
  note?: string,
): OrchestrationEvent | { error: string } {
  const result = applyTransition(current, event);
  if (!result.ok) return { error: result.reason };
  return {
    entityId,
    fromStatus: current,
    toStatus: result.next,
    event,
    actor,
    note,
    createdAt: new Date().toISOString(),
  };
}

export { canTransition, applyTransition };
