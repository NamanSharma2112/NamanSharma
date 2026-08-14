"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useDesktop } from "@/components/DesktopState";
import { playTap } from "@/lib/sounds";

/**
 * A macOS-style window that the page content sits inside, floating over the
 * wallpaper. The traffic lights work: red puts the window away, yellow drops
 * it into the dock, green toggles full width. The dock icon brings it back.
 */

const LIGHTS = {
  close: "#ff5f57",
  minimize: "#febc2e",
  zoom: "#28c840",
};

/** The marks macOS fades in over the lights while you point at them. */
const glyph = {
  fill: "none",
  stroke: "rgba(0,0,0,0.55)",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
};

function TrafficLight({
  color,
  label,
  onClick,
  children,
}: {
  color: string;
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      style={{ backgroundColor: color }}
      className="flex size-3 items-center justify-center rounded-full ring-1 ring-black/15 transition-transform active:scale-90"
    >
      <svg
        viewBox="0 0 10 10"
        className="size-full opacity-0 transition-opacity duration-100 group-hover/lights:opacity-100"
      >
        {children}
      </svg>
    </button>
  );
}

export default function DesktopWindow({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const { open, maximized, exit, close, minimize, toggleMaximize } =
    useDesktop();

  const act = (fn: () => void) => () => {
    playTap();
    fn();
  };

  // The top inset clears nothing now that the nav moved to the dock, but the
  // bottom one keeps the last of the content clear of it.
  return (
    <div
      className={cn(
        "relative z-10 mx-auto w-full pt-8 pb-32 transition-[max-width,padding] duration-300 ease-out",
        maximized
          ? "max-w-none px-2 sm:px-3"
          : "max-w-[688px] px-3 sm:px-6 sm:pt-12"
      )}
    >
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            key="window"
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              exit === "minimized"
                ? {
                    opacity: 0,
                    scale: 0.2,
                    y: 460,
                    transition: { duration: 0.42, ease: [0.5, 0, 0.9, 0.4] },
                  }
                : { opacity: 0, scale: 0.95, transition: { duration: 0.18 } }
            }
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            /**
             * Anchors the page's own fixed chrome — the top scrim, the theme
             * toggle — to this window rather than the viewport, so none of it
             * paints across the wallpaper. `will-change` makes the window a
             * containing block even between animations, when the animated
             * transform resolves back to none.
             */
            style={{ willChange: "transform", transformOrigin: "bottom center" }}
            className={cn(
              "overflow-hidden rounded-xl border border-black/10 bg-[#f5f5f5] shadow-[0_40px_90px_-25px_rgba(0,0,0,0.75)]",
              "dark:border-white/10 dark:bg-[#111110]",
              className
            )}
          >
            <div className="flex items-center gap-2 border-b border-black/5 px-4 py-3 dark:border-white/10">
              <div className="group/lights flex items-center gap-2">
                <TrafficLight
                  color={LIGHTS.close}
                  label="Close"
                  onClick={act(close)}
                >
                  <path d="M3.4 3.4l3.2 3.2M6.6 3.4L3.4 6.6" {...glyph} />
                </TrafficLight>
                <TrafficLight
                  color={LIGHTS.minimize}
                  label="Minimise"
                  onClick={act(minimize)}
                >
                  <path d="M3 5h4" {...glyph} />
                </TrafficLight>
                <TrafficLight
                  color={LIGHTS.zoom}
                  label={maximized ? "Restore" : "Zoom"}
                  onClick={act(toggleMaximize)}
                >
                  {maximized ? (
                    <path d="M3.2 5h3.6M5 3.2v3.6" {...glyph} />
                  ) : (
                    <path d="M3.4 6.6V3.4h3.2M6.6 3.4v3.2H3.4" {...glyph} />
                  )}
                </TrafficLight>
              </div>

              {title ? (
                <span className="ml-2 text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
                  {title}
                </span>
              ) : null}
            </div>

            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
