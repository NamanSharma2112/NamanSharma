"use client";

import * as React from "react";
import { AspectRatio } from "./AspectRatio";
import { Compare } from "./Compare";
import { LiquidGlass } from "./LiquidGlass";
import { useLive } from "./useLive";

/* ══ The craft chapter ═════════════════════════════════════════════════
   Three ways of showing what design engineering does to an interface: the
   same dialog before and after, the finished one under a glass with its
   measurements drawn on, and one design across three screens.

   ── SIDE BY SIDE, PLAYING ─────────────────────────────────────────────
   On a wide screen the three stand in a row on the bare ground, the way
   everything else on the page does — no panel, no badge, no chrome — each
   with its name and a line under it, and
   each plays by itself while the chapter is in: the line sweeps, the glass
   drifts, the screens change. A hand on a piece stops that piece, and only
   that one, and it starts again a few seconds after the hand has gone — so
   the row is a demonstration until somebody wants to use it, and then it
   is theirs.

   ── ONE AT A TIME, NARROW ─────────────────────────────────────────────
   Three cards will not stand side by side on a phone or a tablet held
   upright, so there they take turns: the tabs above choose one, and the
   chapter moves on to the next by itself every few seconds until the
   reader touches anything in it.

   Every piece is drawn from one measured size, the width of its column,
   so the three are the same height and the row reads as one object. */

type Id = "compare" | "details" | "screens";
type Piece = { id: Id; label: string; hint: string; text: string };

const PIECES: Piece[] = [
  {
    id: "compare",
    label: "Before and after",
    hint: "Drag the line",
    text: "The same dialog, twice. Spacing on one scale, radii that nest, type with a hierarchy, contrast you can read.",
  },
  {
    id: "details",
    label: "Details",
    hint: "Drag the glass",
    text: "Pixel-perfect is a checklist: every gap, every height and every radius measured, and none of them guessed.",
  },
  {
    id: "screens",
    label: "Every screen",
    hint: "Pick a screen",
    text: "One design on a phone, a tablet and a desktop, each given the same area, so the layout changes and not the size.",
  },
];

/* how long a hand keeps a piece still after it lets go, and how long a
   narrow screen shows each piece before moving on */
const REST = 5000;
const TURN = 7000;
/* the row needs this much room before three cards are worth having */
const ROW = "(min-width: 1100px) and (min-height: 700px)";

function usePieceSize(box: React.RefObject<HTMLDivElement | null>) {
  const [s, setS] = React.useState({ w: 0, h: 0 });
  React.useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      const w = Math.floor(el.clientWidth);
      /* a little under square, and never taller than the window can
         give once the label and the words under it are in */
      const h = Math.floor(Math.max(220, Math.min(w * 0.8, innerHeight - 400)));
      setS((o) => (o.w === w && o.h === h ? o : { w, h }));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      removeEventListener("resize", fit);
    };
  }, [box]);
  return s;
}

function Card({ piece, live, title }: { piece: Piece; live: boolean; title: boolean }) {
  const box = React.useRef<HTMLDivElement>(null);
  const { w, h } = usePieceSize(box);
  /* a hand on the piece, and when it was last there */
  const [held, setHeld] = React.useState(false);
  const rest = React.useRef(0);
  const touch = () => {
    setHeld(true);
    window.clearTimeout(rest.current);
    rest.current = window.setTimeout(() => setHeld(false), REST);
  };
  React.useEffect(() => () => window.clearTimeout(rest.current), []);
  const auto = live && !held;
  /* the glass's margin, so it can be carried off the picture onto the
     page; it spills into the gap between the pieces, which is wider */
  const pad = 16;

  return (
    <article className="craft-card" aria-label={piece.label}>
      <div
        ref={box}
        className="craft-piece"
        style={{ height: h || undefined }}
        onPointerDownCapture={touch}
        onKeyDownCapture={touch}
      >
        {w > 0 && (
          <div key={`${w}x${h}`} className="craft-fit">
            {piece.id === "compare" && <Compare w={w} h={h} corner={12} auto={auto} />}
            {piece.id === "details" && (
              <LiquidGlass picW={w} picH={h} pad={pad} corner={12} size={Math.round(Math.min(w, h) * 0.42)} auto={auto} />
            )}
            {piece.id === "screens" && <AspectRatio side={h - 52} corner={12} auto={auto} />}
          </div>
        )}
      </div>
      {/* the words under it, as the rest of the page sets them: the name in
          ink, then the line in the body grey, and the one thing to do in the
          quiet one. On a narrow screen the tabs above already name it */}
      <div className="craft-words">
        {title && <h3 className="craft-title">{piece.label}</h3>}
        <p className="craft-text">
          {piece.text} <span className="craft-do">{piece.hint}.</span>
        </p>
      </div>
    </article>
  );
}

export function Craft() {
  const root = React.useRef<HTMLDivElement>(null);
  const live = useLive(root);
  /* unknown until the window has been asked: rendering the row first and
     then finding a phone would build the glass's WebGL context only to
     throw it away, and on a phone that compile is a long, visible stall */
  const [row, setRow] = React.useState<boolean | null>(null);
  const [at, setAt] = React.useState(0);
  const [held, setHeld] = React.useState(false);
  const tabs = React.useRef<(HTMLButtonElement | null)[]>([]);

  React.useEffect(() => {
    const mq = matchMedia(ROW);
    const fit = () => setRow(mq.matches);
    fit();
    mq.addEventListener("change", fit);
    return () => mq.removeEventListener("change", fit);
  }, []);

  /* narrow: on to the next piece every few seconds, until touched */
  React.useEffect(() => {
    if (row || !live || held) return;
    const id = window.setTimeout(() => setAt((i) => (i + 1) % PIECES.length), TURN);
    return () => window.clearTimeout(id);
  }, [row, live, held, at]);

  const key = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const i = (at + d + PIECES.length) % PIECES.length;
    setAt(i);
    tabs.current[i]?.focus();
  };

  const piece = PIECES[at]!;
  return (
    <div ref={root} className="craft">
      {row === true && (
        <div className="ln craft-row">
          {PIECES.map((p) => (
            <Card key={p.id} piece={p} live={live} title />
          ))}
        </div>
      )}
      {row === false && (
        <div className="craft-one" onPointerDownCapture={() => setHeld(true)} onKeyDownCapture={() => setHeld(true)}>
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
                {/* how long until it moves on, while it is moving on by itself */}
                {i === at && live && !held && <span key={at} className="craft-clock" aria-hidden="true" />}
              </button>
            ))}
          </div>
          <div className="ln craft-stage" id="craft-panel" role="tabpanel" aria-labelledby={`craft-tab-${piece.id}`}>
            <div key={piece.id} className="craft-swap">
              <Card piece={piece} live={live} title={false} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
