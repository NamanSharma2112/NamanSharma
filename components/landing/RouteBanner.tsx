"use client";

import { useId } from "react";
import { useReducedMotion } from "motion/react";

/**
 * A line of type riding a shallow arc, bridging the hero and the flight plan.
 *
 * The words are not laid out by the browser — they are bound to a path with
 * `textPath`, and the text element's `x` is animated, which slides the string
 * along the curve. That is the only way to get type to follow a curve and keep
 * moving along it; a transform would drag the whole shape sideways instead.
 *
 * The curve runs off both edges so the line has no visible start or end, and
 * the string is repeated enough to cover the travel. Quiet on purpose: mono,
 * small, muted — a route marking on the page, not a headline.
 */

const WORDS = "Design Engineer · Motion · Interfaces · Detail · ";

export default function RouteBanner({ className }: { className?: string }) {
  const raw = useId().replace(/:/g, "");
  const curve = `route-${raw}`;
  const still = useReducedMotion();

  return (
    <div className={`pointer-events-none select-none ${className ?? ""}`} aria-hidden>
      <svg viewBox="0 0 1200 120" fill="none" className="h-[92px] w-full">
        <defs>
          {/* Wider than the viewBox on both sides, so the type arrives and
              leaves off-screen rather than popping at an edge. */}
          <path id={curve} d="M -300 96 Q 600 4 1500 96" />
        </defs>

        <use
          href={`#${curve}`}
          className="stroke-black/[0.07] dark:stroke-white/[0.09]"
          strokeWidth={1}
          strokeDasharray="5 7"
        />

        <text
          x={0}
          className="fill-zinc-400 font-mono text-[13px] uppercase tracking-[0.2em] dark:fill-zinc-500"
        >
          <textPath href={`#${curve}`} startOffset={0}>
            {WORDS.repeat(6)}
          </textPath>
          {!still && (
            <animate
              attributeName="x"
              dur="46s"
              values="0;-980"
              repeatCount="indefinite"
            />
          )}
        </text>
      </svg>
    </div>
  );
}
