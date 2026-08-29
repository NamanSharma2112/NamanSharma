"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent } from "motion/react";
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
 * There is always a way past: a skip control, Escape, and it only ever runs
 * once per session.
 */

const SEEN = "boarded";

/** How far down the card has to travel before the reader reads it. */
const THROW = 190;
/** Where the slot sits relative to the card's resting place. */
const SLOT = 150;

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
    }, 420);
    window.setTimeout(leave, 900);
  }, [leave, phase]);

  // Escape skips, and a nudge after a while for anyone who has not spotted it.
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
          the card is accepted, so the page underneath is free before the sheet
          has finished clearing. */}
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
                  y: SLOT + 70,
                  opacity: 0,
                  transition: { duration: 0.32, ease: [0.23, 1, 0.32, 1] },
                }
          }
          whileDrag={{ scale: 1.015, rotate: -0.6 }}
          className="pass relative z-10 cursor-grab active:cursor-grabbing"
          aria-hidden
        >
          <Pass />
        </motion.div>

        {/* The reader, and the slot the card goes into. */}
        <div className="reader relative mt-8 w-[300px] rounded-[10px] px-4 pb-4 pt-3 sm:w-[330px]">
          <span className="reader-slot absolute inset-x-5 top-0 block h-[7px] -translate-y-1/2 rounded-full" />
          <div className="mt-2 flex items-center gap-3">
            <span className="reader-screen flex h-11 flex-1 items-center justify-center rounded-[4px] font-mono text-[15px] tracking-[0.3em]">
              {phase === "accepted" ? "WELCOME" : phase === "reading" ? "READING" : "READY"}
            </span>
            <span
              className={`size-3.5 rounded-full transition-colors duration-200 ${
                phase === "accepted"
                  ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]"
                  : phase === "reading"
                    ? "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)]"
                    : "bg-zinc-400/70"
              }`}
            />
          </div>
        </div>
      </div>

      <p className="mt-7 text-center text-[13.5px] text-zinc-500">
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
        className="absolute bottom-8 right-8 text-[13px] text-zinc-400 transition-colors hover:text-zinc-700"
      >
        Skip
      </button>
    </motion.div>
  );
}

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
      <path
        d="M12 5l6 12-6-3-6 3z"
        fill="currentColor"
      />
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
