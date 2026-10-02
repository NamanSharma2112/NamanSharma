"use client";

import { useEffect, useState } from "react";

/**
 * The bar across the top: the apple, whose menus belong to the front app, and
 * the status items on the right.
 *
 * The menu titles change with whatever has focus, which is the one thing that
 * most says "this is a Mac" — on Windows the menus live inside the window, and
 * getting that wrong is the tell.
 *
 * The clock starts only once mounted. A time rendered on the server hydrates
 * against a different second and warns.
 */
export default function MenuBar({ appTitle }: { appTitle: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="mac-menubar absolute inset-x-0 top-0 z-[120] flex h-[26px] items-center gap-0 px-3 text-[13px]">
      <span className="mac-menu-apple" aria-hidden>
        <AppleMark />
      </span>

      <span className="mac-menu-item is-app">{appTitle}</span>
      {["File", "Edit", "View", "Window", "Help"].map((m) => (
        <span key={m} className="mac-menu-item">
          {m}
        </span>
      ))}

      <span className="ml-auto flex items-center gap-3.5">
        <Battery />
        <Wifi />
        <Control />
        <span className="mac-menu-clock tabular-nums">
          {now
            ? now.toLocaleString(undefined, {
                weekday: "short",
                hour: "numeric",
                minute: "2-digit",
              })
            : ""}
        </span>
      </span>
    </div>
  );
}

function AppleMark() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
      <path
        fill="currentColor"
        d="M11.03 8.47c-.02-1.72 1.4-2.54 1.47-2.58-.8-1.17-2.05-1.33-2.5-1.35-1.06-.11-2.07.62-2.61.62-.54 0-1.37-.6-2.25-.59-1.16.02-2.23.67-2.82 1.71-1.2 2.09-.31 5.18.86 6.87.58.83 1.26 1.75 2.16 1.72.87-.04 1.2-.56 2.25-.56s1.35.56 2.27.54c.94-.02 1.53-.84 2.1-1.67.66-.96.93-1.88.95-1.93-.02-.01-1.82-.7-1.84-2.78ZM9.33 3.42c.48-.58.8-1.38.71-2.18-.69.03-1.52.46-2.01 1.03-.44.51-.82 1.33-.72 2.11.77.06 1.55-.39 2.02-.96Z"
      />
    </svg>
  );
}

function Battery() {
  return (
    <svg viewBox="0 0 28 14" width="25" height="13" aria-hidden>
      <rect x="0.6" y="1.6" width="22" height="10.8" rx="3.2" fill="none" stroke="currentColor" strokeWidth="1.1" opacity=".5" />
      <rect x="2.2" y="3.2" width="16" height="7.6" rx="1.9" fill="currentColor" />
      <path d="M24.3 5.2v3.6a2.4 2.4 0 0 0 0-3.6Z" fill="currentColor" opacity=".5" />
    </svg>
  );
}

function Wifi() {
  return (
    <svg viewBox="0 0 20 15" width="16" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
      <path d="M1.6 4.9a12.4 12.4 0 0 1 16.8 0" />
      <path d="M4.7 8.1a8 8 0 0 1 10.6 0" />
      <path d="M7.8 11.3a3.6 3.6 0 0 1 4.4 0" />
    </svg>
  );
}

function Control() {
  return (
    <svg viewBox="0 0 18 18" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
      <path d="M2.5 5.5h13M2.5 12.5h13" />
      <circle cx="6.5" cy="5.5" r="1.9" fill="currentColor" stroke="none" />
      <circle cx="11.5" cy="12.5" r="1.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
