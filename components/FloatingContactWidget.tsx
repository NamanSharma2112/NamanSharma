"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Mail, X } from "lucide-react";
import { SiX as Twitter } from "@icons-pack/react-simple-icons";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { TiltCard } from "./tilt-card";

export default function FloatingContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (pathname === "/") {
      // Hide during initial loader animation
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2600);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [pathname]);

  if (!isVisible) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute -top-12 right-0 text-zinc-500 hover:text-black transition-colors bg-white/50 rounded-full p-2"
              >
                <X size={20} />
              </button>
              
              <TiltCard
                tiltLimit={10}
                scale={1.02}
                spotlight={true}
                className="w-[300px] h-auto bg-[#fafafa] rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col"
              >
                {/* Lanyard Hole */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-3 bg-zinc-200 rounded-full shadow-inner border border-zinc-300" />
                
                {/* Header */}
                <div className="mt-10 text-center pb-4 border-b border-zinc-200 px-6">
                  <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 mb-1">IDENTIFICATION</p>
                  <p className="font-mono text-sm font-semibold tracking-tight uppercase">Staff ID Card</p>
                </div>

                {/* Photo Area */}
                <div className="flex justify-center mt-5">
                  <div className="w-28 h-28 rounded-xl border-4 border-white shadow-sm overflow-hidden relative bg-zinc-200">
                    <Image src="/banner.jpg" alt="Naman Sharma" fill className="object-cover" />
                  </div>
                </div>

                {/* Details */}
                <div className="px-6 mt-5 mb-6 flex flex-col gap-2.5">
                  <div className="flex items-end gap-2 border-b border-zinc-200/60 pb-1.5">
                    <p className="w-[75px] text-[10px] font-bold text-zinc-400 uppercase tracking-wider shrink-0">Name</p>
                    <p className="font-semibold text-sm leading-none text-zinc-800">Naman Sharma</p>
                  </div>
                  <div className="flex items-end gap-2 border-b border-zinc-200/60 pb-1.5">
                    <p className="w-[75px] text-[10px] font-bold text-zinc-400 uppercase tracking-wider shrink-0">Occupation</p>
                    <p className="font-mono text-xs leading-none text-zinc-600">Design Engineer</p>
                  </div>
                  <div className="flex items-end gap-2 border-b border-zinc-200/60 pb-1.5">
                    <p className="w-[75px] text-[10px] font-bold text-zinc-400 uppercase tracking-wider shrink-0">ID No.</p>
                    <p className="font-mono text-xs leading-none text-zinc-600">NS-2112</p>
                  </div>
                  <div className="flex items-end gap-2 border-b border-zinc-200/60 pb-1.5">
                    <p className="w-[75px] text-[10px] font-bold text-zinc-400 uppercase tracking-wider shrink-0">Email</p>
                    <p className="font-mono text-[10.5px] leading-none text-zinc-600 truncate select-all" title="namansharmans03@gmail.com">namansharmans03@gmail.com</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto border-t border-zinc-200 bg-white/50 p-4 flex gap-2 relative z-20">
                  <a
                    href="mailto:namansharmans03@gmail.com"
                    className="flex-1 bg-black text-white rounded-lg py-2.5 flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors text-sm font-medium"
                  >
                    <Mail size={16} /> Email
                  </a>
                  <a
                    href="https://x.com/NamanSharma2112"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-lg py-2.5 flex items-center justify-center gap-2 hover:bg-[#1DA1F2]/20 transition-colors text-sm font-medium"
                  >
                    <Twitter size={16} /> Twitter
                  </a>
                </div>
              </TiltCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-[100]">
        <button
          onClick={() => setIsOpen(true)}
          className="relative w-14 h-14 bg-black rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          aria-label="Contact Me"
        >
          <MessageSquare size={24} className="text-white" />
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
        </button>
      </div>
    </>
  );
}
