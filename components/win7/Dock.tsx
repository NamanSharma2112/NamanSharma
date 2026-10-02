"use client";

import { useRef, useState } from "react";
import { APPS, getApp } from "./registry";
import type { WindowInstance } from "./types";

/**
 * The dock.
 *
 * Every app sits in it whether or not it is running, and the ones that are
 * carry a dot underneath — which is the difference between a dock and a
 * taskbar, where a button only exists while its window does.
 *
 * The lift is distance-based rather than per-icon hover: an icon grows, and so
 * do its neighbours by less, which is why the row reads as a sheet being pushed
 * up from underneath instead of one tile popping.
 */

/** How far along the row an icon still feels the cursor, in icon widths. */
const REACH = 2.2;
/** How much the icon under the cursor grows. */
const LIFT = 0.55;

export default function Dock({
  windows,
  activeId,
  onSelect,
  onLaunch,
}: {
  windows: WindowInstance[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onLaunch: (appId: string) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const row = useRef<HTMLDivElement>(null);

  return (
    <div className="mac-dock-wrap absolute inset-x-0 bottom-0 z-[110] flex justify-center pb-2">
      <div
        ref={row}
        className="mac-dock"
        onPointerLeave={() => setHover(null)}
      >
        {APPS.map((app, i) => {
          const open = windows.filter((w) => w.appId === app.id);
          const Icon = app.icon;
          const d = hover === null ? REACH : Math.abs(i - hover);
          const scale = d >= REACH ? 1 : 1 + LIFT * (1 - d / REACH) ** 2;

          return (
            <button
              key={app.id}
              type="button"
              aria-label={app.title}
              className="mac-dock-item"
              onPointerEnter={() => setHover(i)}
              onClick={() => {
                // Already running: bring it forward rather than opening a
                // second copy. That is what clicking a dock icon does.
                const live = open.find((w) => w.id !== activeId) ?? open[0];
                if (live) onSelect(live.id);
                else onLaunch(app.id);
              }}
              style={{
                transform: `scale(${scale})`,
                // Grows upward out of the dock floor, not from its middle.
                transformOrigin: "bottom center",
              }}
            >
              <span className="mac-dock-icon">
                <Icon size={34} />
              </span>
              <span className="mac-dock-tip">{app.title}</span>
              <span
                className={`mac-dock-dot ${open.length ? "is-on" : ""}`}
                aria-hidden
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** The front window's app, for the menu bar to name. */
export function frontAppTitle(
  windows: WindowInstance[],
  activeId: string | null,
) {
  const win = windows.find((w) => w.id === activeId && !w.minimized);
  return win ? getApp(win.appId).title : "Finder";
}
