"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * A small notebook lying open on the page, that you can turn the pages of.
 *
 * It is an object on the desk rather than a section of the site: set at an
 * angle, sized like something you would actually put down next to a laptop,
 * and it does nothing until you touch it.
 *
 * The 3D is real rather than drawn. Each leaf is one element with a front and a
 * back, hinged on the spine and rotated about Y; the back face is pre-rotated
 * 180deg so it reads the right way round once the leaf has turned. Faces hide
 * their own backs, so a leaf mid-turn shows one side at a time the way paper
 * does.
 *
 * Stacking is the part that has to be right: an unturned leaf sits above the
 * ones behind it, and a turned one sits above the ones already turned, so the
 * order reverses as each page goes over. Getting this wrong is what makes a CSS
 * book look like it is turning its pages in the wrong order.
 */

/** Placeholder copy — swap these for your own notes. Four leaves, eight sides,
    front and back of each. Keep the lines short; the page is 150px wide. */
const LEAVES = [
  {
    front: { title: "Field notes", body: "Things worth keeping, in the order I learned them." },
    back: { title: "01", body: "Ship the boring version first. It tells you what the interesting one should have been." },
  },
  {
    front: { title: "02", body: "If it moves, it should be interruptible. Anything else is a cutscene." },
    back: { title: "03", body: "Measure it in the browser. Reading the code tells you what you meant." },
  },
  {
    front: { title: "04", body: "Taste is mostly restraint — deciding what not to put on the page." },
    back: { title: "05", body: "The detail nobody names is the one doing the work." },
  },
  {
    front: { title: "06", body: "Build the thing you keep rebuilding. Twice is a habit, three times is a library." },
    back: { title: "Back", body: "Turn back to start again." },
  },
];

export default function PerspectiveBook({ className }: { className?: string }) {
  const [turned, setTurned] = useState(0);
  const still = useReducedMotion();
  const last = LEAVES.length;

  const go = (d: number) =>
    setTurned((t) => Math.min(last, Math.max(0, t + d)));

  return (
    <div className={className}>
      <div className="book-stage">
        <div className="book">
          {/* The sheaf underneath, so the open book has thickness rather than
              being two rectangles meeting at a line. */}
          <span className="book-block book-block-l" aria-hidden />
          <span className="book-block book-block-r" aria-hidden />

          {LEAVES.map((leaf, i) => {
            const isTurned = i < turned;
            return (
              <motion.div
                key={i}
                className="book-leaf"
                style={{
                  // Turned leaves stack upward in turn order; unturned ones
                  // stack downward, so the top of each pile is the one you see.
                  zIndex: isTurned ? i : last - i,
                }}
                initial={false}
                animate={{ rotateY: isTurned ? -178 : 0 }}
                transition={
                  still
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 120, damping: 20, mass: 0.9 }
                }
              >
                <Face side="front" {...leaf.front} />
                <Face side="back" {...leaf.back} />
              </motion.div>
            );
          })}

          {/* The hit areas. Buttons rather than a click handler on the book, so
              the thing is reachable by keyboard and says what it does. */}
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={turned === 0}
            aria-label="Previous page"
            className="book-hit book-hit-l"
          />
          <button
            type="button"
            onClick={() => go(1)}
            disabled={turned === last}
            aria-label="Next page"
            className="book-hit book-hit-r"
          />
        </div>
      </div>

      <p className="book-caption">
        Field notes · {turned === last ? "start over" : "turn a page"}
      </p>
    </div>
  );
}

function Face({
  side,
  title,
  body,
}: {
  side: "front" | "back";
  title: string;
  body: string;
}) {
  return (
    <div className={`book-face book-face-${side}`}>
      <p className="book-face-title">{title}</p>
      <p className="book-face-body">{body}</p>
      <span className="book-rule" aria-hidden />
    </div>
  );
}
