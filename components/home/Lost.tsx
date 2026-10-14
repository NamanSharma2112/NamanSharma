"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Ballpit from "@/components/reactbits/Ballpit";
import { NotFound } from "@/components/ui/not-found";
import { GooeyMenu } from "@/components/ui/gooey-menu";
import "@/components/home/lost.css";

/**
 * The page you get when there is no page.
 *
 * A pit of balls behind it, and your cursor is a ball in it. In front, the
 * number as three loose digits that lean away from the pointer, and a single
 * way out: a pill that pours open into every page on the site.
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

const PAGES = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Writing", href: "/blog" },
  { label: "Inspiration", href: "/inspiration" },
  { label: "Lab", href: "/lab" },
  { label: "Desktop", href: "/desktop" },
];

export default function Lost() {
  const router = useRouter();
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
        <NotFound
          errorCode="404"
          title="Nothing here."
          description="This address does not go anywhere. The balls are real, though — push them around on your way out."
        >
          {/* The only exit, and it holds all of them. Choosing a page goes
              there; nothing on this page needs a second button. */}
          <GooeyMenu
            className="lost-menu"
            width={260}
            defaultValue="Take me somewhere"
            options={PAGES.map((p) => p.label)}
            onSelect={(_, index) => router.push(PAGES[index].href)}
          />
        </NotFound>
      </div>
    </main>
  );
}
