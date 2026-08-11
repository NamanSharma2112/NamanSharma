import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A macOS-style window that the page content sits inside, floating over the
 * wallpaper.
 */
export default function DesktopWindow({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  // The top inset clears the floating nav so it stops sitting on the title bar.
  return (
    <div className="relative z-10 mx-auto w-full max-w-[688px] px-3 pt-20 pb-4 sm:px-6 sm:pt-24 sm:pb-8">
      <div
        className={cn(
          "overflow-hidden rounded-xl border border-black/10 bg-[#f5f5f5] shadow-[0_40px_90px_-25px_rgba(0,0,0,0.75)]",
          "dark:border-white/10 dark:bg-[#111110]",
          className
        )}
        /**
         * Anchors the page's own fixed chrome — the top scrim, the theme
         * toggle — to this window rather than the viewport, so none of it
         * paints across the wallpaper.
         */
        style={{ transform: "translateZ(0)" }}
      >
        <div className="flex items-center gap-2 border-b border-black/5 px-4 py-3 dark:border-white/10">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
          {title ? (
            <span className="ml-2 text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
              {title}
            </span>
          ) : null}
        </div>

        {children}
      </div>
    </div>
  );
}
