"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import KatanaLoader from "./KatanaLoader";

/**
 * The intro: the katana draws, turns and cuts once, then clears out, and the
 * name rides in on a reel through the four scripts it gets written in — sharp
 * in the middle, blurred above and below, the way a picker reads.
 */

const NAMES = [
  { lang: "en", text: "Naman Sharma" },
  { lang: "ja", text: "ナマン・シャルマ" },
  { lang: "hi", text: "नमन शर्मा" },
  { lang: "pa", text: "ਨਮਨ ਸ਼ਰਮਾ" },
];

/** Seconds the sword gets before it leaves. */
const SWORD = 1.6;
/** Seconds each name holds in the middle. */
const HOLD = 0.78;
const ROW = 42;

/** Enough repeats that the reel never runs dry while the screen is up. */
const ROWS = Array.from({ length: 6 }, () => NAMES).flat();

export default function BootScreen({
  /** Seconds before the screen lifts. */
  duration = SWORD + 0.3 + HOLD * NAMES.length + 0.4,
  /** Show it only on the first load of a session rather than every load. */
  oncePerSession = false,
}: {
  duration?: number;
  oncePerSession?: boolean;
}) {
  const [visible, setVisible] = useState(true);
  const [showSword, setShowSword] = useState(true);
  const [step, setStep] = useState(0);

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

  // The sword bows out once its single pass is done.
  useEffect(() => {
    const t = window.setTimeout(() => setShowSword(false), SWORD * 1000);
    return () => window.clearTimeout(t);
  }, []);

  // The reel only turns once the sword has gone.
  useEffect(() => {
    if (showSword) return;
    const id = window.setInterval(() => setStep((s) => s + 1), HOLD * 1000);
    return () => window.clearInterval(id);
  }, [showSword]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
        >
          <AnimatePresence mode="wait">
            {showSword ? (
              <motion.div
                key="sword"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="text-zinc-100"
              >
                <KatanaLoader once cycle={SWORD} />
              </motion.div>
            ) : (
              <motion.div
                key="names"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative overflow-hidden"
                style={{
                  height: ROW * 3,
                  width: 280,
                  // Softens the ends so names arrive and leave rather than
                  // being clipped off.
                  maskImage:
                    "linear-gradient(to bottom, transparent, black 22%, black 78%, transparent)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent, black 22%, black 78%, transparent)",
                }}
              >
                <motion.div
                  animate={{ y: -(step - 1) * ROW }}
                  transition={{ type: "spring", stiffness: 200, damping: 26 }}
                >
                  {ROWS.map((name, i) => {
                    const offset = i - step;
                    const centred = offset === 0;
                    const near = Math.abs(offset) === 1;
                    return (
                      <motion.div
                        key={i}
                        lang={name.lang}
                        className="flex items-center justify-center whitespace-nowrap text-[17px] font-medium text-white"
                        style={{ height: ROW }}
                        animate={{
                          opacity: centred ? 1 : near ? 0.4 : 0,
                          filter: centred ? "blur(0px)" : "blur(3.5px)",
                          scale: centred ? 1 : 0.88,
                        }}
                        transition={{ duration: 0.42, ease: "easeOut" }}
                      >
                        {name.text}
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
