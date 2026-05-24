import { useState } from "react";
import {
  assignAnonymousNickname,
  createGroupWellnessSession,
  type AnonymousParticipant,
} from "../../../lib/wrappers/wellness/telehealth-anonymous";

export default function WellnessTelehealth() {
  const [session] = useState(() => createGroupWellnessSession("wellness-demo"));
  const [participants, setParticipants] = useState<AnonymousParticipant[]>([]);

  function joinGroup() {
    const nick = assignAnonymousNickname(`${session.sessionId}:${Date.now()}`);
    setParticipants((prev) => [
      ...prev,
      {
        participantId: `anon-${prev.length + 1}`,
        nickname: nick,
        joinedAt: new Date().toISOString(),
      },
    ]);
  }

  return (
    <div className="wellness-tel">
      <h4>Group wellness · anonymous</h4>
      <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
        Light Shield — nicknames only; no legal name in session roster.
      </p>
      <button type="button" onClick={joinGroup} className="wellness-join">
        Join session (nickname)
      </button>
      <ul>
        {participants.map((p) => (
          <li key={p.participantId}>
            {p.nickname} <span style={{ color: "#64748b" }}>· joined</span>
          </li>
        ))}
      </ul>
      <style>{`
        .wellness-tel { border: 1px solid #2a2a2a; padding: 1rem; background: #1a1a1a; }
        .wellness-join {
          margin: 0.75rem 0;
          background: transparent;
          border: 1px solid #94a3b8;
          color: #e2e8f0;
          padding: 0.4rem 0.75rem;
          cursor: pointer;
          font-size: 0.85rem;
        }
        .wellness-tel ul { margin: 0; padding-left: 1.1rem; color: #cbd5e1; }
      `}</style>
    </div>
  );
}
