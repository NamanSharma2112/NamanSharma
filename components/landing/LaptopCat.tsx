"use client";

import Sketch from "./Sketch";

/**
 * A cat peeking over the lid of an open laptop — the one that sits by the link
 * down to the desktop, so the machine has a mascot.
 *
 * The screen glows and breathes; watch it and the ears perk, the paws knead the
 * top edge, the tail flicks, and the screen brightens as though something just
 * happened on it.
 */

type V = React.CSSProperties;
const i = (n: number): V => ({ "--i": n } as V);

export default function LaptopCat({ className }: { className?: string }) {
  return (
    <Sketch
      viewBox="0 0 170 140"
      className={`sketch-lap ${className ?? ""}`}
      rough={1.9}
    >
      {/* the tail, curling up from behind the lid */}
      <path
        className="sk lap-tail pivot"
        style={i(8)}
        strokeWidth={2.6}
        d="M120 98 C138 94 142 74 129 67"
      />

      {/* the screen's light, then the lid around it */}
      <path className="lap-screen" d="M55 70 L115 70 L115 105 L55 105 Z" />
      <path
        className="sk"
        style={i(4)}
        strokeWidth={3}
        d="M50 110 L51 64 L119 64 L120 110"
      />

      {/* the base, in perspective, with a hint of a keyboard */}
      <path
        className="sk"
        style={i(3)}
        strokeWidth={3}
        d="M26 126 L47 110 L123 110 L144 126 Z"
      />
      <path className="sk-soft" style={i(6)} strokeWidth={2} d="M55 119 L115 119" />

      {/* the head, rising over the lid */}
      <path
        className="sk"
        style={i(2)}
        strokeWidth={3}
        d="M58 66 C55 39 70 27 85 27 C100 27 115 39 112 66"
      />

      {/* ears */}
      <path className="sk lap-ear-l pivot" style={i(1)} strokeWidth={3} d="M62 47 L64 25 L82 40" />
      <path className="sk lap-ear-r pivot" style={i(1)} strokeWidth={3} d="M88 40 L106 24 L108 47" />
      <path className="sk-soft" style={i(2)} strokeWidth={2} d="M69 43 L71 31 L80 41" />
      <path className="sk-soft" style={i(2)} strokeWidth={2} d="M91 41 L100 30 L102 43" />

      {/* eyes peeking over the edge */}
      <g className="cat-eye-closed">
        <path className="sk" style={i(5)} strokeWidth={2.6} d="M70 60 Q76 54 82 60" />
        <path className="sk" style={i(5)} strokeWidth={2.6} d="M88 60 Q94 54 100 60" />
      </g>
      <g className="cat-eye-open">
        <path className="sk-soft" strokeWidth={2.6} d="M71 58 Q76 52 81 58 Q76 64 71 58 Z" />
        <path className="sk-soft" strokeWidth={2.6} d="M89 58 Q94 52 99 58 Q94 64 89 58 Z" />
      </g>

      {/* two paws hooked over the top of the lid */}
      <path className="sk lap-paw-l pivot" style={i(6)} strokeWidth={2.6} d="M60 64 C58 57 69 57 68 64" />
      <path className="sk lap-paw-r pivot" style={i(6)} strokeWidth={2.6} d="M102 64 C101 57 112 57 110 64" />
    </Sketch>
  );
}
