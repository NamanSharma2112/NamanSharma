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
  const rx = useSpring(useTransform(py, [0, 1], [LEAN, -LEAN]), {
    stiffness: 170,
    damping: 18,
    mass: 0.4,
  });
  const ry = useSpring(useTransform(px, [0, 1], [-LEAN, LEAN]), {
    stiffness: 170,
    damping: 18,
    mass: 0.4,
  });

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
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
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

function Reader({ phase, armed }: { phase: Phase; armed: boolean }) {
  const reading = phase === "reading";
  const accepted = phase === "accepted";

  return (
    <div className={`reader relative z-20 mt-9 w-[366px] sm:w-[456px] ${armed ? "is-armed" : ""}`}>
      {/* The mouth: a lip above, the dark slot, and a throat behind it. */}
      <div className="reader-mouth absolute inset-x-4 -top-[9px] h-[18px] rounded-[3px]">
        <span className="reader-slot absolute inset-x-[6px] top-[6px] block h-[6px] rounded-full" />
      </div>

      <div className="px-4 pb-4 pt-6">
        <div className="flex items-center gap-3">
          {/* The display, with its dot grid and a beam that sweeps while it
              reads — the one moment the machine is actually doing something. */}
          <span className="reader-screen relative flex h-12 flex-1 items-center justify-center overflow-hidden rounded-[5px]">
            <span className="reader-dots pointer-events-none absolute inset-0" />
            {reading && <span className="reader-beam pointer-events-none absolute inset-y-0 w-1/3" />}
            <span
              className={`relative font-mono text-[15px] tracking-[0.32em] ${
                accepted ? "text-emerald-300" : reading ? "text-amber-200" : "text-emerald-300/90"
              }`}
            >
              {accepted ? "WELCOME" : reading ? "READING" : armed ? "INSERT" : "READY"}
            </span>
          </span>

          {/* Status stack, the way a real reader wears its lights. */}
          <span className="flex flex-col gap-1.5">
            <Lamp on={!reading && !accepted} tone="idle" label="PWR" />
            <Lamp on={reading} tone="busy" label="RD" />
            <Lamp on={accepted} tone="ok" label="OK" />
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">
            Northern Air · Gate A12
          </span>
          {/* Chevrons pointing the way the card should go. */}
          <span className={`reader-arrows flex items-center gap-[3px] ${armed ? "is-live" : ""}`}>
            {[0, 1, 2].map((i) => (
              <span key={i} className="arrow block size-1.5 rotate-45 border-b border-r" />
            ))}
          </span>
        </div>
      </div>

      {/* Feet, so it sits on something. */}
      <span aria-hidden className="reader-foot absolute -bottom-1 left-8 h-2 w-12 rounded-b-[3px]" />
      <span aria-hidden className="reader-foot absolute -bottom-1 right-8 h-2 w-12 rounded-b-[3px]" />
    </div>
  );
}

function Lamp({ on, tone, label }: { on: boolean; tone: "idle" | "busy" | "ok"; label: string }) {
  const colour = on
    ? tone === "ok"
      ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.95)]"
      : tone === "busy"
        ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.95)]"
        : "bg-sky-400 shadow-[0_0_7px_rgba(56,189,248,0.85)]"
    : "bg-zinc-400/35";

  return (
    <span className="flex items-center gap-1.5">
      <span className={`size-2 rounded-full transition-all duration-200 ${colour}`} />
      <span className="font-mono text-[7px] uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">
        {label}
      </span>
    </span>
  );
}

/* ── the pass face ──────────────────────────────────────────────────────── */

/** The pass itself — a stub, a spine, and a lot of small print. */
function Pass() {
  return (
    <div className="pass-card flex w-[330px] overflow-hidden rounded-[10px] sm:w-[420px]">
      <div className="flex-1 p-3.5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Logo />
            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-zinc-500">
              Northern Air
            </span>
          </span>
          <span className="font-mono text-[7px] uppercase tracking-[0.16em] text-zinc-400">
            Boarding pass
          </span>
        </div>

        <div className="mt-3 flex items-end justify-between">
          <span>
            <span className="block font-mono text-[7px] uppercase tracking-[0.18em] text-zinc-400">
              Passenger
            </span>
            <span className="block font-mono text-[15px] tracking-[0.08em] text-zinc-900">
              NAMAN SHARMA
            </span>
          </span>
          <span className="text-right">
            <span className="block font-mono text-[7px] uppercase tracking-[0.18em] text-zinc-400">
              Flight
            </span>
            <span className="block font-mono text-[11px] text-zinc-700">NS 2112</span>
          </span>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <span className="font-mono text-[22px] tracking-[0.06em] text-zinc-900">JAL</span>
          <span className="flex-1 border-t border-dashed border-zinc-300" />
          <PlaneGlyph />
          <span className="flex-1 border-t border-dashed border-zinc-300" />
          <span className="font-mono text-[22px] tracking-[0.06em] text-zinc-900">WEB</span>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2">
          {[
            ["Gate", "A12"],
            ["Boards", "09:41"],
            ["Seat", "18A"],
            ["Class", "DSGN"],
          ].map(([label, value]) => (
            <span key={label}>
              <span className="block font-mono text-[7px] uppercase tracking-[0.16em] text-zinc-400">
                {label}
              </span>
              <span className="block font-mono text-[11px] text-zinc-800">{value}</span>
            </span>
          ))}
        </div>

        <Barcode className="mt-3" />
      </div>

      {/* The tear-off stub. */}
      <div className="pass-stub flex w-[92px] shrink-0 flex-col justify-between p-3">
        <span>
          <span className="block font-mono text-[7px] uppercase tracking-[0.16em] text-zinc-400">
            Seat
          </span>
          <span className="block font-mono text-[15px] text-zinc-900">18A</span>
        </span>
        <span>
          <span className="block font-mono text-[7px] uppercase tracking-[0.16em] text-zinc-400">
            Gate
          </span>
          <span className="block font-mono text-[13px] text-zinc-800">A12</span>
        </span>
        <Barcode compact />
      </div>
    </div>
  );
}

function Logo() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden className="text-blue-600">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="currentColor" opacity="0.14" />
      <path d="M12 5l6 12-6-3-6 3z" fill="currentColor" />
    </svg>
  );
}

function PlaneGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="text-blue-600">
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
    </svg>
  );
}

/** Deterministic bar widths — random ones would reshuffle on every render. */
const BARS = [3, 1, 2, 1, 1, 3, 2, 1, 2, 3, 1, 1, 2, 2, 1, 3, 1, 2, 1, 1, 2, 3, 1, 2, 2, 1, 1, 3];

function Barcode({ compact, className }: { compact?: boolean; className?: string }) {
  const bars = compact ? BARS.slice(0, 14) : BARS;
  return (
    <span className={`flex items-end gap-[2px] ${compact ? "h-6" : "h-7"} ${className ?? ""}`}>
      {bars.map((w, i) => (
        <span
          key={i}
          className="block h-full bg-zinc-800"
          style={{ width: w, opacity: i % 3 === 0 ? 0.85 : 0.6 }}
        />
      ))}
    </span>
  );
}
