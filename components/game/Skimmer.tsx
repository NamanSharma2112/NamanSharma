"use client";

import * as React from "react";
import { IsoFigure } from "@/components/iso/react/draw";
import { useLoop, useReadout } from "@/components/iso/react/live";
import { type SolidPaths, translateAlong } from "@/components/iso/iso-kit";
import {
  BUOY,
  CROSS,
  DRONE,
  EDGE,
  HEIGHT,
  P,
  PLANE,
  PYLON,
  RAILS,
  RIPPLES,
  SHADOW,
  TRACER,
  WIDTH,
  at,
} from "./skimmer";
import "./skimmer.css";

/* ══ Shearwater SK-4 ══════════════════════════════════════════════════════
   Fly the skimmer down the lane, shoot the drones, miss the pylons.

   The drawing is the game. Every part of it is a solid built once in
   skimmer.ts and moved by a transform — no sprite is redrawn, no path is
   recomputed, and a frame is a few dozen setAttribute calls. That is what
   lets an SVG hold a game at all.

   The state lives in one ref and never goes through React: a frame of play
   is not a render. React is told three things only — ready, flying, over —
   because those are the three things that change what is on screen. */

const LANE_IN = 430; /* where a thing enters, far up the lane */
const LANE_OUT = -70; /* and where it is past you and gone */
const PYLONS = 5;
const BUOYS = 4;
const DRONES = 4;
const TRACERS = 10;
const CROSSES = 16;
const CROSS_GAP = 44;

type Kind = 0 | 1 | 2; /* pylon, buoy, drone */

interface Thing {
  live: boolean;
  kind: Kind;
  d: number;
  s: number;
  node: SVGGElement | null;
}

interface Shot {
  live: boolean;
  d: number;
  s: number;
  node: SVGGElement | null;
}

const HALF: Record<Kind, number> = { 0: 15, 1: 15, 2: 22 };

/** One prebuilt solid, as JSX. */
function Solid({ paths, tone = "mid", lit }: { paths: SolidPaths; tone?: string; lit?: boolean }) {
  return (
    <g className="iso-solid" data-lit={lit ? "" : undefined}>
      <path className="iso-fill" d={paths.fill} />
      {paths.shades.map((d, i) => (
        <path key={i} className="iso-shade" data-shade={i} d={d} />
      ))}
      <path className="iso-top" d={paths.top} />
      <path className="iso-line iso-crease" data-tone="faint" d={paths.crease} />
      {paths.bevel ? <path className="iso-line iso-bevel" data-tone="lo" d={paths.bevel} /> : null}
      <path className="iso-line iso-edge" data-tone={tone} d={paths.outline} />
    </g>
  );
}

const LABEL =
  "An isometric ground-effect skimmer flying down a lane: steer it across, shoot the drones coming at you, and miss the pylons and buoys.";

export default function Skimmer() {
  const { anchor, say } = useReadout<HTMLDivElement>();
  const [phase, setPhase] = React.useState<"ready" | "flying" | "over">("ready");
  const [best, setBest] = React.useState(0);
  const [last, setLast] = React.useState(0);

  const plane = React.useRef<SVGGElement>(null);
  const bank = React.useRef<SVGGElement>(null);
  const yard = React.useRef<SVGGElement>(null);
  const water = React.useRef<(SVGGElement | null)[]>([]);
  const hits = React.useRef<SVGGElement>(null);

  /* Everything the game is, in one object. Nothing in here is state: it is
     read and written sixty times a second and rendering on it would be the
     whole frame budget. */
  const g = React.useRef({
    s: 0, /* where the skimmer is across the lane */
    vs: 0, /* and how fast it is going there */
    lift: 0, /* the bob, which is only ever cosmetic */
    want: 0, /* where the controls are asking for */
    lives: 3,
    score: 0,
    speed: 190,
    scroll: 0,
    cool: 0, /* time until the guns will fire again */
    spawn: 0,
    hurt: 0, /* the flash after a knock */
    clock: 0,
    things: [] as Thing[],
    shots: [] as Shot[],
    keys: new Set<string>(),
    order: "",
  });

  if (g.current.things.length === 0) {
    const make = (kind: Kind, n: number) =>
      Array.from({ length: n }, () => ({ live: false, kind, d: 0, s: 0, node: null }) as Thing);
    g.current.things = [...make(0, PYLONS), ...make(1, BUOYS), ...make(2, DRONES)];
    g.current.shots = Array.from({ length: TRACERS }, () => ({ live: false, d: 0, s: 0, node: null }) as Shot);
  }

  const reset = React.useCallback(() => {
    const s = g.current;
    s.s = 0;
    s.vs = 0;
    s.want = 0;
    s.lives = 3;
    s.score = 0;
    s.speed = 190;
    s.cool = 0;
    s.spawn = 0.8;
    s.hurt = 0;
    s.things.forEach((t) => {
      t.live = false;
      t.node?.setAttribute("opacity", "0");
    });
    s.shots.forEach((t) => {
      t.live = false;
      t.node?.setAttribute("opacity", "0");
    });
  }, []);

  const fire = React.useCallback(() => {
    const s = g.current;
    if (s.cool > 0) return;
    const free = s.shots.find((t) => !t.live);
    if (!free) return;
    s.cool = 0.16;
    free.live = true;
    free.d = 30;
    free.s = s.s;
  }, []);

  /* ── the keys ─────────────────────────────────────────────────────────
     Bound to the window rather than to the figure, because a game you have
     to click before it will listen is a game nobody plays. The page's own
     scrolling keys are only swallowed while it is actually flying. */
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key;
      if (k === " " || k === "ArrowLeft" || k === "ArrowRight" || k === "ArrowUp" || k === "ArrowDown") {
        if (phase === "flying") e.preventDefault();
      }
      if (phase !== "flying") {
        if (k === "Enter" || k === " ") {
          reset();
          setPhase("flying");
        }
        return;
      }
      g.current.keys.add(k);
      if (k === " ") fire();
      if (k === "Escape" || k === "p" || k === "P") setPhase("ready");
    };
    const up = (e: KeyboardEvent) => g.current.keys.delete(e.key);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [phase, fire, reset]);

  /* Steering with a pointer, so it plays on a phone: where you touch across
     the card is where it goes, and a tap fires. */
  const aim = (e: React.PointerEvent<HTMLDivElement>) => {
    if (phase !== "flying") return;
    const r = e.currentTarget.getBoundingClientRect();
    g.current.want = ((e.clientX - r.left) / r.width - 0.5) * 2 * EDGE;
  };

  const tap = () => {
    if (phase === "flying") fire();
    else {
      reset();
      setPhase("flying");
    }
  };

  useLoop(
    (dt, calm) => {
      const s = g.current;
      const step = Math.min(dt, 1 / 30);
      s.clock += step;

      /* The lane scrolls even on the title card, so the thing is alive
         before you touch it — but it holds still if the browser has been
         asked for stillness. */
      const flying = phase === "flying";
      const speed = calm ? 0 : flying ? s.speed : 70;
      s.scroll = (s.scroll + speed * step) % CROSS_GAP;
      water.current.forEach((node, i) => {
        const d = LANE_IN - ((i * CROSS_GAP + s.scroll) % (CROSSES * CROSS_GAP)) - 60;
        node?.setAttribute("transform", translateAlong(P, at(d, 0, 0)));
      });

      if (flying && !calm) {
        /* ── steering ────────────────────────────────────────────────
           A spring, not a position: the skimmer has mass, so it leans
           into a turn and keeps going for a moment after you stop. */
        if (s.keys.has("ArrowLeft") || s.keys.has("a")) s.want -= 420 * step;
        if (s.keys.has("ArrowRight") || s.keys.has("d")) s.want += 420 * step;
        s.want = Math.max(-EDGE, Math.min(EDGE, s.want));
        s.vs += (s.want - s.s) * 14 * step;
        s.vs *= Math.pow(0.0016, step);
        s.s += s.vs * step;

        s.speed = Math.min(430, 190 + s.score * 0.22);
        s.score += step * 6;
        s.cool -= step;
        s.hurt = Math.max(0, s.hurt - step);

        /* ── what comes down the lane ────────────────────────────── */
        s.spawn -= step;
        if (s.spawn <= 0) {
          s.spawn = Math.max(0.42, 1.25 - s.score * 0.0012);
          const free = s.things.filter((t) => !t.live);
          const pick = free[Math.floor(Math.random() * free.length)];
          if (pick) {
            pick.live = true;
            pick.d = LANE_IN;
            pick.s = (Math.random() * 2 - 1) * (EDGE - 18);
            pick.node?.setAttribute("opacity", "1");
          }
        }

        for (const t of s.things) {
          if (!t.live) continue;
          t.d -= s.speed * step;
          /* The drones come at you a little faster and drift, which is why
             they are the ones worth shooting. */
          if (t.kind === 2) {
            t.d -= 40 * step;
            t.s += Math.sin(s.clock * 1.7 + t.d * 0.03) * 36 * step;
          }
          if (t.d < LANE_OUT) {
            t.live = false;
            t.node?.setAttribute("opacity", "0");
            continue;
          }
          if (Math.abs(t.d) < 16 && Math.abs(t.s - s.s) < HALF[t.kind] + 16 && s.hurt === 0) {
            t.live = false;
            t.node?.setAttribute("opacity", "0");
            s.lives -= 1;
            s.hurt = 1.1;
            if (s.lives <= 0) {
              const total = Math.round(s.score);
              setLast(total);
              setBest((was) => (total > was ? total : was));
              setPhase("over");
            }
          }
        }

        for (const b of s.shots) {
          if (!b.live) continue;
          b.d += 620 * step;
          if (b.d > LANE_IN) {
            b.live = false;
            b.node?.setAttribute("opacity", "0");
            continue;
          }
          const hit = s.things.find(
            (t) => t.live && Math.abs(t.d - b.d) < 22 && Math.abs(t.s - b.s) < HALF[t.kind],
          );
          if (hit) {
            b.live = false;
            b.node?.setAttribute("opacity", "0");
            hit.live = false;
            hit.node?.setAttribute("opacity", "0");
            s.score += hit.kind === 2 ? 60 : 15;
            hits.current?.setAttribute("transform", translateAlong(P, at(hit.d, hit.s, 14)));
            hits.current?.setAttribute("opacity", "1");
            hits.current?.animate?.(
              [{ opacity: 1, transformBox: "fill-box" }, { opacity: 0 }],
              { duration: 260, easing: "ease-out", fill: "forwards" },
            );
          }
        }
      }

      /* ── drawing: a transform each, and nothing else ──────────────── */
      for (const t of s.things) {
        if (!t.live || !t.node) continue;
        t.node.setAttribute("transform", translateAlong(P, at(t.d, t.s, 0)));
      }
      for (const b of s.shots) {
        if (!b.node) continue;
        if (!b.live) continue;
        b.node.setAttribute("opacity", "1");
        b.node.setAttribute("transform", translateAlong(P, at(b.d, b.s, 16)));
      }

      /* Painter's order. Everything in the lane shares one speed, so this
         almost never changes — it is compared before it is applied, and the
         DOM is only touched on the frame a thing actually overtakes. */
      const live = s.things.filter((t) => t.live && t.node);
      live.sort((a, b) => b.d - a.d);
      const key = live.map((t) => s.things.indexOf(t)).join(",");
      if (key !== s.order) {
        s.order = key;
        const bin = yard.current;
        if (bin) for (const t of live) bin.appendChild(t.node!);
      }

      s.lift = calm ? 0 : Math.sin(s.clock * 2.1) * 2.2;
      plane.current?.setAttribute("transform", translateAlong(P, at(0, s.s, s.lift)));
      /* The bank is a rotation of the whole aircraft about its own middle:
         at this scale that reads as a lean, and a lean is most of what
         tells you a turn is happening. */
      const lean = Math.max(-11, Math.min(11, -s.vs * 0.055));
      bank.current?.setAttribute("transform", `rotate(${lean.toFixed(2)})`);
      plane.current?.setAttribute("opacity", s.hurt > 0 && Math.floor(s.hurt * 14) % 2 ? "0.25" : "1");

      say(
        flying
          ? `alt ${(17.2 + s.lift).toFixed(1)} m · ias ${Math.round(s.speed / 3.4)} kt · ` +
              `hull ${"▮".repeat(Math.max(0, s.lives))}${"▯".repeat(Math.max(0, 3 - s.lives))} · ${Math.round(s.score)}`
          : "alt 17.2 m · ias 58 kt · hdg 313° · bank R 2.1°",
      );
      return true;
    },
    true,
  );

  return (
    <div
      ref={anchor}
      className="skim"
      onPointerMove={aim}
      onPointerDown={tap}
      data-phase={phase}
    >
      <IsoFigure width={WIDTH} height={HEIGHT} label={LABEL}>
        {/* the surface */}
        <g className="skim-water">
          {RAILS.map((d, i) => (
            <path key={i} className="iso-line" data-tone="faint" d={d} />
          ))}
          {Array.from({ length: CROSSES }, (_, i) => (
            <g key={i} ref={(n) => { water.current[i] = n; }}>
              <path className="iso-line" data-tone="faint" d={CROSS} />
            </g>
          ))}
        </g>

        {/* what is coming at you, furthest first */}
        <g ref={yard}>
          {g.current.things.map((t, i) => (
            <g
              key={i}
              opacity="0"
              ref={(n) => { t.node = n; }}
            >
              {t.kind === 0 ? (
                <>
                  <Solid paths={PYLON.post} tone="mid" />
                  <Solid paths={PYLON.cap} tone="hi" />
                </>
              ) : t.kind === 1 ? (
                <>
                  <Solid paths={BUOY.body} tone="mid" />
                  <Solid paths={BUOY.mast} tone="lo" />
                </>
              ) : (
                <>
                  <Solid paths={DRONE.body} tone="hi" lit />
                  <Solid paths={DRONE.rotorR} tone="lo" />
                  <Solid paths={DRONE.rotorL} tone="lo" />
                </>
              )}
            </g>
          ))}
        </g>

        {/* the guns */}
        {g.current.shots.map((b, i) => (
          <g key={i} opacity="0" ref={(n) => { b.node = n; }}>
            <path className="iso-line skim-tracer" data-tone="lit" d={TRACER} />
          </g>
        ))}

        <g ref={hits} opacity="0">
          <path className="iso-line skim-burst" data-tone="lit" d={RIPPLES[0]!} />
        </g>

        {/* and the aircraft, nearest the camera and drawn last */}
        <g ref={plane}>
          <path className="skim-shadow" d={SHADOW} />
          <g className="skim-wake">
            {RIPPLES.map((d, i) => (
              <path key={i} className="iso-line" data-tone="faint" d={d} style={{ animationDelay: `${i * 0.5}s` }} />
            ))}
          </g>
          <g ref={bank} className="skim-plane">
            {/* Painter's order, far side first. The nose points away, so the
                tail is the near end and the right wing is the far one: draw
                it before the hull and the left wing after, or the hull cuts
                through a wing it is behind. */}
            <Solid paths={PLANE.floatR} tone="lo" />
            <Solid paths={PLANE.wingR} tone="mid" />
            <Solid paths={PLANE.hull} tone="hi" lit />
            <Solid paths={PLANE.canopy} tone="hi" />
            <Solid paths={PLANE.nacelleR} tone="mid" />
            <Solid paths={PLANE.nacelleL} tone="mid" />
            <Solid paths={PLANE.tailplane} tone="mid" />
            <Solid paths={PLANE.fin} tone="mid" />
            <Solid paths={PLANE.wingL} tone="mid" />
            <Solid paths={PLANE.floatL} tone="lo" />
          </g>
        </g>
      </IsoFigure>

      {phase !== "flying" ? (
        <div className="skim-card">
          <p className="skim-card-title">
            {phase === "over" ? "Down in the water" : "Shearwater SK-4"}
          </p>
          <p className="skim-card-note">
            {phase === "over"
              ? `${last} on that run${best > last ? ` · best ${best}` : ""}. The drones are worth four times a buoy.`
              : "Steer across the lane, shoot the drones, miss the pylons. Three hulls."}
          </p>
          <button className="skim-start" type="button" onClick={tap}>
            {phase === "over" ? "Fly again" : "Take off"}
          </button>
          <p className="skim-card-keys">
            <span>← →</span> steer <span>Space</span> guns <span>Esc</span> set down
          </p>
        </div>
      ) : null}
    </div>
  );
}
