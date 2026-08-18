"use client";

import { useCallback, useEffect, useRef } from "react";
import type { WindowInstance } from "./types";

/**
 * One Aero window: a glass title bar you can drag, three caption buttons, and
 * whatever the program draws underneath.
 *
 * Dragging is tracked on the pointer rather than through React state per move
 * — the frame is moved by writing a transform straight to the node, and the
 * new position is only committed once on release. Re-rendering the whole
 * window (and the program inside it) on every pointermove is what makes this
 * kind of desktop feel like sludge.
 */

const TITLEBAR_H = 30;

export default function WindowFrame({
  win,
  active,
  bounds,
  onFocus,
  onClose,
  onMinimise,
  onToggleMaximise,
  onMove,
  children,
}: {
  win: WindowInstance;
  active: boolean;
  /** The area windows may sit in — the desktop, minus the taskbar. */
  bounds: { width: number; height: number };
  onFocus: () => void;
  onClose: () => void;
  onMinimise: () => void;
  onToggleMaximise: () => void;
  onMove: (x: number, y: number) => void;
  children: React.ReactNode;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ dx: number; dy: number; x: number; y: number } | null>(null);

  const startDrag = useCallback(
    (e: React.PointerEvent) => {
      if (win.maximized) return;
      // Only the bar itself, never a caption button.
      if ((e.target as HTMLElement).closest("[data-caption]")) return;
      e.preventDefault();
      onFocus();
      drag.current = {
        dx: e.clientX - win.x,
        dy: e.clientY - win.y,
        x: win.x,
        y: win.y,
      };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [onFocus, win.maximized, win.x, win.y]
  );

  const onDrag = useCallback(
    (e: React.PointerEvent) => {
      const state = drag.current;
      const frame = frameRef.current;
      if (!state || !frame) return;

      // Kept on screen: never above the desktop, and never dragged so far off
      // that the title bar can't be grabbed back.
      const x = Math.min(
        Math.max(e.clientX - state.dx, -win.w + 90),
        bounds.width - 90
      );
      const y = Math.min(Math.max(e.clientY - state.dy, 0), bounds.height - TITLEBAR_H);

      state.x = x;
      state.y = y;
      frame.style.transform = `translate(${x - win.x}px, ${y - win.y}px)`;
    },
    [bounds.height, bounds.width, win.w, win.x, win.y]
  );

  const endDrag = useCallback(
    (e: React.PointerEvent) => {
      const state = drag.current;
      const frame = frameRef.current;
      drag.current = null;
      if (!state || !frame) return;
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
      frame.style.transform = "";
      onMove(state.x, state.y);
    },
    [onMove]
  );

  // A maximised window follows the desktop when it changes size.
  const geometry = win.maximized
    ? { left: 0, top: 0, width: bounds.width, height: bounds.height }
    : { left: win.x, top: win.y, width: win.w, height: win.h };

  useEffect(() => {
    if (win.minimized) drag.current = null;
  }, [win.minimized]);

  if (win.minimized) return null;

  return (
    <div
      ref={frameRef}
      role="dialog"
      aria-label={win.title}
      onPointerDown={onFocus}
      className={`w7-window absolute flex flex-col overflow-hidden ${
        active ? "" : "is-inactive"
      }`}
      style={{ ...geometry, zIndex: win.z }}
    >
      <div
        onPointerDown={startDrag}
        onPointerMove={onDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={onToggleMaximise}
        className="w7-titlebar flex shrink-0 items-center gap-2 px-2"
        style={{ cursor: win.maximized ? "default" : "move" }}
      >
        <span className="grid size-4 shrink-0 place-items-center">{win.icon}</span>
        <span
          className={`truncate text-[12px] ${
            active ? "text-[#0b2136]" : "text-[#41525f]"
          }`}
        >
          {win.title}
        </span>

        <span className="ml-auto flex shrink-0 items-center gap-[2px]">
          <button
            type="button"
            data-caption
            onClick={onMinimise}
            aria-label="Minimise"
            className="w7-caption-btn"
          >
            <span className="mt-[6px] block h-[2px] w-[9px] bg-[#0b2136]" />
          </button>
          <button
            type="button"
            data-caption
            onClick={onToggleMaximise}
            aria-label={win.maximized ? "Restore" : "Maximise"}
            className="w7-caption-btn"
          >
            <span className="block size-[9px] border-[1.5px] border-t-[3px] border-[#0b2136]" />
          </button>
          <button
            type="button"
            data-caption
            onClick={onClose}
            aria-label="Close"
            className="w7-caption-btn is-close"
          >
            <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden>
              <path
                d="M1 1l9 9M10 1l-9 9"
                stroke="#fff"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden bg-[#f0f4f8]">{children}</div>
    </div>
  );
}
