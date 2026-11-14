"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { BotAvatar } from "bot-avatars";
import { useActivity } from "@/lib/island";

/* ══ The island ════════════════════════════════════════════════════════
   The site's one piece of navigation: a small dark pill at the top of
   every page with the ghost in it and the name of where you are. Reach
   for it — point at it, tab to it, tap it — and it swells into the three
   places there are, Home, Work and Writing, with a soft highlight that
   slides to whichever you are on or pointing at. Let go and it shrinks
   back to the ghost and the one word.

   ── IT MOVES LIKE SOMETHING WITH A BODY ───────────────────────────────
   Its width and height are not transitions on a curve but springs, with
   a little mass and a little give: it swells a hair past its new size and
   settles back, and if it is changed again halfway it carries its speed
   into the new change instead of starting over. While it is growing fast
   it stretches the way it is going and thins the other way, and comes
   back round as it slows — the stretch of a drop, not of a box. Pressed,
   it gives under the finger and springs back. A pointer near it draws it
   a few pixels toward itself. Left alone, a faint light round its edge
   breathes in and out, slowly. It is born a dot holding only the ghost
   and grows to its word when the page comes in.

   ── IT SHOWS WHAT IS GOING ON ─────────────────────────────────────────
   Like the phone's island, it holds a live activity when there is one: a
   page can hand it a label and a detail (the work page hands it the open
   project and which shot of it is in the middle), and it grows or
   shrinks to fit each change. Reading a piece of writing, a small ring
   beside the word fills as you go. Going somewhere new, it gives a beat
   — a quick swell and back — and the ghost hops.

   ── ONE SHAPE, TWO CONTENTS ───────────────────────────────────────────
   The two contents it can hold, both measured, never guessed, cross-fade
   through a blur inside it while it changes size; the ghost sits in the
   same place in both, so the eye has one thing that does not move. Under
   reduced motion it simply changes. */

const PLACES = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Writing" },
] as const;

const placeOf = (path: string) => (path.startsWith("/work") ? 1 : path.startsWith("/blog") ? 2 : 0);

/* shut it is a pill this tall; open it is a little taller, as the phone's
   is when it holds more */
const SHUT_H = 38;
const OPEN_H = 44;

/* a damped spring, one step: its place and speed move toward `to` */
type Spring = { x: number; v: number };
const step = (s: Spring, to: number, dt: number, k: number, c: number) => {
  s.v += (-k * (s.x - to) - c * s.v) * dt;
  s.x += s.v * dt;
};
const near = (s: Spring, to: number, e = 0.05) => Math.abs(s.x - to) < e && Math.abs(s.v) < e * 4;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function Island() {
  const path = usePathname() ?? "/";
  const at = placeOf(path);
  const reading = /^\/blog\/[^/]+/.test(path);
  const activity = useActivity();
  const [open, setOpen] = React.useState(false);
  const [aim, setAim] = React.useState<number | null>(null);
  const [hop, setHop] = React.useState(false);
  const root = React.useRef<HTMLElement>(null);
  const now = React.useRef<HTMLSpanElement>(null);
  const nav = React.useRef<HTMLSpanElement>(null);
  const ring = React.useRef<SVGCircleElement>(null);
  const links = React.useRef<(HTMLAnchorElement | null)[]>([]);
  const [pill, setPill] = React.useState<{ x: number; w: number } | null>(null);

  /* where the springs are going, and what wakes them */
  const target = React.useRef({ w: SHUT_H, h: SHUT_H, s: 1, lx: 0, ly: 0 });
  const body = React.useRef({ wake: () => {}, beat: () => {} });

  /* ── the size it should be ────────────────────────────────────────────
     Measured from whichever content it is showing, every time that
     content changes: a new place, a new activity, opening and shutting. */
  const label = activity ? `${activity.label}·${activity.detail ?? ""}` : "";
  React.useLayoutEffect(() => {
    const fit = () => {
      const t = target.current;
      const el = open ? nav.current : now.current;
      if (el) t.w = el.scrollWidth;
      t.h = open ? OPEN_H : SHUT_H;
      body.current.wake();
    };
    fit();
    document.fonts?.ready.then(fit);
  }, [open, at, label, reading]);

  /* the highlight goes to what is pointed at, else to where you are */
  const lit = aim ?? at;
  React.useLayoutEffect(() => {
    const a = links.current[lit];
    if (a) setPill({ x: a.offsetLeft, w: a.offsetWidth });
  }, [lit, open]);

  /* ── the body: one loop, awake only while something is moving ───────── */
  React.useEffect(() => {
    const el = root.current;
    if (!el) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = target.current;
    /* born a dot that holds only the ghost */
    const W: Spring = { x: SHUT_H, v: 0 };
    const H: Spring = { x: SHUT_H, v: 0 };
    const S: Spring = { x: 1, v: 0 };
    const LX: Spring = { x: 0, v: 0 };
    const LY: Spring = { x: 0, v: 0 };
    const draw = () => {
      el.style.width = `${W.x.toFixed(2)}px`;
      el.style.height = `${H.x.toFixed(2)}px`;
      /* growing fast it stretches along and thins across, like a drop */
      const st = still ? 0 : clamp(W.v / 9000, -0.035, 0.035);
      el.style.transform = `translate(${LX.x.toFixed(2)}px, ${LY.x.toFixed(2)}px) scale(${(S.x * (1 + st)).toFixed(4)}, ${(S.x * (1 - st * 0.8)).toFixed(4)})`;
    };
    let raf = 0;
    let prev = 0;
    const tick = (time: number) => {
      const dt = Math.min(1 / 30, (time - prev) / 1000);
      prev = time;
      /* size: soft, a little under-damped, so it overshoots by a hair */
      step(W, t.w, dt, 170, 19);
      step(H, t.h, dt, 170, 19);
      /* the give under a finger and the beat: quicker, bouncier */
      step(S, t.s, dt, 380, 15);
      /* the lean toward a pointer: slow and loose */
      step(LX, t.lx, dt, 90, 14);
      step(LY, t.ly, dt, 90, 14);
      draw();
      if (near(W, t.w) && near(H, t.h) && near(S, t.s, 0.001) && near(LX, t.lx) && near(LY, t.ly)) {
        W.x = t.w;
        H.x = t.h;
        S.x = t.s;
        LX.x = t.lx;
        LY.x = t.ly;
        W.v = H.v = S.v = LX.v = LY.v = 0;
        draw();
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (still) {
        W.x = t.w;
        H.x = t.h;
        S.x = 1;
        draw();
        return;
      }
      if (!raf) {
        prev = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    body.current = {
      wake,
      /* a beat: a push outward that the spring brings back */
      beat: () => {
        S.v += 1.4;
        wake();
      },
    };
    /* the page has just come in: grow from the dot, a breath after */
    const born = window.setTimeout(wake, 160);
    draw();

    /* a pointer near it draws it a few pixels toward itself */
    const lean = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const b = el.getBoundingClientRect();
      const dx = e.clientX - (b.left + b.width / 2);
      const dy = e.clientY - (b.top + b.height / 2);
      const reach = Math.hypot(Math.max(0, Math.abs(dx) - b.width / 2), Math.max(0, Math.abs(dy) - b.height / 2));
      const pull = reach < 140 ? 1 - reach / 140 : 0;
      const lx = clamp(dx * 0.03, -5, 5) * pull;
      const ly = clamp(dy * 0.06, -3, 3) * pull;
      if (Math.abs(lx - t.lx) > 0.05 || Math.abs(ly - t.ly) > 0.05) {
        t.lx = lx;
        t.ly = ly;
        wake();
      }
    };
    if (!still) addEventListener("pointermove", lean, { passive: true });
    return () => {
      window.clearTimeout(born);
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", lean);
    };
  }, []);

  /* ── a beat and a hop on arriving somewhere new, and it closes ─────── */
  const first = React.useRef(true);
  React.useEffect(() => {
    setOpen(false);
    setAim(null);
    if (first.current) {
      first.current = false;
      return;
    }
    body.current.beat();
    setHop(true);
    const id = window.setTimeout(() => setHop(false), 900);
    return () => window.clearTimeout(id);
  }, [path]);

  /* the ghost hops when the activity changes, too: it noticed */
  const seen = React.useRef(label);
  React.useEffect(() => {
    if (seen.current === label) return;
    const was = seen.current;
    seen.current = label;
    /* a new project is news; only the shot number moving on is not */
    if (was.split("·")[0] === label.split("·")[0]) return;
    setHop(true);
    const id = window.setTimeout(() => setHop(false), 700);
    return () => window.clearTimeout(id);
  }, [label]);

  /* ── reading: the ring fills as the page is read ──────────────────── */
  React.useEffect(() => {
    if (!reading) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const room = document.documentElement.scrollHeight - innerHeight;
      const p = room > 0 ? clamp(scrollY / room, 0, 1) : 1;
      ring.current?.style.setProperty("stroke-dashoffset", String(1 - p));
      root.current?.toggleAttribute("data-done", p > 0.995);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", on);
      removeEventListener("resize", on);
    };
  }, [reading, path]);

  /* a tap outside puts it away again */
  React.useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("keydown", key);
    };
  }, [open]);

  /* pressed, it gives a little under the finger */
  const press = (on: boolean) => {
    target.current.s = on ? 0.94 : 1;
    body.current.wake();
  };

  return (
    <nav
      ref={root}
      className="island"
      aria-label="Site"
      data-open={open || undefined}
      data-hop={hop || undefined}
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => {
        press(false);
        if (e.pointerType !== "mouse") return;
        setOpen(false);
        setAim(null);
      }}
      onPointerDown={() => press(true)}
      onPointerUp={() => press(false)}
      onPointerCancel={() => press(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setOpen(false);
          setAim(null);
        }
      }}
    >
      {/* the light round its edge, breathing */}
      <span className="island-glow" aria-hidden="true" />
      <span className="island-clip">
        <span className="island-ghost" aria-hidden="true">
          <BotAvatar type="ghost" color="#8cb2ff" size={22} state={hop || open ? "working" : "default"} jumpHeight={10} jumpStretch={0.5} />
        </span>

        {/* shut: the ghost and where you are, or what is going on; a tap
            opens it on a phone */}
        <span ref={now} className="island-now" aria-hidden={open}>
          <button type="button" className="island-here" tabIndex={-1} onClick={() => setOpen(true)}>
            {activity ? (
              <span key={activity.label} className="island-say">
                {activity.label}
                {activity.detail && <span className="island-detail">{activity.detail}</span>}
              </span>
            ) : (
              <span key={PLACES[at].label} className="island-say">
                {PLACES[at].label}
              </span>
            )}
            {reading && !activity && (
              <svg className="island-ring" viewBox="0 0 16 16" width={16} height={16} aria-hidden="true">
                <circle cx="8" cy="8" r="6.25" pathLength={1} />
                <circle ref={ring} cx="8" cy="8" r="6.25" pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
              </svg>
            )}
          </button>
        </span>

        {/* open: the three places, and the highlight sliding between them */}
        <span ref={nav} className="island-nav" aria-hidden={!open}>
          {pill && <span className="island-pill" style={{ transform: `translateX(${pill.x}px)`, width: pill.w }} aria-hidden="true" />}
          {PLACES.map((p, i) => (
            <Link
              key={p.href}
              ref={(el) => {
                links.current[i] = el;
              }}
              href={p.href}
              className="island-link"
              aria-current={i === at ? "page" : undefined}
              tabIndex={0}
              onPointerEnter={() => setAim(i)}
              onFocus={() => setAim(i)}
              onClick={() => setOpen(false)}
            >
              {p.label}
            </Link>
          ))}
        </span>
      </span>
    </nav>
  );
}
