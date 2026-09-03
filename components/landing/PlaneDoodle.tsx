"use client";

import Sketch from "./Sketch";

/**
 * A paper plane off the other wing of the page, balancing the cat in the left
 * margin — a folded dart with a dashed loop of a contrail behind it.
 *
 * The plane bobs on its own; the contrail is the flight-plan's dashed line
 * again, its dashes flowing back toward the tail. Give it a nudge and it darts
 * forward and settles.
 */

type V = React.CSSProperties;
const i = (n: number): V => ({ "--i": n } as V);

export default function PlaneDoodle({ className }: { className?: string }) {
  return (
    <Sketch
      viewBox="0 0 170 120"
      className={`sketch-plane ${className ?? ""}`}
      rough={1.8}
    >
      {/* the contrail, looping in from behind */}
      <path
        className="plane-trail"
        strokeWidth={2.2}
        d="M10 110 C28 101 27 82 44 82 C60 82 55 65 41 70 C31 73 41 90 70 84"
      />

      {/* the dart */}
      <g className="plane-body">
        <path className="sk" style={i(1)} strokeWidth={2.8} d="M150 30 L60 30 L92 60 Z" />
        <path className="sk" style={i(2)} strokeWidth={2.8} d="M150 30 L92 60 L74 86" />
        <path className="sk-soft" style={i(3)} strokeWidth={2.4} d="M60 30 L74 86" />
      </g>
    </Sketch>
  );
}
