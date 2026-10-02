"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";

/**
 * The strip at the top: today's date, and the light the page is in.
 *
 * Both are panels that hang off a word rather than controls that sit in a bar —
 * the bar itself is three small pieces of text, and everything it can do is
 * behind them.
 *
 * Nothing involving the clock renders until the component has mounted. The
 * server has no idea what time it is where you are, so anything it rendered
 * would be replaced on the first client pass and React would call it a
 * hydration mismatch.
 */

/** Daylight, for the automatic setting: light between these hours, dark outside. */
const DAY_FROM = 7;
const DAY_TO = 19;

/** Which of the three the reader picked — not the resolved theme. */
const PREF = "appearance";
type Pref = "auto" | "light" | "dark";

const byClock = (d: Date) => {
  const h = d.getHours();
  return h >= DAY_FROM && h < DAY_TO ? "light" : "dark";
};

export default function TopBar({ className }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);
  const [open, setOpen] = useState<null | "clock" | "light">(null);
  const [pref, setPref] = useState<Pref>("auto");
  const { setTheme } = useTheme();
  const still = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    let saved: Pref = "auto";
    try {
      const v = localStorage.getItem(PREF);
      if (v === "auto" || v === "light" || v === "dark") saved = v;
    } catch {
      // Storage blocked: automatic is a fine thing to fall back to.
    }
    setPref(saved);
    return () => window.clearInterval(id);
  }, []);

  // Automatic is the one setting that can change while you are sitting there,
  // so it is re-resolved on every tick rather than only when it is chosen.
  useEffect(() => {
    if (!now) return;
    setTheme(pref === "auto" ? byClock(now) : pref);
  }, [pref, now, setTheme]);

  // A panel that opens on click has to close on an outside click, or it is a
  // panel you can only get rid of by picking something.
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(null);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("pointerdown", away);
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("pointerdown", away);
      window.removeEventListener("keydown", esc);
    };
  }, [open]);

  const choose = (p: Pref) => {
    setPref(p);
    try {
      localStorage.setItem(PREF, p);
    } catch {
      // Storage blocked: the choice holds for this page and no longer.
    }
    setOpen(null);
  };

  const date = now
    ? now.toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : "";

  const panel = {
    initial: still ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: -8 },
    animate: still ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 },
    exit: still ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -4 },
    transition: still
      ? { duration: 0.12 }
      : ({ type: "spring", stiffness: 320, damping: 24, mass: 0.6 } as const),
  };

  return (
    <div ref={box} className={`topbar ${className ?? ""}`}>
      {/* The date, with the clock behind it. */}
      <div className="topbar-slot">
        <button
          type="button"
          className={`topbar-item ${open === "clock" ? "is-open" : ""}`}
          onMouseEnter={() => setOpen("clock")}
          onMouseLeave={() => setOpen((o) => (o === "clock" ? null : o))}
          onFocus={() => setOpen("clock")}
          onClick={() => setOpen((o) => (o === "clock" ? null : "clock"))}
        >
          {/* Reserved at a fixed width so the bar does not jump when the date
              arrives on the client. */}
          <span className="topbar-date">{date || "      "}</span>
        </button>

        <AnimatePresence>
          {open === "clock" && now && (
            <motion.div className="topbar-panel is-clock" {...panel}>
              <p className="clock-date">{date}</p>
              <Face now={now} />
              <p className="clock-digits">
                {now.toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                }).replace(/\s?[AP]M$/i, "")}
              </p>
              <p className="clock-meridiem">
                {now.getHours() < 12 ? "AM" : "PM"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Hand now={now} />

      {/* The light, and what decides it. */}
      <div className="topbar-slot">
        <button
          type="button"
          aria-label="Appearance"
          aria-expanded={open === "light"}
          className={`topbar-item ${open === "light" ? "is-open" : ""}`}
          onClick={() => setOpen((o) => (o === "light" ? null : "light"))}
        >
          <Glyph pref={pref} now={now} />
        </button>

        <AnimatePresence>
          {open === "light" && (
            <motion.div className="topbar-panel is-light" {...panel}>
              <p className="appear-title">Appearance</p>
              <p className="appear-note">
                Light from {DAY_FROM}am–{DAY_TO - 12}pm in your local time.
              </p>

              <div className="appear-list">
                {(
                  [
                    ["auto", "Automatic", "Follow your time of day"],
                    ["light", "Sunny", "Light mode"],
                    ["dark", "Night", "Dark mode"],
                  ] as const
                ).map(([key, title, note]) => (
                  <button
                    key={key}
                    type="button"
                    className={`appear-row ${pref === key ? "is-on" : ""}`}
                    onClick={() => choose(key)}
                  >
                    <span className="appear-icon">
                      <Glyph pref={key} now={now} />
                    </span>
                    <span className="appear-text">
                      <span className="appear-row-title">{title}</span>
                      <span className="appear-row-note">{note}</span>
                    </span>
                    {pref === key && <Check />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── the face ───────────────────────────────────────────────────────────── */

/**
 * Hands as plain lines on a 100-box, rotated about the middle.
 *
 * The hour hand carries the minutes as a fraction of its own step, so at half
 * past it sits between the two numbers rather than snapping from one to the
 * next — the single detail that separates a clock from a clock graphic.
 */
function Face({ now }: { now: Date }) {
  const s = now.getSeconds();
  const m = now.getMinutes() + s / 60;
  const h = (now.getHours() % 12) + m / 60;

  return (
    <svg viewBox="0 0 100 100" className="clock-face" aria-hidden>
      <circle cx="50" cy="50" r="38" className="clock-rim" />
      <g className="clock-hands">
        <line x1="50" y1="50" x2="50" y2="27" transform={`rotate(${h * 30} 50 50)`} strokeWidth="3.4" />
        <line x1="50" y1="50" x2="50" y2="18" transform={`rotate(${m * 6} 50 50)`} strokeWidth="3.4" />
      </g>
      <line
        x1="50"
        y1="56"
        x2="50"
        y2="17"
        className="clock-second"
        transform={`rotate(${s * 6} 50 50)`}
      />
      <circle cx="50" cy="50" r="2.6" className="clock-pin" />
    </svg>
  );
}

/** The small mark between the two items — a second hand, ticking, at text size. */
function Hand({ now }: { now: Date | null }) {
  return (
    <svg viewBox="0 0 24 24" className="topbar-hand" aria-hidden>
      <line
        x1="12"
        y1="12"
        x2="12"
        y2="3"
        transform={`rotate(${(now?.getSeconds() ?? 0) * 6} 12 12)`}
      />
    </svg>
  );
}

function Glyph({ pref, now }: { pref: Pref; now: Date | null }) {
  const resolved = pref === "auto" ? (now ? byClock(now) : "light") : pref;
  if (pref === "auto") {
    return (
      <svg viewBox="0 0 24 24" className="topbar-glyph" aria-hidden>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.2V12l3 1.8" />
      </svg>
    );
  }
  if (resolved === "dark") {
    return (
      <svg viewBox="0 0 24 24" className="topbar-glyph is-moon" aria-hidden>
        <path d="M20 14.2A8.4 8.4 0 1 1 9.8 4a6.6 6.6 0 0 0 10.2 10.2Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="topbar-glyph is-sun" aria-hidden>
      <circle cx="12" cy="12" r="4.4" />
      <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4 17 7M7 17l-1.6 1.6" />
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" className="appear-check" aria-hidden>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}
