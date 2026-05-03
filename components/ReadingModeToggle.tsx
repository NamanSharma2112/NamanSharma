"use client";

import { useTheme } from "next-themes";
import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function ReadingModeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8" />;
  }

  const isReading = theme === "reading";

  return (
    <button
      onClick={() => setTheme(isReading ? "light" : "reading")}
      className={cn(
        "relative w-8 h-8 flex items-center justify-center rounded-full transition-colors",
        isReading 
          ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100" 
          : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
      )}
      aria-label="Toggle reading mode"
      title="Toggle reading mode"
    >
      <BookOpen size={16} />
    </button>
  );
}
