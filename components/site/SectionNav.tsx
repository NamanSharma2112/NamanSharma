"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SECTIONS, num } from "@/components/site/sections";

/**
 * The bar at the top, which changes job as you leave the hero.
 *
 * At rest it is a name and a couple of links. Once the first section arrives it
 * becomes an index of the page — every section, numbered, with the one you are
 * in picked out and the rest dropped back. It is the thing that makes a long
 * page feel navigable rather than endless, and it costs no extra chrome because
 * it replaces a bar that was already there.
 *
 * Which section you are in is decided by an observer per section rather than by
 * arithmetic on scrollY: sections are different heights, and the one that is
 * "current" is the one occupying the middle of the screen, which a threshold on
 * scroll position gets wrong every time a section is short.
 */
export default function SectionNav({ email }: { email: string }) {
  const [indexed, setIndexed] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const still = useReducedMotion();

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    // The bar turns into the index when the hero has gone.
    const io = new IntersectionObserver(
      ([e]) => setIndexed(!e.isIntersecting),
      { rootMargin: "-78px 0px 0px 0px", threshold: 0 },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    // A band through the middle of the viewport. Whichever section is crossing
    // it is the one you are reading.
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting);
        if (hit.length) setActive(hit[0].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const fade = {
    initial: still ? { opacity: 0 } : { opacity: 0, y: -6 },
    animate: still ? { opacity: 1 } : { opacity: 1, y: 0 },
    exit: still ? { opacity: 0 } : { opacity: 0, y: 6 },
    transition: { duration: 0.26, ease: [0.23, 1, 0.32, 1] as const },
  };

  return (
    <header className="site-nav">
      <div className="site-nav-inner">
        <AnimatePresence mode="wait" initial={false}>
          {indexed ? (
            <motion.nav
              key="index"
              {...fade}
              aria-label="Sections"
              className="site-nav-index"
            >
              {SECTIONS.map((s, i) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`site-nav-link ${active === s.id ? "is-on" : ""}`}
                  aria-current={active === s.id ? "true" : undefined}
                >
                  {s.label}
                  <sup>{num(i)}</sup>
                </a>
              ))}
            </motion.nav>
          ) : (
            <motion.div key="brand" {...fade} className="site-nav-brand-row">
              <a href="#hero" className="site-nav-brand">
                <span className="site-nav-dot" aria-hidden />
                Naman Sharma
              </a>

              {/* next/link, not <a>: a plain anchor is a full document load,
                  which re-runs the intro and throws away the router's cache. */}
              <nav aria-label="Elsewhere" className="site-nav-links">
                <Link href="/work">Work</Link>
                <Link href="/blog">Writing</Link>
                <Link href="/desktop">Desktop</Link>
                <Link href="/lab">Lab</Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        <a className="site-nav-cta" href={`mailto:${email}`}>
          Get in touch
        </a>
      </div>
    </header>
  );
}
