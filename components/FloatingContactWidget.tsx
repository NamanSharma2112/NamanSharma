"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, ArrowUp } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

type Message = {
  id: string;
  text: string;
  sender: "me" | "user";
};

export default function FloatingContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Hey there! 👋", sender: "me" },
    { id: "2", text: "Thanks for checking out my portfolio. What brings you here today?", sender: "me" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    // The desktop is a machine of its own — it brings a taskbar to that corner
    // and nothing from the site should be floating over it.
    if (pathname.startsWith("/desktop")) {
      setIsVisible(false);
      return;
    }
    if (pathname === "/") {
      const timer = setTimeout(() => setIsVisible(true), 2600);
      return () => clearTimeout(timer);
    }
    setIsVisible(true);
  }, [pathname]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), text: inputValue.trim(), sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate auto-reply
    setTimeout(() => {
      setIsTyping(false);
      const replyMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm currently away from my desk, but if you leave your email, I'll get back to you ASAP! You can also shoot me a DM on Twitter.",
        sender: "me",
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 2000);
  };

  if (!isVisible) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-[110] w-[340px] max-w-[calc(100vw-48px)] flex flex-col overflow-hidden rounded-2xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/95 dark:bg-[#111110]/95 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-black/20">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700">
                  <Image src="/banner.jpg" alt="Naman Sharma" fill className="object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-none">Naman Sharma</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-none">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 h-[300px]">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[85%] px-4 py-2 rounded-2xl text-[14px] leading-relaxed ${
                      msg.sender === "user" 
                        ? "bg-white text-black rounded-tr-sm" 
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-sm border border-zinc-200/50 dark:border-zinc-700/50"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center border border-zinc-200/50 dark:border-zinc-700/50">
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-[#111110]/50">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="iMessage"
                  className="w-full bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 transition-shadow"
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="absolute right-1 w-8 h-8 flex items-center justify-center rounded-full bg-white text-black disabled:opacity-50 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 transition-colors"
                >
                  <ArrowUp size={16} strokeWidth={2.5} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The overhead console: a call button that lights when pressed, the
          way the crew-call switch above a seat does. */}
      <div className="fixed bottom-6 right-6 z-[100]">
        <span className="call-console flex items-center gap-2 rounded-full p-1.5">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Close chat" : "Call the cabin"}
            aria-pressed={isOpen}
            className={`call-button relative grid size-10 place-items-center rounded-full ${
              isOpen ? "is-lit" : ""
            }`}
          >
            {isOpen ? (
              <X size={17} className="text-zinc-900" />
            ) : (
              <>
                <AttendantGlyph />
                {/* The little service light, on until you have called. */}
                <span className="call-dot absolute right-1 top-1 size-2 rounded-full" />
              </>
            )}
          </button>
        </span>
      </div>
    </>
  );
}

/**
 * The cabin-crew symbol: a figure with a tray, the one printed on the call
 * button above every seat.
 */
function AttendantGlyph() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden className="text-zinc-900">
      <circle cx="11" cy="4.4" r="2.1" fill="currentColor" />
      <path
        d="M8.4 21.6v-5.2H7.2V11a2.6 2.6 0 0 1 2.6-2.6h2.4a2.6 2.6 0 0 1 2.6 2.6v.6l3.4-1.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.6 21.6v-5.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      {/* The tray, held out. */}
      <rect x="16.4" y="8.6" width="6" height="1.5" rx="0.75" fill="currentColor" />
    </svg>
  );
}
