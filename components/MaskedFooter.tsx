"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function MaskedFooter() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const cols = 55;
  const rows = 14;

  if (!mounted) {
    return <div className="w-full h-[220px] mt-12" />;
  }

  const isDark = resolvedTheme === "dark";
  const baseFill = isDark ? "#18181b" : "#f4f4f5";
  const hoverFill = isDark ? "#3f3f46" : "#d4d4d8";

  return (
    <div className="w-auto -mx-5 h-auto mt-16 relative overflow-hidden flex items-end justify-center select-none">
      <svg width="100%" height="100%" viewBox="0 0 1000 220" preserveAspectRatio="xMidYMax meet">
        <defs>
          <mask id="text-mask">
            <rect width="100%" height="100%" fill="black" />
            <text
              x="50%"
              y="240"
              textAnchor="middle"
              fill="white"
              fontSize="275"
              fontWeight="900"
              fontFamily="sans-serif"
              letterSpacing="-0.02em"
              style={{ transform: "scale(1, 1.4)", transformOrigin: "center bottom" }}
            >
              NAMAN
            </text>
          </mask>
        </defs>
        <g mask="url(#text-mask)">
          {Array.from({ length: rows * cols }).map((_, i) => {
            const width = 1000 / cols;
            const height = 220 / rows;
            const x = (i % cols) * width;
            const y = Math.floor(i / cols) * height;
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={width + 0.5}
                height={height + 0.5}
                className="transition-colors duration-300"
                style={{ fill: baseFill }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.fill = hoverFill;
                  e.currentTarget.style.transitionDuration = "0s";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.fill = baseFill;
                  e.currentTarget.style.transitionDuration = "0.5s";
                }}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
