"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8" />;
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";

    if (!document.startViewTransition) {
      setTheme(next);
      return;
    }

    document.startViewTransition(() => {
      setTheme(next);
    });

    // Animate the new snapshot with a clip-path wipe from top
    document.documentElement.animate(
      { clipPath: ["inset(0 0 100% 0)", "inset(0)"] },
      {
        duration: 600,
        easing: "cubic-bezier(0.22,1,0.36,1)",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isDark ? "dark" : "light"}
          initial={{ opacity: 0, filter: "blur(4px)", scale: 0.8, rotate: -25 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1, rotate: 0 }}
          exit={{ opacity: 0, filter: "blur(4px)", scale: 0.8, rotate: 25 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center text-zinc-600 dark:text-zinc-400"
        >
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
