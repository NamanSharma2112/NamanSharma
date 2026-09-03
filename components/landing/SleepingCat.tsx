"use client";

import Sketch from "./Sketch";

/**
 * The cat asleep in the seat beside you — a fellow passenger on the flight.
 *
 * It breathes at rest and its tail sways; lean in and the near ear twitches,
 * the tail snaps once, and it cracks an eye open, its dream giving up. Drawn in
 * chalk, so it reads as a doodle in the margin rather than a piece of UI.
 */

type V = React.CSSProperties;
const i = (n: number): V => ({ "--i": n } as V);

export default function SleepingCat({ className }: { className?: string }) {
  return (
    <Sketch
      viewBox="0 0 240 160"
      className={`sketch-cat ${className ?? ""}`}
      rough={2.1}
    >
      {/* the floor it lies on */}
      <path className="sk-soft" style={i(0)} strokeWidth={2} d="M62 154 Q140 160 208 148" />

      {/* the tail, curling up off the haunch */}
      <path
        className="sk cat-tail"
        style={i(9)}
        strokeWidth={3}
        d="M196 118 C222 118 230 90 209 79 C199 74 191 83 197 92"
      />

      {/* the torso — this is what breathes */}
      <g className="cat-body">
        <path
          className="sk"
          style={i(3)}
          strokeWidth={3}
          d="M126 72 C160 54 199 60 213 97 C218 114 211 129 195 135"
        />
        <path
          className="sk"
          style={i(4)}
          strokeWidth={3}
          d="M120 138 C150 143 176 142 195 135"
        />
        <path className="sk-soft" style={i(6)} strokeWidth={2} d="M152 108 Q174 112 192 105" />
      </g>

      {/* chest dropping to the two front paws, stretched forward with toe lines */}
      <path className="sk" style={i(5)} strokeWidth={3} d="M82 118 C82 131 92 139 108 139" />
      <path
        className="sk"
        style={i(5)}
        strokeWidth={3}
        d="M108 139 L76 139 C67 139 67 148 76 148 L112 148"
      />
      <path
        className="sk"
        style={i(6)}
        strokeWidth={3}
        d="M122 134 L100 134 C93 134 93 141 100 141 L124 141"
      />
      <path className="sk-soft" style={i(7)} strokeWidth={2} d="M84 148 L84 142" />
      <path className="sk-soft" style={i(7)} strokeWidth={2} d="M92 148 L92 142" />
      <path className="sk-soft" style={i(7)} strokeWidth={2} d="M100 148 L100 142" />
      <path className="sk-soft" style={i(7)} strokeWidth={2} d="M106 141 L106 136" />
      <path className="sk-soft" style={i(7)} strokeWidth={2} d="M113 141 L113 136" />

      {/* head and cheeks */}
      <path
        className="sk"
        style={i(2)}
        strokeWidth={3}
        d="M64 66 C47 83 50 113 81 121 C106 127 130 116 129 89 C129 78 129 71 128 65"
      />

      {/* ears */}
      <path className="sk cat-ear-l pivot" style={i(1)} strokeWidth={3} d="M64 66 L69 29 L97 55" />
      <path className="sk cat-ear-r pivot" style={i(1)} strokeWidth={3} d="M99 53 L118 25 L128 65" />
      <path className="sk-soft" style={i(2)} strokeWidth={2} d="M74 57 L77 41 L89 53" />
      <path className="sk-soft" style={i(2)} strokeWidth={2} d="M106 50 L115 38 L120 57" />

      {/* eyes — shut and smiling, or open when woken */}
      <g className="cat-eye-closed">
        <path className="sk" style={i(7)} strokeWidth={2.6} d="M73 85 Q79 79 85 85" />
        <path className="sk" style={i(7)} strokeWidth={2.6} d="M99 85 Q105 79 111 85" />
      </g>
      <g className="cat-eye-open">
        <path className="sk-soft" strokeWidth={2.6} d="M74 84 Q79 78 84 84 Q79 90 74 84 Z" />
        <path className="sk-soft" strokeWidth={2.6} d="M100 84 Q105 78 110 84 Q105 90 100 84 Z" />
      </g>

      {/* nose over a small mouth */}
      <path className="fill-ink sk-fill" style={i(8)} d="M89 92 L96 92 L92.5 96 Z" />
      <path className="sk" style={i(8)} strokeWidth={2.4} d="M92.5 96 L92.5 99" />
      <path className="sk" style={i(8)} strokeWidth={2.4} d="M85 100 Q89 103.5 92.5 100" />
      <path className="sk" style={i(8)} strokeWidth={2.4} d="M92.5 100 Q96 103.5 100 100" />

      {/* whiskers */}
      <path className="sk-soft" style={i(8)} strokeWidth={2} d="M60 93 L39 89" />
      <path className="sk-soft" style={i(8)} strokeWidth={2} d="M60 99 L40 102" />
      <path className="sk-soft" style={i(8)} strokeWidth={2} d="M126 93 L147 89" />
      <path className="sk-soft" style={i(8)} strokeWidth={2} d="M126 99 L146 102" />

      {/* a dream, drifting off the ear */}
      <text className="fill-ink cat-zzz cat-zzz-3" x={138} y={44} fontSize={11} fontStyle="italic">
        z
      </text>
      <text className="fill-ink cat-zzz cat-zzz-2" x={148} y={34} fontSize={14} fontStyle="italic">
        z
      </text>
      <text className="fill-ink cat-zzz" x={160} y={22} fontSize={18} fontStyle="italic">
        Z
      </text>
    </Sketch>
  );
}
