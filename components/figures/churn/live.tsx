"use client";

import * as React from "react";
import { IsoFigure } from "@/components/iso/react/draw";
import { follow, useInView, useLoop, useReadout } from "@/components/iso/react/live";
import { translateAlong } from "@/components/iso/iso-kit";
import {
  ART,
  BEADS,
  HEIGHT,
  MONTHS,
  P,
  ROWS,
  WIDTH,
  beadKey,
  beadX,
  keptAt,
  needleAt,
  readoutOf,
  rodY,
  tallyAt,
} from "./churn";
import "./churn.css";

const LABEL =
  "A cohort abacus: one rod per monthly cohort, ten beads to a rod, and a bar down the middle. Each month the beads that churned slide across the bar, and a dial reads the share still on the kept side.";

/** A month every 0.9 s, then a beat at the end before it starts over. */
const PACE = 0.9;

export function ChurnLive(props: {
  base: React.ReactNode;
  frame: React.ReactNode;
  bar: React.ReactNode;
  dial: React.ReactNode;
}) {
  const { anchor, say } = useReadout<HTMLDivElement>();
  const visible = useInView(anchor);

  const beads = React.useRef(new Map<string, SVGGElement | null>());
  const needle = React.useRef<SVGPathElement>(null);
  const state = React.useRef({
    clock: 0,
    month: 0,
    at: new Map<string, number>(),
    rate: 1,
    said: "",
  });

  /** Where every bead rests this month. Built once per month, not per frame. */
  const restAt = React.useCallback((month: number) => {
    const out = new Map<string, number>();
    for (let row = 0; row < ROWS; row += 1) {
      const kept = month < row ? BEADS : keptAt(row, month);
      for (let i = 0; i < BEADS; i += 1) out.set(beadKey(row, i), beadX(i, kept));
    }
    return out;
  }, []);

  useLoop(
    (dt, calm) => {
      const s = state.current;
      s.clock += dt;
      const month = Math.min(MONTHS, Math.floor(s.clock / PACE));
      if (month !== s.month) s.month = month;

      const want = restAt(s.month);
      // Beads slide; they do not jump. Each follows its own target, so a
      // whole cohort crossing the bar arrives as a run rather than a snap.
      want.forEach((target, key) => {
        const now = follow(s.at.get(key) ?? target, target, dt, 0.26, calm);
        s.at.set(key, now);
        const row = Number(key.split("-")[0]);
        beads.current
          .get(key)
          ?.setAttribute("transform", translateAlong(P, [now, rodY(row), 0]));
      });

      // The needle reads the beads, not the model: it is the share of beads
      // that are actually on the kept side right now.
      const { rate } = tallyAt(s.month);
      s.rate = follow(s.rate, rate, dt, 0.3, calm);
      needle.current?.setAttribute("d", needleAt(s.rate));

      const line = readoutOf(s.month);
      if (line !== s.said) {
        s.said = line;
        say(line);
      }

      if (s.clock > (MONTHS + 2) * PACE) {
        s.clock = 0;
        s.month = 0;
      }
      return true;
    },
    visible,
  );

  const rest = React.useMemo(() => restAt(0), [restAt]);

  return (
    <div
      ref={anchor}
      className="churn"
      tabIndex={0}
      role="img"
      aria-label={LABEL}
    >
      <IsoFigure width={WIDTH} height={HEIGHT} label={LABEL}>
        {props.base}
        {props.frame}
        {props.bar}

        {/* Rows run back to front, and within a row the beads are drawn from
            the far end in, so a bead in front is drawn over the one behind
            it however far along the rod they have slid. */}
        {Array.from({ length: ROWS }, (_, row) => (
          <g key={row}>
            {Array.from({ length: BEADS }, (_, k) => BEADS - 1 - k).map((i) => {
              const key = beadKey(row, i);
              return (
                <g
                  key={key}
                  ref={(el) => {
                    beads.current.set(key, el);
                  }}
                  className="iso-solid churn-bead"
                  transform={translateAlong(P, [rest.get(key) ?? 0, rodY(row), 0])}
                >
                  <path className="iso-fill" d={ART.bead.fill} />
                  {ART.bead.shades.map((d, n) => (
                    <path key={n} className="iso-shade" data-shade={n} d={d} />
                  ))}
                  <path className="iso-top" d={ART.bead.top} />
                  <path className="iso-line iso-crease" data-tone="faint" d={ART.bead.crease} />
                  <path className="iso-line iso-edge" data-tone="mid" d={ART.bead.outline} />
                  <path className="iso-line" data-tone="faint" d={ART.beadRing} />
                </g>
              );
            })}
          </g>
        ))}

        {props.dial}
        <path ref={needle} className="iso-line churn-needle" data-tone="lit" d={needleAt(1)} />
      </IsoFigure>
    </div>
  );
}
