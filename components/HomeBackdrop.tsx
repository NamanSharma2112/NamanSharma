"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The desktop wallpaper: a full-bleed photo that cross-fades to the next one
 * on a timer with a cinematic blur-pull effect.
 *
 * All images stay mounted — the active one is sharp and visible, the rest are
 * hidden. During a transition the outgoing image blurs up while the incoming
 * one sharpens. This guarantees the black container never shows through.
 */

const INITIAL_BACKDROPS = [
  "/backdrops/kyoto-alley.jpg",
  "/backdrops/shibuya-rain.jpg",
  "/backdrops/london-night.jpg",
  "/backdrops/beach-blue-hour.jpg",
  "/backdrops/jdm-sunset.jpg",
];

export default function HomeBackdrop({
  intervalMs = 10_000,
  className,
}: {
  intervalMs?: number;
  className?: string;
}) {
  const [backdrops, setBackdrops] = useState(INITIAL_BACKDROPS);
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(-1);

  useEffect(() => {
    if (backdrops.length < 2) return;
    const id = setInterval(() => {
      setCurrent((cur) => {
        setPrev(cur);
        return (cur + 1) % backdrops.length;
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, backdrops.length]);

  // Clear prev after the crossfade completes
  useEffect(() => {
    if (prev < 0) return;
    // Total transition is 0.5s (blur) + 0.6s (fade) = 1.1s
    const t = setTimeout(() => setPrev(-1), 1200);
    return () => clearTimeout(t);
  }, [prev]);

  const handleImageError = (failedSrc: string) => {
    setBackdrops((currentList) => {
      const newList = currentList.filter((src) => src !== failedSrc);
      // Reset current index if it goes out of bounds due to a removal
      if (current >= newList.length && newList.length > 0) {
        setCurrent(0);
      }
      return newList;
    });
  };

  if (backdrops.length === 0) {
    return <div className={cn("fixed inset-0 z-0 bg-zinc-900", className)} />;
  }

  return (
    <div className={cn("fixed inset-0 z-0 bg-zinc-900", className)}>
      {backdrops.map((src, i) => {
        const isActive = i === current;
        const isOutgoing = i === prev;

        return (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            sizes="100vw"
            quality={100}
            priority={i === 0}
            className="object-cover"
            onError={() => handleImageError(src)}
            style={{
              // Sequence: Blur over 0.5s, THEN crossfade opacity over 0.6s
              transition: "filter 0.5s ease-in, opacity 0.6s ease-in-out 0.5s, transform 1.1s ease-out",
              opacity: isActive ? 1 : 0,
              transform: isActive
                ? "scale(1.05)"
                : isOutgoing
                  ? "scale(1.08)"
                  : "scale(1.05)",
              filter: isActive
                ? "blur(0px)"
                : isOutgoing
                  ? "blur(12px)"
                  : "blur(0px)",
            }}
          />
        );
      })}

      {/* Holds the photos back so the window in front keeps its contrast. */}
      <div className="absolute inset-0 bg-black/25" />
    </div>
  );
}
