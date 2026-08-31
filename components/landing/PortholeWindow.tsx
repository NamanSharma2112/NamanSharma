"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "motion/react";
import { useTheme } from "next-themes";
import { playShadeClose, playShadeOpen } from "@/lib/sounds";

/**
 * The cabin window, and the site's light switch.
 *
 * The shade is dragged rather than clicked, so it moves on a spring: a spring
 * carries velocity through an interruption, which is what lets you fling it
 * halfway and have it finish the journey, or catch it and push it back.
 *
 * Where it settles decides the theme. Past the halfway mark it latches shut and
 * the site goes to night; short of it, it snaps back up to daylight. The theme
 * is only written on release, so dragging never strobes the whole page.
 */

const W = 228;
const H = 296;
/** Bezel thickness — the pane inside is what the shade travels down. */
const INSET = 34;
const PANE_H = H - INSET * 2;
/** Stops shy of the sill, leaving the sliver of sky a real one does. */
const SHADE_H = PANE_H - 8;
/** How much of the shade still shows when it is up, to grab it by. */
const LIP = 15;
/**
 * Retracted sits *above* the pane — a shade rolls up out of the way. Closed is
 * its resting place, so the two ends of the travel are a negative offset and
 * zero rather than zero and a positive one.
 */
const OPEN = -(SHADE_H - LIP);
const CLOSED = 0;
const SHAPE = "46% / 40%";
/** How far the view slides as the pointer crosses the glass, in px. */
const PARALLAX = 9;

export default function PortholeWindow() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dragging, setDragging] = useState(false);

  // Where the pointer is over the window, so the view shifts as though you
  // were moving your head at the glass. Springs, because the pointer can
  // reverse at any moment and a duration would keep chasing a stale target.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const viewX = useSpring(useTransform(px, [0, 1], [PARALLAX, -PARALLAX]), {
    stiffness: 120,
    damping: 20,
    mass: 0.5,
  });
  const viewY = useSpring(useTransform(py, [0, 1], [PARALLAX * 0.6, -PARALLAX * 0.6]), {
    stiffness: 120,
    damping: 20,
    mass: 0.5,
  });

  // The shade's own position, springed so a fling finishes on its own.
  const y = useMotionValue(OPEN);
  const shade = useSpring(y, { stiffness: 320, damping: 34, mass: 0.7 });
  const [closed, setClosed] = useState(false);
  const latest = useRef(OPEN);

  useMotionValueEvent(shade, "change", (value) => {
    latest.current = value;
  });

  // The theme is the source of truth: arriving on a dark page shows the shade
  // already down, so the two can never disagree.
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const shut = resolvedTheme === "dark";
    setClosed(shut);
    y.set(shut ? CLOSED : OPEN);
  }, [mounted, resolvedTheme, y]);

  /** One place to land the shade, so the sound and the theme never disagree. */
  const land = (shut: boolean) => {
    y.set(shut ? CLOSED : OPEN);
    setClosed(shut);
    setTheme(shut ? "dark" : "light");
    // Only when it actually moved — a shade let go where it started is silent.
    if (shut !== closed) (shut ? playShadeClose : playShadeOpen)();
  };

  const settle = () => {
    setDragging(false);
    // More than halfway down and it latches shut; short of that it rolls back.
    land(latest.current > OPEN / 2);
  };

  const toggle = () => land(!closed);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="porthole relative shrink-0"
        style={{ width: W, height: H, borderRadius: SHAPE }}
      >
        {/* The pane, and the sky beyond it. */}
        <div
          className="absolute overflow-hidden"
          style={{ inset: INSET, borderRadius: SHAPE }}
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            px.set((e.clientX - r.left) / r.width);
            py.set((e.clientY - r.top) / r.height);
          }}
          onPointerLeave={() => {
            px.set(0.5);
            py.set(0.5);
          }}
        >
          {/* Everything beyond the glass moves together, and sits slightly
              oversized so sliding it never uncovers an edge. */}
          <motion.div className="absolute inset-[-7%]" style={{ x: viewX, y: viewY }}>
            <div className="porthole-sky absolute inset-0" />
            {/* Three banks at three speeds, plus the wing light past them. */}
            <div className="porthole-clouds absolute inset-y-0 left-0" />
            <div className="porthole-clouds-near absolute inset-y-0 left-0" />
            {/* Far bank, barely moving — the horizon does not race past. */}
            <div className="porthole-clouds-far absolute inset-y-0 left-0" />
            <div className="porthole-stars absolute inset-0" />

            {/* Birds, occasionally. Two flocks on long offset cycles so they
                are a thing you happen to catch rather than a metronome. */}
            <span className="bird-flock bird-flock-a" aria-hidden>
              <Bird />
              <Bird />
              <Bird />
            </span>
            <span className="bird-flock bird-flock-b" aria-hidden>
              <Bird />
              <Bird />
            </span>
            <span className="porthole-beacon absolute bottom-[26%] right-[20%] size-[3px] rounded-full bg-red-400 shadow-[0_0_6px_2px_rgba(248,113,113,0.85)]" />
          </motion.div>

          {/* The shade. Dragged, or nudged with the tab below. */}
          <motion.div
            drag="y"
            dragConstraints={{ top: OPEN, bottom: CLOSED }}
            dragElastic={0.04}
            dragMomentum={false}
            onDragStart={() => setDragging(true)}
            onDragEnd={settle}
            style={{ y: shade, height: SHADE_H, cursor: dragging ? "grabbing" : "grab" }}
            className="porthole-shade absolute inset-x-0 top-0 touch-none"
          >
            {/* The pull, sitting on the shade's bottom lip. */}
            <span className="absolute inset-x-0 bottom-0 flex h-5 items-center justify-center">
              <span className="porthole-pull h-[3px] w-9 rounded-full" />
            </span>
          </motion.div>

          {/* Glass over the top of everything, including the shade. */}
          <div className="porthole-glare pointer-events-none absolute inset-0" />
        </div>
      </div>

      {/* Keyboard and touch users get a plain control; the drag is the flourish
          on top, not the only way through. */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-pressed={closed}
          className="porthole-tab text-[10px] uppercase tracking-[0.18em]"
        >
          {mounted && closed ? "Open shade" : "Close shade"}
        </button>

        {/* The cabin sign overhead: lit while the shade is down, the way it is
            for the dark part of a flight. */}
        <span
          className={`cabin-sign ${mounted && closed ? "is-lit" : ""}`}
          aria-hidden
        >
          <BeltGlyph />
          <span>Fasten seat belt</span>
        </span>
      </div>
    </div>
  );
}

/** The belt symbol from the sign above every seat. */
function BeltGlyph() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6c0 4.5 3.2 7 8 7s8-2.5 8-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect x="8.5" y="13.5" width="7" height="6" rx="1.4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

/** A bird, at the size one is from a window seat: a pair of strokes. */
function Bird() {
  return (
    <svg className="bird" viewBox="0 0 24 10" fill="none" aria-hidden>
      <path
        d="M1 7c3.4 0 5-5.4 7-5.4S13.6 7 17 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
