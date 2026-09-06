"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationControls,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

/**
 * A pile of cards you can throw around.
 *
 * Each one tilts toward the cursor while it is under it, and can be dragged
 * anywhere in the stage. The tilt is springed because the pointer can reverse
 * at any moment, and it lets go back to flat when the drag ends.
 *
 * The images are the site's own, not hotlinked — a wall of photos that depends
 * on someone else's CDN is a wall of broken boxes the day it moves.
 */

const CARDS = [
  { title: "MotionKit", src: "/motionkit-preview.png", at: "left-[4%] top-[12%] rotate-[-6deg]" },
  { title: "ChurnRate", src: "/churnrate-dashboard.png", at: "left-[26%] top-[34%] rotate-[4deg]" },
  { title: "Studio", src: "/isometric-studio.png", at: "left-[48%] top-[8%] rotate-[7deg]" },
  { title: "Desk", src: "/desk-hero.png", at: "left-[62%] top-[38%] rotate-[-4deg]" },
  { title: "Analysis", src: "/churnrate-analysis.png", at: "left-[18%] top-[2%] rotate-[9deg]" },
];

export default function Collage() {
  return (
    <div className="lab-stage relative h-[360px] w-full overflow-hidden rounded-xl [perspective:1600px]">
      {CARDS.map((c) => (
        <Card key={c.title} {...c} />
      ))}
      <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
        Drag them
      </p>
    </div>
  );
}

function Card({ title, src, at }: { title: string; src: string; at: string }) {
  const box = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const [bounds, setBounds] = useState({ top: 0, left: 0, right: 0, bottom: 0 });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 120, damping: 18, mass: 0.5 };
  const rotateX = useSpring(useTransform(my, [-160, 160], [16, -16]), spring);
  const rotateY = useSpring(useTransform(mx, [-160, 160], [-16, 16]), spring);

  // Keep a thrown card inside the stage rather than letting it fly off it.
  useEffect(() => {
    const stage = box.current?.parentElement;
    if (!stage) return;
    const fit = () => {
      const s = stage.getBoundingClientRect();
      const c = box.current!.getBoundingClientRect();
      setBounds({
        left: -(c.left - s.left),
        top: -(c.top - s.top),
        right: s.right - c.right,
        bottom: s.bottom - c.bottom,
      });
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <motion.div
      ref={box}
      drag
      dragConstraints={bounds}
      dragElastic={0.12}
      animate={controls}
      whileHover={{ scale: 1.03, zIndex: 20 }}
      whileDrag={{ scale: 1.05, zIndex: 30 }}
      style={{ rotateX, rotateY }}
      onPointerMove={(e) => {
        const r = box.current!.getBoundingClientRect();
        mx.set(e.clientX - (r.left + r.width / 2));
        my.set(e.clientY - (r.top + r.height / 2));
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      onDragEnd={() => controls.start({ rotate: 0, transition: { type: "spring", ...spring } })}
      className={`lab-card absolute w-44 cursor-grab rounded-lg p-1.5 active:cursor-grabbing ${at}`}
    >
      <img
        src={src}
        alt=""
        draggable={false}
        className="pointer-events-none h-24 w-full rounded-md object-cover"
      />
      <p className="mt-1.5 text-center text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
        {title}
      </p>
    </motion.div>
  );
}
