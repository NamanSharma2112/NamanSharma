"use client";

import { motion } from "motion/react";
import React from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const PROJECTS = [
  {
    id: 1,
    title: "MotionKit",
    description: "Collection of the most essential animations & transitions for web apps that you can just copy and paste into any project.",
    tags: ["Next.js", "Motion.dev", "Tailwind CSS"],
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop", 
    link: "https://motion-kit-three.vercel.app/"
  },
  {
    id: 2,
    title: "ChurnRate Dashboard",
    description: "A beautiful, responsive data dashboard for tracking SaaS subscription metrics including churn rate, revenue, and active customers.",
    tags: ["Next.js", "Recharts", "UI/UX"],
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop", 
    link: "https://www.churnrate.fun/"
  }
];

export default function Projects() {
  return (
    <section id="projects" className={`relative w-full py-32 md:py-48 flex flex-col items-center justify-center overflow-hidden custom-bg border-t border-white/5 ${inter.className}`}>
      
      {/* ── HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center z-10 mb-20 md:mb-28 px-6"
      >
        <p className="text-zinc-500 font-medium tracking-[0.15em] uppercase text-xs mb-6">
          Selected Work
        </p>
        
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
          Building digital <br className="hidden md:block" />
          <span className="text-zinc-600">experiences</span>
        </h2>
      </motion.div>

      {/* ── PROJECT GRID ── */}
      <div className="w-full max-w-[1000px] px-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 z-10">
        {PROJECTS.map((project, i) => (
          <motion.a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            key={project.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group flex flex-col gap-6"
          >
            {/* Image Container */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900 border border-white/5">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-105"
                style={{ backfaceVisibility: "hidden", transform: "translateZ(0)" }}
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
            </div>

            {/* Content Container */}
            <div className="flex flex-col flex-grow px-1">
              <h3 className="text-xl font-semibold text-zinc-100 group-hover:text-white transition-colors duration-300 flex items-center gap-2 mb-3">
                {project.title}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 text-zinc-400">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </h3>
              
              <p className="text-zinc-500 text-sm leading-relaxed mb-6 flex-grow pr-4">
                {project.description}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags.map(tag => (
                  <span 
                    key={tag}
                    className="px-3 py-1 bg-white/[0.02] border border-white/5 rounded-md text-[11px] font-medium tracking-wide text-zinc-400 transition-colors group-hover:bg-white/[0.04] group-hover:text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
