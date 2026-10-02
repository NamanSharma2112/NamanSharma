"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Turning the machine on: firmware post, the flag assembling itself, then a
 * welcome. Three stills that each hold long enough to read.
 *
 * Any key or click cuts straight to the desktop — the sequence is the joke,
 * but nobody should have to sit through it twice.
 */

type Phase = "post" | "starting" | "welcome";

const POST_MS = 1500;
const STARTING_MS = 3900;
const WELCOME_MS = 1500;

const POST_LINES = [
  "Naman BIOS v7.00PG  ·  (C) 2009 Sharma Systems, Inc.",
  "",
  "Main Processor      : Design Engineer @ 3.40GHz",
  "Memory Testing      : 4194304K OK",
  "",
  "Detecting IDE drives ...",
  "  Primary Master   : NS-SSD 512GB",
  "  Primary Slave    : None",
  "  Secondary Master : CD-ROM DRIVE 52x",
  "",
  "Booting from Hard Disk ...",
];

/** The four panes, in the order they appear, with the corner each flies from. */
const PANES = [
  { color: "#e64a34", from: "-90px, -70px", delay: 0 },
  { color: "#7ab648", from: "90px, -70px", delay: 0.12 },
  { color: "#2f8fd0", from: "-90px, 70px", delay: 0.24 },
  { color: "#f2b01e", from: "90px, 70px", delay: 0.36 },
];

export default function BootSequence({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>("post");
  const done = useRef(false);

  // One callback either way, whether it ran through or was skipped. Held in a
  // ref so the timers below are never restarted by the parent re-rendering.
  const finish = useRef(onDone);
  useEffect(() => {
    finish.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const end = () => {
      if (done.current) return;
      done.current = true;
      finish.current();
    };

    const timers = [
      window.setTimeout(() => setPhase("starting"), POST_MS),
      window.setTimeout(() => setPhase("welcome"), POST_MS + STARTING_MS),
      window.setTimeout(end, POST_MS + STARTING_MS + WELCOME_MS),
    ];

    const skip = () => {
      timers.forEach(window.clearTimeout);
      end();
    };

    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-[200] bg-black text-white">
      {phase === "post" && (
        <pre className="h-full overflow-hidden p-8 font-mono text-[12.5px] leading-[1.55] text-[#c8c8c8]">
          {POST_LINES.join("\n")}
          <span className="ml-1 inline-block h-[13px] w-[7px] translate-y-[2px] bg-[#c8c8c8]" />
        </pre>
      )}

      {phase === "starting" && (
        <div className="flex h-full flex-col items-center justify-center gap-10">
          {/* The apple, then a bar that fills. The whole Mac boot is these two
              things on black, and the restraint is the point — anything more
              and it stops being a boot screen. */}
          <svg viewBox="0 0 16 16" className="mac-boot-apple" aria-hidden>
            <path
              fill="currentColor"
              d="M11.03 8.47c-.02-1.72 1.4-2.54 1.47-2.58-.8-1.17-2.05-1.33-2.5-1.35-1.06-.11-2.07.62-2.61.62-.54 0-1.37-.6-2.25-.59-1.16.02-2.23.67-2.82 1.71-1.2 2.09-.31 5.18.86 6.87.58.83 1.26 1.75 2.16 1.72.87-.04 1.2-.56 2.25-.56s1.35.56 2.27.54c.94-.02 1.53-.84 2.1-1.67.66-.96.93-1.88.95-1.93-.02-.01-1.82-.7-1.84-2.78ZM9.33 3.42c.48-.58.8-1.38.71-2.18-.69.03-1.52.46-2.01 1.03-.44.51-.82 1.33-.72 2.11.77.06 1.55-.39 2.02-.96Z"
            />
          </svg>

          <span className="mac-boot-bar" aria-hidden>
            <span className="mac-boot-fill" />
          </span>

          <p className="text-[11px] font-light tracking-wide text-white/35">
            press any key to skip
          </p>
        </div>
      )}

      {phase === "welcome" && (
        <div
          className="flex h-full flex-col items-center justify-center gap-5"
          style={{
            background:
              "radial-gradient(circle at 50% 45%, #2b6ea8 0%, #17456e 45%, #0a2138 100%)",
          }}
        >
          <span
            className="grid size-[74px] place-items-center rounded-full text-[26px] font-semibold text-white/90"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.35), rgba(255,255,255,0.08))",
              boxShadow:
                "inset 0 0 0 1px rgba(255,255,255,0.55), 0 6px 20px rgba(0,0,0,0.4)",
            }}
          >
            NS
          </span>
          <p className="text-[22px] font-light tracking-wide text-white/95">
            Welcome
          </p>
        </div>
      )}
    </div>
  );
}
