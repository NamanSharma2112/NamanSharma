"use client";

/**
 * A cat drawn in neon: each stroke lights up along its own length, holds, then
 * gets pulled away by the tail.
 *
 * The trick is the one from yui540's post — animate `stroke-dasharray` from
 * nothing to the full length to draw a line on, then run `stroke-dashoffset`
 * out to minus that length to clear it, with a `drop-shadow` doing the glow.
 * Every path here declares `pathLength="1"`, so one set of keyframes covers
 * strokes of any real length.
 */

type Stroke = { d: string; delay: number; color: string };

const CAT: Stroke[] = [
  // Small ears on a round head — the proportions do most of the work.
  { d: "M31 48 L38 26 L54 39", delay: 0, color: "#6bff9e" },
  { d: "M89 48 L82 26 L66 39", delay: 0.1, color: "#6bff9e" },
  { d: "M31 48 C 25 70, 38 94, 60 94 C 82 94, 95 70, 89 48", delay: 0.2, color: "#6bff9e" },
  // Eyes shut and smiling.
  { d: "M43 62 Q 49 54, 55 62", delay: 0.56, color: "#ffe066" },
  { d: "M65 62 Q 71 54, 77 62", delay: 0.62, color: "#ffe066" },
  // A dot of a nose over a small ω of a mouth.
  { d: "M57 70 L63 70 L60 74 Z", delay: 0.72, color: "#ff8fc7" },
  { d: "M54 78 Q 57 82, 60 78 Q 63 82, 66 78", delay: 0.78, color: "#ff8fc7" },
  // Blush.
  { d: "M36 72 Q 40 76, 44 72", delay: 0.86, color: "#ff5fa2" },
  { d: "M76 72 Q 80 76, 84 72", delay: 0.9, color: "#ff5fa2" },
  // Short whiskers, kept close so the face stays round.
  { d: "M30 66 L17 63", delay: 0.98, color: "#8ab4ff" },
  { d: "M30 73 L17 76", delay: 1.02, color: "#8ab4ff" },
  { d: "M90 66 L103 63", delay: 0.98, color: "#8ab4ff" },
  { d: "M90 73 L103 76", delay: 1.02, color: "#8ab4ff" },
  // Two little paws tucked under.
  { d: "M47 93 Q 51 98, 55 93", delay: 1.1, color: "#6bff9e" },
  { d: "M65 93 Q 69 98, 73 93", delay: 1.14, color: "#6bff9e" },
  // A tail curled up behind.
  { d: "M89 84 C 105 88, 112 70, 100 62", delay: 1.2, color: "#c77dff" },
];

/** Seconds for one draw, hold and wipe. */
const CYCLE = 3.6;

export default function NeonCat({
  size = 150,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div className={className} aria-hidden>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {CAT.map((stroke, i) => (
          <path
            key={i}
            d={stroke.d}
            pathLength={1}
            stroke={stroke.color}
            strokeWidth={2.4}
            className="neon-stroke"
            style={{
              filter: `drop-shadow(0 0 6px ${stroke.color}) drop-shadow(0 0 14px ${stroke.color})`,
              animationDelay: `${stroke.delay}s`,
            }}
          />
        ))}
      </svg>

    </div>
  );
}
