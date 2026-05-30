"use client";

import React from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

export default function ScrollIndicator() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="fixed inset-0 pointer-events-none hidden md:block z-50">
      <Bars scrollProgress={scrollYProgress} />
    </div>
  );
}

const Bars = ({ scrollProgress }: { scrollProgress: MotionValue<number> }) => {
  const bars = Array.from({ length: 50 }, (_, index) => index);

  return (
   <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-3">
      {bars.map((_, idx) => (
        <Bar
          key={`bar-${idx}`}
          index={idx}
          total={bars.length}
          scrollProgress={scrollProgress}
          isLarger={idx % 5 === 0}
        />
      ))}
    </div>
  );
};

type BarProps = {
  index: number;
  total: number;
  scrollProgress: MotionValue<number>;
  isLarger?: boolean;
};

const Bar = ({ index, total, scrollProgress, isLarger }: BarProps) => {
  const activeAmount = useTransform(scrollProgress, (v) => {
    const activeIndex = v * (total - 1);
    const distance = Math.abs(index - activeIndex);
    return Math.max(0, 1 - distance / 4);
  });

  const width = useTransform(activeAmount, [0, 1], [40, 160]);
  const opacity = useTransform(activeAmount, [0, 1], [0.5, 1]);
  const scaleY = useTransform(activeAmount, [0, 1], [1, 2]);

  const boxShadow = useTransform(
    activeAmount,
    [0, 1],
    [
      "0px 0px 0px rgba(0,0,0,0)",
      "0px 0px 10px rgba(0,0,0,0.35)",
    ]
  );

  const cn = (...classes: (string | false | undefined)[]) =>
    classes.filter(Boolean).join(" ");

  return (
    <motion.div
      style={{
        width,
        opacity,
        scaleY,
        boxShadow,
      }}
      className={cn(
        "h-px origin-left bg-neutral-400",
        isLarger && "bg-neutral-600"
      )}
    />
  );
}
