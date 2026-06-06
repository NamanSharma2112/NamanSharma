"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

const SAKURA_PATHS = [
  // Petal Shape 1 (Rounded organic)
  "M 10 0 C 15 4, 18 10, 15 16 C 12 19, 8 19, 5 16 C 2 10, 5 4, 10 0 Z",
  // Petal Shape 2 (Slightly narrower/pointed)
  "M 10 0 C 13 3, 16 8, 12 14 C 10 16, 7 16, 5 14 C 2 8, 7 3, 10 0 Z",
  // Petal Shape 3 (Asymmetric/wind-blown look)
  "M 10 0 C 12 1, 14 2, 15 2 C 16 5, 14 10, 11 13 C 9 15, 7 15, 5 13 C 2 9, 7 3, 10 0 Z",
];

const SAKURA_COLORS = [
  "#ffa6c9", // Soft pastel pink
  "#ff85a2", // Classic cherry blossom pink
  "#ff4d6d", // Vivid blossom pink
  "#ffb3c6", // Delicate rose pink
  "#ffe5ec", // Pale white-pink
];

interface Petal {
  id: number;
  left: string;
  delay: string;
  duration: string;
  swayDelay: string;
  swayDuration: string;
  spinDuration: string;
  size: number;
  opacity: number;
  color: string;
  path: string;
}

export default function SakuraBlossoms({
  number = 35,
  isActive = true,
}: {
  number?: number;
  isActive?: boolean;
}) {
  const [petals, setPetals] = useState<Petal[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Generate petals randomly only on the client side to prevent hydration mismatch
    const generated = Array.from({ length: number }, (_, i) => {
      const left = Math.random() * 100 + "%";
      const delay = Math.random() * -12 + "s"; // Start negative so they populate the screen immediately
      const duration = Math.random() * 6 + 10 + "s"; // 10s to 16s fall speed
      const swayDelay = Math.random() * 5 + "s";
      const swayDuration = Math.random() * 4 + 4 + "s"; // 4s to 8s sway speed
      const spinDuration = Math.random() * 3 + 3 + "s"; // 3s to 6s spin speed
      const size = Math.random() * 8 + 12; // 12px to 20px size
      const opacity = Math.random() * 0.4 + 0.6; // 0.6 to 1.0 opacity
      const color = SAKURA_COLORS[Math.floor(Math.random() * SAKURA_COLORS.length)];
      const path = SAKURA_PATHS[Math.floor(Math.random() * SAKURA_PATHS.length)];

      return {
        id: i,
        left,
        delay,
        duration,
        swayDelay,
        swayDuration,
        spinDuration,
        size,
        opacity,
        color,
        path,
      };
    });
    setPetals(generated);
  }, [number]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[50]">
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {petals.map((p) => (
              <div
                key={p.id}
                className="absolute animate-sakura-fall"
                style={{
                  left: p.left,
                  top: "-20px",
                  animationDelay: p.delay,
                  animationDuration: p.duration,
                }}
              >
                <div
                  className="animate-sakura-sway"
                  style={{
                    animationDelay: p.swayDelay,
                    animationDuration: p.swayDuration,
                  }}
                >
                  <svg
                    width={p.size}
                    height={p.size}
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="animate-sakura-spin"
                    style={{
                      fill: p.color,
                      opacity: p.opacity,
                      animationDuration: p.spinDuration,
                    }}
                  >
                    <path d={p.path} />
                  </svg>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes sakura-fall {
          0% {
            top: -5%;
          }
          100% {
            top: 110%;
          }
        }
        @keyframes sakura-sway {
          0%, 100% {
            transform: translateX(0px) rotate(0deg);
          }
          50% {
            transform: translateX(60px) rotate(35deg);
          }
        }
        @keyframes sakura-spin {
          0% {
            transform: rotateY(0deg) rotateX(0deg) rotateZ(0deg);
          }
          100% {
            transform: rotateY(360deg) rotateX(180deg) rotateZ(360deg);
          }
        }
        .animate-sakura-fall {
          animation: sakura-fall linear infinite;
        }
        .animate-sakura-sway {
          animation: sakura-sway ease-in-out infinite;
        }
        .animate-sakura-spin {
          animation: sakura-spin linear infinite;
        }
      `}</style>
    </div>
  );
}
