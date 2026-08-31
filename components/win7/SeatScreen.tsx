"use client";

import { useCallback, useEffect, useState } from "react";
import { getVolume, playTap, playToggle, setVolume } from "@/lib/sounds";
import "./seat.css";

/**
 * The seat back in front of you, with the screen set into it.
 *
 * The machine on the screen is untouched — it does not know it is in a seat,
 * and nothing here reaches into it. What this adds is the furniture around it:
 * the recess it sits in, the strip along the top that every one of these has,
 * and the ports and switches along the bottom.
 *
 * The switches are real. A dead button on a fake fascia is worse than no
 * button — the rocker drives the volume everything on the site plays at, and
 * the light turns the cabin down around the screen.
 */

/** Notches on the rocker. Five is enough to aim at and few enough to hold. */
const STEPS = 5;

export default function SeatScreen({ children }: { children: React.ReactNode }) {
  const [level, setLevel] = useState(STEPS);
  const [lit, setLit] = useState(true);
  const [clock, setClock] = useState("");

  // The stored volume lives in localStorage, which the server cannot read, so
  // the rocker renders full and corrects itself on the first frame.
  useEffect(() => {
    setLevel(Math.round(getVolume() * STEPS));
  }, []);

  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    tick();
    const id = window.setInterval(tick, 20_000);
    return () => window.clearInterval(id);
  }, []);

  const nudge = useCallback(
    (delta: number) => {
      setLevel((current) => {
        const next = Math.min(STEPS, Math.max(0, current + delta));
        setVolume(next / STEPS);
        // After the gain has moved, so the click you hear is the level you
        // just set rather than the one you left.
        if (next > 0) playTap();
        return next;
      });
    },
    []
  );

  return (
    <div className={`seat ${lit ? "" : "is-dimmed"}`}>
      {/* Locks the page behind it, the same way the other full-screen views
          on this site do. */}
      <div data-fixed-screen hidden />

      <div className="seat-back">
        <div className="ife">
          <div className="ife-top">
            <span className="ife-brand">
              <Fin />
              NS Air
            </span>

            <span className="ife-route">
              <span className="ife-flight">NS 2112</span>
              <span className="ife-rule" />
              DEL
              <Hop />
              BOM
            </span>

            <span className="ife-seat">
              18A
              <span className="ife-rule" />
              {/* Empty until mounted: the server has no clock of yours. */}
              <span className="tabular-nums">{clock || "--:--"}</span>
            </span>
          </div>

          {/* The screen. The machine fills this box and measures it, rather
              than the window, so its windows and its taskbar end at the
              bezel. */}
          <div className="ife-pane">
            {children}
            <span className="ife-glass" aria-hidden />
          </div>

          <div className="ife-base">
            <span className="ife-ports" aria-hidden>
              <span className="ife-jack" />
              <span className="ife-usb" />
            </span>

            <span className="ife-controls">
              <button
                type="button"
                className="ife-key"
                onClick={() => nudge(-1)}
                aria-label="Volume down"
              >
                <Minus />
              </button>

              <span
                className="ife-level"
                role="meter"
                aria-label="Volume"
                aria-valuemin={0}
                aria-valuemax={STEPS}
                aria-valuenow={level}
              >
                {Array.from({ length: STEPS }, (_, i) => (
                  <span
                    key={i}
                    aria-hidden
                    className={`ife-bar ${i < level ? "is-on" : ""}`}
                    // Stepped up across the row, so the rocker reads as a
                    // level even with every bar lit.
                    style={{ height: `${5 + i * 1.5}px` }}
                  />
                ))}
              </span>

              <button
                type="button"
                className="ife-key"
                onClick={() => nudge(1)}
                aria-label="Volume up"
              >
                <Plus />
              </button>

              <button
                type="button"
                className={`ife-key ${lit ? "is-lit" : ""}`}
                aria-pressed={lit}
                aria-label="Reading light"
                onClick={() => {
                  setLit((on) => !on);
                  playToggle();
                }}
              >
                <Bulb />
              </button>
            </span>
          </div>
        </div>

        {/* The tray table's catch, below the unit. */}
        <span className="seat-latch" aria-hidden />
      </div>
    </div>
  );
}

/* ── glyphs ───────────────────────────────────────────────────────────────
   All drawn at 24 and scaled down, so they line up with the rest of the
   site's icons rather than each carrying its own grid. */

/** A tail fin — the airline's mark, at the size a logo goes on a fascia. */
function Fin() {
  return (
    <svg width="9" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M15.5 2.2 8.8 21.8h3.9l1.5-4.6h6.2L15.5 2.2zM15 13.6l1.3-4 1.4 4H15zM3 21.8h4.2l1.3-3.8H4.3L3 21.8z" />
    </svg>
  );
}

/** The hop between two airport codes. */
function Hop() {
  return (
    <svg width="13" height="9" viewBox="0 0 26 12" fill="none" aria-hidden>
      <path
        d="M1 9c4.5 0 7.6-6 12-6 3.6 0 6.5 2.2 8.6 4.4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M18.4 7.6h3.4V4.2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="rotate(38 20.1 5.9)"
      />
    </svg>
  );
}

function Minus() {
  return <span className="block h-[1.5px] w-[9px] rounded-full bg-current" />;
}

function Plus() {
  return (
    <span className="relative block size-[9px]">
      <span className="absolute inset-x-0 top-[3.75px] block h-[1.5px] rounded-full bg-current" />
      <span className="absolute inset-y-0 left-[3.75px] block w-[1.5px] rounded-full bg-current" />
    </span>
  );
}

/** The reading-light symbol from the panel above every seat. */
function Bulb() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path
        d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4 7 7M17 17l1.6 1.6M18.6 5.4 17 7M7 17l-1.6 1.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
