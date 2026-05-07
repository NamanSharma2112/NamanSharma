"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";

/* ── Code screen content ── */
const CODE = [
  { t: "const naman = {", c: "#abb2bf" },
  { t: "  role: 'Design Engineer',", c: "#98c379" },
  { t: "  stack: ['Next.js','TS'],", c: "#e5c07b" },
  { t: "  passion: 'building',", c: "#61afef" },
  { t: "};", c: "#abb2bf" },
];

function Screen({ open }: { open: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!open) { setN(0); return; }
    const t = setTimeout(() => {
      const id = setInterval(() => setN(v => { if (v >= CODE.length) { clearInterval(id); return v; } return v + 1; }), 220);
      return () => clearInterval(id);
    }, 500);
    return () => clearTimeout(t);
  }, [open]);
  return (
    <div className="w-full h-full p-3" style={{ background: "linear-gradient(135deg,#1a1a2e,#16213e)" }}>
      <div className="flex gap-1 mb-2">
        {["#ff5f57","#febc2e","#28c840"].map(c=><div key={c} style={{width:7,height:7,borderRadius:"50%",background:c}}/>)}
        <span className="ml-1 font-mono text-[8px] text-zinc-500">portfolio.ts</span>
      </div>
      {CODE.slice(0,n).map((l,i)=>(
        <div key={i} className="font-mono text-[10px] leading-[17px]" style={{color:l.c}}>{l.t}</div>
      ))}
      {n>0&&n<CODE.length&&(
        <motion.span animate={{opacity:[1,0]}} transition={{repeat:Infinity,duration:.7}}
          className="inline-block" style={{width:5,height:11,background:"#528bff",verticalAlign:"middle"}}/>
      )}
    </div>
  );
}

/* ── Single key with press animation ── */
function Key({ label, flex, tall }: { label: string; flex: number; tall?: boolean }) {
  const [pressed, setPressed] = useState(false);
  return (
    <motion.div
      onMouseEnter={() => setPressed(true)}
      onMouseLeave={() => setPressed(false)}
      animate={pressed ? { y: 1, background: "linear-gradient(180deg,#2a2a2a,#1e1e1e)" } : { y: 0, background: "linear-gradient(180deg,#363636,#272727)" }}
      transition={{ duration: 0.06 }}
      className="flex items-center justify-center rounded select-none cursor-pointer relative"
      style={{
        flex,
        height: tall ? 44 : 22,
        minWidth: 0,
        fontSize: 7,
        color: "rgba(255,255,255,0.65)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontWeight: 500,
        letterSpacing: 0,
        boxShadow: pressed
          ? "0 0 0 #0a0a0a, inset 0 1px 0 rgba(255,255,255,0.04)"
          : "0 1.5px 0 #0a0a0a, inset 0 1px 0 rgba(255,255,255,0.07)",
        border: "0.5px solid rgba(255,255,255,0.06)",
        borderRadius: 3,
        userSelect: "none",
        lineHeight: 1,
      }}
    >
      {label}
    </motion.div>
  );
}

/* ── Mac keyboard rows ── */
// Each key: [label, flex-weight]
const ROWS: [string, number][][] = [
  // Number row
  [["ESC",1.1],["1",1],["2",1],["3",1],["4",1],["5",1],["6",1],["7",1],["8",1],["9",1],["0",1],["-",1],["=",1],["⌫",1.7]],
  // QWERTY
  [["⇥",1.5],["Q",1],["W",1],["E",1],["R",1],["T",1],["Y",1],["U",1],["I",1],["O",1],["P",1],["[",1],["]",1],["\\",1.4]],
  // ASDF
  [["⇪",1.8],["A",1],["S",1],["D",1],["F",1],["G",1],["H",1],["J",1],["K",1],["L",1],[";",1],["'",1],["↵",2.1]],
  // ZXCV
  [["⇧",2.3],["Z",1],["X",1],["C",1],["V",1],["B",1],["N",1],["M",1],[",",1],[".",1],["/",1],["⇧",2.8]],
  // Bottom row
  [["fn",1],["⌃",1],["⌥",1],["⌘",1.4],["",5.2],["⌘",1.4],["⌥",1],["←",0.75],["↑",0.75],["↓",0.75],["→",0.75]],
];

function Keyboard({ open }: { open: boolean }) {
  return (
    <div className="absolute flex flex-col gap-[3px]" style={{ top: 14, left: 18, right: 18 }}>
      {/* Touch bar */}
      <div className="flex items-center gap-px rounded overflow-hidden" style={{ height: 9, background: "#181818", border: "0.5px solid #2a2a2a", padding: "0 4px" }}>
        {Array.from({ length: 32 }).map((_, i) => (
          <motion.div key={i} className="flex-1 rounded-sm"
            animate={{ background: open ? `hsl(${i * 11},70%,50%)` : "#252525" }}
            transition={{ delay: open ? 0.7 + i * 0.02 : 0, duration: 0.3 }}
            style={{ height: 5 }} />
        ))}
      </div>
      {/* Key rows */}
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex gap-[3px]">
          {row.map(([label, flex], ki) => (
            <Key key={`${ri}-${ki}`} label={label} flex={flex} />
          ))}
        </div>
      ))}
      {/* Spacebar label */}
    </div>
  );
}

/* ── Main DeskHero ── */
export default function DeskHero() {
  const [open, setOpen] = useState(false);
  const W = 500, LID = 300, BASE = 220;

  return (
    <section
      className="relative w-full flex items-center justify-center rounded-2xl mb-10 overflow-hidden"
      style={{ background: "radial-gradient(ellipse 70% 60% at 50% 30%,#141414,#0a0a0a)", minHeight: 480, paddingTop: 120, paddingBottom: 40, alignItems: "flex-end" }}
    >
      {/* Desk glow */}
      <motion.div animate={{ opacity: open ? 0.4 : 0 }} transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute pointer-events-none"
        style={{ bottom:"8%", left:"18%", right:"18%", height:70,
          background:"radial-gradient(ellipse,rgba(82,139,255,0.3),rgba(124,58,237,0.12),transparent)",
          filter:"blur(22px)" }} />

      {/* 3D perspective container — hover triggers open */}
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        style={{ perspective: 900, perspectiveOrigin: "50% 40%", cursor: "pointer" }}
      >
        <div style={{ transformStyle: "preserve-3d", transform: "rotateX(4deg)" }}>

          {/* ── LID: positioned above base, hinge at its bottom edge ── */}
          <motion.div
            animate={{ rotateX: open ? -12 : 90 }}
            transition={{ type: "spring", stiffness: 44, damping: 15, mass: 1.2 }}
            style={{
              position: "absolute", top: -LID, left: 0,
              width: W, height: LID,
              transformOrigin: "bottom center",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Front face = Screen (visible when open) */}
            <div className="absolute inset-0 overflow-hidden"
              style={{ borderRadius: "10px 10px 0 0", background: "#111",
                border: "2px solid #2a2a2a", borderBottom: "none",
                boxShadow: "0 -4px 30px rgba(0,0,0,0.6), inset 0 0 0 9px #0d0d0d",
                backfaceVisibility: "hidden" }}>
              <div className="absolute rounded-t-md overflow-hidden" style={{ top:9,left:9,right:9,bottom:0 }}>
                <Screen open={open} />
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(160deg,rgba(255,255,255,0.035),transparent 40%)" }} />
              </div>
              <div className="absolute rounded-full" style={{ top:4,left:"50%",transform:"translateX(-50%)",width:5,height:5,background:"#1a1a1a",border:"1px solid #2a2a2a" }} />
            </div>

            {/* Back face = Apple logo lid (visible when closed) */}
            <div className="absolute inset-0"
              style={{ borderRadius: "10px 10px 0 0",
                background: "linear-gradient(160deg,#3d3d3d,#2b2b2b 50%,#222)",
                border: "1.5px solid rgba(255,255,255,0.07)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                transform: "rotateX(180deg)", backfaceVisibility: "hidden" }}>
              {Array.from({length:22}).map((_,i)=>(
                <div key={i} className="absolute inset-x-0" style={{top:i*14,height:1,background:"rgba(255,255,255,0.01)"}}/>
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="30" height="36" viewBox="0 0 32 38" fill="none">
                  <path d="M26 29c-1 2.2-1.5 3.2-2.8 5.2-1.9 2.7-4.4 6-7.6 6.1-2.8.1-3.5-1.8-7.3-1.7-3.8 0-4.6 1.8-7.3 1.7C-2 40 5 24.5 8.5 20.2c1.7-2.2 3.8-3.5 6-3.5 2.3 0 3.8 1.8 7.3 1.7 3.4 0 4.6-1.8 7.4-1.8 2 0 3.9 1 5.4 2.8-4.8 2.6-4 9.3.7 11.3zm-7.8-21c1.4-1.7 2.4-4.2 2.1-6.7-2.3.2-5 1.6-6.5 3.5-1.6 1.7-2.8 4.2-2.3 6.7 2.6.1 5.2-1.3 7.2-3.5z"
                    fill="rgba(255,255,255,0.22)"/>
                </svg>
              </div>
            </div>
          </motion.div>

          {/* ── BASE: keyboard body ── */}
          <div style={{ position: "relative", width: W, height: BASE,
            background: "linear-gradient(180deg,#2e2e2e,#242424 40%,#1c1c1c)",
            borderRadius: "0 0 12px 12px",
            border: "1.5px solid rgba(255,255,255,0.07)", borderTop: "none",
            boxShadow: "0 30px 80px rgba(0,0,0,0.9), inset 0 -1px 0 rgba(0,0,0,0.5)" }}>

            {/* Hinge strip */}
            <div style={{ position:"absolute",inset:"0 0 auto",height:6,
              background:"linear-gradient(90deg,#1a1a1a,#3a3a3a 15%,#4a4a4a 50%,#3a3a3a 85%,#1a1a1a)",
              borderBottom:"1px solid #111" }} />

            {/* Keyboard */}
            <Keyboard open={open} />

            {/* Trackpad */}
            <div className="absolute left-1/2 -translate-x-1/2 rounded-xl"
              style={{ bottom: 10, width: 130, height: 80,
                background: "linear-gradient(155deg,#2c2c2c,#1e1e1e)",
                border: "0.5px solid rgba(255,255,255,0.06)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 0 0 1px #111" }} />

            {/* Speaker grilles */}
            {[{ x: 8 }, { x: W - 26 }].map((s, si) => (
              <div key={si} className="absolute flex flex-col gap-[3px]" style={{ top: 16, left: s.x }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} style={{ width: 16, height: 1.5, background: "rgba(0,0,0,0.55)", borderRadius: 1 }} />
                ))}
              </div>
            ))}

            {/* Front edge glow when open */}
            <motion.div className="absolute inset-x-0 bottom-0 rounded-b-xl pointer-events-none"
              animate={{ opacity: open ? 0.5 : 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              style={{ height: 2, background: "linear-gradient(90deg,transparent,rgba(82,139,255,0.5),transparent)" }} />
          </div>
        </div>
      </div>

      {/* Hover hint */}
      {!open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none">
          <motion.span animate={{ y: [0,-3,0] }} transition={{ repeat:Infinity, duration:2 }}
            className="text-[9px] text-zinc-600 tracking-widest uppercase">
            hover to open
          </motion.span>
        </motion.div>
      )}
    </section>
  );
}
