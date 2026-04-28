"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";

interface FooterLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

function TiltLink({ label, href }: FooterLink) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, scale: 1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    setTransform({ rotateX, rotateY, scale: 1.08 });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0, scale: 1 });
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target={href.startsWith("mailto") ? undefined : "_blank"}
      rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
      className="relative inline-flex items-center justify-center px-4 py-2 rounded-lg text-[13px] font-medium text-zinc-500 bg-zinc-50 border border-zinc-200/80 no-underline transition-shadow duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:text-zinc-800 hover:border-zinc-300"
      style={{
        perspective: "600px",
        transformStyle: "preserve-3d",
      }}
      animate={{
        rotateX: transform.rotateX,
        rotateY: transform.rotateY,
        scale: transform.scale,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20, mass: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Subtle shine overlay */}
      <span
        className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)",
          opacity: transform.scale > 1 ? 0.6 : 0,
        }}
      />
      <span className="relative z-10">{label}</span>
    </motion.a>
  );
}

export default function PortfolioFooter({ links }: { links: FooterLink[] }) {
  return (
    <footer className="relative mt-16 pt-6 border-t border-zinc-200 animate-[fadeIn_0.8s_ease_0.5s_backwards]">
      {/* White gradient mask fading out above footer */}
      <div
        className="pointer-events-none absolute left-0 right-0 -top-20 h-20"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,1) 100%)",
        }}
      />
      <div className="flex gap-3 flex-wrap" style={{ perspective: "800px" }}>
        {links.map((link) => (
          <TiltLink key={link.label} {...link} />
        ))}
      </div>
      <p className="mt-8 text-xs text-neutral-400 leading-relaxed italic">
        &ldquo;Wabi-sabi nurtures all that is authentic by acknowledging three simple realities: nothing lasts, nothing is finished, and nothing is perfect.&rdquo;
        <br />
        <span className="not-italic">— Richard R. Powell</span>
      </p>
      <p className="mt-4 text-[11px] text-zinc-400">
        Inspiration of design from{" "}
        <a href="https://benji.org/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-800 underline decoration-zinc-300 underline-offset-2 transition-colors">
          benji
        </a>{" "}
        and{" "}
        <a href="https://www.manuarora.in/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-800 underline decoration-zinc-300 underline-offset-2 transition-colors">
          manu arora
        </a>
      </p>
    </footer>
  );
}
