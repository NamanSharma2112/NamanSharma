"use client";

import { useEffect, useRef, useState } from "react";
import Shredder from "@/components/reactbits/Shredder";

export type Project = {
  id: string;
  role: string;
  name: string;
  note: string;
  href: string;
  cta: string;
};

/**
 * The work, as a stack you can pick up and put back in whatever order you
 * like.
 *
 * It is React Bits' Shredder with its rollers switched off. The machine
 * underneath is a good one — a row lifts and leans as you carry it, the rows
 * below slide out of the way and spring back — and none of that depends on
 * the part that destroys things, which is not an interaction this page wants
 * to offer for someone's work.
 *
 * The order lives here and nowhere else, so it lasts as long as the visit.
 * Nothing is saved: it is a thing to play with, not a setting.
 */
export default function Work({ projects }: { projects: readonly Project[] }) {
  const [rows, setRows] = useState<Project[]>([...projects]);

  /* The rows are absolutely positioned and stack up from the bottom of the
     box, so the box has to be told how tall they come to — and that is not
     something to guess at. A note wraps to two lines at this width and one at
     the next, which moved the whole stack 150px up over the heading when the
     number was hardcoded. Measured instead, and re-measured when the column
     changes width. */
  const box = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(ROW * projects.length + GAP * (projects.length - 1));

  useEffect(() => {
    const list = box.current?.querySelector<HTMLElement>(".shredder__list");
    if (!list) return;
    const measure = () => {
      // The list is anchored to the bottom of the box, so anything the box is
      // short by the rows take out of the top — over the heading above them.
      // That includes the last row's trailing gap, so it counts too.
      const h = Math.ceil(list.getBoundingClientRect().height);
      if (h > 0) setHeight((was) => (Math.abs(was - h) > 1 ? h : was));
    };
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    measure();
    return () => ro.disconnect();
  }, []);

  return (
    <div className="home-work" ref={box}>
      <Shredder
        items={rows}
        onReorder={setRows}
        shred={false}
        // Wider than the column: the CSS caps it at 100%, so this just means
        // "as wide as there is room for".
        width={900}
        height={height}
        inset={0}
        gap={GAP}
        dragTilt={5}
        lift={1.015}
        renderItem={(p) => (
          <a
            className="home-item"
            href={p.href}
            target={p.href.startsWith("http") ? "_blank" : undefined}
            rel={p.href.startsWith("http") ? "noopener noreferrer" : undefined}
            // The row owns the pointer while it is being dragged. Without
            // this, letting go after a drag also counts as a click and the
            // project opens in a new tab.
            onClick={(e) => {
              if (e.currentTarget.closest("[data-state='drag']")) e.preventDefault();
            }}
          >
            <p className="home-item-role">{p.role}</p>
            <p className="home-item-name">{p.name}</p>
            <p className="home-item-note">{p.note}</p>
            <span className="home-item-go">
              {p.cta}
              <Arrow />
            </span>
          </a>
        )}
      />
    </div>
  );
}

/** A first guess at one row, only until the real ones have been measured. */
const ROW = 150;
const GAP = 12;

function Arrow() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h13M12.5 5.5 19 12l-6.5 6.5" />
    </svg>
  );
}
