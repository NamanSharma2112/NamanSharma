"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

const CONTACT_LINKS = [
  { name: "Email", href: "mailto:hello@example.com", icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
  ) },
  { name: "Twitter", href: "#", icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
  ) },
  { name: "GitHub", href: "#", icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
  ) },
];

export default function ContactFloating() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 flex flex-col items-end gap-3 pointer-events-auto"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 15, scale: 0.9, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex flex-col gap-2.5 mb-1"
          >
            {CONTACT_LINKS.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: i * 0.04, type: "spring", stiffness: 300, damping: 20 }}
                className="group flex items-center gap-3 bg-zinc-900/90 backdrop-blur-xl border border-white/10 pl-4 pr-2 py-1.5 rounded-full text-[13px] font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all shadow-xl hover:border-white/20 origin-right"
                whileHover={{ scale: 1.05 }}
              >
                <span>{link.name}</span>
                <span className="p-2 bg-white/5 rounded-full group-hover:bg-blue-500 transition-colors">
                  {link.icon}
                </span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-[1.5px] border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] bg-zinc-900 flex items-center justify-center cursor-pointer group"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Avatar Image */}
        <img 
          src="/avatar.png" // Save your uploaded image to public/avatar.png
          alt="Contact Me" 
          className="w-full h-full object-cover relative z-10"
          style={{ backfaceVisibility: "hidden", transform: "translateZ(0)" }}
          onError={(e) => {
            // Fallback if the image hasn't been added to /public yet
            e.currentTarget.src = "https://api.dicebear.com/7.x/notionists/svg?seed=Naman";
          }}
        />

        {/* Online Status Dot */}
        <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-zinc-900 rounded-full z-20" />
      </motion.button>
    </div>
  );
}
