"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The whole navigation, in one pill: a portrait, the name, whether work is
 * being taken on, and the shortcut that opens everything else.
 *
 * The links themselves live in the command menu — pressing the pill is the
 * same as pressing ⌘K.
 */

/** Drop an illustrated portrait at this path and it takes over. */
const PORTRAIT = "/avatar-illustration.png";
const PORTRAIT_FALLBACK = "/avatar2.png";

const STATUS = "Available for work";

export default function MinimalNav() {
  const pathname = usePathname();
  const [portrait, setPortrait] = useState(PORTRAIT);

  // The desktop is its own world and brings its own menu bar and dock.
  if (pathname.startsWith("/desktop")) return null;

  const openMenu = () =>
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true })
    );

  return (
    <nav
      aria-label="Main navigation"
      className="relative z-20 flex justify-center px-6 pt-5 sm:pt-7"
    >
      <button
        type="button"
        onClick={openMenu}
        aria-label="Open menu"
        className={cn(
          "group flex items-center gap-3 rounded-2xl border py-2 pl-2 pr-2.5 text-left transition-colors duration-200",
          "border-black/10 bg-white/70 shadow-lg backdrop-blur-xl hover:bg-white/85",
          "dark:border-white/10 dark:bg-[#1b1b1b]/85 dark:hover:bg-[#242424]/90"
        )}
      >
        <span className="relative size-10 shrink-0 overflow-hidden rounded-full ring-1 ring-black/10 dark:ring-white/10">
          <Image
            src={portrait}
            alt=""
            fill
            sizes="40px"
            className="object-cover"
            onError={() => setPortrait(PORTRAIT_FALLBACK)}
          />
        </span>

        {/* Name over status, both on the same left edge. */}
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="text-[14px] font-semibold text-zinc-900 dark:text-white">
            Naman Sharma
          </span>
          <span className="mt-0.5 flex items-center gap-1.5">
            <span className="relative flex size-1.5 shrink-0">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="truncate text-[13px] text-zinc-500 dark:text-zinc-400">
              {STATUS}
            </span>
          </span>
        </span>

        <span className="ml-3 shrink-0 rounded-md border border-black/10 bg-black/5 px-2 py-1 text-[11px] font-medium text-zinc-500 transition-colors group-hover:text-zinc-700 dark:border-white/10 dark:bg-white/10 dark:text-zinc-400 dark:group-hover:text-zinc-200">
          ⌘ K
        </span>
      </button>
    </nav>
  );
}
