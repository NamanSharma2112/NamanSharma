"use client";

import Link from "next/link";
import * as React from "react";
import type { Frame } from "@/lib/work-frames";
import { useLive } from "./useLive";

/* ══ The work, as a ring ═══════════════════════════════════════════════
   Every shot of every project, small, standing round a circle that fills
   the chapter, with the chapter's name in the middle. The ring drifts by
   itself; drag it, or swipe sideways, and it turns under the hand and
   carries on a little when let go. Point at a shot and it grows and the
   middle says what it is; press it and it flies out of the ring to the
   middle of the screen, large, with where it goes underneath.

   ── THE PAGE'S OWN SCROLL STAYS THE PAGE'S ───────────────────────────
   A vertical scroll on this site moves one chapter, everywhere, and the
   ring does not take that away: a scroll down here still goes on to
   Contact. The ring answers the gestures that mean "sideways" — a drag, a
   horizontal trackpad swipe, a sideways swipe on a phone — so turning it
   and leaving it can never be the same gesture.

   ── ONE NUMBER TURNS IT ──────────────────────────────────────────────
   The ring's angle is a ref, written every frame by the drift, the hand
   and the coast after the hand; React renders when what is shown in the
   middle changes, never per frame. Each shot's place is the angle plus
   its own share of the circle, so the ring cannot come apart. The loop
   only runs while the chapter is on screen. */

const TAU = Math.PI * 2;
/* one turn every three minutes, at rest: alive, never busy */
const DRIFT = TAU / 180;
/* how much of the coast's speed survives each sixtieth of a second */
const COAST = 0.94;
/* the shots come in round the ring one after another */
const STAGGER = 22;
const ENTER = 760;

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function WorkRing({ frames }: { frames: Frame[] }) {
  const stage = React.useRef<HTMLDivElement>(null);
  const thumbs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const live = useLive(stage);
  const n = frames.length;

  /* the ring's size, from the stage: a circle that fills the height with
     room for the middle, and each shot a share of the circumference */
  const [geo, setGeo] = React.useState({ cx: 0, cy: 0, r: 0, w: 0, h: 0 });
  React.useLayoutEffect(() => {
    const el = stage.current;
    if (!el) return;
    const fit = () => {
      const W = el.clientWidth;
      const H = el.clientHeight;
      const r = Math.max(120, Math.min(W * 0.42, H * 0.37));
      /* the arc each shot has, and the shot is most of it, at 16:10 */
      const w = clamp(((TAU * r) / n) * 0.82, 28, 92);
      setGeo({ cx: W / 2, cy: H / 2, r, w, h: w / 1.6 });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [n]);

  /* what the middle shows: the shot pointed at or focused, else the name */
  const [near, setNear] = React.useState<number | null>(null);
  /* the shot taken out to look at, and where it left from */
  const [open, setOpen] = React.useState<number | null>(null);
  const [touched, setTouched] = React.useState(false);

  const angle = React.useRef(0);
  const vel = React.useRef(0);
  const hand = React.useRef<null | { id: number; touch: boolean; a: number; x: number; y: number; t: number; moved: boolean }>(null);
  const entered = React.useRef(0);
  /* a drag that ends on a shot also clicks it; this remembers it was a turn */
  const turned = React.useRef(false);
  const still = React.useRef(false);

  /* every shot's place for the ring's angle now, and how far in it is */
  const draw = React.useCallback(
    (now: number) => {
      const { cx, cy, r, w, h } = geo;
      if (!r) return;
      for (let i = 0; i < n; i++) {
        const el = thumbs.current[i];
        if (!el) continue;
        const p = still.current ? 1 : ease(clamp((now - entered.current - i * STAGGER) / ENTER, 0, 1));
        /* start at the top and go round clockwise */
        const th = angle.current + (i / n) * TAU - Math.PI / 2;
        const rr = r * (0.72 + 0.28 * p);
        const x = cx + Math.cos(th) * rr - w / 2;
        const y = cy + Math.sin(th) * rr - h / 2;
        el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${(0.5 + 0.5 * p).toFixed(3)})`;
        el.style.opacity = p.toFixed(3);
      }
    },
    [geo, n],
  );

  /* the loop reads these as refs, so pointing at a shot does not restart
     it (and with it the ring's way in) */
  const held = React.useRef(false);
  React.useEffect(() => {
    held.current = near !== null || open !== null;
  }, [near, open]);

  /* the loop: drift, the hand, the coast; only while the chapter is in */
  React.useEffect(() => {
    still.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!live) {
      draw(performance.now());
      return;
    }
    entered.current = performance.now();
    /* the ring comes in turning, and settles into its drift */
    if (!still.current) vel.current = -0.9;
    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      if (!hand.current) {
        /* the coast decays toward the drift; pointing at a shot, or
           having one open, holds the ring still under it */
        const rest = held.current ? 0 : DRIFT;
        vel.current = rest + (vel.current - rest) * Math.pow(COAST, dt * 60);
        angle.current += vel.current * dt;
      }
      draw(now);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [live, draw]);

  /* ── the hand ─────────────────────────────────────────────────────────
     A mouse turns the ring by the angle it travels round the middle, which
     is what grabbing a ring is. A finger turns it by how far it moves
     sideways, and a mostly vertical finger is left alone, so the page's
     swipe between chapters still works over the ring. */
  const angleAt = (x: number, y: number) => {
    const b = stage.current!.getBoundingClientRect();
    return Math.atan2(y - b.top - geo.cy, x - b.left - geo.cx);
  };
  const down = (e: React.PointerEvent) => {
    if (open !== null || e.button !== 0) return;
    turned.current = false;
    hand.current = { id: e.pointerId, touch: e.pointerType === "touch", a: angleAt(e.clientX, e.clientY), x: e.clientX, y: e.clientY, t: e.timeStamp, moved: false };
  };
  const move = (e: React.PointerEvent) => {
    const g = hand.current;
    if (!g || g.id !== e.pointerId) return;
    let d = 0;
    if (g.touch) {
      const dx = e.clientX - g.x;
      const dy = e.clientY - g.y;
      if (!g.moved && Math.abs(dy) > Math.abs(dx)) return;
      d = dx / geo.r;
      g.x = e.clientX;
      g.y = e.clientY;
    } else {
      const a = angleAt(e.clientX, e.clientY);
      d = Math.atan2(Math.sin(a - g.a), Math.cos(a - g.a));
      g.a = a;
    }
    if (!g.moved && Math.abs(d) > 0.004) {
      g.moved = true;
      setTouched(true);
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        /* a scripted pointer */
      }
    }
    if (!g.moved) return;
    const dt = Math.max(1, e.timeStamp - g.t) / 1000;
    g.t = e.timeStamp;
    angle.current += d;
    vel.current = vel.current * 0.5 + (d / dt) * 0.5;
  };
  const up = (e: React.PointerEvent) => {
    const g = hand.current;
    if (!g || g.id !== e.pointerId) return;
    hand.current = null;
    turned.current = g.moved;
    /* a turn keeps going a little, never wildly */
    vel.current = clamp(vel.current, -6, 6);
  };
  /* a sideways trackpad swipe turns it; an upright scroll is the page's */
  const wheel = (e: React.WheelEvent) => {
    if (open !== null || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    vel.current += -e.deltaX * 0.004;
    setTouched(true);
  };

  /* ── a shot taken out ────────────────────────────────────────────────
     The large shot is one element that starts exactly on the small one —
     its box, read off the screen — and flies to the middle; going back, it
     flies to wherever that shot has got to by then. */
  const viewer = React.useRef<HTMLDivElement>(null);
  const from = React.useRef<DOMRect | null>(null);
  const take = (i: number) => {
    if (open !== null) return;
    from.current = thumbs.current[i]?.getBoundingClientRect() ?? null;
    setOpen(i);
    setTouched(true);
  };
  const fly = (el: HTMLElement, r: DOMRect, back: boolean) => {
    const b = el.getBoundingClientRect();
    const sx = r.width / b.width;
    const dx = r.left + r.width / 2 - (b.left + b.width / 2);
    const dy = r.top + r.height / 2 - (b.top + b.height / 2);
    const at = `translate(${dx}px, ${dy}px) scale(${sx})`;
    return el.animate(back ? [{ transform: "none" }, { transform: at }] : [{ transform: at }, { transform: "none" }], {
      duration: still.current ? 1 : back ? 420 : 620,
      easing: back ? "cubic-bezier(0.4, 0, 0.2, 1)" : "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "both",
    });
  };
  React.useLayoutEffect(() => {
    const el = viewer.current;
    if (open === null || !el || !from.current) return;
    fly(el, from.current, false);
  }, [open]);
  const shut = React.useCallback(() => {
    const el = viewer.current;
    const i = open;
    if (i === null) return;
    const r = thumbs.current[i]?.getBoundingClientRect();
    if (!el || !r) {
      setOpen(null);
      return;
    }
    const a = fly(el, r, true);
    a.onfinish = () => {
      setOpen(null);
      thumbs.current[i]?.focus({ preventScroll: true });
    };
  }, [open]);
  /* Escape puts it back; the arrows look at the next one round */
  React.useEffect(() => {
    if (open === null) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") shut();
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        setOpen((o) => (o === null ? o : (o + (e.key === "ArrowRight" ? 1 : -1) + n) % n));
      }
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [open, n, shut]);

  const shown = open ?? near;
  const f = shown === null ? null : frames[shown]!;
  const projects = new Set(frames.map((x) => x.project)).size;

  return (
    <div
      ref={stage}
      className="ring"
      data-open={open !== null || undefined}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onWheel={wheel}
    >
      <div className="ring-mid" aria-live="polite">
        <div key={f ? frames.indexOf(f) : "work"} className="ring-say">
          {f && open === null ? (
            <>
              <p className="ring-name">{f.title}</p>
              <p className="ring-sub">{f.project}</p>
            </>
          ) : (
            <>
              <h2 className="ring-name">Work</h2>
              <p className="ring-sub">
                {n} shots from {projects} projects
              </p>
              <p className="ring-hint" data-gone={touched || undefined}>
                Drag to turn it; press a shot to open it
              </p>
            </>
          )}
        </div>
      </div>

      {frames.map((x, i) => (
        <button
          key={x.id}
          ref={(el) => {
            thumbs.current[i] = el;
          }}
          type="button"
          className="ring-shot"
          data-near={near === i || undefined}
          data-out={open === i || undefined}
          style={{ width: geo.w, height: geo.h }}
          aria-label={`${x.title}, ${x.project}`}
          onPointerEnter={() => setNear(i)}
          onPointerLeave={() => setNear((v) => (v === i ? null : v))}
          onFocus={() => setNear(i)}
          onBlur={() => setNear((v) => (v === i ? null : v))}
          onClick={() => {
            /* a drag that ended on a shot is a turn, not a press */
            if (turned.current) {
              turned.current = false;
              return;
            }
            take(i);
          }}
          onMouseEnter={() => {
            /* the large one, fetched before it is asked for */
            const im = new Image();
            im.src = `/work/ring/${x.id}.jpg`;
          }}
        >
          <img src={`/work/ring/${x.id}-t.jpg`} alt="" width={320} height={200} draggable={false} />
        </button>
      ))}

      {open !== null && (
        <div
          className="ring-view"
          role="dialog"
          aria-modal="true"
          aria-label={`${frames[open]!.title}, ${frames[open]!.project}`}
          onPointerDown={(e) => {
            /* a press outside the shot and its words puts it back */
            if (e.target === e.currentTarget) shut();
          }}
        >
          <div ref={viewer} className="ring-big">
            <img src={`/work/ring/${frames[open]!.id}.jpg`} alt={`${frames[open]!.title}, ${frames[open]!.project}`} width={1280} height={800} />
          </div>
          <div className="ring-cap">
            <p>
              <span className="ring-cap-title">{frames[open]!.title}</span> <span className="ring-cap-proj">{frames[open]!.project}</span>
            </p>
            <p className="ring-cap-meta">
              <span>
                {String(open + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
              </span>
              {frames[open]!.href && (
                <>
                  <span aria-hidden="true">·</span>
                  {frames[open]!.href!.startsWith("/") ? (
                    <Link href={frames[open]!.href!}>Read it</Link>
                  ) : (
                    <a href={frames[open]!.href}>Visit {new URL(frames[open]!.href!).hostname.replace(/^www\./, "")}</a>
                  )}
                </>
              )}
              <span aria-hidden="true">·</span>
              <button type="button" className="ring-close" onClick={shut}>
                Close
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
