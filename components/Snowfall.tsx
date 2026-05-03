"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useSnow } from "@/lib/snow-context";
import { motion, AnimatePresence } from "motion/react";

export const Snowfall = ({
  number = 50,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const { isSnowing } = useSnow();
  const [flakes, setFlakes] = useState<Array<{ id: number; left: string; delay: string; duration: string; size: string; opacity: number }>>([]);

  useEffect(() => {
    const newFlakes = [...new Array(number)].map((_, i) => ({
      id: i,
      left: Math.floor(Math.random() * 100) + "%",
      delay: Math.random() * 10 + "s",
      duration: Math.random() * 10 + 5 + "s",
      size: Math.random() * 4 + 2 + "px",
      opacity: Math.random() * 0.5 + 0.3,
    }));
    setFlakes(newFlakes);
  }, [number]);

  return (
    <div className={cn("fixed inset-0 pointer-events-none overflow-hidden z-[-1]", className)}>
      <AnimatePresence>
        {isSnowing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            {flakes.map((f) => (
              <div
                key={f.id}
                className="absolute top-[-10px] bg-white rounded-full blur-[1px] animate-snow"
                style={{
                  left: f.left,
                  width: f.size,
                  height: f.size,
                  opacity: f.opacity,
                  animationDelay: f.delay,
                  animationDuration: f.duration,
                } as React.CSSProperties}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <style jsx>{`
        @keyframes snow {
          0% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(25vh) translateX(15px); }
          50% { transform: translateY(50vh) translateX(-15px); }
          75% { transform: translateY(75vh) translateX(10px); }
          100% { transform: translateY(110vh) translateX(0); }
        }
        .animate-snow {
          animation: snow linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Snowfall;
