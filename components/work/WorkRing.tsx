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
   the foot of the screen, every shot in its ring order, the pressed one
   in the middle. The strip is a magnifier: the nearer a shot is to the
   middle the larger it is, those out at the ends small, every one
   standing whole on the same line a little above the bottom edge. The words come in above: a way
   back, the project, the role, and what it is — of whichever shot is in
   the middle. Scroll or drag to travel along it, and each shot swells as
   it passes the middle and the words change as the projects do; press a
   shot to glide it to the middle; Close, or Escape, rolls the strip back
   up into the ring. The shots
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

/* ── the open strip is a magnifier ──────────────────────────────────
   How much larger the shot in the middle is than the shots out at the
   ends. */
const MAG = 2.4;

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
/* the error function, to a few parts in a hundred thousand: the area
   under the magnifier's bell, which is where each shot is pushed to */
const erf = (x: number) => {
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return x < 0 ? -y : y;
};
/* how much a shot is magnified, u from the middle along the plain strip */
const magAt = (u: number, sigma: number) => 1 + (MAG - 1) * Math.exp(-(u * u) / (2 * sigma * sigma));
/* where it is drawn: every shot's room grows with it, so the room up to
   it is the area under the bell, and nothing ever overlaps */
const reach = (u: number, sigma: number) => u + (MAG - 1) * sigma * Math.sqrt(Math.PI / 2) * erf(u / (sigma * Math.SQRT2));
/* a place on a loop of length L, taken into the half either side of 0 */
const wrap = (v: number, L: number) => ((((v + L / 2) % L) + L) % L) - L / 2;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

type Pose = { x: number; y: number; s: number };
type Geo = {
  W: number;
  H: number;
  cx: number;
  cy: number;
  r: number;
  ringW: number;
  bigW: number;
  bigH: number;
  smallH: number;
  /* one shot's room on the plain strip, the bell's width, and the whole
     loop's length as drawn */
  slot: number;
  sigma: number;
  span: number;
  base: number;
};

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
      /* the strip: a row of shots standing on the foot of the screen, the
         one in the middle the largest, MAG times the ones out at the ends */
      const bigW = narrow ? W * 0.74 : Math.min(W * 0.34, H * 0.5 * 1.6);
      const bigH = bigW / 1.6;
      const slot = bigW / MAG + (narrow ? 6 : 10);
      /* the line every shot stands on, clear of the bottom edge */
      const base = H - clamp(H * 0.08, 28, 72);
      const sigma = slot * 1.15;
      const span = 2 * reach((slot * n) / 2, sigma);
      setGeo({ W, H, cx: W / 2, cy: H / 2, r, ringW, bigW, bigH, smallH: bigH / MAG, slot, sigma, span, base });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [n]);

  /* the shot pointed at or focused, and the shot whose project is open */
  const [near, setNear] = React.useState<number | null>(null);
  const [sel, setSel] = React.useState<number | null>(null);
  /* open, the shot in the middle of the strip: its project is the one
     the words above name */
  const [centre, setCentre] = React.useState(0);
  const [touched, setTouched] = React.useState(false);
  const project = sel === null ? null : frames[centre]!.project;

  /* the loop's state, all refs: the ring's angle and speed, the hand, the
     strip's travel, and each shot's pose as last drawn */
  const angle = React.useRef(0);
  const vel = React.useRef(0);
  /* the strip's travel, counted in shots: at a whole number -k, shot k is
     in the middle. Where it is gliding to, when a shot is pressed or
     stepped to, and when it was last moved by hand or wheel. */
  const pan = React.useRef(0);
  const panVel = React.useRef(0);
  const panTo = React.useRef<number | null>(null);
  const travelled = React.useRef(0);
  const middle = React.useRef({ at: 0, i: 0, since: 0 });
  const full = React.useRef<boolean[]>([]);
  const hand = React.useRef<null | { id: number; touch: boolean; a: number; x: number; y: number; t: number; moved: boolean }>(null);
  const turned = React.useRef(false);
  const entered = React.useRef(0);
  const still = React.useRef(false);
  const poses = React.useRef<(Pose | null)[]>([]);
  /* what the loop needs to know of React's state */
  const mode = React.useRef({ sel: null as number | null, from: 0, at: 0, held: false });

  React.useEffect(() => {
    const m = mode.current;
    if ((m.sel === null) !== (sel === null)) {
      /* the wave starts from the shot pressed, or, going home, from the
         one in the middle */
      m.from = sel ?? middle.current.at;
      m.at = performance.now();
      if (sel !== null) {
        /* the pressed shot opens in the middle */
        pan.current = -sel;
        panVel.current = 0;
        panTo.current = null;
        middle.current = { at: sel, i: sel, since: 0 };
      }
    }
    m.sel = sel;
    m.held = near !== null || sel !== null;
  }, [sel, near]);

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
    /* ── the strip has no ends, and magnifies its middle ────────────
       Each shot has a place on a plain loop, one slot each, taken round
       the loop so travelling either way never runs out. Drawn, the loop is
       bent through a magnifier: a shot grows the nearer it comes to the
       middle, up to MAG times the size of the ones at the ends, and its
       room grows with it, so the row swells round the middle and nothing
       overlaps. Every shot, large or small, stands whole on one line a
       little above the bottom edge, so the row reads as one even line
       however far it has travelled. Travelling, a shot grows as it comes
       in and shrinks as it goes, all the way along — never a jump between
       two sizes. */
    const stripPose = (i: number): Pose => {
      const u = wrap((i + pan.current) * g.slot, g.slot * n);
      const h = g.smallH * magAt(u, g.sigma);
      return { x: g.cx + reach(u, g.sigma), y: g.base - h / 2, s: h / g.bigH };
    };
    const paint = (now: number, dt: number) => {
      const m = mode.current;
      const since = now - m.at;
      for (let i = 0; i < n; i++) {
        const el = shots.current[i];
        if (!el) continue;
        const open = m.sel !== null;
        const target = open ? stripPose(i) : ringPose(i, now);
        let cur = poses.current[i];
        /* each shot waits its turn in the wave, then eases to its place;
           once the ring has settled it simply follows the ring */
        const wait = still.current ? 0 : Math.abs(i - m.from) * WAVE;
        /* a shot carried round the loop's seam jumps by the loop's length
           off screen, rather than flying back across it */
        if (cur && open && Math.abs(target.x - cur.x) > g.span / 2) {
          cur = { ...cur, x: cur.x + Math.sign(target.x - cur.x) * g.span };
        }
        if (!cur || still.current || (m.sel === null && since > 2600)) cur = target;
        else if (since > wait) {
          /* heavy while it opens or changes project; once there, the strip
             follows the hand closely, so travelling along it feels direct */
          const k = 1 - Math.exp(-dt * (open && since > 1800 ? 16 : SETTLE));
          cur = { x: cur.x + (target.x - cur.x) * k, y: cur.y + (target.y - cur.y) * k, s: cur.s + (target.s - cur.s) * k };
        }
        poses.current[i] = cur;
        const ringIn = still.current ? 1 : ease(clamp((now - entered.current - i * STAGGER) / ENTER, 0, 1));
        el.style.transform = `translate(${(cur.x - g.bigW / 2).toFixed(1)}px, ${(cur.y - g.bigH / 2).toFixed(1)}px) scale(${cur.s.toFixed(4)})`;
        /* open, the shots out at the ends fade a little into the sky, and
           the larger stand in front of the smaller */
        const grown = clamp((cur.s * MAG - 1) / (MAG - 1), 0, 1);
        el.style.opacity = (ringIn * (open ? 0.6 + 0.4 * grown : 1)).toFixed(3);
        el.style.zIndex = open ? String(10 + Math.round(grown * 80)) : "";
        /* drawn large, a shot swaps its thumbnail for the full picture, and
           keeps it */
        if (open && grown > 0.25 && !full.current[i]) {
          full.current[i] = true;
          const img = el.querySelector("img");
          if (img) img.src = `/work/ring/${frames[i]!.id}.jpg`;
        }
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
      const m = mode.current;
      if (m.sel !== null && !hand.current) {
        if (panTo.current !== null) {
          /* gliding to a shot pressed or stepped to */
          const d = panTo.current - pan.current;
          if (Math.abs(d) < 0.002) {
            pan.current = panTo.current;
            panTo.current = null;
          } else pan.current += d * (1 - Math.exp(-dt * 5));
        } else if (Math.abs(panVel.current) > 0.05) {
          /* let go of the strip and it coasts on, slowing */
          pan.current += panVel.current * dt;
          panVel.current *= Math.pow(COAST, dt * 60);
        } else if (now - travelled.current > 260) {
          /* and once it has stopped, the nearest shot settles into the
             middle */
          panVel.current = 0;
          if (Math.abs(pan.current - Math.round(pan.current)) > 0.002) panTo.current = Math.round(pan.current);
        }
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
         Whichever shot is in the middle names the project above, once it
         has been there a moment, so a fast fling does not flicker the
         words through every project it passes. */
      if (m.sel !== null) {
        const c = middle.current;
        const i = ((Math.round(-pan.current) % n) + n) % n;
        if (i !== c.i) {
          c.i = i;
          c.since = now;
        } else if (i !== c.at && now - c.since > 140) {
          c.at = i;
          setCentre(i);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [geo, n, frames]);

  /* ── the hand ─────────────────────────────────────────────────────────
     On the ring a mouse turns it by the angle it travels round the middle,
     which is what grabbing a ring is, and a finger by how far it moves.
     On the strip both simply travel along it. */
  const angleAt = (x: number, y: number) => {
    const b = stage.current!.getBoundingClientRect();
    return Math.atan2(y - b.top - (geo?.cy ?? 0), x - b.left - (geo?.cx ?? 0));
  };
  /* the strip is a loop, so travel along it has no limit */
  /* d in pixels: the shot in the middle keeps up with the hand */
  const travel = (d: number) => {
    if (!geo) return;
    pan.current += d / (geo.slot * MAG);
    panTo.current = null;
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
      panVel.current = panVel.current * 0.5 + (d / (geo.slot * MAG) / ms) * 0.5;
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
    panVel.current = g.moved ? clamp(panVel.current, -8, 8) : 0;
    travelled.current = performance.now();
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
    if (sel === null) {
      setCentre(i);
      setSel(i);
      return;
    }
    /* open, a press glides that shot to the middle, the short way round */
    glide(-i);
  };
  /* glide the strip so that the place p is in the middle, the short way */
  const glide = (p: number) => {
    const from = panTo.current ?? pan.current;
    panVel.current = 0;
    panTo.current = from + wrap(p - from, n);
  };
  const shut = React.useCallback(() => setSel(null), []);

  /* Escape rolls it up; the arrows step along the strip */
  React.useEffect(() => {
    if (sel === null) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") shut();
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const from = Math.round(panTo.current ?? pan.current);
        panVel.current = 0;
        panTo.current = from + (e.key === "ArrowRight" ? -1 : 1);
      }
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [sel, shut]);

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
        return (
          <button
            key={x.id}
            ref={(el) => {
              shots.current[i] = el;
            }}
            type="button"
            className="ring-shot"
            data-near={(sel === null && near === i) || undefined}
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
            {/* the thumbnail; the loop swaps in the full picture once the
                shot is drawn large */}
            <img src={`/work/ring/${x.id}-t.jpg`} alt="" width={1280} height={800} draggable={false} />
          </button>
        );
      })}
    </div>
  );
}
