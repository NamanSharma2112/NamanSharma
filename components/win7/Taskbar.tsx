"use client";

import { useEffect, useState } from "react";
import { getApp } from "./registry";
import type { WindowInstance } from "./types";

/**
 * The taskbar: the orb, a button per open window, and the clock.
 *
 * The clock only starts once mounted — rendering a time on the server would
 * hydrate against a different second and warn.
 */

export default function Taskbar({
  windows,
  activeId,
  startOpen,
  onToggleStart,
  onSelect,
  onShowDesktop,
}: {
  windows: WindowInstance[];
  activeId: string | null;
  startOpen: boolean;
  onToggleStart: () => void;
  onSelect: (id: string) => void;
  onShowDesktop: () => void;
}) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="w7-taskbar absolute inset-x-0 bottom-0 z-[110] flex h-[42px] items-center gap-1 px-1.5">
      <button
        type="button"
        data-start-orb
        onClick={onToggleStart}
        aria-label="Start"
        aria-expanded={startOpen}
        className={`w7-orb grid size-[36px] shrink-0 place-items-center rounded-full ${
          startOpen ? "is-open" : ""
        }`}
      >
        <WindowsFlag />
      </button>

      <span className="mx-1 h-[26px] w-px bg-white/15" />

      <div className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
        {windows.map((win) => {
          const app = getApp(win.appId);
          const Icon = app.icon;
          const isActive = win.id === activeId && !win.minimized;
          return (
            <button
              key={win.id}
              type="button"
              onClick={() => onSelect(win.id)}
              title={win.title}
              className={`w7-task-btn flex h-[32px] min-w-0 max-w-[168px] items-center gap-1.5 px-2 text-left text-[11px] text-white/90 ${
                isActive ? "is-active" : "is-open"
              }`}
            >
              <Icon size={17} />
              <span className="truncate">{app.title}</span>
            </button>
          );
        })}
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2.5 pl-2 text-white/85">
        <TrayGlyphs />
        <div className="pr-1 text-right leading-[1.15]">
          <p className="text-[11px] tabular-nums">
            {now
              ? now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
              : "--:--"}
          </p>
          <p className="text-[10.5px] tabular-nums text-white/70">
            {now ? now.toLocaleDateString() : ""}
          </p>
        </div>

        {/* The sliver at the very end that clears the screen. */}
        <button
          type="button"
          onClick={onShowDesktop}
          aria-label="Show desktop"
          title="Show desktop"
          className="h-[38px] w-[11px] shrink-0 rounded-[2px] transition-colors"
          style={{
            boxShadow: "inset 1px 0 0 rgba(255,255,255,0.35)",
            background: "rgba(255,255,255,0.06)",
          }}
        />
      </div>
    </div>
  );
}

function WindowsFlag() {
  return (
    <svg width="19" height="19" viewBox="0 0 20 20" aria-hidden>
      <g transform="rotate(-8 10 10)">
        <rect x="1.5" y="1.5" width="7.6" height="7.6" rx="1.2" fill="#f26d5f" />
        <rect x="10.9" y="1.5" width="7.6" height="7.6" rx="1.2" fill="#9ad86a" />
        <rect x="1.5" y="10.9" width="7.6" height="7.6" rx="1.2" fill="#63bff0" />
        <rect x="10.9" y="10.9" width="7.6" height="7.6" rx="1.2" fill="#ffd050" />
      </g>
    </svg>
  );
}

/** Network, volume, and the action-centre flag. */
function TrayGlyphs() {
  return (
    <span className="flex items-center gap-2 opacity-85">
      <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
        <path
          d="M1 6.2a10 10 0 0 1 14 0M3.4 9a6.6 6.6 0 0 1 9.2 0M6 11.7a2.9 2.9 0 0 1 4 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <circle cx="8" cy="14" r="1.1" fill="currentColor" />
      </svg>
      <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
        <path d="M3 6h2.6L9 3v10L5.6 10H3z" fill="currentColor" />
        <path
          d="M11 6.2a3 3 0 0 1 0 3.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
