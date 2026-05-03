"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";

export interface ProjectCard {
  title: string;
  year: number;
  description?: string;
  href?: string;
  badge?: string;
  image?: string;
  /** Accent color for the placeholder card bg */
  accent?: string;
}

function Card({ title, year, description, href, badge, image, accent = "#18181b" }: ProjectCard) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setTilt({
      rotateX: ((y - centerY) / centerY) * -6,
      rotateY: ((x - centerX) / centerX) * 6,
    });
    setSpotlight({ x, y });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setIsHovered(false);
  };

  const Wrapper = href ? "a" : "div";
  const linkProps = href
    ? { href, target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <motion.div
      ref={ref}
      className="group cursor-pointer"
      style={{ perspective: "800px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Wrapper {...linkProps} className="no-underline block">
        <motion.div
          animate={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
          transition={{ type: "spring", stiffness: 300, damping: 20, mass: 0.5 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Card preview area */}
          <div
            className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:group-hover:shadow-[0_20px_50px_rgba(255,255,255,0.04)]"
            style={{ background: image ? "transparent" : accent }}
          >
            {image ? (
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              /* Decorative content inside the card */
              <div className="flex flex-col items-center gap-2 opacity-40">
                <div className="w-10 h-10 rounded-lg border border-white/20 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <span className="text-white/30 text-xs font-mono tracking-wider uppercase">{title}</span>
              </div>
            )}

            {/* Spotlight Shine Effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at ${spotlight.x}px ${spotlight.y}px, rgba(255,255,255,0.15) 0%, transparent 80%)`,
              }}
            />

            {/* Subtle Inner Glow Border on Hover */}
            <div className="absolute inset-0 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Badge */}
            {badge && (
              <span className="absolute top-3 right-3 inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full border border-pink-200 dark:border-pink-500/30 text-pink-500 dark:text-pink-400 bg-pink-50 dark:bg-pink-500/10 tracking-wide z-10">
                {badge}
              </span>
            )}
          </div>
        </motion.div>

        {/* Title row below the card */}
        <div className="flex items-baseline justify-between mt-3 px-0.5 transition-transform duration-300 group-hover:translate-x-1">
          <span className="text-[14px] text-zinc-700 dark:text-zinc-300 font-medium group-hover:text-black dark:group-hover:text-white transition-colors duration-200">
            {title}
          </span>
          <span className="text-[13px] text-zinc-400 dark:text-zinc-500 tabular-nums">{year}</span>
        </div>
        {description && (
          <p className="text-[13px] text-zinc-400 dark:text-zinc-500 mt-0.5 px-0.5 leading-snug transition-transform duration-300 group-hover:translate-x-1">{description}</p>
        )}
      </Wrapper>
    </motion.div>
  );
}

export default function ProjectGrid({
  title,
  projects,
}: {
  title: string;
  projects: ProjectCard[];
}) {
  return (
    <section className="mb-14 animate-[fadeUp_0.7s_cubic-bezier(0.22,1,0.36,1)_backwards]">
      <h2 className="mb-5 pb-4 border-b border-zinc-200 dark:border-zinc-800 text-[13px] font-normal text-zinc-400 dark:text-zinc-500 tracking-wide">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-5">
        {projects.map((project) => (
          <Card key={project.title} {...project} />
        ))}
      </div>
    </section>
  );
}
