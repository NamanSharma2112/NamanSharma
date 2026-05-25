"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "motion/react";
import Headphone from "./Headphone";

// ── Live clock ────────────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-mono text-zinc-500 text-[13px] tracking-widest tabular-nums">
      {time}
    </span>
  );
}

// ── Drop tags ─────────────────────────────────────────────────────────
const TAGS = [
  { label: "Design Engineer", icon: "✦", bg: "#a8e6cf", color: "#1a4a35", rotate: -6, side: "left"  as const, delay: 0.08 },
  { label: "Ships fast",      icon: "⚡", bg: "#fde68a", color: "#78350f", rotate:  5, side: "right" as const, delay: 0.20 },
];

// ── Shared constants ──────────────────────────────────────────────────
const NAME_FONT: React.CSSProperties = {
  fontSize: "clamp(4.5rem, 13vw, 10rem)",
  lineHeight: 0.9,
  letterSpacing: "-0.04em",
  fontWeight: 900,
  textTransform: "uppercase",
};

const PAD = "96px 80px 96px 80px";

const CORNERS = [
  { top:    0, left:  0, transform: "translate(-50%,-50%)" },
  { top:    0, right: 0, transform: "translate(50%,-50%)"  },
  { bottom: 0, left:  0, transform: "translate(-50%,50%)"  },
  { bottom: 0, right: 0, transform: "translate(50%,50%)"   },
] as const;

// ── Bio text (used in overlay + invisible placeholder) ────────────────
function BioText({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{ maxWidth: 560, ...style }}>
      <p style={{ color: "rgba(96,165,250,0.85)", fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>
        I&apos;m Naman, a{" "}
        <span style={{ color: "#93c5fd", fontWeight: 600 }}>Design Engineer</span>.
        I design and build whatever I can imagine or get inspiration from social media like{" "}
        <a href="https://x.com/NamanSharma2112" target="_blank" rel="noopener noreferrer"
           style={{ color: "#60a5fa", textDecoration: "underline" }}>X</a>.
      </p>
      <p style={{ color: "rgba(161,161,170,0.7)", fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>
        If an idea pops into my head, I&apos;ll build it and ship it. My current main tech stack is{" "}
        <span style={{ color: "rgba(228,228,231,0.9)" }}>React, Next.js, TypeScript, Tailwind CSS, Motion.dev</span>{" "}
        and <span style={{ color: "rgba(228,228,231,0.9)" }}>Claude</span>.
      </p>
      <p style={{ color: "rgba(113,113,122,0.8)", fontSize: 14, lineHeight: 1.7 }}>
        I usually make any design idea in my mind and try to replicate its structure on{" "}
        <a href="https://excalidraw.com" target="_blank" rel="noopener noreferrer"
           style={{ color: "rgba(161,161,170,0.85)", textDecoration: "underline" }}>ExcaliDraw</a>{" "}
        before I code it.
      </p>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────
export default function HeroName() {
  const boxRef   = useRef<HTMLDivElement>(null);
  const [cursorY, setCursorY] = useState<number | null>(null);
  const [isInBox, setIsInBox] = useState(false);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    setCursorY(Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)));
  }, []);

  const onMouseLeave = useCallback(() => {
    setIsInBox(false);
    setCursorY(null);
  }, []);

  // Layer A (solid white name) — clip HIDES the top Y% → bottom portion stays
  const solidClip = cursorY !== null
    ? `inset(${cursorY.toFixed(2)}% 0 0 0)`
    : "inset(0 0 0 0)"; // fully visible when not hovering

  // Layer B (bio reveal) — clip HIDES the bottom (100-Y)% → top Y% shows
  // Hidden entirely when cursor is out
  const bioClip = cursorY !== null
    ? `inset(0 0 ${(100 - cursorY).toFixed(2)}% 0)`
    : "inset(0 0 100% 0)";

  return (
    <div
      className="relative w-full flex flex-col items-center justify-center min-h-screen custom-bg overflow-hidden select-none"
      // Push all content below the fixed nav (nav is top-5 ~20px + ~44px height = 80px clear)
      style={{ paddingTop: 88 }}
    >

      {/* ── Drop tags ── */}
      {TAGS.map((tag) => (
        <motion.div
          key={tag.label}
          initial={{ y: -140, opacity: 0, rotate: tag.rotate }}
          animate={{ y: 0, opacity: 1, rotate: tag.rotate }}
          transition={{ type: "spring", stiffness: 250, damping: 16, mass: 1, delay: tag.delay }}
          className={`absolute pointer-events-none z-10 ${
            tag.side === "left"  ? "top-[18%] left-[5%] md:left-[9%]"
                                 : "top-[18%] right-[5%] md:right-[9%]"
          }`}
        >
          <div
            style={{
              background: tag.bg, color: tag.color,
              fontFamily: "Georgia, serif",
              padding: "8px 16px", borderRadius: 8,
              fontSize: 13, fontWeight: 600,
              boxShadow: "0 10px 30px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.25)",
            }}
          >
            {tag.icon}&nbsp;{tag.label}
          </div>
        </motion.div>
      ))}

      {/* ── Animated Headphone Face ── */}
      <motion.div
        initial={{ y: 140, opacity: 0, rotate: -8 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 250, damping: 16, mass: 1, delay: 0.35 }}
        className="absolute bottom-[10%] left-[5%] md:left-[9%] z-10 pointer-events-none"
      >
        <Headphone />
      </motion.div>

      {/* ── Clock + "my name is" — sits below nav with extra breathing room ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.6 }}
        className="flex flex-col items-center gap-2 z-10"
        style={{ marginBottom: 48 }}
      >
        <LiveClock />
        <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: "rgba(113,113,122,0.9)", fontSize: 15, letterSpacing: "0.03em" }}>
          my name is
        </p>
      </motion.div>

      {/* ════════════════════════════════════════
          NAME BOX
      ════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        ref={boxRef}
        className="relative z-10 cursor-crosshair"
        onMouseMove={onMouseMove}
        onMouseEnter={() => setIsInBox(true)}
        onMouseLeave={onMouseLeave}
      >
        {/* Corner handles + outline */}
        <div
          className="absolute pointer-events-none z-30"
          style={{
            inset: "-14px",
            outline: isInBox ? "1.5px solid rgba(96,165,250,0.8)" : "1.5px solid rgba(107,114,128,0.22)",
            transition: "outline-color 0.3s ease",
          }}
        >
          {CORNERS.map((pos, i) => (
            <div key={i} className="absolute w-2.5 h-2.5 rounded-[2px]"
              style={{ ...pos, background: isInBox ? "#60a5fa" : "rgba(107,114,128,0.35)", transition: "background 0.3s ease" }}
            />
          ))}
        </div>

        {/* ── Dark base background ── */}
        <div className="absolute inset-0" style={{ background: "#0c0c0e" }} />

        {/* ── INVISIBLE PLACEHOLDER — gives the container its correct height ──
            Contains name + bio in a grid so they overlap and the box takes the max height of either */}
        <div aria-hidden style={{ padding: PAD, visibility: "hidden", pointerEvents: "none", display: "grid" }}>
          <div style={{ gridArea: "1 / 1" }}>
            <h1 style={NAME_FONT}>Naman<br />Sharma</h1>
          </div>
          <div style={{ gridArea: "1 / 1", display: "flex", alignItems: "center" }}>
            <BioText />
          </div>
        </div>

        {/* ── LAYER A: Solid white name ────────────────────────────────────────
            Clips from top → white name disappears downward as cursor moves down */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-center" style={{ clipPath: solidClip, padding: PAD }}>
          <h1 style={{ ...NAME_FONT, color: "#f0f0f2" }}>
            Naman<br />Sharma
          </h1>
        </div>

        {/* ── LAYER B: Bio text reveal ─────────────────────────────────────────
            Blue-dark bg, bio text only — NO duplicate name.
            Clips from bottom → bio reveals top-to-bottom as cursor moves down  */}
        <div
          className="absolute inset-0 z-10"
          style={{
            clipPath: bioClip,
            pointerEvents: cursorY !== null ? "auto" : "none",
          }}
        >
          {/* Blue-dark tinted background */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(170deg, #040a18 0%, #070f22 60%, #040810 100%)" }}
          />
          <div className="relative h-full flex flex-col justify-center" style={{ padding: PAD }}>
            <BioText />
          </div>
        </div>

        {/* ── Split line ── */}
        {cursorY !== null && (
          <div
            className="absolute left-0 right-0 pointer-events-none z-40"
            style={{
              top: `${cursorY}%`,
              height: "1px",
              background: "linear-gradient(to right, transparent 0%, #2563eb 10%, #93c5fd 50%, #2563eb 90%, transparent 100%)",
              boxShadow: "0 0 4px rgba(96,165,250,0.8), 0 0 14px rgba(96,165,250,0.3)",
            }}
          />
        )}
      </motion.div>

      {/* ── Available indicator — sits BELOW the name box with enough gap ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.6 }}
        className="z-10 flex items-center gap-2"
        style={{ marginTop: 32 }}
      >
        <span className="relative flex" style={{ width: 8, height: 8 }}>
          <span className="animate-ping absolute inline-flex rounded-full bg-emerald-400 opacity-75" style={{ inset: 0 }} />
          <span className="relative inline-flex rounded-full bg-emerald-500" style={{ width: 8, height: 8 }} />
        </span>
        <span style={{ color: "rgba(113,113,122,0.85)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 }}>
          Available for thoughtful projects
        </span>
      </motion.div>

      {/* ── Bottom hint ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute z-10"
        style={{ bottom: 28, color: "rgba(63,63,70,0.8)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}
      >
        move cursor over name ↑
      </motion.p>
    </div>
  );
}
