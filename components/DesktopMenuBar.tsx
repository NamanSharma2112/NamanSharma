"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import WeatherWidget from "./WeatherWidget";

/**
 * The menu bar across the top of the desktop.
 *
 * Every title opens a real menu. Once one is open, sliding across the others
 * switches between them without a second click, the way macOS behaves; Escape
 * or a click anywhere else closes.
 */

const EMAIL = "namansharmans03@gmail.com";
const GITHUB = "https://github.com/NamanSharma2112";

type MenuItem =
  | { kind: "separator" }
  | {
      kind?: "item";
      label: string;
      shortcut?: string;
      checked?: boolean;
      run: () => void;
    };

type Menu = { id: string; label: string; bold?: boolean; items: MenuItem[] };

export function DesktopMenuBar({
  windows = {},
  onToggleWindow,
  onOpenWindow,
  onCloseAll,
}: {
  /** Open/closed state per window id, used for the checkmarks. */
  windows?: Record<string, boolean>;
  onToggleWindow?: (id: string) => void;
  onOpenWindow?: (id: string) => void;
  onCloseAll?: () => void;
}) {
  const [timeString, setTimeString] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format: "Tue Aug 11  2:41 PM"
      const day = now.toLocaleDateString("en-US", { weekday: "short" });
      const date = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
      setTimeString(`${day}, ${date}  ${time}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close on Escape or on a click outside the bar.
  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    const onDown = (e: PointerEvent) => {
      if (!barRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [openMenu]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  /* ── actions ──────────────────────────────────────────────────────────── */

  const say = (message: string) => {
    setFlash(message);
    window.setTimeout(() => setFlash(null), 1800);
  };

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      say(`${label} copied`);
    } catch {
      say("Copy failed");
    }
  };

  const openWindow = (id: string) => onOpenWindow?.(id);

  const openSearch = () =>
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true })
    );

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else document.documentElement.requestFullscreen().catch(() => say("Fullscreen blocked"));
  };

  const visit = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

  const WINDOWS: { id: string; label: string }[] = [
    { id: "about", label: "About Me" },
    { id: "blog", label: "Writing" },
    { id: "inspiration", label: "Inspiration" },
    { id: "tweets", label: "Feedback" },
    { id: "contact", label: "Contact" },
  ];

  const MENUS: Menu[] = [
    {
      id: "brand",
      label: "NS",
      bold: true,
      items: [
        { label: "About This Site", run: () => openWindow("about") },
        { kind: "separator" },
        { label: "View Source on GitHub", run: () => visit(GITHUB) },
        { label: "Send Feedback", run: () => openWindow("tweets") },
      ],
    },
    {
      id: "name",
      label: "Naman Sharma",
      bold: true,
      items: [
        { label: "About Me", run: () => openWindow("about") },
        { label: "Get in Touch", run: () => openWindow("contact") },
        { kind: "separator" },
        { label: "Hide All Windows", shortcut: "⌘H", run: () => onCloseAll?.() },
      ],
    },
    {
      id: "file",
      label: "File",
      items: [
        { label: "New Email…", shortcut: "⌘N", run: () => { window.location.assign(`mailto:${EMAIL}`); } },
        { label: "Open Writing", run: () => openWindow("blog") },
        { kind: "separator" },
        { label: "Close All Windows", shortcut: "⌘W", run: () => onCloseAll?.() },
      ],
    },
    {
      id: "edit",
      label: "Edit",
      items: [
        { label: "Copy Email Address", run: () => copy(EMAIL, "Email") },
        { label: "Copy Link to This Page", run: () => copy(window.location.href, "Link") },
        { kind: "separator" },
        { label: "Find…", shortcut: "⌘K", run: openSearch },
      ],
    },
    {
      id: "view",
      label: "View",
      items: [
        {
          label: isFullscreen ? "Exit Full Screen" : "Enter Full Screen",
          shortcut: "⌃⌘F",
          run: toggleFullscreen,
        },
        { kind: "separator" },
        { label: "Show All Windows", run: () => WINDOWS.forEach((w) => openWindow(w.id)) },
        { label: "Hide All Windows", run: () => onCloseAll?.() },
      ],
    },
    {
      id: "go",
      label: "Go",
      items: [
        ...WINDOWS.map((w) => ({ label: w.label, run: () => openWindow(w.id) })),
        { kind: "separator" as const },
        { label: "Blog Archive", run: () => { window.location.assign("/blog"); } },
      ],
    },
    {
      id: "window",
      label: "Window",
      items: [
        ...WINDOWS.map((w) => ({
          label: w.label,
          checked: Boolean(windows[w.id]),
          run: () => onToggleWindow?.(w.id),
        })),
        { kind: "separator" as const },
        { label: "Close All", run: () => onCloseAll?.() },
      ],
    },
    {
      id: "help",
      label: "Help",
      items: [
        { label: "Search the Site", shortcut: "⌘K", run: openSearch },
        { kind: "separator" },
        { label: "Email Me", run: () => { window.location.assign(`mailto:${EMAIL}`); } },
        { label: "GitHub", run: () => visit(GITHUB) },
      ],
    },
  ];

  const run = (item: MenuItem) => {
    if ("run" in item) item.run();
    setOpenMenu(null);
  };

  const title = (menu: Menu): ReactNode => (
    <div key={menu.id} className="relative h-full">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={openMenu === menu.id}
        onClick={() => setOpenMenu((cur) => (cur === menu.id ? null : menu.id))}
        // Once a menu is open, sliding sideways moves between them.
        onPointerEnter={() => setOpenMenu((cur) => (cur ? menu.id : cur))}
        className={`flex h-full items-center px-3 transition-colors cursor-pointer ${
          menu.bold ? "font-bold" : ""
        } ${openMenu === menu.id ? "bg-white/25" : "hover:bg-white/20"}`}
      >
        {menu.label}
      </button>

      {openMenu === menu.id && (
        <div
          role="menu"
          className="absolute left-0 top-full mt-px min-w-[220px] overflow-hidden rounded-lg border border-white/15 bg-zinc-900/85 py-1 text-[13px] text-white shadow-[0_20px_45px_-12px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
        >
          {menu.items.map((item, n) =>
            "kind" in item && item.kind === "separator" ? (
              <div key={n} className="my-1 h-px bg-white/12" />
            ) : (
              <button
                key={n}
                role="menuitem"
                type="button"
                onClick={() => run(item)}
                className="flex w-full items-center gap-3 px-3 py-1.5 text-left transition-colors hover:bg-white/15"
              >
                <span className="w-3 shrink-0 text-[11px]">
                  {"checked" in item && item.checked ? "✓" : ""}
                </span>
                <span className="flex-1 whitespace-nowrap">
                  {"label" in item ? item.label : null}
                </span>
                {"shortcut" in item && item.shortcut ? (
                  <span className="shrink-0 text-white/40">{item.shortcut}</span>
                ) : null}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 h-[28px] z-[60] flex items-center justify-between px-3 text-[13px] font-medium text-white/90 bg-black/20 backdrop-blur-xl border-b border-white/10 select-none"
    >
      <div className="flex items-center h-full">
        {title(MENUS[0])}
        <div className="hidden sm:flex items-center h-full">
          {MENUS.slice(1).map((menu) => title(menu))}
        </div>
      </div>

      <div className="flex items-center h-full">
        {/* Confirmation for actions with no visible result of their own. */}
        {flash && (
          <span className="mr-3 rounded bg-white/15 px-2 py-0.5 text-[11px]">
            {flash}
          </span>
        )}

        {/* Control center icons */}
        <div className="flex items-center gap-4 px-3 h-full opacity-80">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        </div>

        <div className="relative h-full group flex items-center">
          <div className="hover:bg-white/20 px-3 h-full flex items-center cursor-pointer transition-colors whitespace-pre tabular-nums tracking-tight">
            {timeString || "..."}
          </div>

          <div className="absolute top-full right-2 pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-50">
            <WeatherWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
