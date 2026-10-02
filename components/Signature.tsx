"use client";

import { useEffect, useId, useRef } from "react";
import { SIGNATURE_PATHS, SIGNATURE_VIEWBOX } from "@/components/signature-paths";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * The signature, written when you reach it.
 *
 * It used to draw on mount. It sits at the very bottom of a long page, so it
 * had always finished before anyone scrolled far enough to see it — the
 * animation ran to an empty room. It now waits for the viewport and writes
 * itself once, in stroke order.
 */
export default function Signature({ className }: { className?: string } = {}) {
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const node = svgRef.current;
    if (!node) return;

    const anims: Animation[] = [];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const write = () => {
      pathRefs.current.forEach((path, i) => {
        if (!path) return;
        const anim = path.animate(
          [
            { strokeDashoffset: 1, opacity: 0 },
            { strokeDashoffset: 1, opacity: 1, offset: 0.03 },
            { strokeDashoffset: 0, opacity: 1 },
          ],
          {
            // Reduced motion still gets the signature, just not the writing.
            duration: reduced ? 1 : 1800,
            easing: "cubic-bezier(0.65, 0, 0.35, 1)",
            fill: "forwards",
            delay: reduced ? 0 : 100 + i * 60,
          }
        );
        anims.push(anim);
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        write();
        observer.disconnect();
      },
      // A little inside the edge, so it starts as it clears the fold rather
      // than the instant its first pixel appears.
      { rootMargin: "0px 0px -12% 0px" }
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      anims.forEach((a) => a.cancel());
    };
  }, []);

  const setRef = (i: number) => (el: SVGPathElement | null) => {
    pathRefs.current[i] = el;
  };

  const gid = `sig-${useId().replace(/:/g, "")}`;

  // In viewBox units, not pixels, because that is the space the gradient is
  // measured in. Parked off to the left at rest, which leaves every stroke on
  // the gradient's outer stop — plain ink — until the cursor arrives.
  const REST = -160;
  const gx = useSpring(useMotionValue(REST), { stiffness: 140, damping: 22, mass: 0.5 });
  const gy = useSpring(useMotionValue(20), { stiffness: 140, damping: 22, mass: 0.5 });

  const track = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    if (!r.width || !r.height) return;
    gx.set(((e.clientX - r.left) / r.width) * 164.8);
    gy.set(((e.clientY - r.top) / r.height) * 39.4);
  };

  const shared = {
    // Not a flat colour: a gradient whose centre follows the cursor, so the
    // ink lights up where you are and stays plain everywhere else. Painting
    // the existing strokes this way leaves the writing animation untouched —
    // a second, glowing copy of the paths would have to be drawn in step too.
    stroke: `url(#${gid})`,
    strokeWidth: 1.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
    pathLength: 1,
    strokeDasharray: "1 1",
    strokeDashoffset: 1,
    opacity: 0,
  };

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={SIGNATURE_VIEWBOX}
      role="img"
      aria-label="Naman Sharma's signature"
      className={className || "mb-3 h-[36px] w-auto shrink-0 overflow-visible text-black dark:text-white"}
      onPointerMove={track}
      onPointerLeave={() => gx.set(REST)}
    >
      <defs>
        <motion.radialGradient id={gid} gradientUnits="userSpaceOnUse" cx={gx} cy={gy} r={34}>
          <stop offset="0" stopColor="#3b82f6" />
          <stop offset="1" stopColor="currentColor" />
        </motion.radialGradient>
      </defs>

      {SIGNATURE_PATHS.map((d, i) => (
        <path key={i} ref={setRef(i)} {...shared} d={d} />
      ))}
    </svg>
  );
}
