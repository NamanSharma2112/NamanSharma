"use client";

import * as React from "react";
import { TeardownLabels, TeardownToggle, TeardownTrails, useTeardown } from "@/components/iso/react/teardown";
import { IsoFigure, Solid } from "@/components/iso/react/draw";
import { follow, useInView, useLoop, useReadout } from "@/components/iso/react/live";
import { FANS, GAP, HEIGHT, LEVEL, WIDTH, bladesAt, stateOf } from "./gpu";
import "./gpu.css";

const LABEL =
  "A three-fan graphics card lying fans-up: a backplate, the board with the GPU, its memory and power stages, a fin stack the length of the card, three fans in a shroud with a light bar along its edge, and the I/O bracket at the end. The fans spin up with the load and stop below 30%.";

/* Drawn on screen, a fan at 3,000 rpm would be a blur; this many turns a
   second for each rpm keeps the blades readable and the speeds in ratio. */
const SHOWN = 1.5 / 3000;

export function GpuLive(props: {
  back: React.ReactNode;
  board: React.ReactNode;
  power: React.ReactNode;
  chip: React.ReactNode;
  memory: React.ReactNode;
  connectors: React.ReactNode;
  sink: React.ReactNode;
  shroud: React.ReactNode;
}) {
  const { anchor, say } = useReadout<HTMLDivElement>();
  const td = useTeardown({ gap: GAP, width: WIDTH });
  const visible = useInView(anchor);
  const blades = React.useRef<(SVGPathElement | null)[]>([]);

  /* `load` eases toward `target`; the fans' speed eases toward what the
     load asks for more slowly, so they spin up and coast down. */
  const state = React.useRef({ load: 0.62, target: 0.62, speed: 0, turn: 0, touring: true, clock: 0 });

  useLoop(
    (dt, calm) => {
      const s = state.current;
      if (s.touring) {
        /* fourteen seconds from idle to full and back, through the stop */
        s.clock += dt;
        s.target = 0.5 - 0.5 * Math.cos((s.clock / 14) * Math.PI * 2 + 2.2);
      }
      s.load = follow(s.load, s.target, dt, 0.2, calm);
      const card = stateOf(s.load);
      s.speed = follow(s.speed, card.rpm * SHOWN, dt, 0.9, calm);
      /* Still means still: with reduced motion the fans hold their pose
         and only the readout moves. */
      if (!calm) s.turn = (s.turn + s.speed * dt) % 1;
      blades.current.forEach((node, i) => node?.setAttribute("d", bladesAt(i, s.turn)));
      say(card.readout);
      /* The text, not the number: the site ticks a sound for every step a
         slider's value moves, and this one moves on its own every frame. */
      anchor.current?.setAttribute("aria-valuetext", card.readout);
      return true;
    },
    visible,
  );

  const rest = React.useMemo(() => FANS.map((_, i) => bladesAt(i, 0)), []);

  const steer = (clientX: number) => {
    const box = anchor.current?.getBoundingClientRect();
    if (!box) return;
    const s = state.current;
    s.touring = false;
    s.target = Math.min(1, Math.max(0, (clientX - box.left) / box.width));
  };

  return (
    <>
      <div
        ref={anchor}
        className="gpu"
        tabIndex={0}
        role="slider"
        aria-label="Set the load on the card"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={62}
        onPointerMove={(e) => steer(e.clientX)}
        onPointerLeave={() => {
          const s = state.current;
          s.touring = true;
          s.clock = ((Math.acos(1 - 2 * s.load) - 2.2) / (Math.PI * 2)) * 14;
        }}
        onKeyDown={(e) => {
          const s = state.current;
          const step = e.shiftKey ? 0.25 : 0.05;
          if (e.key === "ArrowRight") { s.touring = false; s.target = Math.min(1, s.target + step); e.preventDefault(); }
          if (e.key === "ArrowLeft") { s.touring = false; s.target = Math.max(0, s.target - step); e.preventDefault(); }
          if (e.key === "Home") { s.touring = false; s.target = 0; e.preventDefault(); }
        }}
      >
        <IsoFigure width={WIDTH} height={HEIGHT} label={LABEL}>
          <g ref={td.frame}>
            {/* Taken apart straight up, the way it is built: the board on
                the backplate, the cooler on the board, the fans on the
                cooler and the shroud over all of it. */}
            <g ref={td.lift(LEVEL.back, "Backplate", [0.06, 0.8], "l")}>{props.back}</g>
            <TeardownTrails td={td} />
            <g ref={td.lift(LEVEL.board, undefined, [0.1, 0.1])}>{props.board}</g>
            <g ref={td.lift(LEVEL.board, "Power stages", [0.3, 0.55], "l")}>{props.power}</g>
            <g ref={td.lift(LEVEL.board, "GPU", [0.62, 0.35], "r")}>{props.chip}</g>
            <g ref={td.lift(LEVEL.board, "Memory", [0.5, 0.95], "r")}>{props.memory}</g>
            <g ref={td.lift(LEVEL.board, undefined, [0.2, 0.2])}>{props.connectors}</g>
            <g ref={td.lift(LEVEL.sink, "Heatsink", [0.06, 0.6], "l")}>{props.sink}</g>
            <g ref={td.lift(LEVEL.fans, "Fans", [0.2, 0.5], "l")}>
              {FANS.map((fan, i) => (
                <g key={i}>
                  <path
                    ref={(n) => {
                      blades.current[i] = n;
                    }}
                    className="gpu-blade"
                    d={rest[i]}
                  />
                  <path className="iso-line" data-tone="mid" d={fan.tip} />
                  <Solid paths={fan.hub} tone="hi" />
                  <path className="iso-line" data-tone="lo" d={fan.cap} />
                </g>
              ))}
            </g>
            <g ref={td.lift(LEVEL.shroud, "Shroud", [0.9, 0.3], "r")}>{props.shroud}</g>
            <TeardownLabels td={td} />
          </g>
        </IsoFigure>
      </div>
      <TeardownToggle td={td} />
    </>
  );
}
