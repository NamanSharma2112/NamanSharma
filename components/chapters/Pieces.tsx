"use client";

import * as React from "react";
import { BorderBeam } from "border-beam";
import { Liquid } from "liquid-gooey";
import { BotAvatar } from "bot-avatars";
import { SiGithub, SiX } from "@icons-pack/react-simple-icons";

const EMAIL = "namansharmans03@gmail.com";

/* ── the mark above the name ────────────────────────────────────────────
   A ghost, the library's own outline, in a cool soft blue. It was a cream
   marshmallow; the ghost has more character for its size and is at its
   best asleep on the 404. Hovering wakes it into the working hop; a click
   makes it jump. The jump is kept low and barely stretched: at the
   library's default (26 units up, full stretch) a wide outline rose past
   the top of its canvas and was cut flat. */
export function Mark({ sleeping = false }: { sleeping?: boolean }) {
  const [awake, setAwake] = React.useState(false);
  return (
    <span className="mark" onPointerEnter={() => setAwake(true)} onPointerLeave={() => setAwake(false)}>
      <BotAvatar type="ghost" color="#8cb2ff" state={sleeping && !awake ? "sleeping" : awake ? "working" : "default"} size={64} jumpHeight={14} jumpStretch={0.6} aria-hidden="true" />
    </span>
  );
}


/* ── the one call to action ─────────────────────────────────────────────
   LinkedIn rather than email: one click, no mail client, and it shows the
   profile at the same time. Email stays in the socials and the last
   chapter. A highlighted CTA, so the border beam's Pulse type that breathes inside
   the border (pulse-inner). Pulse types switch themselves off under
   reduced motion. */
export function ContactCta() {
  return (
    <BorderBeam size="pulse-inner" theme="dark" strength={0.85} style={{ display: "inline-block", borderRadius: 999 }}>
      <a className="cta" href="https://www.linkedin.com/in/namansharma--ns/" target="_blank" rel="noopener noreferrer">
        <LinkedIn />
        Connect on LinkedIn
      </a>
    </BorderBeam>
  );
}

/* ── the socials ────────────────────────────────────────────────────────
   One round button in the corner that splits into four, Morph effect: the
   pieces run out of it as liquid and are pulled back into it on close. At
   rest the buttons sit 18px apart, well past what a 10px blur can bridge,
   so open they are separate drops; only in motion, while they pass close
   to each other, does the goo stretch and pinch between them. */

function LinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={15} height={15} aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4v11H3zM10 9.5h3.8v1.5h.06a4.2 4.2 0 0 1 3.77-2c4.03 0 4.77 2.65 4.77 6.1v5.4h-4v-4.8c0-1.15-.02-2.62-1.6-2.62-1.6 0-1.85 1.25-1.85 2.54v4.88H10z" />
    </svg>
  );
}

function Mail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" width={16} height={16} aria-hidden="true">
      <rect x="3" y="5.5" width="18" height="13" rx="2.4" />
      <path d="m3.9 7.2 7.2 5.3a1.5 1.5 0 0 0 1.8 0l7.2-5.3" />
    </svg>
  );
}

const LINKS = [
  { label: "X", href: "https://x.com/NamanSharma2112", icon: <SiX size={14} aria-hidden="true" /> },
  { label: "GitHub", href: "https://github.com/NamanSharma2112", icon: <SiGithub size={15} aria-hidden="true" /> },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/namansharma--ns/", icon: <LinkedIn /> },
  { label: "Email", href: `mailto:${EMAIL}`, icon: <Mail /> },
];

const SIZE = 40;
const STEP = 58;

export function Socials() {
  const [open, setOpen] = React.useState(false);
  const root = React.useRef<HTMLDivElement>(null);

  /* Escape and a click anywhere else put it away. */
  React.useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const away = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    addEventListener("keydown", key);
    addEventListener("pointerdown", away);
    return () => {
      removeEventListener("keydown", key);
      removeEventListener("pointerdown", away);
    };
  }, [open]);

  const slot: React.CSSProperties = { position: "absolute", left: 0, bottom: 0 };
  const last = LINKS.length - 1;

  return (
    <div ref={root} className="socials-inner" data-open={open ? "" : undefined}>
      {/* Sized to the open footprint: the liquid's filter region is the
          group's own box. */}
      <Liquid fill="#1c1c1c" blur={10} contrast={18} style={{ position: "relative", width: SIZE, height: SIZE + STEP * LINKS.length }}>
        {LINKS.map((l, i) => (
          <Liquid.Item
            key={l.label}
            style={slot}
            y={open ? -(i + 1) * STEP : 0}
            /* The "bouncy" preset (320/17) with a little more damping:
               same speed, about half the overshoot and wobble. */
            transition={{ stiffness: 320, damping: 22, mass: 1 }}
            /* out from the nearest, back in from the farthest */
            delay={open ? i * 45 : (last - i) * 35}
          >
            <a
              className="soc soc-link"
              style={{ "--i": i } as React.CSSProperties}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              aria-label={l.label}
              tabIndex={open ? 0 : -1}
              aria-hidden={!open}
            >
              {l.icon}
            </a>
          </Liquid.Item>
        ))}
        <Liquid.Item style={slot}>
          <button
            type="button"
            className="soc soc-toggle"
            aria-expanded={open}
            aria-controls="socials-names"
            aria-label={open ? "Hide socials" : "Show socials"}
            onClick={() => setOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </Liquid.Item>
      </Liquid>

      {/* The names, set beside each drop once it has arrived: crisp text
          outside the liquid, so it never melts. */}
      <ul id="socials-names" className="soc-names" aria-hidden="true" data-open={open ? "" : undefined}>
        {LINKS.map((l, i) => (
          <li key={l.label} style={{ bottom: (i + 1) * STEP + SIZE / 2, transitionDelay: open ? `${180 + i * 45}ms` : "0ms" }}>
            {l.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
