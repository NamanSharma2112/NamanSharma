"use client";

import { useEffect, useState } from "react";

/**
 * The corner slug: who, where, and what time it is there.
 *
 * The clock only starts once mounted — rendering a time on the server would
 * hydrate against a different minute and warn.
 */

const NAME = "NAMAN SHARMA";
const PLACE = "JALANDHAR, IN";
const COORDS = "31.3260° N, 75.5762° E";
const TIME_ZONE = "Asia/Kolkata";

export default function CoordinateRail() {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const read = () =>
      setNow(
        new Intl.DateTimeFormat([], {
          timeZone: TIME_ZONE,
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date())
      );
    read();
    const id = window.setInterval(read, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative pl-5">
      {/* The perforated edge, like a boarding pass tear-off. */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-px"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, currentColor 0 3px, transparent 3px 7px)",
          color: "var(--rail-tick)",
        }}
      />

      <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.22em] text-zinc-800 dark:text-zinc-100">
        {NAME}
      </p>
      <div className="mt-1.5 flex flex-col gap-1 font-mono text-[12px] uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
        <p>{PLACE}</p>
        <p>{COORDS}</p>
        <p>
          <span className="tabular-nums">{now ?? "--:--"}</span> IST
        </p>
      </div>
    </div>
  );
}
