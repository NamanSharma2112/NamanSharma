"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tag: string;
  accent: string;
}

export default function BlogCard({
  slug,
  title,
  excerpt,
  date,
  readTime,
  tag,
  accent,
}: BlogPost) {
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
      rotateX: ((y - centerY) / centerY) * -5,
      rotateY: ((x - centerX) / centerX) * 5,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <motion.div
      ref={ref}
      className="group cursor-pointer"
      style={{ perspective: "800px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/blog/${slug}`} className="no-underline block">
        <motion.div
          animate={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
          transition={{ type: "spring", stiffness: 300, damping: 20, mass: 0.5 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Cover area */}
          <div
            className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-zinc-200/60 flex items-end p-5 transition-shadow duration-300 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
            style={{
              background: `linear-gradient(135deg, ${accent} 0%, ${accent}dd 100%)`,
            }}
          >
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-[0.07]" style={{
              backgroundImage: `radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px), radial-gradient(circle at 50% 50%, white 1px, transparent 1px)`,
              backgroundSize: '60px 60px, 80px 80px, 40px 40px',
            }} />

            {/* Tag badge */}
            <span className="absolute top-3 left-3 inline-flex items-center text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-white/15 text-white/80 backdrop-blur-sm border border-white/10 tracking-wide uppercase">
              {tag}
            </span>

            {/* Title preview on cover */}
            <span className="relative z-10 text-white/50 text-[13px] font-mono tracking-wider leading-snug">
              {title}
            </span>
          </div>
        </motion.div>

        {/* Text content below the card */}
        <div className="mt-3 px-0.5">
          <h3 className="text-[15px] text-zinc-800 font-medium group-hover:text-black transition-colors duration-200 leading-snug">
            {title}
          </h3>
          <p className="text-[13px] text-zinc-400 mt-1.5 leading-relaxed line-clamp-2">
            {excerpt}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[12px] text-zinc-300 tabular-nums">{date}</span>
            <span className="text-zinc-200">·</span>
            <span className="text-[12px] text-zinc-300">{readTime}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
