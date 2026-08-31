"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/**
 * An inline phrase that throws a handful of marks into the air above it.
 *
 * They start stacked on the word, then scatter to their own offsets, each with
 * its own rotation and a slightly different arrival time, and fall back into
 * the word when the cursor leaves. Springs rather than durations: the cursor
 * can leave halfway through the throw, and a spring reverses from wherever the
 * mark actually is instead of restarting the journey.
 *
 * Hover only, and only on a real pointer — a tap fires hover with no matching
 * leave, so on a phone the marks would scatter and never come home.
 */

export type ScatterItem = {
  key: string;
  node: React.ReactNode;
  /** Where it lands, relative to the middle of the phrase, in px. */
  x: number;
  y: number;
  rotate: number;
};

export default function ScatterOnHover({
  children,
  items,
  caption,
}: {
  children: React.ReactNode;
  items: ScatterItem[];
  caption?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span
      className="scatter relative inline-block"
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span
        tabIndex={0}
        aria-describedby={open && caption ? id : undefined}
        className="scatter-word cursor-default underline decoration-dotted underline-offset-[4px] outline-none"
      >
        {children}
      </span>

      <AnimatePresence>
        {open && (
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 z-30 block size-0"
          >
            {/* Quiets whatever the marks are flying over, so they read as
                being in front of the page rather than tangled in it. */}
            <motion.span
              className="scatter-scrim absolute -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            />

            {items.map((item, i) => (
              <motion.span
                key={item.key}
                className="absolute block"
                initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  x: item.x,
                  y: item.y,
                  rotate: item.rotate,
                  scale: 1,
                }}
                exit={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.7 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  mass: 0.5,
                  // A short stagger so they leave the word in sequence rather
                  // than as one block.
                  delay: i * 0.035,
                }}
                style={{ translateX: "-50%" }}
              >
                {item.node}
              </motion.span>
            ))}

            {caption && (
              <motion.span
                id={id}
                className="scatter-caption absolute -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.18em]"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: -26 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
              >
                {caption}
              </motion.span>
            )}
          </span>
        )}
      </AnimatePresence>
    </span>
  );
}
