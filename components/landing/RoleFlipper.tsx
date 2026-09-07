"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * The role in the hero, cycling.
 *
 * Each title drops in from above out of a blur, settles, then gives a small
 * shake before the next one takes over — the wobble is what keeps it from
 * reading as a slot machine.
 *
 * The width animates with the word rather than being fixed, so the line
 * recomposes around it instead of leaving a gap sized to the longest role.
 * A reader who has asked for less motion just gets the first title, held.
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

/** The one that sizes the slot, so the line never reflows. */
const LONGEST = ROLES.reduce((a, b) => (b.length > a.length ? b : a));

export default function RoleFlipper() {
  const [i, setI] = useState(0);
  const still = useReducedMotion();

  useEffect(() => {
    if (still) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % ROLES.length), HOLD);
    return () => window.clearInterval(id);
  }, [still]);

  if (still) return <>{ROLES[0]}</>;

  return (
    <span className="relative inline-flex justify-center overflow-hidden whitespace-nowrap align-bottom">
      {/* Holds the slot open at the width of the longest role. Without it the
          box resizes with each word and the rest of the line — "& Creative
          Technologist" — slides sideways every four seconds. Invisible but
          still laid out, so it sets the width and the line height. */}
      <span aria-hidden className="invisible">
        {LONGEST}
      </span>

      <AnimatePresence initial={false}>
        <motion.span
          key={i}
          initial={{ y: "-70%", filter: "blur(8px)", opacity: 0 }}
          animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
          exit={{ y: "70%", filter: "blur(8px)", opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          // Absolute, so the outgoing and incoming words overlap inside the
          // reserved slot instead of taking turns changing its size.
          className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
        >
          {ROLES[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
