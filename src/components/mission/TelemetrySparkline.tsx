/** Miniature heartbeat chart (Order 044) — CSS-driven bars, no chart lib. */
interface Props {
  seed?: number;
  className?: string;
}

export default function TelemetrySparkline({ seed = 1, className = "" }: Props) {
  const bars = Array.from({ length: 12 }, (_, i) => {
    const h = 20 + ((seed * (i + 3) * 17) % 70);
    const delay = (i * 0.08).toFixed(2);
    return { h, delay };
  });

  return (
    <svg
      className={className}
      viewBox="0 0 48 32"
      width={48}
      height={32}
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {bars.map((b, i) => (
        <rect
          key={i}
          x={i * 4}
          y={32 - (b.h / 100) * 28}
          width={3}
          height={(b.h / 100) * 28}
          fill="rgba(52, 211, 153, 0.85)"
          style={{
            animation: `heartbeat-bar 1.4s ease-in-out ${b.delay}s infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes heartbeat-bar {
          from { opacity: 0.45; }
          to { opacity: 1; }
        }
      `}</style>
    </svg>
  );
}
