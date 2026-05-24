import type { BillableEvent, ExtractionSource } from "./types";

export interface CommunicationLogLine {
  source: ExtractionSource;
  subject: string;
  durationMinutes: number;
  clientHint?: string;
  timestamp: string;
}

/** "Analista" text-to-docket — parse mock communication metadata into billable events. */
export function extractBillableEventsFromLog(
  professionalId: string,
  logText: string,
): BillableEvent[] {
  const lines = logText.split("\n").map((l) => l.trim()).filter(Boolean);
  const events: BillableEvent[] = [];

  for (const line of lines) {
    const parsed = parseLogLine(line);
    if (!parsed) continue;
    events.push({
      eventId: `evt-${crypto.randomUUID()}`,
      professionalId,
      clientId: parsed.clientHint,
      durationMinutes: parsed.durationMinutes,
      extractionSource: parsed.source,
      description: parsed.subject,
      amountCents: undefined,
      invoiced: false,
      createdAt: parsed.timestamp || new Date().toISOString(),
    });
  }
  return events;
}

function parseLogLine(line: string): CommunicationLogLine | null {
  const email = line.match(/^\[email\]\s+(\d+)m\s+(.+?)(?:\s+@client:(\S+))?$/i);
  if (email) {
    return {
      source: "email",
      durationMinutes: Number(email[1]),
      subject: email[2],
      clientHint: email[3],
      timestamp: new Date().toISOString(),
    };
  }
  const call = line.match(/^\[call\]\s+(\d+)m\s+(.+?)(?:\s+@client:(\S+))?$/i);
  if (call) {
    return {
      source: "call",
      durationMinutes: Number(call[1]),
      subject: call[2],
      clientHint: call[3],
      timestamp: new Date().toISOString(),
    };
  }
  return null;
}

export const MOCK_COMMUNICATION_LOG = `[email] 12m T4 clarification thread @client:cli-001
[call] 25m Year-end planning review @client:cli-002
[email] 8m Receipt categorization follow-up @client:cli-001`;
