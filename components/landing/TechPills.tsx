"use client";

import {
  SiFramer,
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "@icons-pack/react-simple-icons";
import { LayoutGroup, motion } from "motion/react";

/**
 * The stack, as a row of overlapping marks that open on hover.
 *
 * At rest they sit tucked into each other — a stack, literally — showing only
 * their logos. Point at one and it slides out of the pile and its name grows
 * out of it. The width is what animates, so the neighbours are pushed along
 * rather than being covered up.
 *
 * `layout` on every pill and a LayoutGroup around them is what keeps that from
 * being a jump: the pills that are not hovered animate to their new positions
 * instead of teleporting.
 */

const SIZE = 17;

const STACK = [
  { name: "React", Icon: SiReact, tint: "text-[#61DAFB]" },
  { name: "Next.js", Icon: SiNextdotjs, tint: "" },
  { name: "TypeScript", Icon: SiTypescript, tint: "text-[#3178C6]" },
  { name: "Tailwind", Icon: SiTailwindcss, tint: "text-[#38BDF8]" },
  { name: "Motion", Icon: SiFramer, tint: "text-[#0055FF]" },
];

export default function TechPills({ className }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center ${className ?? ""}`}>
      <LayoutGroup>
        {STACK.map(({ name, Icon, tint }) => (
          <motion.div
            key={name}
            layout
            initial="rest"
            whileHover="open"
            whileFocus="open"
            tabIndex={0}
            aria-label={name}
            transition={{ type: "spring", stiffness: 260, damping: 26, mass: 0.5 }}
            className="tech-pill -mr-2.5 flex items-center rounded-full p-1.5 outline-none last:mr-0 hover:z-10 focus-visible:z-10"
          >
            <motion.span
              variants={{ open: { paddingRight: 6 } }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="grid shrink-0 place-items-center"
            >
              <Icon title="" size={SIZE} className={tint} />
            </motion.span>

            <motion.span
              variants={{ rest: { width: 0, opacity: 0 }, open: { width: "auto", opacity: 1 } }}
              transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.5 }}
              className="overflow-hidden whitespace-nowrap pr-1 text-[12px] font-medium text-zinc-600 dark:text-zinc-300"
            >
              {name}
            </motion.span>
          </motion.div>
        ))}
      </LayoutGroup>
    </div>
  );
}
