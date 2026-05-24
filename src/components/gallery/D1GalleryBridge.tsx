import { useEffect, useState } from "react";
import type { Role } from "../../lib/auth/roles";
import type { ProjectStatus } from "../../lib/spine/types";

interface ApiCard {
  slug: string;
  title: string;
  tagline: string;
  status: ProjectStatus;
  layer: 1 | 2 | 3;
  category?: string;
  architecture: string[];
  href: string;
  source: "content" | "d1";
}

interface Props {
  role: Role;
  excludeSlugs: string[];
}

const LAYER_LABELS: Record<number, string> = {
  1: "Layer 1 — Core",
  2: "Layer 2 — Wrapper",
  3: "Layer 3 — Perimeter",
};

export default function D1GalleryBridge({ role, excludeSlugs }: Props) {
  const [cards, setCards] = useState<ApiCard[]>([]);

  useEffect(() => {
    fetch(`/api/gallery/projects?role=${role}`)
      .then((r) => r.json())
      .then((d) => {
        const list = (d.cards ?? []) as ApiCard[];
        setCards(list.filter((c) => c.source === "d1" && !excludeSlugs.includes(c.slug)));
      })
      .catch(() => setCards([]));
  }, [role, excludeSlugs.join(",")]);

  if (cards.length === 0) return null;

  return (
    <>
      {cards.map((c) => (
        <article key={c.slug} className="project-card d1-card">
          <header className="card-head">
            <div className="icon-node" aria-hidden="true" />
            <div className="card-badges">
              <span className="layer-badge">{LAYER_LABELS[c.layer] ?? "Layer 2"}</span>
              <span className="status-badge status-pilot">{c.status}</span>
              {c.category ? <span className="layer-badge">{c.category}</span> : null}
              <span className="layer-badge">D1 live</span>
            </div>
          </header>
          <h3 className="card-title">
            <a href={c.href}>{c.title}</a>
          </h3>
          <p className="card-tagline">{c.tagline}</p>
          <ul className="card-arch">
            {c.architecture.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <a className="card-cta" href={c.href}>
            View case file →
          </a>
        </article>
      ))}
      <style>{`
        .d1-card {
          background: var(--surface, #1a1a1a);
          border: 1px solid var(--border, #2a2a2a);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .card-head { display: flex; justify-content: space-between; align-items: flex-start; }
        .card-badges { display: flex; flex-direction: column; align-items: flex-end; gap: 0.35rem; }
        .layer-badge {
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #94a3b8;
          border: 1px solid #2a2a2a;
          padding: 0.15rem 0.4rem;
          border-radius: 2px;
        }
        .status-badge {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 0.2rem 0.45rem;
          border-radius: 2px;
        }
        .status-pilot { color: #38bdf8; border: 1px solid #38bdf8; }
        .icon-node {
          width: 2rem;
          height: 2rem;
          border: 2px solid #94a3b8;
          border-radius: 4px;
          transform: rotate(45deg);
          opacity: 0.7;
        }
        .card-title { margin: 0; font-size: 1.1rem; font-weight: 600; }
        .card-title a { color: #f5f5f5; text-decoration: none; }
        .card-tagline { margin: 0; color: #94a3b8; font-size: 0.9rem; }
        .card-arch {
          margin: 0;
          padding-left: 1.1rem;
          color: #cbd5e1;
          font-size: 0.8rem;
          flex: 1;
        }
        .card-cta { color: #e2e8f0; font-size: 0.85rem; text-decoration: none; }
      `}</style>
    </>
  );
}
