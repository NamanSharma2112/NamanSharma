"use client";

import Link from "next/link";
import * as React from "react";
import { PROJECTS, type Frame } from "@/lib/work-frames";

/* ══ The work, as a ring that opens into a strip ════════════════════════
   The /work page. Every shot of every project, small, standing round a
   circle that fills the screen, with the page's name in the middle. The
   ring drifts by itself; scroll, drag or swipe and it turns, and coasts
   when let go. Point at a shot and it grows and the middle names it.

   ── ITS OWN PAGE, SO THE SCROLL IS ITS OWN ────────────────────────────
   On the front page a scroll moves one chapter, and a ring there could
   only ever turn to sideways gestures. Here nothing else wants the
   scroll, so the scroll is what turns it — every gesture the ring has is
   the obvious one.

   ── PRESS ONE, AND THE RING UNROLLS ───────────────────────────────────
   Pressing a shot opens its project. The ring unrolls into a strip along
   the foot of the screen, every shot in its ring order, and the shots of
   that project grow as they arrive, large, running off the bottom edge,
   while the rest shrink small on either side. The words come in above:
   a way back, the project, the role, and what it is. Scroll or drag to
   travel along the strip; press another project's shot to change to it;
   Close, or Escape, rolls the strip back up into the ring. The shots
   move one after another outward from the one pressed, so the change
   reads as one motion travelling, not thirty things moving at once.

   ── ONE ELEMENT PER SHOT, ONE POSE EACH ───────────────────────────────
   A shot is never two things — a thumbnail here and a picture there —
   but one element whose pose (where its middle is, and how large) eases
   toward wherever the ring or the strip wants it. Every element is laid
   out at the strip's large size and drawn smaller by a scale, so a shot
   growing is a scale changing, never a layout; the picture inside swaps
   from the thumbnail to the full shot only where it is drawn large. All
   of it is refs written in one loop; React renders only when what the
   words say changes. */

const TAU = Math.PI * 2;
/* one turn every three minutes, at rest: alive, never busy */
const DRIFT = TAU / 180;
/* how much of the coast's speed survives each sixtieth of a second */
const COAST = 0.94;
/* how far a scroll turns it: a long trackpad swipe is about a quarter turn */
const SCROLL = 0.0016;
/* the way in, round the ring one after another */
const STAGGER = 22;
const ENTER = 760;
/* between ring and strip: the beat between one shot and the next,
   counted outward from the one pressed, and how quickly each settles.
   Slow on purpose: a shot is a heavy thing coming toward you, so it
   takes its time to start and drags a little as it arrives — about a
   second and a half for the wave to reach the far end and land. */
const WAVE = 26;
const SETTLE = 4.2;

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

type Pose = { x: number; y: number; s: number };
type Geo = { W: number; H: number; cx: number; cy: number; r: number; ringW: number; bigW: number; bigH: number; smallH: number; top: number; foot: number };

export function WorkRing({ frames }: { frames: Frame[] }) {
  const stage = React.useRef<HTMLDivElement>(null);
  const shots = React.useRef<(HTMLButtonElement | null)[]>([]);
  const n = frames.length;

  const [geo, setGeo] = React.useState<Geo | null>(null);
  React.useLayoutEffect(() => {
    const el = stage.current;
    if (!el) return;
    const fit = () => {
      const W = el.clientWidth;
      const H = el.clientHeight;
      const narrow = W < 700;
      const r = Math.max(120, Math.min(W * 0.42, H * 0.37));
      /* the arc each shot has on the ring, and the shot is most of it */
      const ringW = clamp(((TAU * r) / n) * 0.82, 28, 92);
      /* the strip: the open project's shots large, from a little over
         halfway down and running off the foot; the rest small, sitting on
         a line just above the foot */
      const top = narrow ? H * 0.6 : H * 0.5;
      /* large enough that the open project's shots run off the foot */
      const bigH = narrow ? Math.min(H * 0.34, (W - 48) / 1.6) : Math.min(H * 0.66, W * 0.33);
      setGeo({ W, H, cx: W / 2, cy: H / 2, r, ringW, bigW: bigH * 1.6, bigH, smallH: bigH * (narrow ? 0.3 : 0.24), top, foot: H - 28 });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [n]);

  /* the shot pointed at or focused, and the shot whose project is open */
  const [near, setNear] = React.useState<number | null>(null);
  const [sel, setSel] = React.useState<number | null>(null);
  const [touched, setTouched] = React.useState(false);
  const project = sel === null ? null : frames[sel]!.project;

  /* the loop's state, all refs: the ring's angle and speed, the hand, the
     strip's travel, and each shot's pose as last drawn */
  const angle = React.useRef(0);
  const vel = React.useRef(0);
  const pan = React.useRef(0);
  const panVel = React.useRef(0);
  /* when the strip was last moved by a scroll, and where a shot that
     becomes the open one by travelling should stay */
  const travelled = React.useRef(0);
  const carry = React.useRef<number | null>(null);
  const hand = React.useRef<null | { id: number; touch: boolean; a: number; x: number; y: number; t: number; moved: boolean }>(null);
  const turned = React.useRef(false);
  const entered = React.useRef(0);
  const still = React.useRef(false);
  const poses = React.useRef<(Pose | null)[]>([]);
  /* what the loop needs to know of React's state */
  const mode = React.useRef({ sel: null as number | null, from: 0, at: 0, held: false });

  React.useEffect(() => {
    const m = mode.current;
    if (m.sel !== sel) {
      /* the wave starts from the shot pressed, or, going home, from the
         one that was open */
      m.from = sel ?? m.sel ?? 0;
      m.at = performance.now();
      m.sel = sel;
      /* travelling into the next project keeps the shot where it is;
         pressing or stepping to one brings it to the middle */
      pan.current = carry.current ?? 0;
      carry.current = null;
    }
    m.held = near !== null || sel !== null;
  }, [sel, near]);

  /* the strip, laid out for the open project: every shot in ring order —
     each project's shots already stand together — the open project's large
     and the rest small, the pressed shot's middle at the middle of the
     screen */
  const strip = React.useMemo(() => {
    if (!geo || project === null || sel === null) return null;
    const xs: number[] = [];
    let x = 0;
    frames.forEach((f, i) => {
      const big = f.project === project;
      const w = big ? geo.bigW : geo.smallH * 1.6;
      if (i > 0) x += big || frames[i - 1]!.project === project ? 24 : 10;
      xs.push(x + w / 2);
      x += w;
    });
    const shift = geo.W / 2 - xs[sel]!;
    /* the loop's length: the strip, and the gap that closes it */
    return { xs: xs.map((v) => v + shift), len: x + 24 };
  }, [geo, project, sel, frames]);

  /* ── the loop ───────────────────────────────────────────────────────── */
  React.useEffect(() => {
    const g = geo;
    if (!g) return;
    still.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ringPose = (i: number, now: number): Pose => {
      const p = still.current ? 1 : ease(clamp((now - entered.current - i * STAGGER) / ENTER, 0, 1));
      /* start at the top and go round clockwise */
      const th = angle.current + (i / n) * TAU - Math.PI / 2;
      const rr = g.r * (0.72 + 0.28 * p);
      return { x: g.cx + Math.cos(th) * rr, y: g.cy + Math.sin(th) * rr, s: (g.ringW / g.bigW) * (0.5 + 0.5 * p) };
    };
    /* ── the strip has no ends ───────────────────────────────────────
       It is a loop: each shot's place is taken round the loop's length, so
       travelling either way never runs out — the shots that leave one
       side come back on the other, as the ring's own did. The loop is
       always far longer than the screen, so the seam is never in view. */
    const stripPose = (i: number): Pose => {
      const L = strip!.len;
      const x = g.W / 2 + ((((strip!.xs[i]! + pan.current - g.W / 2 + L / 2) % L) + L) % L) - L / 2;
      if (frames[i]!.project === project) return { x, y: g.top + g.bigH / 2, s: 1 };
      const h = g.smallH;
      return { x, y: g.foot - h / 2, s: h / g.bigH };
    };
    const paint = (now: number, dt: number) => {
      const m = mode.current;
      const since = now - m.at;
      for (let i = 0; i < n; i++) {
        const el = shots.current[i];
        if (!el) continue;
        const target = m.sel === null || !strip ? ringPose(i, now) : stripPose(i);
        let cur = poses.current[i];
        /* each shot waits its turn in the wave, then eases to its place;
           once the ring has settled it simply follows the ring */
        const wait = still.current ? 0 : Math.abs(i - m.from) * WAVE;
        /* a shot carried round the loop's seam jumps by the loop's length
           off screen, rather than flying back across it */
        if (cur && m.sel !== null && strip && Math.abs(target.x - cur.x) > strip.len / 2) {
          cur = { ...cur, x: cur.x + Math.sign(target.x - cur.x) * strip.len };
        }
        if (!cur || still.current || (m.sel === null && since > 2600)) cur = target;
        else if (since > wait) {
          /* heavy while it opens or changes project; once there, the strip
             follows the hand closely, so travelling along it feels direct */
          const k = 1 - Math.exp(-dt * (m.sel !== null && since > 1800 ? 16 : SETTLE));
          cur = { x: cur.x + (target.x - cur.x) * k, y: cur.y + (target.y - cur.y) * k, s: cur.s + (target.s - cur.s) * k };
        }
        poses.current[i] = cur;
        const ringIn = still.current ? 1 : ease(clamp((now - entered.current - i * STAGGER) / ENTER, 0, 1));
        el.style.transform = `translate(${(cur.x - g.bigW / 2).toFixed(1)}px, ${(cur.y - g.bigH / 2).toFixed(1)}px) scale(${cur.s.toFixed(4)})`;
        el.style.opacity = ringIn.toFixed(3);
      }
    };
    if (!entered.current) {
      entered.current = performance.now();
      /* the ring comes in turning, and settles into its drift */
      if (!still.current) vel.current = -0.9;
    }
    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      if (!hand.current && mode.current.sel !== null && Math.abs(panVel.current) > 1) {
        /* let go of the strip and it coasts on, slowing */
        pan.current += panVel.current * dt;
        panVel.current *= Math.pow(COAST, dt * 60);
      }
      if (!hand.current && mode.current.sel === null) {
        /* the coast decays toward the drift; pointing at a shot holds the
           ring still under it */
        const rest = mode.current.held || still.current ? 0 : DRIFT;
        vel.current = rest + (vel.current - rest) * Math.pow(COAST, dt * 60);
        angle.current += vel.current * dt;
      }
      /* a hidden tab draws nothing, and picks up where it was */
      if (!document.hidden) paint(now, dt);
      /* ── the project follows the middle ─────────────────────────────
         Travelling along the strip, whichever shot comes to rest nearest
         the middle of the screen opens its project, once the strip has
         stopped moving: its shots grow, the last project's shrink, and
         the words above change, on the same heavy settle as opening — so
         every project gets its turn at full size, one after another. */
      const m = mode.current;
      if (m.sel !== null && strip && !hand.current && Math.abs(panVel.current) < 40 && now - travelled.current > 220 && now - m.at > 1200) {
        let best = -1;
        let gap = Infinity;
        for (let i = 0; i < n; i++) {
          const q = poses.current[i];
          if (!q) continue;
          const d = Math.abs(q.x - g.cx);
          if (d < gap) {
            gap = d;
            best = i;
          }
        }
        if (best >= 0 && frames[best]!.project !== project) {
          carry.current = poses.current[best]!.x - g.cx;
          m.at = now;
          setSel(best);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [geo, n, strip, frames, project]);

  /* ── the hand ─────────────────────────────────────────────────────────
     On the ring a mouse turns it by the angle it travels round the middle,
     which is what grabbing a ring is, and a finger by how far it moves.
     On the strip both simply travel along it. */
  const angleAt = (x: number, y: number) => {
    const b = stage.current!.getBoundingClientRect();
    return Math.atan2(y - b.top - (geo?.cy ?? 0), x - b.left - (geo?.cx ?? 0));
  };
  /* the strip is a loop, so travel along it has no limit */
  const travel = (d: number) => {
    pan.current += d;
    travelled.current = performance.now();
  };
  const down = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    turned.current = false;
    panVel.current = 0;
    hand.current = { id: e.pointerId, touch: e.pointerType === "touch", a: angleAt(e.clientX, e.clientY), x: e.clientX, y: e.clientY, t: e.timeStamp, moved: false };
  };
  const move = (e: React.PointerEvent) => {
    const g = hand.current;
    if (!g || g.id !== e.pointerId || !geo) return;
    const dx = e.clientX - g.x;
    const dy = e.clientY - g.y;
    let d = 0;
    if (sel !== null) d = dx;
    else if (g.touch) d = (Math.abs(dx) > Math.abs(dy) ? dx : -dy) / geo.r;
    else {
      const a = angleAt(e.clientX, e.clientY);
      d = Math.atan2(Math.sin(a - g.a), Math.cos(a - g.a));
      g.a = a;
    }
    g.x = e.clientX;
    g.y = e.clientY;
    if (!g.moved && Math.abs(sel !== null ? d : d * geo.r) > 3) {
      g.moved = true;
      setTouched(true);
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        /* a scripted pointer */
      }
    }
    if (!g.moved) return;
    if (sel !== null) {
      travel(d);
      const ms = Math.max(1, e.timeStamp - g.t) / 1000;
      g.t = e.timeStamp;
      panVel.current = panVel.current * 0.5 + (d / ms) * 0.5;
      return;
    }
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
    panVel.current = g.moved ? clamp(panVel.current, -3000, 3000) : 0;
  };

  /* ── the scroll ───────────────────────────────────────────────────────
     On the ring it turns it, down clockwise, as a push on its speed so a
     flick coasts and a slow scroll creeps. Open, it travels the strip. A
     native, non-passive listener, because the page must not also scroll. */
  React.useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      const d = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * (e.deltaMode === 1 ? 16 : 1);
      if (mode.current.sel !== null) {
        panVel.current = 0;
        travel(-d);
        return;
      }
      vel.current = clamp(vel.current + d * SCROLL * 60, -6, 6);
      setTouched(true);
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  });

  const press = (i: number) => {
    if (turned.current) {
      turned.current = false;
      return;
    }
    setTouched(true);
    setNear(null);
    setSel(i);
  };
  const shut = React.useCallback(() => setSel(null), []);

  /* Escape rolls it up; the arrows step along the strip */
  React.useEffect(() => {
    if (sel === null) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") shut();
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        setSel((o) => (o === null ? o : (o + (e.key === "ArrowRight" ? 1 : -1) + n) % n));
      }
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [sel, n, shut]);

  const f = near === null ? null : frames[near]!;
  const info = project ? PROJECTS[project] : null;
  const count = new Set(frames.map((x) => x.project)).size;

  return (
    <div
      ref={stage}
      className="ring"
      data-open={sel !== null || undefined}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
    >
      <div className="ring-mid" aria-live="polite">
        <div key={f ? near! : "work"} className="ring-say">
          {f ? (
            <>
              <p className="ring-name">{f.title}</p>
              <p className="ring-sub">{f.project}</p>
            </>
          ) : (
            <>
              <h1 className="ring-name">Work</h1>
              <p className="ring-sub">
                {n} shots from {count} projects
              </p>
              <p className="ring-hint" data-gone={touched || undefined}>
                Scroll or drag to turn it; press a shot to open it
              </p>
            </>
          )}
        </div>
      </div>

      {/* ── the project, above the strip ─────────────────────────────── */}
      {info && (
        <div key={info.name} className="ring-info" role="region" aria-label={info.name}>
          <button type="button" className="ring-close" onClick={shut}>
            Close
          </button>
          <dl className="ring-facts">
            <div>
              <dt>Project</dt>
              <dd>{info.name}</dd>
            </div>
            <div>
              <dt>Role</dt>
              {info.role.map((r) => (
                <dd key={r}>{r}</dd>
              ))}
            </div>
          </dl>
          <div className="ring-about">
            <h2>About</h2>
            <p>{info.about}</p>
            {info.href && (
              <p className="ring-go">
                {info.href.startsWith("/") ? (
                  <Link href={info.href}>Read it</Link>
                ) : (
                  <a href={info.href}>Visit {new URL(info.href).hostname.replace(/^www\./, "")}</a>
                )}
              </p>
            )}
          </div>
        </div>
      )}

      {frames.map((x, i) => {
        const big = project === x.project;
        return (
          <button
            key={x.id}
            ref={(el) => {
              shots.current[i] = el;
            }}
            type="button"
            className="ring-shot"
            data-near={(sel === null && near === i) || undefined}
            data-big={big || undefined}
            data-dim={(sel !== null && !big) || undefined}
            style={geo ? { width: geo.bigW, height: geo.bigH } : { visibility: "hidden" }}
            aria-label={`${x.title}, ${x.project}`}
            onPointerEnter={() => sel === null && setNear(i)}
            onPointerLeave={() => setNear((v) => (v === i ? null : v))}
            onFocus={() => sel === null && setNear(i)}
            onBlur={() => setNear((v) => (v === i ? null : v))}
            onClick={() => press(i)}
            onMouseEnter={() => {
              /* the large one, fetched before it is asked for */
              const im = new Image();
              im.src = `/work/ring/${x.id}.jpg`;
            }}
          >
            <img src={big ? `/work/ring/${x.id}.jpg` : `/work/ring/${x.id}-t.jpg`} alt="" width={1280} height={800} draggable={false} />
          </button>
        );
      })}
    </div>
  );
}
