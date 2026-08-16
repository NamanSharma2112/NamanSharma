"use client";

import Link from "next/link";
import { ALL_POSTS } from "@/lib/blog-data";
import { useBlogTheme } from "@/components/BlogThemeProvider";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function BlogIndexPage() {
  const { theme } = useBlogTheme();
  const isDark = theme === "dark";

  return (
    <div className="pt-24 pb-32">
      <div className="max-w-[600px] mx-auto px-6">
        <header className="mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="text-[28px] font-semibold tracking-tight mb-3 transition-colors duration-500"
            style={{ color: isDark ? "#fafafa" : "#18181b" }}
          >
            Writing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="text-[15px] transition-colors duration-500"
            style={{ color: isDark ? "#71717a" : "#71717a" }}
          >
            Thoughts on design engineering, micro-interactions, and building
            interfaces that feel alive.
          </motion.p>
        </header>

        <div className="flex flex-col gap-2">
          {ALL_POSTS.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              // Emil: 30-80ms stagger delay
              transition={{ delay: 0.1 + i * 0.05, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              <Link href={`/blog/${post.slug}`} className="block outline-none group">
                <motion.article
                  // Emil: Buttons must feel responsive, subtle scale on active
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                  className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 p-4 -mx-4 rounded-xl transition-colors duration-200"
                  style={{
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDark
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(0,0,0,0.03)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <p
                    className="text-[13px] font-medium shrink-0 sm:w-24 transition-colors duration-500"
                    style={{ color: isDark ? "#52525b" : "#a1a1aa" }}
                  >
                    {post.date}
                  </p>
                  
                  <div className="flex-1 flex items-center justify-between gap-4">
                    <div>
                      <h2
                        className="text-[16px] font-medium tracking-tight mb-1 transition-colors duration-500"
                        style={{ color: isDark ? "#e4e4e7" : "#27272a" }}
                      >
                        {post.title}
                      </h2>
                      <p
                        className="text-[14px] leading-relaxed line-clamp-1 transition-colors duration-500"
                        style={{ color: isDark ? "#71717a" : "#71717a" }}
                      >
                        {post.content[0].paragraphs[0]}
                      </p>
                    </div>

                    <div
                      // Emil: Specify exact properties, use strong ease-out for entering
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 ease-[cubic-bezier(0.23,1,0.32,1)]"
                      style={{ 
                        color: isDark ? "#e4e4e7" : "#27272a",
                        transitionProperty: "opacity, transform",
                        transitionDuration: "250ms"
                      }}
                    >
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </motion.article>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
