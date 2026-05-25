"use client";

import { motion } from "motion/react";
import React from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const POSTS = [
  {
    id: 1,
    title: "Building Fluid Interfaces with Framer Motion",
    date: "May 24, 2026",
    excerpt: "Exploring advanced physics-based animations to create interfaces that feel truly alive and reactive to user input.",
    link: "#"
  },
  {
    id: 2,
    title: "The Art of Invisible Design",
    date: "April 12, 2026",
    excerpt: "Why the best UI decisions are often the ones users never actively notice, and how to achieve perfect visual balance.",
    link: "#"
  },
  {
    id: 3,
    title: "Design Engineering in the Era of AI",
    date: "March 05, 2026",
    excerpt: "How leveraging tools like Claude is fundamentally shifting the role of the modern design engineer.",
    link: "#"
  }
];

export default function BlogSection() {
  return (
    <section id="blog" className={`relative w-full py-32 flex flex-col items-center justify-center overflow-hidden bg-zinc-950 border-t border-white/5 ${inter.className}`}>
      
      {/* ── HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center z-10 mb-20 px-6"
      >
        <p className="text-zinc-500 font-medium tracking-[0.15em] uppercase text-xs mb-6">
          Writing
        </p>
        
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
          Thoughts on <br className="hidden md:block" />
          <span className="text-zinc-600">design & code</span>
        </h2>
      </motion.div>

      {/* ── BLOG LIST ── */}
      <div className="w-full max-w-[800px] px-6 flex flex-col gap-2 z-10">
        {POSTS.map((post, i) => (
          <motion.a
            href={post.link}
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group flex flex-col md:flex-row md:items-baseline justify-between gap-4 py-8 border-b border-white/5 hover:border-white/20 transition-colors duration-500"
          >
            <div className="flex flex-col gap-3 max-w-xl">
              <h3 className="text-xl md:text-2xl font-semibold text-zinc-100 group-hover:text-white transition-colors duration-300">
                {post.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed pr-4">
                {post.excerpt}
              </p>
            </div>
            <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 text-zinc-500 text-sm font-medium pt-2 md:pt-0">
              <span>{post.date}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-white hidden md:block">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
