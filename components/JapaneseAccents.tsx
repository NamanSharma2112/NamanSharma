"use client";

import { motion } from "motion/react";

/**
 * Quiet Japanese dressing for the desktop: a line of vertical type down the
 * right edge and a hanko in the corner.
 *
 * Both sit above the wallpaper but under the windows, so they read as part of
 * the desk rather than as UI, and neither takes pointer events.
 */
export default function JapaneseAccents() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[2] hidden select-none md:block">
      {/* Tategaki — set top-to-bottom, the way signage is. */}
      <motion.div
        lang="ja"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.6, ease: "easeOut" }}
        className="absolute right-8 top-[16%] flex items-start gap-3"
        style={{ writingMode: "vertical-rl" }}
      >
        <span className="text-[13px] tracking-[0.42em] text-white/35 [text-orientation:upright]">
          デザインエンジニア
        </span>
        <span className="mt-1 h-24 w-px bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>

      {/* Hanko — the surname in katakana, read top to bottom. */}
      <motion.div
        lang="ja"
        initial={{ opacity: 0, scale: 0.8, rotate: -14 }}
        animate={{ opacity: 1, scale: 1, rotate: -7 }}
        transition={{ type: "spring", stiffness: 200, damping: 16, delay: 1.2 }}
        className="absolute right-10 bottom-[22%] flex h-[52px] w-[52px] items-center justify-center rounded-[7px] border-[2.5px] border-[#d7263d]/80 bg-[#d7263d]/15 backdrop-blur-[2px]"
      >
        <span
          className="text-[13px] font-semibold leading-[1.05] tracking-[0.06em] text-[#ff8496] [text-orientation:upright]"
          style={{ writingMode: "vertical-rl" }}
        >
          シャルマ
        </span>
      </motion.div>
    </div>
  );
}
