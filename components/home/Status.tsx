"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";

/**
 * The strip on the right of the masthead: today's date, a second hand ticking
 * beside it, and the light the page is in.
 *
 * Both items are quiet until you ask. The date opens a clock, the glyph opens
 * the three ways the page can be lit — nothing is a labelled control, which is
 * what keeps a personal page from acquiring a toolbar.
 *
 * Nothing involving the clock renders before mount: the server has no idea what
 * time it is where you are, so anything it rendered would be replaced on the
 * first client pass and React would call it a mismatch.
 */

/** Daylight, for the automatic setting. */
const DAY_FROM = 7;
const DAY_TO = 19;
const PREF = "appearance";

type Pref = "auto" | "light" | "dark";

const byClock = (d: Date) => (d.getHours() >= DAY_FROM && d.getHours() < DAY_TO ? "light" : "dark");

export default function Status() {
  const [now, setNow] = useState<Date | null>(null);
  const [open, setOpen] = useState<null | "clock" | "light">(null);
  const [pref, setPref] = useState<Pref>("auto");
  const box = useRef<HTMLDivElement>(null);
  const still = useReducedMotion();
  const { setTheme } = useTheme();

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

  // Through the provider, not by setting the class here. next-themes owns the
  // class on <html> and would overwrite anything written behind its back.
  // Automatic is re-resolved on every tick, because it is the one setting that
  // can change while you are sitting there.
  useEffect(() => {
    if (!now) return;
    setTheme(pref === "auto" ? byClock(now) : pref);
  }, [pref, now, setTheme]);

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

  const date = now ? now.toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "";
  const panel = {
    initial: still ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -6 },
    animate: still ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 },
    exit: still ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -3 },
    transition: still
      ? { duration: 0.1 }
      : ({ type: "spring", stiffness: 340, damping: 26, mass: 0.6 } as const),
  };

  return (
    <div ref={box} className="st">
      <div className="st-slot">
        <button
          type="button"
          className="st-date"
          onMouseEnter={() => setOpen("clock")}
          onMouseLeave={() => setOpen((o) => (o === "clock" ? null : o))}
          onFocus={() => setOpen("clock")}
          onClick={() => setOpen((o) => (o === "clock" ? null : "clock"))}
        >
          {/* Held at a fixed width so the strip does not jump when the date
              arrives on the client. */}
          {date || "     "}
        </button>

        <AnimatePresence>
          {open === "clock" && now && (
            <motion.div className="st-panel st-clock" {...panel}>
              <p className="st-clock-date">{date}</p>
              <Face now={now} />
              <p className="st-clock-time">
                {now
                  .toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", hour12: true })
                  .replace(/\s?[AP]M$/i, "")}
              </p>
              <p className="st-clock-ampm">{now.getHours() < 12 ? "AM" : "PM"}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* A second hand at text size, between the two. */}
      <svg viewBox="0 0 24 24" className="st-tick" aria-hidden>
        <line x1="12" y1="12" x2="12" y2="4" transform={`rotate(${(now?.getSeconds() ?? 0) * 6} 12 12)`} />
      </svg>

      <div className="st-slot">
        <button
          type="button"
          aria-label="Appearance"
          aria-expanded={open === "light"}
          className="st-glyph-btn"
          onClick={() => setOpen((o) => (o === "light" ? null : "light"))}
        >
          <Glyph pref={pref} now={now} />
        </button>

        <AnimatePresence>
          {open === "light" && (
            <motion.div className="st-panel st-light" {...panel}>
              <p className="st-light-title">Appearance</p>
              <p className="st-light-note">
                Light from {DAY_FROM}am–{DAY_TO - 12}pm in your local time.
              </p>

              <div className="st-light-list">
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
                    className={`st-row ${pref === key ? "is-on" : ""}`}
                    onClick={() => choose(key)}
                  >
                    <span className="st-row-icon">
                      <Glyph pref={key} now={now} />
                    </span>
                    <span className="st-row-text">
                      <span className="st-row-title">{title}</span>
                      <span className="st-row-note">{note}</span>
                    </span>
                    {pref === key && (
                      <svg viewBox="0 0 24 24" className="st-check" aria-hidden>
                        <path d="m5 12.5 4.5 4.5L19 7.5" />
                      </svg>
                    )}
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

/**
 * Hands as lines on a 100-box.
 *
 * The hour hand carries the minutes as a fraction of its own step, so at half
 * past it sits between the numbers rather than snapping from one to the next —
 * the detail that separates a clock from a picture of one.
 */
function Face({ now }: { now: Date }) {
  const s = now.getSeconds();
  const m = now.getMinutes() + s / 60;
  const h = (now.getHours() % 12) + m / 60;
  return (
    <svg viewBox="0 0 100 100" className="st-face" aria-hidden>
      <circle cx="50" cy="50" r="37" className="st-rim" />
      <g className="st-hands">
        <line x1="50" y1="50" x2="50" y2="28" transform={`rotate(${h * 30} 50 50)`} strokeWidth="3.2" />
        <line x1="50" y1="50" x2="50" y2="19" transform={`rotate(${m * 6} 50 50)`} strokeWidth="3.2" />
      </g>
      <line x1="50" y1="56" x2="50" y2="18" className="st-second" transform={`rotate(${s * 6} 50 50)`} />
      <circle cx="50" cy="50" r="2.5" className="st-pin" />
    </svg>
  );
}

function Glyph({ pref, now }: { pref: Pref; now: Date | null }) {
  if (pref === "auto") {
    return (
      <svg viewBox="0 0 24 24" className="st-glyph" aria-hidden>
        <circle cx="12" cy="12" r="8.4" />
        <path d="M12 7.3V12l3 1.8" />
      </svg>
    );
  }
  if (pref === "dark") {
    return (
      <svg viewBox="0 0 24 24" className="st-glyph is-moon" aria-hidden>
        <path d="M20 14.2A8.4 8.4 0 1 1 9.8 4a6.6 6.6 0 0 0 10.2 10.2Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="st-glyph is-sun" aria-hidden>
      <circle cx="12" cy="12" r="4.3" />
      <path d="M12 2.7v2.1M12 19.2v2.1M2.7 12h2.1M19.2 12h2.1M5.5 5.5l1.5 1.5M17 17l1.5 1.5M18.5 5.5 17 7M7 17l-1.5 1.5" />
    </svg>
  );
}
