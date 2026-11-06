"use client";

import { useEffect, useId, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { SIGNATURE_PATHS, SIGNATURE_VIEWBOX } from "./signature-paths";

/**
 * The signature, the hand from the old site, written when you reach it.
 *
 * On the old page it waited for the viewport, because it sat at the foot of a
 * long scroll. Here it sits in the Contact chapter, so it waits for that
 * chapter instead: each time Contact comes in, once its lines have arrived,
 * it writes itself in stroke order, and it is wiped again when Contact goes,
 * so coming back is watching it signed again.
 */
export function Signature() {
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const node = svgRef.current;
    const ch = node?.closest(".ch");
    if (!node || !ch) return;

    let anims: Animation[] = [];
    let writing = false;
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
            // after the chapter's own lines have come in
            delay: reduced ? 0 : 650 + i * 60,
          }
        );
        anims.push(anim);
      });
    };
    const wipe = () => {
      anims.forEach((a) => a.cancel());
      anims = [];
    };

    const read = () => {
      const on = ch.classList.contains("is-in");
      if (on && !writing) {
        writing = true;
        write();
      } else if (!on && writing && !ch.classList.contains("is-out")) {
        writing = false;
        wipe();
      }
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(ch, { attributes: true, attributeFilter: ["class"] });
    return () => {
      mo.disconnect();
      wipe();
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
      className="sign"
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
