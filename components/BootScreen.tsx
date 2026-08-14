"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import BunnyIcon from "./BunnyIcon";
import Signature from "./Signature";

/**
 * The intro screen: the mascot lands, the signature draws itself underneath,
 * and a boot bar runs while the desktop gets ready behind it. Shown once a
 * session.
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
  // Nudges the bunny into its hop every so often instead of leaving it still.
  const [hop, setHop] = useState(1);

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

  useEffect(() => {
    if (!visible) return;
    const id = window.setInterval(() => setHop((n) => n + 1), 1100);
    return () => window.clearInterval(id);
  }, [visible]);

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
            initial={{ y: -34, scale: 0.55, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 15,
              delay: 0.05,
            }}
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <BunnyIcon
                size={104}
                trigger={hop}
                forceEmotion="awake"
                className="text-zinc-900 dark:text-zinc-100"
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
            className="mt-7 w-[160px] sm:w-[200px]"
          >
            <Signature className="h-auto w-full overflow-visible text-black dark:text-white" />
          </motion.div>

          <div className="mt-9 h-[3px] w-40 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration, ease: "easeInOut" }}
              className="h-full origin-left rounded-full bg-zinc-900 dark:bg-zinc-100"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
