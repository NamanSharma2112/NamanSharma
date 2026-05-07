"use client";

import { motion } from "motion/react";
import Link from "next/link";

import PortfolioFooter from "@/components/PortfolioFooter";
import BlogCard from "@/components/BlogCard";
import type { BlogPost } from "@/components/BlogCard";

// ──────────────────────────────────────────────
// DATA
// ──────────────────────────────────────────────

const BLOG_POSTS: BlogPost[] = [
  {
    slug: "npm-workspaces-guide",
    title: "A Guide to NPM Workspaces",
    excerpt:
      "Stop wasting time with npm link. Learn how workspaces can simplify your monorepo development and streamline dependency management.",
    date: "May 03, 2026",
    readTime: "3 min read",
    tag: "Engineering",
    accent: "#312e81",
  },
  {
    slug: "building-with-agentic-ai",
    title: "Building with Agentic AI",
    excerpt:
      "How I integrated AI coding assistants into my daily workflow and what I learned about the future of pair programming with machines.",
    date: "Apr 27, 2026",
    readTime: "6 min read",
    tag: "AI",
    accent: "#1e1b4b",
  },
  {
    slug: "iot-prototyping-notes",
    title: "IoT Prototyping Notes",
    excerpt:
      "Lessons from building TruePass — an ESP32-based proximity attendance system with Bluetooth beacons, Arduino, and lots of soldering.",
    date: "Apr 16, 2026",
    readTime: "8 min read",
    tag: "Hardware",
    accent: "#172554",
  },
  {
    slug: "ml-pipelines-in-production",
    title: "ML Pipelines in Production",
    excerpt:
      "Setting up a FastAPI backend for real-time commodity price prediction with automated weekly retraining — architecture, pitfalls, and wins.",
    date: "Apr 13, 2026",
    readTime: "10 min read",
    tag: "ML / Data",
    accent: "#14532d",
  },
  {
    slug: "design-systems-at-scale",
    title: "Design Systems at Scale",
    excerpt:
      "How I built a component library with motion, variants, and semantic tokens that scales from side project to production app.",
    date: "Sep 15, 2025",
    readTime: "7 min read",
    tag: "Design",
    accent: "#44403c",
  },
  {
    slug: "cursor-tracking-svg-animations",
    title: "Cursor-Tracking SVG Animations",
    excerpt:
      "A deep dive into building the BunnyIcon component — mouse-following pupils, state machines, and spring physics in React.",
    date: "Apr 27, 2026",
    readTime: "5 min read",
    tag: "Creative Dev",
    accent: "#581c87",
  },
  {
    slug: "distributed-systems-for-fun",
    title: "Distributed Systems for Fun",
    excerpt:
      "My notes on implementing Raft consensus, consistent hashing, and other research papers on weekends — because why not.",
    date: "Mar 02, 2026",
    readTime: "12 min read",
    tag: "Systems",
    accent: "#1c1917",
  },
];

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

export default function BlogPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Main content */}
      <main className="relative max-w-[900px] mx-auto px-8 pt-14 pb-30 text-zinc-800 leading-[1.7] antialiased border-l border-r border-dashed border-zinc-200">
        {/* Header */}
        <header className="mb-10 animate-[fadeUp_0.7s_cubic-bezier(0.22,1,0.36,1)_0.05s_backwards]">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-base font-medium tracking-tight text-zinc-900">
              Blog
            </h1>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[13px] text-zinc-400 hover:text-zinc-700 transition-colors duration-200 no-underline"
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
              >
                <path d="M19 12H5" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back home
            </Link>
          </div>
          <p className="text-[13px] text-zinc-400 font-normal">
            Thoughts on design engineering, systems, and building things.
          </p>
        </header>

        {/* Blog posts grid */}
        <section className="mb-14 animate-[fadeUp_0.7s_cubic-bezier(0.22,1,0.36,1)_0.15s_backwards]">
          <h2 className="mb-5 pb-4 border-b border-zinc-200 text-[13px] font-normal text-zinc-400 tracking-wide">
            All Posts
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {BLOG_POSTS.map((post) => (
              <BlogCard key={post.slug} {...post} />
            ))}
          </div>
        </section>

        {/* Footer */}
        <PortfolioFooter links={FOOTER_LINKS} />
      </main>
    </motion.div>
  );
}
