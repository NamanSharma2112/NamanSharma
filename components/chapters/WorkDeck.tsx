"use client";

import Link from "next/link";
import * as React from "react";
import { CARD_STACK_SIZE, CardStack } from "./CardStack";
import { useLive } from "./useLive";

export type Project = {
  id: string;
  name: string;
  href: string;
  /* what it is, after the name: "MotionKit, an animation library." */
  blurb: string;
  /* a 3:4 screenshot, taken on a phone-sized screen so the card crops
     nothing */
  card: string;
};

/* ══ The work, as a deck ═══════════════════════════════════════════════
   The projects are cards in Bencho's card stack: a pile that fans out
   when you reach it, and a card you press comes out of the deck and turns
   over to be looked at. The words under the deck follow whichever card is
   being looked at — drawn out under the pointer, or taken out — and with
   none they say what the deck is and how to use it.

   ── SCALED TO THE COLUMN ───────────────────────────────────────────────
   The block's box holds its widest fan, so it is wider than a phone's
   column. It is drawn at the column's width — a little larger than its
   own size on a wide screen, smaller on a phone — by one transform on a
   wrapper. The stack reads its drawn size back off the screen when a
   card flies, so the flight lands true at any scale. */

const MOST = 1.2;
/* a card taken out comes out up to this much larger than the deck allows */
const VIEW_MOST = 1.45;

export function WorkDeck({ projects }: { projects: Project[] }) {
  const [focus, setFocus] = React.useState<number | null>(null);
  const box = React.useRef<HTMLDivElement>(null);
  const [k, setK] = React.useState(1);
  const [view, setView] = React.useState(1);
  /* the first time the chapter comes in, the deck fans out by itself
     once, so a screen with no hover still learns it opens */
  const live = useLive(box);
  const [peeked, setPeeked] = React.useState(false);
  React.useEffect(() => {
    if (!live || peeked) return;
    const id = window.setTimeout(() => setPeeked(true), 3000);
    return () => window.clearTimeout(id);
  }, [live, peeked]);

  React.useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      const kk = Math.min(MOST, el.clientWidth / CARD_STACK_SIZE.w);
      setK(kk);
      /* ── how big a card taken out can be ─────────────────────
         It grows upward from the foot of the deck, so the room it
         has is the deck's own height plus the air above it, less a
         margin under the top of the window: as large as VIEW_MOST
         asks where there is room, and smaller on a short screen,
         never past the top. In the stack's own units. */
      const top = el.getBoundingClientRect().top;
      /* 36 under the top: 20 of margin, and 16 for the line's own rise as the
         chapter comes in, which this may be measured before */
      const room = CARD_STACK_SIZE.h - 12 + (top - 36) / kk;
      setView(Math.max(1, Math.min(VIEW_MOST, room / (CARD_STACK_SIZE.h - 24))));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      removeEventListener("resize", fit);
    };
  }, []);

  const p = focus === null ? null : projects[focus]!;
  const n = projects.length;

  return (
    <>
      <div className="ln deck-row" ref={box} style={{ height: Math.round(CARD_STACK_SIZE.h * k) }}>
        <div className="deck-fit" style={{ width: CARD_STACK_SIZE.w, transform: `scale(${k})` }}>
          <CardStack
            photos={projects.map((x) => x.card)}
            /* a card taken out comes out well past the deck's size,
               upward into the air above it, so it can be read */
            viewScale={view}
            labels={projects.map((x) => x.name)}
            peek={live && !peeked}
            /* the words keep the last card looked at rather than going
               blank when the pointer leaves the deck, so the link in
               them can still be reached */
            onFocus={(i) => {
              if (i !== null) setFocus(i);
            }}
          />
        </div>
      </div>
      <div className="ln work-cap" aria-live="polite">
        <div key={p ? p.id : "none"} className="work-swap">
          {p ? (
            <>
              <p>
                {p.href.startsWith("/") ? <Link href={p.href}>{p.name}</Link> : <a href={p.href}>{p.name}</a>}, {p.blurb}
              </p>
              <p className="work-meta">
                <span>
                  {String(focus! + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                </span>
                <span aria-hidden="true">·</span>
                {p.href.startsWith("/") ? <Link href={p.href}>Read it</Link> : <a href={p.href}>Visit {new URL(p.href).hostname.replace(/^www\./, "")}</a>}
              </p>
            </>
          ) : (
            <>
              <p>
                {n === 4 ? "Four" : n} things I have built, as a deck: {projects.map((x) => x.name).join(", ")}.
              </p>
              <p className="work-meta">
                <span>Reach the deck to fan it out; press a card to take it out and look</span>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
