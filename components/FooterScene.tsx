"use client";

import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useSnow } from "@/lib/snow-context";

const Snowman = () => (
  <svg width="55" height="70" viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="snowGrad" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
        <stop offset="0%" stopColor="white" />
        <stop offset="100%" stopColor="#e2e8f0" />
      </radialGradient>
      <linearGradient id="scarfGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#b91c1c" />
      </linearGradient>
    </defs>
    <circle cx="30" cy="62" r="15" fill="url(#snowGrad)" className="dark:opacity-90" />
    <circle cx="30" cy="40" r="11" fill="url(#snowGrad)" className="dark:opacity-90" />
    <circle cx="30" cy="22" r="8" fill="url(#snowGrad)" className="dark:opacity-90" />
    <path d="M22 32Q30 36 38 32V36Q30 40 22 36V32Z" fill="url(#scarfGrad)" />
    <path d="M35 34L38 48L32 46L35 34Z" fill="url(#scarfGrad)" />
    <circle cx="27" cy="20" r="1.2" fill="#1e293b" />
    <circle cx="33" cy="20" r="1.2" fill="#1e293b" />
    <g fill="#1e293b" opacity="0.8">
      <circle cx="26" cy="25" r="0.6" />
      <circle cx="28" cy="26" r="0.6" />
      <circle cx="30" cy="26.5" r="0.6" />
      <circle cx="32" cy="26" r="0.6" />
      <circle cx="34" cy="25" r="0.6" />
    </g>
    <path d="M30 22L40 24L30 26L30 22Z" fill="#f97316" stroke="#ea580c" strokeWidth="0.5" />
    <circle cx="30" cy="42" r="1.5" fill="#1e293b" />
    <circle cx="30" cy="50" r="1.5" fill="#1e293b" />
    <motion.g stroke="#713f12" strokeWidth="1.5" strokeLinecap="round">
      <motion.path d="M19 40L8 32M8 32L6 34M8 32L5 30" animate={{ rotate: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity }} />
      <motion.path d="M41 40L52 32M52 32L54 34M52 32L55 30" animate={{ rotate: [0, 5, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }} />
    </motion.g>
    <rect x="20" y="12" width="20" height="3" fill="#0f172a" rx="1" />
    <rect x="24" y="4" width="12" height="8" fill="#0f172a" rx="1" />
    <rect x="24" y="10" width="12" height="2" fill="#ef4444" opacity="0.8" />
  </svg>
);

const Reindeer = ({ hasGifts = true }: { hasGifts?: boolean }) => (
  <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="furGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#92400e" />
        <stop offset="100%" stopColor="#713f12" />
      </linearGradient>
    </defs>
    <g stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" fill="none">
      <path d="M55 25C55 20 50 15 45 10M45 10L40 5M45 10L50 5" />
      <path d="M65 25C65 20 70 15 75 10M75 10L80 5M75 10L70 5" />
    </g>
    {hasGifts && (
      <g transform="translate(20, 30)">
        <rect x="0" y="8" width="12" height="12" fill="#ef4444" rx="2" />
        <path d="M6 8V20M0 14H12" stroke="white" strokeWidth="1.5" opacity="0.5" />
        <rect x="10" y="0" width="15" height="15" fill="#3b82f6" rx="2" />
        <path d="M17.5 0V15M10 7.5H25" stroke="white" strokeWidth="1.5" opacity="0.5" />
      </g>
    )}
    <path d="M25 50C25 40 35 35 50 35C65 35 75 45 75 55C75 65 65 75 50 75C35 75 25 70 25 60V50Z" fill="url(#furGrad)" />
    <path d="M60 45L65 25C65 18 72 15 80 20C88 25 86 35 78 38L70 55" fill="url(#furGrad)" />
    <motion.g stroke="#451a03" strokeWidth="4" strokeLinecap="round">
      <motion.line x1="35" y1="70" x2="32" y2="88" animate={{ x2: [32, 40, 32] }} transition={{ duration: 0.8, repeat: Infinity }} />
      <motion.line x1="45" y1="70" x2="45" y2="88" animate={{ x2: [45, 52, 45] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }} />
      <motion.line x1="55" y1="70" x2="55" y2="88" animate={{ x2: [55, 48, 55] }} transition={{ duration: 0.8, repeat: Infinity }} />
      <motion.line x1="65" y1="70" x2="68" y2="88" animate={{ x2: [68, 60, 68] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }} />
    </motion.g>
    <path d="M66 38Q72 44 78 38" stroke="#eab308" strokeWidth="3" fill="none" />
    <circle cx="72" cy="42" r="3" fill="#facc15" stroke="#a16207" strokeWidth="0.5" />
    <circle cx="78" cy="25" r="2" fill="#0f172a" />
    <circle cx="85" cy="30" r="4" fill="#ef4444" />
    <circle cx="85" cy="30" r="8" fill="#ef4444" opacity="0.2" className="animate-pulse" />
  </svg>
);

const Penguin = ({ className, isKicking }: { className?: string, isKicking?: boolean }) => (
  <svg width="25" height="30" viewBox="0 0 25 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="12.5" cy="18" rx="10" ry="12" fill="#1e293b" />
    <ellipse cx="12.5" cy="19" rx="7" ry="10" fill="white" />
    <circle cx="10" cy="12" r="1.5" fill="#0f172a" />
    <circle cx="15" cy="12" r="1.5" fill="#0f172a" />
    <path d="M12.5 14L15 17L10 17L12.5 14Z" fill="#fb923c" />
    <motion.path d="M3 18C1 18 1 22 3 24" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" animate={isKicking ? { rotate: [0, -40, 0] } : {}} />
    <motion.path d="M22 18C24 18 24 22 22 24" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" animate={isKicking ? { rotate: [0, 40, 0] } : {}} />
    <circle cx="9" cy="28" r="2.5" fill="#fb923c" />
    <circle cx="16" cy="28" r="2.5" fill="#fb923c" />
  </svg>
);

const Ball = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ballGrad" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
        <stop offset="0%" stopColor="#ff8a8a" />
        <stop offset="100%" stopColor="#ef4444" />
      </radialGradient>
    </defs>
    <circle cx="8" cy="8" r="8" fill="url(#ballGrad)" />
    <path d="M3 8C3 5.23858 5.23858 3 8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
  </svg>
);

export const FooterScene = () => {
  const { isSnowing } = useSnow();
  const passDuration = 1.8;
  const pauseDuration = 0.4;
  const totalCycle = (passDuration + pauseDuration) * 2;

  return (
    <AnimatePresence>
      {isSnowing && (
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full z-10 overflow-hidden h-44 mt-20 pointer-events-none"
        >
          <svg className="absolute bottom-0 left-0 w-full h-32 preserve-3d" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <path d="M0,70 Q250,50 500,70 T1000,70 V100 H0 Z" fill="white" className="dark:fill-zinc-800 opacity-95 transition-colors duration-500" />
            <path d="M0,85 Q300,65 600,85 T1000,85 V100 H0 Z" fill="white" className="dark:fill-zinc-700 opacity-70 transition-colors duration-500" />
          </svg>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-full flex items-end justify-between px-10 pb-2">
            <div className="flex items-end">
              <motion.div initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0], y: -5 }} className="relative cursor-pointer pointer-events-auto group">
                <Snowman />
                <motion.div className="absolute top-4 left-0 w-4 h-4 text-yellow-400 opacity-0 group-hover:opacity-100" animate={{ scale: [0, 1.2, 0], rotate: 90 }} transition={{ repeat: Infinity, duration: 1 }}>✦</motion.div>
              </motion.div>
            </div>

            <div className="flex gap-8 pb-1 absolute left-1/2 -translate-x-1/2 w-[320px] h-24 items-end justify-center">
              <motion.div animate={{ y: [0, 0, -30, 0, 0], scaleY: [1, 1, 0.7, 1.2, 1] }} transition={{ duration: totalCycle, repeat: Infinity, ease: "easeInOut", times: [0, 0.9, 0.95, 0.98, 1] }} className="origin-bottom absolute left-0">
                <Penguin isKicking={true} />
              </motion.div>
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} className="origin-bottom absolute left-[25%]">
                <Penguin />
              </motion.div>

              <div className="absolute bottom-2 w-full h-full flex items-end justify-center">
                <motion.div animate={{ x: [-110, 110, 110, -110, -110] }} transition={{ duration: totalCycle, repeat: Infinity, ease: "linear", times: [0, 0.4, 0.5, 0.9, 1] }} className="absolute mb-1">
                  <motion.div animate={{ y: [0, -60, 0, 0, 0, -60, 0], rotate: [0, 360, 360, 360, 360, 720, 720] }} transition={{ duration: totalCycle, repeat: Infinity, ease: "easeOut", times: [0, 0.2, 0.4, 0.5, 0.5, 0.7, 0.9] }} className="z-30">
                    <Ball />
                  </motion.div>
                </motion.div>
              </div>

              <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="origin-bottom absolute right-[25%]">
                <Penguin />
              </motion.div>
              <motion.div animate={{ y: [0, 0, -30, 0, 0], scaleY: [1, 1, 0.7, 1.2, 1] }} transition={{ duration: totalCycle, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.45, 0.48, 1] }} className="origin-bottom absolute right-0">
                <Penguin isKicking={true} />
              </motion.div>
            </div>

            <motion.div initial={{ x: 150, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} className="relative">
              <motion.div animate={{ x: [0, 40, 0], y: [0, -5, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} className="relative z-20">
                <Reindeer hasGifts={true} />
              </motion.div>
              <motion.div animate={{ x: [0, 40, 0], y: [0, -5, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} className="absolute top-0 left-0 opacity-20 blur-[2px] z-10">
                <Reindeer hasGifts={true} />
              </motion.div>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/40 blur-[2px] dark:bg-zinc-500/10 transition-colors duration-500" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FooterScene;
