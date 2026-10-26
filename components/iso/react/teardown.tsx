"use client";

import * as React from "react";
import { Layers, Box } from "lucide-react";

/* ══ teardown ══════════════════════════════════════════════════════════════
   An exploded view for a figure that is already drawn, one switch away from
   the assembled one.

   ── ALONG THE ASSEMBLY PATH ────────────────────────────────────────────
   Every part on these benches is set down onto the one below it, so the
   primary axis is straight up: each layer rises along world z by its level
   times one gap, keeping its orientation, and zero gap rebuilds the
   assembly exactly. In this projection world z is screen y and nothing
   else, so a lift is a plain vertical translate of the layer's group —
   no geometry is rebuilt, and the figure's own motion (a cam turning, a
   carriage running) carries on inside the lifted layer.

   The whole drawing drops by half the total lift as it opens, so the stack
   spreads about its own middle rather than climbing out of the top of the
   card.

   ── LABELS AND TRAILS ─────────────────────────────────────────────────
   A labelled layer gets a dot on the part, one elbow, and its name in a
   lane at the nearer edge of the drawing — the leaders never cross the
   middle of the stack. Labels are measured off each layer's own bounding
   box once it is mounted, so they stay attached to the part whatever the
   figure draws. A fine chain line runs from where each labelled part sat
   to where it is now; it is drawn behind everything, so opaque parts hide
   it and only the gap it crosses shows. */

type Side = "l" | "r";
type Layer = { node: SVGGElement; level: number; label?: string; at: [number, number]; side?: Side };

export type Mark = {
  label: string;
  /* the anchor on the part, assembled */
  ax: number;
  ay: number;
  lift: number;
  /* where the name sits, exploded */
  side: Side;
  ly: number;
};

/* Lanes and spacing are set in multiples of the label size, which is given
   per figure in viewBox units: the figures are drawn at different scales
   (the bench is fitted wider than the others), and a name has to come out
   at the same size on the page whichever drawing it labels. */
const LANE = 6.75; /* the width of a label lane, in label heights */
const STEP = 1.55; /* the least room between two names in one lane */

const stillness = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function useTeardown({ gap, width, font = 16 }: { gap: number; width: number; font?: number }) {
  const layers = React.useRef(new Map<string, Layer>());
  const refs = React.useRef(new Map<string, (n: SVGGElement | null) => void>());
  const frame = React.useRef<SVGGElement>(null);
  const labels = React.useRef<SVGGElement>(null);
  const trails = React.useRef<SVGGElement>(null);
  const [apart, setApart] = React.useState(false);
  const [marks, setMarks] = React.useState<Mark[]>([]);
  const spring = React.useRef({ e: 0, v: 0, raf: 0 });

  /** A ref for one layer: the level it rises to, and optionally its name
      and where on its bounding box the leader lands (fractions, 0..1). */
  const lift = React.useCallback(
    (level: number, label?: string, at: [number, number] = [0.5, 0.5], side?: Side) => {
      const key = `${level}|${label ?? ""}|${at.join(",")}|${side ?? ""}`;
      let ref = refs.current.get(key);
      if (!ref) {
        ref = (node) => {
          if (node) layers.current.set(key, { node, level, label, at, side });
          else layers.current.delete(key);
        };
        refs.current.set(key, ref);
      }
      return ref;
    },
    [],
  );

  /* Measure once everything is mounted. The groups carry no transform of
     their own yet, and getBBox ignores the element's own transform anyway,
     so this is the assembled position whenever it runs. */
  React.useEffect(() => {
    const out: Mark[] = [];
    for (const l of layers.current.values()) {
      if (!l.label) continue;
      let b: DOMRect;
      try {
        b = l.node.getBBox();
      } catch {
        continue;
      }
      const ax = b.x + b.width * l.at[0];
      const ay = b.y + b.height * l.at[1];
      out.push({ label: l.label, ax, ay, lift: l.level * gap, side: l.side ?? (ax < width / 2 ? "l" : "r"), ly: ay - l.level * gap });
    }
    /* Two names in one lane never sit closer than one line: sorted top to
       bottom, each pushed down past the one above it. */
    for (const side of ["l", "r"] as const) {
      const lane = out.filter((m) => m.side === side).sort((a, b) => a.ly - b.ly);
      for (let i = 1; i < lane.length; i++) {
        const prev = lane[i - 1]!;
        if (lane[i]!.ly < prev.ly + STEP * font) lane[i]!.ly = prev.ly + STEP * font;
      }
    }
    setMarks(out);
  }, [gap, width, font]);

  /* ── the spring ───────────────────────────────────────────────────
     Critically damped toward 0 or 1, so it opens with a settle rather
     than a bounce, and the loop parks the moment it arrives. Higher
     layers start a beat later than lower ones, so the stack comes apart
     from the bottom up and goes back together from the top down. */
  React.useEffect(() => {
    const s = spring.current;
    const target = apart ? 1 : 0;
    const levels = [...layers.current.values()].map((l) => l.level);
    const top = Math.max(1, ...levels);

    /* How far one level has travelled, 0..1, with its stagger. */
    const at = (e: number, level: number) => {
      const k = Math.min(1, Math.max(0, (e - 0.07 * (level - 1)) / (1 - 0.07 * (top - 1))));
      return k * k * (3 - 2 * k);
    };

    const paint = () => {
      const e = s.e;
      for (const l of layers.current.values()) {
        const eased = at(e, l.level);
        l.node.setAttribute("transform", eased ? `translate(0 ${(-l.level * gap * eased).toFixed(2)})` : "");
      }
      frame.current?.setAttribute("transform", e ? `translate(0 ${((top * gap * e) / 2).toFixed(2)})` : "");
      const show = Math.min(1, Math.max(0, (e - 0.72) / 0.28));
      labels.current?.setAttribute("opacity", show.toFixed(3));
      labels.current?.setAttribute("visibility", show > 0 ? "visible" : "hidden");
      trails.current?.setAttribute("opacity", Math.min(1, e * 1.4).toFixed(3));
      trails.current?.querySelectorAll<SVGLineElement>("line").forEach((line) => {
        const lift = Number(line.dataset.lift);
        const y0 = Number(line.dataset.y);
        line.setAttribute("y2", (y0 - lift * at(e, lift / gap)).toFixed(2));
      });
    };

    if (stillness()) {
      s.e = target;
      s.v = 0;
      paint();
      return;
    }

    let prev = 0;
    const tick = (now: number) => {
      const dt = prev ? Math.min(0.05, (now - prev) / 1000) : 1 / 60;
      prev = now;
      /* ω ≈ 11 rad/s, ζ = 1: about half a second end to end. */
      const w = 11;
      s.v += (w * w * (target - s.e) - 2 * w * s.v) * dt;
      s.e += s.v * dt;
      if (Math.abs(target - s.e) < 0.001 && Math.abs(s.v) < 0.001) {
        s.e = target;
        s.v = 0;
        paint();
        s.raf = 0;
        return;
      }
      paint();
      s.raf = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(s.raf);
    s.raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(s.raf);
  }, [apart, gap]);

  return { apart, setApart, lift, frame, labels, trails, marks, width, font };
}

export type TeardownState = ReturnType<typeof useTeardown>;

/** The chain lines, drawn first so every opaque part hides them. */
export function TeardownTrails({ td }: { td: TeardownState }) {
  return (
    <g ref={td.trails} className="td-trails" opacity="0" aria-hidden="true">
      {td.marks.map((m, i) => (
        <line key={i} x1={m.ax} y1={m.ay} x2={m.ax} y2={m.ay} data-y={m.ay} data-lift={m.lift} />
      ))}
    </g>
  );
}

/** Names, leaders and the dot each one lands on, drawn last. */
export function TeardownLabels({ td }: { td: TeardownState }) {
  const { width: w, font } = td;
  const lane = LANE * font;
  return (
    <g
      ref={td.labels}
      className="td-labels"
      opacity="0"
      visibility="hidden"
      aria-hidden="true"
      style={{ fontSize: font }}
    >
      {td.marks.map((m, i) => {
        const y = m.ay - m.lift;
        const edge = m.side === "l" ? lane : w - lane;
        const elbow = m.side === "l" ? edge + font * 0.9 : edge - font * 0.9;
        return (
          <g key={i}>
            <path className="td-leader" d={`M${m.ax.toFixed(1)} ${y.toFixed(1)}L${elbow} ${m.ly.toFixed(1)}H${edge}`} />
            <circle className="td-dot" cx={m.ax} cy={y} r={font * 0.14} />
            <text
              className="td-name"
              x={m.side === "l" ? edge - font * 0.4 : edge + font * 0.4}
              y={m.ly}
              dy="0.35em"
              textAnchor={m.side === "l" ? "end" : "start"}
            >
              {m.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/** The switch. A real button, so it is in the tab order, says what it will
    do, and reports its state; Escape puts the figure back together. */
export function TeardownToggle({ td }: { td: TeardownState }) {
  const { apart, setApart } = td;
  React.useEffect(() => {
    if (!apart) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setApart(false);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [apart, setApart]);
  return (
    <button
      type="button"
      className="td-toggle"
      aria-pressed={apart}
      onClick={(e) => {
        e.stopPropagation();
        setApart(!apart);
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {apart ? <Box aria-hidden /> : <Layers aria-hidden />}
      <span>{apart ? "Put together" : "Take apart"}</span>
    </button>
  );
}
