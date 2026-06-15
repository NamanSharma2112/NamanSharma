"use client";

import Link from "next/link";
import { ALL_POSTS } from "@/lib/blog-data";
import { useBlogTheme } from "@/components/BlogThemeProvider";

export default function BlogIndexPage() {
  const { theme } = useBlogTheme();
  const isDark = theme === "dark";

  return (
    <div className="pt-32 pb-32">
      <div className="max-w-[600px] mx-auto px-6">
        <header className="mb-16">
          <h1
            className="text-3xl font-semibold tracking-tight mb-4 transition-colors duration-500"
            style={{ color: isDark ? "#fafafa" : "#18181b" }}
          >
            Writing
          </h1>
          <p
            className="text-[15px] transition-colors duration-500"
            style={{ color: isDark ? "#71717a" : "#71717a" }}
          >
            Thoughts on design engineering, micro-interactions, and building
            interfaces that feel alive.
          </p>
        </header>

        <div className="flex flex-col gap-10">
          {ALL_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <article>
                <p
                  className="text-[13px] mb-2 transition-colors duration-500"
                  style={{ color: isDark ? "#52525b" : "#a1a1aa" }}
                >
                  {post.date}
                </p>
                <h2
                  className="text-[18px] font-medium tracking-tight mb-2 transition-colors duration-500 group-hover:opacity-80"
                  style={{ color: isDark ? "#e4e4e7" : "#27272a" }}
                >
                  {post.title}
                </h2>
                <p
                  className="text-[14px] leading-relaxed line-clamp-2 transition-colors duration-500"
                  style={{ color: isDark ? "#71717a" : "#71717a" }}
                >
                  {post.content[0].paragraphs[0]}
                </p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
