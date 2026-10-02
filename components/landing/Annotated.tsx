"use client";

import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * A word in a sentence that has something behind it.
 *
 * A small mark sits in front of the word — that is the whole affordance. Hover
 * it, or tab to it, and a card lifts out of the word with a pointer still
 * attached to it, so the card reads as belonging to that word rather than
 * floating near it.
 *
 * It is a button, not a span with a mouse handler: the card is content, and
 * content you can only reach with a pointer is content half the people
 * reading cannot reach at all. Focus opens it, Escape closes it.
 *
 * The word stays in the flow of the sentence — inline-block, so the card can be
 * positioned against it without the line breaking around a block.
 */
export default function Annotated({
  children,
  card,
  /** Widens the card for something that needs the room, like a screenshot. */
  wide = false,
}: {
  children: ReactNode;
  card: ReactNode;
  wide?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const still = useReducedMotion();
  const id = `anno-${useId().replace(/:/g, "")}`;

  return (
    <span className="anno">
      <span className="anno-mark" aria-hidden />
      <button
        type="button"
        className="anno-word"
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        // Tapping toggles it, so the card is reachable without a pointer that
        // can hover.
        onClick={() => setOpen((v) => !v)}
      >
        {children}
      </button>

      <AnimatePresence>
        {open && (
          <motion.span
            id={id}
            role="tooltip"
            className={`anno-card ${wide ? "is-wide" : ""}`}
            // Out of the bottom of the card, which is the edge the pointer is
            // on — so it grows from the word rather than from its own middle.
            style={{ transformOrigin: "bottom center" }}
            initial={still ? { opacity: 0 } : { opacity: 0, scale: 0.88, y: 10 }}
            animate={still ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={still ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 6 }}
            transition={
              still
                ? { duration: 0.12 }
                : { type: "spring", stiffness: 300, damping: 22, mass: 0.6 }
            }
          >
            <span className="anno-card-inner">{card}</span>
            <span className="anno-tail" aria-hidden />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
