"use client";

import { useEffect, useRef } from "react";

/**
 * A block that settles into place the first time it scrolls into view.
 *
 * The hidden starting state lives entirely in CSS, behind two conditions:
 * the head script has marked the page as running script (so a page with
 * none never hides anything), and the visitor has not asked for reduced
 * motion (so for them the page is simply finished on arrival). This only
 * flips the attribute that releases it, once, and then lets go.
 *
 * Opacity and a short rise, nothing else: both run on the compositor, and
 * anything larger than a few pixels reads as the page moving under you
 * rather than the content arriving.
 */
export default function Reveal({
  children,
  className,
  id,
  /** Milliseconds to wait after the block arrives, for the second cell of a row. */
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.setAttribute("data-in", "");
          io.disconnect();
        }
      },
      /* A little before it is fully on screen, so it is already moving
         by the time the eye gets there. */
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      className={className ? `reveal ${className}` : "reveal"}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
