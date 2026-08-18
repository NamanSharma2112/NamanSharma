import type { ReactNode } from "react";

export type AppId =
  | "minesweeper"
  | "solitaire"
  | "snake"
  | "notepad"
  | "calculator"
  | "paint"
  | "computer";

export type WindowInstance = {
  id: string;
  appId: AppId;
  title: string;
  icon: ReactNode;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
};
