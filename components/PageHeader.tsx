import type { ReactNode } from "react";
import BlurReveal from "@/components/BlurReveal";

/**
 * The head of every content page, so /work, /writing and /inspiration open the
 * same way: a mono kicker the way the home page labels things, a medium title,
 * and an optional line under it. Sits on the paper, above the card, so the
 * page reads as titled writing rather than one floating box.
 *
 * The title resolves out of a blur a word at a time. It lives here rather than
 * on each page so every route opens with the same gesture — one place to
 * change if it ever stops being the right one.
 */
export default function PageHeader({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="page-head">
      <p className="page-kicker">
        {kicker}
      </p>
      {/* Held back a beat so it lands after the kicker rather than with it. */}
      {/* The same serif the front page sets its name in, so a reader arriving
          on /work recognises the hand. */}
      <BlurReveal as="h1" text={title} delay={0.08} className="page-title" />
      {children && (
        <p className="page-lede">
          {children}
        </p>
      )}
    </header>
  );
}
