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
          </motion.div>

          {/* Outside the parallax layer on purpose: the wing is bolted to the
              aircraft, so the world slides behind it and it does not move when
              you move your head at the glass. */}
          <Wing />


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

/**
 * The starboard wing, from the seat behind it.
 *
 * This is the thing that decides which way the plane is going. The seat is on
 * the right, so the nose is off to the left of the view: the wing enters low on
 * the left — root nearest, and forward — then sweeps aft and up to a winglet on
 * the right, which is where the eye lands and where the lights sit.
 *
 * Drawn rather than photographed, so it can be white in the sun and a
 * silhouette at night without swapping an asset. preserveAspectRatio is off
 * because the pane is a fixed size and the planform is composed against it
 * directly rather than fitted to it.
 */
function Wing() {
  return (
    <div
      className="wing pointer-events-none absolute inset-x-0 bottom-0 h-[46%]"
      aria-hidden
    >
      <svg
        viewBox="0 0 160 110"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
      >
        <defs>
          {/* Shaded across the chord rather than banded: a wing catches light
              on the leading edge and falls off toward the trailing one, and
              two flat fills for that read as two stacked slats. */}
          <linearGradient
            id="wing-face"
            gradientUnits="userSpaceOnUse"
            x1="46"
            y1="34"
            x2="46"
            y2="108"
          >
            <stop offset="0" className="wing-s0" />
            <stop offset="0.42" className="wing-s1" />
            <stop offset="1" className="wing-s2" />
          </linearGradient>
          <linearGradient
            id="wing-blade"
            gradientUnits="userSpaceOnUse"
            x1="108"
            y1="36"
            x2="134"
            y2="10"
          >
            <stop offset="0" className="wing-b0" />
            <stop offset="1" className="wing-b1" />
          </linearGradient>
        </defs>

        {/* The upper surface: broad at the root, where you are sitting almost
            on top of it, tapering away to the tip. */}
        <path fill="url(#wing-face)" d="M-14 62 L112 26 L122 38 L-14 110 Z" />

        {/* Sun on the leading edge — a line, not a band. */}
        <path className="wing-lead" d="M-14 62 L112 26" />

        {/* Panel seams running out along the span, and the spoiler line. */}
        <path className="wing-line" d="M-14 76 L108 30" />
        <path className="wing-line" d="M-14 90 L112 34" />

        {/* Flap track fairings — the detail that says airliner rather than
            paper dart. Both edges of this planform slope the same way, which
            makes the chord run straight down it, so the fairings point down
            too: blunt end on the wing, tapering to a point out past the
            trailing edge. Drawn over the surface so each reads as a bulge on
            it rather than a tab floating behind it. */}
        <path className="wing-pod" d="M12 84 C8 92 9 100 15 107 C20 100 21 92 19 84 Z" />
        <path className="wing-pod" d="M53 63 C50 69 50 76 55 84 C59 76 59 69 57 63 Z" />

        {/* The winglet, and the face of it turned back toward the window. */}
        <path fill="url(#wing-blade)" d="M112 26 L126 6 L133 15 L122 38 Z" />
        <path className="wing-let-in" d="M112 26 L126 6 L128 9 L115 30 Z" />
      </svg>

      {/* Both lights live on the winglet, inside the wing, so they flex with
          it instead of hovering beside it. Green forward, strobe aft. */}
      <span
        className="wing-nav absolute size-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ left: "79.4%", top: "7.3%" }}
      />
      <span
        className="porthole-beacon absolute size-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_8px_3px_rgba(255,255,255,0.9)]"
        style={{ left: "83.1%", top: "14.5%" }}
      />
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
