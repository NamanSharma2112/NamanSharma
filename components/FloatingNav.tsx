"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

const TABS = [
  { name: "Home",       href: "/" },
  { name: "Projects",   href: "/#projects" },
  { name: "Blog",       href: "/#blog" },
];

export default function FloatingNav() {
  const pathname = usePathname();

  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  // Map to store refs to each tab's <li> element
  const tabRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  // ref on the clip-path overlay container
  const overlayContainerRef = useRef<HTMLDivElement>(null);

  const targetTab = hoveredTab || pathname;

  // Recalculate clip-path whenever the active/hovered tab changes
  useEffect(() => {
    const overlay = overlayContainerRef.current;
    let activeEl = tabRefs.current.get(targetTab);
    
    // fallback if targetTab isn't found in refs
    if (!activeEl) {
      activeEl = tabRefs.current.get(pathname);
    }
    
    if (!overlay || !activeEl) return;

    const { offsetLeft, offsetWidth } = activeEl;
    const totalWidth = overlay.offsetWidth;

    const left  = Number(((offsetLeft / totalWidth) * 100).toFixed(2));
    const right = Number((100 - ((offsetLeft + offsetWidth) / totalWidth) * 100).toFixed(2));

    overlay.style.clipPath = `inset(0 ${right}% 0 ${left}% round 14px)`;
  }, [targetTab, pathname]); 

  return (
    <motion.nav
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 24,
        mass: 0.75,
        delay: 0.06,
      }}
      aria-label="Primary navigation"
      // Using flex justify-center to center perfectly without transform translate issues
      className="fixed top-5 left-0 right-0 z-50 flex justify-center pointer-events-none"
    >
      {/* ── Outer pill wrapper (positions both layers) ── */}
      <div
        className="relative pointer-events-auto"
        style={{
          borderRadius: 999,
          background: "rgba(9,9,11,0.78)",
          backdropFilter: "blur(18px) saturate(1.4)",
          WebkitBackdropFilter: "blur(18px) saturate(1.4)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow:
            "0 4px 28px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.05) inset",
          padding: "6px 6px",
        }}
      >
        {/* ──────────────────────────────────────────
            LAYER 1 — Base list (muted text)
        ────────────────────────────────────────── */}
        <ul 
          className="flex items-center" 
          style={{ listStyle: "none", margin: 0, padding: 0, gap: 0 }}
          onMouseLeave={() => setHoveredTab(null)}
        >
          {TABS.map((tab) => {
            return (
              <li
                key={tab.name}
                ref={(el) => {
                  if (el) tabRefs.current.set(tab.href, el);
                  else tabRefs.current.delete(tab.href);
                }}
                onMouseEnter={() => setHoveredTab(tab.href)}
              >
                <Link
                  href={tab.href}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 16px",
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 500,
                    color: "rgba(161,161,170,0.75)",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    transition: "color 0.2s ease",
                    userSelect: "none",
                  }}
                >
                  {tab.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ──────────────────────────────────────────
            LAYER 2 — Overlay list (bright text)
            Clipped to active/hovered tab via clip-path
        ────────────────────────────────────────── */}
        <div
          ref={overlayContainerRef}
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 999,
            // Start hidden; useEffect sets correct clip-path on first render
            clipPath: "inset(0 100% 0 0 round 14px)",
            transition: "clip-path 0.3s cubic-bezier(0.34, 1.2, 0.64, 1)",
            // Overlay background — the "active pill" fill
            background: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.11)",
            pointerEvents: "none", // ensure it doesn't block hover events on layer 1
          }}
        >
          {/* Same padding as outer pill so lists align perfectly */}
          <div style={{ padding: "6px 6px" }}>
            <ul
              className="flex items-center"
              style={{ listStyle: "none", margin: 0, padding: 0, gap: 0 }}
            >
              {TABS.map((tab) => (
                <li key={tab.name}>
                  {/* tabIndex={-1} so it's not keyboard-reachable (it's decorative) */}
                  <button
                    tabIndex={-1}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 16px",
                      borderRadius: 999,
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#f4f4f5",
                      background: "none",
                      border: "none",
                      cursor: "default",
                      whiteSpace: "nowrap",
                      userSelect: "none",
                    }}
                  >
                    {tab.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
