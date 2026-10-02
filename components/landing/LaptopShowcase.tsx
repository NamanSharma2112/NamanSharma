"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * A project on a machine, straightening up as you scroll to it.
 *
 * It starts tipped back and a little small, the way something looks from
 * across a desk, and comes level as it reaches the middle of the screen. The
 * transform is tied to scroll position rather than fired once on entry, so it
 * tracks the page both ways instead of playing and being spent.
 *
 * The machine is drawn, not photographed. A photo of a laptop brings its own
 * lighting and its own backdrop, neither of which belongs to this page, and the
 * screenshot inside it would have to be warped to sit in a screen that is not
 * square to the camera.
 */
export default function LaptopShowcase({
  src,
  alt,
  label,
  href,
}: {
  src: string;
  alt: string;
  label: string;
  href?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const still = useReducedMotion();

  // From the moment its top edge enters the viewport until it is centred.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [17, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.93, 1]);

  return (
    <div ref={ref} className="mac-stage">
      {href ? (
        <a className="mac-label" href={href} target="_blank" rel="noopener noreferrer">
          {label}
          <span aria-hidden> ↗</span>
        </a>
      ) : (
        <p className="mac-label">{label}</p>
      )}

      <motion.div
        className="mac"
        style={still ? undefined : { rotateX, scale }}
      >
        <div className="mac-lid">
          <span className="mac-cam" aria-hidden />
          <div className="mac-screen">
            {/* Plain img: the frame sets the box, and the optimizer's srcset
                would only pick a width this already knows. */}
            <img src={src} alt={alt} />
          </div>
        </div>

        <div className="mac-base" aria-hidden>
          <span className="mac-lip" />
        </div>
      </motion.div>
    </div>
  );
}
