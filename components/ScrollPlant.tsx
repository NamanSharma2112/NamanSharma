"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "motion/react";

function LeafNode({
  smoothProgress,
  timing,
  y,
  stemX,
  isLeft,
}: {
  smoothProgress: MotionValue<number>;
  timing: { start: number; end: number };
  y: number;
  stemX: number;
  isLeft: boolean;
}) {
  const leafProgress = useTransform(smoothProgress, [timing.start, timing.end], [0, 1]);
  const leafScale = useTransform(leafProgress, [0, 1], [0, 1]);
  const leafOpacity = useTransform(leafProgress, [0, 0.5], [0, 1]);
  const leafRotation = useTransform(
    leafProgress,
    [0, 1],
    isLeft ? [40, 0] : [-40, 0]
  );

  return (
    <motion.g
      style={{
        opacity: leafOpacity,
        scale: leafScale,
        rotate: leafRotation,
        transformOrigin: `${stemX}px ${y}px`,
      }}
    >
      {/* Leaf shape */}
      <path
        d={
          isLeft
            ? `M${stemX},${y} Q${stemX - 14},${y - 6} ${stemX - 17},${y - 2} Q${stemX - 14},${y + 3} ${stemX},${y}`
            : `M${stemX},${y} Q${stemX + 14},${y - 6} ${stemX + 17},${y - 2} Q${stemX + 14},${y + 3} ${stemX},${y}`
        }
        fill="#6AA84F"
        opacity="0.85"
      />
      {/* Leaf vein */}
      <line
        x1={stemX}
        y1={y}
        x2={isLeft ? stemX - 13 : stemX + 13}
        y2={y - 1.5}
        stroke="#4A7A3A"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.5"
      />
    </motion.g>
  );
}

function LeafSet({
  smoothProgress,
  stemX,
  stemBottom,
  stemLength,
  leafTimings,
}: {
  smoothProgress: MotionValue<number>;
  stemX: number;
  stemBottom: number;
  stemLength: number;
  leafTimings: { start: number; end: number }[];
}) {
  return (
    <>
      {leafTimings.map((timing, i) => {
        const y = stemBottom - ((i + 1) / 7) * stemLength;
        const isLeft = i % 2 === 0;
        return (
          <LeafNode
            key={i}
            smoothProgress={smoothProgress}
            timing={timing}
            y={y}
            stemX={stemX}
            isLeft={isLeft}
          />
        );
      })}
    </>
  );
}

/**
 * A decorative SVG plant that grows as the user scrolls down the page.
 * Positioned on the right side of the blog content area.
 */
export default function ScrollPlant() {
  const { scrollYProgress } = useScroll();

  // Smooth out the scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    mass: 0.8,
  });

  // ── Growth phases mapped to scroll progress ──
  // Roots:  0.00 → 0.08
  // Stem:   0.05 → 0.50
  // Leaves: staggered 0.15 → 0.75
  // Flower: 0.65 → 1.00

  const rootOpacity = useTransform(smoothProgress, [0, 0.06], [0, 1]);
  const rootScale = useTransform(smoothProgress, [0, 0.08], [0.3, 1]);

  const stemHeight = useTransform(smoothProgress, [0.05, 0.55], [0, 1]);

  // 6 leaf pairs, staggered
  const leafTimings = [
    { start: 0.15, end: 0.25 },
    { start: 0.22, end: 0.32 },
    { start: 0.30, end: 0.40 },
    { start: 0.38, end: 0.48 },
    { start: 0.46, end: 0.56 },
    { start: 0.54, end: 0.64 },
  ];

  const flowerScale = useTransform(smoothProgress, [0.65, 0.85], [0, 1]);
  const flowerOpacity = useTransform(smoothProgress, [0.65, 0.80], [0, 1]);
  const flowerRotate = useTransform(smoothProgress, [0.65, 1.0], [-30, 0]);

  // Glow at the end
  const glowOpacity = useTransform(smoothProgress, [0.85, 1.0], [0, 0.6]);

  // Track if we're on mobile to hide the plant
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) return null;

  const PLANT_HEIGHT = 260;
  const STEM_X = 30;
  const STEM_TOP = 20;
  const STEM_BOTTOM = 235;
  const STEM_LENGTH = STEM_BOTTOM - STEM_TOP;

  return (
    <div
      className="fixed z-10 pointer-events-none"
      style={{
        right: "calc(50% - 380px)",
        bottom: "40px",
        width: "60px",
        height: `${PLANT_HEIGHT}px`,
      }}
    >
      <svg
        width="60"
        height={PLANT_HEIGHT}
        viewBox={`0 0 60 ${PLANT_HEIGHT}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Roots ── */}
        <motion.g
          style={{ opacity: rootOpacity, scale: rootScale, transformOrigin: "30px 240px" }}
        >
          <line x1="30" y1="235" x2="18" y2="250" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="30" y1="235" x2="30" y2="255" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="30" y1="235" x2="42" y2="250" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round" />
          {/* Tiny root hairs */}
          <line x1="18" y1="250" x2="13" y2="257" stroke="#8B7355" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
          <line x1="42" y1="250" x2="47" y2="257" stroke="#8B7355" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        </motion.g>

        {/* ── Stem ── */}
        <motion.line
          x1={STEM_X}
          y1={STEM_BOTTOM}
          x2={STEM_X}
          y2={STEM_TOP}
          stroke="#5B8C5A"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            pathLength: stemHeight,
          }}
          strokeDasharray="1"
          strokeDashoffset="0"
        />

        {/* ── Leaves ── */}
        <LeafSet smoothProgress={smoothProgress} stemX={STEM_X} stemBottom={STEM_BOTTOM} stemLength={STEM_LENGTH} leafTimings={leafTimings} />

        {/* ── Flower ── */}
        <motion.g
          style={{
            opacity: flowerOpacity,
            scale: flowerScale,
            rotate: flowerRotate,
            transformOrigin: `${STEM_X}px ${STEM_TOP}px`,
          }}
        >
          {/* Petals */}
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <ellipse
              key={angle}
              cx={STEM_X + Math.cos((angle * Math.PI) / 180) * 7}
              cy={STEM_TOP - 8 + Math.sin((angle * Math.PI) / 180) * 7}
              rx="4.5"
              ry="2.5"
              fill="#E8C07A"
              opacity="0.9"
              transform={`rotate(${angle}, ${STEM_X + Math.cos((angle * Math.PI) / 180) * 7}, ${STEM_TOP - 8 + Math.sin((angle * Math.PI) / 180) * 7})`}
            />
          ))}
          {/* Center */}
          <circle cx={STEM_X} cy={STEM_TOP - 8} r="3.5" fill="#D4A04A" />
          <circle cx={STEM_X} cy={STEM_TOP - 8} r="2" fill="#C48B30" />
        </motion.g>

        {/* ── Glow behind flower ── */}
        <motion.circle
          cx={STEM_X}
          cy={STEM_TOP - 8}
          r="16"
          fill="url(#flowerGlow)"
          style={{ opacity: glowOpacity }}
        />

        <defs>
          <radialGradient id="flowerGlow">
            <stop offset="0%" stopColor="#E8C07A" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#E8C07A" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
