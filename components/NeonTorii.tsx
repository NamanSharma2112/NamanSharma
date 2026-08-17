"use client";

/**
 * A torii lit in neon, drawn with the same trick as the cat: each stroke lights
 * up along its length, holds, then gets pulled away by the tail.
 *
 * Vermilion, the colour they are actually painted, with the lanterns in a
 * warmer tone so they read as lit rather than as part of the frame.
 */

type Stroke = { d: string; delay: number; color: string };

const VERMILION = "#ff3d5e";
const LANTERN = "#ffb703";

const TORII: Stroke[] = [
  // Kasagi — the top beam, sagging a little at the ends the way they do.
  { d: "M12 32 C 40 25, 80 25, 108 32", delay: 0, color: VERMILION },
  // Shimaki, sitting under it.
  { d: "M20 40 L100 40", delay: 0.14, color: VERMILION },
  // Nuki, the lower crossbeam.
  { d: "M26 56 L94 56", delay: 0.26, color: VERMILION },
  // Gakuzuka, the short post between the two.
  { d: "M60 40 L60 56", delay: 0.38, color: VERMILION },
  // Pillars, splayed outward toward the ground.
  { d: "M34 40 L29 104", delay: 0.46, color: VERMILION },
  { d: "M86 40 L91 104", delay: 0.52, color: VERMILION },
  // A lantern hung either side of the centre post.
  { d: "M46 56 L46 63", delay: 0.7, color: LANTERN },
  { d: "M42 63 Q 46 74, 50 63 Q 46 68, 42 63", delay: 0.76, color: LANTERN },
  { d: "M74 56 L74 63", delay: 0.7, color: LANTERN },
  { d: "M70 63 Q 74 74, 78 63 Q 74 68, 70 63", delay: 0.76, color: LANTERN },
];

export default function NeonTorii({
  size = 140,
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
        {TORII.map((stroke, i) => (
          <path
            key={i}
            d={stroke.d}
            pathLength={1}
            stroke={stroke.color}
            strokeWidth={2.6}
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
