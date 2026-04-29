"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, PhoneCall, Plus } from "lucide-react";
import Image from "next/image";

export default function FloatingContactWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 15, scale: 0.95, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="mb-4 w-[290px] bg-white dark:bg-zinc-900 rounded-2xl shadow-[0_12px_40px_rgb(0,0,0,0.12)] border border-zinc-200 dark:border-zinc-800 p-6 origin-bottom-right"
          >
            {/* Dashed avatar pill */}
            <div className="inline-flex items-center gap-3 p-1.5 pr-4 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 mb-5 bg-zinc-50/50 dark:bg-zinc-800/30">
              <div className="relative w-9 h-9 rounded-md overflow-hidden bg-zinc-200 shrink-0">
                <Image src="/banner.jpg" alt="Avatar" fill className="object-cover" />
              </div>
              <div className="w-[1px] h-4 bg-zinc-200 dark:bg-zinc-700" />
              <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors w-6 h-6 flex items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800">
                <Plus size={14} />
              </button>
            </div>

            <p className="text-[16px] leading-[1.4] text-zinc-900 dark:text-zinc-100 font-medium mb-6">

              For the rest, there&apos;s me.
            </p>

            <div className="flex items-center gap-2.5">
              <a
                href="mailto:namansharmans03@gmail.com"
                className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-3 rounded-xl text-[14px] font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
              >
                Book a Call <PhoneCall size={14} />
              </a>
              <a
                href="https://t.me/NamanSharma2112"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 text-[#3b82f6] hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shrink-0"
              >
                <Send size={18} className="-ml-1 mt-1" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-16 h-16 bg-white dark:bg-zinc-800 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        aria-label="Toggle contact dialog"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="white" strokeWidth="1.5" className="text-zinc-800 dark:text-zinc-200">
          <path d="M4 4l7.07 17 2.51-7.39L21 11.07z" />
        </svg>
        <span className="absolute bottom-0 right-0 w-5 h-5 bg-[#cda766] border-2 border-white dark:border-zinc-800 rounded-full" />
      </button>
    </div>
  );
}
