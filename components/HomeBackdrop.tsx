"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The desktop wallpaper: a full-bleed photo that cross-fades to the next one
 * on a timer.
 *
 * Every shot is mounted at once and switched with opacity rather than swapping
 * a single `src`, so a change is a plain cross-fade with nothing to decode
 * mid-transition.
 */

const BACKDROPS = [
  "/backdrops/shibuya-rain.jpg",
  "/backdrops/london-night.jpg",
  "/backdrops/kyoto-alley.jpg",
  "/backdrops/beach-blue-hour.jpg",
  "/backdrops/jdm-sunset.jpg",
];

export default function HomeBackdrop({
  intervalMs = 10_000,
  className,
}: {
  /** How long each photo holds before the next one fades in. */
  intervalMs?: number;
  className?: string;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (BACKDROPS.length < 2) return;
    const id = window.setInterval(
      () => setCurrent((i) => (i + 1) % BACKDROPS.length),
      intervalMs
    );
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return (
    <div className={cn("fixed inset-0 z-0 bg-[#0a0a0a]", className)}>
      {BACKDROPS.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes="100vw"
          quality={90}
          priority={i === 0}
          className={cn(
            // A touch of blur reads as glass and is free to composite: the
            // photo never changes, so it rasterises once. `scale-105` hides
            // the transparent fringe blurring leaves at the edges.
            "scale-105 object-cover blur-[2px] transition-opacity duration-[1600ms] ease-in-out",
            i === current ? "opacity-100" : "opacity-0"
          )}
        />
      ))}

      {/* Holds the photos back so the window in front keeps its contrast. */}
      <div className="absolute inset-0 bg-black/25" />
    </div>
  );
}
