"use client";

import { use } from "react";
import { motion } from "motion/react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import PortfolioFooter from "@/components/PortfolioFooter";
import ScrollPlant from "@/components/ScrollPlant";
import ReadingModeToggle from "@/components/ReadingModeToggle";

// ──────────────────────────────────────────────
// BLOG CONTENT DATA
// ──────────────────────────────────────────────

import { POSTS } from "../data";

const FOOTER_LINKS = [
  { label: "Components", href: "/components" },
  { label: "GitHub", href: "https://github.com/NamanSharma2112" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/namansharma--ns/" },
  { label: "X (Twitter)", href: "https://x.com/NamanSharma2112" },
  { label: "Email", href: "mailto:namansharmans03@gmail.com" },
];

// ──────────────────────────────────────────────
// PAGE
// ──────────────────────────────────────────────

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const post = POSTS[slug];

  if (!post) {
    notFound();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Scroll-driven plant decoration */}
      <ScrollPlant />
      {/* Main content */}
      <main className="relative max-w-[620px] mx-auto px-6 pt-14 pb-0 text-zinc-800 dark:text-zinc-200 leading-[1.7] antialiased border-l border-r border-dashed border-zinc-200 dark:border-zinc-800">
        {/* Navigation */}
        <nav className="mb-8 flex items-center justify-between animate-[fadeUp_0.7s_cubic-bezier(0.22,1,0.36,1)_0.05s_backwards]">
          <div className="flex items-center gap-3 text-[13px] text-zinc-400">
            <Link
              href="/"
              className="hover:text-zinc-700 transition-colors duration-200 no-underline text-zinc-400"
            >
              Home
            </Link>
            <span className="text-zinc-200">/</span>
            <Link
              href="/blog"
              className="hover:text-zinc-700 transition-colors duration-200 no-underline text-zinc-400"
            >
              Blog
            </Link>
            <span className="text-zinc-200">/</span>
            <span className="text-zinc-600 truncate">{post.title}</span>
          </div>
          <ReadingModeToggle />
        </nav>

        {/* Article header */}
        <header className="mb-10 animate-[fadeUp_0.7s_cubic-bezier(0.22,1,0.36,1)_0.1s_backwards]">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 tracking-wide uppercase">
              {post.tag}
            </span>
            <span className="text-zinc-200">·</span>
            <span className="text-[12px] text-zinc-400 tabular-nums">
              {post.date}
            </span>
            <span className="text-zinc-200">·</span>
            <span className="text-[12px] text-zinc-400">{post.readTime}</span>
          </div>
          <h1 className="text-[22px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 leading-snug">
            {post.title}
          </h1>
        </header>

        {/* Cover image */}
        {post.image ? (
          <div className="w-full aspect-[16/9] rounded-xl mb-10 animate-[fadeUp_0.7s_cubic-bezier(0.22,1,0.36,1)_0.15s_backwards] overflow-hidden border border-zinc-200 dark:border-zinc-800 relative">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : (
          <div
            className="w-full aspect-[2/1] rounded-xl mb-10 animate-[fadeUp_0.7s_cubic-bezier(0.22,1,0.36,1)_0.15s_backwards] overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${post.accent} 0%, ${post.accent}cc 50%, ${post.accent}88 100%)`,
            }}
          >
            <div className="w-full h-full flex items-center justify-center opacity-[0.12]">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `radial-gradient(circle at 25% 75%, white 2px, transparent 2px), radial-gradient(circle at 75% 25%, white 2px, transparent 2px), radial-gradient(circle at 50% 50%, white 1.5px, transparent 1.5px)`,
                  backgroundSize: "80px 80px, 100px 100px, 50px 50px",
                }}
              />
            </div>
          </div>
        )}

        {/* Article content */}
        <article className="mb-14 animate-[fadeUp_0.7s_cubic-bezier(0.22,1,0.36,1)_0.2s_backwards]">
          {post.content.map((paragraph, i) => (
            <p
              key={i}
              className="text-[15px] text-zinc-600 dark:text-zinc-400 mb-5 last:mb-0 leading-[1.8]"
            >
              {paragraph}
            </p>
          ))}
        </article>

        {/* Divider + back link */}
        <section className="mb-14 animate-[fadeUp_0.7s_cubic-bezier(0.22,1,0.36,1)_0.25s_backwards]">
          <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-[14px] text-zinc-500 hover:text-zinc-800 transition-colors duration-200 no-underline group"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
              >
                <path d="M19 12H5" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              All posts
            </Link>
          </div>
        </section>

        {/* Footer */}
        <PortfolioFooter links={FOOTER_LINKS} />
      </main>
    </motion.div>
  );
}
