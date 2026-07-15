"use client";

import { motion } from "motion/react";

/* ═══════════════════════════════════════════════════════════
   Shared wrapper — clean, minimal card
   ═══════════════════════════════════════════════════════════ */
function BlockCard({
  children,
  isDark,
}: {
  children: React.ReactNode;
  isDark: boolean;
}) {
  return (
    <div
      className="my-8 rounded-xl border p-6 sm:p-8 transition-colors duration-500"
      style={{
        backgroundColor: isDark ? "#141414" : "#fafafa",
        borderColor: isDark ? "#262626" : "#e5e5e5",
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   1. WOW Decay — declining bar chart
   After "intro"
   ═══════════════════════════════════════════════════════════ */
const wowSteps = [
  { label: "1st time", reaction: "WOW", fill: 1 },
  { label: "10th time", reaction: "Nice", fill: 0.65 },
  { label: "100th time", reaction: "Okay", fill: 0.3 },
  { label: "300th time", reaction: "Meh", fill: 0.08 },
];

export function WowDecayBlock({ isDark }: { isDark: boolean }) {
  const accentColor = isDark ? "#818cf8" : "#4f46e5";
  const trackBg = isDark ? "#1a1a1a" : "#f4f4f5";
  const labelColor = isDark ? "#52525b" : "#a1a1aa";
  const headColor = isDark ? "#e4e4e7" : "#27272a";

  return (
    <BlockCard isDark={isDark}>
      <p className="text-[11px] uppercase tracking-[0.1em] font-medium mb-6 transition-colors duration-500" style={{ color: labelColor }}>
        Perceived Impact Over Time
      </p>

      <div className="flex flex-col gap-3.5">
        {wowSteps.map((step, i) => (
          <motion.div
            key={step.label}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: i * 0.1, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Label */}
            <span
              className="text-[11px] shrink-0 w-[72px] text-right transition-colors duration-500"
              style={{ color: labelColor }}
            >
              {step.label}
            </span>

            {/* Bar track */}
            <div className="flex-1 h-[6px] rounded-full overflow-hidden" style={{ backgroundColor: trackBg }}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: accentColor, opacity: 0.2 + step.fill * 0.8 }}
                initial={{ width: "0%" }}
                whileInView={{ width: `${step.fill * 100}%` }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.1 + 0.1,
                  duration: 0.7,
                  ease: [0.23, 1, 0.32, 1],
                }}
              />
            </div>

            {/* Reaction */}
            <span
              className="text-[11px] font-medium shrink-0 w-8 transition-colors duration-500"
              style={{ color: step.fill > 0.5 ? headColor : labelColor }}
            >
              {step.reaction}
            </span>
          </motion.div>
        ))}
      </div>

      <p className="text-[11px] mt-5 text-center italic transition-colors duration-500" style={{ color: labelColor }}>
        The same effect becomes invisible with repetition.
      </p>
    </BlockCard>
  );
}

/* ═══════════════════════════════════════════════════════════
   2. Novelty Curve — declining SVG graph
   After "semantic-satiation"
   ═══════════════════════════════════════════════════════════ */
export function NoveltyCurveBlock({ isDark }: { isDark: boolean }) {
  const curveColor = isDark ? "#818cf8" : "#4f46e5";
  const axisColor = isDark ? "#262626" : "#e5e5e5";
  const labelColor = isDark ? "#52525b" : "#a1a1aa";

  return (
    <BlockCard isDark={isDark}>
      <div className="flex items-end gap-5">
        <span
          className="text-[10px] font-medium shrink-0 transition-colors duration-500"
          style={{ color: labelColor, writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          novelty
        </span>

        <div className="flex-1">
          <svg viewBox="0 0 300 100" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
            <line x1="0" y1="95" x2="295" y2="95" stroke={axisColor} strokeWidth="1" />
            <line x1="0" y1="0" x2="0" y2="95" stroke={axisColor} strokeWidth="1" />

            <defs>
              <linearGradient id="novFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={curveColor} stopOpacity="0.12" />
                <stop offset="100%" stopColor={curveColor} stopOpacity="0" />
              </linearGradient>
            </defs>

            <motion.path
              d="M0 8 C50 10, 70 40, 120 60 C170 78, 220 88, 295 93 L295 95 L0 95 Z"
              fill="url(#novFill)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />

            <motion.path
              d="M0 8 C50 10, 70 40, 120 60 C170 78, 220 88, 295 93"
              fill="none"
              stroke={curveColor}
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            />
          </svg>

          <span
            className="block text-right text-[10px] font-medium mt-1 transition-colors duration-500"
            style={{ color: labelColor }}
          >
            exposures →
          </span>
        </div>
      </div>
    </BlockCard>
  );
}

/* ═══════════════════════════════════════════════════════════
   3. UI Comparison — chaotic vs intentional
   After "every-animation-has-a-cost"
   ═══════════════════════════════════════════════════════════ */
export function UIComparisonBlock({ isDark }: { isDark: boolean }) {
  const cardBg = isDark ? "#1a1a1a" : "#ffffff";
  const borderCol = isDark ? "#262626" : "#e5e5e5";
  const mutedBg = isDark ? "#262626" : "#f4f4f5";
  const labelColor = isDark ? "#52525b" : "#a1a1aa";

  return (
    <BlockCard isDark={isDark}>
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {/* Chaotic */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] uppercase tracking-[0.08em] font-medium transition-colors duration-500" style={{ color: "#ef4444" }}>
            Chaotic
          </span>
          <div className="rounded-lg border p-3 flex flex-col gap-1.5 transition-colors duration-500" style={{ backgroundColor: cardBg, borderColor: borderCol }}>
            <motion.div animate={{ x: [0, 3, -3, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="h-4 rounded" style={{ backgroundColor: "#ef444430" }} />
            <motion.div animate={{ scale: [1, 1.04, 0.96, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} className="h-4 rounded" style={{ backgroundColor: "#ef444420" }} />
            <motion.div animate={{ rotate: [0, 1.5, -1.5, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="h-4 rounded" style={{ backgroundColor: "#ef444425" }} />
            <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 0.9 }} className="h-6 rounded mt-0.5" style={{ backgroundColor: "#ef444435" }} />
          </div>
          <span className="text-[10px] text-center transition-colors duration-500" style={{ color: labelColor }}>everything fights for attention</span>
        </div>

        {/* Intentional */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] uppercase tracking-[0.08em] font-medium transition-colors duration-500" style={{ color: "#22c55e" }}>
            Intentional
          </span>
          <div className="rounded-lg border p-3 flex flex-col gap-1.5 transition-colors duration-500" style={{ backgroundColor: cardBg, borderColor: borderCol }}>
            <div className="h-4 rounded transition-colors duration-500" style={{ backgroundColor: mutedBg }} />
            <div className="h-4 rounded transition-colors duration-500" style={{ backgroundColor: mutedBg }} />
            <div className="h-4 rounded transition-colors duration-500" style={{ backgroundColor: mutedBg }} />
            <motion.div
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
              className="h-6 rounded mt-0.5 cursor-pointer"
              style={{ backgroundColor: isDark ? "#818cf8" : "#4f46e5" }}
            />
          </div>
          <span className="text-[10px] text-center transition-colors duration-500" style={{ color: labelColor }}>one element draws the eye</span>
        </div>
      </div>
    </BlockCard>
  );
}

/* ═══════════════════════════════════════════════════════════
   4. Salt Analogy — two dose bars
   After "novelty-is-like-salt"
   ═══════════════════════════════════════════════════════════ */
export function SaltAnalogyBlock({ isDark }: { isDark: boolean }) {
  const labelColor = isDark ? "#71717a" : "#a1a1aa";
  const captionColor = isDark ? "#52525b" : "#a1a1aa";
  const trackBg = isDark ? "#1a1a1a" : "#f4f4f5";

  return (
    <BlockCard isDark={isDark}>
      <p className="text-[11px] uppercase tracking-[0.1em] font-medium mb-5 transition-colors duration-500" style={{ color: labelColor }}>
        Dosage matters
      </p>
      <div className="flex flex-col gap-4">
        {/* Right amount */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between">
            <span className="text-[12px] font-medium transition-colors duration-500" style={{ color: isDark ? "#e4e4e7" : "#27272a" }}>A pinch</span>
            <span className="text-[11px] transition-colors duration-500" style={{ color: "#22c55e" }}>delicious</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: trackBg }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: "#22c55e" }}
              initial={{ width: "0%" }}
              whileInView={{ width: "15%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
            />
          </div>
        </div>

        {/* Too much */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between">
            <span className="text-[12px] font-medium transition-colors duration-500" style={{ color: isDark ? "#e4e4e7" : "#27272a" }}>10× more</span>
            <span className="text-[11px] transition-colors duration-500" style={{ color: "#ef4444" }}>ruined</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: trackBg }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: "#ef4444" }}
              initial={{ width: "0%" }}
              whileInView={{ width: "95%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
            />
          </div>
        </div>
      </div>
      <p className="text-[11px] mt-4 text-center italic transition-colors duration-500" style={{ color: captionColor }}>
        Animations are seasoning, not the meal.
      </p>
    </BlockCard>
  );
}

/* ═══════════════════════════════════════════════════════════
   5. Login Button Comparison
   After "why-familiarity-feels-good"
   ═══════════════════════════════════════════════════════════ */
export function LoginButtonBlock({ isDark }: { isDark: boolean }) {
  const cardBg = isDark ? "#1a1a1a" : "#ffffff";
  const borderCol = isDark ? "#262626" : "#e5e5e5";
  const labelColor = isDark ? "#52525b" : "#a1a1aa";

  return (
    <BlockCard isDark={isDark}>
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {/* Familiar */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] uppercase tracking-[0.08em] font-medium transition-colors duration-500" style={{ color: "#22c55e" }}>
            Familiar
          </span>
          <div className="rounded-lg border p-5 flex items-center justify-center transition-colors duration-500" style={{ backgroundColor: cardBg, borderColor: borderCol }}>
            <motion.button
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
              className="px-5 py-2 rounded-lg text-[13px] font-medium cursor-pointer"
              style={{
                backgroundColor: isDark ? "#fafafa" : "#18181b",
                color: isDark ? "#18181b" : "#fafafa",
              }}
            >
              Log In
            </motion.button>
          </div>
          <span className="text-[10px] text-center transition-colors duration-500" style={{ color: labelColor }}>users know what to do</span>
        </div>

        {/* Overdesigned */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] uppercase tracking-[0.08em] font-medium transition-colors duration-500" style={{ color: "#ef4444" }}>
            Overdesigned
          </span>
          <div className="rounded-lg border p-5 flex items-center justify-center transition-colors duration-500" style={{ backgroundColor: cardBg, borderColor: borderCol }}>
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 0.6, 1],
                borderRadius: ["8px", "50%", "4px", "8px"],
              }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="px-5 py-2 text-[13px] font-medium flex items-center justify-center"
              style={{ backgroundColor: "#ef4444", color: "#ffffff", minWidth: 80 }}
            >
              ???
            </motion.div>
          </div>
          <span className="text-[10px] text-center transition-colors duration-500" style={{ color: labelColor }}>users are confused</span>
        </div>
      </div>
    </BlockCard>
  );
}

/* ═══════════════════════════════════════════════════════════
   6. 90/10 Rule — clean progress bars
   After "the-rule-of-thumb-you-should-follow"
   ═══════════════════════════════════════════════════════════ */
export function RuleOfThumbBlock({ isDark }: { isDark: boolean }) {
  const trackBg = isDark ? "#1a1a1a" : "#f4f4f5";
  const familiarColor = isDark ? "#3f3f46" : "#d4d4d8";
  const novelColor = isDark ? "#818cf8" : "#4f46e5";
  const labelColor = isDark ? "#71717a" : "#a1a1aa";
  const headColor = isDark ? "#e4e4e7" : "#27272a";

  return (
    <BlockCard isDark={isDark}>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-baseline">
            <span className="text-[12px] font-medium transition-colors duration-500" style={{ color: headColor }}>Familiar</span>
            <span className="text-[11px] tabular-nums transition-colors duration-500" style={{ color: labelColor }}>90%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: trackBg }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: familiarColor }}
              initial={{ width: "0%" }}
              whileInView={{ width: "90%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-baseline">
            <span className="text-[12px] font-medium transition-colors duration-500" style={{ color: headColor }}>Novel</span>
            <span className="text-[11px] tabular-nums transition-colors duration-500" style={{ color: labelColor }}>10%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: trackBg }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: novelColor }}
              initial={{ width: "0%" }}
              whileInView={{ width: "10%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.35 }}
            />
          </div>
        </div>

        <p className="text-[11px] text-center italic transition-colors duration-500" style={{ color: labelColor }}>
          Those 10% are what people remember.
        </p>
      </div>
    </BlockCard>
  );
}

/* ═══════════════════════════════════════════════════════════
   7. Color Theory — 60/30/10 mockups
   After "color-theory"
   ═══════════════════════════════════════════════════════════ */
export function ColorTheoryBlock({ isDark }: { isDark: boolean }) {
  const cardBg = isDark ? "#1a1a1a" : "#ffffff";
  const borderCol = isDark ? "#262626" : "#e5e5e5";
  const mutedBg = isDark ? "#262626" : "#f4f4f5";
  const labelColor = isDark ? "#52525b" : "#a1a1aa";

  return (
    <BlockCard isDark={isDark}>
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {/* Everything loud */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] uppercase tracking-[0.08em] font-medium" style={{ color: "#ef4444" }}>
            Every color screams
          </span>
          <div className="rounded-lg border p-3 flex flex-col gap-1.5 transition-colors duration-500" style={{ backgroundColor: cardBg, borderColor: borderCol }}>
            <div className="h-4 rounded" style={{ backgroundColor: "#ef4444" }} />
            <div className="h-4 rounded" style={{ backgroundColor: "#f59e0b" }} />
            <div className="h-4 rounded" style={{ backgroundColor: "#22c55e" }} />
            <div className="h-4 rounded" style={{ backgroundColor: "#3b82f6" }} />
            <div className="h-5 rounded mt-0.5" style={{ backgroundColor: "#8b5cf6" }} />
          </div>
          <span className="text-[10px] text-center transition-colors duration-500" style={{ color: labelColor }}>nothing stands out</span>
        </div>

        {/* One accent */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] uppercase tracking-[0.08em] font-medium" style={{ color: "#22c55e" }}>
            One accent
          </span>
          <div className="rounded-lg border p-3 flex flex-col gap-1.5 transition-colors duration-500" style={{ backgroundColor: cardBg, borderColor: borderCol }}>
            <div className="h-4 rounded transition-colors duration-500" style={{ backgroundColor: mutedBg }} />
            <div className="h-4 rounded transition-colors duration-500" style={{ backgroundColor: mutedBg }} />
            <div className="h-4 rounded transition-colors duration-500" style={{ backgroundColor: mutedBg }} />
            <div className="h-4 rounded transition-colors duration-500" style={{ backgroundColor: mutedBg }} />
            <motion.div
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
              className="h-5 rounded mt-0.5 cursor-pointer"
              style={{ backgroundColor: isDark ? "#818cf8" : "#4f46e5" }}
            />
          </div>
          <span className="text-[10px] text-center transition-colors duration-500" style={{ color: labelColor }}>your eye goes to the CTA</span>
        </div>
      </div>
    </BlockCard>
  );
}

/* ═══════════════════════════════════════════════════════════
   Registry — maps section IDs to their illustration
   ═══════════════════════════════════════════════════════════ */
const ILLUSTRATION_MAP: Record<string, React.FC<{ isDark: boolean }>> = {
  intro: WowDecayBlock,
  "semantic-satiation": NoveltyCurveBlock,
  "every-animation-has-a-cost": UIComparisonBlock,
  "novelty-is-like-salt": SaltAnalogyBlock,
  "why-familiarity-feels-good": LoginButtonBlock,
  "the-rule-of-thumb-you-should-follow": RuleOfThumbBlock,
  "color-theory": ColorTheoryBlock,
};

export function getIllustration(sectionId: string): React.FC<{ isDark: boolean }> | null {
  return ILLUSTRATION_MAP[sectionId] ?? null;
}
