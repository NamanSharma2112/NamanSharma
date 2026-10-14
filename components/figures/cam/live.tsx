"use client";

import * as React from "react";
import { IsoFigure, Line, Solid } from "@/components/iso/react/draw";
import { follow, useInView, useLoop, useReadout } from "@/components/iso/react/live";
import { translateAlong } from "@/components/iso/iso-kit";
import {
  BASE_R,
  CAM_CENTRE,
  HEIGHT,
  LIFT,
  P,
  SLIDE_HOME,
  WIDTH,
  camAt,
  ease,
  followerAt,
  markAt,
  needleAt,
  phaseOf,
  radiusAt,
  readoutOf,
} from "./cam";
import "./cam.css";

const LABEL =
  "A bench where a disc cam cut to an easing curve drives a slide: turn the crank and the follower rides the cam, pushing the slide along a ruler while a dial gauge reads how far it has travelled.";

/** Where the roller sits: on the cam's edge, at the angle facing it. */
const reachOf = (angle: number) => radiusAt(-angle);

export function CamLive(props: {
  base: React.ReactNode;
  rails: React.ReactNode;
  shaft: React.ReactNode;
  knob: React.ReactNode;
  arm: React.ReactNode;
  slide: React.ReactNode;
  dial: React.ReactNode;
}) {
  const { anchor, say } = useReadout<HTMLDivElement>();
  const visible = useInView(anchor);

  const cam = React.useRef<SVGGElement>(null);
  const mark = React.useRef<SVGPathElement>(null);
  const roll = React.useRef<SVGGElement>(null);
  const slide = React.useRef<SVGGElement>(null);
  const needle = React.useRef<SVGPathElement>(null);

  const state = React.useRef({ turn: 0, target: 0, touring: true, clock: 0 });

  const draw = React.useCallback(
    (turn: number) => {
      const angle = turn * Math.PI * 2;
      const t = phaseOf(turn);
      const out = ease(t);

      // The cam changes shape on screen as it turns, so it is rebuilt. One
      // solid is well under a tenth of a millisecond.
      const paths = camAt(angle);
      const g = cam.current;
      if (g) {
        const set = (sel: string, d: string) => g.querySelector(sel)?.setAttribute("d", d);
        set("[data-p=fill]", paths.fill);
        paths.shades.forEach((d, i) => set(`[data-p=s${i}]`, d));
        set("[data-p=top]", paths.top);
        set("[data-p=crease]", paths.crease);
        set("[data-p=bevel]", paths.bevel ?? "");
        set("[data-p=outline]", paths.outline);
      }
      mark.current?.setAttribute("d", markAt(angle));

      const f = followerAt(reachOf(angle) - BASE_R);
      const r = roll.current;
      if (r) {
        const set = (sel: string, d: string) => r.querySelector(sel)?.setAttribute("d", d);
        set("[data-p=fill]", f.roller.fill);
        f.roller.shades.forEach((d, i) => set(`[data-p=s${i}]`, d));
        set("[data-p=top]", f.roller.top);
        set("[data-p=crease]", f.roller.crease);
        set("[data-p=outline]", f.roller.outline);
        set("[data-p=pin]", f.pin);
        set("[data-p=back]", f.spring.back);
        set("[data-p=front]", f.spring.front);
      }

      slide.current?.setAttribute("transform", translateAlong(P, [out * LIFT, 0, 0]));
      needle.current?.setAttribute("d", needleAt(out));
      say(readoutOf(turn));
    },
    [say],
  );

  useLoop(
    (dt, calm) => {
      const s = state.current;
      if (s.touring) {
        // One turn every six seconds, so the curve is slow enough to read.
        s.clock += dt;
        s.target = s.clock / 6;
      }
      s.turn = calm ? s.target : follow(s.turn, s.target, dt, 0.12, calm);
      draw(s.turn);
      return true;
    },
    visible,
  );

  // The rest pose, so the server and the first client render agree.
  const rest = React.useMemo(() => camAt(0), []);
  const restRoll = React.useMemo(() => followerAt(reachOf(0) - BASE_R), []);

  const steer = (clientX: number) => {
    const box = anchor.current?.getBoundingClientRect();
    if (!box) return;
    const s = state.current;
    s.touring = false;
    s.target = ((clientX - box.left) / box.width) * 1.4;
  };

  return (
    <div
      ref={anchor}
      className="cam"
      tabIndex={0}
      role="slider"
      aria-label="Turn the crank to play the easing curve"
      aria-valuemin={0}
      aria-valuemax={1}
      aria-valuenow={0}
      onPointerMove={(e) => steer(e.clientX)}
      onPointerLeave={() => {
        state.current.touring = true;
        state.current.clock = state.current.turn * 6;
      }}
      onKeyDown={(e) => {
        const s = state.current;
        const step = e.shiftKey ? 0.1 : 0.02;
        if (e.key === "ArrowRight") { s.touring = false; s.target += step; e.preventDefault(); }
        if (e.key === "ArrowLeft") { s.touring = false; s.target -= step; e.preventDefault(); }
        if (e.key === "Home") { s.touring = false; s.target = 0; e.preventDefault(); }
      }}
    >
      <IsoFigure width={WIDTH} height={HEIGHT} label={LABEL}>
        {props.base}
        {props.rails}
        {props.shaft}

        {/* The cam is the one lit part: it is the curve. */}
        <g ref={cam} className="iso-solid cam-disc" data-lit>
          <path className="iso-fill" data-p="fill" d={rest.fill} />
          {rest.shades.map((d, i) => (
            <path key={i} className="iso-shade" data-shade={i} data-p={`s${i}`} d={d} />
          ))}
          <path className="iso-top" data-p="top" d={rest.top} />
          <path className="iso-line iso-crease" data-tone="lo" data-p="crease" d={rest.crease} />
          <path className="iso-line iso-bevel" data-tone="lo" data-p="bevel" d={rest.bevel ?? ""} />
          <path className="iso-line iso-edge" data-tone="hi" data-p="outline" d={rest.outline} />
        </g>

        <g ref={roll}>
          <path className="iso-line" data-tone="lo" data-p="back" d={restRoll.spring.back} />
          <g className="iso-solid">
            <path className="iso-fill" data-p="fill" d={restRoll.roller.fill} />
            {restRoll.roller.shades.map((d, i) => (
              <path key={i} className="iso-shade" data-shade={i} data-p={`s${i}`} d={d} />
            ))}
            <path className="iso-top" data-p="top" d={restRoll.roller.top} />
            <path className="iso-line iso-crease" data-tone="faint" data-p="crease" d={restRoll.roller.crease} />
            <path className="iso-line iso-edge" data-tone="mid" data-p="outline" d={restRoll.roller.outline} />
          </g>
          <path className="iso-line" data-tone="mid" data-p="pin" d={restRoll.pin} />
          <path className="iso-line" data-tone="mid" data-p="front" d={restRoll.spring.front} />
        </g>

        {props.arm}
        <g ref={slide}>{props.slide}</g>
        {props.knob}
        <path ref={mark} className="iso-line" data-tone="hi" d={markAt(0)} />
        {props.dial}
        <path ref={needle} className="iso-line cam-needle" data-tone="lit" d={needleAt(ease(0))} />
      </IsoFigure>
    </div>
  );
}

export { SLIDE_HOME, Solid };
