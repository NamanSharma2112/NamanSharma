"use client";

import React from "react";
import { motion } from "motion/react";

/* ═══════════════════════════════════════════════════════════
   Shared wrapper — clean, minimal card
   ═══════════════════════════════════════════════════════════ */
function BlockCard({
  children,
  isDark,
}: {
  children: React.ReactNode;
  isDark: boolean;
}) {
  return (
    <div
      className="my-8 rounded-xl border p-6 sm:p-8 transition-colors duration-500"
      style={{
        backgroundColor: isDark ? "#141414" : "#fafafa",
        borderColor: isDark ? "#262626" : "#e5e5e5",
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   1. RlsConceptBlock
   ═══════════════════════════════════════════════════════════ */
export function RlsConceptBlock({ isDark }: { isDark: boolean }) {
  const cardBg = isDark ? "#1a1a1a" : "#ffffff";
  const borderCol = isDark ? "#262626" : "#e5e5e5";
  const labelColor = isDark ? "#52525b" : "#a1a1aa";
  const mutedBg = isDark ? "#262626" : "#f4f4f5";

  const rows = [
    { color: "#3b82f6", user: "User 1" },
    { color: "#22c55e", user: "User 2" },
    { color: "#f59e0b", user: "User 3" },
  ];

  return (
    <BlockCard isDark={isDark}>
      <div className="flex flex-col gap-6 items-center">
        <p className="text-[11px] uppercase tracking-[0.1em] font-medium transition-colors duration-500" style={{ color: labelColor }}>
          Row-Level Filtering
        </p>
        <div className="flex w-full max-w-sm justify-between items-center relative">
          
          {/* Users */}
          <div className="flex flex-col gap-3 z-10">
            {rows.map((r, i) => (
              <motion.div
                key={`user-${i}`}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.8, duration: 0.5 }}
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white"
                style={{ borderColor: r.color }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={r.color} strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </motion.div>
            ))}
          </div>

          {/* Filter/Shield */}
          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center h-full z-0">
             <div className="w-[1px] h-full border-l border-dashed transition-colors duration-500" style={{ borderColor: labelColor }}></div>
             <div className="absolute bg-current p-1.5 rounded-full" style={{ backgroundColor: cardBg, color: isDark ? "#e4e4e7" : "#27272a" }}>
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
               </svg>
             </div>
          </div>

          {/* Table Rows */}
          <div className="flex flex-col gap-2 rounded-lg border p-3 z-10" style={{ backgroundColor: cardBg, borderColor: borderCol }}>
            {rows.map((r, i) => (
              <motion.div
                key={`row-${i}`}
                initial={{ opacity: 0.2 }}
                whileInView={{ opacity: [0.2, 1, 0.2] }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.8 + 0.3, duration: 1.5, repeat: Infinity, repeatDelay: 0.9 }}
                className="w-20 h-6 rounded flex items-center px-2"
                style={{ backgroundColor: `${r.color}20`, borderLeft: `3px solid ${r.color}` }}
              >
                <div className="h-1.5 w-12 rounded bg-current opacity-40" style={{ backgroundColor: r.color }}></div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </BlockCard>
  );
}

/* ═══════════════════════════════════════════════════════════
   2. RlsWithoutVsWithBlock
   ═══════════════════════════════════════════════════════════ */
export function RlsWithoutVsWithBlock({ isDark }: { isDark: boolean }) {
  const cardBg = isDark ? "#1a1a1a" : "#ffffff";
  const borderCol = isDark ? "#262626" : "#e5e5e5";
  const mutedBg = isDark ? "#262626" : "#f4f4f5";
  const labelColor = isDark ? "#52525b" : "#a1a1aa";
  const textCol = isDark ? "#e4e4e7" : "#27272a";

  return (
    <BlockCard isDark={isDark}>
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {/* Without RLS */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] uppercase tracking-[0.08em] font-medium transition-colors duration-500" style={{ color: "#ef4444" }}>
            Without RLS
          </span>
          <div className="rounded-lg border p-4 flex flex-col items-center gap-4 transition-colors duration-500" style={{ backgroundColor: cardBg, borderColor: borderCol }}>
            <div className="text-[10px] font-mono px-2 py-1 rounded w-full text-center" style={{ backgroundColor: mutedBg, color: textCol }}>
              SELECT * FROM posts
            </div>
            <div className="h-4 w-[1px] border-l border-dashed" style={{ borderColor: borderCol }}></div>
            <div className="flex flex-col gap-1.5 w-full">
              <div className="h-4 rounded border" style={{ backgroundColor: "#ef444420", borderColor: "#ef444450" }} />
              <div className="h-4 rounded border" style={{ backgroundColor: "#ef444420", borderColor: "#ef444450" }} />
              <div className="h-4 rounded border" style={{ backgroundColor: "#ef444420", borderColor: "#ef444450" }} />
            </div>
          </div>
          <span className="text-[10px] text-center transition-colors duration-500" style={{ color: labelColor }}>returns all rows (data leak)</span>
        </div>

        {/* With RLS */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] uppercase tracking-[0.08em] font-medium transition-colors duration-500" style={{ color: "#22c55e" }}>
            With RLS
          </span>
          <div className="rounded-lg border p-4 flex flex-col items-center gap-4 transition-colors duration-500" style={{ backgroundColor: cardBg, borderColor: borderCol }}>
            <div className="text-[10px] font-mono px-2 py-1 rounded w-full text-center" style={{ backgroundColor: mutedBg, color: textCol }}>
              SELECT * FROM posts
            </div>
            
            <div className="flex flex-col items-center">
              <div className="h-2 w-[1px] border-l border-dashed" style={{ borderColor: borderCol }}></div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <div className="h-2 w-[1px] border-l border-dashed" style={{ borderColor: borderCol }}></div>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <div className="h-4 rounded transition-colors duration-500" style={{ backgroundColor: mutedBg }} />
              <div className="h-4 rounded border" style={{ backgroundColor: "#22c55e20", borderColor: "#22c55e50" }} />
              <div className="h-4 rounded transition-colors duration-500" style={{ backgroundColor: mutedBg }} />
            </div>
          </div>
          <span className="text-[10px] text-center transition-colors duration-500" style={{ color: labelColor }}>returns only allowed rows</span>
        </div>
      </div>
    </BlockCard>
  );
}

/* ═══════════════════════════════════════════════════════════
   3. RlsPolicyFlowBlock
   ═══════════════════════════════════════════════════════════ */
export function RlsPolicyFlowBlock({ isDark }: { isDark: boolean }) {
  const cardBg = isDark ? "#1a1a1a" : "#ffffff";
  const borderCol = isDark ? "#262626" : "#e5e5e5";
  const textCol = isDark ? "#e4e4e7" : "#27272a";
  const accent = isDark ? "#818cf8" : "#4f46e5";

  const steps = [
    { text: "User 1 makes query", type: "normal" },
    { text: "PostgreSQL checks policy", type: "normal" },
    { text: "USING (user_id = 1)", type: "accent" },
    { text: "Filtered results", type: "normal" },
  ];

  return (
    <BlockCard isDark={isDark}>
      <div className="flex flex-col items-center gap-2">
        {steps.map((step, i) => (
          <React.Fragment key={`step-${i}`}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.3, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="px-4 py-2 rounded-lg border text-[11px] font-medium text-center w-48 shadow-sm transition-colors duration-500"
              style={{
                backgroundColor: step.type === "accent" ? `${accent}15` : cardBg,
                borderColor: step.type === "accent" ? accent : borderCol,
                color: step.type === "accent" ? accent : textCol,
              }}
            >
              {step.text}
            </motion.div>
            {i < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.3 + 0.15, duration: 0.3 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={borderCol} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="2" x2="12" y2="22" />
                  <polyline points="19 15 12 22 5 15" />
                </svg>
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>
    </BlockCard>
  );
}

/* ═══════════════════════════════════════════════════════════
   4. UsingVsWithCheckBlock
   ═══════════════════════════════════════════════════════════ */
export function UsingVsWithCheckBlock({ isDark }: { isDark: boolean }) {
  const cardBg = isDark ? "#1a1a1a" : "#ffffff";
  const borderCol = isDark ? "#262626" : "#e5e5e5";
  const textCol = isDark ? "#e4e4e7" : "#27272a";
  const labelColor = isDark ? "#52525b" : "#a1a1aa";
  
  const usingColor = isDark ? "#818cf8" : "#4f46e5";
  const checkColor = "#22c55e";

  return (
    <BlockCard isDark={isDark}>
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {/* USING */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] uppercase tracking-[0.08em] font-medium transition-colors duration-500" style={{ color: usingColor }}>
            USING
          </span>
          <div className="rounded-lg border p-4 flex flex-col items-center gap-3 transition-colors duration-500" style={{ backgroundColor: cardBg, borderColor: borderCol }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={usingColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="text-[11px] font-medium text-center" style={{ color: textCol }}>Can I access this row?</span>
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: `${usingColor}20`, color: usingColor }}>✓</div>
              <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: "#ef444420", color: "#ef4444" }}>✗</div>
            </div>
          </div>
          <span className="text-[10px] text-center transition-colors duration-500" style={{ color: labelColor }}>Filters existing rows (SELECT, UPDATE, DELETE)</span>
        </div>

        {/* WITH CHECK */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] uppercase tracking-[0.08em] font-medium transition-colors duration-500" style={{ color: checkColor }}>
            WITH CHECK
          </span>
          <div className="rounded-lg border p-4 flex flex-col items-center gap-3 transition-colors duration-500" style={{ backgroundColor: cardBg, borderColor: borderCol }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={checkColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span className="text-[11px] font-medium text-center" style={{ color: textCol }}>Can I create this row?</span>
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: `${checkColor}20`, color: checkColor }}>✓</div>
            </div>
          </div>
          <span className="text-[10px] text-center transition-colors duration-500" style={{ color: labelColor }}>Validates new data (INSERT, UPDATE)</span>
        </div>
      </div>
    </BlockCard>
  );
}

/* ═══════════════════════════════════════════════════════════
   5. SaasMultiTenantBlock
   ═══════════════════════════════════════════════════════════ */
export function SaasMultiTenantBlock({ isDark }: { isDark: boolean }) {
  const cardBg = isDark ? "#1a1a1a" : "#ffffff";
  const borderCol = isDark ? "#262626" : "#e5e5e5";
  const textCol = isDark ? "#e4e4e7" : "#27272a";
  const labelColor = isDark ? "#52525b" : "#a1a1aa";
  const accent = isDark ? "#818cf8" : "#4f46e5";

  return (
    <BlockCard isDark={isDark}>
      <div className="flex flex-col items-center gap-6 relative py-4">
        {/* Database */}
        <div className="flex flex-col items-center gap-2 z-10">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={textCol} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          </svg>
          <span className="text-[11px] font-medium" style={{ color: textCol }}>Shared Database</span>
        </div>

        {/* Shield Filter */}
        <motion.div 
          className="z-10 p-2 rounded-full border shadow-sm"
          style={{ backgroundColor: cardBg, borderColor: accent, color: accent }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </motion.div>

        {/* Lines */}
        <div className="absolute top-[48px] bottom-16 w-[1px] border-l-2 border-dashed z-0" style={{ borderColor: borderCol }}></div>
        <div className="absolute top-[120px] left-1/4 right-1/4 h-[1px] border-t-2 border-dashed z-0" style={{ borderColor: borderCol }}></div>
        <div className="absolute top-[120px] left-1/4 bottom-16 w-[1px] border-l-2 border-dashed z-0" style={{ borderColor: borderCol }}></div>
        <div className="absolute top-[120px] right-1/4 bottom-16 w-[1px] border-r-2 border-dashed z-0" style={{ borderColor: borderCol }}></div>

        {/* Tenants */}
        <div className="flex w-full justify-around z-10 mt-6">
          <div className="flex flex-col gap-2 p-3 rounded-lg border w-[40%]" style={{ backgroundColor: cardBg, borderColor: borderCol }}>
            <span className="text-[11px] font-medium border-b pb-1 mb-1" style={{ color: textCol, borderColor: borderCol }}>Company 100</span>
            <div className="text-[10px] px-2 py-1 rounded" style={{ backgroundColor: `${accent}15`, color: accent }}>Project: Website</div>
            <div className="text-[10px] px-2 py-1 rounded" style={{ backgroundColor: `${accent}15`, color: accent }}>Project: Mobile App</div>
          </div>
          <div className="flex flex-col gap-2 p-3 rounded-lg border w-[40%]" style={{ backgroundColor: cardBg, borderColor: borderCol }}>
            <span className="text-[11px] font-medium border-b pb-1 mb-1" style={{ color: textCol, borderColor: borderCol }}>Company 200</span>
            <div className="text-[10px] px-2 py-1 rounded" style={{ backgroundColor: "#22c55e15", color: "#22c55e" }}>Project: Marketing</div>
          </div>
        </div>
      </div>
    </BlockCard>
  );
}

/* ═══════════════════════════════════════════════════════════
   6. SecurityLayersBlock
   ═══════════════════════════════════════════════════════════ */
export function SecurityLayersBlock({ isDark }: { isDark: boolean }) {
  const cardBg = isDark ? "#1a1a1a" : "#ffffff";
  const borderCol = isDark ? "#262626" : "#e5e5e5";
  const mutedBg = isDark ? "#262626" : "#f4f4f5";
  const textCol = isDark ? "#e4e4e7" : "#27272a";
  const labelColor = isDark ? "#52525b" : "#a1a1aa";
  const accent = isDark ? "#818cf8" : "#4f46e5";

  const layers = [
    { name: "Frontend / Client", active: false },
    { name: "Backend / API", active: false },
    { name: "Database Engine", active: false },
    { name: "RLS Policy", active: true },
    { name: "Allowed Rows", active: false },
  ];

  return (
    <BlockCard isDark={isDark}>
      <div className="flex flex-col items-center gap-2">
        {layers.map((layer, i) => (
          <motion.div
            key={layer.name}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.4 }}
            className="w-full max-w-[240px] p-3 rounded-lg border text-center text-[12px] font-medium transition-colors duration-500"
            style={{
              backgroundColor: layer.active ? `${accent}15` : cardBg,
              borderColor: layer.active ? accent : borderCol,
              color: layer.active ? accent : textCol,
              boxShadow: layer.active ? `0 0 10px ${accent}20` : "none"
            }}
          >
            {layer.name}
          </motion.div>
        ))}
      </div>
    </BlockCard>
  );
}

/* ═══════════════════════════════════════════════════════════
   7. RlsCheatSheetBlock
   ═══════════════════════════════════════════════════════════ */
export function RlsCheatSheetBlock({ isDark }: { isDark: boolean }) {
  const cardBg = isDark ? "#1a1a1a" : "#ffffff";
  const borderCol = isDark ? "#262626" : "#e5e5e5";
  const textCol = isDark ? "#e4e4e7" : "#27272a";
  
  const usingColor = isDark ? "#3b82f6" : "#2563eb";
  const checkColor = isDark ? "#22c55e" : "#16a34a";
  const bothColor = isDark ? "#a855f7" : "#9333ea";

  const ops = [
    { op: "SELECT", type: "USING only", color: usingColor, icon: <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /> },
    { op: "INSERT", type: "WITH CHECK only", color: checkColor, icon: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></> },
    { op: "UPDATE", type: "USING + WITH CHECK", color: bothColor, icon: <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /> },
    { op: "DELETE", type: "USING only", color: usingColor, icon: <><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></> },
  ];

  return (
    <BlockCard isDark={isDark}>
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {ops.map((op) => (
          <motion.div
            key={op.op}
            whileHover={{ scale: 1.02 }}
            className="rounded-lg border p-4 flex flex-col gap-2 transition-colors duration-500"
            style={{ backgroundColor: cardBg, borderColor: borderCol }}
          >
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={textCol} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {op.icon}
              </svg>
              <span className="text-[12px] font-mono font-bold" style={{ color: textCol }}>{op.op}</span>
            </div>
            <div className="text-[10px] px-2 py-1 rounded inline-block w-fit font-medium mt-1" style={{ backgroundColor: `${op.color}15`, color: op.color }}>
              {op.type}
            </div>
          </motion.div>
        ))}
      </div>
    </BlockCard>
  );
}

/* ═══════════════════════════════════════════════════════════
   8. RlsCoreIdeaBlock
   ═══════════════════════════════════════════════════════════ */
export function RlsCoreIdeaBlock({ isDark }: { isDark: boolean }) {
  const cardBg = isDark ? "#1a1a1a" : "#ffffff";
  const borderCol = isDark ? "#262626" : "#e5e5e5";
  const textCol = isDark ? "#e4e4e7" : "#27272a";
  const accent = isDark ? "#818cf8" : "#4f46e5";

  const steps = [
    { label: "Enable RLS" },
    { label: "Create Policy" },
    { label: "Define Access" },
    { label: "Enforced" },
  ];

  return (
    <BlockCard isDark={isDark}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 relative">
        {/* Connecting line */}
        <div className="hidden sm:block absolute left-8 right-8 h-[2px] top-1/2 -translate-y-1/2 z-0" style={{ backgroundColor: borderCol }}>
          <motion.div 
            className="h-full z-0"
            style={{ backgroundColor: accent }}
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>
        
        {steps.map((step, i) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.4, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="z-10 flex flex-col items-center gap-2"
          >
            <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-[12px] shadow-sm transition-colors duration-500" style={{ backgroundColor: cardBg, borderColor: accent, color: accent }}>
              {i + 1}
            </div>
            <span className="text-[11px] font-medium text-center" style={{ color: textCol }}>{step.label}</span>
          </motion.div>
        ))}
      </div>
    </BlockCard>
  );
}

/* ═══════════════════════════════════════════════════════════
   Registry — maps section IDs to their illustration
   ═══════════════════════════════════════════════════════════ */
const RLS_ILLUSTRATION_MAP: Record<string, React.FC<{ isDark: boolean }>> = {
  "rls-what": RlsConceptBlock,
  "rls-importance": RlsWithoutVsWithBlock,
  "rls-policy": RlsPolicyFlowBlock,
  "rls-using-vs-check": UsingVsWithCheckBlock,
  "rls-saas": SaasMultiTenantBlock,
  "rls-security": SecurityLayersBlock,
  "rls-cheatsheet": RlsCheatSheetBlock,
  "rls-final": RlsCoreIdeaBlock,
};

export function getRlsIllustration(sectionId: string): React.FC<{ isDark: boolean }> | null {
  return RLS_ILLUSTRATION_MAP[sectionId] ?? null;
}
