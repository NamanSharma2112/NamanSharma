"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Home,
  Briefcase,
  PenTool,
  Lightbulb,
  MonitorCog,
  Sun,
  Moon,
  Monitor,
  ArrowUpRight,
} from "lucide-react";
import { SiGithub, SiX } from "@icons-pack/react-simple-icons";
import { playTap } from "@/lib/sounds";
import { cn } from "@/lib/utils";

/**
 * The menu behind ⌘K, opened from the nav pill or the shortcut.
 *
 * It carries its own header — the same portrait, name and role as the pill —
 * so opening it reads as the pill unfolding rather than a separate window.
 */

const PORTRAIT = "/avatar-illustration.png";
const PORTRAIT_FALLBACK = "/avatar2.png";

/**
 * Every row is laid out the same way: an icon column of one fixed width, the
 * label, then the trailing slot. Shared here so the icons sit on one left edge
 * and the arrows on one right edge, whichever group they are in.
 */
const ROW = "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13.5px]";
const ROW_ICON = "size-[17px] shrink-0 text-zinc-500 dark:text-zinc-400";
const ROW_TRAIL = "size-[15px] shrink-0 text-zinc-400 dark:text-zinc-500";

const SECTIONS = [
  { label: "Home", href: "/", Icon: Home },
  { label: "Work", href: "/work", Icon: Briefcase },
  { label: "Writing", href: "/blog", Icon: PenTool },
  { label: "Inspiration", href: "/inspiration", Icon: Lightbulb },
  { label: "Desktop", href: "/desktop", Icon: MonitorCog },
];

function LinkedInMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4v11H3zM10 9.5h3.8v1.5h.06a4.2 4.2 0 0 1 3.77-2c4.03 0 4.77 2.65 4.77 6.1v5.4h-4v-4.8c0-1.15-.02-2.62-1.6-2.62-1.6 0-1.85 1.25-1.85 2.54v4.88H10z" />
    </svg>
  );
}

const LINKS = [
  { label: "GitHub", href: "https://github.com/NamanSharma2112", Icon: SiGithub },
  { label: "X", href: "https://x.com/NamanSharma2112", Icon: SiX },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/namansharma2112/",
    Icon: LinkedInMark,
  },
];

const THEMES = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [portrait, setPortrait] = useState(PORTRAIT);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
        playTap();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
    playTap();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      {/* Header — the pill, unfolded. */}
      <div className="flex items-center gap-3 px-3 py-3">
        <span className="relative size-9 shrink-0 overflow-hidden rounded-full ring-1 ring-black/10 dark:ring-white/10">
          <Image
            src={portrait}
            alt=""
            fill
            sizes="36px"
            className="object-cover"
            onError={() => setPortrait(PORTRAIT_FALLBACK)}
          />
        </span>
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="text-[13.5px] font-semibold text-zinc-900 dark:text-white">
            Naman Sharma
          </span>
          <span className="text-[12.5px] text-zinc-500 dark:text-zinc-400">
            Design Engineer
          </span>
        </div>
        <kbd className="ml-auto shrink-0 rounded-md border border-black/10 bg-black/5 px-1.5 py-1 font-sans text-[11px] font-medium leading-none text-zinc-500 dark:border-white/10 dark:bg-white/[0.07] dark:text-zinc-400">
          ⌘ K
        </kbd>
      </div>

      <CommandSeparator />

      <CommandList className="max-h-[min(560px,70vh)]">
        <CommandEmpty className="py-8 text-center text-[13px] text-zinc-500">
          Nothing matches that.
        </CommandEmpty>

        <CommandGroup heading="Sections" className="px-2 py-2">
          {SECTIONS.map(({ label, href, Icon }) => (
            <CommandItem
              key={href}
              value={label}
              onSelect={() => runCommand(() => router.push(href))}
              className={ROW}
            >
              <Icon className={ROW_ICON} />
              <span className="flex-1 truncate">{label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Elsewhere" className="px-2 py-2">
          {LINKS.map(({ label, href, Icon }) => (
            <CommandItem
              key={href}
              value={label}
              onSelect={() =>
                runCommand(() =>
                  window.open(href, "_blank", "noopener,noreferrer")
                )
              }
              className={ROW}
            >
              {/* The icon set ships its own <title>, which would otherwise be
                  read out — and searched — as a second copy of the label. */}
              <Icon title="" className={ROW_ICON} />
              <span className="flex-1 truncate">{label}</span>
              <ArrowUpRight className={ROW_TRAIL} />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>

      <CommandSeparator />

      {/* Segmented, so the choice is visible rather than hidden in a list. */}
      <div className="px-2 py-2">
        <p className="px-3 pb-1.5 pt-1 text-[12px] font-medium text-zinc-500 dark:text-zinc-400">
          Theme
        </p>
        <div className="flex items-center gap-1.5">
          {THEMES.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setTheme(value);
                playTap();
              }}
              className={cn(
                // Opening with ⌘K lands focus on the first button, so the ring
                // it gets has to be part of the design rather than the UA's.
                "flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-[13px] transition-colors",
                "outline-none focus-visible:ring-1 focus-visible:ring-black/25 dark:focus-visible:ring-white/25",
                theme === value
                  ? "border-black/15 bg-black/5 text-zinc-900 dark:border-white/20 dark:bg-white/[0.07] dark:text-white"
                  : "border-transparent text-zinc-500 hover:bg-black/5 dark:text-zinc-400 dark:hover:bg-white/5"
              )}
            >
              <Icon className="size-[15px] shrink-0" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </CommandDialog>
  );
}
