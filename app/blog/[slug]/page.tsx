"use client";

import { use } from "react";
import { motion } from "motion/react";
import { notFound } from "next/navigation";
import Link from "next/link";

import PortfolioFooter from "@/components/PortfolioFooter";
import ScrollPlant from "@/components/ScrollPlant";

// ──────────────────────────────────────────────
// BLOG CONTENT DATA
// ──────────────────────────────────────────────

interface BlogPostData {
  title: string;
  date: string;
  readTime: string;
  tag: string;
  accent: string;
  content: string[];
}

const POSTS: Record<string, BlogPostData> = {
  "building-with-agentic-ai": {
    title: "Building with Agentic AI",
    date: "Apr 27, 2026",
    readTime: "6 min read",
    tag: "AI",
    accent: "#1e1b4b",
    content: [
      "The way we write software is changing — not incrementally, but fundamentally. Over the past few months, I've been integrating agentic AI coding assistants into every part of my workflow, and the experience has been both exhilarating and humbling.",
      "The key insight isn't that AI can write code. It's that AI can reason about architecture, identify edge cases you missed, and propose solutions that feel like they came from a senior engineer who happens to have read every Stack Overflow answer ever written.",
      "My typical workflow now looks like this: I sketch a rough idea in Excalidraw, describe the intent to the AI, review its proposed architecture, iterate on the implementation together, and ship. What used to take a weekend now takes an afternoon.",
      "But it's not all smooth sailing. The AI occasionally hallucinates API surfaces, suggests deprecated patterns, or over-engineers simple problems. The skill isn't in blindly accepting suggestions — it's in knowing when to trust, when to verify, and when to override.",
      "I've found the sweet spot is treating the AI as a brilliant but sometimes overconfident junior developer. Give it clear context, review its work carefully, and you'll be amazed at what you can build together.",
      "The future of programming isn't AI replacing developers. It's developers with AI outpacing developers without it. And honestly? The gap is already widening.",
    ],
  },
  "iot-prototyping-notes": {
    title: "IoT Prototyping Notes",
    date: "Apr 16, 2026",
    readTime: "8 min read",
    tag: "Hardware",
    accent: "#172554",
    content: [
      "TruePass started as a simple idea: what if you could track attendance just by walking into a room? No QR codes, no fingerprint scanners, no tapping cards. Just proximity.",
      "The architecture is straightforward on paper. An ESP32 acts as a BLE beacon on each 'ID card.' An Arduino central unit with an HC-05 Bluetooth module detects nearby beacons. When a registered beacon enters range, attendance is logged and confirmed with an LED and buzzer.",
      "Reality, of course, is messier than paper. BLE signal strength is noisy. Walls, bodies, and even humidity affect RSSI readings. I spent two weeks tuning the distance threshold and adding a rolling average filter before it felt reliable.",
      "The LCD display was another adventure. I went with a standard 16x2 parallel LCD because I had one lying around. Wiring 12 connections to an already-crowded breadboard required surgical precision and a lot of patience.",
      "The emergency SOS feature was a late addition but turned out to be the most impactful. A long press on the ESP32's button sends a priority BLE advertisement that the central unit picks up immediately, triggering a distinct buzzer pattern and an alert to the admin dashboard.",
      "The biggest lesson from this project: hardware prototyping is 20% building the thing and 80% debugging why the thing doesn't work the way it should. But when it finally clicks — literally — there's nothing quite like it.",
    ],
  },
  "ml-pipelines-in-production": {
    title: "ML Pipelines in Production",
    date: "Apr 13, 2026",
    readTime: "10 min read",
    tag: "ML / Data",
    accent: "#14532d",
    content: [
      "Taking a Jupyter notebook model to production is one of those tasks that sounds simple and turns out to be surprisingly deep. Here's what I learned deploying a commodity price forecasting model as a FastAPI service.",
      "The data pipeline fetches from four sources: EIA for energy data, FRED for economic indicators, yfinance for market prices, and NewsAPI for sentiment signals. Each source has its own rate limits, authentication quirks, and failure modes. I built an abstract DataSource class with retry logic and circuit breakers.",
      "The model itself is an ensemble of XGBoost and a simple LSTM. XGBoost handles the tabular features well, while the LSTM captures temporal patterns in the price history. Predictions are blended with learned weights that get updated during retraining.",
      "Automated weekly retraining was the trickiest part. I set up a cron job that pulls fresh data, validates it against a quality schema, retrains the model, runs it against a holdout set, and only promotes it to production if it beats the current model's MAE by at least 2%.",
      "Serving predictions via FastAPI with Pydantic models for request/response validation was surprisingly pleasant. I added a /health endpoint, request logging with correlation IDs, and a simple in-memory cache for repeated queries.",
      "The whole thing runs on a single $20/month VPS. No Kubernetes, no Spark, no 'enterprise ML platform.' Sometimes the simplest architecture is the right one.",
      "If I were to do it again, I'd add feature stores and experiment tracking from the start. But for a v1 that's been running reliably for months, I'm happy with the tradeoffs.",
    ],
  },
  "design-systems-at-scale": {
    title: "Design Systems at Scale",
    date: "Sep 15, 2025",
    readTime: "7 min read",
    tag: "Design",
    accent: "#44403c",
    content: [
      "A design system isn't a component library. It's a shared language between designers and developers, encoded in tokens, patterns, and conventions that make consistency the path of least resistance.",
      "I started by defining semantic tokens: not 'blue-500' but 'color-primary.' Not '16px' but 'spacing-md.' This abstraction layer means you can reskin the entire app by changing a handful of values.",
      "Component architecture follows a strict hierarchy: primitives (Button, Input, Text), composites (SearchBar, Card), and patterns (PageLayout, SectionTable). Each level can only import from the levels below it.",
      "Motion is a first-class citizen. Every interactive component has defined enter, exit, and hover animations using Motion.dev. Spring physics with consistent stiffness and damping values give the whole system a cohesive feel.",
      "The hardest part isn't building the system — it's getting people to use it. Documentation, live examples, and a Storybook-like playground are essential. If it's easier to write custom CSS than to use a token, your system has failed.",
      "After six months of iteration, the system now powers three different apps with zero custom CSS overrides. That's the real measure of success.",
    ],
  },
  "cursor-tracking-svg-animations": {
    title: "Cursor-Tracking SVG Animations",
    date: "Apr 27, 2026",
    readTime: "5 min read",
    tag: "Creative Dev",
    accent: "#581c87",
    content: [
      "The BunnyIcon started as a joke. I wanted a fun little avatar for my portfolio header. It ended up being one of the most technically interesting components I've built.",
      "The core mechanic is simple: track the mouse position relative to the SVG, map it to pupil coordinates, and animate with spring physics. The devil, as always, is in the details.",
      "The state machine has three states: sleeping (eyes closed, gentle breathing animation), awake (pupils tracking the cursor), and surprised (wide eyes when the cursor moves too fast). Transitions between states use Motion.dev's AnimatePresence for smooth SVG morphing.",
      "Time-based behavior adds personality. If you don't move the mouse for 5 seconds, the bunny yawns and falls asleep. Move it suddenly and it startles awake. These small touches make it feel alive rather than mechanical.",
      "The trickiest part was calculating pupil positions correctly. You need to convert screen coordinates to SVG-local coordinates, account for the eye socket boundaries, and clamp the pupil position so it doesn't clip outside the eye. I ended up using atan2 for angle and a clamped radius for distance.",
      "Performance-wise, I use requestAnimationFrame for the cursor tracking and let Motion handle the spring interpolation. The component renders at 60fps with minimal CPU usage even on mobile devices.",
    ],
  },
  "distributed-systems-for-fun": {
    title: "Distributed Systems for Fun",
    date: "Mar 02, 2026",
    readTime: "12 min read",
    tag: "Systems",
    accent: "#1c1917",
    content: [
      "There's a particular joy in implementing a consensus algorithm on a Saturday morning with a cup of coffee. No deadlines, no production pressure — just you, a research paper, and the fundamental problem of getting machines to agree on things.",
      "I started with Raft because it was designed to be understandable. The paper is remarkably well-written, and there are excellent visualizations online. My implementation in Go handles leader election, log replication, and membership changes.",
      "Consistent hashing was next. The concept is elegant: hash both keys and nodes onto a ring, and each key is handled by the next node clockwise. Adding or removing nodes only requires moving a fraction of the keys. I added virtual nodes for better load distribution.",
      "The most mind-bending implementation was vector clocks. The idea that you can track causality across distributed nodes with just arrays of integers feels like magic. My implementation handles concurrent events, merging, and conflict detection.",
      "Testing distributed systems is its own challenge. You need to simulate network partitions, message delays, and node failures. I built a tiny framework that lets me inject faults deterministically and verify invariants after each step.",
      "None of this code will ever run in production. And that's fine. The point is understanding the ideas deeply enough that when I do encounter these problems professionally, I'll have intuition for the tradeoffs.",
      "My reading list for anyone interested: 'Designing Data-Intensive Applications' by Kleppmann, the Raft paper by Ongaro and Ousterhout, and Lamport's 'Time, Clocks, and the Ordering of Events.'",
    ],
  },
};

const FOOTER_LINKS = [
  { label: "Components", href: "/components" },
  { label: "GitHub", href: "https://github.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "X (Twitter)", href: "https://x.com" },
  { label: "Email", href: "mailto:naman@example.com" },
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
      <main className="relative max-w-[620px] mx-auto px-6 pt-14 pb-30 text-zinc-800 leading-[1.7] antialiased border-l border-r border-dashed border-zinc-200">
        {/* Navigation */}
        <nav className="mb-8 animate-[fadeUp_0.7s_cubic-bezier(0.22,1,0.36,1)_0.05s_backwards]">
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
        </nav>

        {/* Article header */}
        <header className="mb-10 animate-[fadeUp_0.7s_cubic-bezier(0.22,1,0.36,1)_0.1s_backwards]">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-zinc-200 text-zinc-500 bg-zinc-50 tracking-wide uppercase">
              {post.tag}
            </span>
            <span className="text-zinc-200">·</span>
            <span className="text-[12px] text-zinc-400 tabular-nums">
              {post.date}
            </span>
            <span className="text-zinc-200">·</span>
            <span className="text-[12px] text-zinc-400">{post.readTime}</span>
          </div>
          <h1 className="text-[22px] font-semibold tracking-tight text-zinc-900 leading-snug">
            {post.title}
          </h1>
        </header>

        {/* Cover image */}
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

        {/* Article content */}
        <article className="mb-14 animate-[fadeUp_0.7s_cubic-bezier(0.22,1,0.36,1)_0.2s_backwards]">
          {post.content.map((paragraph, i) => (
            <p
              key={i}
              className="text-[15px] text-zinc-600 mb-5 last:mb-0 leading-[1.8]"
            >
              {paragraph}
            </p>
          ))}
        </article>

        {/* Divider + back link */}
        <section className="mb-14 animate-[fadeUp_0.7s_cubic-bezier(0.22,1,0.36,1)_0.25s_backwards]">
          <div className="pt-6 border-t border-zinc-200">
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
