"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useSnow } from "@/lib/snow-context";
import { motion, AnimatePresence } from "motion/react";

export const MeteorShower = ({
  number = 12,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const { isSnowing } = useSnow();
  const [meteors, setMeteors] = useState<Array<{ id: number; left: string; delay: string; duration: string; size: number; rotation: string }>>([]);

  useEffect(() => {
    const newMeteors = [...new Array(number)].map((_, i) => ({
      id: i,
      left: Math.floor(Math.random() * 100) + "%",
      delay: Math.random() * 12 + "s",
      duration: Math.random() * 6 + 6 + "s", 
      size: Math.random() * 4 + 3,
      rotation: Math.floor(Math.random() * 360) + "deg",
    }));
    setMeteors(newMeteors);
  }, [number]);

  return (
    <div 
      className={cn("fixed inset-0 pointer-events-none overflow-hidden z-[-1]", className)}
      style={{ 
        WebkitMaskImage: 'linear-gradient(to right, black 0%, black 10%, transparent 20%, transparent 80%, black 90%, black 100%)',
        maskImage: 'linear-gradient(to right, black 0%, black 10%, transparent 20%, transparent 80%, black 90%, black 100%)'
      }}
    >
      <AnimatePresence>
        {isSnowing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            {meteors.map((m) => (
              <div
                key={m.id}
                className="absolute top-[-50px] animate-fall"
                style={{
                  left: m.left,
                  animationDelay: m.delay,
                  animationDuration: m.duration,
                } as React.CSSProperties}
              >
                <div 
                  className="bg-zinc-500 dark:bg-zinc-400 relative shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                  style={{ 
                    width: m.size, 
                    height: m.size, 
                    transform: `rotate(${m.rotation})`,
                    borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" 
                  }}
                >
                  <div className="absolute top-0 left-0 w-full h-full bg-white/10 rounded-full blur-[1px]" />
                </div>
                
                <div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[40px] bg-gradient-to-b from-zinc-500/10 to-transparent"
                />

                <div className="absolute top-[100vh] left-1/2 -translate-x-1/2 w-0 h-0">
                  {[...new Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-zinc-500/40 dark:bg-zinc-400/40 animate-fragment"
                      style={{
                        animationDuration: m.duration,
                        animationDelay: m.delay,
                        transform: `rotate(${i * 90}deg)`,
                        borderRadius: "20% 80%"
                      } as React.CSSProperties}
                    />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        @keyframes fragment-1 { 0%, 95% { transform: translate(0,0) scale(0); opacity: 0; } 98% { opacity: 1; } 100% { transform: translate(-15px, -10px) scale(0); opacity: 0; } }
        @keyframes fragment-2 { 0%, 95% { transform: translate(0,0) scale(0); opacity: 0; } 98% { opacity: 1; } 100% { transform: translate(15px, -10px) scale(0); opacity: 0; } }
        @keyframes fragment-3 { 0%, 95% { transform: translate(0,0) scale(0); opacity: 0; } 98% { opacity: 1; } 100% { transform: translate(-5px, -15px) scale(0); opacity: 0; } }
        @keyframes fragment-4 { 0%, 95% { transform: translate(0,0) scale(0); opacity: 0; } 98% { opacity: 1; } 100% { transform: translate(5px, -15px) scale(0); opacity: 0; } }
        .animate-fall { animation: fall linear infinite; }
        .animate-fragment:nth-child(1) { animation: fragment-1 linear infinite; }
        .animate-fragment:nth-child(2) { animation: fragment-2 linear infinite; }
        .animate-fragment:nth-child(3) { animation: fragment-3 linear infinite; }
        .animate-fragment:nth-child(4) { animation: fragment-4 linear infinite; }
      `}</style>
    </div>
  );
};

export default MeteorShower;
