"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";

/**
 * The route, read top to bottom: a plane that flies down a dashed track as you
 * scroll, and a row for each thing built.
 *
 * The track is one continuous line behind the rows rather than a segment per
 * row, because the plane has to be able to sit anywhere along it. Its position
 * is scroll progress through the section, smoothed by a spring so a trackpad
 * flick reads as flight rather than teleporting.
 *
 * The legs wipe in as they reach the viewport and stay in — re-animating on
 * every scroll-by is an interface fighting its reader.
 */

type Project = {
  /** What kind of thing it is, above the number. */
  kind: string;
  name: string;
  role: string;
  blurb: string;
  href?: string;
  current?: boolean;
  stack?: string[];
  /** A shot of the thing, shown out in the margin on hover. */
  shot?: { src: string; alt: string };
};

const PROJECTS: Project[] = [
  {
    kind: "Ongoing",
    name: "Passion projects",
    role: "Design Engineer",
    blurb:
      "Designing and building whatever I can imagine or get inspiration from — exploring modern web experiences and shipping projects that push creative boundaries.",
    current: true,
    stack: ["React", "Next.js", "TypeScript", "Tailwind", "Motion"],
  },
  {
    kind: "Library",
    name: "MotionKit",
    role: "Animation library",
    blurb:
      "A component library for motion on the web — the pieces I kept rebuilding, packaged so they behave the same way every time.",
    href: "https://www.motionlib.me/",
    shot: { src: "/motionkit-preview.png", alt: "MotionKit components" },
  },
  {
    kind: "Dashboard",
    name: "ChurnRate",
    role: "SaaS dashboard",
    blurb:
      "Churn analysis and analytics for subscription products, with the reporting surfaces designed and built end to end.",
    href: "https://www.churnrate.fun/",
    shot: { src: "/churnrate-dashboard.png", alt: "ChurnRate dashboard" },
  },
  {
    kind: "App",
    name: "Task Management",
    role: "Productivity tool",
    blurb:
      "A full-stack task app — boards, state and the whole workflow, built to stay quick as the list grows.",
    href: "https://taskmangementapplication-production.up.railway.app",
  },
];

/** Where the track sits: the label column, then half the track column. */
const TRACK_X = "calc(1.5rem + 72px + 16px)";

export default function Projects() {
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
  // Banks a little into the descent, the way a plane does turning onto a item.

  return (
    <section
      ref={section}
      aria-label="Selected work"
      className="relative mx-auto w-full max-w-[760px] px-6"
    >
      {/* Sits above where the track starts, not on top of it. */}
      <span
        aria-hidden
        className="absolute top-0 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400"
        style={{ left: TRACK_X }}
      >
        Selected work
      </span>

      {/* The track and the mark that rides it share one box, so the mark
          travels exactly the line's length rather than the section's. */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-6 top-8 z-10 block w-px -translate-x-1/2"
        style={{ left: TRACK_X }}
      >
        <span className="track absolute inset-0 block" />

        {/* Centred through motion rather than a utility class, so the offsets
            compose into one transform instead of fighting over the element. */}
        <motion.span
          className="absolute left-1/2 block"
          style={{ top, x: "-50%", y: "-50%" }}
        >
          <TrackMark />
        </motion.span>
      </span>

      <div className="grid grid-cols-[72px_32px_minmax(0,1fr)] gap-y-10 pt-8">
        {PROJECTS.map((item, i) => (
          <Row key={item.name} item={item} index={i + 1} />
        ))}
      </div>
    </section>
  );
}

function Row({ item, index }: { item: Project; index: number }) {
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
      {/* Kind and number, out in the margin. */}
      <div className="pt-[3px] text-right">
        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-600">
          {item.kind}
        </p>
        {/* A waypoint number rather than a date: these are things built, and
            putting years on them would mean inventing them. */}
        <p className="font-mono text-[13px] tracking-[0.1em] text-zinc-500 tabular-nums dark:text-zinc-400">
          {String(index).padStart(2, "0")}
        </p>
      </div>

      {/* The stop on the track. It lights up when its row is under the cursor. */}
      <div className="flex justify-center">
        <span
          className={`stop mt-[7px] block size-[9px] shrink-0 rounded-full border-2 ${
            hovered
              ? "scale-[1.45] border-blue-500 bg-blue-500/20 dark:border-blue-400"
              : "border-zinc-400 bg-[var(--page-bg)] dark:border-zinc-600"
          }`}
        />
      </div>

      {/* The row itself. */}
      <div
        ref={ref}
        data-visible={visible}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="leg group/leg min-w-0"
      >
        <div className="leg-body relative -mx-3 rounded-xl px-3 py-2">
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <h3 className="text-[16px] font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
              {item.name}
            </h3>
            {item.current && (
              <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-blue-400 opacity-70" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-blue-500" />
                </span>
                Now
              </span>
            )}
            {item.href && (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400 transition-colors hover:text-zinc-700 dark:text-zinc-600 dark:hover:text-zinc-300"
              >
                Visit
                <ArrowUpRight className="size-3 transition-transform duration-200 ease-[var(--ease-out)] group-hover:-translate-y-px group-hover:translate-x-px" />
              </a>
            )}
          </div>

          <p className="mt-0.5 text-[14px] text-zinc-700 dark:text-zinc-300">{item.role}</p>
          <p className="mt-2 max-w-[52ch] text-[13.5px] leading-[1.7] text-zinc-500 dark:text-zinc-400">
            {item.blurb}
          </p>

          {/* The shot flies out into the margin rather than over the text, so
              it never covers what you are reading. Only where there is room:
              below the wide breakpoint there is no margin and no hover. */}
          {item.shot && (
            <motion.span
              aria-hidden
              // Explicit width: an absolutely positioned box at left:100% has
              // no room left in its containing block, so shrink-to-fit
              // collapses it to a sliver.
              className="leg-shot pointer-events-none absolute left-full top-0 ml-8 hidden w-[210px] xl:block"
              initial={false}
              animate={
                hovered
                  ? { opacity: 1, x: 0, rotate: -3.5, scale: 1 }
                  : { opacity: 0, x: -14, rotate: -6, scale: 0.94 }
              }
              transition={{ type: "spring", stiffness: 300, damping: 24, mass: 0.5 }}
            >
              {/* Eager on purpose. These sit at left:100% of the column, which
                  puts the outer ones past the right edge of the viewport — so
                  they never intersect it, lazy loading never fires, and the
                  hover it is the payoff for opens an empty box. Four thumbnails
                  under 30KB each is the cheaper trade. */}
              <Image
                src={item.shot.src}
                alt=""
                width={210}
                height={132}
                loading="eager"
                className="h-[132px] w-[210px] rounded-lg object-cover"
              />
            </motion.span>
          )}

          {item.stack && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {item.stack.map((tool) => (
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

/** What rides the track: a lit dot marking how far down the list you are. */
function TrackMark() {
  return (
    <span className="track-mark" aria-hidden />
  );
}
