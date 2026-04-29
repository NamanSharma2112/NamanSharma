"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useSpring } from "motion/react";
import React from "react";

interface LinkPreviewProps {
  children: React.ReactNode;
  url: string;
  className?: string;
  isStatic?: boolean;
  imageSrc?: string;
}

export default function LinkPreview({
  children,
  url,
  className,
  isStatic = false,
  imageSrc = "",
}: LinkPreviewProps) {
  const [isOpen, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const src = isStatic
    ? imageSrc
    : `https://api.microlink.io/?url=${encodeURIComponent(
        url
      )}&screenshot=true&meta=false&embed=screenshot.url`;

  const springConfig = { stiffness: 100, damping: 15 };
  const x = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const offset = e.clientX - (rect.left + rect.width / 2);
      x.set(offset * 0.4); 
    }
  };

  return (
    <span className="relative inline-block" ref={ref}>
      <AnimatePresence>
        {isOpen && isMounted && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9, rotateX: 15 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
              },
            }}
            exit={{ opacity: 0, y: 15, scale: 0.9, rotateX: 15 }}
            style={{ x, transformOrigin: "bottom center", perspective: "1000px" }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none"
          >
            <div
              className="block rounded-xl overflow-hidden border border-zinc-200/60 dark:border-zinc-800/60 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] bg-white dark:bg-zinc-900 p-1.5"
              style={{ width: "260px", height: "150px" }}
            >
              <img
                src={src}
                alt="Link preview"
                className="w-full h-full object-cover rounded-lg bg-zinc-100 dark:bg-zinc-800"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onMouseMove={handleMouseMove}
      >
        {children}
      </a>
    </span>
  );
}
