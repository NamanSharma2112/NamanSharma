"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Signature from "./Signature";
import KatanaLoader from "./KatanaLoader";

/**
 * The intro screen: the signature draws itself, then a katana draws, spins and
 * slashes on a loop while the desktop gets ready behind it.
 *
 * This has to be rendered outside the desktop window. The window animates, and
 * an element with a transform becomes the containing block for its fixed
 * descendants, which would pin this to the window's box — a box taller than the
 * viewport, so the mascot would centre itself below the fold.
 */
export default function BootScreen({
  /** Seconds the bar takes to fill before the screen lifts. */
  duration = 2.6,
  /** Show it only on the first load of a session rather than every load. */
  oncePerSession = false,
}: {
  duration?: number;
  oncePerSession?: boolean;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (oncePerSession && sessionStorage.getItem("hasVisited") === "true") {
      setVisible(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setVisible(false);
      if (oncePerSession) sessionStorage.setItem("hasVisited", "true");
    }, duration * 1000);
    return () => window.clearTimeout(timer);
  }, [duration, oncePerSession]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#f5f5f5] dark:bg-[#1f1f23]"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="w-[160px] sm:w-[200px]"
          >
            <Signature className="h-auto w-full overflow-visible text-black dark:text-white" />
          </motion.div>

          {/* ナマン・シャルマ — "Naman Sharuma", the katakana the name is
              normally transliterated into. Geist carries no CJK, so this falls
              back to the system Japanese face. */}
          <motion.p
            lang="ja"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.1, ease: "easeOut" }}
            className="mt-4 text-[12px] tracking-[0.3em] text-zinc-500 dark:text-zinc-400"
          >
            ナマン・シャルマ
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mt-6 text-zinc-900 dark:text-zinc-100"
          >
            <KatanaLoader />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
