"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Type } from "lucide-react";

type TOCItem = { id: string; heading: string };
type FontOption = { label: string; value: string };

export default function TableOfContents({
  items,
  isDark = false,
  fontOptions,
  fontIndex,
  onFontChange,
}: {
  items: TOCItem[];
  isDark?: boolean;
  fontOptions?: FontOption[];
  fontIndex?: number;
  onFontChange?: (index: number) => void;
}) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Active section tracking ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );
    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  // ── Scroll progress ──
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    setScrollProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // ── Outside click ──
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // ── Circular progress ──
  const r = 8;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - scrollProgress);

  const activeHeading = items.find((i) => i.id === activeId)?.heading ?? items[0]?.heading ?? "";

  // ── Color tokens ──
  const c = {
    pillBg:        isDark ? "rgba(24,24,27,0.92)"  : "rgba(255,255,255,0.92)",
    pillBorder:    isDark ? "#2e2e32"               : "#e4e4e7",
    pillText:      isDark ? "#e4e4e7"               : "#27272a",
    panelBg:       isDark ? "rgba(18,18,21,0.96)"   : "rgba(255,255,255,0.96)",
    panelBorder:   isDark ? "#2e2e32"               : "#e4e4e7",
    itemText:      isDark ? "#71717a"               : "#71717a",
    activeText:    isDark ? "#fafafa"               : "#18181b",
    activeBg:      isDark ? "rgba(255,255,255,0.05)": "rgba(0,0,0,0.04)",
    hoverBg:       isDark ? "rgba(255,255,255,0.04)": "rgba(0,0,0,0.03)",
    divider:       isDark ? "#1f1f23"               : "#f4f4f5",
    segTrack:      isDark ? "#0d0d0f"               : "#f4f4f5",
    segActive:     isDark ? "#27272a"               : "#ffffff",
    accent:        isDark ? "#818cf8"               : "#4f46e5",
    trackRing:     isDark ? "#3f3f46"               : "#e4e4e7",
    shadow:        isDark ? "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)"
                          : "0 8px 40px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)",
    pillShadow:    isDark ? "0 2px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)"
                          : "0 2px 16px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
  };

  return (
    <div ref={containerRef} className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[80]">

      {/* ── Panel — scales from bottom center (Emil: origin-aware) ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 6 }}
            // Emil: ease-out for entering, under 250ms for UI elements
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            style={{
              transformOrigin: "bottom center",
              backgroundColor: c.panelBg,
              borderColor: c.panelBorder,
              boxShadow: c.shadow,
            }}
            className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 w-[272px] rounded-2xl border py-1.5 overflow-hidden backdrop-blur-xl"
          >
            {/* Section list — staggered */}
            <ul className="flex flex-col px-1">
              {items.map((item, i) => {
                const isActive = activeId === item.id;
                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    // Emil: 30–80ms stagger between items
                    transition={{ delay: i * 0.04, duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-[7px] rounded-xl text-[13.5px] select-none transition-colors duration-150 group"
                      style={{
                        color: isActive ? c.activeText : c.itemText,
                        fontWeight: isActive ? 500 : 400,
                        backgroundColor: isActive ? c.activeBg : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = c.hoverBg;
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                      }}
                    >
                      {/* Active dot indicator */}
                      <span
                        className="w-1 h-1 rounded-full shrink-0 transition-all duration-200"
                        style={{
                          backgroundColor: isActive ? c.accent : "transparent",
                          transform: isActive ? "scale(1)" : "scale(0)",
                        }}
                      />
                      {item.heading}
                    </a>
                  </motion.li>
                );
              })}
            </ul>

            {/* Font Selector */}
            {fontOptions && fontOptions.length > 0 && onFontChange && (
              <>
                <div className="h-px mx-3 my-1.5" style={{ backgroundColor: c.divider }} />
                <div className="px-3 pb-2 pt-1">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Type size={11} style={{ color: c.itemText }} />
                    <span className="text-[10px] uppercase tracking-[0.08em] font-medium" style={{ color: c.itemText }}>
                      Typeface
                    </span>
                  </div>
                  <div
                    className="flex rounded-xl p-0.5 gap-px"
                    style={{ backgroundColor: c.segTrack }}
                  >
                    {fontOptions.map((opt, idx) => {
                      const isSelected = fontIndex === idx;
                      return (
                        <button
                          key={opt.label}
                          onClick={() => onFontChange(idx)}
                          className="relative flex-1 py-[5px] rounded-[10px] text-[12px] cursor-pointer outline-none select-none"
                          style={{
                            color: isSelected ? c.activeText : c.itemText,
                            fontFamily: opt.value,
                          }}
                        >
                          {isSelected && (
                            <motion.div
                              layoutId="font-pill"
                              className="absolute inset-0 rounded-[10px]"
                              style={{
                                backgroundColor: c.segActive,
                                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                              }}
                              // Emil: spring for layout shifts
                              transition={{ type: "spring", stiffness: 380, damping: 28, mass: 0.8 }}
                            />
                          )}
                          <span className="relative z-10 font-medium">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Pill trigger ── */}
      <motion.button
        onClick={() => setIsOpen((p) => !p)}
        // Emil: scale(0.97) on press for instant feedback
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.12, ease: [0.23, 1, 0.32, 1] }}
        style={{
          backgroundColor: c.pillBg,
          borderColor: c.pillBorder,
          color: c.pillText,
          boxShadow: c.pillShadow,
        }}
        className="flex items-center gap-2.5 pl-3 pr-4 py-2 rounded-full border cursor-pointer select-none outline-none backdrop-blur-xl"
      >
        {/* Circular progress ring */}
        <svg width="22" height="22" viewBox="0 0 22 22" className="shrink-0 -rotate-90">
          <circle cx="11" cy="11" r={r} fill="none" stroke={c.trackRing} strokeWidth="1.8" />
          <circle
            cx="11" cy="11" r={r}
            fill="none"
            stroke={c.accent}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.12s ease-out" }}
          />
          {/* Chevron — rotates on open. Emil: spring for icon morphs */}
          <motion.path
            d="M7.5 12.5L11 9L14.5 12.5"
            fill="none"
            stroke={c.accent}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            style={{ transformOrigin: "11px 11px", rotate: "90deg" }}
          />
        </svg>

        {/* Active section label — fades when it changes */}
        <motion.span
          key={activeHeading}
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
          className="text-[13px] font-medium whitespace-nowrap max-w-[180px] truncate"
        >
          {activeHeading}
        </motion.span>
      </motion.button>
    </div>
  );
}
