"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import ParticleText from "@/components/reactbits/ParticleText";

/**
 * The name, sampled into particles, re-forming when you hover it.
 *
 * The colours cannot be CSS variables: the component parses them with a hex
 * regex to blend between the two, so a `var(--fg)` would fail the parse and
 * fall through to an unstyled default. They are read off the resolved theme
 * here instead, and the canvas is rebuilt when it changes.
 *
 * Nothing renders until the theme is known. Rendering with a guess and
 * correcting it would redraw the whole particle field on first paint.
 */

/**
 * Neutral grey, both ways round.
 *
 * The particles are drawn in a blend between the two, so the highlight is half
 * the colour you actually see — and a green highlight on an off-white made the
 * whole name read green rather than lit. Measured, the ink averaged
 * rgb(179,208,192): six points of green over the red and blue either side of
 * it, which is past where an eye stops calling it grey.
 */
const INK = {
  light: { color: "#000000", highlight: "#4a4a4a" },
  dark: { color: "#ededed", highlight: "#8f8f8f" },
};

export default function ParticleName({ text }: { text: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Plain text until mounted, so the name is in the markup for a crawler and
  // for anyone whose canvas never starts.
  if (!mounted) {
    return <h1 className="home-name">{text}</h1>;
  }

  const ink = INK[resolvedTheme === "dark" ? "dark" : "light"];

  return (
    <h1 className="home-name is-particles" aria-label={text}>
      <ParticleText
        key={resolvedTheme}
        text={text}
        trigger="hover"
        // Sampled at the size it is set at, from the serif the heading already
        // uses — `inherit` reads the container's computed font.
        fontSize={44}
        fontWeight={400}
        fontFamily="inherit"
        // A 44px glyph is a fraction of the hero this component is demoed in,
        // so the sampling step has to come right down or a letter is four dots.
        density={2}
        particleSize={1.5}
        color={ink.color}
        highlightColor={ink.highlight}
        scatter={70}
        gatherDuration={1100}
        stagger={260}
        pointerRepel={18}
        repelRadius={70}
        // Still when nobody is touching it. The drift is a few pixels nobody
        // reads as motion, and it is the difference between the name redrawing
        // nine thousand particles forever and the loop parking itself the
        // moment the letters land.
        idleDrift={0}
        glow={false}
      />
    </h1>
  );
}
