"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { APPS, type AppDef } from "./registry";
import type { AppId } from "./types";

/**
 * The Start menu: programs on the left, places on the right, search at the
 * bottom. Typing filters the list, and Enter opens whatever is on top — which
 * is how the real one is mostly used.
 */

const PLACES = [
  "Naman",
  "Documents",
  "Pictures",
  "Games",
  "Computer",
  "Control Panel",
  "Devices and Printers",
  "Help and Support",
];

export default function StartMenu({
  onOpen,
  onClose,
  onShutDown,
}: {
  onOpen: (id: AppId) => void;
  onClose: () => void;
  onShutDown: () => void;
}) {
  const [query, setQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Clicking anywhere else, or Escape, dismisses it.
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (menuRef.current?.contains(target)) return;
      if (target.closest("[data-start-orb]")) return;
      onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return APPS.filter(
      (a) => a.title.toLowerCase().includes(q) || a.group.toLowerCase().includes(q)
    );
  }, [query]);

  const groups = useMemo(() => {
    const order: AppDef["group"][] = ["Games", "Accessories", "System"];
    return order.map((group) => ({
      group,
      apps: APPS.filter((a) => a.group === group),
    }));
  }, []);

  const launch = (id: AppId) => {
    onOpen(id);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="w7-startmenu absolute bottom-[42px] left-1.5 z-[120] flex w-[420px] overflow-hidden"
      role="menu"
      aria-label="Start menu"
    >
      {/* Programs */}
      <div className="w7-startmenu-left flex w-[248px] flex-col p-1.5">
        <div className="min-h-0 flex-1 overflow-auto">
          {results ? (
            results.length === 0 ? (
              <p className="px-2 py-3 text-[11px] text-[#5a6b7a]">No programs match.</p>
            ) : (
              results.map((app) => <MenuApp key={app.id} app={app} onOpen={launch} />)
            )
          ) : (
            groups.map(({ group, apps }) => (
              <div key={group} className="mb-1">
                <p className="px-2 py-1 text-[10.5px] font-semibold uppercase tracking-wide text-[#7d8fa1]">
                  {group}
                </p>
                {apps.map((app) => (
                  <MenuApp key={app.id} app={app} onOpen={launch} />
                ))}
              </div>
            ))
          )}
        </div>

        <div className="mt-1.5 border-t border-[#c9d8e6] pt-1.5">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && results?.length) launch(results[0].id);
            }}
            placeholder="Search programs and files"
            aria-label="Search programs and files"
            className="w7-sunken w-full rounded-[2px] px-2 py-1.5 text-[11.5px] text-[#16202b] outline-none"
          />
        </div>
      </div>

      {/* Places */}
      <div className="flex w-[172px] flex-col p-2">
        <div className="mb-2 flex flex-col items-center gap-1.5 pb-2">
          <span
            className="grid size-[46px] place-items-center rounded-[4px] text-[16px] font-semibold text-white/90"
            style={{
              background: "linear-gradient(to bottom, rgba(255,255,255,0.34), rgba(255,255,255,0.08))",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.5)",
            }}
          >
            NS
          </span>
          <span className="text-[11.5px] text-white/90">Naman</span>
        </div>

        <div className="flex-1">
          {PLACES.map((place) => (
            <button
              key={place}
              type="button"
              onClick={() => {
                if (place === "Computer") return launch("computer");
                if (place === "Games") return launch("minesweeper");
                onClose();
              }}
              className="w7-menu-item-dark block w-full rounded-[2px] px-2 py-[5px] text-left text-[11.5px] text-white/85"
            >
              {place}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onShutDown}
          className="w7-btn mt-2 w-full px-3 py-1.5 text-[11.5px] text-[#16202b]"
        >
          Shut down
        </button>
      </div>
    </div>
  );
}

function MenuApp({ app, onOpen }: { app: AppDef; onOpen: (id: AppId) => void }) {
  const Icon = app.icon;
  return (
    <button
      type="button"
      onClick={() => onOpen(app.id)}
      className="w7-menu-item flex w-full items-center gap-2 rounded-[2px] px-2 py-[5px] text-left text-[11.5px] text-[#16202b]"
    >
      <Icon size={18} />
      <span className="truncate">{app.title}</span>
    </button>
  );
}
