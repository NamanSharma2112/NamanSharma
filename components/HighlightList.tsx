"use client";

import React, { useRef, useState, useCallback } from "react";

/* ── Arrow SVG (external link icon ↗) ── */
function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-5 shrink-0"
    >
      <path d="M5 11 11 5" />
      <path d="M5.5 5H11v5.5" />
    </svg>
  );
}

/* ── "New" dot indicator ── */
function NewDot() {
  return (
    <span
      aria-hidden="true"
      className="mr-2 size-1.5 shrink-0 rounded-full"
      style={{
        background: "#2e90fa",
        boxShadow: "0 0 6px rgba(46,144,250,0.5)",
      }}
    />
  );
}

/* ── Types ── */
type ListItem = {
  label: string;
  description: string;
  href: string;
  external?: boolean;
  isNew?: boolean;
};

type Props = {
  title: string;
  items: ListItem[];
};

export default function HighlightList({ title, items }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [highlightStyle, setHighlightStyle] = useState({
    top: 0,
    height: 0,
    opacity: 0,
  });

  const onEnter = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    setHighlightStyle({
      top: rect.top - containerRect.top,
      height: rect.height,
      opacity: 1,
    });
  }, []);

  const onLeave = useCallback(() => {
    setHighlightStyle((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <section className="flex w-full max-w-[576px] flex-col gap-4">
      <p className="pb-2 text-black">{title}</p>
      <div className="h-px w-8 bg-[#e8e8e8]" />
      <div
        ref={containerRef}
        className="relative -mt-1 flex flex-col gap-1"
        onMouseLeave={onLeave}
      >
        {/* Animated highlight background */}
        <div
          ref={highlightRef}
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-3 z-0 rounded-xl"
          style={{
            background: "rgba(0,0,0,0.04)",
            top: highlightStyle.top,
            height: highlightStyle.height,
            opacity: highlightStyle.opacity,
            transition: "top 0.2s ease, height 0.2s ease, opacity 0.15s ease",
          }}
        />

        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            onMouseEnter={onEnter}
            className="relative z-10 -mx-3 flex w-[calc(100%+24px)] cursor-pointer items-center justify-between rounded-xl px-3 py-3 text-black outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black/15"
          >
            <span className="flex items-center gap-1">
              {item.isNew && <NewDot />}
              <span>{item.label}</span>
              {item.external && <ArrowIcon />}
            </span>
            <span className="text-[#8d8d8d]">{item.description}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
