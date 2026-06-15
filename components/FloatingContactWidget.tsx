"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Mail, X } from "lucide-react";
import { SiX as Twitter } from "@icons-pack/react-simple-icons";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { TiltCard } from "./tilt-card";
import { QRCode, QRCodeSvg } from "@/components/ui/qr-code";

const vCardData = [
  "BEGIN:VCARD",
  "VERSION:3.0",
  "FN:Naman Sharma",
  "TEL;TYPE=CELL:9872029716",
  "EMAIL:namansharmans03@gmail.com",
  "URL:https://namansharma.com",
  "END:VCARD"
].join("\r\n");

export default function FloatingContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Focus close button after a small mount tick
      const timer = setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else if (isVisible) {
      // Return focus to the trigger button when card closes
      triggerRef.current?.focus();
    }
  }, [isOpen, isVisible]);

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
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-card-title"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative"
            >
              <button 
                ref={closeBtnRef}
                onClick={() => setIsOpen(false)}
                className="absolute -top-12 right-0 text-zinc-500 hover:text-black transition-colors bg-white/50 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-black"
                aria-label="Close contact card"
              >
                <X size={20} />
              </button>
              
              <TiltCard
                tiltLimit={10}
                scale={1.02}
                spotlight={true}
                className="w-[340px] h-auto bg-[#fafafa] rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col"
              >
                {/* Lanyard Hole */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-3 bg-zinc-200 rounded-full shadow-inner border border-zinc-300" />
                
                {/* Header */}
                <div className="mt-10 text-center pb-4 border-b border-zinc-200 px-6">
                  <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 mb-1">IDENTIFICATION</p>
                  <p id="contact-card-title" className="font-mono text-sm font-semibold tracking-tight uppercase">Staff ID Card</p>
                </div>

                {/* Photo Area with QR Code Reveal on Hover */}
                <div className="flex justify-center mt-5 group cursor-crosshair">
                  <div className="relative w-32 h-32">
                    {/* Invisible Hover Extender */}
                    <div className="absolute -inset-8 z-30" />
                    
                    {/* Front: Photo */}
                    <div className="absolute inset-0 rounded-xl border-4 border-white shadow-sm overflow-hidden bg-zinc-200 transition-all duration-300 group-hover:scale-95 group-hover:opacity-0 group-hover:-rotate-3">
                      <Image src="/banner.jpg" alt="Naman Sharma" fill className="object-cover" />
                    </div>
                    {/* Back: QR Code */}
                    <div className="absolute inset-0 rounded-xl border-4 border-white shadow-sm bg-white flex items-center justify-center opacity-0 scale-95 rotate-3 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 group-hover:rotate-0">
                      <div className="w-full h-full p-2.5">
                        <QRCode value={vCardData}>
                          <QRCodeSvg className="w-full h-full text-black" />
                        </QRCode>
                      </div>
                    </div>

                    {/* Hand-drawn Arrow and Text */}
                    <div className="absolute top-1/2 -right-4 -translate-y-1/2 translate-x-full pointer-events-none flex items-center gap-1 z-20">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="-translate-y-1 -rotate-12 shrink-0">
                        <path d="M4 14s2-6 8-4" />
                        <path d="M4 14l3.5-2" />
                        <path d="M4 14l1.5-3.5" />
                      </svg>
                      <div className="relative flex items-center justify-center -translate-y-0.5">
                        <span className="font-sans text-[11px] font-bold text-red-500 -rotate-3 z-10 px-1.5 whitespace-nowrap transition-opacity duration-300 group-hover:opacity-0">Hover me</span>
                        <span className="absolute font-sans text-[11px] font-bold text-red-500 -rotate-3 z-10 px-1.5 whitespace-nowrap transition-opacity duration-300 opacity-0 group-hover:opacity-100">Scan me!</span>
                        {/* Messy hand-drawn circle */}
                        <svg className="absolute inset-0 w-[120%] h-[150%] -left-[10%] -top-[25%] text-red-500 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <path d="M 20 50 C 10 20 80 10 90 40 C 100 70 30 90 10 60 C 0 45 40 15 50 20" />
                        </svg>
                      </div>
                    </div>
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
          ref={triggerRef}
          onClick={() => setIsOpen(true)}
          className="relative w-14 h-14 bg-black rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          aria-label="Contact Me"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        >
          <MessageSquare size={24} className="text-white" />
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
        </button>
      </div>
    </>
  );
}
