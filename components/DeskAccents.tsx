"use client";

import { motion } from "motion/react";

/**
 * Quiet dressing for the desktop, one mark per place the wallpapers travel
 * through: Japan down the right edge, India down the left, London in the
 * corner.
 *
 * Everything sits above the wallpaper but under the windows, so it reads as
 * part of the desk rather than as UI, and none of it takes pointer events.
 */

const JP_TITLE = "デザインエンジニア";
const JP_SEAL = "シャルマ";
const IN_NAME = "नमन शर्मा";
const IN_CITY = "जालंधर";

/** When the Japanese column finishes setting and the seal comes down. */
const TYPE_START = 0.6;
const STAMP_AT = TYPE_START + JP_TITLE.length * 0.07 + 0.35;

/* ── Japan ──────────────────────────────────────────────────────────────── */

/**
 * The type sets itself one character at a time, then a glow walks down the
 * column on a loop.
 */
function JapaneseColumn() {
  return (
    <div
      lang="ja"
      className="absolute right-8 top-[16%] flex items-start gap-3"
      style={{ writingMode: "vertical-rl" }}
    >
      <div className="text-[13px] tracking-[0.42em] [text-orientation:upright]">
        {JP_TITLE.split("").map((ch, i) => (
          <motion.span
            key={`${ch}-${i}`}
            className="inline-block"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: TYPE_START + i * 0.07,
              ease: "easeOut",
            }}
          >
            {/* A second layer so the entrance and the loop do not fight over
                the same opacity. */}
            <motion.span
              className="inline-block text-white"
              animate={{ opacity: [0.3, 0.85, 0.3] }}
              transition={{
                duration: 3.4,
                repeat: Infinity,
                delay: i * 0.16,
                ease: "easeInOut",
              }}
            >
              {ch}
            </motion.span>
          </motion.span>
        ))}
      </div>

      <motion.span
        className="mt-1 h-24 w-px origin-top bg-gradient-to-b from-white/40 to-transparent"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: [0.5, 1, 0.5] }}
        transition={{
          scaleY: { duration: 0.9, delay: TYPE_START, ease: "easeOut" },
          opacity: { duration: 3.4, repeat: Infinity, ease: "easeInOut" },
        }}
      />
    </div>
  );
}

/**
 * The seal presses on with a ring of ink and afterwards rocks a few degrees,
 * the way a stamp left on a desk never sits quite square.
 */
function Hanko() {
  return (
    <div className="absolute right-10 bottom-[22%]">
      {/* Ink pushed out from under the seal as it lands. */}
      <motion.span
        className="absolute inset-0 rounded-[7px] border-2 border-[#d7263d]"
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: [0, 0.65, 0], scale: [1, 1.8, 2.15] }}
        transition={{ duration: 0.85, delay: STAMP_AT + 0.08, ease: "easeOut" }}
      />

      <motion.div
        animate={{ rotate: [-7, -4.2, -7.8, -7] }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: STAMP_AT + 0.9,
        }}
      >
        <motion.div
          lang="ja"
          initial={{ opacity: 0, scale: 1.75, rotate: -16 }}
          animate={{ opacity: 1, scale: 1, rotate: -7 }}
          transition={{
            type: "spring",
            stiffness: 460,
            damping: 19,
            delay: STAMP_AT,
          }}
          className="flex h-[52px] w-[52px] items-center justify-center rounded-[7px] border-[2.5px] border-[#d7263d]/80 bg-[#d7263d]/15 backdrop-blur-[2px]"
        >
          <motion.span
            className="text-[13px] font-semibold leading-[1.05] tracking-[0.06em] text-[#ff8496] [text-orientation:upright]"
            style={{ writingMode: "vertical-rl" }}
            animate={{ opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          >
            {JP_SEAL}
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ── India ──────────────────────────────────────────────────────────────── */

/**
 * The name in Devanagari down the left edge, over a rangoli figure that turns
 * slowly. Devanagari joins across a word, so this sets the line sideways as a
 * whole rather than stacking glyphs the way the Japanese column does.
 */
function IndiaMark() {
  return (
    <div className="absolute left-8 top-[44%] flex items-start gap-3">
      <motion.div
        className="relative flex size-[46px] shrink-0 items-center justify-center"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 18, delay: 1.1 }}
      >
        <motion.svg
          viewBox="0 0 48 48"
          className="absolute size-full text-[#ff9d4d]"
          animate={{ rotate: 360 }}
          transition={{ duration: 44, repeat: Infinity, ease: "linear" }}
        >
          {/* Eight petals struck around a centre, the way a rangoli is set out. */}
          {Array.from({ length: 8 }, (_, i) => (
            <ellipse
              key={i}
              cx="24"
              cy="12"
              rx="3.4"
              ry="8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.1"
              opacity={0.55}
              transform={`rotate(${i * 45} 24 24)`}
            />
          ))}
          <circle cx="24" cy="24" r="3" fill="currentColor" opacity={0.6} />
        </motion.svg>

        <motion.span
          className="absolute size-full rounded-full border border-[#ff9d4d]/35"
          animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.15, 0.5] }}
          transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <div
        lang="hi"
        className="text-[12px] tracking-[0.24em]"
        style={{ writingMode: "vertical-rl" }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.25, ease: "easeOut" }}
        >
          <motion.span
            className="text-white"
            animate={{ opacity: [0.32, 0.8, 0.32] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            {IN_NAME}
          </motion.span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5, ease: "easeOut" }}
          className="mt-3"
        >
          <motion.span
            className="text-[#ff9d4d]"
            animate={{ opacity: [0.3, 0.65, 0.3] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: 0.8,
              ease: "easeInOut",
            }}
          >
            {IN_CITY}
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
}

/* ── London ─────────────────────────────────────────────────────────────── */

/**
 * A transport-style ring and bar with the city and its coordinates. The ring
 * draws itself on, then breathes.
 */
function LondonMark() {
  return (
    <motion.div
      className="absolute left-10 bottom-[16%] flex items-center gap-3"
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 1.7, ease: "easeOut" }}
    >
      <div className="relative flex size-[38px] items-center justify-center">
        <motion.svg viewBox="0 0 40 40" className="size-full text-white/70">
          <motion.circle
            cx="20"
            cy="20"
            r="13"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.4"
            pathLength={1}
            strokeDasharray={1}
            initial={{ strokeDashoffset: 1 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1, delay: 1.8, ease: "easeInOut" }}
          />
          <motion.rect
            x="3"
            y="18"
            width="34"
            height="4"
            rx="1"
            fill="currentColor"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 2.5, ease: "easeOut" }}
            style={{ originX: "0.5" }}
          />
        </motion.svg>

        <motion.span
          className="absolute size-full rounded-full border border-white/25"
          animate={{ scale: [1, 1.18, 1], opacity: [0.45, 0, 0.45] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="leading-tight">
        <motion.p
          className="text-[11px] font-semibold tracking-[0.34em] text-white"
          animate={{ opacity: [0.4, 0.85, 0.4] }}
          transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
        >
          LONDON
        </motion.p>
        <p className="mt-0.5 text-[9px] tracking-[0.18em] text-white/35 tabular-nums">
          51.5074° N · 0.1278° W
        </p>
      </div>
    </motion.div>
  );
}

/* ── all of it ──────────────────────────────────────────────────────────── */

export default function DeskAccents() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[2] hidden select-none md:block">
      <JapaneseColumn />
      <Hanko />
      <IndiaMark />
      <LondonMark />
    </div>
  );
}
