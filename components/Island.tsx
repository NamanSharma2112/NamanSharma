"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { BotAvatar } from "bot-avatars";

/* ══ The island ════════════════════════════════════════════════════════
   The site's one piece of navigation: a small dark pill at the top of
   every page with the ghost in it and the name of where you are. Reach
   for it — point at it, tab to it, tap it — and it swells into the three
   places there are, Home, Work and Writing, with a soft highlight that
   slides to whichever you are on or pointing at. Let go and it shrinks
   back to the ghost and the one word.

   ── ONE SHAPE, TWO SIZES ──────────────────────────────────────────────
   It is one pill whose width is animated between the two contents it can
   hold, both measured, never guessed; the two contents cross-fade through
   a blur inside it while it changes size, and the ghost sits in the same
   place in both, so the eye has one thing that does not move. The curve
   is a soft spring, unhurried, that swells a hair past its size and
   settles back: the way something alive breathes out.

   ── IT NOTICES WHERE YOU ARE ──────────────────────────────────────────
   Going to another page, the pill gives a small breath — out and back —
   and the ghost hops, so the change of place is felt at the top as well
   as seen in the page. Under reduced motion it simply changes. */

const PLACES = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Writing" },
] as const;

const placeOf = (path: string) => (path.startsWith("/work") ? 1 : path.startsWith("/blog") ? 2 : 0);

export function Island() {
  const path = usePathname() ?? "/";
  const at = placeOf(path);
  const [open, setOpen] = React.useState(false);
  const [aim, setAim] = React.useState<number | null>(null);
  const [hop, setHop] = React.useState(false);
  const root = React.useRef<HTMLElement>(null);
  const now = React.useRef<HTMLSpanElement>(null);
  const nav = React.useRef<HTMLSpanElement>(null);
  const links = React.useRef<(HTMLAnchorElement | null)[]>([]);
  const [w, setW] = React.useState<{ shut: number; open: number } | null>(null);
  const [pill, setPill] = React.useState<{ x: number; w: number } | null>(null);

  /* both sizes, measured from the two contents laid out at rest */
  React.useLayoutEffect(() => {
    const fit = () => {
      if (now.current && nav.current) setW({ shut: now.current.scrollWidth, open: nav.current.scrollWidth });
    };
    fit();
    document.fonts?.ready.then(fit);
  }, [at]);

  /* the highlight goes to what is pointed at, else to where you are */
  const lit = aim ?? at;
  React.useLayoutEffect(() => {
    const a = links.current[lit];
    if (a) setPill({ x: a.offsetLeft, w: a.offsetWidth });
  }, [lit, w]);

  /* a breath and a hop on arriving somewhere new, and it closes */
  const first = React.useRef(true);
  React.useEffect(() => {
    setOpen(false);
    setAim(null);
    if (first.current) {
      first.current = false;
      return;
    }
    setHop(true);
    const id = window.setTimeout(() => setHop(false), 900);
    return () => window.clearTimeout(id);
  }, [path]);

  /* a tap outside puts it away again */
  React.useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("keydown", key);
    };
  }, [open]);

  return (
    <nav
      ref={root}
      className="island"
      aria-label="Site"
      data-open={open || undefined}
      data-hop={hop || undefined}
      style={w ? { width: open ? w.open : w.shut } : undefined}
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        setOpen(false);
        setAim(null);
      }}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setOpen(false);
          setAim(null);
        }
      }}
    >
      <span className="island-ghost" aria-hidden="true">
        <BotAvatar type="ghost" color="#8cb2ff" size={22} state={hop || open ? "working" : "default"} jumpHeight={10} jumpStretch={0.5} />
      </span>

      {/* shut: the ghost and where you are; a tap opens it on a phone */}
      <span ref={now} className="island-now" aria-hidden={open}>
        <button type="button" className="island-here" tabIndex={-1} onClick={() => setOpen(true)}>
          {PLACES[at].label}
        </button>
      </span>

      {/* open: the three places, and the highlight sliding between them */}
      <span ref={nav} className="island-nav" aria-hidden={!open}>
        {pill && <span className="island-pill" style={{ transform: `translateX(${pill.x}px)`, width: pill.w }} aria-hidden="true" />}
        {PLACES.map((p, i) => (
          <Link
            key={p.href}
            ref={(el) => {
              links.current[i] = el;
            }}
            href={p.href}
            className="island-link"
            aria-current={i === at ? "page" : undefined}
            tabIndex={0}
            onPointerEnter={() => setAim(i)}
            onFocus={() => setAim(i)}
            onClick={() => setOpen(false)}
          >
            {p.label}
          </Link>
        ))}
      </span>
    </nav>
  );
}
