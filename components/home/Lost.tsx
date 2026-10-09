"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Ballpit from "@/components/reactbits/Ballpit";
import "@/components/home/lost.css";

/**
 * The page you get when there is no page.
 *
 * A pit of balls behind the number, and your cursor is a ball in it — so the
 * dead end is at least worth a few seconds. Everything in front of it is a
 * link back out.
 *
 * The balls are lit and shaded by three.js, so their colours are numbers
 * rather than CSS variables and have to be chosen for the theme by hand.
 */
const BALLS = {
  light: {
    colors: [0x1c1c1c, 0x55585b, 0x9b9f9c],
    ambient: 0xffffff,
    ambientIntensity: 1,
    lightIntensity: 190,
  },
  dark: {
    colors: [0xededed, 0x9a9a9a, 0x5c5c5c],
    ambient: 0xbfc4c0,
    ambientIntensity: 1.5,
    lightIntensity: 240,
  },
};

export default function Lost() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const ink = BALLS[resolvedTheme === "dark" ? "dark" : "light"];

  return (
    <main className="lost">
      {/* Nothing until the theme is known: the balls would be built in the
          wrong colours and rebuilding the pit means rebuilding every sphere. */}
      <div className="lost-pit" aria-hidden>
        {mounted && (
          <Ballpit
            key={resolvedTheme}
            // Light gravity on purpose: at full weight they all end up in a
            // heap along the floor and the top two thirds of the page is
            // empty. This keeps them drifting through the whole frame.
            count={150}
            gravity={0.16}
            friction={0.998}
            wallBounce={0.9}
            followCursor
            colors={ink.colors}
            ambientColor={ink.ambient}
            ambientIntensity={ink.ambientIntensity}
            lightIntensity={ink.lightIntensity}
            minSize={0.45}
            maxSize={1.05}
            maxVelocity={0.14}
          />
        )}
      </div>

      <div className="lost-card">
        <p className="lost-number">404</p>
        <h1 className="lost-title">Nothing here</h1>
        <p className="lost-note">
          This address does not go anywhere. The balls are real, though — push
          them around on your way out.
        </p>
        <nav className="lost-links">
          <Link href="/">Home</Link>
          <Link href="/work">Work</Link>
          <Link href="/blog">Writing</Link>
          <Link href="/lab">Lab</Link>
        </nav>
      </div>
    </main>
  );
}
