"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "motion/react";
import { playAccept, playSwipe } from "@/lib/sounds";

/**
 * The gate: a boarding pass, a reader, and one gesture between you and the
 * site.
 *
 * The pass is dragged down through the slot rather than clicked, so it moves
 * with the pointer and nothing else — the reader only reacts once the card has
 * actually passed the head. Let go short of it and the card springs back to
 * the hand, which is the whole reason it is a drag and not a button.
 *
 * There is always a way past: a skip control, Escape, Enter, and it only ever
 * runs once per session.
 */

const SEEN = "boarded";

/** How far down the card has to travel before the reader reads it. */
const THROW = 190;
/** Where the slot sits relative to the card's resting place. */
const SLOT = 150;
/** Close enough that the reader wakes up and shows where to put the card. */
const ARMED = 60;

type Phase = "ready" | "reading" | "accepted";

export default function BoardingPass({
  /** The page may start arriving — called as the gate begins to clear. */
  onDone,
  /** The gate is finished with and can be taken out of the DOM. */
  onExited,
}: {
  onDone: () => void;
  onExited: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [hint, setHint] = useState(false);
  const [armed, setArmed] = useState(false);
  /** Set by every way out — swiping, skipping, Escape — so all of them fade
      and unmount through the same path. Skipping used to call onDone without
      ever starting the exit, which left the gate mounted at full opacity with
      its scroll lock still on and the page frozen underneath. */
  const [leaving, setLeaving] = useState(false);
  const done = useRef(false);
  const finish = useRef(onDone);
  const exited = useRef(onExited);

  const y = useMotionValue(0);
  const travelled = useRef(0);

  useEffect(() => {
    finish.current = onDone;
    exited.current = onExited;
  }, [onDone, onExited]);

  useMotionValueEvent(y, "change", (value) => {
    travelled.current = value;
    // The reader notices the card coming before it arrives.
    setArmed(value > ARMED);
  });

  const leave = useCallback(() => {
    if (done.current) return;
    done.current = true;
    try {
      sessionStorage.setItem(SEEN, "true");
    } catch {
      // A locked-down browser just means the gate runs again next time.
    }
    // The page starts arriving now, behind the gate as it clears — the two
    // overlap into one movement rather than a pause between them.
    setLeaving(true);
    finish.current();
  }, []);

  const accept = useCallback(() => {
    if (done.current || phase !== "ready") return;
    setPhase("reading");
    playSwipe();
    window.setTimeout(() => {
      setPhase("accepted");
      playAccept();
    }, 460);
    window.setTimeout(leave, 950);
  }, [leave, phase]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") leave();
      if (e.key === "Enter" || e.key === " ") accept();
    };
    window.addEventListener("keydown", onKey);
    const nudge = window.setTimeout(() => setHint(true), 4000);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(nudge);
    };
  }, [accept, leave]);

  return (
    <motion.div
      className="gate fixed inset-0 z-[150] flex flex-col items-center justify-center px-6"
      initial={{ opacity: 1 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      onAnimationComplete={() => leaving && exited.current()}
      style={{ pointerEvents: leaving ? "none" : "auto" }}
    >
      {/* Locks the document while the gate is up, so nothing scrolls behind it
          and no scrollbar sits beside a full-screen panel. Dropped the moment
          the card is on its way, so the page underneath is free before the
          sheet has finished clearing. */}
      {!leaving && <div data-fixed-screen hidden />}

      <div className="relative flex flex-col items-center">
        {/* Where the card is swallowed: it is clipped at the slot line, so it
            goes in and stays in. Without it the card travels further than the
            machine is tall and comes back out the underside. */}
        <div className="pass-throat">
          <motion.div
            drag={phase === "ready" ? "y" : false}
            dragConstraints={{ top: 0, bottom: SLOT + 60 }}
            dragElastic={0.05}
            dragMomentum={false}
            onDragEnd={() => {
              if (travelled.current > THROW) accept();
              else y.set(0);
            }}
            style={{ y }}
            animate={
              phase === "ready"
                ? {}
                : {
                    y: SLOT + 78,
                    opacity: 0,
                    scale: 0.97,
                    transition: { duration: 0.36, ease: [0.23, 1, 0.32, 1] },
                  }
            }
            // Behind the reader on purpose: dragging the card down slides it in
            // under the lip, which is what being inserted looks like. In front,
            // it just covers the machine and hides everything it is doing.
            className="relative z-0 cursor-grab active:cursor-grabbing"
            aria-hidden
          >
            <TiltingPass />
          </motion.div>
        </div>

        <Reader phase={phase} armed={armed} />
      </div>

      <p className="mt-8 text-center text-[13.5px] text-zinc-500 dark:text-zinc-400">
        {phase === "accepted" ? "Boarding" : "Swipe the boarding pass to enter"}
      </p>

      <button
        type="button"
        onClick={accept}
        className={`mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400 underline-offset-4 transition-opacity hover:underline ${
          hint && phase === "ready" ? "opacity-100" : "opacity-0"
        }`}
      >
        or press enter
      </button>

      <button
        type="button"
        onClick={leave}
        className="absolute bottom-8 right-8 text-[13px] text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
      >
        Skip
      </button>
    </motion.div>
  );
}

/* ── the card, given thickness ──────────────────────────────────────────── */

/** How far the card leans, in degrees, at the far edge of its own surface. */
const LEAN = 13;
/** How far it travels toward the cursor with the lean, in px. */
const SHIFT = 9;

/**
 * The pass, tilted by wherever the pointer is over it.
 *
 * Separate from the drag wrapper on purpose: one element cannot be both the
 * thing being dragged along Y and the thing being rotated by a pointer without
 * the two writing over each other's transform. The outer element moves, this
 * one leans, and the light on its face follows the lean.
 */
function TiltingPass() {
  const box = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  // Springs, because this is a value the pointer drives and can reverse at any
  // moment — a duration would keep animating to a target that has already moved.
  const spring = { stiffness: 170, damping: 18, mass: 0.4 };
  const rx = useSpring(useTransform(py, [0, 1], [LEAN, -LEAN]), spring);
  const ry = useSpring(useTransform(px, [0, 1], [-LEAN, LEAN]), spring);

  // The card also shifts a little toward the cursor. Leaning alone reads as a
  // picture on a hinge; a few pixels of travel with it is what makes it feel
  // like an object being handled.
  const tx = useSpring(useTransform(px, [0, 1], [-SHIFT, SHIFT]), spring);
  const ty = useSpring(useTransform(py, [0, 1], [SHIFT, -SHIFT]), spring);

  // The highlight sits where the light would catch, opposite the lean.
  const sheenX = useTransform(px, [0, 1], ["120%", "-20%"]);
  const sheenY = useTransform(py, [0, 1], ["120%", "-20%"]);
  const sheen = useMotionTemplate`radial-gradient(60% 120% at ${sheenX} ${sheenY}, rgba(255,255,255,0.75), rgba(255,255,255,0.16) 38%, transparent 68%)`;

  const track = (e: React.PointerEvent) => {
    const node = box.current;
    if (!node) return;
    const r = node.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };

  const release = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div
      ref={box}
      onPointerMove={track}
      onPointerLeave={release}
      style={{ perspective: 1100 }}
      className="pass-stage"
    >
      <motion.div
        style={{
          rotateX: rx,
          rotateY: ry,
          x: tx,
          y: ty,
          transformStyle: "preserve-3d",
        }}
        className="pass relative"
      >
        <Pass />

        {/* The light on the face, following the lean. */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[10px] mix-blend-overlay"
          style={{ backgroundImage: sheen }}
        />

        {/* The card has an edge. Pushed back behind the face so the lean
            reveals it rather than it floating alongside. */}
        <span
          aria-hidden
          className="pass-edge pointer-events-none absolute inset-0 rounded-[10px]"
          style={{ transform: "translateZ(-6px)" }}
        />
      </motion.div>
    </div>
  );
}

/* ── the reader ─────────────────────────────────────────────────────────── */

/**
 * The reader: a slim graphite slab, not a machine covered in parts.
 *
 * The earlier one was a wide beige box wearing a speaker grille, a lamp tower,
 * a contactless pad, chevrons and feet — every airport-reader cliché at once,
 * which is exactly why it read as assembled from parts rather than designed.
 * This is the opposite: one dark bar, a lit slot along the top edge, and a
 * single line of readout. Everything it needs to say, it says in that line.
 */
function Reader({ phase, armed }: { phase: Phase; armed: boolean }) {
  const reading = phase === "reading";
  const accepted = phase === "accepted";

  return (
    <div
      // Exactly the card's width: a slot narrower than the thing going into it
      // reads as a bar lying on top of the card rather than a machine taking
      // it, and the card's edges hang out either side on the way down.
      // No top margin: the gap above it is the throat's bottom padding, so the
      // clip edge and the slot are the same line.
      className={`reader relative z-20 w-[340px] sm:w-[434px] ${
        armed ? "is-armed" : ""
      } ${reading ? "is-reading" : ""} ${accepted ? "is-accepted" : ""}`}
    >
      <span aria-hidden className="reader-shadow" />

      {/* The slot is the whole top edge — a seam of light the card goes into,
          rather than a bay bolted onto the front. */}
      <span className="reader-slot" aria-hidden>
        <span className="reader-slot-glow" aria-hidden />
      </span>

      <div className="relative flex items-center gap-2.5 px-3.5 py-3">
        {/* One status light, doing the job the tower of three used to. */}
        <span className="reader-dot" aria-hidden />

        <span
          className={`reader-read flex-1 font-mono text-[11px] uppercase tracking-[0.26em] transition-colors ${
            accepted
              ? "text-emerald-300"
              : reading
                ? "text-amber-200"
                : "text-zinc-400"
          }`}
        >
          {accepted
            ? "Welcome"
            : reading
              ? "Reading"
              : armed
                ? "Insert"
                : "Ready"}
        </span>

        <span className="font-mono text-[9px] tracking-[0.18em] text-zinc-600">
          A12
        </span>
      </div>

      {/* A hairline that fills while it reads and holds green once it clears. */}
      <span className="reader-bar" aria-hidden>
        <span className="reader-bar-fill" />
      </span>
    </div>
  );
}

/* ── the pass face ──────────────────────────────────────────────────────── */

/** A small tracked label, the kind every field on a ticket wears. */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="block font-mono text-[6.5px] uppercase tracking-[0.18em] text-zinc-400">
      {children}
    </span>
  );
}

/** The pass itself — a branded spine, a lot of small print, and a tear-off. */
function Pass() {
  return (
    <div className="pass-card relative flex w-[340px] overflow-hidden rounded-[10px] sm:w-[434px]">
      {/* A guilloché wash under everything, the way security print sits under
          the text on a real ticket. */}
      <span
        className="pass-wash pointer-events-none absolute inset-0"
        aria-hidden
      />

      {/* main pane */}
      <div className="relative flex-1">
        {/* The airline's band across the top. */}
        <div className="pass-band flex items-center justify-between px-3.5 py-[6px]">
          <span className="flex items-center gap-1.5">
            <Logo />
            <span className="font-mono text-[8px] font-medium uppercase tracking-[0.24em] text-white/95">
              Northern Air
            </span>
          </span>
          <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/65">
            Boarding Pass
          </span>
        </div>

        <div className="relative px-3.5 pb-3 pt-2.5">
          <div className="flex items-end justify-between">
            <span>
              <FieldLabel>Passenger</FieldLabel>
              <span className="block font-mono text-[15px] leading-tight tracking-[0.06em] text-zinc-900">
                NAMAN SHARMA
              </span>
            </span>
            <span className="text-right">
              <FieldLabel>Flight</FieldLabel>
              <span className="block font-mono text-[12px] text-zinc-800">
                NS 2112
              </span>
            </span>
          </div>

          {/* The route, with the cities spelled out under the codes. */}
          <div className="mt-3 flex items-center gap-2.5">
            <span className="shrink-0 text-center">
              <span className="block font-mono text-[23px] leading-none tracking-[0.03em] text-zinc-900">
                JAL
              </span>
              <span className="mt-0.5 block font-mono text-[6.5px] uppercase tracking-[0.12em] text-zinc-400">
                Jalandhar
              </span>
            </span>
            <span className="flex flex-1 items-center gap-1.5">
              <span className="pass-route-line h-px flex-1" />
              <PlaneGlyph />
              <span className="pass-route-line h-px flex-1" />
            </span>
            <span className="shrink-0 text-center">
              <span className="block font-mono text-[23px] leading-none tracking-[0.03em] text-zinc-900">
                WEB
              </span>
              <span className="mt-0.5 block font-mono text-[6.5px] uppercase tracking-[0.12em] text-zinc-400">
                The Internet
              </span>
            </span>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {[
              ["Gate", "A12"],
              ["Boards", "09:41"],
              ["Seat", "18A"],
              ["Class", "DSGN"],
            ].map(([label, value]) => (
              <span key={label}>
                <FieldLabel>{label}</FieldLabel>
                <span className="block font-mono text-[11px] text-zinc-800">
                  {value}
                </span>
              </span>
            ))}
          </div>

          <p className="mt-2 font-mono text-[7px] uppercase tracking-[0.16em] text-zinc-400">
            Zone 2 · Group B · Seq 042
          </p>

          <div className="mt-2.5">
            <Barcode />
            <span className="mt-1 block font-mono text-[7px] tracking-[0.28em] text-zinc-400">
              NS2112 18A 0042 JALWEB
            </span>
          </div>
        </div>
      </div>

      {/* The tear-off stub. */}
      <div className="pass-stub relative flex w-[100px] shrink-0 flex-col items-center gap-2 px-2.5 py-3 text-center">
        <span className="font-mono text-[6px] uppercase tracking-[0.2em] text-zinc-400">
          Boarding Pass
        </span>
        <span>
          <FieldLabel>Seat</FieldLabel>
          <span className="block font-mono text-[18px] leading-none text-zinc-900">
            18A
          </span>
        </span>
        <span className="grid w-full grid-cols-2 gap-x-1 gap-y-1.5">
          <span className="text-left">
            <FieldLabel>Flight</FieldLabel>
            <span className="block font-mono text-[9px] text-zinc-800">
              NS2112
            </span>
          </span>
          <span className="text-left">
            <FieldLabel>Gate</FieldLabel>
            <span className="block font-mono text-[9px] text-zinc-800">
              A12
            </span>
          </span>
        </span>
        <Qr />
      </div>

      {/* The perforation, and the two notches punched where it meets the edge. */}
      <span
        className="pass-perf pointer-events-none absolute inset-y-2"
        aria-hidden
      />
      <span
        className="pass-notch pass-notch-top pointer-events-none absolute"
        aria-hidden
      />
      <span
        className="pass-notch pass-notch-bottom pointer-events-none absolute"
        aria-hidden
      />
    </div>
  );
}

function Logo() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      aria-hidden
      className="text-white"
    >
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        fill="currentColor"
        opacity="0.22"
      />
      <path d="M12 4.5l6.5 13-6.5-3.2-6.5 3.2z" fill="currentColor" />
    </svg>
  );
}

function PlaneGlyph() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className="text-indigo-500"
    >
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
    </svg>
  );
}

/** Deterministic bar widths — random ones would reshuffle on every render. */
const BARS = [
  3, 1, 2, 1, 1, 3, 2, 1, 2, 3, 1, 1, 2, 2, 1, 3, 1, 2, 1, 1, 2, 3, 1, 2, 2, 1,
  1, 3, 1, 2, 1, 3,
];

function Barcode({ className }: { className?: string }) {
  return (
    <span className={`flex h-8 items-stretch gap-[2px] ${className ?? ""}`}>
      {BARS.map((w, i) => (
        <span
          key={i}
          className="block h-full bg-zinc-900"
          style={{ width: w, opacity: i % 3 === 0 ? 0.9 : 0.62 }}
        />
      ))}
    </span>
  );
}

/** A QR-ish square for the stub — three finder eyes and a fixed scatter of
    modules, laid out the same way every render so it never flickers. */
function Qr() {
  const N = 11;
  const cell = 4;
  const on = (x: number, y: number) => {
    // The three corner eyes.
    const eye = (ox: number, oy: number) => {
      const dx = x - ox;
      const dy = y - oy;
      if (dx < 0 || dx > 2 || dy < 0 || dy > 2) return null;
      return (
        dx === 0 || dx === 2 || dy === 0 || dy === 2 || (dx === 1 && dy === 1)
      );
    };
    const e = eye(0, 0) ?? eye(N - 3, 0) ?? eye(0, N - 3);
    if (e !== null) return e;
    // A stable, evenly-mixed field for everything else.
    return (x * 5 + y * 3 + x * y) % 7 < 3;
  };

  const rects = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (on(x, y))
        rects.push(
          <rect
            key={`${x}-${y}`}
            x={x * cell}
            y={y * cell}
            width={cell}
            height={cell}
          />,
        );
    }
  }
  return (
    <svg
      width={N * cell}
      height={N * cell}
      viewBox={`0 0 ${N * cell} ${N * cell}`}
      aria-hidden
      className="fill-zinc-900"
    >
      {rects}
    </svg>
  );
}
