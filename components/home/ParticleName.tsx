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

const INK = {
  light: { color: "#000000", highlight: "#4a4a4a" },
  dark: { color: "#e6ece7", highlight: "#7fb398" },
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
        idleDrift={0.35}
        glow={false}
      />
    </h1>
  );
}
