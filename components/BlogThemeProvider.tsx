"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

type BlogTheme = "light" | "dark";

const BlogThemeContext = createContext<{
  theme: BlogTheme;
  toggle: () => void;
}>({
  theme: "light",
  toggle: () => {},
});

export function useBlogTheme() {
  return useContext(BlogThemeContext);
}

export function BlogThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<BlogTheme>("light");

  useEffect(() => {
    const saved = localStorage.getItem("blog-theme") as BlogTheme | null;
    if (saved) {
      setTheme(saved);
      // Sync with global dark class for PillNav
      if (saved === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const toggle = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("blog-theme", next);
      // Sync with global dark class for PillNav
      if (next === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  };

  // Restore global dark class on unmount (when leaving blog)
  useEffect(() => {
    return () => {
      // When leaving blog pages, remove the class so main site theme takes over
      document.documentElement.classList.remove("dark");
    };
  }, []);

  const isDark = theme === "dark";

  return (
    <BlogThemeContext.Provider value={{ theme, toggle }}>
      <div
        className="transition-colors duration-500 ease-in-out min-h-screen"
        style={{
          backgroundColor: isDark ? "#0a0a0a" : "#fafafa",
          color: isDark ? "#e4e4e7" : "#18181b",
        }}
      >
        {children}

        {/* Floating Dark Mode Toggle */}
        <button
          onClick={toggle}
          className={`fixed top-24 right-4 md:top-6 md:right-6 z-[60] w-10 h-10 flex items-center justify-center rounded-full shadow-md backdrop-blur-md border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isDark
              ? "bg-zinc-800/90 border-zinc-700 text-amber-400 hover:bg-zinc-700/90 focus:ring-amber-400"
              : "bg-white/80 border-zinc-200/60 text-zinc-600 hover:bg-zinc-50 focus:ring-black"
          }`}
          aria-label="Toggle dark mode"
          title="Toggle dark mode"
        >
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </BlogThemeContext.Provider>
  );
}
