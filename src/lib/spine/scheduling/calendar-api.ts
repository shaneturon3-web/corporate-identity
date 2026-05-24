import type { SessionType } from "../types";
import { expandAvailability, type AvailabilityWindow, type SlotCandidate } from "./availability";

export interface BookSlotInput {
  professionalId: string;
  entityId: string;
  sessionType: SessionType;
  startsAt: string;
  endsAt: string;
  timezone?: string;
}

export interface BookSlotResult {
  slotId: string;
  status: "reserved" | "conflict";
}

/** Headless scheduling API surface (D1 persistence via Pages Functions). */
export class CalendarApi {
  constructor(private readonly windows: AvailabilityWindow[]) {}

  listOpenSlots(rangeStart: Date, rangeEnd: Date, slotMinutes = 50): SlotCandidate[] {
    return expandAvailability(this.windows, rangeStart, rangeEnd, slotMinutes);
  }

  reserveSlot(input: BookSlotInput, existingStarts: string[]): BookSlotResult {
    const conflict = existingStarts.includes(input.startsAt);
    if (conflict) {
      return { slotId: "", status: "conflict" };
    }
    const slotId = `slot-${input.professionalId}-${input.startsAt}`;
    return { slotId, status: "reserved" };
  }
}
