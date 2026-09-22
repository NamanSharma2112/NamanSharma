"use client";

import { motion, useReducedMotion } from "motion/react";
import { useInView } from "@/components/landing/useInView";

/**
 * Text that resolves out of a blur, a word at a time.
 *
 * Words rather than letters: letter-by-letter is a showreel effect, and this
 * site is meant to be quiet. A word arriving slightly after the one before it
 * reads as the line being set, not as an animation being performed.
 *
 * One-shot, on the same observer the signature and the flight-plan legs use —
 * something that resolves should resolve once, where you can see it, and then
 * be text. The blur is the point: it is what makes the word feel like it is
 * coming into focus rather than sliding in from somewhere.
 *
 * Only the animated copy is split. Screen readers get the whole string from a
 * single node, because a heading chopped into a span per word is announced as
 * a list of words.
 */

/** Far enough apart to read as a sequence, close enough to still be one line
    arriving. Emil's 30–80ms window; the top of it, because these are short. */
const STAGGER = 0.055;

export default function BlurReveal({
  text,
  className,
  /** Held back so a title can land after the kicker above it, not with it. */
  delay = 0,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "span" | "h1" | "h2" | "p";
}) {
  const { ref, inView } = useInView<HTMLElement>();
  const still = useReducedMotion();

  if (still) {
    return <Tag className={className}>{text}</Tag>;
  }

  const words = text.split(" ");

  return (
    <Tag ref={ref as never} className={className}>
      <span className="sr-only">{text}</span>

      <span aria-hidden>
        {words.map((word, i) => (
          <span key={`${word}-${i}`}>
            <motion.span
              // Inline-block so the word can be transformed at all — a plain
              // inline box ignores transform and takes no filter height.
              className="inline-block will-change-[transform,filter,opacity]"
              initial={{ opacity: 0, filter: "blur(10px)", y: "0.35em" }}
              animate={
                inView
                  ? { opacity: 1, filter: "blur(0px)", y: 0 }
                  : { opacity: 0, filter: "blur(10px)", y: "0.35em" }
              }
              transition={{
                duration: 0.62,
                delay: delay + i * STAGGER,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              {word}
            </motion.span>
            {/* An ordinary space, outside the inline-block. Inside it, it would
                be trimmed at the box edge; as a non-breaking space the title
                could never wrap, which a long one has to be able to do. */}
            {i < words.length - 1 && " "}
          </span>
        ))}
      </span>
    </Tag>
  );
}
