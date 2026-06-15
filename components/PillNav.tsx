"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { playTap } from "@/lib/sounds";

/* ── Tab config ── */
const TABS = [
  {
    label: "Home",
    href: "/",
    icon: (
      <motion.svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <motion.path 
          variants={{ hover: { y: -2 } }} 
          transition={{ type: "spring", stiffness: 300 }} 
          d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" 
        />
        <motion.path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      </motion.svg>
    ),
  },
  {
    label: "Blog",
    href: "/blog",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <motion.path 
          d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" 
          variants={{ 
            hover: { 
              rotate: [0, -15, 10, -5, 0], 
              x: [0, -2, 1, 0],
              y: [0, 1, -1, 0]
            } 
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </svg>
    ),
  },
  {
    label: "Inspiration",
    href: "/inspiration",
    icon: (
      <motion.svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" strokeWidth="0"
        variants={{ hover: { scale: [1, 1.25, 0.9, 1.15, 1] } }}
        transition={{ duration: 0.6 }}
      >
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
      </motion.svg>
    ),
  },
  {
    label: "About",
    href: "/about",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <motion.circle cx="12" cy="8" r="5" 
          variants={{ hover: { rotate: [0, -15, 15, -5, 0], y: [0, -2, 0] } }}
          transition={{ duration: 0.5 }}
          style={{ originX: "12px", originY: "8px" }}
        />
        <path d="M20 21a8 8 0 0 0-16 0" />
      </svg>
    ),
  },
];

export default function PillNav() {
  const pathname = usePathname();
  const [activeRect, setActiveRect] = useState({ left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  /* Find which tab is active */
  const activeIndex = TABS.findIndex((tab) =>
    tab.href === "/"
      ? pathname === "/"
      : pathname.startsWith(tab.href)
  );

  /* Measure the active tab and position the slider */
  useEffect(() => {
    const updateSlider = () => {
      const idx = activeIndex >= 0 ? activeIndex : 0;
      const el = tabRefs.current[idx];
      const container = containerRef.current;
      if (el && container) {
        const elRect = el.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        setActiveRect({
          left: elRect.left - containerRect.left,
          width: elRect.width,
        });
      }
    };

    updateSlider();
    setMounted(true);
    window.addEventListener("resize", updateSlider);
    return () => window.removeEventListener("resize", updateSlider);
  }, [activeIndex]);

  return (
    <nav
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[55]"
      aria-label="Main navigation"
    >
      <div
        ref={containerRef}
        className="relative flex items-center gap-1 rounded-full px-1.5 py-1.5 backdrop-blur-xl backdrop-saturate-200"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          boxShadow: "0 4px 30px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.02)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
        }}
      >
        {/* Sliding active indicator */}
        {mounted && (
          <motion.div
            className="absolute top-1.5 bottom-1.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.7)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
            animate={{
              left: activeRect.left,
              width: activeRect.width,
            }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 30,
              mass: 0.8,
            }}
          />
        )}

        {/* Tab links */}
        {TABS.map((tab, i) => {
          const isActive = activeIndex === i;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              ref={(el) => { tabRefs.current[i] = el; }}
              onClick={() => playTap()}
              className="relative z-10 select-none outline-none block"
            >
              <motion.div
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-200 whitespace-nowrap ${
                  isActive ? "text-black" : "text-zinc-400 hover:text-zinc-600"
                }`}
              >
                <motion.span
                  className="flex items-center"
                  variants={{
                    hover: { scale: 1.15, rotate: isActive ? 0 : -8 },
                    tap: { scale: 0.9 }
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {tab.icon}
                </motion.span>
                <span>{tab.label}</span>
              </motion.div>
            </Link>
          );
        })}
        
        {/* CmdK Trigger Button */}
        <div className="w-[1px] h-4 bg-zinc-300/50 mx-1 rounded-full z-10" />
        <motion.button
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          onClick={() => {
            playTap();
            document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
          }}
          className="relative z-10 select-none outline-none block group px-2 py-2 cursor-pointer"
        >
          <div className="flex items-center gap-1.5 rounded-full text-[13px] font-medium text-zinc-400 group-hover:text-zinc-800 transition-colors duration-200">
            <motion.svg 
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              variants={{
                hover: { scale: 1.15, rotate: -10 },
                tap: { scale: 0.9 }
              }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </motion.svg>
            <motion.span 
              variants={{
                hover: { x: 1, scale: 1.05 },
                tap: { scale: 0.95 }
              }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="hidden sm:inline-flex items-center gap-0.5 bg-black/5 dark:bg-white/10 px-1.5 py-[3px] rounded text-[10px] font-mono leading-none border border-black/5 dark:border-white/10 group-hover:border-black/20 group-hover:bg-black/10 transition-colors duration-200"
            >
              <span className="text-[11px] leading-none">⌘</span>K
            </motion.span>
          </div>
        </motion.button>
      </div>
    </nav>
  );
}
