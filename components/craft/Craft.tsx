"use client";

import * as React from "react";
import { AspectRatio } from "./AspectRatio";
import { Compare } from "./Compare";
import { LiquidGlass } from "./LiquidGlass";

/* ══ The craft chapter ═════════════════════════════════════════════════
   Three ways of showing what design engineering does to an interface,
   one at a time, so the chapter stays one column on one screen: the same
   dialog before and after, the finished one under a glass with its
   measurements drawn on, and one design across three screens.

   The stage is one fixed height, the tallest of the three, so changing
   piece never moves the words under it. Sizes come in two steps: full on
   a wide, tall window, compact on a phone or a short laptop screen, where
   the full stage and its caption would not fit above the dots. */

type Piece = { id: "compare" | "details" | "screens"; label: string; text: string };

const PIECES: Piece[] = [
  {
    id: "compare",
    label: "Before and after",
    text: "The same dialog, twice. Same words, same layout; what changed is spacing on one scale, radii that nest, type with a hierarchy, and contrast you can read. Drag the line.",
  },
  {
    id: "details",
    label: "Details",
    text: "Pixel-perfect is a checklist, not a feeling: every gap on the scale, every height shared, every radius chosen. Drag the glass over the measurements.",
  },
  {
    id: "screens",
    label: "Every screen",
    text: "One design on a phone, a tablet and a desktop, each given the same area, so what you see change is the layout and not the size.",
  },
];

const FULL = { cw: 400, ch: 300, gw: 360, gh: 270, pad: 20, glass: 128, side: 300, stage: 352 };
const COMPACT = { cw: 320, ch: 240, gw: 288, gh: 216, pad: 16, glass: 104, side: 236, stage: 288 };

export function Craft() {
  const [at, setAt] = React.useState(0);
  const [size, setSize] = React.useState(FULL);
  const tabs = React.useRef<(HTMLButtonElement | null)[]>([]);

  React.useEffect(() => {
    const mq = matchMedia("(max-width: 560px), (max-height: 760px)");
    const fit = () => setSize(mq.matches ? COMPACT : FULL);
    fit();
    mq.addEventListener("change", fit);
    return () => mq.removeEventListener("change", fit);
  }, []);

  const piece = PIECES[at]!;
  const compact = size === COMPACT;

  /* tabs, so the arrows move between them and only the chosen one is in
     the tab order */
  const key = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const i = (at + d + PIECES.length) % PIECES.length;
    setAt(i);
    tabs.current[i]?.focus();
  };

  return (
    <>
      <div className="ln craft-tabs" role="tablist" aria-label="Craft" onKeyDown={key}>
        {PIECES.map((p, i) => (
          <button
            key={p.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`craft-tab-${p.id}`}
            aria-selected={i === at}
            aria-controls="craft-panel"
            tabIndex={i === at ? 0 : -1}
            onClick={() => setAt(i)}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div
        className="ln craft-stage"
        id="craft-panel"
        role="tabpanel"
        aria-labelledby={`craft-tab-${piece.id}`}
        style={{ height: size.stage }}
      >
        {/* keyed by the piece and the size, so a change of either is a
            fresh mount: the glass's canvas is sized once, at mount */}
        <div key={`${piece.id}-${compact}`} className="craft-swap">
          {piece.id === "compare" && <Compare w={size.cw} h={size.ch} />}
          {piece.id === "details" && <LiquidGlass picW={size.gw} picH={size.gh} pad={size.pad} size={size.glass} />}
          {piece.id === "screens" && <AspectRatio side={size.side} />}
        </div>
      </div>
      <div className="ln craft-cap" aria-live="polite">
        <p key={piece.id} className="craft-text">
          {piece.text}
        </p>
      </div>
    </>
  );
}
