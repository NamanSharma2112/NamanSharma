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
  const highlightRef = useRef<HTMLDivElement>(null);
  const [highlightStyle, setHighlightStyle] = useState({
    top: 0,
    height: 0,
    opacity: 0,
  });
  const [activeCards, setActiveCards] = useState<Card[] | null>(null);

  /* Spring-based cursor tracking */
  const springConfig = { stiffness: 180, damping: 22 };
  const cardX = useSpring(0, springConfig);
  const cardY = useSpring(0, springConfig);

  const onEnter = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, cards?: Card[]) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setHighlightStyle({
        top: rect.top - containerRect.top,
        height: rect.height,
        opacity: 1,
      });
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
    setHighlightStyle((prev) => ({ ...prev, opacity: 0 }));
    setActiveCards(null);
  }, []);

  return (
    <section className="flex w-full max-w-[576px] flex-col gap-4">
      <p className="pb-2 text-black">{title}</p>
      <div className="h-px w-8 bg-[#e8e8e8]" />
      <div
        ref={containerRef}
        className="relative -mt-1 flex flex-col gap-1"
        onMouseLeave={onLeave}
        onMouseMove={onMove}
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

        {/* Cursor-following preview card */}
        <AnimatePresence>
          {activeCards && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 10 }}
              transition={{
                duration: 0.3,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              className="pointer-events-none absolute left-0 top-0 z-50"
              style={{ x: cardX, y: cardY }}
            >
              {/* Offset so card appears above-right of cursor */}
              <div className="relative" style={{ transform: "translate(16px, -105%)" }}>
                <div className="flex gap-[-8px]">
                  {activeCards.map((card, i) => (
                    <div
                      key={i}
                      className="rounded-xl overflow-hidden border border-white/80"
                      style={{
                        width: 130,
                        height: 160,
                        transform: `rotate(${card.r}deg) translateX(${card.dx}px)`,
                        boxShadow:
                          "0 12px 40px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1)",
                        transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      }}
                    >
                      <img
                        src={card.src}
                        alt={card.alt}
                        width={130}
                        height={160}
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
