"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/**
 * The intro: the name on a reel, turning through the four scripts it gets
 * written in. Whichever is centred is sharp; the ones above and below sit
 * blurred and dimmed, the way a picker reads.
 *
 * Everything moves on the same 0.3s curve — the strip, the blur, the fade and
 * the scale — so a name arriving and the two beside it settling read as one
 * movement rather than several.
 */

const NAMES = [
  { lang: "en", text: "Naman Sharma" },
  { lang: "ja", text: "ナマン・シャルマ" },
  { lang: "hi", text: "नमन शर्मा" },
  { lang: "pa", text: "ਨਮਨ ਸ਼ਰਮਾ" },
];

/** Seconds a name holds before the reel moves on. */
const HOLD = 0.72;
/** Seconds every part of a change takes. */
const SHIFT = 0.3;
/** Gentle out-curve — quick to leave, slow to land. */
const EASE = [0.22, 1, 0.36, 1] as const;
const ROW = 42;

/** Enough repeats that the reel never runs dry while the screen is up. */
const ROWS = Array.from({ length: 6 }, () => NAMES).flat();

/** Seconds the intro holds before it lifts. */
export const BOOT_DURATION = HOLD * NAMES.length + 0.5;
/** Seconds the black sheet takes to clear once it starts lifting. */
export const BOOT_FADE = 0.6;

/**
 * Whether it is on screen is decided upstream, by whoever also tells the page
 * it may arrive — the two have to be the same moment.
 */
export default function BootScreen({ show }: { show: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setStep((s) => s + 1), HOLD * 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: BOOT_FADE, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative overflow-hidden"
            style={{
              height: ROW * 3,
              width: 300,
              // Softens the ends so names arrive and leave rather than being
              // clipped off.
              maskImage:
                "linear-gradient(to bottom, transparent, black 24%, black 76%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, black 24%, black 76%, transparent)",
            }}
          >
            <motion.div
              animate={{ y: -(step - 1) * ROW }}
              transition={{ duration: SHIFT, ease: EASE }}
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
                    // Start where they belong rather than animating in from
                    // the defaults on mount.
                    initial={false}
                    animate={{
                      opacity: centred ? 1 : near ? 0.35 : 0,
                      filter: centred ? "blur(0px)" : "blur(3.5px)",
                      scale: centred ? 1 : 0.9,
                    }}
                    transition={{ duration: SHIFT, ease: EASE }}
                  >
                    {name.text}
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
