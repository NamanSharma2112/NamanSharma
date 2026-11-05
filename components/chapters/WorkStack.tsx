"use client";

import Link from "next/link";
import * as React from "react";

export type Project = {
  id: string;
  name: string;
  href: string;
  /* what it is, after the name: "MotionKit, an animation library." */
  blurb: string;
  shot: string;
};

/* ══ The work, as a stack of cards ═════════════════════════════════════
   Each project is a screenshot on a card, and the cards stand in depth,
   each a step further back and up to the right. Press the front card, or
   drag it away, and it goes straight to the back while the rest step
   forward; press a card behind and it comes to the front. The words under
   the stack are always about the card in front.

   The order is the only state. A slot is a fixed transform, so moving a
   card is giving it another slot and letting the transition carry it. The
   card sent back takes the back slot's paint order at once and travels
   there behind the others, which needs paint order to be the z-index and
   not the depth: the stage is flat, with the perspective on it. */

const WIDE = { w: 360, h: 240, x: 36, y: 26, z: 70 };
const NARROW = { w: 248, h: 165, x: 26, y: 19, z: 56 };
const SKEW = 6;

export function WorkStack({ projects }: { projects: Project[] }) {
  const [order, setOrder] = React.useState(() => projects.map((p) => p.id));
  const [size, setSize] = React.useState(WIDE);
  const els = React.useRef<Record<string, HTMLDivElement | null>>({});
  const drag = React.useRef<null | { pid: number; x: number; y: number; dx: number; dy: number; t: number }>(null);
  const unhook = React.useRef(() => {});

  React.useEffect(() => {
    const mq = matchMedia("(max-width: 560px)");
    const fit = () => setSize(mq.matches ? NARROW : WIDE);
    fit();
    mq.addEventListener("change", fit);
    return () => {
      mq.removeEventListener("change", fit);
      unhook.current();
    };
  }, []);

  const n = projects.length;
  const slot = (k: number) => `translate3d(${k * size.x}px, ${-k * size.y}px, ${-k * size.z}px) skewY(${SKEW}deg)`;

  /* Every card back to its slot: no drag survives a change of order, so a
     card is never left where a hand once put it. */
  const settle = () => {
    for (const el of Object.values(els.current)) {
      if (!el) continue;
      el.style.transition = "";
      el.style.transform = "";
    }
  };
  const next = () => {
    settle();
    setOrder((o) => [...o.slice(1), o[0]!]);
  };
  const prev = () => {
    settle();
    setOrder((o) => [o[o.length - 1]!, ...o.slice(0, -1)]);
  };
  const toFront = (id: string) => {
    settle();
    setOrder((o) => {
      const k = o.indexOf(id);
      return [...o.slice(k), ...o.slice(0, k)];
    });
  };

  /* ── the drag ─────────────────────────────────────────────────────────
     Only the front card moves, and the window hears the gesture so it is
     not lost off the edge of the block. Past a little way the card is on
     a rubber band. A press, or a drag far or quick enough, sends it to the
     back; anything less and it springs back into place. */
  const grab = (e: React.PointerEvent<HTMLDivElement>, id: string, front: boolean) => {
    if (e.button !== 0 || drag.current) return;
    if (!front) {
      toFront(id);
      return;
    }
    const el = e.currentTarget;
    drag.current = { pid: e.pointerId, x: e.clientX, y: e.clientY, dx: 0, dy: 0, t: e.timeStamp };
    el.style.transition = "none";
    const rub = (d: number) => 150 * Math.tanh(d / 150);
    const mv = (ev: PointerEvent) => {
      const d = drag.current;
      if (!d || ev.pointerId !== d.pid) return;
      d.dx = ev.clientX - d.x;
      d.dy = ev.clientY - d.y;
      const x = rub(d.dx);
      const y = rub(d.dy);
      el.style.transform = `${slot(0)} translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${(x * 0.05).toFixed(2)}deg)`;
    };
    const up = (ev: PointerEvent) => {
      const d = drag.current;
      if (!d || ev.pointerId !== d.pid) return;
      drag.current = null;
      unhook.current();
      const far = Math.hypot(d.dx, d.dy);
      const quick = far / Math.max(1, ev.timeStamp - d.t) > 0.6;
      if (ev.type !== "pointercancel" && (far < 6 || far > 70 || (quick && far > 24))) next();
      else settle();
    };
    addEventListener("pointermove", mv);
    addEventListener("pointerup", up);
    addEventListener("pointercancel", up);
    unhook.current = () => {
      removeEventListener("pointermove", mv);
      removeEventListener("pointerup", up);
      removeEventListener("pointercancel", up);
      unhook.current = () => {};
    };
  };

  const key = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  const front = projects.find((p) => p.id === order[0])!;
  const at = projects.indexOf(front);
  const tan = Math.tan((SKEW * Math.PI) / 180);
  const blockW = size.w + (n - 1) * size.x + 8;
  const blockH = size.h + (n - 1) * size.y + size.w * tan + 8;

  return (
    <>
      <div className="ln work-row">
        <div
          className="csw"
          data-keys=""
          data-no-swipe=""
          role="group"
          aria-roledescription="carousel"
          aria-label={`Projects. ${front.name} is in front. Enter for the next.`}
          tabIndex={0}
          onKeyDown={key}
          style={{ width: blockW, height: blockH }}
        >
          <div
            className="csw-stage"
            style={{
              width: size.w,
              height: size.h,
              bottom: (size.w * tan) / 2 + 4,
              perspectiveOrigin: `${size.w * 0.8}px ${size.h * 0.2}px`,
            }}
          >
            {projects.map((p) => {
              const k = order.indexOf(p.id);
              return (
                <div
                  key={p.id}
                  ref={(el) => {
                    els.current[p.id] = el;
                  }}
                  className="csw-card"
                  data-front={k === 0 || undefined}
                  aria-hidden="true"
                  style={{ zIndex: n - k, ["--t" as string]: slot(k) }}
                  onPointerDown={(e) => grab(e, p.id, k === 0)}
                >
                  <img className="csw-photo" src={p.shot} alt="" width={1200} height={800} draggable={false} decoding="async" />
                  <span className="csw-tag">{p.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="ln work-cap" aria-live="polite">
        <div key={front.id} className="work-swap">
          <p>
            {front.href.startsWith("/") ? <Link href={front.href}>{front.name}</Link> : <a href={front.href}>{front.name}</a>}, {front.blurb}
          </p>
          <p className="work-meta">
            <span>
              {String(at + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </span>
            <span aria-hidden="true">·</span>
            <span>Press the card, or throw it, for the next</span>
          </p>
        </div>
      </div>
    </>
  );
}
