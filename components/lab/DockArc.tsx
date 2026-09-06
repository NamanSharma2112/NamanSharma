"use client";

import { useState } from "react";
import { arc, motion } from "motion/react";
import { Compass, Folder, Mail, Music, X } from "lucide-react";

/**
 * Minimise to the dock, along a curve.
 *
 * The window and the little dock tile are the same element to Motion — they
 * share a `layoutId` — so closing one and opening the other is a single
 * continuous move rather than two animations. `arc()` is what stops that move
 * being a straight diagonal: the card swings down into the dock the way the
 * real thing does.
 *
 * The image is local, so this does not depend on anything off the site.
 */

const SHOT = "/banner.jpg";

const DOCK = [
  { label: "Safari", Icon: Compass, from: "#93c5fd", to: "#1d4ed8" },
  { label: "Files", Icon: Folder, from: "#fde68a", to: "#d97706" },
  { label: "Mail", Icon: Mail, from: "#bae6fd", to: "#0284c7" },
  { label: "Music", Icon: Music, from: "#fda4af", to: "#be123c" },
];

const SWING = arc({ strength: 0.8 });

export default function DockArc() {
  const [minimised, setMinimised] = useState(false);

  return (
    <div className="lab-stage relative flex h-[300px] w-full flex-col items-center justify-end overflow-hidden rounded-xl p-4">
      {!minimised && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <motion.div
            layoutId="dock-window"
            drag
            dragMomentum={false}
            transition={{ path: SWING }}
            className="pointer-events-auto z-20 flex w-64 cursor-grab flex-col overflow-hidden rounded-xl bg-white p-1 shadow-lg ring-1 ring-black/10 active:cursor-grabbing dark:bg-zinc-900 dark:ring-white/10"
          >
            <div className="flex items-center justify-between gap-2 px-1.5 py-1">
              <span className="truncate font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                window.jpg
              </span>
              <button
                type="button"
                aria-label="Minimise to dock"
                onClick={() => setMinimised(true)}
                className="grid size-6 place-items-center rounded-md text-zinc-500 transition-colors hover:bg-black/5 hover:text-zinc-900 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <X className="size-3.5" />
              </button>
            </div>
            <img
              src={SHOT}
              alt=""
              draggable={false}
              className="aspect-video w-full rounded-lg object-cover"
            />
          </motion.div>
        </div>
      )}

      <div className="lab-dock relative z-10 flex items-center gap-2 rounded-2xl p-2">
        {DOCK.map(({ label, Icon, from, to }) => (
          <span
            key={label}
            aria-hidden
            className="grid size-10 place-items-center rounded-xl text-white"
            style={{ background: `radial-gradient(circle at 30% 25%, ${from}, ${to})` }}
          >
            <Icon className="size-5" strokeWidth={1.7} />
          </span>
        ))}

        {minimised && (
          <motion.button
            layoutId="dock-window"
            type="button"
            aria-label="Restore window"
            onClick={() => setMinimised(false)}
            transition={{ path: SWING }}
            whileHover={{ scale: 1.06 }}
            className="size-10 overflow-hidden rounded-xl bg-white ring-1 ring-black/10 dark:ring-white/10"
          >
            <img src={SHOT} alt="" draggable={false} className="size-full object-cover" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
