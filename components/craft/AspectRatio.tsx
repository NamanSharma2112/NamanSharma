"use client";

import { useEffect, useRef, useState } from "react";

/* Adapted from Bencho's "Aspect ratio" block, MIT licensed —
   bencho.dev/licence. Here the three shapes are three screens. */

/* ── inlined from lab/motion ──────────────────────── */
/* ── elastic, as numbers a person can hold ─────────────────
   Several blocks here are the same idea in different clothes:
   something travels, stretches on the way, and overshoots
   when it lands. Their character lives in a duration and in
   one control point of a bezier — which is exactly the kind
   of thing nobody should have to name in order to tune.

   So the outside of every elastic knob is 0..100 and the
   inside is real units, and **50 is always what the component
   was already tuned to**. Turn every knob on the bench to the
   middle and nothing has changed. That is what makes these
   safe to expose: the default is not a number somebody has to
   remember, it is the middle of the slider.

   Both ends have to be shippable, which is the constraint
   that actually shapes these curves. The ranges below stop
   where the effect stops being the thing it is — a bar that
   moves in 40ms still reads as a bar snapping to a slot; one
   that moves in 20ms reads as broken. */

/* How long it takes, slower to faster, as a multiplier on
   whatever the component's own tuned duration is. 0 is a
   little over half again as slow, 100 is two and a half times
   as fast, 50 is exactly 1. */
const rate = (speed: number) => 1.6 - (speed / 100) * 1.2;

/* SHEEP was Bencho's own picture. Here there is one picture
   per shape: the Isomatric site screenshotted on each screen,
   at that screen's own size, in public/craft. */
const SHOTS = {
  pc: "/craft/pc.jpg",
  tablet: "/craft/tablet.jpg",
  phone: "/craft/phone.jpg",
} as const;

/* ══ Aspect ═══════════════════════════════════════════════
   One design and three screens to put it on.

   THE THREE FORMATS HAVE THE SAME AREA. That is the whole
   idea and it is not how most device switchers are built —
   the common version fixes the width and lets the height do
   whatever the ratio says, which means the phone is a sliver
   beside the desktop and switching feels like the design
   shrank rather than like it was re-laid out. Equal area is
   the fair comparison: the same amount of design, held a
   different way. At the full size, 258x161 (16:10), 177x235
   (3:4) and 138x300 (the phone's 390:845) are within half a
   per cent of each other.

   It also decides the frame. Every shape fits inside one
   300x300 square, so the block's bounding box is the biggest
   any of them gets and the page never rescales it mid-move.

   ONE PICTURE PER SCREEN. Bencho's version crops one picture
   three ways, because a crop is what it shows. A responsive
   layout is not a crop — the phone gets a different layout,
   not a slice of the desktop one — so each shape has its own
   screenshot taken at that screen's real size, and `cover`
   crops next to nothing once the frame arrives. The pictures
   cross-fade while the frame moves. */

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/* the square the three shapes fit inside, at full size; a
   smaller `side` scales all three together */
const FULL = 300;
const GAP = 16;
const BAR = 36;

const SHAPES = [
  { id: "phone", w: 138, h: 300, label: "Phone" },
  { id: "tablet", w: 177, h: 235, label: "Tablet" },
  { id: "pc", w: 258, h: 161, label: "Desktop" },
] as const;

/* ── the icons are the shapes ──────────────────────────────
   Drawn rather than imported, and lucide does ship a phone, a
   tablet and a monitor. The reason not to use them is that
   here the icon is not a symbol FOR the screen, it IS the
   screen's shape — so it has to be at the real ratio, and
   lucide's devices are at whatever ratio looked right in a
   24 grid.

   Same constant area as the pictures, for the same reason:
   three marks of visibly different size would say the
   screens get different amounts of the design, which is the
   thing the block is at pains to say they do not. 11 square,
   and the three are that area at each screen's ratio,
   centred in the 18 box. */
const MARK = {
  phone: { x: 5.27, y: 0.9, w: 7.47, h: 16.2 },
  tablet: { x: 4.24, y: 2.65, w: 9.53, h: 12.7 },
  pc: { x: 2.05, y: 4.65, w: 13.91, h: 8.7 },
} as const;

const BASE = 520;

export function AspectRatio({
  corner = 14,
  /* how quickly the frame changes shape, 0..100 — 50 is the
     tuned 520ms */
  morph = 50,
  /* the square the shapes fit in, px. FULL on a wide column,
     smaller on a phone */
  side = FULL,
  /* step through the three screens by itself until a hand picks
     one. The parent turns this off while it is being used */
  auto = false,
}: { corner?: number; morph?: number; side?: number; auto?: boolean } = {}) {
  const [at, setAt] = useState(2);

  /* ── playing by itself ──────────────────────────────────
     A screen every 2.4s: long enough to take in the layout once
     the frame has arrived, which is a little under half of that. */
  useEffect(() => {
    if (!auto) return;
    const id = window.setInterval(() => setAt((i) => (i + 1) % SHAPES.length), 2400);
    return () => window.clearInterval(id);
  }, [auto]);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const ms = Math.round(BASE * rate(clamp(morph, 0, 100)));
  const shape = SHAPES[at];
  const k = side / FULL;

  const pick = (i: number, focus = false) => {
    if (i === at) return;
    setAt(i);
    if (focus) tabs.current[i]?.focus();
  };

  /* ── arrows move the choice ──────────────────────────────
     One of the three is always chosen, which makes this a
     radio group rather than a row of buttons — and a radio
     group is driven with the arrow keys, with only the
     chosen one in the tab order. Tab reaches the control,
     arrows choose inside it. The arrows are taken here, so
     up and down do not also turn the page's chapter. */
  const key = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1
      : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1
      : 0;
    if (!d) return;
    e.preventDefault();
    pick((at + d + SHAPES.length) % SHAPES.length, true);
  };

  return (
    <div
      className="asp"
      style={{ width: side, height: side + GAP + BAR, ["--asp-ms" as string]: `${ms}ms` }}
    >
      {/* The stage is the full square and never changes, so
          the picture is centred in a box that is not moving.
          Sizing the stage to the picture instead would make
          the tabs below it climb and drop as the shape
          changed — the one thing on this block that has no
          business moving. */}
      <div className="asp-stage" style={{ height: side }}>
        {/* ── width and height, NEVER a scale ─────────────
            A scaled box drags its corner radius with it, and
            the corner has to read as the same rounded frame
            throughout rather than as a rectangle being
            stretched. `cover` is what keeps the picture
            itself undistorted while the frame moves. */}
        <div
          className="asp-pic"
          role="img"
          aria-label={`The Isomatric site on a ${shape.label.toLowerCase()}`}
          style={{
            width: Math.round(shape.w * k),
            height: Math.round(shape.h * k),
            borderRadius: clamp(corner, 0, 40),
          }}
        >
          {SHAPES.map((s, i) => (
            <span
              key={s.id}
              className="asp-shot"
              data-on={i === at || undefined}
              style={{ backgroundImage: `url(${SHOTS[s.id]})` }}
            />
          ))}
        </div>
      </div>

      <div className="asp-tabs" role="radiogroup" aria-label="Screen" onKeyDown={key}>
        {/* ── the thumb ───────────────────────────────────
            One element sliding, not three backgrounds fading.
            A fill that appears under the new tab while
            another disappears is two events; a thumb that
            travels is one, and it is the one that says these
            three are positions of the same control. */}
        <span
          className="asp-thumb"
          aria-hidden="true"
          style={{ transform: `translateX(${at * 100}%)` }}
        />
        {SHAPES.map((s, i) => {
          const m = MARK[s.id];
          return (
            <button
              key={s.id}
              ref={(el) => { tabs.current[i] = el; }}
              type="button"
              className="asp-tab"
              role="radio"
              aria-checked={i === at}
              aria-label={s.label}
              /* the chosen one is the only one in the tab
                 order — see the note on `key` */
              tabIndex={i === at ? 0 : -1}
              onClick={() => pick(i)}
            >
              <svg width={18} height={18} viewBox="0 0 18 18" aria-hidden="true">
                <rect
                  x={m.x}
                  y={m.y}
                  width={m.w}
                  height={m.h}
                  rx={2}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                />
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}
