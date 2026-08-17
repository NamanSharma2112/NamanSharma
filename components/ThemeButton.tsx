"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Switches the theme behind a circular reveal that opens from the button and
 * sharpens as it goes — a soft wipe rather than a hard cut.
 *
 * Built on the View Transitions API: the browser snapshots the old and new
 * views, and the new one is clipped from a zero-radius circle at the pointer
 * out past the furthest corner, blurred at the start. Browsers without it, and
 * anyone who asked for less motion, just get the switch.
 */

const DURATION = 1000;
const EASING = "cubic-bezier(0.4, 0, 0.2, 1)";

const glyph = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export default function ThemeButton({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const next = isDark ? "light" : "dark";
    const startViewTransition = (
      document as Document & {
        startViewTransition?: (cb: () => void) => { ready: Promise<void> };
      }
    ).startViewTransition;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!startViewTransition || reduced) {
      setTheme(next);
      return;
    }

    const { clientX: x, clientY: y } = event;
    // Far enough to clear the corner furthest from the click.
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = startViewTransition.call(document, () => setTheme(next));
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
          filter: ["blur(16px)", "blur(0px)"],
        },
        {
          duration: DURATION,
          easing: EASING,
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mounted && isDark ? "Switch to light" : "Switch to dark"}
      className={cn(
        "relative -my-1 -mr-1 flex size-7 items-center justify-center rounded-full",
        "text-zinc-400 transition-colors duration-200 hover:bg-white/10 hover:text-white",
        className
      )}
    >
      {/* Sized to the row so the icon sits on the same baseline as the links. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.svg
          key={mounted && isDark ? "moon" : "sun"}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          initial={{ opacity: 0, rotate: -70, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 70, scale: 0.6 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          {...glyph}
        >
          {mounted && isDark ? (
            // A moon while dark is on — press it for light.
            <path d="M20 14.5A8.2 8.2 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z" />
          ) : (
            <>
              <circle cx="12" cy="12" r="4.2" />
              <path d="M12 2.6v2.2M12 19.2v2.2M4.4 12H2.2M21.8 12h-2.2M6.3 6.3 4.8 4.8M19.2 19.2l-1.5-1.5M17.7 6.3l1.5-1.5M4.8 19.2l1.5-1.5" />
            </>
          )}
        </motion.svg>
      </AnimatePresence>
    </button>
  );
}
