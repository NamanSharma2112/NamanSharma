"use client";

import { motion } from "motion/react";
import Link from "next/link";
import PortfolioFooter from "@/components/PortfolioFooter";
import ComponentGrid from "@/components/ComponentGrid";
import type { ComponentShowcase } from "@/components/ComponentGrid";

import { COMPONENTS } from "@/components/componentsData";

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

export default function ComponentsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Main content */}
      <main className="relative max-w-[900px] mx-auto px-8 pt-14 pb-0 text-zinc-800 dark:text-zinc-200 leading-[1.7] antialiased border-l border-r border-dashed border-zinc-200 dark:border-zinc-800">
        {/* Header */}
        <header className="mb-10 animate-[fadeUp_0.7s_cubic-bezier(0.22,1,0.36,1)_0.05s_backwards]">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-base font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
              Components
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
            Copy-paste components for your next project. Built with React, Tailwind, and Motion.
          </p>
        </header>

        {/* Install note */}
        <div className="mb-10 p-4 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/50 animate-[fadeUp_0.7s_cubic-bezier(0.22,1,0.36,1)_0.1s_backwards]">
          <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">How to use:</span> Click a component to see the source code. Copy it into your project. Components are self-contained — no setup required beyond the listed dependencies.
          </p>
        </div>

        {/* Component grid */}
        <ComponentGrid title="All Components" components={COMPONENTS} />

        {/* Footer */}
        <PortfolioFooter links={FOOTER_LINKS} />
      </main>
    </motion.div>
  );
}
