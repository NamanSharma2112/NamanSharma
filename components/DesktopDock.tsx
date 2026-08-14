"use client";

import { motion } from "motion/react";
import { playTap } from "@/lib/sounds";

export type DockApp = {
  id: string;
  label: string;
  icon: React.ReactNode;
  isOpen: boolean;
};

export default function DesktopDock({
  apps,
  onToggle,
}: {
  apps: DockApp[];
  onToggle: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: 0.3,
      }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[52]"
    >
      {/* Dock Container */}
      <div className="relative flex items-end gap-2 sm:gap-3 rounded-[32px] px-3 sm:px-4 py-2.5 sm:py-3 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)] ring-1 ring-black/5 dark:ring-white/5">
        {/* Background layers (isolated to prevent overflowing noise, while allowing icons to pop out) */}
        <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none backdrop-blur-[40px] backdrop-saturate-[200%] bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10">
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>
        
        {apps.map((app) => (
          <motion.button
            key={app.id}
            onClick={() => {
              playTap();
              onToggle(app.id);
            }}
            whileHover={{ y: -12, scale: 1.25 }}
            whileTap={{ scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 450,
              damping: 20,
              mass: 0.8,
            }}
            className="relative flex flex-col items-center justify-end gap-1.5 cursor-pointer outline-none select-none group h-full"
            aria-label={`Open ${app.label}`}
          >
            {/* Tooltip */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-black/80 dark:bg-white/90 text-white dark:text-black text-[12px] font-medium tracking-tight whitespace-nowrap opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none shadow-lg">
              {app.label}
              {/* Tooltip Arrow */}
              <svg className="absolute w-3 h-3 text-black/80 dark:text-white/90 -bottom-2 left-1/2 -translate-x-1/2" viewBox="0 0 10 10" fill="currentColor">
                <polygon points="0,0 10,0 5,5" />
              </svg>
            </div>

            {/* Icon Container */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center transition-all duration-300 drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)] group-hover:drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)] relative group-active:scale-95">
              {app.icon}
            </div>

            {/* Active indicator dot */}
            <div
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 shadow-sm ${
                app.isOpen
                  ? "bg-zinc-800 dark:bg-zinc-200 opacity-100 scale-100"
                  : "bg-zinc-800 dark:bg-zinc-200 opacity-0 scale-0"
              }`}
            />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
