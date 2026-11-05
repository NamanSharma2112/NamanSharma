"use client";

import { useEffect, useRef, useState } from "react";

/* ══ Image compare ════════════════════════════════════════
   One picture, two states of it, and a line to drag across.
   Left of the line is the raw shot, right of it the edit. Drag
   slowly and it stays where you leave it; flick it and it
   glides to the edge you threw it at.

   ── TWO PICTURES, ONE FRAME ─────────────────────────────
   Here the two are the same dialog, built twice: once the way
   it comes out of a first pass, once after the design
   engineering. Same content, same frame, rendered at the same
   size (public/craft/before.jpg and after.jpg), so the halves
   sit in the same place and the line reads as seeing the work
   that was done.

   ── THE LINE IS JELLY ───────────────────────────────────
   The knob is exactly where the finger is; the two ends of the
   line are not. They follow it on an under-damped spring, so a
   hard swing leaves them behind and the line bows into a curve,
   then wobbles straight when you stop. The before layer is cut
   along the SAME curve — clip-path: path(), in the block's own
   pixels — so the picture's edge bends with the line rather than
   the line bending over a straight cut.

   ── THE LAYERS DO NOT DRIFT ─────────────────────────────
   Two separate pictures have to stay exactly in register, so
   the back layer holds still under the line. */

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const BEFORE = "/craft/before.jpg";
const AFTER = "/craft/after.jpg";

export function Compare({
  /* the block's size; the curve and the cut are drawn in these
     pixels, so they are props rather than a CSS scale */
  w: W = 400,
  h: H = 300,
  /* show the Before and After tags */
  labels = true,
  corner = 16,
  /* play by itself: the line sweeps back and forth until a hand
     takes it. The parent turns this off while it is being used */
  auto = false,
}: {
  w?: number;
  h?: number;
  labels?: boolean;
  corner?: number;
  auto?: boolean;
} = {}) {
  const [p, setP] = useState(0.5);
  const [bend, setBend] = useState(0);
  const cur = useRef(0.5);
  const target = useRef<number | null>(null);
  /* the ends of the line, and how fast they are moving */
  const ends = useRef({ x: 0.5, v: 0 });
  const raf = useRef(0);
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef<{ v: number; t: number; last: number } | null>(null);
  const [held, setHeld] = useState(false);

  /* one loop for both motions: the glide toward a target, and
     the ends catching up with the middle. It stops itself once
     everything is still. */
  const loop = () => {
    if (raf.current) return;
    let prev = performance.now();
    const step = (t: number) => {
      const dt = Math.min(0.033, (t - prev) / 1000);
      prev = t;
      if (target.current !== null) {
        cur.current += (target.current - cur.current) * (1 - Math.pow(0.0004, dt));
        if (Math.abs(target.current - cur.current) < 0.0005) { cur.current = target.current; target.current = null; }
      }
      /* the jelly: a spring from the ends to the middle, damped
         firmly enough that it flexes and settles without a wobble */
      const e = ends.current;
      e.v += ((cur.current - e.x) * 620 - e.v * 44) * dt;
      e.x += e.v * dt;
      setP(cur.current);
      setBend(clamp((cur.current - e.x) * W * 0.5, -9, 9));
      const still = target.current === null && Math.abs(cur.current - e.x) < 0.0006 && Math.abs(e.v) < 0.002;
      if (still) { e.x = cur.current; e.v = 0; setBend(0); raf.current = 0; return; }
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };
  const glide = (to: number) => { target.current = to; loop(); };
  /* under the finger: the knob is drawn this frame, not the next —
     only the ends are left to the loop */
  const place = (v: number) => { target.current = null; cur.current = v; setP(v); loop(); };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  /* ── playing by itself ──────────────────────────────────
     Out to a quarter from each edge and back, a beat apart, on the
     same glide a click uses — so the jelly bows on every turn and the
     sweep shows the line is the thing to take hold of. It never runs
     while the line is held. */
  useEffect(() => {
    if (!auto) return;
    let side = cur.current > 0.5 ? 0.22 : 0.78;
    const turn = () => {
      if (drag.current) return;
      glide(side);
      side = side > 0.5 ? 0.22 : 0.78;
    };
    const first = window.setTimeout(turn, 500);
    const id = window.setInterval(turn, 2200);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto]);

  const at = (cx: number) => {
    const r = box.current!.getBoundingClientRect();
    return clamp((cx - r.left) / r.width, 0, 1);
  };

  const r = clamp(corner, 0, 28);
  /* the line as a curve: ends at x - bend, and a control point at
     x + bend so the curve passes exactly through the knob */
  const x = p * W;
  const top = x - bend;
  const curve = `M ${top.toFixed(2)} 0 Q ${(x + bend).toFixed(2)} ${H / 2} ${top.toFixed(2)} ${H}`;
  const cut = `path("M 0 0 L ${top.toFixed(2)} 0 Q ${(x + bend).toFixed(2)} ${H / 2} ${top.toFixed(2)} ${H} L 0 ${H} Z")`;

  return (
    <div
      ref={box}
      className="cmp"
      data-held={held || undefined}
      /* a drag here is the line's, not a swipe between chapters */
      data-no-swipe=""
      role="slider"
      tabIndex={0}
      aria-label="Before and after. Left of the line is before, right of it after."
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(p * 100)}
      style={{ width: W, height: H, borderRadius: r, "--p": p } as React.CSSProperties}
      onPointerDown={(e) => {
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* a scripted pointer */ }
        const v = at(e.clientX);
        drag.current = { v: 0, t: e.timeStamp, last: v };
        setHeld(true);
        glide(v);
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d) return;
        const v = at(e.clientX);
        const now = e.timeStamp;
        d.v = (v - d.last) / Math.max(1, now - d.t);
        d.t = now;
        d.last = v;
        place(v);
      }}
      onPointerUp={(e) => {
        const d = drag.current;
        drag.current = null;
        setHeld(false);
        try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* never captured */ }
        /* a flick carries it to the edge it was thrown at */
        if (d && Math.abs(d.v) > 0.0025) {
          glide(d.v > 0 ? 1 : 0);
        }
      }}
      onPointerCancel={() => { drag.current = null; setHeld(false); }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") { e.preventDefault(); glide(clamp((target.current ?? cur.current) - 0.1, 0, 1)); }
        if (e.key === "ArrowRight") { e.preventDefault(); glide(clamp((target.current ?? cur.current) + 0.1, 0, 1)); }
      }}
    >
      {/* the finished dialog underneath */}
      <img className="cmp-img cmp-after" src={AFTER} alt="" draggable={false} />
      {/* the first pass on top, cut off at the line */}
      <div className="cmp-before" style={{ clipPath: cut }}>
        <img className="cmp-img" src={BEFORE} alt="" draggable={false} />
      </div>
      {labels && (
        <>
          <span className="cmp-tag" style={{ opacity: clamp((p - 0.14) * 4, 0, 1) }}>Before</span>
          <span className="cmp-tag cmp-right" style={{ opacity: clamp((0.86 - p) * 4, 0, 1) }}>After</span>
        </>
      )}
      <svg className="cmp-line" width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <path className="cmp-glow" d={curve} />
        <path d={curve} />
      </svg>
      <span className="cmp-grip" style={{ left: x }}>
        <span className="cmp-knob">
          <svg width="16" height="10" viewBox="0 0 16 10" aria-hidden="true">
            <path d="M5 1 1 5l4 4M11 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </span>
    </div>
  );
}
