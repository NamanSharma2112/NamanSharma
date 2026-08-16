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
  // Ears and head.
  { d: "M22 46 L30 22 L47 36", delay: 0, color: "#6bff9e" },
  { d: "M98 46 L90 22 L73 36", delay: 0.12, color: "#6bff9e" },
  { d: "M22 46 C 14 66, 20 88, 40 96 C 55 102, 65 102, 80 96 C 100 88, 106 66, 98 46", delay: 0.24, color: "#6bff9e" },
  // Eyes.
  { d: "M40 60 C 44 55, 50 55, 54 60", delay: 0.6, color: "#ffab02" },
  { d: "M66 60 C 70 55, 76 55, 80 60", delay: 0.68, color: "#ffab02" },
  // Nose and mouth.
  { d: "M60 71 L56 75 L60 78 L64 75 Z", delay: 0.78, color: "#ff5fa2" },
  { d: "M60 78 C 60 86, 52 86, 50 81", delay: 0.86, color: "#ff5fa2" },
  { d: "M60 78 C 60 86, 68 86, 70 81", delay: 0.92, color: "#ff5fa2" },
  // Whiskers.
  { d: "M36 70 L14 66", delay: 1.0, color: "#8ab4ff" },
  { d: "M36 76 L15 78", delay: 1.06, color: "#8ab4ff" },
  { d: "M84 70 L106 66", delay: 1.0, color: "#8ab4ff" },
  { d: "M84 76 L105 78", delay: 1.06, color: "#8ab4ff" },
  // Tail.
  { d: "M98 92 C 118 92, 122 70, 110 62", delay: 1.16, color: "#c77dff" },
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

      <style>{`
        .neon-stroke {
          stroke-dasharray: 0 1;
          stroke-dashoffset: 0;
          opacity: 0;
          animation: neon-cycle ${CYCLE}s ease-in-out infinite;
        }

        /* Draw on, hold, then pull the stroke off by its own length. */
        @keyframes neon-cycle {
          0%   { stroke-dasharray: 0 1;  stroke-dashoffset: 0;  opacity: 0; }
          6%   { opacity: 1; }
          30%  { stroke-dasharray: 1 1;  stroke-dashoffset: 0;  opacity: 1; }
          58%  { stroke-dasharray: 1 1;  stroke-dashoffset: 0;  opacity: 1; }
          92%  { stroke-dasharray: 1 1;  stroke-dashoffset: -1; opacity: 1; }
          100% { stroke-dasharray: 1 1;  stroke-dashoffset: -1; opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .neon-stroke {
            animation: none;
            stroke-dasharray: 1 1;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
