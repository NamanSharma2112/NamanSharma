"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Shared state for the desktop metaphor.
 *
 * The window and the dock live in different parts of the tree — the window is
 * rendered by a page, the dock by the layout — but the traffic lights and the
 * dock have to agree on whether the window is open, so the state sits above
 * both.
 */

/** Why the window went away, which decides how it animates out. */
export type WindowExit = "closed" | "minimized" | null;

type DesktopContextValue = {
  open: boolean;
  maximized: boolean;
  exit: WindowExit;
  close: () => void;
  minimize: () => void;
  toggleMaximize: () => void;
  restore: () => void;
};

const DesktopContext = createContext<DesktopContextValue | null>(null);

export function DesktopProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);
  const [maximized, setMaximized] = useState(false);
  const [exit, setExit] = useState<WindowExit>(null);

  const close = useCallback(() => {
    setExit("closed");
    setOpen(false);
  }, []);

  const minimize = useCallback(() => {
    setExit("minimized");
    setOpen(false);
  }, []);

  const toggleMaximize = useCallback(() => setMaximized((m) => !m), []);

  const restore = useCallback(() => {
    setExit(null);
    setOpen(true);
  }, []);

  const value = useMemo(
    () => ({ open, maximized, exit, close, minimize, toggleMaximize, restore }),
    [open, maximized, exit, close, minimize, toggleMaximize, restore]
  );

  return (
    <DesktopContext.Provider value={value}>{children}</DesktopContext.Provider>
  );
}

export function useDesktop() {
  const ctx = useContext(DesktopContext);
  if (!ctx) {
    throw new Error("useDesktop must be used inside a DesktopProvider");
  }
  return ctx;
}
