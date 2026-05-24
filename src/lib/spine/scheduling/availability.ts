import type { SessionType } from "../types";

export interface AvailabilityWindow {
  professionalId: string;
  dayOfWeek: number;
  startMinute: number;
  endMinute: number;
  sessionTypes: SessionType[];
}

export interface SlotCandidate {
  id: string;
  professionalId: string;
  sessionType: SessionType;
  startsAt: string;
  endsAt: string;
}

/** Generate open slots from weekly windows (headless — no UI). */
export function expandAvailability(
  windows: AvailabilityWindow[],
  rangeStart: Date,
  rangeEnd: Date,
  slotMinutes: number,
): SlotCandidate[] {
  const slots: SlotCandidate[] = [];
  const cursor = new Date(rangeStart);
  while (cursor <= rangeEnd) {
    const dow = cursor.getUTCDay();
    for (const w of windows) {
      if (w.dayOfWeek !== dow) continue;
      const dayStart = new Date(cursor);
      dayStart.setUTCHours(0, w.startMinute, 0, 0);
      const dayEnd = new Date(cursor);
      dayEnd.setUTCHours(0, w.endMinute, 0, 0);
      let t = dayStart.getTime();
      while (t + slotMinutes * 60_000 <= dayEnd.getTime()) {
        const start = new Date(t);
        const end = new Date(t + slotMinutes * 60_000);
        for (const sessionType of w.sessionTypes) {
          slots.push({
            id: `${w.professionalId}-${start.toISOString()}-${sessionType}`,
            professionalId: w.professionalId,
            sessionType,
            startsAt: start.toISOString(),
            endsAt: end.toISOString(),
          });
        }
        t += slotMinutes * 60_000;
      }
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return slots;
}
