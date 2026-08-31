"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";

/**
 * The route, read top to bottom: a plane that flies down a dashed track as you
 * scroll, and a leg for each thing built.
 *
 * The track is one continuous line behind the rows rather than a segment per
 * row, because the plane has to be able to sit anywhere along it. Its position
 * is scroll progress through the section, smoothed by a spring so a trackpad
 * flick reads as flight rather than teleporting.
 *
 * The legs wipe in as they reach the viewport and stay in — re-animating on
 * every scroll-by is an interface fighting its reader.
 */

type Leg = {
  /** The little route code above the leg number. */
  route: string;
  name: string;
  role: string;
  blurb: string;
  href?: string;
  current?: boolean;
  stack?: string[];
};

const LEGS: Leg[] = [
  {
    route: "IN>AIR",
    name: "Passion projects",
    role: "Design Engineer",
    blurb:
      "Designing and building whatever I can imagine or get inspiration from — exploring modern web experiences and shipping projects that push creative boundaries.",
    current: true,
    stack: ["React", "Next.js", "TypeScript", "Tailwind", "Motion"],
  },
  {
    route: "IDEA>SHIP",
    name: "MotionKit",
    role: "Animation library",
    blurb:
      "A component library for motion on the web — the pieces I kept rebuilding, packaged so they behave the same way every time.",
    href: "https://www.motionlib.me/",
  },
  {
    route: "DATA>VIEW",
    name: "ChurnRate",
    role: "SaaS dashboard",
    blurb:
      "Churn analysis and analytics for subscription products, with the reporting surfaces designed and built end to end.",
    href: "https://www.churnrate.fun/",
  },
  {
    route: "TODO>DONE",
    name: "Task Management",
    role: "Productivity tool",
    blurb:
      "A full-stack task app — boards, state and the whole workflow, built to stay quick as the list grows.",
    href: "https://taskmangementapplication-production.up.railway.app",
  },
];

/** Where the track sits: the label column, then half the track column. */
const TRACK_X = "calc(1.5rem + 72px + 16px)";

export default function FlightPlan() {
  const section = useRef<HTMLElement>(null);

  // Progress from the section arriving to it leaving, so the plane is already
  // moving when the first leg lands and has landed by the last.
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start 0.75", "end 0.55"],
  });
  const flight = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.6,
  });
  const top = useTransform(flight, [0, 1], ["0%", "100%"]);
  // Banks a little into the descent, the way a plane does turning onto a leg.
  const tilt = useTransform(flight, [0, 0.5, 1], [-4, 3, -2]);

  return (
    <section
      ref={section}
      aria-label="Flight plan"
      className="relative mx-auto w-full max-w-[760px] px-6"
    >
      {/* One continuous track, behind everything, from the plane to the end. */}
      <span
        aria-hidden
        className="track absolute top-8 bottom-6 w-px"
        style={{ left: TRACK_X }}
      />

      {/* Sits above where the plane starts, not on top of it. */}
      <span
        aria-hidden
        className="absolute -top-5 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400"
        style={{ left: TRACK_X }}
      >
        Flight plan
      </span>

      {/* The plane itself, riding the track. */}
      <motion.span
        aria-hidden
        className="absolute z-10 -translate-x-1/2"
        style={{ left: TRACK_X, top, rotate: tilt }}
      >
        <PlaneMark />
      </motion.span>

      <div className="grid grid-cols-[72px_32px_minmax(0,1fr)] gap-y-10 pt-8">
        {LEGS.map((leg, i) => (
          <LegRow key={leg.name} leg={leg} index={i + 1} />
        ))}
      </div>
    </section>
  );
}

function LegRow({ leg, index }: { leg: Leg; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Fires once. Anything already on screen at load counts immediately.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { rootMargin: "-60px 0px -80px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Route code and leg marker, out in the margin. */}
      <div className="pt-[3px] text-right">
        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-600">
          {leg.route}
        </p>
        {/* A waypoint number rather than a date: these are things built, and
            putting years on them would mean inventing them. */}
        <p className="font-mono text-[13px] tracking-[0.1em] text-zinc-500 tabular-nums dark:text-zinc-400">
          LEG {String(index).padStart(2, "0")}
        </p>
      </div>

      {/* The stop on the track. It lights up when its leg is under the cursor. */}
      <div className="flex justify-center">
        <span
          className={`stop mt-[7px] block size-[9px] shrink-0 rounded-full border-2 ${
            hovered
              ? "scale-[1.45] border-blue-500 bg-blue-500/20 dark:border-blue-400"
              : "border-zinc-400 bg-[var(--page-bg)] dark:border-zinc-600"
          }`}
        />
      </div>

      {/* The leg itself. */}
      <div
        ref={ref}
        data-visible={visible}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="leg group/leg min-w-0"
      >
        <div className="leg-body -mx-3 rounded-xl px-3 py-2">
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <h3 className="text-[16px] font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
              {leg.name}
            </h3>
            {leg.current && (
              <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-blue-400 opacity-70" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-blue-500" />
                </span>
                In flight
              </span>
            )}
            {leg.href && (
              <a
                href={leg.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400 transition-colors hover:text-zinc-700 dark:text-zinc-600 dark:hover:text-zinc-300"
              >
                Visit
                <ArrowUpRight className="size-3 transition-transform duration-200 ease-[var(--ease-out)] group-hover:-translate-y-px group-hover:translate-x-px" />
              </a>
            )}
          </div>

          <p className="mt-0.5 text-[14px] text-zinc-700 dark:text-zinc-300">{leg.role}</p>
          <p className="mt-2 max-w-[52ch] text-[13.5px] leading-[1.7] text-zinc-500 dark:text-zinc-400">
            {leg.blurb}
          </p>

          {leg.stack && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {leg.stack.map((tool) => (
                <li
                  key={tool}
                  className="chip rounded-full border border-black/10 px-2 py-[3px] font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500 dark:border-white/10 dark:text-zinc-400"
                >
                  {tool}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

function PlaneMark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className="text-blue-600 drop-shadow-[0_1px_3px_rgba(37,99,235,0.4)] dark:text-blue-400"
    >
      {/* Nose down, so it reads as flying along the track below it. */}
      <path d="M12 23l-1.6-4.2-6.6 2.3.5-2 5-4.1-1.4-3.7-4.4 1.6.3-1.7 4-3-1.3-3.6c-.2-.6.4-1.1.9-.8L12 6.4l4.1-2.6c.5-.3 1.1.2.9.8l-1.3 3.6 4 3 .3 1.7-4.4-1.6-1.4 3.7 5 4.1.5 2-6.6-2.3z" />
    </svg>
  );
}
