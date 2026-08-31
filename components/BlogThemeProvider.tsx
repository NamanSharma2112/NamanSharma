"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useTheme } from "next-themes";

/**
 * The blog reads in whichever theme the rest of the site is in.
 *
 * It used to be dark unconditionally: it carried its own `.dark` scope and
 * painted a black sheet across the viewport, so a light site went black the
 * moment you opened a post and came back when you left. A theme the reader
 * picked should survive a navigation — that is the whole point of picking one.
 *
 * (An earlier version toggled the class on <html> directly and stripped it
 * again on unmount, which quietly reset the site's real theme every time you
 * left a post. The scope fixed that; inheriting fixes the scope.)
 *
 * The reading-view pieces — the contents pill, the speech control, the
 * illustrations — build their palettes in JS rather than from CSS, so they
 * take the resolved theme from here as a boolean.
 */

const BlogThemeContext = createContext({ isDark: false });

export function useBlogTheme() {
  return useContext(BlogThemeContext);
}

export function BlogThemeProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // The class on <html> is correct before first paint, but the hook that reads
  // it is not: on the server there is no theme to resolve. So anything driven
  // from JS waits one frame rather than rendering a value the server could
  // not have known and tripping hydration.
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <BlogThemeContext.Provider value={{ isDark }}>
      {/* Painted across the whole viewport rather than only behind the
          article. The nav sits above this, so a background on the wrapper
          alone left a visible seam under it. */}
      <div aria-hidden className="blog-ground fixed inset-0 -z-10" />
      <div className="min-h-screen text-zinc-800 dark:text-zinc-200">
        {children}
      </div>
    </BlogThemeContext.Provider>
  );
}
