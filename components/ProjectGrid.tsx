"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";

export interface ProjectCard {
  title: string;
  year: number;
  description?: string;
  href?: string;
  badge?: string;
  /** Accent color for the placeholder card bg */
  accent?: string;
}

function Card({ title, year, description, href, badge, accent = "#18181b" }: ProjectCard) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

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
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
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
            className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-zinc-200/60 flex items-center justify-center transition-shadow duration-300 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
            style={{ background: accent }}
          >
            {/* Decorative content inside the card */}
            <div className="flex flex-col items-center gap-2 opacity-40">
              <div className="w-10 h-10 rounded-lg border border-white/20 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <span className="text-white/30 text-xs font-mono tracking-wider uppercase">{title}</span>
            </div>

            {/* Badge */}
            {badge && (
              <span className="absolute top-3 right-3 inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full border border-pink-200 text-pink-500 bg-pink-50 tracking-wide">
                {badge}
              </span>
            )}
          </div>
        </motion.div>

        {/* Title row below the card */}
        <div className="flex items-baseline justify-between mt-3 px-0.5">
          <span className="text-[14px] text-zinc-700 font-medium group-hover:text-black transition-colors duration-200">
            {title}
          </span>
          <span className="text-[13px] text-zinc-400 tabular-nums">{year}</span>
        </div>
        {description && (
          <p className="text-[13px] text-zinc-400 mt-0.5 px-0.5 leading-snug">{description}</p>
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
      <h2 className="mb-5 pb-4 border-b border-zinc-200 text-[13px] font-normal text-zinc-400 tracking-wide">
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
