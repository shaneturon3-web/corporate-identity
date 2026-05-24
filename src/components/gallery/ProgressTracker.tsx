interface Props {
  label: string;
  progressPct: number;
  sublabel?: string;
  highlight?: boolean;
}

/** Restrained dark · matte silver progress — Order 024 */
export default function ProgressTracker({ label, progressPct, sublabel, highlight }: Props) {
  const pct = Math.min(100, Math.max(0, progressPct));
  return (
    <div className={`gam-track${highlight ? " gam-track--highlight" : ""}`}>
      <div className="gam-track-head">
        <span className="gam-track-label">{label}</span>
        <span className="gam-track-pct">{pct}%</span>
      </div>
      <div className="gam-track-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="gam-track-fill" style={{ width: `${pct}%` }} />
      </div>
      {sublabel ? <p className="gam-track-sub">{sublabel}</p> : null}
      <style>{`
        .gam-track { margin: 0.75rem 0; }
        .gam-track-head {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #94a3b8;
          margin-bottom: 0.35rem;
        }
        .gam-track-label { font-weight: 500; color: #cbd5e1; }
        .gam-track-pct { font-variant-numeric: tabular-nums; }
        .gam-track-bar {
          height: 6px;
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 2px;
          overflow: hidden;
        }
        .gam-track-fill {
          height: 100%;
          background: linear-gradient(90deg, #64748b 0%, #94a3b8 55%, #cbd5e1 100%);
          transition: width 0.35s ease;
        }
        .gam-track--highlight .gam-track-fill {
          background: linear-gradient(90deg, #475569 0%, #94a3b8 40%, #e2e8f0 100%);
        }
        .gam-track-sub {
          margin: 0.35rem 0 0;
          font-size: 0.75rem;
          color: #64748b;
        }
      `}</style>
    </div>
  );
}
