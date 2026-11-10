"use client";

import dynamic from "next/dynamic";
import * as React from "react";

/* ══ The craft chapter, loaded when it is wanted ═══════════════════════
   The chapter's three pieces — a WebGL glass among them — are the
   heaviest code on the front page, and they sit two chapters from where
   the page opens. So they are a chunk of their own, fetched only when
   either the reader comes near (the chapter before, Work, is in, or Craft
   itself is) or the page has been quiet for a few seconds after it
   loaded, whichever comes first; by the time anyone scrolls there it is
   almost always already in. Until then the chapter holds its label and
   nothing else, which is also what it shows without script. */

const Craft = dynamic(() => import("./Craft").then((m) => m.Craft), { ssr: false });

export function CraftLazy() {
  const here = React.useRef<HTMLSpanElement>(null);
  const [want, setWant] = React.useState(false);

  React.useEffect(() => {
    if (want) return;
    const ch = here.current?.closest(".ch");
    const prev = ch?.previousElementSibling;
    const near = () => [ch, prev].some((el) => el?.classList.contains("is-in") || el?.classList.contains("is-live"));
    if (near()) {
      setWant(true);
      return;
    }
    const mo = new MutationObserver(() => near() && setWant(true));
    for (const el of [ch, prev]) if (el) mo.observe(el, { attributes: true, attributeFilter: ["class"] });
    /* or once the page has settled, quietly, so the chunk is in hand */
    const idle = window.setTimeout(() => setWant(true), 3500);
    return () => {
      mo.disconnect();
      window.clearTimeout(idle);
    };
  }, [want]);

  return want ? <Craft /> : <span ref={here} hidden />;
}
