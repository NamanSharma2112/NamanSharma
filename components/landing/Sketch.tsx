"use client";

import { useId } from "react";
import { useInView } from "./useInView";
import "./sketch.css";

/**
 * A drawing that draws itself, in chalk.
 *
 * Two things turn a clean SVG into something hand-made. A displacement map
 * nudges every edge off true by a pixel or two, so no line is dead straight —
 * the difference between a font and handwriting. And a second, high-frequency
 * noise field is punched through the stroke as its alpha, so the line is
 * speckled rather than solid — chalk, not ink.
 *
 * The filter is generated once per instance (its id has to be unique or two of
 * these on a page share one turbulence field and jump), and it is static: it
 * is the paper's texture, not an animation. Only the stroke drawing on and the
 * small movements on top of it move.
 *
 * Paths that should draw on carry `className="sk"` and `pathLength={1}`, so one
 * rule draws a stroke of any real length; give each a `--i` for its place in
 * the stagger. Things that cannot be drawn — a filled shape, a glow — carry
 * `sk-fill` and fade in behind the strokes instead.
 */

export default function Sketch({
  viewBox,
  width,
  height,
  className,
  rough = 2.4,
  children,
}: {
  viewBox: string;
  width?: number;
  height?: number;
  className?: string;
  /** How far edges wander, in user units. Bigger reads as a looser hand. */
  rough?: number;
  children: React.ReactNode;
}) {
  const raw = useId().replace(/:/g, "");
  const fid = `chalk-${raw}`;
  const { ref, inView } = useInView<SVGSVGElement>();

  return (
    <svg
      ref={ref}
      data-drawn={inView || undefined}
      viewBox={viewBox}
      width={width}
      height={height}
      className={`sketch ${className ?? ""}`}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <defs>
        <filter id={fid} x="-25%" y="-25%" width="150%" height="150%">
          {/* Wander: the whole drawing pushed off true by a couple of pixels,
              so nothing is ruler-straight. */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.018"
            numOctaves={2}
            seed={6}
            result="warp"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="warp"
            scale={rough}
            xChannelSelector="R"
            yChannelSelector="G"
            result="wobbled"
          />

          {/* Tooth: a fine noise stretched to mostly-opaque with speckle holes,
              then used as the stroke's own alpha so the line reads as chalk. */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={2}
            seed={11}
            result="speck"
          />
          <feComponentTransfer in="speck" result="tooth">
            <feFuncA type="linear" slope={2.1} intercept={-0.35} />
          </feComponentTransfer>
          <feComposite in="wobbled" in2="tooth" operator="in" />
        </filter>
      </defs>

      <g filter={`url(#${fid})`}>{children}</g>
    </svg>
  );
}
