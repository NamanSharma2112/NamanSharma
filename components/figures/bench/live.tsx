"use client";

import * as React from "react";
import { TeardownLabels, TeardownToggle, TeardownTrails, useTeardown } from "@/components/iso/react/teardown";
import { IsoFigure, Line } from "@/components/iso/react/draw";
import { useInView, useLoop, useReadout } from "@/components/iso/react/live";
import { translateAlong } from "@/components/iso/iso-kit";
import {
  ART,
  CYCLE,
  HEIGHT,
  P,
  STAGES,
  WIDTH,
  needleAt,
  penAt,
  probeAt,
  ramAt,
  readoutOf,
  spindleAt,
  stepAt,
} from "./bench";
import "./bench.css";

const LABEL =
  "A workbench: one piece travels a rail through four stations — a drawing head, a spindle, a press and a dial gauge — gaining its marks at each one, and is set down finished at the end.";

/** Paint one prebuilt solid into a group of placeholder paths. */
function paint(g: Element | null, prefix: string, paths: { fill: string; shades: string[]; top: string; crease: string; outline: string }) {
  if (!g) return;
  const set = (name: string, d: string) => g.querySelector(`[data-p="${prefix}${name}"]`)?.setAttribute("d", d);
  set("fill", paths.fill);
  paths.shades.forEach((d, i) => set(`s${i}`, d));
  set("top", paths.top);
  set("crease", paths.crease);
  set("outline", paths.outline);
}

/** The placeholder paths one solid needs, as JSX. */
function Shell({ p, tone = "mid", rest }: { p: string; tone?: string; rest: { fill: string; shades: string[]; top: string; crease: string; outline: string } }) {
  return (
    <g className="iso-solid">
      <path className="iso-fill" data-p={`${p}fill`} d={rest.fill} />
      {rest.shades.map((d, i) => (
        <path key={i} className="iso-shade" data-shade={i} data-p={`${p}s${i}`} d={d} />
      ))}
      <path className="iso-top" data-p={`${p}top`} d={rest.top} />
      <path className="iso-line iso-crease" data-tone="faint" data-p={`${p}crease`} d={rest.crease} />
      <path className="iso-line iso-edge" data-tone={tone} data-p={`${p}outline`} d={rest.outline} />
    </g>
  );
}

export function BenchLive(props: {
  plate: React.ReactNode;
  back: React.ReactNode;
  rail: React.ReactNode;
  stations: React.ReactNode;
  gauge: React.ReactNode;
  front: React.ReactNode;
  box: React.ReactNode;
}) {
  const { anchor, say } = useReadout<HTMLDivElement>();
  const td = useTeardown({ gap: 26, width: WIDTH, font: 9.5 });
  const visible = useInView(anchor);

  const car = React.useRef<SVGGElement>(null);
  const marks = React.useRef<SVGGElement>(null);
  const tools = React.useRef<SVGGElement>(null);
  const needle = React.useRef<SVGPathElement>(null);
  const done = React.useRef<(SVGGElement | null)[]>([]);
  const state = React.useRef({ clock: 0, said: "", spin: 0 });

  const rest = React.useMemo(
    () => ({ pen: penAt(0), spindle: spindleAt(0, 0), ram: ramAt(0), probe: probeAt(0) }),
    [],
  );

  useLoop(
    (dt, calm) => {
      const s = state.current;
      s.clock += calm ? 0 : dt;
      const step = stepAt(s.clock);
      // The cutter only turns while it is cutting, which is the whole point
      // of a spindle: it is not a decoration that spins all day.
      s.spin += (step.tool === 1 ? 11 : 0) * dt;

      car.current?.setAttribute("transform", translateAlong(P, [step.x, 0, 0]));

      // Each mark appears once its own station has passed over the piece.
      const m = marks.current;
      if (m) {
        m.querySelector("[data-mark=scribe]")?.setAttribute("opacity", step.done > 0 ? "1" : "0");
        m.querySelector("[data-mark=notch]")?.setAttribute("opacity", step.done > 1 ? "1" : "0");
        m.querySelector("[data-mark=stamp]")?.setAttribute("opacity", step.done > 2 ? "1" : "0");
      }

      const pen = penAt(step.tool === 0 ? step.bite : 0);
      const sp = spindleAt(step.tool === 1 ? step.bite : 0, s.spin);
      const ram = ramAt(step.tool === 2 ? step.bite : 0);
      const probe = probeAt(step.tool === 3 ? step.bite : 0);
      const t = tools.current;
      paint(t, "pen-", pen.holder);
      paint(t, "nib-", pen.nib);
      paint(t, "quill-", sp.quill);
      paint(t, "collet-", sp.collet);
      paint(t, "cutter-", sp.cutter);
      paint(t, "head-", ram.head);
      paint(t, "nose-", ram.nose);
      paint(t, "stem-", probe.stem);
      paint(t, "pad-", probe.pad);
      t?.querySelector("[data-p=spin]")?.setAttribute("d", sp.mark);

      // The needle reads the probe, so it only moves when something is
      // touching the work.
      needle.current?.setAttribute("d", needleAt(step.tool === 3 ? step.bite * 0.78 : 0));

      /* What the bench has made. A machine with nothing coming off it is a
         machine you have to take on trust, so the finished pieces stack up
         in the tray at the end — one per cycle, three, then the tray is
         cleared and it starts again. */
      const made = Math.floor(s.clock / CYCLE) % 4;
      done.current.forEach((node, i) => node?.setAttribute("opacity", i < made ? "1" : "0"));

      const line = readoutOf(step);
      if (line !== s.said) {
        s.said = line;
        say(line);
      }
      return true;
    },
    visible,
  );

  return (
    <>
    <div ref={anchor} className="bench" tabIndex={0} role="img" aria-label={LABEL}>
      <IsoFigure width={WIDTH} height={HEIGHT} label={LABEL}>
        <g ref={td.frame}>
        {/* Taken apart in the order it would come apart: the gantries
            bridge over the carriage, so they come off first, tools and gauge
            with them; then the carriage with the piece on it; then the rail
            and the control box, leaving the plate and the tray. */}
        <g ref={td.lift(0, "Base plate", [0.08, 0.6])}>{props.plate}</g>
        <TeardownTrails td={td} />
        <g ref={td.lift(1)}>{props.back}</g>
        <g ref={td.lift(1, "Rail", [0.25, 0.36])}>{props.rail}</g>

        {/* The work, on its carriage, drawn where it physically sits: after
            the rail it rides and before the tools that reach down to it. */}
        {/* Unlabelled: it runs the length of the rail all the time, so a
            name pinned where it stood when it was measured would point at
            empty rail half the time. */}
        <g ref={td.lift(2)}>
        <g ref={car}>
          {ART.carBushes.map((paths, i) => (
            <g key={i} className="iso-solid">
              <path className="iso-fill" d={paths.fill} />
              {paths.shades.map((d, n) => (
                <path key={n} className="iso-shade" data-shade={n} d={d} />
              ))}
              <path className="iso-top" d={paths.top} />
              <path className="iso-line iso-edge" data-tone="lo" d={paths.outline} />
            </g>
          ))}
          <g className="iso-solid">
            <path className="iso-fill" d={ART.car.fill} />
            {ART.car.shades.map((d, n) => (
              <path key={n} className="iso-shade" data-shade={n} d={d} />
            ))}
            <path className="iso-top" d={ART.car.top} />
            <path className="iso-line iso-crease" data-tone="faint" d={ART.car.crease} />
            <path className="iso-line iso-edge" data-tone="mid" d={ART.car.outline} />
          </g>
          <path className="iso-line" data-tone="faint" d={ART.carSeat} />
          <g className="iso-dots">
            {ART.carRivets.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={0.45} />
            ))}
          </g>
          {ART.clamps.map((paths, i) => (
            <g key={i} className="iso-solid">
              <path className="iso-fill" d={paths.fill} />
              {paths.shades.map((d, n) => (
                <path key={n} className="iso-shade" data-shade={n} d={d} />
              ))}
              <path className="iso-top" d={paths.top} />
              <path className="iso-line iso-edge" data-tone="lo" d={paths.outline} />
            </g>
          ))}

          {/* The piece is the one lit part: it is what the bench is for. */}
          <g className="iso-solid bench-piece" data-lit>
            <path className="iso-fill" d={ART.piece.fill} />
            {ART.piece.shades.map((d, n) => (
              <path key={n} className="iso-shade" data-shade={n} d={d} />
            ))}
            <path className="iso-top" d={ART.piece.top} />
            <path className="iso-line iso-crease" data-tone="lo" d={ART.piece.crease} />
            <path className="iso-line iso-bevel" data-tone="lo" d={ART.piece.bevel ?? ""} />
            <path className="iso-line iso-edge" data-tone="hi" d={ART.piece.outline} />
          </g>

          <g ref={marks}>
            <g data-mark="scribe" opacity="0">
              {ART.scribes.map((d, i) => (
                <path key={i} className="iso-line" data-tone="lo" d={d} />
              ))}
            </g>
            <path data-mark="notch" opacity="0" className="iso-line" data-tone="mid" d={ART.notch} />
            <g data-mark="stamp" opacity="0">
              <path className="iso-line" data-tone="mid" d={ART.stamp} />
              <g className="iso-dots">
                {ART.stampDot.map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r={0.5} />
                ))}
              </g>
            </g>
          </g>
        </g>

        </g>

        <g ref={td.lift(3, "Four stations", [0.12, 0.25])}>
        {props.stations}

        {/* The tools that come down onto the work. */}
        <g ref={tools}>
          <Shell p="pen-" tone="mid" rest={rest.pen.holder} />
          <Shell p="nib-" tone="lit" rest={rest.pen.nib} />
          <Shell p="quill-" tone="mid" rest={rest.spindle.quill} />
          <Shell p="collet-" tone="mid" rest={rest.spindle.collet} />
          <Shell p="cutter-" tone="lit" rest={rest.spindle.cutter} />
          <path className="iso-line" data-tone="hi" data-p="spin" d={rest.spindle.mark} />
          <Shell p="head-" tone="mid" rest={rest.ram.head} />
          <Shell p="nose-" tone="lit" rest={rest.ram.nose} />
          <Shell p="stem-" tone="mid" rest={rest.probe.stem} />
          <Shell p="pad-" tone="lit" rest={rest.probe.pad} />
        </g>

        {props.gauge}
        <path ref={needle} className="iso-line bench-needle" data-tone="lit" d={needleAt(0)} />
        </g>
        <g ref={td.lift(1, "Control box", [0.6, 0.5])}>{props.box}</g>
        {props.front}

        {/* The output: set down on the tray at the end of the bench. */}
        {ART.outDone.map((paths, i) => (
          <g key={i} opacity="0" ref={(n) => { done.current[i] = n; }}>
            <g className="iso-solid bench-done" data-lit={i === 2 ? "" : undefined}>
              <path className="iso-fill" d={paths.fill} />
              {paths.shades.map((d, n) => (
                <path key={n} className="iso-shade" data-shade={n} d={d} />
              ))}
              <path className="iso-top" d={paths.top} />
              <path className="iso-line iso-crease" data-tone="faint" d={paths.crease} />
              <path className="iso-line iso-edge" data-tone="mid" d={paths.outline} />
            </g>
            <path className="iso-line" data-tone="lo" d={ART.outNotch[i]!} />
            <path className="iso-line" data-tone="mid" d={ART.outStamp[i]!} />
          </g>
        ))}
        <TeardownLabels td={td} />
        </g>
      </IsoFigure>
    </div>
    <TeardownToggle td={td} />
    </>
  );
}
