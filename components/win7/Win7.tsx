"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import BootSequence from "./BootSequence";
import StartMenu from "./StartMenu";
import Taskbar from "./Taskbar";
import WindowFrame from "./WindowFrame";
import { APPS, getApp } from "./registry";
import type { AppId, WindowInstance } from "./types";
import "./win7.css";

/**
 * The machine.
 *
 * Owns the boot state, the open windows and which one has focus. Windows are a
 * plain array ordered by a rising z-index — focusing one moves it to the top
 * rather than reshuffling the list, so a window never jumps position in the
 * taskbar just because you clicked it.
 */

const TASKBAR_H = 42;
/** Each new window steps down and right from the last, as they used to. */
const CASCADE = 26;

type Power = "booting" | "on" | "off";

export default function Win7() {
  const [power, setPower] = useState<Power>("booting");
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [selected, setSelected] = useState<AppId | null>(null);
  const [bounds, setBounds] = useState({ width: 1280, height: 720 });

  const topZ = useRef(10);
  const opened = useRef(0);

  // The desktop is everything above the taskbar.
  useEffect(() => {
    const measure = () =>
      setBounds({
        width: window.innerWidth,
        height: Math.max(240, window.innerHeight - TASKBAR_H),
      });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const focus = useCallback((id: string) => {
    topZ.current += 1;
    const z = topZ.current;
    setWindows((list) =>
      list.map((w) => (w.id === id ? { ...w, z, minimized: false } : w))
    );
    setActiveId(id);
  }, []);

  const open = useCallback(
    (appId: AppId) => {
      const app = getApp(appId);

      // Already running? Bring it forward rather than opening a second copy.
      const existing = windows.find((w) => w.appId === appId);
      if (existing) return focus(existing.id);

      const w = Math.min(app.width, Math.max(280, bounds.width - 40));
      const h = Math.min(app.height, Math.max(220, bounds.height - 40));
      const step = opened.current % 6;
      opened.current += 1;

      topZ.current += 1;
      const id = `${appId}-${Date.now()}`;
      setWindows((list) => [
        ...list,
        {
          id,
          appId,
          title: app.title,
          icon: <app.icon size={15} />,
          x: Math.max(8, Math.round((bounds.width - w) / 2) - 90 + step * CASCADE),
          y: Math.max(8, Math.round((bounds.height - h) / 2) - 40 + step * CASCADE),
          w,
          h,
          z: topZ.current,
          minimized: false,
          maximized: false,
        },
      ]);
      setActiveId(id);
    },
    [bounds.height, bounds.width, focus, windows]
  );

  const close = useCallback(
    (id: string) => {
      setWindows((list) => list.filter((w) => w.id !== id));
      setActiveId((current) => (current === id ? null : current));
    },
    []
  );

  const update = useCallback(
    (id: string, patch: Partial<WindowInstance>) =>
      setWindows((list) => list.map((w) => (w.id === id ? { ...w, ...patch } : w))),
    []
  );

  /** Taskbar click: focus it, or fold it away if it already has focus. */
  const selectFromTaskbar = useCallback(
    (id: string) => {
      const win = windows.find((w) => w.id === id);
      if (!win) return;
      if (!win.minimized && activeId === id) {
        update(id, { minimized: true });
        setActiveId(null);
        return;
      }
      focus(id);
    },
    [activeId, focus, update, windows]
  );

  const shutDown = useCallback(() => {
    setStartOpen(false);
    setWindows([]);
    setPower("off");
  }, []);

  if (power === "booting") {
    return (
      <div className="win7 fixed inset-0 z-[100] overflow-hidden bg-black">
        <div data-fixed-screen hidden />
        <BootSequence onDone={() => setPower("on")} />
      </div>
    );
  }

  if (power === "off") {
    return (
      <div className="win7 fixed inset-0 z-[100] grid place-items-center bg-black text-center">
        <div data-fixed-screen hidden />
        <div>
          <p className="text-[13px] text-white/55">It is now safe to turn off your computer.</p>
          <button
            type="button"
            onClick={() => setPower("booting")}
            className="w7-btn mt-4 px-4 py-1.5 text-[12px] text-[#16202b]"
          >
            Power on
          </button>
          <p className="mt-6 text-[11px] text-white/30">
            <Link href="/" className="underline underline-offset-2 hover:text-white/60">
              Back to the site
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="win7 fixed inset-0 z-[100] overflow-hidden"
      style={{
        // Aero's default wallpaper, near enough: a lit horizon over deep blue.
        background:
          "radial-gradient(ellipse 120% 80% at 50% 108%, #6fc2f0 0%, #2b7cc0 26%, #14487e 52%, #0a2846 78%, #061726 100%)",
      }}
    >
      <div data-fixed-screen hidden />

      {/* Desktop */}
      <div
        className="absolute inset-x-0 top-0"
        style={{ height: bounds.height }}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) setSelected(null);
        }}
      >
        <div className="grid w-[92px] grid-cols-1 gap-1 p-2">
          {APPS.filter((a) => a.onDesktop).map((app) => {
            const Icon = app.icon;
            return (
              <button
                key={app.id}
                type="button"
                onClick={() => setSelected(app.id)}
                onDoubleClick={() => open(app.id)}
                className={`w7-desktop-icon flex w-[84px] flex-col items-center gap-1 rounded-[3px] p-1.5 ${
                  selected === app.id ? "is-selected" : ""
                }`}
              >
                <span className="w7-icon-tile grid size-[42px] place-items-center rounded-[3px]">
                  <Icon size={36} />
                </span>
                <span className="w-full break-words text-center text-[11px] leading-[1.25] text-white">
                  {app.title.split(" — ")[0]}
                </span>
              </button>
            );
          })}
        </div>

        <p className="pointer-events-none absolute bottom-3 right-4 text-right text-[11px] leading-[1.5] text-white/45">
          Windows 7 · Portfolio Edition
          <br />
          Double-click an icon to open it
        </p>

        {windows.map((win) => (
          <WindowFrame
            key={win.id}
            win={win}
            active={win.id === activeId}
            bounds={bounds}
            onFocus={() => focus(win.id)}
            onClose={() => close(win.id)}
            onMinimise={() => {
              update(win.id, { minimized: true });
              setActiveId(null);
            }}
            onToggleMaximise={() => update(win.id, { maximized: !win.maximized })}
            onMove={(x, y) => update(win.id, { x, y })}
          >
            {getApp(win.appId).render()}
          </WindowFrame>
        ))}
      </div>

      {startOpen && (
        <StartMenu
          onOpen={open}
          onClose={() => setStartOpen(false)}
          onShutDown={shutDown}
        />
      )}

      <Taskbar
        windows={windows}
        activeId={activeId}
        startOpen={startOpen}
        onToggleStart={() => setStartOpen((v) => !v)}
        onSelect={selectFromTaskbar}
      />
    </div>
  );
}
