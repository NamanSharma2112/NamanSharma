"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import BunnyIcon from "@/components/BunnyIcon";

function LetsTalkButton() {
  const ref = useRef<HTMLAnchorElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [pressed, setPressed] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTilt({
      rotateX: ((y - rect.height / 2) / (rect.height / 2)) * -15,
      rotateY: ((x - rect.width / 2) / (rect.width / 2)) * 15,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div style={{ perspective: "600px" }}>
      <motion.a
        ref={ref}
        href="mailto:naman@example.com"
        className="relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-semibold text-white no-underline select-none"
        style={{
          background: "linear-gradient(135deg, #3b82f6, #2563eb)",
          boxShadow: pressed
            ? "0 1px 2px rgba(37,99,235,0.3), inset 0 1px 1px rgba(0,0,0,0.1)"
            : "0 4px 14px rgba(37,99,235,0.35), 0 2px 4px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)",
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          scale: pressed ? 0.95 : 1,
          y: pressed ? 2 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 18, mass: 0.4 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
      >
        {/* Shine overlay */}
        <span
          className="pointer-events-none absolute inset-0 rounded-lg"
          style={{
            background: "linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, transparent 50%)",
          }}
        />
        <span className="relative z-10 flex items-center gap-1.5">
          💬 Let&apos;s Talk
        </span>
      </motion.a>
    </div>
  );
}

export default function PortfolioHeader({ name }: { name: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const formatted = now
    ? now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) +
      ", " +
      now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  return (
    <header className="mb-6 animate-[fadeUp_0.7s_cubic-bezier(0.22,1,0.36,1)_0.05s_backwards]">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-base font-medium tracking-tight text-zinc-900">
            {name}
          </h1>
          <BunnyIcon size={28} color="#444" />
        </div>
        <LetsTalkButton />
      </div>
      <p className="text-[13px] text-zinc-400 font-normal tabular-nums">
        {formatted ? `Updated ${formatted}` : "\u00A0"}
      </p>
    </header>
  );
}
