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
    if (pathname === "/") {
      const timer = setTimeout(() => setIsVisible(true), 2600);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
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

      <div className="fixed bottom-6 right-6 z-[100]">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-black"
          aria-label="Open Chat"
        >
          {isOpen ? (
            <X size={20} className="text-black" />
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square text-black">
                <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"></path>
              </svg>
              <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-black border-2 border-white rounded-full" />
            </>
          )}
        </button>
      </div>
    </>
  );
}
