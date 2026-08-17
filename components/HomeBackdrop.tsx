"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * A full-bleed photo that cross-fades to the next one on a timer with a
 * cinematic blur-pull effect.
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

/** Blur (0.5s) then cross-fade (0.6s). */
const TRANSITION_MS = 1200;

export default function HomeBackdrop({
  sources = INITIAL_BACKDROPS,
  intervalMs = 10_000,
  scrimClassName = "bg-black/25",
  className,
}: {
  /** Photos to cycle. Any that fail to load drop out of the rotation. */
  sources?: string[];
  intervalMs?: number;
  /** How hard the photos are held back so content in front stays readable. */
  scrimClassName?: string;
  className?: string;
}) {
  const [broken, setBroken] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [outgoing, setOutgoing] = useState<string | null>(null);

  // A missing file is expected — the list may name a photo that has not been
  // added yet — so it leaves the rotation instead of showing a gap.
  const backdrops = useMemo(
    () => sources.filter((src) => !broken.includes(src)),
    [sources, broken]
  );

  const current = backdrops.length
    ? backdrops[index % backdrops.length]
    : null;

  useEffect(() => {
    if (backdrops.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % backdrops.length),
      intervalMs
    );
    return () => clearInterval(id);
  }, [intervalMs, backdrops]);

  // Hold the photo we just left on screen, blurring, until the fade is over.
  const shown = useRef<string | null>(null);
  useEffect(() => {
    const previous = shown.current;
    shown.current = current;
    if (!previous || previous === current) return;
    setOutgoing(previous);
    const t = setTimeout(() => setOutgoing(null), TRANSITION_MS);
    return () => clearTimeout(t);
  }, [current]);

  const handleImageError = (failedSrc: string) =>
    setBroken((list) => (list.includes(failedSrc) ? list : [...list, failedSrc]));

  return (
    <div className={cn("fixed inset-0 z-0 bg-zinc-900", className)}>
      {backdrops.map((src, i) => {
        const isActive = src === current;
        const isOutgoing = src === outgoing;

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
              transition:
                "filter 0.5s ease-in, opacity 0.6s ease-in-out 0.5s, transform 1.1s ease-out",
              opacity: isActive ? 1 : 0,
              // The visible photo sits at 1:1. These sources are ~700px wide
              // and already stretched about 2x to cover a desktop, so an idle
              // zoom on top of that only costs sharpness. The outgoing frame
              // still scales up to cover the fringe its blur leaves behind.
              transform: isOutgoing ? "scale(1.06)" : "scale(1)",
              filter: isOutgoing ? "blur(12px)" : "blur(0px)",
            }}
          />
        );
      })}

      {/* Holds the photos back so the window in front keeps its contrast. */}
      <div className={cn("absolute inset-0", scrimClassName)} />
    </div>
  );
}
