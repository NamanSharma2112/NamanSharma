"use client";

import { useCallback, useMemo, useRef } from "react";
import { WindowSize } from "./WindowContext";
import { MIN_H, MIN_W, type Geometry, type SnapZone, type WindowInstance } from "./types";

/**
 * One Aero window: a glass title bar you can drag, eight edges you can pull,
 * three caption buttons, and whatever the program draws underneath.
 *
 * Both dragging and resizing are tracked on the pointer rather than through
 * React state per move — the frame is moved and sized by writing straight to
 * the node, and the result is committed once on release. Re-rendering the
 * whole window (and the program inside it) on every pointermove is what makes
 * this kind of desktop feel like sludge.
 */

const TITLEBAR_H = 30;
/** How close to an edge a drag has to get before the window snaps to it. */
const SNAP_MARGIN = 12;

/** The eight grips, as [name, which edges it pulls]. */
const HANDLES = [
  ["n", "top-0 inset-x-2 h-1.5 cursor-ns-resize"],
  ["s", "bottom-0 inset-x-2 h-1.5 cursor-ns-resize"],
  ["w", "left-0 inset-y-2 w-1.5 cursor-ew-resize"],
  ["e", "right-0 inset-y-2 w-1.5 cursor-ew-resize"],
  ["nw", "left-0 top-0 size-3 cursor-nwse-resize"],
  ["ne", "right-0 top-0 size-3 cursor-nesw-resize"],
  ["sw", "left-0 bottom-0 size-3 cursor-nesw-resize"],
  ["se", "right-0 bottom-0 size-3 cursor-nwse-resize"],
] as const;

type Handle = (typeof HANDLES)[number][0];

export default function WindowFrame({
  win,
  active,
  bounds,
  onFocus,
  onClose,
  onMinimise,
  onToggleMaximise,
  onGeometry,
  onSnapPreview,
  onSnap,
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
  onGeometry: (geometry: Geometry) => void;
  onSnapPreview: (zone: SnapZone) => void;
  onSnap: (zone: SnapZone, geometry: Geometry) => void;
  children: React.ReactNode;
}) {
  const frameRef = useRef<HTMLDivElement>(null);

  const drag = useRef<{
    dx: number;
    dy: number;
    geometry: Geometry;
    zone: SnapZone;
  } | null>(null);

  const resize = useRef<{
    handle: Handle;
    startX: number;
    startY: number;
    from: Geometry;
    geometry: Geometry;
  } | null>(null);

  /* ── moving ───────────────────────────────────────────────────────────── */

  const startDrag = useCallback(
    (e: React.PointerEvent) => {
      if (win.maximized) return;
      if ((e.target as HTMLElement).closest("[data-caption]")) return;
      e.preventDefault();
      onFocus();

      // Pulling a snapped window off its edge gives it its old size back, kept
      // under the cursor so it does not leap away from the hand holding it.
      const geometry: Geometry =
        win.snapped && win.restore
          ? { ...win.restore, x: e.clientX - win.restore.w / 2, y: win.y }
          : { x: win.x, y: win.y, w: win.w, h: win.h };

      drag.current = {
        dx: e.clientX - geometry.x,
        dy: e.clientY - geometry.y,
        geometry,
        zone: null,
      };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [onFocus, win.h, win.maximized, win.restore, win.snapped, win.w, win.x, win.y]
  );

  const onDrag = useCallback(
    (e: React.PointerEvent) => {
      const state = drag.current;
      const frame = frameRef.current;
      if (!state || !frame) return;

      // Kept on screen: never above the desktop, and never dragged so far off
      // that the title bar can't be grabbed back.
      const x = Math.min(
        Math.max(e.clientX - state.dx, -state.geometry.w + 90),
        bounds.width - 90
      );
      const y = Math.min(Math.max(e.clientY - state.dy, 0), bounds.height - TITLEBAR_H);

      state.geometry = { ...state.geometry, x, y };

      const zone: SnapZone =
        e.clientY <= SNAP_MARGIN
          ? "top"
          : e.clientX <= SNAP_MARGIN
            ? "left"
            : e.clientX >= bounds.width - SNAP_MARGIN
              ? "right"
              : null;

      if (zone !== state.zone) {
        state.zone = zone;
        onSnapPreview(zone);
      }

      frame.style.left = `${x}px`;
      frame.style.top = `${y}px`;
      frame.style.width = `${state.geometry.w}px`;
      frame.style.height = `${state.geometry.h}px`;
    },
    [bounds.height, bounds.width, onSnapPreview]
  );

  const endDrag = useCallback(
    (e: React.PointerEvent) => {
      const state = drag.current;
      drag.current = null;
      if (!state) return;
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
      onSnapPreview(null);
      onSnap(state.zone, state.geometry);
    },
    [onSnap, onSnapPreview]
  );

  /* ── resizing ─────────────────────────────────────────────────────────── */

  const startResize = useCallback(
    (e: React.PointerEvent, handle: Handle) => {
      if (win.maximized) return;
      e.preventDefault();
      e.stopPropagation();
      onFocus();
      const from: Geometry = { x: win.x, y: win.y, w: win.w, h: win.h };
      resize.current = {
        handle,
        startX: e.clientX,
        startY: e.clientY,
        from,
        geometry: from,
      };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [onFocus, win.h, win.maximized, win.w, win.x, win.y]
  );

  const onResize = useCallback(
    (e: React.PointerEvent) => {
      const state = resize.current;
      const frame = frameRef.current;
      if (!state || !frame) return;

      const dx = e.clientX - state.startX;
      const dy = e.clientY - state.startY;
      const { from, handle } = state;
      let { x, y, w, h } = from;

      // Pulling a left or top edge moves the window as well as sizing it, and
      // both stop at the minimum rather than inverting.
      if (handle.includes("e")) w = Math.max(MIN_W, from.w + dx);
      if (handle.includes("s")) h = Math.max(MIN_H, from.h + dy);
      if (handle.includes("w")) {
        w = Math.max(MIN_W, from.w - dx);
        x = from.x + (from.w - w);
      }
      if (handle.includes("n")) {
        h = Math.max(MIN_H, from.h - dy);
        y = from.y + (from.h - h);
      }

      if (y < 0) {
        h += y;
        y = 0;
      }

      state.geometry = { x, y, w, h };
      frame.style.left = `${x}px`;
      frame.style.top = `${y}px`;
      frame.style.width = `${w}px`;
      frame.style.height = `${h}px`;
    },
    []
  );

  const endResize = useCallback(
    (e: React.PointerEvent) => {
      const state = resize.current;
      resize.current = null;
      if (!state) return;
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
      onGeometry(state.geometry);
    },
    [onGeometry]
  );

  /* ── frame ────────────────────────────────────────────────────────────── */

  // A program asking for room gets it, as far as the desktop allows, and the
  // window stays where it is unless growing would push it off the edge.
  const sizing = useMemo(
    () => ({
      requestSize: (width: number, height: number) => {
        const w = Math.max(MIN_W, Math.min(width, bounds.width - 16));
        const h = Math.max(MIN_H, Math.min(height + TITLEBAR_H, bounds.height - 16));
        onGeometry({
          x: Math.max(8, Math.min(win.x, bounds.width - w - 8)),
          y: Math.max(8, Math.min(win.y, bounds.height - h - 8)),
          w,
          h,
        });
      },
    }),
    [bounds.height, bounds.width, onGeometry, win.x, win.y]
  );

  const geometry = win.maximized
    ? { left: 0, top: 0, width: bounds.width, height: bounds.height }
    : { left: win.x, top: win.y, width: win.w, height: win.h };

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

      <div className="min-h-0 flex-1 overflow-hidden bg-[#f0f4f8]">
        <WindowSize.Provider value={sizing}>{children}</WindowSize.Provider>
      </div>

      {/* Grips last, so they sit above the program and stay grabbable. */}
      {!win.maximized &&
        HANDLES.map(([handle, className]) => (
          <span
            key={handle}
            onPointerDown={(e) => startResize(e, handle)}
            onPointerMove={onResize}
            onPointerUp={endResize}
            onPointerCancel={endResize}
            className={`absolute z-10 ${className}`}
          />
        ))}
    </div>
  );
}
