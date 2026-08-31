"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * The email button, and the plane on it.
 *
 * Every hover launches the plane that is showing and settles a fresh one in
 * behind it.
 *
 * The obvious build is one glyph that flies out on `:hover` — but a CSS
 * transition runs backwards the moment the cursor leaves, so the plane that
 * just took off flies home tail-first while the one that arrived retreats into
 * the corner it came from. It reads as a rewind, which is the one thing a send
 * button should never do.
 *
 * A launch only goes one way, so each hover mints a new plane instead: the old
 * one carries on out of the frame and is dropped there, the new one stays.
 * Leaving does nothing at all, because leaving is not an event that should
 * un-send anything.
 */

/** The site's standard decelerate. Nothing here eases in. */
const EASE = [0.23, 1, 0.32, 1] as const;

export default function SendButton({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const [flight, setFlight] = useState(0);
  const still = useReducedMotion();

  return (
    <a
      href={`mailto:${email}`}
      onPointerEnter={(e) => {
        // Mouse only: a tap fires enter with no matching leave, and there is
        // no hover to reward on a phone in the first place.
        if (!still && e.pointerType === "mouse") setFlight((n) => n + 1);
      }}
      className="send send-solid relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-zinc-900 px-4 py-2 text-[13px] font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
    >
      {children}

      {/* Clipped by the pill, so a plane leaves the button rather than
          floating off across the page. */}
      <span className="relative block size-[13px]" aria-hidden>
        <AnimatePresence initial={false}>
          <motion.span
            key={flight}
            className="absolute inset-0 block"
            initial={{ opacity: 0, x: -9, y: 9 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 16, y: -16 }}
            transition={{ duration: 0.36, ease: EASE }}
          >
            <PaperPlane className="size-full" />
          </motion.span>
        </AnimatePresence>
      </span>
    </a>
  );
}

/** A paper plane, wings folded — the send glyph, not an airliner. */
function PaperPlane({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M21.4 2.6a1 1 0 0 0-1.05-.23L2.9 9.2a1 1 0 0 0 .06 1.87l4.9 1.62 1.62 4.9a1 1 0 0 0 1.87.06l6.83-17.45a1 1 0 0 0-.78-1.6zM9.9 13.9l-.9-2.7 8.2-4.6z" />
    </svg>
  );
}
