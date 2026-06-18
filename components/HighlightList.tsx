"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useSpring } from "motion/react";

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
type Card = {
  src: string;
  alt: string;
  dx: number;
  r: number;
};

type ListItem = {
  label: string;
  description: string;
  href: string;
  external?: boolean;
  isNew?: boolean;
  cards?: Card[];
};

type Props = {
  title: string;
  items: ListItem[];
};

export default function HighlightList({ title, items }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCards, setActiveCards] = useState<Card[] | null>(null);

  /* Spring-based cursor tracking */
  const springConfig = { stiffness: 180, damping: 22 };
  const cardX = useSpring(0, springConfig);
  const cardY = useSpring(0, springConfig);

  const onEnter = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, cards?: Card[]) => {
      const container = containerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      
      if (cards && cards.length > 0) {
        setActiveCards(cards);
        cardX.set(e.clientX - containerRect.left);
        cardY.set(e.clientY - containerRect.top);
      } else {
        setActiveCards(null);
      }
    },
    [cardX, cardY]
  );

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!activeCards || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      cardX.set(e.clientX - containerRect.left);
      cardY.set(e.clientY - containerRect.top);
    },
    [activeCards, cardX, cardY]
  );

  const onLeave = useCallback(() => {
    setActiveCards(null);
  }, []);

  return (
    <section className="flex w-full max-w-[576px] flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="font-medium text-zinc-900 dark:text-zinc-100">{title}</p>
        <div className="h-px w-8 bg-zinc-200 dark:bg-zinc-800" />
      </div>
      
      <div
        ref={containerRef}
        className="relative flex flex-col gap-2"
        onMouseLeave={onLeave}
        onMouseMove={onMove}
      >
        {/* Cursor-following preview card */}
        <AnimatePresence>
          {activeCards && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 15 }}
              transition={{
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1], // Custom smooth ease
              }}
              className="pointer-events-none absolute left-0 top-0 z-50"
              style={{ x: cardX, y: cardY }}
            >
              {/* Offset so card appears above-right of cursor */}
              <div className="relative" style={{ transform: "translate(20px, -110%)" }}>
                <div className="flex gap-[-12px]">
                  {activeCards.map((card, i) => (
                    <div
                      key={i}
                      className="rounded-xl overflow-hidden border-2 border-white shadow-xl bg-white"
                      style={{
                        width: 140,
                        height: 170,
                        transform: `rotate(${card.r}deg) translateX(${card.dx}px)`,
                        transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <img
                        src={card.src}
                        alt={card.alt}
                        width={140}
                        height={170}
                        className="h-full w-full object-cover"
                        loading="eager"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            onMouseEnter={(e) => onEnter(e, item.cards)}
            className="group relative flex w-full cursor-pointer items-center justify-between rounded-2xl border border-transparent px-4 py-3.5 transition-all duration-300 hover:bg-white dark:hover:bg-zinc-800/50 hover:shadow-sm hover:border-zinc-200/60 dark:hover:border-zinc-700/50"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                {item.isNew && <NewDot />}
                {item.label}
              </span>
              <span className="hidden sm:block text-zinc-300 dark:text-zinc-700">•</span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{item.description}</span>
            </div>
            
            <div className="text-zinc-400 dark:text-zinc-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-zinc-900 dark:group-hover:text-zinc-100">
              {item.external && <ArrowIcon />}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
