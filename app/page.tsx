"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import BlurScramble from "@/components/BlurScramble";
import Banner from "@/components/Banner";
import PortfolioHeader from "@/components/PortfolioHeader";
import PortfolioBio from "@/components/PortfolioBio";
import { linkClass } from "@/components/PortfolioBio";
import SectionTable from "@/components/SectionTable";
import type { TableEntry } from "@/components/SectionTable";
import ProjectGrid from "@/components/ProjectGrid";
import type { ProjectCard } from "@/components/ProjectGrid";
import PortfolioFooter from "@/components/PortfolioFooter";
import WorkWithMe from "@/components/WorkWithMe";
import ComponentGrid from "@/components/ComponentGrid";
import { COMPONENTS } from "@/components/componentsData";

// ──────────────────────────────────────────────
// DATA — Edit these to personalise your portfolio
// ──────────────────────────────────────────────

const WRITING: TableEntry[] = [
  { year: 2026, title: "Building with Agentic AI", date: "27/04", badge: "New", href: "/blog/building-with-agentic-ai" },
  { year: 2026, title: "IoT Prototyping Notes", date: "16/04", href: "/blog/iot-prototyping-notes" },
  { year: 2026, title: "ML Pipelines in Production", date: "13/04", href: "/blog/ml-pipelines-in-production" },
  { year: 2025, title: "Design Systems at Scale", date: "15/09", href: "/blog/design-systems-at-scale" },
];

const PROJECTS: ProjectCard[] = [
  { year: 2026, title: "TruePass IoT", description: "Proximity-based attendance via BLE", badge: "New", accent: "#1c1917" },
  { year: 2026, title: "ML Price Forecaster", description: "Real-time commodity price prediction", accent: "#172554" },
  { year: 2026, title: "BunnyIcon Component", description: "Interactive SVG with cursor tracking", badge: "New", accent: "#1e1b4b" },
  { year: 2026, title: "Cognitive Training App", description: "Games for MCI elderly patients", accent: "#14532d" },
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

export default function Home() {
  const [loading, setLoading] = useState(true);

  const handleFinish = useCallback(() => {
    setLoading(false);
  }, []);

  const bio = [
    <>
      I&apos;m Naman, a Design Engineer. I design and build whatever I can
      imagine or get inspiration from social media like{" "}
      <a href="https://x.com/NamanSharma2112" target="_blank" rel="noopener noreferrer" className={linkClass}>
        X
      </a>
      .
    </>,
    <>
      If an idea pops into my head, I&apos;ll build it and ship it. My current
      main tech stack is{" "}
      <a href="https://react.dev" target="_blank" rel="noopener noreferrer" className={linkClass}>
        React
      </a>
      ,{" "}
      <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className={linkClass}>
        Next.js
      </a>
      , TypeScript,{" "}
      <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" className={linkClass}>
        Tailwind CSS
      </a>
      , and{" "}
      <a href="https://motion.dev" target="_blank" rel="noopener noreferrer" className={linkClass}>
        Motion.dev
      </a>
      .
    </>,
    <>
      I usually make any design idea in my mind and try to replicate its
      structure on{" "}
      <a href="https://excalidraw.com" target="_blank" rel="noopener noreferrer" className={linkClass}>
        ExcaliDraw
      </a>{" "}
      before I code it.
    </>,
    <>
      Aside from designing front-end, I also love designing Distributed Systems
      for fun and implementing some Research Papers.
    </>,
    <>
      You can find me on{" "}
      <a href="https://x.com/NamanSharma2112" target="_blank" rel="noopener noreferrer" className={linkClass}>
        X
      </a>
      ,{" "}
      <a href="https://github.com/NamanSharma2112" target="_blank" rel="noopener noreferrer" className={linkClass}>
        GitHub
      </a>
      , or reach me via{" "}
      <a href="mailto:namansharmans03@gmail.com" className={linkClass}>
        email
      </a>
      .
    </>,
  ];

  return (
    <>
      {/* ── Loading screen ── */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <BlurScramble text="NAMAN SHARMA" delay={300} onFinish={handleFinish} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Portfolio content ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Banner */}
        <Banner />

        {/* Main content */}
        <main className="relative max-w-[620px] mx-auto px-6 pt-5 pb-30 text-zinc-800 leading-[1.7] antialiased border-l border-r border-dashed border-zinc-200">
          <PortfolioHeader name="Naman Sharma" />
          <PortfolioBio paragraphs={bio} />
          <SectionTable title="Writing" entries={WRITING} />
          <ProjectGrid title="Projects" projects={PROJECTS} />
          <ComponentGrid title="Components" components={COMPONENTS} href="/components" />
          <WorkWithMe />
          <PortfolioFooter links={FOOTER_LINKS} />
        </main>
      </motion.div>
    </>
  );
}
