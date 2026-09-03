"use client";

import { useEffect, useRef, useState } from "react";

/**
 * True once the element has come into view, and then it stays true.
 *
 * The same one-shot reveal the signature and the flight-plan legs use — a
 * thing that draws itself should draw once, where you can see it, and then be
 * a drawing rather than re-drawing every time it scrolls past.
 */
export function useInView<T extends Element = HTMLDivElement>(
  rootMargin = "0px 0px -12% 0px"
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Anything already on screen counts immediately, so a decoration near the
    // top of the page does not sit blank waiting for a scroll that never comes.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}
