/** Wellness Gateway — anonymous group participation (Order 026). */

export interface AnonymousParticipant {
  participantId: string;
  nickname: string;
  joinedAt: string;
}

const NICKNAME_POOL = [
  "River",
  "Cedar",
  "Aurora",
  "Summit",
  "Harbor",
  "Meadow",
  "Northlight",
  "Ember",
];

export function assignAnonymousNickname(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const idx = Math.abs(h) % NICKNAME_POOL.length;
  return NICKNAME_POOL[idx];
}

export function createAnonymousParticipant(sessionId: string): AnonymousParticipant {
  const participantId = `anon-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    participantId,
    nickname: assignAnonymousNickname(`${sessionId}:${participantId}`),
    joinedAt: new Date().toISOString(),
  };
}

export interface GroupWellnessSession {
  sessionId: string;
  lightShieldCompliant: boolean;
  participants: AnonymousParticipant[];
}

export function createGroupWellnessSession(sessionId: string): GroupWellnessSession {
  return {
    sessionId,
    lightShieldCompliant: true,
    participants: [],
  };
}
