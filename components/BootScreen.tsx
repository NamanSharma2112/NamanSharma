"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SIGNATURE_PATHS, SIGNATURE_VIEWBOX } from "@/components/signature-paths";

/**
 * The intro: the name, written.
 *
 * Each stroke is drawn by running its own dash offset to zero, staggered in
 * the order a pen would make them — so it reads as a hand moving rather than
 * ten shapes fading up together.
 *
 * The sheet is the page's own ground, not black. The page it lifts off is
 * near-white, and a black sheet clearing to a white page is a flash in the
 * face on every visit.
 */

/** How long one stroke takes to write. */
const DRAW = 1500;
/** Between the start of one stroke and the next. */
const STAGGER = 55;
/** Before the first stroke moves at all. */
const LEAD = 120;
/** The beat the finished name is held for before the sheet lifts. */
const HOLD = 360;

/** Seconds the intro holds before it lifts. */
export const BOOT_DURATION =
  (LEAD + STAGGER * (SIGNATURE_PATHS.length - 1) + DRAW + HOLD) / 1000;
/** Seconds the sheet takes to clear once it starts lifting. */
export const BOOT_FADE = 0.6;

/**
 * Whether it is on screen is decided upstream, by whoever also tells the page
 * it may arrive — the two have to be the same moment.
 */
export default function BootScreen({ show }: { show: boolean }) {
  const strokes = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const anims: Animation[] = [];

    strokes.current.forEach((path, i) => {
      if (!path) return;
      anims.push(
        path.animate(
          [
            { strokeDashoffset: 1, opacity: 0 },
            { strokeDashoffset: 1, opacity: 1, offset: 0.04 },
            { strokeDashoffset: 0, opacity: 1 },
          ],
          {
            // Reduced motion still gets the name, just not the writing.
            duration: reduced ? 1 : DRAW,
            // Steady through the middle: a pen does not ease into every
            // stroke, and an ease-in-out per stroke reads as ten animations.
            easing: "cubic-bezier(0.58, 0, 0.4, 1)",
            fill: "forwards",
            delay: reduced ? 0 : LEAD + i * STAGGER,
          },
        ),
      );
    });

    return () => anims.forEach((a) => a.cancel());
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: BOOT_FADE, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-7 bg-[var(--bg)]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={SIGNATURE_VIEWBOX}
            role="img"
            aria-label="Naman Sharma"
            className="h-[64px] w-auto overflow-visible text-[var(--fg)] sm:h-[86px]"
          >
            {SIGNATURE_PATHS.map((d, i) => (
              <path
                key={i}
                ref={(el) => {
                  strokes.current[i] = el;
                }}
                d={d}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                // pathLength normalises every stroke to 1 whatever its real
                // length, so one dash array works for all ten.
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1}
                opacity={0}
              />
            ))}
          </svg>

          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-muted)]">
            press any key to skip
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
