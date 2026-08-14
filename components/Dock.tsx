"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { SiGithub, SiX } from "@icons-pack/react-simple-icons";
import { playTap } from "@/lib/sounds";
import { useDesktop } from "@/components/DesktopState";
import { cn } from "@/lib/utils";

/**
 * The dock.
 *
 * Tiles swell as the pointer approaches, the way the macOS dock does: each
 * tile watches the pointer's x position and sizes itself by how far away it
 * is, so neighbours ease up alongside whichever one is hovered.
 */

/** Resting tile size, and how large the tile directly under the cursor grows. */
const BASE = 44;
const PEAK = 74;
/** How far either side of a tile the pointer starts lifting it. */
const REACH = 132;

/* ── glyphs ─────────────────────────────────────────────────────────────── */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const NotesGlyph = (
  <svg viewBox="0 0 24 24" className="size-[52%]" {...stroke}>
    <path d="M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
    <path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4" />
  </svg>
);

const SparkGlyph = (
  <svg viewBox="0 0 24 24" className="size-[54%]" {...stroke}>
    <path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z" />
    <path d="M18 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
  </svg>
);

const UserGlyph = (
  <svg viewBox="0 0 24 24" className="size-[54%]" {...stroke}>
    <circle cx="12" cy="8.5" r="3.8" />
    <path d="M19 20a7 7 0 0 0-14 0" />
  </svg>
);

const MailGlyph = (
  <svg viewBox="0 0 24 24" className="size-[52%]" {...stroke}>
    <rect x="3" y="5.5" width="18" height="13" rx="2.2" />
    <path d="m3.8 7 7.3 5.4a1.5 1.5 0 0 0 1.8 0L20.2 7" />
  </svg>
);

const SearchGlyph = (
  <svg viewBox="0 0 24 24" className="size-[52%]" {...stroke}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.9-3.9" />
  </svg>
);

const LinkedInGlyph = (
  <svg viewBox="0 0 24 24" className="size-[52%]" fill="currentColor">
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4v11H3zM10 9.5h3.8v1.5h.06a4.2 4.2 0 0 1 3.77-2c4.03 0 4.77 2.65 4.77 6.1v5.4h-4v-4.8c0-1.15-.02-2.62-1.6-2.62-1.6 0-1.85 1.25-1.85 2.54v4.88H10z" />
  </svg>
);

/* ── items ──────────────────────────────────────────────────────────────── */

type DockApp = {
  id: string;
  label: string;
  href: string;
  /** Internal routes get the running-app dot and client navigation. */
  internal: boolean;
  tile: string;
  glyph: ReactNode;
  /** Renders the avatar instead of a glyph. */
  avatar?: boolean;
};

const APPS: DockApp[] = [
  {
    id: "home",
    label: "Home",
    href: "/",
    internal: true,
    tile: "bg-gradient-to-b from-zinc-100 to-zinc-300",
    glyph: null,
    avatar: true,
  },
  {
    id: "blog",
    label: "Blog",
    href: "/blog",
    internal: true,
    tile: "bg-gradient-to-b from-[#ffe58a] to-[#f5b53d] text-amber-950",
    glyph: NotesGlyph,
  },
  {
    id: "inspiration",
    label: "Inspiration",
    href: "/inspiration",
    internal: true,
    tile: "bg-gradient-to-b from-[#ff9db3] to-[#e6486f] text-white",
    glyph: SparkGlyph,
  },
  {
    id: "about",
    label: "About",
    href: "/about",
    internal: true,
    tile: "bg-gradient-to-b from-[#7dd3fc] to-[#2563eb] text-white",
    glyph: UserGlyph,
  },
];

const LINKS: DockApp[] = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/NamanSharma2112",
    internal: false,
    tile: "bg-gradient-to-b from-zinc-700 to-zinc-900 text-white",
    glyph: <SiGithub className="size-[52%]" />,
  },
  {
    id: "x",
    label: "X",
    href: "https://x.com/namansharmans03",
    internal: false,
    tile: "bg-gradient-to-b from-zinc-800 to-black text-white",
    glyph: <SiX className="size-[48%]" />,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/namansharma2112/",
    internal: false,
    tile: "bg-gradient-to-b from-[#39a3e8] to-[#0a66c2] text-white",
    glyph: LinkedInGlyph,
  },
  {
    id: "mail",
    label: "Mail",
    href: "mailto:namansharmans03@gmail.com",
    internal: false,
    tile: "bg-gradient-to-b from-[#6fc3ff] to-[#1a72e8] text-white",
    glyph: MailGlyph,
  },
];

/* ── tile ───────────────────────────────────────────────────────────────── */

function DockTile({
  pointerX,
  label,
  tile,
  glyph,
  avatar,
  running,
  onClick,
}: {
  pointerX: MotionValue<number>;
  label: string;
  tile: string;
  glyph: ReactNode;
  avatar?: boolean;
  running?: boolean;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(pointerX, (x) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return REACH * 2;
    return x - bounds.x - bounds.width / 2;
  });

  const target = useTransform(distance, [-REACH, 0, REACH], [BASE, PEAK, BASE], {
    clamp: true,
  });
  const size = useSpring(target, { mass: 0.1, stiffness: 190, damping: 15 });

  return (
    <div className="group relative flex flex-col items-center justify-end">
      {/* macOS shows the name above the tile you are pointing at. */}
      <span className="pointer-events-none absolute bottom-full mb-3 hidden whitespace-nowrap rounded-md border border-white/15 bg-zinc-900/85 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg backdrop-blur-md transition-opacity duration-150 group-hover:opacity-100 sm:block">
        {label}
      </span>

      <motion.div
        ref={ref}
        style={{ width: size, height: size }}
        onClick={onClick}
        className={cn(
          "relative flex items-center justify-center overflow-hidden rounded-[24%] shadow-[0_6px_14px_-4px_rgba(0,0,0,0.55)] ring-1 ring-black/10",
          tile
        )}
      >
        {avatar ? (
          <Image
            src="/avatar.png"
            alt=""
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          glyph
        )}
        {/* The sheen macOS puts across the top of every icon. */}
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent" />
      </motion.div>

      <span
        className={cn(
          "mt-1 size-1 rounded-full bg-white/80 transition-opacity",
          running ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}

/* ── dock ───────────────────────────────────────────────────────────────── */

export default function Dock() {
  const pathname = usePathname();
  const pointerX = useMotionValue(Number.POSITIVE_INFINITY);
  const { open, restore } = useDesktop();

  // The home desktop ships its own dock, wired to its window manager. Two of
  // them on one screen would just be a bug.
  if (pathname === "/") return null;

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const openSearch = () => {
    playTap();
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true })
    );
  };

  const divider = (
    <span className="mb-3 h-9 w-px self-center bg-white/20" aria-hidden />
  );

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-3 z-[55] flex justify-center sm:bottom-5"
    >
      <div
        onPointerMove={(e) => pointerX.set(e.clientX)}
        onPointerLeave={() => pointerX.set(Number.POSITIVE_INFINITY)}
        className="flex origin-bottom scale-[0.72] items-end gap-2 rounded-2xl border border-white/20 bg-white/15 px-3 pt-2 pb-1.5 shadow-[0_18px_45px_-12px_rgba(0,0,0,0.75)] backdrop-blur-2xl backdrop-saturate-150 sm:scale-100 dark:bg-zinc-900/35"
      >
        {APPS.map((app) => {
          const current = isCurrent(app.href);
          return (
            <Link
              key={app.id}
              href={app.href}
              aria-label={app.label}
              aria-current={current ? "page" : undefined}
              onClick={(e) => {
                playTap();
                // Already here with the window put away? Bring it back rather
                // than navigate to the route we are on.
                if (current && !open) {
                  e.preventDefault();
                  restore();
                }
              }}
            >
              <DockTile
                pointerX={pointerX}
                label={app.label}
                tile={app.tile}
                glyph={app.glyph}
                avatar={app.avatar}
                running={current}
              />
            </Link>
          );
        })}

        {divider}

        {LINKS.map((app) => (
          <a
            key={app.id}
            href={app.href}
            aria-label={app.label}
            target={app.href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
            onClick={() => playTap()}
          >
            <DockTile
              pointerX={pointerX}
              label={app.label}
              tile={app.tile}
              glyph={app.glyph}
            />
          </a>
        ))}

        {divider}

        <button type="button" aria-label="Search" onClick={openSearch}>
          <DockTile
            pointerX={pointerX}
            label="Search  ⌘K"
            tile="bg-gradient-to-b from-zinc-200 to-zinc-400 text-zinc-800"
            glyph={SearchGlyph}
          />
        </button>
      </div>
    </nav>
  );
}
