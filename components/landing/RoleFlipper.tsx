"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useSpring,
} from "motion/react";

/**
 * The role in the hero, cycling.
 *
 * Each title drops in from above out of a blur while the one before it falls
 * away, so the two overlap rather than taking turns.
 *
 * The hard part is the width. A slot fixed to the longest title never reflows,
 * but it leaves the extra space sitting in the middle of the sentence —
 * "Design Engineer      & Creative Technologist". A slot that shrink-wraps each
 * word has no gap but snaps the rest of the line sideways every four seconds.
 *
 * So the slot is measured, not fixed: every title is laid out once off-screen,
 * and the box springs between those widths as the word changes. The ampersand
 * travels with it instead of jumping, and no space is reserved for a word that
 * is not currently there.
 */

const ROLES = [
  "Design Engineer",
  "Software Engineer",
  "Full Stack Engineer",
  "Front-end Engineer",
  "Vibe Coding Engineer",
];

/** Long enough to read the title and forget it is going to change. */
const HOLD = 4000;

export default function RoleFlipper() {
  const [i, setI] = useState(0);
  const [widths, setWidths] = useState<number[]>([]);
  const probe = useRef<HTMLSpanElement>(null);
  const still = useReducedMotion();

  // Springed, because the word can change while the box is still travelling to
  // the last one's width — a duration would restart and stutter.
  const width = useSpring(0, { stiffness: 220, damping: 30, mass: 0.6 });

  // Layout effect, not effect: measured and applied before the browser paints,
  // so the slot is never briefly zero-width.
  useLayoutEffect(() => {
    if (!probe.current) return;
    const measure = () => {
      const next = Array.from(probe.current!.children).map(
        (c) => c.getBoundingClientRect().width,
      );
      setWidths(next);
      // jump, not set: the first measurement is the starting size, not a
      // transition from nothing.
      if (width.get() === 0) width.jump(next[0]);
    };
    measure();
    // Re-measured on resize because the font size is responsive, and a slot
    // sized at one breakpoint is wrong at the next.
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [width]);

  useEffect(() => {
    if (widths[i]) width.set(widths[i]);
  }, [i, widths, width]);

  useEffect(() => {
    if (still) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % ROLES.length), HOLD);
    return () => window.clearInterval(id);
  }, [still]);

  return (
    <>
      {/* Every title, laid out once at the real font size so the widths are the
          ones the browser would actually use. Out of flow and hidden from
          everything: no space taken, nothing read aloud. */}
      <span
        ref={probe}
        aria-hidden
        className="pointer-events-none invisible absolute whitespace-nowrap"
      >
        {ROLES.map((r) => (
          <span key={r}>{r}</span>
        ))}
      </span>

      {still ? (
        ROLES[0]
      ) : (
        <motion.span
          style={{ width }}
          className="relative inline-flex overflow-hidden whitespace-nowrap align-bottom"
        >
          {/* Holds the line's height. The animating words are absolute, so
              without this the box would collapse to nothing tall. */}
          <span aria-hidden className="invisible">
            {ROLES[i]}
          </span>

          <AnimatePresence initial={false}>
            <motion.span
              key={i}
              initial={{ y: "-70%", filter: "blur(8px)", opacity: 0 }}
              animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
              exit={{ y: "70%", filter: "blur(8px)", opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              // Left-aligned rather than centred: the word has to start at the
              // same place every time, or it slides horizontally as well as
              // vertically on the way in.
              className="absolute inset-0 flex items-center whitespace-nowrap"
            >
              {ROLES[i]}
            </motion.span>
          </AnimatePresence>
        </motion.span>
      )}
    </>
  );
}
