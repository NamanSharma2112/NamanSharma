"use client";

import { Snowflake } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useSnow } from "@/lib/snow-context";
import { useEffect, useState } from "react";

export default function SnowToggle() {
  const { isSnowing, toggleSnow } = useSnow();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-8 h-8" />;

  return (
    <button
      onClick={toggleSnow}
      className="relative w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
      aria-label="Toggle snow effect"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isSnowing ? "snowing" : "no-snow"}
          initial={{ opacity: 0, scale: 0.8, rotate: -25 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.8, rotate: 25 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Snowflake 
            size={18} 
            className={isSnowing ? "text-blue-400 fill-blue-400/20" : "text-zinc-400"} 
          />
        </motion.div>
      </AnimatePresence>
      
      {/* Tooltip */}
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {isSnowing ? "Turn off snow" : "Turn on snow"}
      </span>
    </button>
  );
}
