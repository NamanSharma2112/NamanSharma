import type { ReactNode } from "react";
import BlurReveal from "@/components/BlurReveal";

/**
 * The head of every content page, so /work, /writing and /inspiration open the
 * same way: the title at the same display size the front page sets its name
 * in, and an optional line under it. Sits on the paper, above the card, so the
 * page reads as titled writing rather than one floating box.
 *
 * There used to be a small label above the title naming the section — "Work"
 * over "Selected work". It said the same thing twice, smaller the first time,
 * and the title does the job on its own.
 *
 * The title resolves out of a blur a word at a time. It lives here rather than
 * on each page so every route opens with the same gesture — one place to
 * change if it ever stops being the right one.
 */
export default function PageHeader({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="page-head">
      {/* The same serif the front page sets its name in, so a reader arriving
          on /work recognises the hand. */}
      <BlurReveal as="h1" text={title} className="page-title" />
      {children && (
        <p className="page-lede">
          {children}
        </p>
      )}
    </header>
  );
}
