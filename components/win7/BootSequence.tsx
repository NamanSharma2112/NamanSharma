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
    <div className="fixed inset-0 z-[200] bg-black text-white">
      {phase === "post" && (
        <pre className="h-full overflow-hidden p-8 font-mono text-[12.5px] leading-[1.55] text-[#c8c8c8]">
          {POST_LINES.join("\n")}
          <span className="ml-1 inline-block h-[13px] w-[7px] translate-y-[2px] bg-[#c8c8c8]" />
        </pre>
      )}

      {phase === "starting" && (
        <div className="flex h-full flex-col items-center justify-center gap-12">
          {/* The flag, tilted just enough to read as an object rather than a
              grid of squares. */}
          <div
            className="w7-flag grid gap-[7px]"
            style={{
              gridTemplateColumns: "58px 58px",
              transform: "perspective(420px) rotateX(14deg) rotateZ(-7deg)",
            }}
          >
            {PANES.map((pane) => (
              <span
                key={pane.color}
                className="w7-pane block h-[58px] rounded-[5px]"
                style={
                  {
                    "--fx": pane.from.split(",")[0],
                    "--fy": pane.from.split(",")[1].trim(),
                    animationDelay: `${pane.delay}s`,
                    background: `linear-gradient(150deg, ${pane.color}, ${pane.color} 55%, rgba(255,255,255,0.55))`,
                    boxShadow: `inset 0 0 14px rgba(255,255,255,0.45), 0 0 22px ${pane.color}66`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>

          <div className="w7-boot-caption flex flex-col items-center gap-2">
            <p className="w7-sheen text-[19px] font-light tracking-wide">
              Starting Windows
            </p>
            <p className="text-[11px] font-light tracking-wide text-white/35">
              press any key to skip
            </p>
          </div>
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
