"use client";

import type { AppId } from "./types";
import {
  CalculatorIcon,
  ComputerIcon,
  MinesweeperIcon,
  NotepadIcon,
  PaintIcon,
  SnakeIcon,
  SolitaireIcon,
} from "./icons";
import Minesweeper from "./apps/Minesweeper";
import Solitaire from "./apps/Solitaire";
import Snake from "./apps/Snake";
import Computer from "./apps/Computer";
import { Calculator, Notepad, Paint } from "./apps/Accessories";

/**
 * Everything the machine can run: what it is called, what it looks like, how
 * big its window opens, and which group it lives in on the Start menu.
 */

export type AppDef = {
  id: AppId;
  title: string;
  group: "Games" | "Accessories" | "System";
  width: number;
  height: number;
  onDesktop?: boolean;
  icon: (props: { size?: number }) => React.ReactElement;
  render: () => React.ReactElement;
};

export const APPS: AppDef[] = [
  {
    id: "minesweeper",
    title: "Minesweeper",
    group: "Games",
    width: 260,
    height: 360,
    onDesktop: true,
    icon: MinesweeperIcon,
    render: () => <Minesweeper />,
  },
  {
    id: "solitaire",
    title: "Solitaire",
    group: "Games",
    width: 640,
    height: 540,
    onDesktop: true,
    icon: SolitaireIcon,
    render: () => <Solitaire />,
  },
  {
    id: "snake",
    title: "Snake",
    group: "Games",
    width: 400,
    height: 380,
    onDesktop: true,
    icon: SnakeIcon,
    render: () => <Snake />,
  },
  {
    id: "notepad",
    title: "readme.txt — Notepad",
    group: "Accessories",
    width: 480,
    height: 380,
    onDesktop: true,
    icon: NotepadIcon,
    render: () => <Notepad />,
  },
  {
    id: "paint",
    title: "untitled — Paint",
    group: "Accessories",
    width: 560,
    height: 420,
    icon: PaintIcon,
    render: () => <Paint />,
  },
  {
    id: "calculator",
    title: "Calculator",
    group: "Accessories",
    width: 252,
    height: 352,
    icon: CalculatorIcon,
    render: () => <Calculator />,
  },
  {
    id: "computer",
    title: "Computer",
    group: "System",
    width: 520,
    height: 460,
    onDesktop: true,
    icon: ComputerIcon,
    render: () => <Computer />,
  },
];

export const getApp = (id: AppId) => APPS.find((a) => a.id === id)!;
