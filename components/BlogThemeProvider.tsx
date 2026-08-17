"use client";

import { createContext, useContext } from "react";

/**
 * The blog is always a dark page to read on, whichever theme the rest of the
 * site is in — the same call the backdrop makes, which stays dark in both.
 *
 * It gets there by carrying its own `.dark` scope rather than by writing to
 * the document. An earlier version toggled the class on <html> directly and
 * stripped it again on unmount, which quietly reset the site's real theme
 * every time you left a post.
 */

type BlogTheme = "dark";

const BlogThemeContext = createContext<{ theme: BlogTheme }>({ theme: "dark" });

/** Kept for the reading-view pieces that style themselves from it. */
export function useBlogTheme() {
  return useContext(BlogThemeContext);
}

export function BlogThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <BlogThemeContext.Provider value={{ theme: "dark" }}>
      <div className="dark">
        {/* Painted across the whole viewport rather than only behind the
            article. The nav sits above this, so a background on the wrapper
            alone left a visible seam under it. */}
        <div aria-hidden className="fixed inset-0 -z-10 bg-[#0a0a0a]" />
        <div className="min-h-screen text-zinc-200">{children}</div>
      </div>
    </BlogThemeContext.Provider>
  );
}
