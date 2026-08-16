"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

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
      // Rendered before mount too, so the row does not jump once theme resolves.
      aria-label={mounted && isDark ? "Switch to light" : "Switch to dark"}
      className={className}
    >
      {mounted && isDark ? "light" : "dark"}
    </button>
  );
}
