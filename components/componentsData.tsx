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
];
