"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { playToggle } from "@/lib/sounds";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => {
        setTheme(theme === "light" ? "dark" : "light");
        playToggle();
      }}
      className="flex size-9 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-black/5 hover:text-black dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
}
