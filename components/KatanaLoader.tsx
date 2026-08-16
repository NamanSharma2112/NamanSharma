"use client";

import { motion } from "motion/react";

/**
 * A katana that draws itself, spins once, then cuts across the screen.
 *
 * The timeline is one loop of `cycle` seconds:
 *  0.00–0.30  the blade slides out of an implied saya
 *  0.30–0.62  a full rotation, pivoting on the grip
 *  0.62–0.80  it snaps flat and lunges right
 *  0.62–0.95  a slash streak opens behind it and closes again
 */
export default function KatanaLoader({
  size = 132,
  cycle = 1.9,
  once = false,
}: {
  size?: number;
  /** Seconds per full draw-spin-slash loop. */
  cycle?: number;
  /** Run the sequence a single time instead of looping. */
  once?: boolean;
}) {
  const loop = {
    duration: cycle,
    repeat: once ? 0 : Infinity,
    ease: "easeInOut" as const,
  };

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size * 0.42 }}
      aria-hidden
    >
      {/* The cut it leaves in the air. */}
      <motion.span
        className="absolute h-[2px] rounded-full bg-gradient-to-r from-transparent via-white to-transparent"
        style={{ width: size * 0.95 }}
        animate={{ scaleX: [0, 0, 1, 1, 0], opacity: [0, 0, 0.95, 0.5, 0] }}
        transition={{ ...loop, times: [0, 0.62, 0.74, 0.86, 1] }}
      />

      <motion.svg
        width={size}
        height={size * 0.42}
        viewBox="0 0 120 50"
        fill="none"
        style={{ originX: "0.16", originY: "0.62" }}
        animate={{ rotate: [0, 0, 360, 360, 0], x: [-14, -14, -14, 16, -14] }}
        transition={{ ...loop, times: [0, 0.3, 0.62, 0.8, 1] }}
      >
        {/* Blade — drawn on with a dash offset so it slides out of the saya. */}
        <motion.path
          d="M34 31 C 55 29, 82 24, 108 15"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          animate={{ strokeDashoffset: [1, 0, 0, 0, 1] }}
          transition={{ ...loop, times: [0, 0.3, 0.62, 0.86, 1] }}
        />
        {/* Hardened edge line, a touch brighter than the spine. */}
        <motion.path
          d="M36 33.6 C 56 31.6, 82 26.6, 106 18"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          opacity={0.45}
          pathLength={1}
          strokeDasharray={1}
          animate={{ strokeDashoffset: [1, 0, 0, 0, 1] }}
          transition={{ ...loop, times: [0, 0.34, 0.62, 0.86, 1] }}
        />
        {/* Tsuba, the guard. */}
        <motion.ellipse
          cx="31"
          cy="32.5"
          rx="2.6"
          ry="6"
          fill="currentColor"
          animate={{ opacity: [0, 1, 1, 1, 0] }}
          transition={{ ...loop, times: [0, 0.26, 0.62, 0.86, 1] }}
        />
        {/* Tsuka, the grip. */}
        <motion.path
          d="M11 36.5 L29 33.4"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          opacity={0.75}
          animate={{ opacity: [0, 0.75, 0.75, 0.75, 0] }}
          transition={{ ...loop, times: [0, 0.24, 0.62, 0.86, 1] }}
        />
      </motion.svg>
    </div>
  );
}
