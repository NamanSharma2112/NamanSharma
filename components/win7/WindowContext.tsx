"use client";

import { createContext, useContext } from "react";

/**
 * The one thing a program needs to say to the window holding it: how much room
 * it wants. Minesweeper switching from Beginner to Expert changes the size of
 * the board, and a window that stayed put would leave most of it behind a
 * scrollbar.
 *
 * The size asked for is the room for the program itself — the frame adds its
 * own title bar and keeps the result on screen.
 */

export const WindowSize = createContext<{
  requestSize: (width: number, height: number) => void;
}>({ requestSize: () => {} });

export const useWindowSize = () => useContext(WindowSize);
