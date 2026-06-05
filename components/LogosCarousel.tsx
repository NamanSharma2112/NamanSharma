"use client";

import React from "react";
import { motion } from "motion/react";

export function LogosCarousel({
  className = "",
  children,
  count, // not used in this implementation but kept for prop compat
}: {
  className?: string;
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <div
      className={`relative flex overflow-hidden w-full ${className}`}
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
      }}
    >
      <motion.div
        className="flex min-w-full shrink-0 items-center gap-6 sm:gap-10"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ width: "fit-content" }}
      >
        {/* Double the children for seamless infinite scroll */}
        <div className="flex shrink-0 items-center gap-6 sm:gap-10 px-3 sm:px-5">
          {children}
        </div>
        <div className="flex shrink-0 items-center gap-6 sm:gap-10 px-3 sm:px-5">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
