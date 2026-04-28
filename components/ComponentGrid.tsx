"use client";

import { useState, useRef } from "react";
import { motion } from "motion/react";
import Link from "next/link";

export interface ComponentShowcase {
  name: string;
  slug: string;
  description: string;
  tag: string;
  preview: React.ReactNode;
  code: string;
  dependencies?: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium bg-zinc-900 text-zinc-100 hover:bg-zinc-800 transition-colors duration-200 cursor-pointer border-none"
    >
      {copied ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Copy code
        </>
      )}
    </button>
  );
}

function ComponentCardExpanded({
  component,
  onClose,
}: {
  component: ComponentShowcase;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mb-10"
    >
      {/* Back button */}
      <button
        onClick={onClose}
        className="inline-flex items-center gap-1.5 text-[13px] text-zinc-400 hover:text-zinc-700 transition-colors duration-200 mb-5 cursor-pointer bg-transparent border-none p-0"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back to all
      </button>

      {/* Component name + tag */}
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-[17px] font-semibold text-zinc-900">{component.name}</h3>
        <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full border border-zinc-200 text-zinc-500 bg-zinc-50 tracking-wide uppercase">
          {component.tag}
        </span>
      </div>
      <p className="text-[14px] text-zinc-500 mb-6 leading-relaxed">
        {component.description}
      </p>

      {/* Preview */}
      <div className="w-full rounded-xl border border-zinc-200/60 bg-zinc-50/50 p-8 flex items-center justify-center mb-5 min-h-[180px]">
        {component.preview}
      </div>

      {/* Dependencies */}
      {component.dependencies && (
        <div className="mb-4">
          <p className="text-[12px] text-zinc-400 mb-2 font-medium tracking-wide uppercase">
            Dependencies
          </p>
          <div className="flex items-center gap-2">
            <code className="text-[13px] text-zinc-600 bg-zinc-100 px-3 py-1.5 rounded-md font-mono">
              {component.dependencies}
            </code>
            <CopyButton text={component.dependencies} />
          </div>
        </div>
      )}

      {/* Code */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[12px] text-zinc-400 font-medium tracking-wide uppercase">
            Code
          </p>
          <CopyButton text={component.code} />
        </div>
        <div className="relative rounded-xl border border-zinc-200/60 bg-zinc-950 overflow-hidden">
          <pre className="p-5 whitespace-pre-wrap break-words text-[13px] leading-relaxed text-zinc-300 font-mono">
            <code>{component.code}</code>
          </pre>
        </div>
      </div>
    </motion.div>
  );
}

function ComponentCard({
  component,
  onClick,
}: {
  component: ComponentShowcase;
  onClick?: () => void;
}) {
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
      rotateX: ((y - centerY) / centerY) * -4,
      rotateY: ((x - centerX) / centerX) * 4,
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
      onClick={onClick}
    >
      <motion.div
        animate={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
        transition={{ type: "spring", stiffness: 300, damping: 20, mass: 0.5 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Preview area */}
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-zinc-200/60 bg-zinc-50/50 flex items-center justify-center transition-shadow duration-300 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          {component.preview}

          {/* Tag badge */}
          <span className="absolute top-3 right-3 inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full border border-zinc-200 text-zinc-500 bg-white tracking-wide uppercase">
            {component.tag}
          </span>
        </div>
      </motion.div>

      {/* Title row */}
      <div className="flex items-baseline justify-between mt-3 px-0.5">
        <span className="text-[14px] text-zinc-700 font-medium group-hover:text-black transition-colors duration-200">
          {component.name}
        </span>
      </div>
      <p className="text-[13px] text-zinc-400 mt-0.5 px-0.5 leading-snug line-clamp-2">
        {component.description}
      </p>
    </motion.div>
  );
}

export default function ComponentGrid({
  title,
  components,
  href,
}: {
  title: string;
  components: ComponentShowcase[];
  href?: string;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedComponent = components.find((c) => c.slug === selected);

  return (
    <section className="mb-14 animate-[fadeUp_0.7s_cubic-bezier(0.22,1,0.36,1)_0.15s_backwards]">
      <h2 className="mb-5 pb-4 border-b border-zinc-200 text-[13px] font-normal text-zinc-400 tracking-wide">
        {title}
      </h2>

      {selectedComponent && !href ? (
        <ComponentCardExpanded
          component={selectedComponent}
          onClose={() => setSelected(null)}
        />
      ) : (
        <div className="grid grid-cols-2 gap-5">
          {components.map((component) => {
            const card = (
              <ComponentCard
                key={component.slug}
                component={component}
                onClick={href ? undefined : () => setSelected(component.slug)}
              />
            );
            return href ? (
              <Link key={component.slug} href={href} className="no-underline block">
                {card}
              </Link>
            ) : (
              card
            );
          })}
        </div>
      )}
    </section>
  );
}
