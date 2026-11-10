"use client";

import * as React from "react";

/* ══ The sky behind /work ══════════════════════════════════════════════
   A soft gradient, top to foot, whose colours follow the reader's own
   clock: a deep night, a pale dawn with a warm horizon, a clear blue day
   fading to cream at the foot, a dusk that turns pink and orange low
   down, then back into night. Between the hours below it is mixed, so it
   never jumps; it is read again every minute, so a page left open drifts
   with the day. Only /work has it — the rest of the site stays on its one
   dark ground.

   The top of every sky stays dark enough for light words to sit on it,
   and the middle, where the ring's name is, never gets pale; only the
   foot, under the strip, is allowed to go light. */

type Stop = { h: number; c: [string, string, string] };

/* hour of the day, and the top, middle and foot of the sky at that hour */
const SKY: Stop[] = [
  { h: 0, c: ["#070a1c", "#121a3c", "#1f2650"] },
  { h: 4.5, c: ["#0b1030", "#262d63", "#4b4778"] },
  { h: 6, c: ["#1f2c5e", "#6a6fa2", "#e7b9a6"] },
  { h: 8, c: ["#22427e", "#7d9fd0", "#f4dcc6"] },
  { h: 11, c: ["#1c3a74", "#6e95c8", "#f3eee3"] },
  { h: 16, c: ["#203f79", "#7499c9", "#f1e8d8"] },
  { h: 18.5, c: ["#262e6a", "#9a6f9c", "#f2ae84"] },
  { h: 20, c: ["#141a40", "#3b3a72", "#8d6a8c"] },
  { h: 22, c: ["#090d24", "#171e46", "#2a2d5c"] },
  { h: 24, c: ["#070a1c", "#121a3c", "#1f2650"] },
];

const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => {
  const x = hex(a);
  const y = hex(b);
  return `rgb(${x.map((v, i) => Math.round(v + (y[i]! - v) * t)).join(", ")})`;
};

const skyAt = (date: Date) => {
  const h = date.getHours() + date.getMinutes() / 60;
  const k = SKY.findIndex((s) => s.h > h);
  const a = SKY[k - 1]!;
  const b = SKY[k]!;
  /* eased between the two hours, so a change of light lingers at each end */
  const t = (h - a.h) / (b.h - a.h);
  const e = t * t * (3 - 2 * t);
  const [top, mid, foot] = [0, 1, 2].map((i) => mix(a.c[i]!, b.c[i]!, e));
  return `linear-gradient(180deg, ${top} 0%, ${mid} 52%, ${foot} 100%)`;
};

export function Sky() {
  const [bg, setBg] = React.useState<string | null>(null);
  React.useEffect(() => {
    const read = () => setBg(skyAt(new Date()));
    read();
    const id = window.setInterval(read, 60000);
    return () => window.clearInterval(id);
  }, []);
  /* until the clock is read, the night sky, so there is never a flash of
     the wrong light */
  return <div className="sky" aria-hidden="true" style={{ backgroundImage: bg ?? skyAt(new Date(2026, 0, 1, 23)) }} />;
}
