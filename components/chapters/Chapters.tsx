"use client";

import * as React from "react";

/* `wide` lets a chapter leave the column, for pieces set side by side */
export type Chapter = { label: string; content: React.ReactNode; wide?: boolean };

/**
 * The front page, one chapter at a time.
 *
 * Each chapter fills the screen and only one is in at a time. A scroll
 * gesture, a swipe, a key or a dot moves one chapter: the lines of the one
 * leaving go back into a blur, quickly and all but together, and the lines
 * of the one arriving come out of a blur one after another. A move made
 * while lines are still arriving simply sends the chapter out from
 * wherever its lines have got to.
 */
export function Chapters({ chapters }: { chapters: Chapter[] }) {
  const [at, setAt] = React.useState(0);
  const [shown, setShown] = React.useState(false);
  const [leaving, setLeaving] = React.useState<number | null>(null);
  const [dir, setDir] = React.useState(1);
  const root = React.useRef<HTMLDivElement>(null);
  const now = React.useRef(0);
  const leftTimer = React.useRef(0);

  const go = React.useCallback(
    (next: number) => {
      const target = Math.max(0, Math.min(chapters.length - 1, next));
      const from = now.current;
      if (target === from) return;
      now.current = target;
      setDir(target > from ? 1 : -1);
      setLeaving(from);
      setAt(target);
      setShown(false);
      window.clearTimeout(leftTimer.current);
      leftTimer.current = window.setTimeout(() => setLeaving(null), 600);
      history.replaceState(null, "", target ? `#${target + 1}` : location.pathname);
    },
    [chapters.length],
  );

  /* One frame between, so the browser sees the start state of the lines
     before they are told to arrive. */
  React.useEffect(() => {
    if (shown) return;
    let a = 0;
    const b = requestAnimationFrame(() => (a = requestAnimationFrame(() => setShown(true))));
    return () => {
      cancelAnimationFrame(b);
      cancelAnimationFrame(a);
    };
  }, [shown, at]);

  /* Every line gets its place in the stagger; a chapter's address opens it. */
  React.useEffect(() => {
    root.current?.querySelectorAll(".ch").forEach((ch) => ch.querySelectorAll(".ln").forEach((ln, i) => (ln as HTMLElement).style.setProperty("--i", String(i))));
    const fromHash = () => {
      const n = parseInt(location.hash.slice(1), 10);
      if (Number.isFinite(n)) go(n - 1);
      else go(0);
    };
    if (location.hash) fromHash();
    addEventListener("hashchange", fromHash);
    return () => removeEventListener("hashchange", fromHash);
  }, [go]);

  /* ── wheel and trackpad ─────────────────────────────────────────────
     One gesture, one chapter. A flick is taken once it has moved 30px, and
     after that the wheel is held so a trackpad's long inertial tail cannot
     run on into a second chapter. The hold lets go when the wheel has been
     quiet for 180 ms, and at once on a new gesture: a reversal, after 250 ms
     so the rebound at the end of a tail is not read as one, or a fresh
     flick the same way after 500 ms, since a tail only ever decays. Holding
     until the wheel went quiet alone swallowed a swipe up made while a
     swipe down was still coasting. */
  React.useEffect(() => {
    let acc = 0;
    let locked = false;
    let lockedAt = 0;
    let lockDir = 0;
    let last = 0;
    let quiet = 0;
    const release = () => {
      locked = false;
      acc = 0;
    };
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      const d = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      if (!d) return;
      const since = performance.now() - lockedAt;
      if (locked) {
        const reversed = Math.sign(d) !== lockDir && since > 250;
        const fresh = Math.sign(d) === lockDir && since > 500 && Math.abs(d) > last * 1.6 + 6;
        if (reversed || fresh) release();
        else {
          last = Math.abs(d);
          window.clearTimeout(quiet);
          quiet = window.setTimeout(release, 180);
          return;
        }
      }
      if (acc && Math.sign(acc) !== Math.sign(d)) acc = 0;
      acc += d;
      last = Math.abs(d);
      if (Math.abs(acc) < 30) return;
      lockDir = Math.sign(acc);
      go(now.current + lockDir);
      acc = 0;
      locked = true;
      lockedAt = performance.now();
      window.clearTimeout(quiet);
      quiet = window.setTimeout(release, 900);
    };

    let startY: number | null = null;
    /* A drag on something that is itself dragged, like the work stack's
       front card, is not a swipe between chapters. */
    const touchStart = (e: TouchEvent) => {
      startY = (e.target as Element | null)?.closest?.("[data-no-swipe]") ? null : e.touches[0]!.clientY;
    };
    const touchMove = (e: TouchEvent) => {
      if (startY !== null) e.preventDefault();
    };
    const touchEnd = (e: TouchEvent) => {
      if (startY === null) return;
      const dy = startY - e.changedTouches[0]!.clientY;
      startY = null;
      if (Math.abs(dy) > 40) go(now.current + Math.sign(dy));
    };

    const key = (e: KeyboardEvent) => {
      /* a control that took the key for itself, like the arrows inside a
         radio group, has already said so */
      if (e.defaultPrevented) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest?.("button, a, [data-keys]") && (e.key === " " || e.key === "Enter")) return;
      const step: Record<string, number> = { ArrowDown: 1, PageDown: 1, " ": 1, j: 1, ArrowUp: -1, PageUp: -1, k: -1 };
      const s = step[e.key];
      if (s) {
        e.preventDefault();
        go(now.current + (e.shiftKey && e.key === " " ? -1 : s));
      }
      if (e.key === "Home") {
        e.preventDefault();
        go(0);
      }
      if (e.key === "End") {
        e.preventDefault();
        go(chapters.length - 1);
      }
    };

    addEventListener("wheel", wheel, { passive: false });
    addEventListener("touchstart", touchStart, { passive: true });
    addEventListener("touchmove", touchMove, { passive: false });
    addEventListener("touchend", touchEnd);
    addEventListener("keydown", key);
    return () => {
      window.clearTimeout(quiet);
      removeEventListener("wheel", wheel);
      removeEventListener("touchstart", touchStart);
      removeEventListener("touchmove", touchMove);
      removeEventListener("touchend", touchEnd);
      removeEventListener("keydown", key);
    };
  }, [go, chapters.length]);

  return (
    <div ref={root} className="chapters" style={{ "--dir": dir } as React.CSSProperties}>
      <main className="stage">
        {chapters.map((c, i) => {
          const live = i === at;
          const cls = live && shown ? "ch is-in" : i === leaving && !live ? "ch is-out" : live ? "ch is-live" : "ch";
          return (
            <section key={c.label} className={cls} aria-label={c.label} aria-hidden={!live} inert={!live}>
              <div className={c.wide ? "copy copy-wide" : "copy"}>{c.content}</div>
            </section>
          );
        })}
      </main>
      <div className="dots" role="group" aria-label="Chapters">
        {chapters.map((c, i) => (
          <button
            key={c.label}
            type="button"
            aria-label={`${c.label}, chapter ${i + 1} of ${chapters.length}`}
            aria-current={i === at ? "step" : undefined}
            onClick={() => go(i)}
          />
        ))}
      </div>
      <div className="count" aria-hidden="true">
        {at + 1} / {chapters.length}
      </div>
    </div>
  );
}
