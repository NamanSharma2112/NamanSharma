"use client";

import {
  SiFramer,
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "@icons-pack/react-simple-icons";
import ScatterOnHover, { type ScatterItem } from "./ScatterOnHover";

/**
 * The phrase in the bio that throws the stack into the air.
 *
 * The offsets are set by hand rather than generated: a scatter that looks
 * scattered is a composition, and random placement puts two marks on top of
 * each other about as often as not.
 */

function Mark({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <span className="scatter-mark flex items-center gap-1.5 rounded-lg px-2 py-1.5">
      {children}
      <span className="font-mono text-[9px] uppercase tracking-[0.14em]">
        {label}
      </span>
    </span>
  );
}

const SIZE = 15;

const ITEMS: ScatterItem[] = [
  {
    key: "react",
    x: -132,
    y: -96,
    rotate: -9,
    node: (
      <Mark label="React">
        <SiReact title="" size={SIZE} className="text-[#61DAFB]" />
      </Mark>
    ),
  },
  {
    key: "next",
    x: -34,
    y: -128,
    rotate: 4,
    node: (
      <Mark label="Next.js">
        <SiNextdotjs title="" size={SIZE} />
      </Mark>
    ),
  },
  {
    key: "ts",
    x: 74,
    y: -112,
    rotate: 10,
    node: (
      <Mark label="TypeScript">
        <SiTypescript title="" size={SIZE} className="text-[#3178C6]" />
      </Mark>
    ),
  },
  {
    key: "tw",
    x: -96,
    y: -46,
    rotate: 7,
    node: (
      <Mark label="Tailwind">
        <SiTailwindcss title="" size={SIZE} className="text-[#38BDF8]" />
      </Mark>
    ),
  },
  {
    key: "motion",
    x: 92,
    y: -54,
    rotate: -6,
    node: (
      <Mark label="Motion">
        <SiFramer title="" size={SIZE} className="text-[#0055FF]" />
      </Mark>
    ),
  },
];

export default function StackScatter({ children }: { children: React.ReactNode }) {
  return (
    <ScatterOnHover items={ITEMS} caption="I build with">
      {children}
    </ScatterOnHover>
  );
}
