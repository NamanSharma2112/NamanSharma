"use client";

import * as React from "react";
import { TeardownLabels, TeardownToggle, TeardownTrails, useTeardown } from "@/components/iso/react/teardown";
import { IsoFigure } from "@/components/iso/react/draw";
import { follow, useInView, useLoop, useReadout } from "@/components/iso/react/live";
import { ART, GAP, HEIGHT, PINION, WIDTH, faceOf, handsAt } from "./watch";
import "./watch.css";

const LABEL =
  "A platinum Day-Date with an ice-blue dial and a fluted bezel, lying open on a tray with its three-piece bracelet either side. The hands keep your own time, the window at 12 shows today's day and the date sits under the lens at 3.";

/* The pose the server draws, so the first client render agrees with it:
   ten past ten, the way watches are photographed. */
const REST = 10 * 3600 + 10 * 60;
const HALF_DAY = 12 * 3600;

/* The movement inside beats 28,800 times an hour, eight a second, so the
   seconds hand steps in eighths rather than gliding. */
const BEAT = 1 / 8;

export function WatchLive(props: {
  tray: React.ReactNode;
  head: React.ReactNode;
  dial: React.ReactNode;
  bezel: React.ReactNode;
  glass: React.ReactNode;
}) {
  const { anchor, say } = useReadout<HTMLDivElement>();
  const td = useTeardown({ gap: GAP, width: WIDTH });
  const visible = useInView(anchor);

  const hour = React.useRef<SVGPathElement>(null);
  const minute = React.useRef<SVGPathElement>(null);
  const seconds = React.useRef<SVGPathElement>(null);
  const weight = React.useRef<SVGPathElement>(null);
  const day = React.useRef<SVGTextElement>(null);
  const date = React.useRef<SVGTextElement>(null);

  /* `offset` is how far the crown has set the hands from now, in seconds,
     easing toward `target`; let go and it runs back to the real time. */
  const state = React.useRef({ offset: 0, target: 0, shown: "" });

  const draw = React.useCallback(
    (calm: boolean) => {
      const s = state.current;
      const at = new Date(Date.now() + s.offset * 1000);
      const midnight = new Date(at).setHours(0, 0, 0, 0);
      let t = (at.getTime() - midnight) / 1000;
      t = calm ? Math.floor(t) : Math.floor(t / BEAT) * BEAT;

      const hands = handsAt(t);
      hour.current?.setAttribute("d", hands.hour);
      minute.current?.setAttribute("d", hands.minute);
      seconds.current?.setAttribute("d", hands.seconds);
      weight.current?.setAttribute("d", hands.weight);

      const face = faceOf(at);
      if (face.day + face.date !== s.shown) {
        s.shown = face.day + face.date;
        if (day.current) day.current.textContent = face.day;
        if (date.current) date.current.textContent = face.date;
      }
      say(face.readout);
      anchor.current?.setAttribute("aria-valuetext", face.readout);
    },
    [say, anchor],
  );

  React.useEffect(() => draw(false), [draw]);

  useLoop(
    (dt, calm) => {
      const s = state.current;
      s.offset = follow(s.offset, s.target, dt, 0.35, calm);
      draw(calm);
      return true;
    },
    visible,
  );

  const rest = React.useMemo(() => handsAt(REST), []);

  /* Across the plate is a whole day of the crown: the middle is now, the
     edges twelve hours either side, so the date turns over on the way. */
  const steer = (clientX: number) => {
    const box = anchor.current?.getBoundingClientRect();
    if (!box) return;
    const f = Math.min(1, Math.max(0, (clientX - box.left) / box.width));
    state.current.target = (f - 0.5) * 2 * HALF_DAY;
  };

  return (
    <>
      <div
        ref={anchor}
        className="watch"
        tabIndex={0}
        role="slider"
        aria-label="Turn the crown to set the hands"
        aria-valuemin={-HALF_DAY}
        aria-valuemax={HALF_DAY}
        aria-valuenow={0}
        onPointerMove={(e) => steer(e.clientX)}
        onPointerLeave={() => {
          state.current.target = 0;
        }}
        onKeyDown={(e) => {
          const s = state.current;
          const step = e.shiftKey ? 3600 : 300;
          if (e.key === "ArrowRight") { s.target = Math.min(HALF_DAY, s.target + step); e.preventDefault(); }
          if (e.key === "ArrowLeft") { s.target = Math.max(-HALF_DAY, s.target - step); e.preventDefault(); }
          if (e.key === "Home") { s.target = 0; e.preventDefault(); }
        }}
      >
        <IsoFigure width={WIDTH} height={HEIGHT} label={LABEL}>
          <g ref={td.frame}>
            {/* Taken apart the way it is put together, straight up off the
                tray: the case and bracelet, then the dial, the hands,
                the bezel, and the crystal with its lens last. */}
            <g ref={td.lift(0, "Tray", [0.72, 0.84], "r")}>{props.tray}</g>
            <TeardownTrails td={td} />
            <g ref={td.lift(1, "Case and bracelet", [0.9, 0.45], "r")}>{props.head}</g>

            <g ref={td.lift(2, "Dial", [0.08, 0.5], "l")}>
              {props.dial}
              <text ref={day} className="iso-face-text watch-day" data-tone="hi" transform={ART.dayText} fontSize={1.45} textAnchor="middle" />
            </g>

            <g ref={td.lift(3, "Hands", [0.62, 0.3], "r")}>
              <path ref={hour} className="watch-hand" d={rest.hour} />
              <path ref={minute} className="watch-hand" d={rest.minute} />
              <path ref={weight} className="watch-hand watch-seconds" d={rest.weight} />
              <path ref={seconds} className="watch-hand watch-seconds" d={rest.seconds} />
              <path className="watch-hand" d={PINION} />
            </g>

            <g ref={td.lift(4, "Fluted bezel", [0.04, 0.5], "l")}>{props.bezel}</g>

            <g ref={td.lift(5, "Crystal", [0.86, 0.5], "r")}>
              {props.glass}
              <text ref={date} className="iso-face-text watch-date" data-tone="hi" transform={ART.dateText} fontSize={2.5} textAnchor="middle" />
            </g>
            <TeardownLabels td={td} />
          </g>
        </IsoFigure>
      </div>
      <TeardownToggle td={td} />
    </>
  );
}
