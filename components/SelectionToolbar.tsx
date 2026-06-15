"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Check } from "lucide-react";
import { SiX } from "@icons-pack/react-simple-icons";
import { playTap } from "@/lib/sounds";

interface Position {
  x: number;
  y: number;
}

export default function SelectionToolbar({ slug }: { slug: string }) {
  const [selectedText, setSelectedText] = useState("");
  const [position, setPosition] = useState<Position | null>(null);
  const [copied, setCopied] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const postUrl = typeof window !== "undefined"
    ? `${window.location.origin}/blog/${slug}`
    : "";

  const handleSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      // Small delay before hiding to allow button clicks
      setTimeout(() => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed) {
          setSelectedText("");
          setPosition(null);
        }
      }, 150);
      return;
    }

    const text = selection.toString().trim();
    if (text.length < 5) return; // Ignore very short selections

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    setSelectedText(text);
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
    setCopied(false);
  }, []);

  useEffect(() => {
    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("touchend", handleSelection);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("touchend", handleSelection);
    };
  }, [handleSelection]);

  const shareOnX = () => {
    playTap();
    const quote = selectedText.length > 240
      ? selectedText.substring(0, 237) + "..."
      : selectedText;
    const tweetText = `"${quote}"\n\n${postUrl}`;
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const copyQuote = () => {
    playTap();
    const quote = `"${selectedText}"\n\n— ${postUrl}`;
    navigator.clipboard.writeText(quote).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {selectedText && position && (
        <motion.div
          ref={toolbarRef}
          initial={{ opacity: 0, y: 6, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="fixed z-[100] flex items-center gap-0.5 rounded-lg px-1 py-1 shadow-xl border"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: "translate(-50%, -100%)",
            background: "rgba(24, 24, 27, 0.95)",
            borderColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(12px)",
          }}
        >
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={shareOnX}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-zinc-300 hover:text-white hover:bg-white/10 transition-colors text-xs font-medium"
          >
            <SiX size={13} />
            <span>Tweet</span>
          </button>

          <div className="w-px h-4 bg-zinc-700" />

          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={copyQuote}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-zinc-300 hover:text-white hover:bg-white/10 transition-colors text-xs font-medium"
          >
            {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
