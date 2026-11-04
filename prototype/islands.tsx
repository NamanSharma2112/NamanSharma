/**
 * The React pieces of the portfolio prototype (public/prototype.html), which
 * is otherwise plain HTML. Each mounts into its own placeholder and replaces
 * the plain fallback inside it.
 *
 * Build, from the repo root, with any esbuild:
 *   esbuild prototype/islands.tsx --bundle --format=esm --minify \
 *     --jsx=automatic --define:process.env.NODE_ENV='"production"' \
 *     --outfile=public/prototype/islands.js
 */
import * as React from "react";
import { createRoot } from "react-dom/client";
import { BorderBeam } from "border-beam";
import { Liquid } from "liquid-gooey";
import { SiGithub, SiX } from "@icons-pack/react-simple-icons";
import { BotAvatar } from "bot-avatars";

const EMAIL = "namansharmans03@gmail.com";

/* ── the one call to action ─────────────────────────────────────────────
   A highlighted CTA button, so the Pulse type that breathes inside the
   border (pulse-inner), per the libraries.dev placement rules. Pulse types
   switch themselves off under reduced motion. */
function EmailCta() {
  return (
    <BorderBeam size="pulse-inner" theme="dark" strength={0.85} style={{ display: "inline-block", borderRadius: 999 }}>
      <a className="cta" href={`mailto:${EMAIL}`}>
        Email me
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
  { label: "LinkedIn", href: "https://www.linkedin.com/in/namansharma2112/", icon: <LinkedIn /> },
  { label: "Email", href: `mailto:${EMAIL}`, icon: <Mail /> },
];

const SIZE = 40;
const STEP = 58;

function Socials() {
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
            transition="bouncy"
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

/* ── the mark above the name ────────────────────────────────────────────
   A trial: bot avatars are made for agents, not people, so this is here to
   see whether one reads as a friendly mark in the spot a portrait would
   take. Hovering wakes it into the working hop; a click makes it jump. */
/* A marshmallow: a squat, puffy cylinder seen side-on, its top and bottom
   bowed out and its sides soft, in powdered off-white. The square type only
   places the face in the middle; the outline is our own. */
const MARSHMALLOW =
  "M32 15C44 13 56 13 68 15C82 15.5 92 25 92 38C93.5 46 93.5 54 92 62C92 75 82 84.5 68 85C56 87 44 87 32 85C18 84.5 8 75 8 62C6.5 54 6.5 46 8 38C8 25 18 15.5 32 15Z";

function Mark() {
  const [awake, setAwake] = React.useState(false);
  return (
    <span className="mark" onPointerEnter={() => setAwake(true)} onPointerLeave={() => setAwake(false)}>
      <BotAvatar type="square" path={MARSHMALLOW} color="#f4ece6" state={awake ? "working" : "default"} size={64} aria-hidden="true" />
    </span>
  );
}

const mark = document.getElementById("mark-root");
if (mark) createRoot(mark).render(<Mark />);

const cta = document.getElementById("cta-root");
if (cta) createRoot(cta).render(<EmailCta />);

const socials = document.getElementById("socials");
if (socials) createRoot(socials).render(<Socials />);
