"use client";

import type { ComponentShowcase } from "@/components/ComponentGrid";

function ShimmerButtonPreview() {
  return (
    <button
      className="relative inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-[14px] font-semibold text-white overflow-hidden border-none cursor-pointer"
      style={{
        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
        boxShadow: "0 4px 15px rgba(59,130,246,0.3)",
      }}
    >
      <span
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)",
          animation: "shimmer 2.5s infinite",
        }}
      />
      <span className="relative z-10">Shimmer Button</span>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </button>
  );
}

function PulsingDotPreview() {
  return (
    <div className="flex items-center gap-3">
      <span className="relative flex h-3 w-3">
        <span
          className="absolute inline-flex h-full w-full rounded-full opacity-75"
          style={{
            backgroundColor: "#22c55e",
            animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
          }}
        />
        <span
          className="relative inline-flex rounded-full h-3 w-3"
          style={{ backgroundColor: "#22c55e" }}
        />
      </span>
      <span className="text-[14px] text-zinc-600 font-medium">Online</span>
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

function LaptopCodeScreen({ visible }: { visible: boolean }) {
  const lines = [
    [{ t:"const",c:"#c678dd" },{ t:" app",c:"#e5c07b" },{ t:" = {",c:"#abb2bf" }],
    [{ t:"  name",c:"#e06c75" },{ t:": ",c:"#abb2bf" },{ t:"'Portfolio'",c:"#98c379" }],
    [{ t:"  stack",c:"#e06c75" },{ t:": ",c:"#abb2bf" },{ t:"['Next.js']",c:"#98c379" }],
    [{ t:"};",c:"#abb2bf" }],
  ];
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!visible) { setN(0); return; }
    const id = setInterval(() => setN(v => v >= lines.length ? v : v + 1), 180);
    return () => clearInterval(id);
  }, [visible, lines.length]);
  return (
    <div className="font-mono text-[7px] leading-[11px] p-1.5 h-full" style={{ background:"#1e1e2e" }}>
      <div className="flex gap-0.5 mb-1">
        <div className="w-1 h-1 rounded-full bg-[#ff5f57]" />
        <div className="w-1 h-1 rounded-full bg-[#febc2e]" />
        <div className="w-1 h-1 rounded-full bg-[#28c840]" />
      </div>
      {lines.slice(0, n).map((l, i) => (
        <div key={i} className="whitespace-pre">
          {l.map((tk, j) => <span key={j} style={{ color:tk.c }}>{tk.t}</span>)}
          {i === n - 1 && n < lines.length && <motion.span animate={{ opacity:[1,0] }} transition={{ repeat:Infinity, duration:.8 }} className="inline-block w-1 h-[8px] ml-px" style={{ background:"#528bff" }} />}
        </div>
      ))}
    </div>
  );
}

function LaptopPreview() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center justify-center py-4">
      <div className="relative cursor-pointer" style={{ width:180 }}
        onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
        <div style={{ perspective:400 }}>
          <motion.div className="relative w-full origin-bottom"
            animate={{ rotateX: open ? 0 : 90 }}
            transition={{ type:"spring", stiffness:70, damping:14, mass:.8 }}
            style={{ transformStyle:"preserve-3d" }}>
            <div className="w-full rounded-t-md overflow-hidden" style={{
              height:105, background:"#0c0c0c", border:"2px solid #2a2a2a", borderBottom:"none",
              boxShadow:"0 -2px 15px rgba(0,0,0,0.5),inset 0 0 0 3px #111" }}>
              <div className="absolute top-[4px] left-[4px] right-[4px] bottom-0 rounded-t-sm overflow-hidden">
                <LaptopCodeScreen visible={open} />
              </div>
              <div className="absolute top-[1px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-zinc-800" />
            </div>
          </motion.div>
        </div>
        <div className="relative w-full" style={{ height:6 }}>
          <div className="absolute inset-x-0 top-0 rounded-b-sm" style={{
            height:6, background:"linear-gradient(180deg,#888,#999 30%,#777)",
            boxShadow:"0 2px 6px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.3)" }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-[2px] rounded-b-sm" style={{ background:"#666" }} />
          </div>
        </div>
        <motion.div className="absolute -bottom-3 left-[20%] right-[20%] h-5 rounded-full pointer-events-none"
          animate={{ opacity: open ? 0.35 : 0 }} transition={{ duration:.5 }}
          style={{ background:"radial-gradient(ellipse,rgba(97,175,239,0.3),transparent)", filter:"blur(6px)" }} />
        <AnimatePresence>
          {!open && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="absolute -top-6 left-1/2 -translate-x-1/2">
              <motion.span animate={{ y:[0,-2,0] }} transition={{ repeat:Infinity, duration:1.5 }}
                className="text-[7px] text-zinc-500 tracking-wider uppercase bg-black/50 px-1.5 py-0.5 rounded-full">
                hover ↑
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const LAPTOP_CODE = `"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const CODE_LINES = [
  { indent: 0, tokens: [{ t: "const", c: "#c678dd" }, { t: " portfolio", c: "#e5c07b" }, { t: " = {", c: "#abb2bf" }] },
  { indent: 1, tokens: [{ t: "name", c: "#e06c75" }, { t: ": ", c: "#abb2bf" }, { t: "'Naman Sharma'", c: "#98c379" }, { t: ",", c: "#abb2bf" }] },
  { indent: 1, tokens: [{ t: "role", c: "#e06c75" }, { t: ": ", c: "#abb2bf" }, { t: "'Design Engineer'", c: "#98c379" }, { t: ",", c: "#abb2bf" }] },
  { indent: 1, tokens: [{ t: "stack", c: "#e06c75" }, { t: ": [", c: "#abb2bf" }, { t: "'Next.js'", c: "#98c379" }, { t: ", ", c: "#abb2bf" }, { t: "'TypeScript'", c: "#98c379" }, { t: "],", c: "#abb2bf" }] },
  { indent: 0, tokens: [{ t: "};", c: "#abb2bf" }] },
  { indent: 0, tokens: [] },
  { indent: 0, tokens: [{ t: "export default", c: "#c678dd" }, { t: " function", c: "#c678dd" }, { t: " create", c: "#61afef" }, { t: "() {", c: "#abb2bf" }] },
  { indent: 1, tokens: [{ t: "return", c: "#c678dd" }, { t: " magic", c: "#61afef" }, { t: "(portfolio);", c: "#abb2bf" }] },
  { indent: 0, tokens: [{ t: "}", c: "#abb2bf" }] },
];

function CodeScreen({ visible }: { visible: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!visible) { setN(0); return; }
    const id = setInterval(() => setN(v => v >= CODE_LINES.length ? v : v + 1), 150);
    return () => clearInterval(id);
  }, [visible]);
  return (
    <div className="font-mono text-[9px] leading-[15px] p-2.5 h-full" style={{ background: "#1e1e2e" }}>
      <div className="flex gap-1 mb-2">
        <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
        <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
        <div className="w-2 h-2 rounded-full bg-[#28c840]" />
        <span className="text-[7px] text-zinc-500 ml-1">portfolio.ts</span>
      </div>
      {CODE_LINES.slice(0, n).map((line, i) => (
        <div key={i} className="whitespace-pre flex" style={{ paddingLeft: line.indent * 14 }}>
          <span className="text-zinc-600 w-5 text-right mr-2 select-none text-[7px]">{i + 1}</span>
          {line.tokens.map((tk, j) => <span key={j} style={{ color: tk.c }}>{tk.t}</span>)}
          {i === n - 1 && n < CODE_LINES.length && (
            <span className="inline-block w-[6px] h-[12px] ml-0.5 animate-pulse" style={{ background: "#528bff" }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function MacBookLaptop() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative cursor-pointer" style={{ width: 320 }}
        onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
        <div style={{ perspective: 600 }}>
          <motion.div className="relative w-full origin-bottom"
            animate={{ rotateX: open ? 0 : 90 }}
            transition={{ type: "spring", stiffness: 70, damping: 14, mass: 0.8 }}
            style={{ transformStyle: "preserve-3d" }}>
            <div className="w-full rounded-t-lg overflow-hidden" style={{
              height: 195, background: "#0c0c0c",
              border: "2px solid #2a2a2a", borderBottom: "none",
              boxShadow: "0 -2px 20px rgba(0,0,0,0.5), inset 0 0 0 4px #111",
            }}>
              <div className="absolute top-[6px] left-[6px] right-[6px] bottom-0 rounded-t-md overflow-hidden">
                <CodeScreen visible={open} />
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(165deg, rgba(255,255,255,0.04), transparent 40%)" }} />
              </div>
              <div className="absolute top-[2px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-zinc-800 ring-1 ring-zinc-700" />
            </div>
          </motion.div>
        </div>
        <div className="relative w-full" style={{ height: 10 }}>
          <div className="absolute inset-x-0 top-0 rounded-b-md" style={{
            height: 10, background: "linear-gradient(180deg, #888, #999 30%, #777)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
          }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[3px] rounded-b-sm"
              style={{ background: "#666", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)" }} />
          </div>
        </div>
        <motion.div className="absolute -bottom-4 left-[15%] right-[15%] h-8 rounded-full pointer-events-none"
          animate={{ opacity: open ? 0.4 : 0 }} transition={{ duration: 0.6 }}
          style={{ background: "radial-gradient(ellipse, rgba(97,175,239,0.3), rgba(124,58,237,0.15), transparent)", filter: "blur(8px)" }} />
        <AnimatePresence>
          {!open && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute -top-8 left-1/2 -translate-x-1/2">
              <motion.span animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2 }}
                className="text-[9px] text-zinc-500 tracking-widest uppercase bg-black/60 px-2 py-1 rounded-full backdrop-blur-sm border border-zinc-800/50">
                hover to open ↑
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}`;

export const COMPONENTS: ComponentShowcase[] = [
  {
    name: "Shimmer Button",
    slug: "shimmer-button",
    description:
      "A gradient button with a traveling shimmer highlight effect. Great for primary CTAs that need extra visual attention.",
    tag: "Button",
    preview: <ShimmerButtonPreview />,
    code: `"use client";

import { ReactNode } from "react";

interface ShimmerButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function ShimmerButton({
  children,
  className = "",
  onClick,
}: ShimmerButtonProps) {
  return (
    <>
      <button
        onClick={onClick}
        className={\`relative inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-[14px] font-semibold text-white overflow-hidden border-none cursor-pointer \${className}\`}
        style={{
          background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          boxShadow: "0 4px 15px rgba(59,130,246,0.3)",
        }}
      >
        <span
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)",
            animation: "shimmer 2.5s infinite",
          }}
        />
        <span className="relative z-10">{children}</span>
      </button>
      <style>{\`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      \`}</style>
    </>
  );
}`,
  },
  {
    name: "Pulsing Dot Badge",
    slug: "pulsing-dot-badge",
    description:
      "A status indicator with a pulsing animation. Use it to show online status, active connections, or live updates.",
    tag: "Status",
    preview: <PulsingDotPreview />,
    code: `"use client";

interface PulsingDotBadgeProps {
  label?: string;
  color?: string;
  className?: string;
}

export default function PulsingDotBadge({
  label = "Online",
  color = "#22c55e",
  className = "",
}: PulsingDotBadgeProps) {
  return (
    <>
      <div className={\`flex items-center gap-3 \${className}\`}>
        <span className="relative flex h-3 w-3">
          <span
            className="absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{
              backgroundColor: color,
              animation: "pulse-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
            }}
          />
          <span
            className="relative inline-flex rounded-full h-3 w-3"
            style={{ backgroundColor: color }}
          />
        </span>
        {label && (
          <span className="text-[14px] text-zinc-600 font-medium">
            {label}
          </span>
        )}
      </div>
      <style>{\`
        @keyframes pulse-ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      \`}</style>
    </>
  );
}`,
  },
  {
    name: "MacBook Laptop",
    slug: "macbook-laptop",
    description:
      "A CSS MacBook that starts closed and opens on hover with spring physics. The screen shows syntax-highlighted code typing out line by line.",
    tag: "Interactive",
    preview: <LaptopPreview />,
    code: LAPTOP_CODE,
  },
];
