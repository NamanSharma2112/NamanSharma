"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The mark in the corner: two initials on a bar you can spin.
 *
 * The reference turns a monogram in three dimensions with a WebGL scene. This
 * does it with one rotateY on a two-faced card, because a whole 3D runtime
 * loaded on a page this short would cost more than the thing it draws — and at
 * this size, 26 pixels tall, a lit mesh and a rotated rectangle are the same
 * picture.
 *
 * It turns by itself, slowly, and follows your drag while you hold it. Letting
 * go hands it back to the drift from wherever you left it rather than snapping,
 * which is the whole difference between a toy and a decoration.
 */
export default function Monogram() {
  const [angle, setAngle] = useState(0);
  const drag = useRef<{ x: number; from: number } | null>(null);
  const raf = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let last = performance.now();
    const tick = (t: number) => {
      const dt = t - last;
      last = t;
      // Only while nobody is holding it.
      if (!drag.current) setAngle((a) => a + dt * 0.012);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!drag.current) return;
      setAngle(drag.current.from + (e.clientX - drag.current.x) * 0.7);
    };
    const up = () => {
      drag.current = null;
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <span
      className="mono"
      role="img"
      aria-label="NS"
      onPointerDown={(e) => {
        drag.current = { x: e.clientX, from: angle };
      }}
      // Arrow keys do what the drag does, so the thing is not pointer-only.
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setAngle((a) => a - 18);
        if (e.key === "ArrowRight") setAngle((a) => a + 18);
      }}
    >
      <span className="mono-spin" style={{ transform: `rotateY(${angle}deg)` }}>
        <span className="mono-face">NS</span>
        {/* The back, pre-turned so it reads the right way round once it comes
            about. Without it the bar is transparent for half of every turn. */}
        <span className="mono-face is-back">NS</span>
      </span>
    </span>
  );
}
