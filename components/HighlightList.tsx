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

/**
 * Which edge of `el` the cursor crossed to get inside.
 *
 * Takes the angle from the centre to the cursor, corrected for the element's
 * aspect so a wide row does not report "top" for a cursor that came in the
 * side, then rounds it to one of four quadrants.
 */
function getDirection(
  event: React.MouseEvent,
  el: HTMLElement
): keyof typeof ENTER {
  const { width, height, left, top } = el.getBoundingClientRect();
  const x = event.clientX - left - width / 2;
  const y = event.clientY - top - height / 2;
  const quadrant =
    Math.round(Math.atan2(y * (width / height), x) / (Math.PI / 2) + 5) % 4;
  return (["top", "right", "bottom", "left"] as const)[quadrant];
}

/** The card starts offset toward whichever edge the cursor came from. */
const ENTER = {
  top: { y: 20, x: 0 },
  bottom: { y: -20, x: 0 },
  left: { x: 20, y: 0 },
  right: { x: -20, y: 0 },
};

export default function HighlightList({ title, items }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [activeCards, setActiveCards] = useState<Card[] | null>(null);
  const [from, setFrom] = useState<keyof typeof ENTER>("bottom");

  /* Spring-based cursor tracking */
  const springConfig = { stiffness: 180, damping: 22 };
  const cardX = useSpring(0, springConfig);
  const cardY = useSpring(0, springConfig);

  /**
   * Where the preview sits, in container coordinates.
   *
   * The card is drawn a full height above the pointer, which is what puts it
   * above-right of the row you are on. On the first row that lifts it clean out
   * of the list and onto the page heading — so the Y is floored at the card's
   * own lifted height, and the top rows hold it flush with the top of the list
   * instead of pushing it off.
   */
  const place = useCallback(
    (clientX: number, clientY: number, container: HTMLDivElement, snap = false) => {
      const rect = container.getBoundingClientRect();
      // Falls back to the card's design height for the very first frame, when
      // the preview has not mounted and cannot be measured yet.
      const lift = (previewRef.current?.offsetHeight ?? 170) * 1.1;
      const x = clientX - rect.left;
      const y = Math.max(clientY - rect.top, lift);
      // On the first hover the springs are still resting at 0, which draws the
      // card a full lift above the top of the list — on the page heading — and
      // then slides it down into place. Jumping puts it where it belongs on the
      // frame it appears, and only later moves are sprung.
      if (snap) {
        cardX.jump(x);
        cardY.jump(y);
      } else {
        cardX.set(x);
        cardY.set(y);
      }
    },
    [cardX, cardY]
  );

  const onEnter = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, cards?: Card[]) => {
      const container = containerRef.current;
      if (!container) return;

      if (cards && cards.length > 0) {
        setFrom(getDirection(e, e.currentTarget));
        setActiveCards(cards);
        place(e.clientX, e.clientY, container, true);
      } else {
        setActiveCards(null);
      }
    },
    [place]
  );

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!activeCards || !containerRef.current) return;
      place(e.clientX, e.clientY, containerRef.current);
    },
    [activeCards, place]
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
              className="pointer-events-none absolute left-0 top-0 z-50"
              style={{ x: cardX, y: cardY }}
            >
              {/* Above-right of the cursor. The lift is what `place` floors
                  the Y against, so the two have to stay in step. */}
              <div
                ref={previewRef}
                className="relative"
                style={{ transform: "translate(20px, -110%)" }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, ...ENTER[from] }}
                  animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, ...ENTER[from] }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
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
                </motion.div>
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
