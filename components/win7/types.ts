import type { ReactNode } from "react";

export type AppId =
  | "minesweeper"
  | "solitaire"
  | "snake"
  | "notepad"
  | "calculator"
  | "paint"
  | "computer";

/** Where a window lands when dragged into an edge. */
export type SnapZone = "left" | "right" | "top" | null;

export type Geometry = { x: number; y: number; w: number; h: number };

export type WindowInstance = Geometry & {
  id: string;
  appId: AppId;
  title: string;
  icon: ReactNode;
  z: number;
  minimized: boolean;
  maximized: boolean;
  /** Set while a window is snapped to a side, so dragging it off restores it. */
  snapped: "left" | "right" | null;
  /** The size to come back to after snapping or maximising. */
  restore: Geometry | null;
};

/** Nothing may be resized smaller than this and stay usable. */
export const MIN_W = 220;
export const MIN_H = 150;
