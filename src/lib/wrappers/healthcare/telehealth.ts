export type VideoProvider = "zoom" | "daily";

export interface VirtualRoomRequest {
  sessionId: string;
  professionalId: string;
  entityId: string;
  provider: VideoProvider;
  durationMinutes: number;
}

export interface VirtualRoom {
  roomId: string;
  joinUrlProfessional: string;
  joinUrlClient: string;
  expiresAt: string;
  provider: VideoProvider;
}

/** Provision low-friction secure video (provider SDK called at integration boundary). */
export function provisionVirtualRoom(req: VirtualRoomRequest): VirtualRoom {
  const expiresAt = new Date(Date.now() + req.durationMinutes * 60_000).toISOString();
  const base =
    req.provider === "daily"
      ? `https://psynova.daily.co/${req.sessionId}`
      : `https://zoom.us/j/${req.sessionId}`;
  return {
    roomId: `room-${req.sessionId}`,
    joinUrlProfessional: `${base}?role=host`,
    joinUrlClient: `${base}?role=participant`,
    expiresAt,
    provider: req.provider,
  };
}
