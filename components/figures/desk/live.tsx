"use client";

import * as React from "react";
import { IsoFigure, Line } from "@/components/iso/react/draw";
import { follow, useInView, useLoop, useReadout } from "@/components/iso/react/live";
import {
  ART,
  DOCK,
  HEIGHT,
  MENU,
  MENU_ITEMS,
  WIDTH,
  WINDOWS,
  readoutOf,
  windowAt,
} from "./desk";
import "./desk.css";

const LABEL =
  "A workstation on a desk: a monitor on a stand whose screen carries a menu bar, a dock of six apps and three windows that open one after another, with a keyboard, a mouse and a tower beside it.";

/** The boot runs once, then the windows open in order, then it holds. */
const BOOT = 1.1;
const STEP = 0.75;

export function DeskLive(props: {
  base: React.ReactNode;
  stand: React.ReactNode;
  frame: React.ReactNode;
  things: React.ReactNode;
  tower: React.ReactNode;
}) {
  const { anchor, say } = useReadout<HTMLDivElement>();
  const visible = useInView(anchor);

  const glass = React.useRef<SVGPathElement>(null);
  const chrome = React.useRef<SVGGElement>(null);
  const panes = React.useRef<SVGGElement>(null);

  const state = React.useRef({ clock: 0, open: WINDOWS.map(() => 0), said: "" });

  const draw = React.useCallback(() => {
    const s = state.current;
    const booted = s.clock > BOOT;

    glass.current?.setAttribute("data-on", booted ? "" : "off");
    chrome.current?.setAttribute("opacity", booted ? "1" : "0");

    const g = panes.current;
    if (g) {
      s.open.forEach((open, i) => {
        const w = windowAt(i, open);
        const node = g.querySelector(`[data-win="${i}"]`);
        if (!node) return;
        node.setAttribute("opacity", open < 0.02 ? "0" : "1");
        node.querySelector("[data-p=body]")?.setAttribute("d", w.body);
        node.querySelector("[data-p=bar]")?.setAttribute("d", w.bar);
        const dot = node.querySelector("[data-p=light]");
        if (dot) {
          dot.setAttribute("cx", String(w.light[0]));
          dot.setAttribute("cy", String(w.light[1]));
        }
      });
    }

    const count = s.open.filter((v) => v > 0.5).length;
    const line = readoutOf(count, booted);
    if (line !== s.said) {
      s.said = line;
      say(line);
    }
  }, [say]);

  useLoop(
    (dt, calm) => {
      const s = state.current;
      s.clock += dt;
      // Each window's target turns on at its own moment, and the window
      // grows into it rather than appearing.
      s.open = s.open.map((v, i) => {
        const due = BOOT + 0.35 + i * STEP;
        return follow(v, s.clock > due ? 1 : 0, dt, 0.16, calm);
      });
      draw();
      // Hold once the last one has settled; a desktop at rest is at rest.
      return s.clock < BOOT + 0.35 + WINDOWS.length * STEP + 1.4;
    },
    visible,
  );

  const replay = () => {
    const s = state.current;
    s.clock = 0;
    s.open = WINDOWS.map(() => 0);
  };

  return (
    <div
      ref={anchor}
      className="desk"
      tabIndex={0}
      role="button"
      aria-label={`Replay the boot: ${WINDOWS.length} windows open on the desktop`}
      onPointerEnter={replay}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          replay();
        }
      }}
    >
      <IsoFigure width={WIDTH} height={HEIGHT} label={LABEL}>
        {props.base}
        {props.tower}
        {props.stand}
        {props.frame}

        {/* The screen, in its own plane. Dark until it has booted. */}
        <path ref={glass} className="desk-glass" data-on="off" d={ART.bezel} />

        <g ref={chrome} opacity="0">
          <path className="desk-bar" d={MENU} />
          {MENU_ITEMS.map((d, i) => (
            <path key={i} className="desk-menu-item" d={d} />
          ))}
          <path className="desk-dock" d={DOCK.tray} />
          {DOCK.slots.map(([x, y], i) => (
            <circle key={i} className="desk-slot" cx={x} cy={y} r={2.4} />
          ))}
        </g>

        <g ref={panes}>
          {WINDOWS.map((name, i) => {
            const w = windowAt(i, 0);
            return (
              <g key={name} data-win={i} opacity="0">
                <path className="desk-win" data-p="body" d={w.body} />
                <path className="desk-win-bar" data-p="bar" d={w.bar} />
                <circle className="desk-win-light" data-p="light" cx={w.light[0]} cy={w.light[1]} r={1.3} />
              </g>
            );
          })}
        </g>

        <Line d={ART.bezel} tone="lo" />
        {props.things}
      </IsoFigure>
    </div>
  );
}
