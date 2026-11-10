"use client";

import * as React from "react";

/* Whether a piece is worth animating right now: its chapter is the one
   in (the chapter's section carries .is-in), the tab is showing, and the
   reader has not asked for less motion. A piece that plays by itself
   only ever plays while somebody can see it. */
export function useLive(ref: React.RefObject<HTMLElement | null>) {
  const [live, setLive] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    const ch = el?.closest(".ch");
    if (!ch) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setLive(ch.classList.contains("is-in") && !document.hidden && !still.matches);
    read();
    const mo = new MutationObserver(read);
    mo.observe(ch, { attributes: true, attributeFilter: ["class"] });
    document.addEventListener("visibilitychange", read);
    still.addEventListener("change", read);
    return () => {
      mo.disconnect();
      document.removeEventListener("visibilitychange", read);
      still.removeEventListener("change", read);
    };
  }, [ref]);
  return live;
}
