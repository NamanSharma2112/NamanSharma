"use client";

import { motion } from "motion/react";
import React from "react";

// Helper components for logos
const ReactLogo = () => (
  <svg width="36" height="36" viewBox="-11.5 -10.23174 23 20.46348" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="0" cy="0" r="2.05" fill="#61DAFB"/>
    <g stroke="#61DAFB" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2"/>
      <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
      <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
    </g>
  </svg>
);

const NextLogo = () => (
  <svg width="32" height="32" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="90" cy="90" r="90" fill="white"/>
    <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="black"/>
    <path d="M115.265 54H127.38V114.733H115.265V54Z" fill="black"/>
  </svg>
);

const TypeScriptLogo = () => (
  <svg width="32" height="32" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="128" height="128" rx="8" fill="#3178C6"/>
    <path d="M57.5 70V54H32.5V44H88.5V54H63.5V86H57.5V70ZM99 87C95.6667 87 92.5 86.1667 89.5 84.5C86.5 82.8333 84.3333 80.6667 83 78L88 74.5C89 76.5 90.5 78 92.5 79C94.5 80 96.6667 80.5 99 80.5C101.333 80.5 103.167 80 104.5 79C105.833 78 106.5 76.6667 106.5 75C106.5 73.3333 105.833 72.1667 104.5 71.5C103.167 70.8333 100.833 70 97.5 69L93.5 67.5C89.5 66.1667 86.6667 64.5 85 62.5C83.3333 60.5 82.5 58 82.5 55C82.5 51.6667 83.6667 49 86 47C88.3333 45 91.5 44 95.5 44C99.5 44 102.833 44.8333 105.5 46.5C108.167 48.1667 110 50.3333 111 53L106.5 56.5C105.5 54.5 104 53 102 52C100 51 98 50.5 95.5 50.5C93.5 50.5 91.8333 51 90.5 52C89.1667 53 88.5 54 88.5 55.5C88.5 57 89.1667 58.1667 90.5 59C91.8333 59.8333 94.1667 60.6667 97.5 61.5L101.5 63C105.5 64.3333 108.333 66 110 68C111.6667 70 112.5 72.5 112.5 75.5C112.5 79.1667 111.167 82 108.5 84C105.833 86 102.667 87 99 87Z" fill="white"/>
  </svg>
);

const TailwindLogo = () => (
  <svg width="36" height="22" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M43.7 0C32.8 0 25 5.5 20.3 16.4C25 10.9 31.3 9.4 39.1 10.9C43.5 11.8 46.7 15 50.2 18.7C55.6 24.3 62 31.1 76.6 31.1C87.5 31.1 95.3 25.6 100 14.7C95.3 20.2 89.1 21.7 81.3 20.2C76.9 19.3 73.7 16.1 70.1 12.4C64.7 6.8 58.3 0 43.7 0ZM23.4 28.9C12.5 28.9 4.7 34.4 0 45.3C4.7 39.8 11 38.3 18.8 39.8C23.2 40.7 26.4 43.9 30 47.6C35.4 53.2 41.7 60 56.3 60C67.2 60 75 54.5 79.7 43.6C75 49.1 68.8 50.6 61 49.1C56.6 48.2 53.4 45 49.8 41.3C44.4 35.7 38.1 28.9 23.4 28.9Z" fill="#38B2AC"/>
  </svg>
);

const FramerMotionLogo = () => (
  <svg width="32" height="32" viewBox="0 0 14 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0H14V7H7L0 0Z" fill="#E11D48"/>
    <path d="M0 7H14V14H7L0 7Z" fill="#E11D48"/>
    <path d="M0 14H7V21L0 14Z" fill="#E11D48"/>
  </svg>
);

const ExcalidrawLogo = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#A8A5FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
  </svg>
);

const ClaudeLogo = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="#EAE5DF" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/>
  </svg>
);

const VercelLogo = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1L24 22H0L12 1Z"/>
  </svg>
);

// Map of floating items with their final coordinates (relative to center)
const ICONS = [
  // Top Left cluster
  { id: "react",  name: "React",       component: <ReactLogo />, x: -360, y: -180, delay: 0.1, size: 72 },
  { id: "ts",     name: "TypeScript",  component: <TypeScriptLogo />, x: -220, y: -280, delay: 0.25, size: 64 },
  
  // Top Right cluster
  { id: "next",   name: "Next.js",     component: <NextLogo />, x: 340, y: -230, delay: 0.15, size: 80 },
  { id: "claude", name: "Claude",      component: <ClaudeLogo />, x: 260, y: -100, delay: 0.35, size: 68 },
  
  // Bottom Left cluster
  { id: "framer", name: "Motion",      component: <FramerMotionLogo />, x: -300, y: 180, delay: 0.3, size: 68 },
  { id: "excali", name: "Excalidraw",  component: <ExcalidrawLogo />, x: -450, y: 20, delay: 0.45, size: 76 },
  
  // Bottom Right cluster
  { id: "tw",     name: "Tailwind CSS",component: <TailwindLogo />, x: 280, y: 180, delay: 0.2, size: 72 },
  { id: "vercel", name: "Vercel",      component: <VercelLogo />, x: 420, y: 60, delay: 0.5, size: 60 },
];

export default function TechStack() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden custom-bg border-t border-white/5">
      
      {/* ── CENTRAL TEXT BLOCK ── */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center z-10"
      >
        <p className="text-zinc-400 font-medium tracking-[0.2em] uppercase text-[11px] mb-8">
          The toolkit behind the craft
        </p>
        
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.05]">
          Modern stack <br />
          <span className="text-zinc-500">for rapid builds</span> <br />
          <span className="text-zinc-700">and smooth UX</span>
        </h2>
      </motion.div>

      {/* ── FLOATING ICONS ── */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {ICONS.map((item) => (
          <div
            key={item.id}
            className="absolute flex items-center justify-center"
            style={{ transform: `translate(${item.x}px, ${item.y}px)` }}
          >
            {/* Pop in animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -20 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                type: "spring",
                stiffness: 70,
                damping: 14,
                delay: item.delay,
              }}
            >
              {/* Continuous Float Animation (Applies to the whole box) */}
              <motion.div
                animate={{ 
                  y: [0, -8, 6, -4, 0],
                  x: [0, 5, -6, 4, 0],
                  rotate: [0, -5, 4, -3, 0]
                }}
                transition={{
                  duration: 8 + (item.delay * 8), // Deterministic pseudo-random duration
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.25, 0.5, 0.75, 1] // Ensure smooth loop over 5 keyframes
                }}
                className="flex items-center justify-center relative group cursor-crosshair pointer-events-auto transition-transform hover:scale-110"
                style={{
                  width: item.size,
                  height: item.size,
                  borderRadius: item.size * 0.3, // squirqle shape
                  background: "rgba(18, 18, 22, 0.75)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.05)",
                }}
              >
                {item.component}
                
                {/* Tooltip */}
                <div className="absolute -bottom-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none text-[11px] font-medium text-zinc-300 tracking-wider uppercase bg-black/90 border border-white/10 px-3 py-1.5 rounded-full whitespace-nowrap shadow-xl">
                  {item.name}
                </div>
              </motion.div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
