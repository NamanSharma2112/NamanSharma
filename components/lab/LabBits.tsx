"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

/* ── a mark lit by the cursor ───────────────────────────────────────────── */

const MARK_W = 480;
const MARK_H = 490;
const MARK =
  "M285.38 207.711L462.954 1.5H420.874L266.687 180.55L143.538 1.5H1.50003L187.726 272.256L1.50003 488.5H43.5818L206.408 299.417L336.462 488.5H478.5L285.37 207.711H285.38ZM227.743 274.641L208.875 247.68L58.7444 33.147H123.379L244.536 206.282L263.405 233.243L420.894 458.292H356.259L227.743 274.652V274.641Z";

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

/**
 * The mark is drawn twice: a flat one underneath, and the same path on top
 * whose stroke is a radial gradient centred on the cursor. Moving the pointer
 * moves the gradient's centre, so the light appears to travel over the edge
 * rather than the whole shape changing colour.
 */
export function SpotlightMark() {
  const svg = useRef<SVGSVGElement>(null);
  const x = useMotionValue(MARK_W / 2);
  const y = useMotionValue(MARK_H / 2);
  const cx = useSpring(useTransform(x, (v) => clamp(v, 0, MARK_W)), { stiffness: 120, damping: 20 });
  const cy = useSpring(useTransform(y, (v) => clamp(v, 0, MARK_H)), { stiffness: 120, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const node = svg.current;
      if (!node) return;
      const r = node.getBoundingClientRect();
      if (!r.width || !r.height) return;
      x.set(((e.clientX - r.left) / r.width) * MARK_W);
      y.set(((e.clientY - r.top) / r.height) * MARK_H);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <div className="lab-stage grid h-[300px] w-full place-items-center rounded-xl">
      <svg ref={svg} viewBox={`0 0 ${MARK_W} ${MARK_H}`} fill="none" className="h-44 w-auto">
        <defs>
          <motion.radialGradient id="lab-spot" cx={cx} cy={cy} r={400} gradientUnits="userSpaceOnUse">
            <stop stopColor="#38bdf8" />
            <stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
          </motion.radialGradient>
        </defs>
        <path d={MARK} className="fill-zinc-200 dark:fill-zinc-800" />
        <path d={MARK} fill="none" stroke="url(#lab-spot)" strokeWidth={4} strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ── lines converging on a node ─────────────────────────────────────────── */

const LINES = [
  "M 367 0 L 367 200",
  "M 560 60 L 560 120 L 400 190 L 367 200",
  "M 175 60 L 175 120 L 335 190 L 367 200",
  "M 20 120 L 20 170 L 330 205 L 367 205",
  "M 714 120 L 714 170 L 404 205 L 367 205",
];

const SEG = 0.12;

/**
 * Each route is drawn twice: a faint full-length line, and a short dash that
 * runs along it. Animating `strokeDashoffset` with a dash the length of the
 * segment is what makes the dash travel the path instead of the line growing.
 */
export function ConvergingLines({
  /** Swappable so the same graphic can sit on a page without the lab's frame. */
  className = "lab-stage relative h-[260px] w-full overflow-hidden rounded-xl",
}: {
  className?: string;
} = {}) {
  return (
    <div className={className}>
      <svg viewBox="0 0 734 240" fill="none" className="absolute inset-0 h-full w-full">
        {LINES.map((d) => (
          <g key={d}>
            <path d={d} className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth={3} />
            <motion.path
              d={d}
              pathLength={1}
              className="stroke-blue-500"
              strokeWidth={1.6}
              strokeDasharray={`${SEG} ${1 - SEG}`}
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: -1 }}
              transition={{ duration: 2.6, ease: "linear", repeat: Infinity, repeatDelay: 0.4 }}
            />
          </g>
        ))}
        <circle cx={367} cy={210} r={16} className="fill-blue-500/15 stroke-blue-500" strokeWidth={2} />
      </svg>
    </div>
  );
}

/* ── text riding a curve ────────────────────────────────────────────────── */

/**
 * The words are not laid out by the browser at all — they are attached to a
 * path with `textPath`, and the whole text element's `x` is animated, which
 * slides the string along the curve.
 */
export function PathMarquee() {
  const line = "DESIGN ENGINEER · MOTION · INTERFACES · DETAIL · ";
  return (
    <div className="lab-stage grid h-[200px] w-full place-items-center overflow-hidden rounded-xl">
      <svg viewBox="0 0 600 160" fill="none" className="h-full w-full">
        <defs>
          <path id="lab-curve" d="M -600 110 Q 300 -10 1200 110" />
        </defs>
        <use href="#lab-curve" className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth={1.5} />
        <text x={0} className="fill-zinc-700 text-[15px] font-medium dark:fill-zinc-200">
          <textPath href="#lab-curve" startOffset={0}>
            {line.repeat(4)}
          </textPath>
          <animate attributeName="x" dur="22s" values="0;-700" repeatCount="indefinite" />
        </text>
      </svg>
    </div>
  );
}

/* ── a card that leans away ─────────────────────────────────────────────── */

/** One property, one spring: the whole trick is that it tips back from the top. */
export function TiltCard() {
  return (
    <div className="lab-stage grid h-[260px] w-full place-items-center rounded-xl [perspective:900px]">
      <motion.div
        whileHover={{ rotateX: 38 }}
        transition={{ type: "spring", stiffness: 300, damping: 12 }}
        className="lab-card size-40 rounded-lg p-1.5 [transform-origin:center_bottom]"
      >
        <img
          src="/motionkit-preview.png"
          alt=""
          draggable={false}
          className="size-full rounded-md object-cover"
        />
      </motion.div>
    </div>
  );
}
