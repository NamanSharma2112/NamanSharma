"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export default function DesktopIcon({
  id,
  label,
  icon,
  onDoubleClick,
  defaultPosition = { x: 0, y: 0 },
  constraintsRef,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  onDoubleClick: () => void;
  defaultPosition?: { x: number; y: number };
  constraintsRef?: React.RefObject<Element | null>;
}) {
  const [isSelected, setIsSelected] = useState(false);
  const iconRef = useRef<HTMLDivElement>(null);

  // Click outside to deselect
  useEffect(() => {
    if (!isSelected) return;
    const handleGlobalClick = (e: MouseEvent) => {
      if (iconRef.current && !iconRef.current.contains(e.target as Node)) {
        setIsSelected(false);
      }
    };
    // Delay adding the event listener so the initial click doesn't trigger it
    const t = setTimeout(() => {
      window.addEventListener("click", handleGlobalClick);
    }, 10);
    return () => {
      clearTimeout(t);
      window.removeEventListener("click", handleGlobalClick);
    };
  }, [isSelected]);

  return (
    <motion.div
      ref={iconRef}
      drag
      dragConstraints={constraintsRef}
      dragElastic={0}
      dragMomentum={false}
      initial={{ x: defaultPosition.x, y: defaultPosition.y }}
      onClick={() => setIsSelected(true)}
      onDoubleClick={onDoubleClick}
      className="absolute flex flex-col items-center justify-center gap-1 w-[80px] p-2 rounded-md cursor-default pointer-events-auto"
      style={{
        // We use absolute positioning inside the desktop wrapper
        top: 0,
        left: 0,
      }}
    >
      <div
        className={cn(
          "w-14 h-14 flex items-center justify-center rounded-lg transition-colors overflow-hidden",
          isSelected ? "bg-black/30 dark:bg-white/20" : "hover:bg-black/10 dark:hover:bg-white/10"
        )}
      >
        {icon}
      </div>
      <span
        className={cn(
          "text-[12px] font-medium tracking-tight text-center leading-tight line-clamp-2 px-1 rounded-sm shadow-sm",
          isSelected
            ? "bg-blue-500 text-white"
            : "text-zinc-800 bg-white/70 dark:text-zinc-100 dark:bg-black/50 backdrop-blur-md"
        )}
      >
        {label}
      </span>
    </motion.div>
  );
}
