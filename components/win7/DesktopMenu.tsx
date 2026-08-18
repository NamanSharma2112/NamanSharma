"use client";

import { useEffect, useRef } from "react";

/**
 * The right-click menu on the wallpaper. Short, like the real one, and closes
 * on the next click anywhere.
 */

export type DesktopMenuItem = {
  label: string;
  onSelect?: () => void;
  divided?: boolean;
};

export default function DesktopMenu({
  x,
  y,
  items,
  onClose,
}: {
  x: number;
  y: number;
  items: DesktopMenuItem[];
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dismiss = (e: Event) => {
      if (e.target instanceof Node && ref.current?.contains(e.target)) return;
      onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();

    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="menu"
      aria-label="Desktop"
      className="absolute z-[130] w-[176px] rounded-[3px] py-1"
      style={{
        left: x,
        top: y,
        background: "rgba(248,251,255,0.97)",
        boxShadow:
          "inset 0 0 0 1px rgba(255,255,255,0.9), 0 0 0 1px rgba(90,120,150,0.6), 0 12px 30px rgba(0,0,0,0.45)",
      }}
    >
      {items.map((item) => (
        <div key={item.label}>
          {item.divided && <div className="my-1 h-px bg-[#d5e0ea]" />}
          <button
            type="button"
            disabled={!item.onSelect}
            onClick={() => {
              item.onSelect?.();
              onClose();
            }}
            className="w7-menu-item block w-full px-3 py-[5px] text-left text-[11.5px] text-[#16202b] disabled:text-[#9aa8b5] disabled:hover:bg-transparent disabled:hover:shadow-none"
          >
            {item.label}
          </button>
        </div>
      ))}
    </div>
  );
}
